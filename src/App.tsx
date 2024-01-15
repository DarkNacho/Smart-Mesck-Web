import InfoList from "./Components/InfoListComponent";
import Pair from "./Interfaces/Pair";

//import styles from "./App.module.css";
function App() {
  const someArray: Pair<string, string>[] = [{first: "hola", second: "mundo"}, {first: "nuvo", second: "valor"}]

  
  return (
    <>
      <div>
        <h1>root aqui</h1>
        <InfoList data={someArray} title={"un titulo"} icon={"icono va aqui"}></InfoList>
      </div>
    </>
  );
}

export default App;
