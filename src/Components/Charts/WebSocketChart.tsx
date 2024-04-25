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

type ChartData = { [device: string]: { [sensor: string]: JSX.Element } };

export default function WebSocketChart() {
  const [sensorDataByDevice, isConnected] = useWebSocket(
    import.meta.env.VITE_CHART_SERVER_URL
  );

  const [activeDevice, setActiveDevice] = useState<string>();
  const [activeSensor, setActiveSensor] = useState<string>();

  function generateCharts(): ChartData {
    const charts: ChartData = {};

    Object.keys(sensorDataByDevice).map((device) => {
      charts[device] = {};

      Object.keys(sensorDataByDevice[device]).map((sensor) => {
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
          maintainAspectRatio: true,
          /*scales: {
            x: { max: 20 },
          },*/
          plugins: {
            legend: {
              position: "top" as const,
              display: false,
            },
            title: {
              display: true,
              text: `Mínimo: ${data.stats.minValue} \t Máximo: ${data.stats.maxValue}`,
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
          <div key={`${device}-${sensor}`}>
            <Line data={{ labels, datasets: [dataset] }} options={options} />
          </div>
        );
        charts[device][sensor] = chartElement;
      });
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
    if (
      !activeSensor &&
      activeDevice &&
      isConnected &&
      Object.keys(sensorDataByDevice[activeDevice]).length > 0
    ) {
      setActiveSensor(Object.keys(sensorDataByDevice[activeDevice])[0]);
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
            setActiveSensor(Object.keys(charts[value])[0]);
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
        {activeDevice && (
          <Tabs
            value={activeSensor}
            onChange={(_, value) => {
              setActiveSensor(value);
            }}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            {Object.keys(charts[activeDevice]).map((sensor) => (
              <Tab key={sensor} label={sensor} value={sensor} />
            ))}
          </Tabs>
        )}
        {activeDevice && activeSensor && charts[activeDevice][activeSensor]}
      </div>
    );
  }
}
