import { useParams } from "react-router-dom";
import WebSocketChart from "../Components/Charts/WebSocketChart";

export default function SensorChartDashboardPage() {
  const { token } = useParams();

  return (
    <div
      style={{
        backgroundColor: "white",
        marginTop: "100px",
      }}
    >
      {!token && <WebSocketChart patientId={localStorage.getItem("id")!} />}
      {token && <WebSocketChart token={token} />}
    </div>
  );
}
