import { Questionnaire, Bundle, QuestionnaireResponse } from "fhir/r4";
import FhirResourceService from "./FhirService";

export default class QuestionnaireService extends FhirResourceService<Questionnaire> {
  constructor() {
    super("Questionnaire");
  }

  public async getResponseById(id: string): Promise<QuestionnaireResponse> {
    return (await this.fhirClient.read({
      resourceType: "QuestionnaireResponse",
      id: id,
    })) as QuestionnaireResponse;
  }

  public async getResponseByPatientId(
    patientId: string
  ): Promise<QuestionnaireResponse[]> {
    const searchParams: { _count: number; subject: string } = {
      _count: 100,
      subject: patientId,
    };
    const response = (await this.fhirClient.search({
      resourceType: "QuestionnaireResponse",
      searchParams: searchParams,
    })) as Bundle;
    return (
      response.entry?.map((entry) => entry.resource as QuestionnaireResponse) ||
      []
    );
  }
  public async postResponse(quesResponse: QuestionnaireResponse) {
    if (!quesResponse.id)
      this.fhirClient
        .create({
          resourceType: "QuestionnaireResponse",
          body: quesResponse,
        })
        .then((res) => console.log("res post", res));
    else
      this.fhirClient.update({
        resourceType: "QuestionnaireResponse",
        id: quesResponse.id,
        body: quesResponse,
      });
  }
}
