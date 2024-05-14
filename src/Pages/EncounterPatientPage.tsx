import ObservationService from "../Services/ObservationService";
import InfoListComponent, {
  InfoListData,
} from "../Components/InfoListComponent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ConditionService from "../Services/ConditionService";
import PatientQuestionnaireComponent from "../Components/Patient/PatientQuestionnaireComponent";

import ObservationUtil from "../Services/Utils/ObservationUtils";
import ConditionUtils from "../Services/Utils/ConditionUtils";
import { Encounter } from "fhir/r4";
import FhirResourceService from "../Services/FhirService";
import HandleResult from "../Components/HandleResult";

const observationService = new ObservationService();
const conditionService = new ConditionService();
const encounterService = new FhirResourceService<Encounter>("Encounter");
let patientID = "";

export default function EncounterPatientPage() {
  const { encounterID } = useParams();

  const [observationData, setObservationData] = useState<InfoListData[]>([]);

  const [conditionData, setConditionData] = useState<InfoListData[]>([]);
  const [encounter, setEncounter] = useState<Encounter>();

  const fetchEncounter = async () => {
    const result = await HandleResult.handleOperation(
      () => encounterService.getById(encounterID!),
      "Encuentro obtenido.",
      "Obteniendo Encuentro..."
    );

    //const resultEncounter = await encounterService.getById(encounterID!);
    if (result.success) {
      patientID = result.data?.subject?.reference?.split("/")[1] || "";
      setEncounter(result.data);
      console.log("encounter:", result.data);
    }
  };

  const fetchObservation = async () => {
    //const result = await observationService.getResources({
    //  subject: patientID,
    //  encounter: encounterID!,
    //});

    const result = await HandleResult.handleOperation(
      () =>
        observationService.getResources({
          subject: patientID,
          encounter: encounterID!,
        }),
      "Observaciones Obtenidas.",
      "Obteniendo Observaciones..."
    );
    console.log("patientID ", patientID);
    console.log("encounterID ", encounterID);
    if (result.success) {
      setObservationData(ObservationUtil.extractObservationInfo(result.data));
      console.log("observation:", result.data);
    }
  };

  const fetchCondition = async () => {
    //const resultCon = await conditionService.getResources({
    //  subject: patientID!,
    //  encounter: encounterID!,
    //});
    const result = await HandleResult.handleOperation(
      () =>
        conditionService.getResources({
          subject: patientID!,
          encounter: encounterID!,
        }),
      "Condiciones Obtenidas.",
      "Obteniendo Condiciones..."
    );

    if (result.success) {
      console.log("conditions: ", result.data);
      setConditionData(ConditionUtils.extractConditionName(result.data));
      //console.log(conditionService.extractConditionName(resultCon.data));
    }
  };

  useEffect(() => {
    setObservationData([]);
    fetchEncounter();
    fetchObservation();
    fetchCondition();
  }, [encounterID]);

  if (patientID === "") return <div>loading...</div>;

  return (
    <div style={{ padding: "50px" }}>
      <div style={{ paddingBottom: "30px" }}>
        <h1>info encuentro</h1>
        <h1>{encounter?.id}</h1>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
        <div style={{ flex: 1 }}>
          <InfoListComponent
            data={observationData}
            title={"Observaciones"}
            icon={"/hearth.svg"}
            resourceType="Observation"
            patientId={patientID}
          ></InfoListComponent>
        </div>
        <div style={{ flex: 1 }}>
          <InfoListComponent
            data={conditionData}
            title={"Condiciones"}
            icon={"/inercial.svg"}
            resourceType="Condition"
          ></InfoListComponent>
        </div>
      </div>
      <div>
        <PatientQuestionnaireComponent
          patientID={patientID!}
          encounterID={encounterID!}
        ></PatientQuestionnaireComponent>
      </div>
    </div>
  );
}
