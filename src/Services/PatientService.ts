import Client from "fhir-kit-client";
import { Patient, Bundle} from "fhir/r4";

export default class PatientService {
  public apiUrl: string;
  private static instance: PatientService;
  private fhirClient: Client;

  private _patientBundle: Bundle;

  public hasNextPage: boolean = false;
  public hasPrevPage: boolean = false;

  private constructor() {
    this.apiUrl =
    import.meta.env.VITE_API_URL || "https://hapi.fhir.org/baseR4";
    //this.apiUrl = "https://hapi.fhir.org/baseR4";
    //this.apiUrl = "https://castudillo-hapi.darknacho.xyz/fhir/"
    this.fhirClient = new Client({ baseUrl: this.apiUrl });
    this._patientBundle = {} as Bundle;
  }

  public static getInstance(): PatientService {
    if (!PatientService.instance) {
      PatientService.instance = new PatientService();
    }
    return PatientService.instance;
  }

  private handleResult<T>(result: Promise<T>): Promise<Result<T>> {
    return result
      .then((data: T) => {
        return { success: true, data } as Result<T>;
      })
      .catch((error: any) => {
        return {
          success: false,
          error: error.message || "Unknown error",
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

  public async getById(id: string): Promise<Result<Patient>> {
    return this.handleResult<Patient>(
      this.fhirClient.read({
        resourceType: "Patient",
        id: id,
      }) as Promise<Patient>
    );
  }

  public async postPatient(newPatient: Patient): Promise<Result<Patient>> {
    return this.handleResult<Patient>(
      this.fhirClient.create({
        resourceType: "Patient",
        body: newPatient,
      }) as Promise<Patient>
    );
  }

  public async getPatients(
    count?: number,
    content?: string
  ): Promise<Result<Patient[]>> {
    const result = await this.handleResult<Bundle>(
      this.fhirClient.search({
        resourceType: "Patient",
        searchParams: {
          _count: count || 5,
          ...(content && { _content: content }),
        },
      }) as Promise<Bundle>
    );

    if (result.success) {
      const response = result.data;
      this._patientBundle = response;
      this.setNewPages(response);
      const patients =
        response.entry?.map((entry) => entry.resource as Patient) || [];
      return { success: true, data: patients };
    } else {
      return { success: false, error: result.error };
    }
  }

  public async getNewPatients(direction: "next" | "prev"): Promise<Result<Patient[]>>
  {
    const response = await this.handleResult<Bundle>(
      direction === "next"
        ? this.fhirClient.nextPage({ bundle: this._patientBundle }) as Promise<Bundle>
        : this.fhirClient.prevPage({ bundle: this._patientBundle }) as Promise<Bundle>
    );
    if(!response.success) return response

    this._patientBundle = response.data;
    this.setNewPages(response.data);

    const patients = response.data.entry?.map( entry => entry.resource as Patient) || [];
    return { success: true, data: patients };
  }

  public async getNextPage(): Promise<Result<Patient[]>>
  {
    const response = await this.handleResult<Bundle>(
      this.fhirClient.nextPage({
        bundle: this._patientBundle
      }) as Promise<Bundle>
    );
    if(!response.success) return response

    this._patientBundle = response.data;
    this.setNewPages(response.data);

    const patients = response.data.entry?.map( entry => entry.resource as Patient) || [];
    return { success: true, data: patients };
  }

  public async getPrevPage(): Promise<Result<Patient[]>>
  {
    const response = await this.handleResult<Bundle>(
      this.fhirClient.prevPage({
        bundle: this._patientBundle
      }) as Promise<Bundle>
    );
    if(!response.success) return response

    this._patientBundle = response.data;
    this.setNewPages(response.data);

    const patients = response.data.entry?.map( entry => entry.resource as Patient) || [];
    return { success: true, data: patients };
  }

  public parsePatientName(patient: Patient) {
    let name = "";

    // Intenta obtener el nombre usando patient.name[0].text
    if (patient.name && patient.name[0] && patient.name[0].text) {
      name = patient.name[0].text;
    } else if (patient.name && patient.name[0]) {
      // Intenta obtener el nombre usando patient.name[0].given y patient.name[0].family
      const givenNames = patient.name[0].given
        ? patient.name[0].given.join(" ")
        : "";
      const familyName = patient.name[0].family ? patient.name[0].family : "";
      name = `${givenNames} ${familyName}`;
    } else if (
      patient.name &&
      patient.name[0] &&
      patient.name[0].use === "official"
    ) {
      // Intenta obtener el nombre usando patient.name[0].prefix, patient.name[0].given y patient.name[0].family
      const prefix = patient.name[0].prefix
        ? patient.name[0].prefix.join(" ")
        : "";
      const givenNames = patient.name[0].given
        ? patient.name[0].given.join(" ")
        : "";
      const familyName = patient.name[0].family ? patient.name[0].family : "";
      name = `${prefix} ${givenNames} ${familyName}`;
    }

    return name;
  }
  public calcularEdad(fechaNacimiento: string) {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    return edad;
  }

  public obtenerPrimerNumeroTelefono(recurso: Patient) {
    if (recurso && recurso.telecom && Array.isArray(recurso.telecom)) {
      const numeroTelefono = recurso.telecom.find(
        (contacto) => contacto.system === "phone" && contacto.value
      );
      if (numeroTelefono) {
        return numeroTelefono.value;
      }
    }
    return "no phone";
  }
}
