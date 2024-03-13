
import ObservationService from "../Services/ObservationService";
import InfoListComponent from "../Components/InfoListComponent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from 'axios';
import HistoryChartComponent from "../Components/Charts/HistoryChartComponent";

export default function ObservationHistoryPage()
{
  const observationService = new ObservationService();
  const { observationID } = useParams();
  //const { encounterID } = useParams();

  const [obvservationData,setObvservationData] = useState<{ name: string; value: string; }[]>([]);

  const [iframeContent, setIframeContent] = useState<string | null>(null);

  const [name,setName] = useState("");

  const fetchGraph = async (data: { name: string; value: string;}[]) =>
  {
    const response = await axios.post("http://localhost:8000/observationHistory", data, {headers: 
    {
      'Content-Type': 'application/json'
    }});
    await setIframeContent(response.data);
    console.log("graph html ", response.data);

  }

  const fetchData = async () =>
  {
    const result = await observationService.getHistoryById(observationID!);
    if(result.success)
    {
      //(observationService.extractObservationInfo(result.data));
      const obs = result.data.map(item =>
        {
          const name = observationService.getValue(item);
          const value = item.meta?.lastUpdated || "";
          return {name, value}
        });
      
      fetchGraph(obs);
      setObvservationData(obs);
      setName(obs.length > 0 ? observationService.getName(result.data[0]) : "");
      console.log(obs);
    }

  }

  useEffect(() => {
    setObvservationData([]);
    fetchData();
  }, [observationID]);

    return (
        <div style={{padding: "50px"}}>
            <div style={{paddingBottom: "30px"}}>
              <h1>Historial</h1>
            </div>
            <div style={{display: "flex", flexWrap: "wrap", gap: "30px"}}>
              <div style={{flex:1}}>
              <InfoListComponent data={obvservationData} title={name} icon={"/hearth.svg"}></InfoListComponent>
              </div>
            </div>
            <div>
            { iframeContent && ( <iframe srcDoc={iframeContent} title="Graph" width={600} height={500}/> ) }
            </div>
            <div>
              <HistoryChartComponent data={obvservationData}></HistoryChartComponent>
            </div>
        </div>
    )

}