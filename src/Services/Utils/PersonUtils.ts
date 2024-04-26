import { Patient, Person, Practitioner } from "fhir/r4";
import { PatientFormData } from "../../Components/Forms/PatientStepperForm";
import dayjs from "dayjs";

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
    } else if (
      // eslint-disable-next-line no-dupe-else-if
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
    if (!fechaNacimiento) return 0;
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
    system: "phone" | "fax" | "email" | "pager" | "url" | "sms" | "other"
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

  /**
   * Retrieves the marital status of a patient.
   *
   * @param resource - The patient resource.
   * @returns The marital status of the patient, or "N/A" if not available.
   */
  static getMaritalStatus(resource: Patient): string {
    if (
      resource &&
      resource.maritalStatus &&
      resource.maritalStatus.coding &&
      resource.maritalStatus.coding.length > 0
    ) {
      return (
        resource.maritalStatus.coding[0].display ||
        resource.maritalStatus.coding[0].code ||
        "das"
      );
    } else if (
      resource &&
      resource.maritalStatus &&
      resource.maritalStatus.text
    ) {
      return resource.maritalStatus.text;
    }
    return "N/A";
  }

  /**
   * Validates a Chilean RUT (Rol Único Tributario) number.
   * @param rut - The RUT number to validate.
   * @returns A boolean indicating whether the RUT is valid or not.
   */
  static RutValidation = (rut: string) => {
    // Eliminar puntos y guiones del RUT y convertir la letra a mayúscula
    rut = rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();

    // Extraer dígito verificador y número
    const dv = rut.slice(-1);
    let rutNumerico = parseInt(rut.slice(0, -1), 10);

    // Calcular dígito verificador esperado
    let m = 0;
    let s = 1;
    for (; rutNumerico; rutNumerico = Math.floor(rutNumerico / 10)) {
      s = (s + (rutNumerico % 10) * (9 - (m++ % 6))) % 11;
    }

    const dvEsperado = (s ? s - 1 : "K").toString();

    // Verificar si el dígito verificador es correcto
    return dv === dvEsperado;
  };

  /**
   * Retrieves the gender of a person.
   *
   * @param resource - The FHIR resource representing a person.
   * @returns The gender of the person, or "N/A" if not available.
   */
  static getGender(resource: FhirResourceType): string {
    if (resource.gender === undefined) return "N/A";

    const genderMap: Record<string, string> = {
      male: "masculino",
      female: "femenino",
      other: "otro",
      unknown: "desconocido",
    };
    return genderMap[resource.gender] || "N/A";
  }

  static PatientFormToPatient = (data: PatientFormData): Patient => {
    const rut = data.rut.replace(/\./g, "").replace(/-/g, "").toUpperCase();
    return {
      resourceType: "Patient",
      identifier: [{ system: "RUT", value: rut }],
      name: [
        {
          family: data.apellidoPaterno,
          given: [data.nombre, data.segundoNombre],
          suffix: [data.apellidoMaterno],
          text: `${data.nombre} ${data.segundoNombre} ${data.apellidoPaterno} ${data.apellidoMaterno}`,
        },
      ],
      birthDate: data.fechaNacimiento.toISOString(),
      gender: data.genero as "male" | "female" | "other" | "unknown",
      telecom: [
        {
          system: "phone",
          value: data.countryCode + "-" + data.numeroTelefonico,
        },
        { system: "email", value: data.email },
      ],
      maritalStatus: {
        coding: data.maritalStatus ? [data.maritalStatus] : undefined,
      },
      photo: [{ url: data.photo }],
    };
  };

  static PatientToPatientForm = (patient: Patient): PatientFormData => {
    const rut =
      patient.identifier?.find((t) => t.system === "RUT")?.value || "";
    const name = patient.name?.[0] ?? {};
    const telecomPhone =
      patient.telecom?.find((t) => t.system === "phone")?.value || "";
    const telecomEmail =
      patient.telecom?.find((t) => t.system === "email")?.value || "";

    const tel = telecomPhone.split("-");
    let country = "+56";
    let phone = "";
    if (tel.length > 1) {
      country = tel[0];
      phone = tel[1];
    }
    return {
      rut: rut,
      nombre: name.given?.[0] ?? "",
      segundoNombre: name.given?.[1] ?? "",
      apellidoPaterno: name.family || "",
      apellidoMaterno: name.suffix ? name.suffix[0] : "",
      fechaNacimiento: patient.birthDate
        ? dayjs(patient.birthDate)
        : dayjs().subtract(18, "years"),
      genero: patient.gender || "unknown",
      countryCode: country,
      numeroTelefonico: phone,
      email: telecomEmail || "",
      maritalStatus: patient.maritalStatus?.coding?.[0] || {},
      photo: patient.photo?.[0].url || "",
      contact: [],
    };
  };
}
