import { Patient } from "fhir/r4";
import PatientGeneralWidgetComponent from "./PatientGeneralWidgetComponent";
import ObservationService from "../../Services/ObservationService";
import InfoListComponent from "../InfoListComponent";
import { useEffect, useState } from "react";

export default function PatientOverviewComponent({patient}:{patient: Patient})
{
 const observationService = new ObservationService();
  const [data,setData] = useState<{ name: string; value: string; }[]>([]);
  const fetchData = async () =>
  {
    const result = await observationService.getResources( {subject: patient.id!});
    if(result.success)
    {
      setData(observationService.extractObservationInfo(result.data));
      console.log(result.data);
    } 
  }

  useEffect(() => {
    setData([]);
    fetchData();
  }, [patient.id]);

  

    return (
        <div style={{padding: "50px"}}>
            <div style={{paddingBottom: "30px"}}>
            <PatientGeneralWidgetComponent patient={patient}></PatientGeneralWidgetComponent>
            </div>
            <div style={{display: "flex", flexWrap: "wrap", gap: "30px"}}>
              <div style={{flex:1}}>
              <InfoListComponent data={data} title={"Observaciones"} icon={"/hearth.svg"}></InfoListComponent>
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