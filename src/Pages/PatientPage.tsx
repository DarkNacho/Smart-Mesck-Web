import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Patient } from "fhir/r4";
import PatientHeaderComponent from "../Components/Patient/PatientHeaderComponent";

import PatientQuestionnaireComponent from "../Components/Patient/PatientQuestionnaireComponent";
import PatientOverviewComponent from "../Components/Patient/PatientOverviewComponent";
import FhirResourceService from "../Services/FhirService";
import HandleResult from "../Components/HandleResult";
import PatientEncounterListComponent from "../Components/Patient/PatientEncounterListComponent";
import WebSocketChart from "../Components/Charts/WebSocketChart";

const fhirService = new FhirResourceService<Patient>("Patient");

export default function PatientPage() {
  const { patientID } = useParams();
  const [patient, setPatient] = useState<Patient>({} as Patient);

  const [selectedOption, setSelectedOption] = useState<string>("Overview");

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const fetchPatient = async () => {
    HandleResult.handleOperation(
      () => fhirService.getById(patientID!),
      "Paciente cargado exitosamente",
      "Obteniendo...",
      setPatient
    );
  };

  useEffect(() => {
    fetchPatient();
  }, [patientID]);

  let componentToRender;

  switch (selectedOption) {
    case "Overview":
      componentToRender = patient.id && (
        <PatientOverviewComponent patient={patient}></PatientOverviewComponent>
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
      componentToRender = (
        <PatientEncounterListComponent
          patientId={patientID!}
        ></PatientEncounterListComponent>
      );
      break;
    case "Sensor":
      componentToRender = (
        <WebSocketChart patientId={patientID!}></WebSocketChart>
      );
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
