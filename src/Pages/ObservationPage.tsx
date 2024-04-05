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

export default function ObservationPage() {
  const { patientID, observationID } = useParams();
  const [observationInfoData, setObservationInfoData] = useState<
    InfoListData[]
  >([]);

  const [observationData, setObservationData] = useState<Observation[]>([]);
  const [name, setName] = useState("");

  const [result, setResult] = useState(false);

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

  const onSubmitForm: SubmitHandler<ObservationFormData> = (data) => {
    const newObservation =
      ObservationUtils.ObservationFormDataToObservation(data);
    console.log(newObservation);
    sendObservation(newObservation);
  };

  const sendObservation = async (newObservation: Observation) => {
    HandleResult.handleOperation(
      () => new ObservationService().sendResource(newObservation),
      "Observación guardada exitosamente",
      "Enviando..."
    );
  };

  useEffect(() => {
    setObservationInfoData([]);
    fetchData().then((res) => setResult(res));
  }, [observationID]);

  if (result && observationData.length === 0) return <div>No data</div>;

  if (!result) return <div>Ha ocurrido un error</div>;

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
                formId="form"
                observation={observationData[0]}
                patientId={patientID!}
                submitForm={onSubmitForm}
                readOnly={checkPatientRol()}
                practitionerId={ObservationUtil.getFirstPerformerId(
                  observationData[0]
                )}
              ></ObservationFormComponent>
              {!checkPatientRol() && (
                <Button
                  color="primary"
                  variant="contained"
                  form="form"
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
