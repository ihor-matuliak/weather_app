import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Weather } from '../models/weather.model';
import { CityNotFoundError, WeatherService } from './weather.service';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

const geocodingResponse = {
  results: [{ name: 'Київ', country: 'Україна', latitude: 50.45, longitude: 30.52 }],
};

const forecastResponse = {
  current: {
    temperature_2m: 9.6,
    relative_humidity_2m: 71,
    wind_speed_10m: 1.75,
    weather_code: 63,
  },
};

describe('WeatherService', () => {
  let service: WeatherService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(WeatherService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should load weather for a city and map the response', () => {
    let result: Weather | undefined;

    service.getWeather('Київ').subscribe((weather) => (result = weather));

    httpTesting.expectOne((request) => request.url === GEOCODING_URL).flush(geocodingResponse);
    httpTesting.expectOne((request) => request.url === FORECAST_URL).flush(forecastResponse);

    expect(result).toEqual({
      city: 'Київ',
      country: 'Україна',
      temperature: 10,
      description: 'Дощ',
      condition: 'rain',
      humidity: 71,
      windSpeed: 1.8,
    });
  });

  it('should not send new requests for a cached city', () => {
    service.getWeather('Київ').subscribe();
    httpTesting.expectOne((request) => request.url === GEOCODING_URL).flush(geocodingResponse);
    httpTesting.expectOne((request) => request.url === FORECAST_URL).flush(forecastResponse);

    service.getWeather('київ').subscribe();

    httpTesting.expectNone(() => true);
  });

  it('should throw CityNotFoundError when the city does not exist', () => {
    let error: unknown;

    service.getWeather('Неіснуюче').subscribe({ error: (err: unknown) => (error = err) });

    httpTesting.expectOne((request) => request.url === GEOCODING_URL).flush({});

    expect(error).toBeInstanceOf(CityNotFoundError);
  });
});
