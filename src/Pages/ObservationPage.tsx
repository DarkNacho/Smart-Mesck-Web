import ObservationService from "../Services/ObservationService";
import InfoListComponent, {
  InfoListData,
} from "../Components/InfoListComponent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import HistoryChartComponent from "../Components/Charts/HistoryChartComponent";
import { Observation } from "fhir/r4";
import dayjs from "dayjs";
import ObservationFormComponent, {
  ObservationFormData,
} from "../Components/Forms/ObservationFormComponent";
import ObservationUtil from "../Services/Utils/ObservationUtils";
import { SubmitHandler } from "react-hook-form";
import { checkPatientRol } from "../RolUser";
import { Button } from "@mui/material";
import HandleResult from "../Components/HandleResult";
import ObservationUtils from "../Services/Utils/ObservationUtils";

const observationService = new ObservationService();
let practitionerId: string | undefined;
export default function ObservationPage() {
  const { patientID, observationID } = useParams();
  const [observationInfoData, setObservationInfoData] = useState<
    InfoListData[]
  >([]);

  const [observation, setObservation] = useState<Observation>();
  const [name, setName] = useState("");

  const [result, setResult] = useState(false);

  /*
  const fetchData = async () => {
    const result = await observationService.getHistoryById(observationID!);
    if (!result.success) return false;

    setObservationData(result.data);
    const obs = result.data.map((item) => {
      const name = ObservationUtil.getValue(item);
      const value = dayjs(item.issued || item.meta?.lastUpdated).toISOString();
      return { name, value };
    });

    setObservationInfoData(obs);
    setName(obs.length > 0 ? ObservationUtil.getName(result.data[0]) : "");
    console.log(result.data);
    return true;
  };
  */

  const fetchHistory = async (
    observation: Observation
  ): Promise<Result<Observation[]>> => {
    const length = observation?.meta?.versionId || "0";
    const data: Observation[] = [observation];
    for (let i = 1; i < parseInt(length); i++) {
      const result = await observationService.getVbyId(
        observationID!,
        i.toString()
      );
      if (!result.success) {
        console.error("Error fetching version", i);
        return { success: false, error: `Error fetching version: ${i}` };
      }
      data.push(result.data);
    }

    return { success: true, data };
  };

  const fetchObservation = async () => {
    const result = await HandleResult.handleOperation(
      () => observationService.getById(observationID!),
      "Observación Obtenida",
      "Obteniendo Observación...",
      setObservation
    );
    console.log("fetchObservation", result);
    return result;
  };

  const onSubmitForm: SubmitHandler<ObservationFormData> = (data) => {
    const newObservation = {
      ...observation!,
      ...ObservationUtils.ObservationFormDataToObservation(data),
    };
    sendObservation(newObservation);
  };

  const sendObservation = async (newObservation: Observation) => {
    console.log("sending.. ", newObservation);
    HandleResult.handleOperation(
      () => new ObservationService().sendResource(newObservation),
      "Observación guardada exitosamente",
      "Enviando..."
    );
  };

  const fetchData = async (): Promise<Result<InfoListData[]>> => {
    return fetchObservation()
      .then((res) => {
        if (!res.success) return res;
        setName(ObservationUtil.getName(res.data));
        setObservation(res.data);
        practitionerId = ObservationUtil.getFirstPerformerId(res.data);
        return fetchHistory(res.data);
      })
      .then((res) => {
        if (!res.success) return res;
        const obs = res.data.map((item) => {
          const name = ObservationUtil.getValue(item);
          const value = dayjs(
            item.issued || item.meta?.lastUpdated
          ).toISOString();
          return { name, value };
        });
        setResult(true);
        return { success: true, data: obs };
      });
  };

  useEffect(() => {
    HandleResult.handleOperation(
      fetchData,
      "Datos Obtenidos exitosamente.",
      "Obteniendo datos...",
      setObservationInfoData
    );
  }, [observationID]);

  if (result && observation === undefined) return <div>No data</div>;

  if (!observation) return <div>loading...</div>;

  console.log("result", result);
  return (
    <div style={{ padding: "50px", paddingTop: "20px" }}>
      <div>
        <h1>{name}</h1>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "50px",
          flexDirection: "column",
        }}
      >
        <div style={{ background: "#e4e9f2", padding: "10px" }}>
          {observationInfoData.length >= 1 && (
            <div>
              <ObservationFormComponent
                formId="formObservation"
                observation={observation}
                patientId={observation.subject?.reference?.split("/")[1] || ""}
                submitForm={onSubmitForm}
                readOnly={checkPatientRol()}
                practitionerId={practitionerId}
              ></ObservationFormComponent>
              {!checkPatientRol() && (
                <Button
                  color="primary"
                  variant="contained"
                  form="formObservation"
                  type="submit"
                >
                  Guardar
                </Button>
              )}
            </div>
          )}
        </div>
        <InfoListComponent
          data={observationInfoData}
          title={"Historial"}
          icon={"/hearth.svg"}
          resourceType="Observation"
        ></InfoListComponent>

        {observationInfoData.length > 1 && (
          <HistoryChartComponent
            data={observationInfoData.reverse()}
          ></HistoryChartComponent>
        )}
      </div>
    </div>
  );
}
