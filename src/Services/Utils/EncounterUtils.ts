import { Encounter, Period, Reference } from "fhir/r4";

export default class EncounterUtils {
  private static padZero(number: number) {
    return number.toString().padStart(2, "0");
  }

  public static getFormatPeriod(period: Period) {
    if (!period || !period.start) return "N/A";

    const startDate = new Date(period.start);

    const formattedStartDate = `${startDate.getFullYear()}-${this.padZero(
      startDate.getMonth() + 1
    )}-${this.padZero(startDate.getDate())} ${this.padZero(
      startDate.getHours()
    )}:${this.padZero(startDate.getMinutes())}`;

    if (!period.end) return formattedStartDate;

    const endDate = new Date(period.end);
    const formattedEndDate = `${this.padZero(
      endDate.getHours()
    )}:${this.padZero(endDate.getMinutes())}`;

    return `${formattedStartDate} - ${formattedEndDate}`;
  }

  public static getSubjectDisplayOrID(subject: Reference) {
    if (!subject) return "N/A";
    if (subject.display) return subject.display;

    if (subject.reference) {
      // Extrayendo el ID del reference (por ejemplo, "Patient/123")
      const id = subject.reference.split("/")[1];
      return id ? id : subject.reference;
    }
  }

  public static getSubjectID(subject: Reference) {
    if (subject.reference) {
      // Extrayendo el ID del reference (por ejemplo, "Patient/123")
      const id = subject.reference.split("/")[1];
      return id ? id : subject.reference;
    }
  }

  public static getPrimaryPractitioner(encounter: Encounter) {
    const participants = encounter.participant || [];

    const primaryPerformer = participants.find((participant) => {
      return (
        participant.type &&
        participant.type.some(
          (type) =>
            type.coding &&
            type.coding.some(
              (coding) =>
                coding.system ===
                  "http://terminology.hl7.org/CodeSystem/v3-ParticipationType" &&
                coding.code === "PPRF"
            )
        )
      );
    });

    if (primaryPerformer) {
      return this.getSubjectDisplayOrID(primaryPerformer.individual!);
    }

    const firstParticipant = participants[0];
    if (firstParticipant) {
      return this.getSubjectDisplayOrID(firstParticipant.individual!);
    }
  }
}
