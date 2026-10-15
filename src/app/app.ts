import { Component, computed, inject, signal } from '@angular/core';
import { finalize } from 'rxjs';

import { SearchForm } from './components/search-form/search-form';
import { WeatherCard } from './components/weather-card/weather-card';
import { Weather } from './models/weather.model';
import { CityNotFoundError, WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  imports: [SearchForm, WeatherCard],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly weatherService = inject(WeatherService);

  protected readonly weather = signal<Weather | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly theme = computed(() => this.weather()?.condition ?? 'default');

  protected searchWeather(city: string): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.weatherService
      .getWeather(city)
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (weather) => this.weather.set(weather),
        error: (error: unknown) => {
          this.weather.set(null);
          this.errorMessage.set(this.getErrorMessage(error));
        },
      });
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof CityNotFoundError) {
      return 'Місто не знайдено. Перевірте назву та спробуйте ще раз.';
    }

    return 'Не вдалося отримати прогноз. Спробуйте пізніше.';
  }
}
