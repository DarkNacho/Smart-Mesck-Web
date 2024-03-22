import { Patient } from "fhir/r4";
import PatientAutocompleteFromServerComponent from "./Components/Patient/PatientAutocompleteFromServerComponent";
import { useState } from "react";


//import styles from "./App.module.css";


function App() {

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>()

  const handlePatientChange = (patient: Patient | null) => {
    setSelectedPatient(patient);
    console.log(patient)
  };


  return (
    <>
      <PatientAutocompleteFromServerComponent
        label="Select a patient"
        onChange={handlePatientChange}
        value={selectedPatient!}
      />
    </>
  );
}

export default App;
