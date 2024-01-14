import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Patient, Questionnaire } from "fhir/r4";
import toast, { Toaster } from "react-hot-toast";
import PatientGeneralWidgetComponent from "../Components/Patient/PatientGeneralWidgetComponent";
import PatientHeaderComponent from "../Components/Patient/PatientHeaderComponent";

import PatientQuestionnaireComponent from "../Components/Patient/PatientQuestionnaireComponent";
import PatientService from "../Services/PatientService";

const patientService = PatientService.getInstance();

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
        <PatientGeneralWidgetComponent
          patient={patient}
        ></PatientGeneralWidgetComponent>
      );
      break;
    case "Formularios":
      componentToRender = (
        <PatientQuestionnaireComponent
          patientID={patientID!}
        ></PatientQuestionnaireComponent>
      );
      break;
    default:
  }

  return (
    <div>
      <Toaster position="bottom-right" reverseOrder={false} />
      <PatientHeaderComponent
        patient={patient}
        onOptionSelect={handleOptionSelect}
      ></PatientHeaderComponent>
      {componentToRender}
    </div>
  );
}
