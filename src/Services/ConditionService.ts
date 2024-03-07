import { Condition} from "fhir/r4";
import FhirResourceService from "./FhirService";

export default class ConditionService extends FhirResourceService<Condition> {
  constructor() {
    super("Condition");
  }

  public extractConditionName(conditions: Condition[]): { name: string, value: string} [] {
    return conditions.map(condition => {
      const name =
        condition.code?.coding?.[0]?.display ||
        condition.code?.text ||
        (condition.code?.coding?.[0]?.system && condition.code?.coding?.[0]?.code
          ? `${condition.code.coding[0].system} - ${condition.code.coding[0].code}`
          : "Unknown Name");  
      
        const value =
          condition.clinicalStatus?.coding?.[0]?.display ||
          condition.clinicalStatus?.text ||
          (condition.clinicalStatus?.coding?.[0]?.system && condition.clinicalStatus?.coding?.[0]?.code
            ? `${condition.clinicalStatus.coding[0].code}`
            : "Unknown Name");  

      return { name, value};
    });
  }
}
