import { FhirResource, Patient, Practitioner } from "fhir/r4";

export default class PersonUtil {
  static parsePersonName(resource: FhirResource) {
    let name = "";

    if (Object.keys(resource).length === 0) return "";
    if (resource.resourceType === "Patient") resource = resource as Patient;
    else if (resource.resourceType === "Practitioner")
      resource = resource as Practitioner;
    else throw new Error("No es paciente o practitioner");

    // Intenta obtener el nombre usando resource.name[0].text
    if (resource.name && resource.name[0] && resource.name[0].text) {
      name = resource.name[0].text;
    } else if (resource.name && resource.name[0]) {
      // Intenta obtener el nombre usando resource.name[0].given y resource.name[0].family
      const givenNames = resource.name[0].given
        ? resource.name[0].given.join(" ")
        : "";
      const familyName = resource.name[0].family ? resource.name[0].family : "";
      name = `${givenNames} ${familyName}`;
    } else if (
      // eslint-disable-next-line no-dupe-else-if
      resource.name &&
      resource.name[0] &&
      resource.name[0].use === "official"
    ) {
      // Intenta obtener el nombre usando resource.name[0].prefix, resource.name[0].given y resource.name[0].family
      const prefix = resource.name[0].prefix
        ? resource.name[0].prefix.join(" ")
        : "";
      const givenNames = resource.name[0].given
        ? resource.name[0].given.join(" ")
        : "";
      const familyName = resource.name[0].family ? resource.name[0].family : "";
      name = `${prefix} ${givenNames} ${familyName}`;
    }

    return name;
  }

  static calcularEdad(fechaNacimiento: string) {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    return edad;
  }

  static obtenerPrimerNumeroTelefono(recurso: FhirResource) {
    if (Object.keys(recurso).length === 0) return "";
    if (recurso.resourceType === "Patient") recurso = recurso as Patient;
    else if (recurso.resourceType === "Practitioner")
      recurso = recurso as Practitioner;
    else throw new Error("No es paciente o practitioner");

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

  static getFirstIdentifierOrId(resource: FhirResource): string {
    if (Object.keys(resource).length === 0) return "";
    if (resource.resourceType === "Patient") resource = resource as Patient;
    else if (resource.resourceType === "Practitioner")
      resource = resource as Practitioner;
    else throw new Error("No es paciente o practitioner");

    if (resource.identifier && resource.identifier.length > 0) {
      // Devuelve el valor del primer identificador si existe
      return resource.identifier[0].value || resource.id || "";
    } else {
      // Si no hay identificadores, devuelve el ID del paciente
      return resource.id || "";
    }
  }
}
