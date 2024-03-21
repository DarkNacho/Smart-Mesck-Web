import ObservationService from "../Services/ObservationService";
import InfoListComponent, {
  InfoListData,
} from "../Components/InfoListComponent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import HistoryChartComponent from "../Components/Charts/HistoryChartComponent";
import { Observation } from "fhir/r4";
import dayjs from "dayjs";
import ObservationFormComponent, { ObservationFormData } from "../Components/Forms/ObservationFormComponent";
import toast from "react-hot-toast";
import { SubmitHandler } from "react-hook-form";

export default function ObservationPage() {
  const observationService = new ObservationService();
  const { patientID, observationID } = useParams();

  const [obvservationInfoData, setObvservationInfoData] = useState<
    InfoListData[]
  >([]);

  const [observationData, setObservationData] = useState<Observation[]>();
  const [name, setName] = useState("");

  const fetchData = async () => {
    const result = await observationService.getHistoryById(observationID!);
    if (result.success) {
      setObservationData(result.data);
      const obs = result.data.map((item) => {
        const name = observationService.getValue(item);
        const value =
          dayjs(item.issued || item.meta?.lastUpdated).toISOString();
        return { name, value };
      });

      setObvservationInfoData(obs);
      setName(obs.length > 0 ? observationService.getName(result.data[0]) : "");
      console.log(result.data);
    }
  };


  const onSubmitForm: SubmitHandler<ObservationFormData> = (data) => {

    var newObservation = observationData?.[0] || {} as Observation;
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
    alert(JSON.stringify(newObservation))
    console.log(newObservation);
    sendObservation(newObservation);
  };

  const sendObservation = async (newObservation: Observation) => {
    const response = await toast.promise(
      new ObservationService().sendResource(newObservation),
      {
        loading: "Enviado..",
        success: (result) => {
          if (result.success) {
            return "Enviado de forma exitosa";
          } else {
            throw Error(result.error);
          }
        },
        error: (result) => result.toString(),
      }
    );

    if (response.success) {
      console.log(response.data);
    } else {
      console.error(response.error);
    }
  };

  useEffect(() => {
    setObvservationInfoData([]);
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
        <div style={{ background: "#e4e9f2" }}>

          {obvservationInfoData.length >= 1 && (<div>
            <ObservationFormComponent formId="form"
              observation={observationData?.[0]!}
              patientId={patientID!}
              submitForm={onSubmitForm}>
            </ObservationFormComponent>
            <button form="form" type="submit">test</button>
          </div>)}
        </div>
        <InfoListComponent
          data={obvservationInfoData}
          title={"Historial"}
          icon={"/hearth.svg"}
          resourceType="Observation"
        ></InfoListComponent>

        {obvservationInfoData.length > 1 && (
          <HistoryChartComponent
            data={obvservationInfoData}
          ></HistoryChartComponent>
        )}
      </div>
    </div>
  );
}
