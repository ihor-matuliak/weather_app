import { Injectable } from '@angular/core';

import { Weather } from '../models/weather.model';

export const CACHE_TTL_MS = 10 * 60 * 1000;

interface CacheEntry {
  weather: Weather;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class WeatherCacheService {
  private readonly entries = new Map<string, CacheEntry>();

  get(city: string): Weather | null {
    const key = this.toKey(city);
    const entry = this.entries.get(key);

    if (!entry) {
      return null;
    }

    if (Date.now() >= entry.expiresAt) {
      this.entries.delete(key);
      return null;
    }

    return entry.weather;
  }

  set(city: string, weather: Weather): void {
    this.entries.set(this.toKey(city), {
      weather,
      expiresAt: Date.now() + CACHE_TTL_MS,
    });
  }

  private toKey(city: string): string {
    return city.trim().toLowerCase();
  }
}
