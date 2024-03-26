import { FhirResource, Patient } from "fhir/r4";
import PersonUtil from "./Services/Utils/PersonUtils";
import ListResourceComponent from "./Components/ListResourceComponent";
import FhirResourceService from "./Services/FhirService";

//Datos default de practicante
localStorage.setItem("userRol", "Admin");
localStorage.setItem("id", "204");

const fhirService = new FhirResourceService("Patient");
function App() {
  function getDisplay(resource: FhirResource): string {
    return `ID: ${resource.id}\nName: ${PersonUtil.parsePersonName(
      resource
    )}\nGender: ${(resource as Patient).gender || "N/A"}`;
  }
  return (
    <>
      root
      <ListResourceComponent
        searchParam={{ _count: 3 }}
        getDisplay={getDisplay}
        fhirService={fhirService}
      ></ListResourceComponent>
    </>
  );
}

export default App;
