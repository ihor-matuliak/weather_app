import { Component, computed, input } from '@angular/core';

import { Weather, WeatherCondition } from '../../models/weather.model';

const WEATHER_ICONS: Record<WeatherCondition, string> = {
  clear: '☀️',
  cloudy: '☁️',
  rain: '🌧️',
  snow: '❄️',
  storm: '⛈️',
};

@Component({
  selector: 'app-weather-card',
  templateUrl: './weather-card.html',
  styleUrl: './weather-card.scss',
})
export class WeatherCard {
  readonly weather = input.required<Weather>();

  protected readonly icon = computed(() => WEATHER_ICONS[this.weather().condition]);
}
