import Client from "fhir-kit-client";
import { Patient, Bundle, FhirResource } from "fhir/r4";

export default class PatientService {
  public apiUrl: string;
  private static instance: PatientService;
  private fhirClient: Client;

  private _patientBundle: Bundle;

  public hasNextPage: boolean = false;
  public hasPrevPage: boolean = false;

  private constructor() {
    this.apiUrl = "https://hapi.fhir.org/baseR4";
    this.fhirClient = new Client({ baseUrl: this.apiUrl });
    this._patientBundle = {} as Bundle;
  }

  public static getInstance(): PatientService {
    if (!PatientService.instance) {
      PatientService.instance = new PatientService();
    }
    return PatientService.instance;
  }

  private setNewPages(response: Bundle) {
    this.hasNextPage = !!response.link?.find((link) => link.relation === "next")
      ?.url;
    this.hasPrevPage = !!response.link?.find(
      (link) => link.relation === "previous"
    )?.url;
  }

  public async getById(id: string): Promise<Patient> {
    return (await this.fhirClient.read({
      resourceType: "Patient",
      id: id,
    })) as Patient;
  }

  public async postPatient(newPatient: Patient) 
  {
    console.log("paciente a postear", newPatient);
    this.fhirClient.create({resourceType: "Patient", body: newPatient}).then(res => console.log("respuesta paciente posteado", res));

  }

  public async getPatients(count?: number): Promise<Patient[]> {
    const searchParams: { _count: number } = { _count: count || 5 };
    const response = (await this.fhirClient.search({
      resourceType: "Patient",
      searchParams: searchParams,
    })) as Bundle;
    this._patientBundle = response;
    this.setNewPages(response);
    return response.entry?.map((entry) => entry.resource as Patient) || [];
  }

  public async getNextPage(): Promise<Patient[]> {
    const response = (await this.fhirClient.nextPage({
      bundle: this._patientBundle,
    })) as Bundle;
    this._patientBundle = response;
    this.setNewPages(response);
    return response.entry?.map((entry) => entry.resource as Patient) || [];
  }

  public async getPrevPage(): Promise<Patient[]> {
    const response = (await this.fhirClient.prevPage({
      bundle: this._patientBundle,
    })) as Bundle;
    this._patientBundle = response;
    this.setNewPages(response);
    return response.entry?.map((entry) => entry.resource as Patient) || [];
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
