import AutocompleteComponent from "./Components/AutocompleteComponent";

//import styles from "./App.module.css";
//https://clinicaltables.nlm.nih.gov/fhir/R4/ValueSet/conditions/$expand?_format=json&count=5&filter=dia
function App() {
  return (
    <>
      <div>
        <h1>root aqui</h1>
        <AutocompleteComponent
          name="Condiciones"
          table="conditions"
          searchArguments=""
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
