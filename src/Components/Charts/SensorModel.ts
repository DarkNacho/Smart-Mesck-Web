export interface SensorData {
  sensor: string;
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
