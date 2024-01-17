import { Observation } from "fhir/r4";
import FhirResourceService from "./FhirService";

export default class ObservationService extends FhirResourceService<Observation> {
  constructor() {
    super("Observation");
  }

  public async getObservationsOfQuestionnaireResponse(
    QuestionnaireResponseId: string
  ): Promise<Result<Observation[]>> {
    return this.getResources({
      'has-member': `QuestionnaireResponse/${QuestionnaireResponseId}`,
    });
  }

  public extractObservationInfo(observations: Observation[]): { name: string; value: string }[] {
    return observations.map(observation => {
      const name =
        observation.code?.coding?.[0]?.display ||
        observation.code?.text ||
        (observation.code?.coding?.[0]?.system && observation.code?.coding?.[0]?.code
          ? `${observation.code.coding[0].system} - ${observation.code.coding[0].code}`
          : "Unknown Name");
  
      const value = observation.valueQuantity
        ? `${observation.valueQuantity.value}${observation.valueQuantity.unit ? ` ${observation.valueQuantity.unit}` : ""}`
        : "Unknown Value";
  
      return { name, value };
    });
  }

}
