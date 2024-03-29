import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Patient } from "fhir/r4";
import toast from "react-hot-toast";
import PatientHeaderComponent from "../Components/Patient/PatientHeaderComponent";

import PatientQuestionnaireComponent from "../Components/Patient/PatientQuestionnaireComponent";
import PatientService from "../Services/PatientService";
import PatientOverviewComponent from "../Components/Patient/PatientOverviewComponent";
import PatientEncounterList from "../Components/Patient/PatientEncounterList";

const patientService = new PatientService();


export default function PatientPage() {
  const { patientID } = useParams();
  const [patient, setPatient] = useState<Patient>({} as Patient);

  const [selectedOption, setSelectedOption] = useState<String>("Overview");

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };




  const fetchPatient = async () => {
    const response = await toast.promise(patientService.getById(patientID!), {
      loading: "Cargando Paciente",
      success: (result) => {
        if (result.success) {
          return "Paciente cargado exitosamente";
        } else {
          throw Error(result.error);
        }
      },
      error: (result) => result.toString(),
    });

    if (response.success) {
      setPatient(response.data);
      console.log(response.data);
    } else {
      console.error(response.error);
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [patientID]);

  let componentToRender;

  switch (selectedOption) {
    case "Overview":
      componentToRender = (
        patient.id && <PatientOverviewComponent patient={patient}></PatientOverviewComponent>
      );
      break;
    case "Formularios":
      componentToRender = (
        <PatientQuestionnaireComponent
          patientID={patientID!}
        ></PatientQuestionnaireComponent>
      );
      break;
    case "Encounters":
        componentToRender = (<PatientEncounterList patientID={patientID!}></PatientEncounterList>)
      break;
    default:
  }

  return (
    <div>
      <PatientHeaderComponent
        patient={patient}
        onOptionSelect={handleOptionSelect}
      ></PatientHeaderComponent>
      {componentToRender}
    </div>
  );
}
