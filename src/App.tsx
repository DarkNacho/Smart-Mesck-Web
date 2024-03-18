import AutocompleteComponent from "./Components/AutocompleteComponent";

//import styles from "./App.module.css";
function App() {
  return (
    <>
      <div>
        <h1>root aqui</h1>
        <AutocompleteComponent
          name="Condiciones"
          table="icd9cm_dx"
          searchArguments="df=long_name"
        />
        <AutocompleteComponent
          name="Medicamentos"
          table="rxterms"
          searchArguments=""
        />
      </div>
    </>
  );
}

export default App;
