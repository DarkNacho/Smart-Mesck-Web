import Client from "fhir-kit-client";
import { Bundle, OperationOutcome, FhirResource } from "fhir/r4";

export default class FhirResourceService<T extends FhirResource> {
  public apiUrl: string;
  private static instance: FhirResourceService<any>;
  private fhirClient: Client;
  private static resourceType: string; // Atributo estático para almacenar el tipo de recurso

  private _resourceBundle: Bundle;

  public hasNextPage: boolean = false;
  public hasPrevPage: boolean = false;

  private constructor() {
    this.apiUrl =
      import.meta.env.VITE_API_URL || "https://hapi.fhir.org/baseR4";
    this.fhirClient = new Client({ baseUrl: this.apiUrl });
    this._resourceBundle = {} as Bundle;
  }

  public static getInstance<T extends FhirResource>(
    resourceType: string
  ): FhirResourceService<T> {
    if (!FhirResourceService.instance) {
      FhirResourceService.instance = new FhirResourceService<T>();
    }
    FhirResourceService.resourceType = resourceType;
    return FhirResourceService.instance as FhirResourceService<T>;
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
    this.hasNextPage = !!response.link?.find(
      (link) => link.relation === "next"
    )?.url;
    this.hasPrevPage = !!response.link?.find(
      (link) => link.relation === "previous"
    )?.url;
  }

  public async getById(id: string): Promise<Result<T>> {
    return this.handleResult<T>(
      this.fhirClient.read({
        resourceType: FhirResourceService.resourceType,
        id: id,
      }) as Promise<T>
    );
  }

  public async postResource(newResource: T): Promise<Result<T>> {
    return this.handleResult<T>(
      this.fhirClient.create({
        resourceType: FhirResourceService.resourceType,
        body: newResource,
      }) as Promise<T>
    );
  }

  public async getResources(
    count?: number,
    content?: string
  ): Promise<Result<T[]>> {
    const result = await this.handleResult<Bundle>(
      this.fhirClient.search({
        resourceType: FhirResourceService.resourceType,
        searchParams: {
          _count: count || 5,
          ...(content && { _content: content }),
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
        ? this.fhirClient.nextPage({
            bundle: this._resourceBundle,
          }) as Promise<Bundle>
        : this.fhirClient.prevPage({
            bundle: this._resourceBundle,
          }) as Promise<Bundle>
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
}
