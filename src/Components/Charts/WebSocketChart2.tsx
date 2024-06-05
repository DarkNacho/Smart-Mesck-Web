import { useEffect, useState } from "react";
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
import { Tab, Tabs } from "@mui/material";

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

type ChartData = { [device: string]: JSX.Element };

const colorByDeviceAndSensor: { [key: string]: string } = {};

function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
function getColorForDeviceAndSensor(device: string, sensor: string): string {
  const key = `${device}-${sensor}`;
  if (!colorByDeviceAndSensor[key]) {
    colorByDeviceAndSensor[key] = generateRandomColor();
  }
  return colorByDeviceAndSensor[key];
}

export default function WebSocketChart2() {
  const [sensorDataByDevice, isConnected] = useWebSocket(
    import.meta.env.VITE_CHART_SERVER_URL
  );

  const [activeDevice, setActiveDevice] = useState<string>();

  function generateCharts(): ChartData {
    const charts: ChartData = {};
    let labels: string[] = [];
    if (Object.keys(sensorDataByDevice).length > 0) {
      const firstDevice = Object.keys(sensorDataByDevice)[0];
      const firstSensor = Object.keys(sensorDataByDevice[firstDevice])[0];
      labels = sensorDataByDevice[firstDevice][firstSensor].data.map((data) => {
        const time = new Date(data.timestamp_epoch * 1000);
        const milliseconds = data.timestamp_millis;
        const timeString = time.toLocaleTimeString("es-CL", {
          minute: "numeric",
          second: "numeric",
          timeZone: "America/Santiago",
        });

        return `${timeString}.${milliseconds.toString().padStart(3, "0")}`;
      });
    }
    Object.keys(sensorDataByDevice).map((device) => {
      const dataset: {
        label: string;
        data: any[];
        borderColor: string;
        backgroundColor: string;
        borderWidth: number;
        tension: number;
      }[] = [];
      Object.keys(sensorDataByDevice[device]).map((sensor) => {
        const data = sensorDataByDevice[device][sensor];
        const color = getColorForDeviceAndSensor(device, sensor);

        const set = {
          label: `${sensor}`,
          data: data.data.map((data) => data.value),
          borderColor: color,
          backgroundColor: `${color}80`,
          borderWidth: 2,
          tension: 0.5,
        };

        dataset.push(set);
      });

      const options: ChartOptions<"line"> = {
        responsive: true,
        maintainAspectRatio: true,
        /*scales: {
            x: { max: 20 },
          },*/
        plugins: {
          legend: {
            position: "top" as const,
            display: true, // cambiar para mostrar
          },
          title: {
            display: false,
            //text: `Mínimo: ${data.stats.minValue} \t Máximo: ${data.stats.maxValue}`,
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

      const chartElement = (
        <div key={device}>
          <Line data={{ labels, datasets: dataset }} options={options} />
        </div>
      );
      charts[device] = chartElement;
    });

    return charts;
  }

  const charts = generateCharts();

  useEffect(() => {
    // Actualizar activeDevice al primer dispositivo si hay datos disponibles
    if (
      !activeDevice &&
      isConnected &&
      Object.keys(sensorDataByDevice).length > 0
    ) {
      setActiveDevice(Object.keys(sensorDataByDevice)[0]);
    }
  }, [isConnected, sensorDataByDevice]);

  if (!isConnected) return <p>Connecting...</p>;
  else if (Object.keys(charts).length === 0)
    return <p>No data being received</p>;
  else {
    return (
      <div>
        <Tabs
          value={activeDevice}
          onChange={(_, value) => {
            setActiveDevice(value);
          }}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {Object.keys(charts).map((device) => (
            <Tab key={device} label={device} value={device} />
          ))}
        </Tabs>
        {activeDevice && charts[activeDevice]}
      </div>
    );
  }
}
