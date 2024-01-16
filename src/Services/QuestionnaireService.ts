import { Questionnaire} from "fhir/r4";
import FhirResourceService from "./FhirService";

export default class QuestionnaireService extends FhirResourceService<Questionnaire> {
  constructor() {
    super("Questionnaire");
  }
}
