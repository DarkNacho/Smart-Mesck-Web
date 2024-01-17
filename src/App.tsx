import { useState } from "react";
import InfoList from "./Components/InfoListComponent";
import ObservationService from "./Services/ObservationService";

//import styles from "./App.module.css";
function App() {
  
  const observationService = new ObservationService();
  const [data,setData] = useState<{ name: string; value: string; }[]>([]);
  const fetchData = async () =>
  {
    const result = await observationService.getResources();
    if(result.success) setData(observationService.extractObservationInfo(result.data));
  }
  //observationService.getObservationsOfQuestionnaireResponse("54").then(res => console.log(res.success ? observationService.extractObservationInfo(res.data): res.error));
  
  fetchData();

  return (
    <>
      <div>
        <h1>root aqui</h1>
        <InfoList data={data} title={"un titulo"} icon={"icono va aqui"}></InfoList>
      </div>
    </>
  );
}

export default App;
