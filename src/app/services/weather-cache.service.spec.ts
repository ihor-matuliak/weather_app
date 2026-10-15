import { TestBed } from '@angular/core/testing';

import { Weather } from '../models/weather.model';
import { CACHE_TTL_MS, WeatherCacheService } from './weather-cache.service';

const weather: Weather = {
  city: 'Київ',
  country: 'Україна',
  temperature: 12,
  description: 'Ясно',
  condition: 'clear',
  humidity: 60,
  windSpeed: 3.5,
};

describe('WeatherCacheService', () => {
  let cache: WeatherCacheService;

  beforeEach(() => {
    vi.useFakeTimers();
    cache = TestBed.inject(WeatherCacheService);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return null for a city that is not cached', () => {
    expect(cache.get('Київ')).toBeNull();
  });

  it('should return cached weather regardless of case and spaces', () => {
    cache.set('Київ', weather);

    expect(cache.get('  київ ')).toEqual(weather);
  });

  it('should return null when the cache entry has expired', () => {
    cache.set('Київ', weather);

    vi.advanceTimersByTime(CACHE_TTL_MS);

    expect(cache.get('Київ')).toBeNull();
  });
});
