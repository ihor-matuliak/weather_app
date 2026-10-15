import { WeatherCondition } from '../models/weather.model';

interface WeatherCodeInfo {
  description: string;
  condition: WeatherCondition;
}

const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { description: 'Ясно', condition: 'clear' },
  1: { description: 'Переважно ясно', condition: 'clear' },
  2: { description: 'Мінлива хмарність', condition: 'cloudy' },
  3: { description: 'Похмуро', condition: 'cloudy' },
  45: { description: 'Туман', condition: 'cloudy' },
  48: { description: 'Туман з інеєм', condition: 'cloudy' },
  51: { description: 'Легка мряка', condition: 'rain' },
  53: { description: 'Мряка', condition: 'rain' },
  55: { description: 'Сильна мряка', condition: 'rain' },
  56: { description: 'Крижана мряка', condition: 'rain' },
  57: { description: 'Сильна крижана мряка', condition: 'rain' },
  61: { description: 'Невеликий дощ', condition: 'rain' },
  63: { description: 'Дощ', condition: 'rain' },
  65: { description: 'Сильний дощ', condition: 'rain' },
  66: { description: 'Крижаний дощ', condition: 'rain' },
  67: { description: 'Сильний крижаний дощ', condition: 'rain' },
  71: { description: 'Невеликий сніг', condition: 'snow' },
  73: { description: 'Сніг', condition: 'snow' },
  75: { description: 'Сильний сніг', condition: 'snow' },
  77: { description: 'Снігова крупа', condition: 'snow' },
  80: { description: 'Невелика злива', condition: 'rain' },
  81: { description: 'Злива', condition: 'rain' },
  82: { description: 'Сильна злива', condition: 'rain' },
  85: { description: 'Снігопад', condition: 'snow' },
  86: { description: 'Сильний снігопад', condition: 'snow' },
  95: { description: 'Гроза', condition: 'storm' },
  96: { description: 'Гроза з градом', condition: 'storm' },
  99: { description: 'Гроза з сильним градом', condition: 'storm' },
};

const UNKNOWN_WEATHER: WeatherCodeInfo = { description: 'Невідомо', condition: 'cloudy' };

export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  return WEATHER_CODES[code] ?? UNKNOWN_WEATHER;
}
