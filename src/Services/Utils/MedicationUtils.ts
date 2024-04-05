import { MedicationStatement } from "fhir/r4";

export default class MedicationUtils {
  public static extractMedicationInfo(
    medications: MedicationStatement[]
  ): { name: string; value: string }[] {
    return medications.map((medication) => {
      const name =
        medication.medicationCodeableConcept?.coding?.[0]?.display ||
        medication.medicationCodeableConcept?.text ||
        (medication.medicationCodeableConcept?.coding?.[0]?.system &&
        medication.medicationCodeableConcept?.coding?.[0]?.code
          ? `${medication.medicationCodeableConcept.coding[0].system} - ${medication.medicationCodeableConcept.coding[0].code}`
          : "Unknown Name");

      const value = medication.dosage?.[0]?.text || "";

      return { name, value };
    });
  }
}
