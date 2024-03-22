import Client, { SearchParams } from "fhir-kit-client";
import FhirType from "./Utils/Fhirtypes";

import {
  Bundle,
  OperationOutcome,
  FhirResource,
  CodeableConcept,
} from "fhir/r4";

export default class FhirResourceService<T extends FhirResource> {
  public resourceTypeName: string;

  public apiUrl: string;
  public fhirClient: Client;

  private _resourceBundle: Bundle;

  public hasNextPage: boolean = false;
  public hasPrevPage: boolean = false;

  public constructor(type: FhirType) {
    this.apiUrl =
      import.meta.env.VITE_API_URL || "https://hapi.fhir.org/baseR4";
    this.fhirClient = new Client({ baseUrl: this.apiUrl });
    this._resourceBundle = {} as Bundle;
    this.resourceTypeName = type;
  }

  private handleResult<T>(result: Promise<T>): Promise<Result<T>> {
    return result
      .then((data: T) => {
        return { success: true, data } as Result<T>;
      })
      .catch((error: any) => {
        console.error(error);
        return {
          success: false,
          error:
            this.parseOperationOutcome(error.response?.data) || error.message,
        } as Result<T>;
      });
  }

  private setNewPages(response: Bundle) {
    this.hasNextPage = !!response.link?.find((link) => link.relation === "next")
      ?.url;
    this.hasPrevPage = !!response.link?.find(
      (link) => link.relation === "previous"
    )?.url;
  }

  public async getById(id: string): Promise<Result<T>> {
    return this.handleResult<T>(
      this.fhirClient.read({
        resourceType: this.resourceTypeName,
        id: id,
      }) as Promise<T>
    );
  }

  public async getHistoryById(id: string): Promise<Result<T[]>> {
    const result = await this.handleResult<Bundle>(
      this.fhirClient.history({
        resourceType: this.resourceTypeName,
        id: id,
      }) as Promise<Bundle>
    );

    if (result.success) {
      const resources =
        result.data.entry?.map((entry) => entry.resource as T) || [];
      return { success: true, data: resources };
    } else {
      return { success: false, error: result.error };
    }
  }

  public async postResource(newResource: T): Promise<Result<T>> {
    return this.handleResult<T>(
      this.fhirClient.create({
        resourceType: this.resourceTypeName,
        body: newResource,
      }) as Promise<T>
    );
  }

  private bundleAction(
    objeto: any
  ): "POST" | "PUT" | "DELETE" | "GET" | "PATCH" {
    // Verificar que "id" y "resourceType" tengan valores
    const idResourceTypeLlenos =
      objeto.id !== undefined && objeto.resourceType !== undefined;

    // Verificar que el resto de los atributos estén vacíos o indefinidos
    const restoAtributosVaciosOIndefinidos = Object.keys(objeto).every(
      (key) =>
        key === "id" ||
        key === "resourceType" ||
        objeto[key] === null ||
        objeto[key] === undefined ||
        objeto[key] === ""
    );

    // Devolver true si "id" y "resourceType" tienen valores y el resto está vacío o indefinido
    if (idResourceTypeLlenos && restoAtributosVaciosOIndefinidos)
      return "DELETE";
    else if (objeto.id) return "PUT";
    else return "POST";
  }
  private resourceUrl(
    resource: FhirResource,
    method: "POST" | "PUT" | "DELETE" | "GET" | "PATCH"
  ): string {
    return method === "POST"
      ? resource.resourceType
      : `${resource.resourceType}/${resource.id}`;
  }

  /**
   *
   * @param newResources Arreglo del recurso,
   *  este se encarga de enviarlo como un bundle.
   *
   * Condiciones:
   *
   * sólo @id y @resourceType elimina el recurso,
   * si tiene @id actualiza el recurso,
   * en caso de que el @id no existe, lo añade.
   * @returns
   */
  public async sendArray(newResources: T[]): Promise<Result<T>> {
    const result = await this.handleResult(
      this.fhirClient.transaction({
        body: {
          resourceType: "Bundle",
          type: "transaction",
          entry: newResources.map((resource) => {
            const method = this.bundleAction(resource); //TODO: verificar aquí para los casos de actualizar y eliminar
            const request = {
              method: method,
              url: this.resourceUrl(resource, method),
            };
            return { resource, request };
          }),
        },
      })
    );

    if (result.success) {
      return { success: true, data: {} as T };
    } else {
      return { success: false, error: result.error };
    }
  }

  public async updateResource(newResource: T): Promise<Result<T>> {
    return this.handleResult<T>(
      this.fhirClient.update({
        resourceType: this.resourceTypeName,
        id: newResource.id,
        body: newResource,
      }) as Promise<T>
    );
  }

  public async sendResource(newResource: T): Promise<Result<T>> {
    return newResource.id
      ? this.updateResource(newResource)
      : this.postResource(newResource);
  }

  //TODO: Verificar el count para posibles recursos donde pueden ser muchos y no he aplicado el NextPage o PrevPage
  public async getResources(params?: SearchParams): Promise<Result<T[]>> {
    const result = await this.handleResult<Bundle>(
      this.fhirClient.search({
        resourceType: this.resourceTypeName,
        searchParams: {
          ...params,
          _sort: "-_lastUpdated",
          _count: params?._count ?? 10,
        },
      }) as Promise<Bundle>
    );

    if (result.success) {
      const response = result.data;
      this._resourceBundle = response;
      this.setNewPages(response);
      const resources =
        response.entry?.map((entry) => entry.resource as T) || [];
      return { success: true, data: resources };
    } else {
      return { success: false, error: result.error };
    }
  }

  public async getNewResources(
    direction: "next" | "prev"
  ): Promise<Result<T[]>> {
    const response = await this.handleResult<Bundle>(
      direction === "next"
        ? (this.fhirClient.nextPage({
            bundle: this._resourceBundle,
          }) as Promise<Bundle>)
        : (this.fhirClient.prevPage({
            bundle: this._resourceBundle,
          }) as Promise<Bundle>)
    );
    if (!response.success) return response;

    this._resourceBundle = response.data;
    this.setNewPages(response.data);

    const resources =
      response.data.entry?.map((entry) => entry.resource as T) || [];
    return { success: true, data: resources };
  }

  private parseOperationOutcome(operation: OperationOutcome): string {
    return operation.issue[0]?.diagnostics || "Unknown error";
  }

  public getCodingBySystem(code: CodeableConcept, system: string) {
    const coding = code.coding;
    if (!coding || coding.length === 0) return null;
    const section = coding.find((e) => e.system === system) || null;
    return section;
  }
}
