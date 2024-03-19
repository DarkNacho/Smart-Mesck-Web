import AutocompleteComponent from "./Components/AutocompleteComponent";
import ConditionFormComponent from "./Components/Condition/ConditionFormComponent";

//import styles from "./App.module.css";
//https://clinicaltables.nlm.nih.gov/fhir/R4/ValueSet/conditions/$expand?_format=json&count=5&filter=dia
function App() {
  const handleSubmit = (formData: any) => {
    console.log("Datos del formulario:", formData);
    // Aquí puedes enviar los datos del formulario a donde los necesites
  };

  return (
    <>
      <div>
        <h1>root aqui</h1>
        <AutocompleteComponent name="Condiciones" table="conditions" />
        <AutocompleteComponent name="Medicamentos" table="rxterms" />
      </div>
      <div>
        <h1>Formlario condition</h1>
        <ConditionFormComponent
          onSubmit={handleSubmit}
        ></ConditionFormComponent>
      </div>
    </>
  );
}

export default App;
