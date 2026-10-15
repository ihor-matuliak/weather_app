import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, of, switchMap, tap } from 'rxjs';

import { ForecastResponse, GeocodingResponse, GeocodingResult } from '../models/open-meteo.model';
import { Weather } from '../models/weather.model';
import { getWeatherCodeInfo } from '../utils/weather-codes';
import { WeatherCacheService } from './weather-cache.service';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

export class CityNotFoundError extends Error {
  constructor(city: string) {
    super(`City "${city}" was not found`);
    this.name = 'CityNotFoundError';
  }
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly cache = inject(WeatherCacheService);

  getWeather(city: string): Observable<Weather> {
    const cachedWeather = this.cache.get(city);

    if (cachedWeather) {
      return of(cachedWeather);
    }

    return this.findCity(city).pipe(
      switchMap((location) => this.fetchCurrentWeather(location)),
      tap((weather) => this.cache.set(city, weather)),
    );
  }

  private findCity(city: string): Observable<GeocodingResult> {
    const params = { name: city, count: 1, language: 'uk' };

    return this.http.get<GeocodingResponse>(GEOCODING_API_URL, { params }).pipe(
      map((response) => {
        const location = response.results?.[0];

        if (!location) {
          throw new CityNotFoundError(city);
        }

        return location;
      }),
    );
  }

  private fetchCurrentWeather(location: GeocodingResult): Observable<Weather> {
    const params = {
      latitude: location.latitude,
      longitude: location.longitude,
      current: 'temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code',
      wind_speed_unit: 'ms',
    };

    return this.http
      .get<ForecastResponse>(FORECAST_API_URL, { params })
      .pipe(map((response) => this.toWeather(location, response)));
  }

  private toWeather(location: GeocodingResult, response: ForecastResponse): Weather {
    const { current } = response;
    const { description, condition } = getWeatherCodeInfo(current.weather_code);

    return {
      city: location.name,
      country: location.country,
      temperature: Math.round(current.temperature_2m),
      description,
      condition,
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m * 10) / 10,
    };
  }
}
