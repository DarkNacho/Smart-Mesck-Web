import ObservationService from "../Services/ObservationService";
import InfoListComponent, {
  InfoListData,
} from "../Components/InfoListComponent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ConditionService from "../Services/ConditionService";
import PatientQuestionnaireComponent from "../Components/Patient/PatientQuestionnaireComponent";
import EncounterService from "../Services/EncounterService";
import ObservationUtil from "../Services/Utils/ObservationUtils";
import ConditionUtils from "../Services/Utils/ConditionUtils";
import { Encounter } from "fhir/r4";

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
import {
  Typography,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  Link,
} from "@mui/material";
import DeviceSensorChart from "../Components/Charts/DeviceSensorChart";
import { SensorDataByDevice } from "../Components/Charts/SensorModel";
import PatientReportComponent from "../Components/Patient/PatientReportComponent";

import { useNavigate } from "react-router-dom";

dayjs.locale("es"); // usa el locale español

const observationService = new ObservationService();
const conditionService = new ConditionService();
const encounterService = new EncounterService();
let patientID = "";

export default function EncounterPatientPage() {
  const navigate = useNavigate();
  const { encounterID } = useParams();

  const [observationData, setObservationData] = useState<InfoListData[]>([]);

  const [conditionData, setConditionData] = useState<InfoListData[]>([]);
  const [encounter, setEncounter] = useState<Encounter>();
  const [encounters, setEncounters] = useState<Encounter[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingSensorData, setLoadingSensorData] = useState(true);

  const [sensorDataByDevice, setSensorDataByDevice] =
    useState<SensorDataByDevice>({});

  const [tabIndex, setTabIndex] = useState(0);

  const fetchSensorData = async (encounterId: string) => {
    try {
      setLoadingSensorData(true);
      console.log("Fetching data for sensor:", encounterId);
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/sensor2/data/${encounterId}`
      );
      if (!response.ok) {
        throw new Error("error in fetch sensor data");
      }
      const data: SensorDataByDevice = await response.json();
      console.log("Sensor data:", data);
      setSensorDataByDevice(data);
    } catch (error) {
      console.error("Failed to fetch data for sensor:", error);
    } finally {
      setLoadingSensorData(false);
    }
  };

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

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`tabpanel-${index}`}
        aria-labelledby={`tab-${index}`}
        {...other}
      >
        {value === index && <Box p={3}>{children}</Box>}
      </div>
    );
  };

  const showNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const note = data.get("note-textfield") as string;
    const newEncounter = encounterService.setClinicalNote(encounter!, note);
    //setEncounter(encounterService.setClinicalNote(encounter!, note));

    console.log("encounter", newEncounter);

    const result = await HandleResult.handleOperation(
      () => encounterService.updateResource(newEncounter!),
      "Encuentro actualizado.",
      "Actualizando..."
    );
    console.log("result_encounter", result);
    if (result.success) {
      setEncounter(newEncounter);
    }
  };

  useEffect(() => {
    setObservationData([]);
    setSensorDataByDevice({});
    fetchEncounter().then((result) => {
      if (result.success) {
        fetchObservation();
        fetchCondition();
        fetchSeguimiento(result.data);
      }
      fetchSensorData(encounterID!);
    });
  }, [encounterID]);

  const handleTabChange = (_, newValue) => {
    setTabIndex(newValue);
  };

  if (loading && loadingSensorData) return <div>loading...</div>;

  return (
    <div style={{ padding: "50px" }}>
      <div>
        <Link
          component="button"
          onClick={() => navigate(`/Patient/${patientID}`)}
          underline="always"
        >
          <Typography variant="h5">{encounter?.subject?.display}</Typography>
        </Link>
        <div>
          <PatientReportComponent
            patientId={patientID!}
            encounterId={encounterID!}
          ></PatientReportComponent>
          <PatientQuestionnaireComponent
            patientID={patientID!}
            encounterID={encounterID!}
          ></PatientQuestionnaireComponent>
        </div>
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
            encounterId={encounterID}
          ></InfoListComponent>
        </div>
        <div style={{ flex: 1 }}>
          <InfoListComponent
            data={conditionData}
            title={"Condiciones"}
            icon={"/inercial.svg"}
            resourceType="Condition"
            encounterId={encounterID}
          ></InfoListComponent>
        </div>
      </div>

      <Box
        component={"form"}
        bgcolor="rgba(228, 233, 242, 0.8)"
        mt="30px"
        borderRadius="10px"
        onSubmit={showNote}
      >
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="Notas" />
          <Tab label="Gráficos del sensor" />
        </Tabs>
        <TabPanel value={tabIndex} index={0}>
          <TextField
            id="note-textfield"
            name="note-textfield"
            label="Notas"
            multiline
            rows={10}
            variant="outlined"
            defaultValue={encounterService.getClinicalNoteExtension(encounter!)}
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            style={{ marginTop: "10px" }}
          >
            Guardar Nota
          </Button>
        </TabPanel>
        <TabPanel value={tabIndex} index={1}>
          <DeviceSensorChart sensorDataByDevice={sensorDataByDevice} />
        </TabPanel>
      </Box>
    </div>
  );
}
