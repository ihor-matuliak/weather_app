export type WeatherCondition = 'clear' | 'cloudy' | 'rain' | 'snow' | 'storm';

export interface Weather {
  city: string;
  country?: string;
  temperature: number;
  description: string;
  condition: WeatherCondition;
  humidity: number;
  windSpeed: number;
}
