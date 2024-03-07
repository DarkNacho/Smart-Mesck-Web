import { Patient} from "fhir/r4";
import FhirResourceService from "./FhirService";

export default class PatientService extends FhirResourceService<Patient>{
  constructor()
  {
    super("Patient");
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
    return "N/A";
  }

  public getFirstIdentifierOrId(patient: Patient): string {
    if (patient.identifier && patient.identifier.length > 0) {
      // Devuelve el valor del primer identificador si existe
      return patient.identifier[0].value || patient.id || '';
    } else {
      // Si no hay identificadores, devuelve el ID del paciente
      return patient.id || '';
    }
  }
  
}
