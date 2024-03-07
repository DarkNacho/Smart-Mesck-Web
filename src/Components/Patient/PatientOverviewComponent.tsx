import { Patient } from "fhir/r4";
import PatientGeneralWidgetComponent from "./PatientGeneralWidgetComponent";
import ObservationService from "../../Services/ObservationService";
import InfoListComponent from "../InfoListComponent";
import { useEffect, useState } from "react";
import ConditionService from "../../Services/ConditionService";
import MedicationService from "../../Services/MedicationService";
export default function PatientOverviewComponent({patient}:{patient: Patient})
{
  const observationService = new ObservationService();
  const conditionService = new ConditionService();
  const medicationService = new MedicationService();

  const [observationData,setObservationData] = useState<{ name: string; value: string; }[]>([]);
  const [conditionData,setConditionData] = useState<{ name: string; value: string; }[]>([]);
  const [medication,setMedicationData] = useState<{ name: string; value: string; }[]>([]);


  const fetchObservationData = async () =>
  {
    const result = await observationService.getResources( {subject: patient.id!});
    if(result.success)
    {
      setObservationData(observationService.extractObservationInfo(result.data));
      console.log(result.data);
    } 
  }

  const fetchConditionData = async () =>
  {
    const result = await conditionService.getResources( {subject: patient.id!});
    if(result.success)
    {
      setConditionData(conditionService.extractConditionName(result.data));
      console.log(result.data);
    } 
  }

  const fetchMedicationData = async () =>
  {
    const result = await medicationService.getResources( {subject: patient.id!});
    if(result.success)
    {
      setMedicationData(medicationService.extractMedicationInfo(result.data));
      //setConditionData(conditionService.extractConditionName(result.data));
      console.log("medication")
      console.log(result.data);
    } 
  }

  useEffect(() => {
    setObservationData([]);
    setConditionData([]);
    setMedicationData([]);
    fetchObservationData();
    fetchConditionData();
    fetchMedicationData();

  }, [patient.id]);

  

    return (
        <div style={{padding: "50px"}}>
            <div style={{paddingBottom: "30px"}}>
            <PatientGeneralWidgetComponent patient={patient}></PatientGeneralWidgetComponent>
            </div>
            <div style={{display: "flex", flexWrap: "wrap", gap: "30px"}}>
              <div style={{flex:1}}>
              <InfoListComponent data={observationData} title={"Observaciones"} icon={"/hearth.svg"}></InfoListComponent>
              </div>
              <div style={{flex:1}}>
              <InfoListComponent data={conditionData} title={"Condiciones"} icon={"/inercial.svg"}></InfoListComponent>
              </div>
              <div style={{flex:1}}>
              <InfoListComponent data={medication} title={"Medicamentos"} icon={"/medication.svg"}></InfoListComponent>
              </div>
            </div>
        </div>
    )

}