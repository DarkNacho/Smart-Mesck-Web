import ObservationService from "../Services/ObservationService";
import InfoListComponent, {
  InfoListData,
} from "../Components/InfoListComponent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import HistoryChartComponent from "../Components/Charts/HistoryChartComponent";
import { Observation } from "fhir/r4";
import dayjs from "dayjs";

export default function ObservationPage() {
  const observationService = new ObservationService();
  const { observationID } = useParams();

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
          dayjs(item.meta?.lastUpdated).format("HH:mm:ss YYYY-MM-DD") || "";
        return { name, value };
      });

      setObvservationInfoData(obs);
      setName(obs.length > 0 ? observationService.getName(result.data[0]) : "");
      console.log(result.data);
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
          {JSON.stringify(observationData?.[0] || "")}
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
