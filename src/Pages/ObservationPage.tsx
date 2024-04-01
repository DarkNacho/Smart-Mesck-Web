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

const observationService = new ObservationService();

export default function ObservationPage() {
  const { patientID, observationID } = useParams();
  const [observationInfoData, setObservationInfoData] = useState<
    InfoListData[]
  >([]);

  const [observationData, setObservationData] = useState<Observation[]>();
  const [name, setName] = useState("");

  const fetchData = async () => {
    const result = await observationService.getHistoryById(observationID!);
    if (result.success) {
      setObservationData(result.data);
      const obs = result.data.map((item) => {
        const name = ObservationUtil.getValue(item);
        const value = dayjs(
          item.issued || item.meta?.lastUpdated
        ).toISOString();
        return { name, value };
      });

      setObservationInfoData(obs);
      setName(obs.length > 0 ? ObservationUtil.getName(result.data[0]) : "");
      console.log(result.data);
    }
  };

  const onSubmitForm: SubmitHandler<ObservationFormData> = (data) => {
    let newObservation = observationData?.[0] || ({} as Observation);
    newObservation = {
      ...newObservation,
      valueString: data.valueString,

      subject: { reference: `Patient/${data.subject}` },
      //encounter: { reference: `Encounter/${data.encounter}` },
      performer: [{ reference: `Practitioner/${data.performer}` }],
      category: [{ coding: data.category }], //TODO: cardinalidad a muchos, por lo que debería cambiarlo a lista en vez de sólo un item
      code: { coding: [data.code] },
      interpretation: [{ coding: data.interpretation }],
      issued: dayjs(data.issued).toISOString(),
      note: [{ text: data.note }],
    };
    alert(JSON.stringify(newObservation));
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
    fetchData();
  }, [observationID]);

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
                observation={observationData?.[0]!}
                patientId={patientID!}
                submitForm={onSubmitForm}
                readOnly={checkPatientRol()}
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
