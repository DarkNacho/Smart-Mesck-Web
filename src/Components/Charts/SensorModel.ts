export interface SensorData {
  sensor_type: string;
  device: string;
  time: string;
  value: number;
}

export interface SensorStats {
  minValue: number;
  maxValue: number;
}

export interface Sensor {
  data: SensorData[];
  stats: SensorStats;
  metrics: number | undefined;
}

export type SensorDataByDevice = Record<string, Record<string, Sensor>>; // keys = device, sensor
