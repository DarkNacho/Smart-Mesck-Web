import { Condition} from "fhir/r4";
import FhirResourceService from "./FhirService";
import { SearchParams } from "fhir-kit-client";

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

  private async getAllConditions(params?: SearchParams): Promise<Result<Condition[]>> {
    let conditions: Condition[] = [];
    const result = await this.getResources(params);
  
    if(!result.success) return result;
    
    conditions = [...conditions, ... result.data];//conditions.concat(result.data);
    
    while(this.hasNextPage)
    {
      const res = await this.getNewResources("next");
      if(!res.success) return res;
      
      conditions = [...conditions, ... res.data]//conditions.concat(res.data);
    }
  
    return {success: true, data: conditions};
  }


  //ve que tenga una referencia a un QuestionnaireResponse en evidence
  public async getConditonsWithQuestionnaireResponse(subjectID: string, questionnaireResponseID : string) : Promise<Result<Condition[]>>
  {
    const result = await this.getAllConditions( {subject: subjectID} )
    if(!result.success) return result;
    var conditions = result.data.filter(item => item.evidence?.some(evidence => evidence.detail?.some(detail => detail.reference === `QuestionnaireResponse/${questionnaireResponseID}`)))
    return {success: true, data: conditions};
  }
  
}
