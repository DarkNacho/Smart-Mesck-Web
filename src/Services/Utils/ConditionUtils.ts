import { Condition } from "fhir/r4";
import { InfoListData } from "../../Components/InfoListComponent";

export default class ConditionUtils {
  public static extractConditionName(conditions: Condition[]): InfoListData[] {
    return conditions.map((condition) => {
      const id = condition.id;
      const name =
        condition.code?.coding?.[0]?.display ||
        condition.code?.text ||
        (condition.code?.coding?.[0]?.system &&
        condition.code?.coding?.[0]?.code
          ? `${condition.code.coding[0].system} - ${condition.code.coding[0].code}`
          : "Unknown Name dsaBL");

      const value =
        condition.clinicalStatus?.coding?.[0]?.display ||
        condition.clinicalStatus?.text ||
        condition.clinicalStatus?.coding?.[0]?.code ||
        condition.onsetString ||
        "No value";

      return { id, name, value };
    });
  }
}
