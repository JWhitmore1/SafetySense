export interface ServerData {
  dataAvailable: boolean,
  data: SensorData
}

export interface SensorData {
  temperature: number, 
  noiseLevel: number, 
  airQuality: number 
  uvIndex?: number
}

export type dataCategory = 'Temperature' | 'Air Quality' | 'Sound Level'