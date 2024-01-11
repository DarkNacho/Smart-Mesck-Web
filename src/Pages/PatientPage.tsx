import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Observation, Patient, Bundle, Questionnaire } from "fhir/r4";
import PatientGeneralWidgetComponent from "../Components/Patient/PatientGeneralWidgetComponent";
import PatientHeaderComponent from "../Components/Patient/PatientHeaderComponent";
import Pair from "../Interfaces/Pair";

import PatientQuestionnaireComponent from "../Components/Patient/PatientQuestionnaireComponent";
import PatientService from "../Services/PatientService";

const patientService = PatientService.getInstance();

function bundleToObservationArray(bundle: Bundle): Observation[] {
  return bundle.entry?.map((entry) => entry.resource as Observation) || [];
}

function observationArrayToPair(
  observations: Observation[]
): Pair<string, string>[] {
  const ObservationValueParse = (observation: Observation) => {
    if (observation.valueString) {
      return observation.valueString;
    } else if (observation.valueQuantity) {
      const { value, unit } = observation.valueQuantity;
      return `${value} ${unit || ""}`;
    }
    return "";
  };
  const someArray: Pair<string, string>[] = [
    { first: "hola", second: "mundo" },
    { first: "nuvo", second: "valor" },
  ];

  var mapped = observations?.map((obs) => {
    const name = obs.code?.text! || "No texto";
    const value = ObservationValueParse(obs);
    return { first: name, second: value } as Pair<string, string>;
  });

  console.log(mapped);
  return mapped;
}

export default function PatientPage() {
  const { patientID } = useParams();
  const [patient, setPatient] = useState<Patient>({} as Patient);
  const [observations, setObservations] = useState<Observation[]>([]);
  const [selectedOption, setSelectedOption] = useState<String>("Overview");
  const [selecteQues, setQues] = useState<Questionnaire>({} as Questionnaire);

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option);
  };

  const handleQuesSelect = (ques: Questionnaire) => {
    setQues(ques);
    console.log("Questionario", ques);
  };

  const fetchPatient = async () => {
    patientService.getById(patientID!).then((res) => setPatient(res));
  };

  useEffect(() => {
    fetchPatient();
    console.log("paciente:", patient);
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
      <PatientHeaderComponent
        patient={patient}
        onOptionSelect={handleOptionSelect}
      ></PatientHeaderComponent>
      {componentToRender}
    </div>
  );
}
