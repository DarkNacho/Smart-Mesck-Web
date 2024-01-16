import { QuestionnaireResponse } from "fhir/r4";
import FhirResourceService from "./FhirService";

export default class QuestionnaireService extends FhirResourceService<QuestionnaireResponse> {
    
    constructor() {
      super("QuestionnaireResponse");
    }

}