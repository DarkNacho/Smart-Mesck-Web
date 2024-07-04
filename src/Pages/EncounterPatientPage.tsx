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
import EncounterUtils from "../Services/Utils/EncounterUtils";

import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import { TimelineOppositeContent } from "@mui/lab";
import dayjs from "dayjs";

import "dayjs/locale/es"; // importa el locale español
import { Typography } from "@mui/material";
dayjs.locale("es"); // usa el locale español

const observationService = new ObservationService();
const conditionService = new ConditionService();
const encounterService = new FhirResourceService<Encounter>("Encounter");
let patientID = "";

export default function EncounterPatientPage() {
  const { encounterID } = useParams();

  const [observationData, setObservationData] = useState<InfoListData[]>([]);

  const [conditionData, setConditionData] = useState<InfoListData[]>([]);
  const [encounter, setEncounter] = useState<Encounter>();
  const [encounters, setEncounters] = useState<Encounter[]>([]);

  const [loading, setLoading] = useState(true);

  const fetchSeguimiento = async (encounter: Encounter) => {
    setLoading(true);
    try {
      if (!encounter?.partOf) return false;
      const encounters: Encounter[] = [];
      encounters.push(encounter);
      let data = encounter;
      while (data.partOf) {
        if (data.partOf.reference) {
          const res = await encounterService.getById(
            data.partOf.reference.split("/")[1]
          );
          if (!res.success) return res.success;
          encounters.push(res.data);
          data = res.data;
        }
      }
      console.log("encounters: ", encounters);
      setEncounters(encounters);
      return true;
    } catch (error) {
      console.error("encounters:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchEncounter = async (): Promise<Result<Encounter>> => {
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
    return result;
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
      setConditionData(ConditionUtils.extractConditionNames(result.data));
      //console.log(conditionService.extractConditionName(resultCon.data));
    }
  };

  useEffect(() => {
    setObservationData([]);
    fetchEncounter().then((result) => {
      if (result.success) {
        fetchObservation();
        fetchCondition();
        fetchSeguimiento(result.data);
      }
    });
  }, [encounterID]);

  if (loading) return <div>loading...</div>;

  return (
    <div style={{ padding: "50px" }}>
      <div>
        <Typography variant="h5">{encounter?.subject?.display}</Typography>
        <Timeline>
          {encounters.map((encounter, index) => (
            <TimelineItem
              key={index}
              onClick={() =>
                (window.location.href = `/Encounter/${encounter.id}`)
              }
            >
              <TimelineOppositeContent>
                {dayjs(encounter.period?.start).format(
                  "dddd DD [de] MMMM YYYY"
                )}
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot />
                {index < encounters.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent>
                {EncounterUtils.getPeriod(encounter.period!)}
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
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
