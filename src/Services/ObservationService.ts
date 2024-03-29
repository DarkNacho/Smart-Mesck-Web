import { Condition, Observation } from "fhir/r4";
import FhirResourceService from "./FhirService";
import { InfoListData } from "../Components/InfoListComponent";

export default class ObservationService extends FhirResourceService<Observation> {
  constructor() {
    super("Observation");
  }

  public async getObservationsOfQuestionnaireResponse(
    QuestionnaireResponseId: string
  ): Promise<Result<Observation[]>> {
    return this.getResources({
      "has-member": `QuestionnaireResponse/${QuestionnaireResponseId}`,
    });
  }

  public getValue(observation: Observation) {
    if (observation.valueQuantity) {
      return `${observation.valueQuantity.value}${
        observation.valueQuantity.code
          ? ` ${observation.valueQuantity.code}`
          : ""
      }`;
    }

    if (observation.valueCodeableConcept) {
      return (
        observation.valueCodeableConcept.text || "Unknown Value CodeableConcept"
      );
    }

    if (typeof observation.valueString !== "undefined") {
      return observation.valueString;
    }

    if (typeof observation.valueBoolean !== "undefined") {
      return observation.valueBoolean ? "True" : "False";
    }

    if (typeof observation.valueInteger !== "undefined") {
      return observation.valueInteger.toString();
    }

    if (observation.valueRange) {
      const low = observation.valueRange.low?.value;
      const high = observation.valueRange.high?.value;
      const unit = observation.valueRange.low?.unit || "";
      return low !== undefined && high !== undefined
        ? `${low} - ${high} ${unit}`
        : "Unknown ValueRange";
    }

    if (observation.valueRatio) {
      const numerator = observation.valueRatio.numerator?.value;
      const denominator = observation.valueRatio.denominator?.value;
      return numerator !== undefined && denominator !== undefined
        ? `${numerator} / ${denominator}`
        : "Unknown ValueRatio";
    }

    if (observation.valueSampledData) {
      return "SampledData";
    }

    if (typeof observation.valueTime !== "undefined") {
      return observation.valueTime;
    }

    if (typeof observation.valueDateTime !== "undefined") {
      return observation.valueDateTime;
    }

    if (observation.valuePeriod) {
      return `Start: ${observation.valuePeriod.start}, End: ${observation.valuePeriod.end}`;
    }

    return "Unknown Value";
  }

  public getName(observation: Observation) {
    const name =
      observation.code?.coding?.[0]?.display ||
      observation.code?.text ||
      (observation.code?.coding?.[0]?.system &&
      observation.code?.coding?.[0]?.code
        ? `${observation.code.coding[0].system} - ${observation.code.coding[0].code}`
        : "Unknown Name");

    return name;
  }

  public extractObservationInfo(observations: Observation[]): InfoListData[] {
    return observations.map((observation) => {
      const id = observation.id;
      const name =
        observation.code?.coding?.[0]?.display ||
        observation.code?.text ||
        (observation.code?.coding?.[0]?.system &&
        observation.code?.coding?.[0]?.code
          ? `${observation.code.coding[0].system} - ${observation.code.coding[0].code}`
          : "Unknown Name");

      /*const value = observation.valueQuantity
        ? `${observation.valueQuantity.value}${observation.valueQuantity.unit ? ` ${observation.valueQuantity.unit}` : ""}`
        : "Unknown Value";*/

      let value;

      if (observation.valueQuantity) {
        value = `${observation.valueQuantity.value}${
          observation.valueQuantity.code
            ? ` ${observation.valueQuantity.code}`
            : ""
        }`;
      } else if (observation.valueCodeableConcept) {
        value =
          observation.valueCodeableConcept.text ||
          "Unknown Value CodeableConcept";
      } else if (typeof observation.valueString !== "undefined") {
        value = observation.valueString;
      } else if (typeof observation.valueBoolean !== "undefined") {
        value = observation.valueBoolean ? "True" : "False";
      } else if (typeof observation.valueInteger !== "undefined") {
        value = observation.valueInteger.toString();
      } else if (observation.valueRange) {
        const low = observation.valueRange.low?.value;
        const high = observation.valueRange.high?.value;
        const unit = observation.valueRange.low?.unit || "";

        value =
          low !== undefined && high !== undefined
            ? `${low} - ${high} ${unit}`
            : "Unknown ValueRange";
      } else if (observation.valueRatio) {
        const numerator = observation.valueRatio.numerator?.value;
        const denominator = observation.valueRatio.denominator?.value;
        value =
          numerator !== undefined && denominator !== undefined
            ? `${numerator} / ${denominator}`
            : "Unknown ValueRatio";
      } else if (observation.valueSampledData) {
        value = "SampledData";
      } else if (typeof observation.valueTime !== "undefined") {
        value = observation.valueTime;
      } else if (typeof observation.valueDateTime !== "undefined") {
        value = observation.valueDateTime;
      } else if (observation.valuePeriod) {
        value = `Start: ${observation.valuePeriod.start}, End: ${observation.valuePeriod.end}`;
      } else {
        value = "Unknown Value";
      }
      return { id, name, value };
    });
  }

  public convertirObservacionACondicion(observation: Observation): Condition {
    const condition: Condition = {
      resourceType: "Condition",
      id: observation.id,
      subject: observation.subject!,
      encounter: observation.encounter,
      code: {
        coding: observation.code.coding,
        text: observation.code.text,
      },
      evidence: observation.hasMember
        ? [
            {
              detail: observation.hasMember.map((member) => ({
                reference: member.reference,
              })),
            },
          ]
        : undefined,
      extension: observation.extension,
    };
    return condition;
  }
}
