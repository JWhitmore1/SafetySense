export interface SensorData {
  temperature: number, 
  noiseLevel: number, 
  airQuality: number 
  humidity: number,
}

export type warningCategories = 'Temperature' | 'Air Quality' | 'Sound Level'