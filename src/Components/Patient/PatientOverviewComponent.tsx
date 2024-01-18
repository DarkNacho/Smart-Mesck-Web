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
        <div>
            <PatientGeneralWidgetComponent patient={patient}></PatientGeneralWidgetComponent>
            <InfoListComponent data={data} title={"Observaciones"} icon={"/hearth.svg"}></InfoListComponent>
        </div>
    )

}