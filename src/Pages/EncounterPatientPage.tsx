
import ObservationService from "../Services/ObservationService";
import InfoListComponent from "../Components/InfoListComponent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ConditionService from "../Services/ConditionService";

export default function EncounterPatientPage()
{
 const observationService = new ObservationService();
 const conditionService = new ConditionService();

  const { patientID } = useParams();
  const { encounterID } = useParams();

  const [obvservationData,setObvservationData] = useState<{ name: string; value: string; }[]>([]);
  
  const fetchData = async () =>
  {
    const result = await observationService.getResources( {subject: patientID!, encounter: encounterID!});
    if(result.success)
    {
      setObvservationData(observationService.extractObservationInfo(result.data));
      console.log(result.data);
    }
    const resultCon = await conditionService.getResources({subject: patientID!})
    if(resultCon.success)
    {
      console.log("Conditions");
      console.log(resultCon.data);
      console.log(conditionService.extractConditionName(resultCon.data));
    }
  }

  useEffect(() => {
    setObvservationData([]);
    fetchData();
  }, [patientID]);

  

    return (
        <div style={{padding: "50px"}}>
            <div style={{paddingBottom: "30px"}}>
              <h1>info encountro</h1>
            </div>
            <div style={{display: "flex", flexWrap: "wrap", gap: "30px"}}>
              <div style={{flex:1}}>
              <InfoListComponent data={obvservationData} title={"Observaciones"} icon={"/hearth.svg"}></InfoListComponent>
              </div>
              <div style={{flex:1}}>
              <InfoListComponent data={[]} title={"Condiciones"} icon={"/inercial.svg"}></InfoListComponent>
              </div>
              <div style={{flex:1}}>
              <InfoListComponent data={[]} title={"Medicamentos"} icon={"/medication.svg"}></InfoListComponent>
              </div>
            </div>
        </div>
    )

}