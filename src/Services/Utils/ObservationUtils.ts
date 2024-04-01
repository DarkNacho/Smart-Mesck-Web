import { Observation, Condition } from "fhir/r4";
import { InfoListData } from "../../Components/InfoListComponent";

export default class ObservationUtils {
    private constructor() {}

    public static getValue(observation: Observation) {
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

    public static getName(observation: Observation) {
        const name =
            observation.code?.coding?.[0]?.display ||
            observation.code?.text ||
            (observation.code?.coding?.[0]?.system &&
            observation.code?.coding?.[0]?.code
                ? `${observation.code.coding[0].system} - ${observation.code.coding[0].code}`
                : "Unknown Name");

        return name;
    }

    public static extractObservationInfo(observations: Observation[]): InfoListData[] {
        return observations.map((observation) => {
            const id = observation.id;
            const name = this.getName(observation);
            const value = this.getValue(observation);
            return { id, name, value };
        });
    }

    public static ObservationToCondition(observation: Observation): Condition {
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
