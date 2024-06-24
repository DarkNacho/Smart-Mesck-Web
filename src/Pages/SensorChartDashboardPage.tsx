import WebSocketChart from "../Components/Charts/WebSocketChart";

export default function SensorChartDashboardPage() {
  return (
    <div
      style={{
        backgroundColor: "white",
        marginTop: "100px",
      }}
    >
      <WebSocketChart patientId={localStorage.getItem("id")!} />
    </div>
  );
}
