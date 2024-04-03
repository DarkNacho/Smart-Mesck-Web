import ConditionFormComponent, {
  ConditionFormData,
} from "./Components/Forms/ConditionFormComponent";
import { SubmitHandler } from "react-hook-form";
import { FhirResource, Patient, ValueSetExpansionContains } from "fhir/r4";
import MultipleAutoCompleteComponent from "./Components/AutoCompleteComponents/MultipleAutoCompleteComponent";
import PersonUtil from "./Services/Utils/PersonUtils";
import MultipleFromLHCAutoCompleteComponent from "./Components/AutoCompleteComponents/MultipleFromLHCAutoCompleteComponent copy";

/*
function convertirTipos(
  include: ValueSetComposeInclude[]
): ValueSetExpansionContains[] {
  const resultados: ValueSetExpansionContains[] = [];

  include.forEach((item) => {
    item.concept?.forEach((concepto) => {
      resultados.push({
        code: concepto.code,
        system: item.system,
        display: concepto.display,
      });
    });
  });

  return resultados;
}
async function getValueSet() {
  const fhirService = new FhirResourceService<ValueSet>("ValueSet");
  const result = await fhirService.getById("232");
  if (!result.success) {
    console.error(result.error);
    return;
  }
  const converted = convertirTipos(result.data.compose?.include || []);
  console.log(converted);
}*/

function App() {
  const onSubmitForm: SubmitHandler<ConditionFormData> = (data) => {
    //alert(JSON.stringify(newObservation))
    console.log(data);
  };

  //getValueSet();
  return (
    <>
      <h1>root</h1>
      <ConditionFormComponent
        formId={"testing"}
        patientId={"4"}
        submitForm={onSubmitForm}
        practitionerId="204"
      ></ConditionFormComponent>

      <MultipleAutoCompleteComponent<Patient>
        resourceType={"Patient"}
        label={"pacientes"}
        getDisplay={PersonUtil.getPersonNameAsString}
        onChange={function (value: FhirResource[] | null): void {
          console.log(value);
        }}
        searchParam={"name"}
      ></MultipleAutoCompleteComponent>

      <MultipleFromLHCAutoCompleteComponent
        label="loinc"
        onChange={function (value: ValueSetExpansionContains[] | null): void {
          console.log(value);
        }}
        table={"loinc-items"}
      ></MultipleFromLHCAutoCompleteComponent>
    </>
  );
}

export default App;
