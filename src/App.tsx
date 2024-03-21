import ObservationFormComponent, {
  ObservationFormData,
} from "./Components/Forms/ObservationFormComponent";

//import styles from "./App.module.css";
//https://clinicaltables.nlm.nih.gov/fhir/R4/ValueSet/conditions/$expand?_format=json&count=5&filter=dia
function App() {
  return (
    <>
      <div>
        <ObservationFormComponent
          formId={"formtest"}
          patientId={"paciente"}
          submitForm={function (data: ObservationFormData): void {
            alert(JSON.stringify(data));
          }}
        ></ObservationFormComponent>
        <button form="formtest">test</button>
      </div>
    </>
  );
}

export default App;
