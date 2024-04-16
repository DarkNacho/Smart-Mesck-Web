import React from "react";
import { Line } from "react-chartjs-2";
import useWebSocket from "./useWebSocket";
import zoomPlugin from "chartjs-plugin-zoom";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const WebSocketChart: React.FC = () => {
  const [sensorDataByDevice, isConnected] = useWebSocket(
    import.meta.env.VITE_CHART_SERVER_URL
  );

  // Crear gráficos para cada combinación de dispositivo y sensor
  const charts = Object.keys(sensorDataByDevice).map((device) => {
    return Object.keys(sensorDataByDevice[device]).map((sensor) => {
      const data = sensorDataByDevice[device][sensor];
      //const labels = data.data.map((data) => data.time);
      const labels = data.data.map((data) => {
        const time = new Date(data.time);
        return time.toLocaleTimeString("en-US", {
          minute: "numeric",
          second: "numeric",
        });
      });

      const dataset = {
        label: `Device: ${device}, Sensor: ${sensor}`,
        data: data.data.map((data) => data.value),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 2,
        tension: 0.5,
      };

      const options: ChartOptions<"line"> = {
        responsive: true,
        plugins: {
          legend: {
            position: "top" as const,
          },
          title: {
            display: true,
            text: `Device: ${device}, Sensor: ${sensor} minValue: ${data.stats.minValue} maxValue: ${data.stats.maxValue}`,
          },
          zoom: {
            pan: {
              enabled: true,
              mode: "xy",
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              pinch: {
                enabled: true,
              },
              mode: "xy",
            },
          },
        },
      };

      return (
        <div key={`${device}-${sensor}`}>
          <Line data={{ labels, datasets: [dataset] }} options={options} />
        </div>
      );
    });
  });

  return (
    <div>
      <h2>Charts</h2>
      {isConnected ? <div>{charts}</div> : <p>Connecting to WebSocket...</p>}
    </div>
  );
};

export default WebSocketChart;
