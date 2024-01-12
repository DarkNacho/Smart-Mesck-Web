import Client from "fhir-kit-client";
import { Questionnaire, Bundle, QuestionnaireResponse } from "fhir/r4";

export default class QuestionnaireService {
  public apiUrl: string;
  private static instance: QuestionnaireService;
  private fhirClient: Client;

  private _questionnaireBundle: Bundle;

  public hasNextPage: boolean = false;
  public hasPrevPage: boolean = false;

  private constructor() {
    //this.apiUrl = "https://hapi.fhir.org/baseR4";
    //this.apiUrl = "https://castudillo-hapi.darknacho.xyz/fhir/"
    this.apiUrl = import.meta.env.VITE_API_URL || "https://hapi.fhir.org/baseR4";
    this.fhirClient = new Client({ baseUrl: this.apiUrl });
    this._questionnaireBundle = {} as Bundle;
  }

  public static getInstance(): QuestionnaireService {
    if (!QuestionnaireService.instance) {
      QuestionnaireService.instance = new QuestionnaireService();
    }
    return QuestionnaireService.instance;
  }

  private setNewPages(response: Bundle) {
    this.hasNextPage = !!response.link?.find((link) => link.relation === "next")
      ?.url;
    this.hasPrevPage = !!response.link?.find(
      (link) => link.relation === "previous"
    )?.url;
  }

  public async getById(id: string): Promise<Questionnaire> {
    return (await this.fhirClient.read({
      resourceType: "Questionnaire",
      id: id,
    })) as Questionnaire;
  }
  public async getQuestionnaires(count?: number): Promise<Questionnaire[]> {
    const searchParams: { _count: number } = { _count: count || 5 };
    const response = (await this.fhirClient.search({
      resourceType: "Questionnaire",
      searchParams: searchParams,
    })) as Bundle;
    this._questionnaireBundle = response;
    this.setNewPages(response);
    return (
      response.entry?.map((entry) => entry.resource as Questionnaire) || []
    );
  }

  public async getNextPage(): Promise<Questionnaire[]> {
    const response = (await this.fhirClient.nextPage({
      bundle: this._questionnaireBundle,
    })) as Bundle;
    this._questionnaireBundle = response;
    this.setNewPages(response);
    return (
      response.entry?.map((entry) => entry.resource as Questionnaire) || []
    );
  }

  public async getPrevPage(): Promise<Questionnaire[]> {
    const response = (await this.fhirClient.prevPage({
      bundle: this._questionnaireBundle,
    })) as Bundle;
    this._questionnaireBundle = response;
    this.setNewPages(response);
    return (
      response.entry?.map((entry) => entry.resource as Questionnaire) || []
    );
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
      this.fhirClient.create({
        resourceType: "QuestionnaireResponse",
        body: quesResponse,
      });
    else
      this.fhirClient.update({
        resourceType: "QuestionnaireResponse",
        id: quesResponse.id,
        body: quesResponse,
      });
  }
}
