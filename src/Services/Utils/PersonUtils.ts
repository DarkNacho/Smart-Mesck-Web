import { Patient, Person, Practitioner } from "fhir/r4";

type FhirResourceType = Patient | Practitioner | Person;

/**
 * Utility class for working with person-related resources.
 */
export default class PersonUtil {
  /**
   * Retrieves the person's name as a string.
   * @param resource - The FHIR resource representing a person.
   * @returns The person's name as a string.
   */
  static getPersonNameAsString(resource: FhirResourceType): string {
    let name = "";

    // Try to get the name using resource.name[0].text
    if (resource.name && resource.name[0] && resource.name[0].text) {
      name = resource.name[0].text;
    } else if (resource.name && resource.name[0]) {
      // Try to get the name using resource.name[0].given and resource.name[0].family
      const givenNames = resource.name[0].given
        ? resource.name[0].given.join(" ")
        : "";
      const familyName = resource.name[0].family ? resource.name[0].family : "";
      name = `${givenNames} ${familyName}`;
    } else if (// eslint-disable-next-line no-dupe-else-if
      resource.name &&
      resource.name[0] &&
      resource.name[0].use === "official"
    ) {
      // Try to get the name using resource.name[0].prefix, resource.name[0].given, and resource.name[0].family
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

  /**
   * Calculates the age based on the given date of birth.
   * @param fechaNacimiento - The date of birth in string format.
   * @returns The calculated age.
   */
  static calcularEdad(fechaNacimiento: string): number {
    const hoy = new Date();
    const fechaNac = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    return edad;
  }

  /**
   * Retrieves the first contact point of the specified system as a string.
   * @param recurso - The FHIR resource representing a person.
   * @param system - The contact point system to retrieve (e.g., 'phone', 'email').
   * @returns The first contact point of the specified system as a string, or 'N/A' if not found.
   */
  static getContactPointFirstOrDefaultAsString(
    recurso: FhirResourceType,
    system: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other'
  ): string {
    if (recurso && recurso.telecom && Array.isArray(recurso.telecom)) {
      const contactPoint = recurso.telecom.find(
        (contacto) => contacto.system === system && contacto.value
      );
      if (contactPoint) {
        return contactPoint.value || "N/A";
      }
    }
    return "N/A";
  }

  /**
   * Retrieves the first identifier or ID of the resource as a string.
   * @param resource - The FHIR resource representing a person.
   * @returns The first identifier value or ID of the resource as a string.
   */
  static getFirstIdentifierOrId(resource: FhirResourceType): string {
    if (resource.identifier && resource.identifier.length > 0) {
      // Return the value of the first identifier if it exists
      return resource.identifier[0].value || resource.id || "";
    } else {
      // If there are no identifiers, return the ID of the resource
      return resource.id || "";
    }
  }
}
