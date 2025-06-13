import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, StationWeather } from './weather.service';
import { MapComponent } from './map/map.component';
import { WeatherModalComponent } from './weather-modal.component';
import { Station } from './stations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MapComponent,
    WeatherModalComponent,
  ],
  template: `
  <div style="position: relative;">
    <app-map (stationClicked)="onMarkerClick($event)"></app-map>

    <!-- Loading overlay -->
    <div *ngIf="weatherLoading" class="loading-overlay">
      Loading..
    </div>

    <div class="weather-modal">
      <app-weather-modal
        *ngIf="weatherData"
        [name]="weatherData.name"
        [data]="weatherData"
        (closeModal)="weatherData = undefined">
      </app-weather-modal>
    </div>
  </div>
  `
})
export class AppComponent {
  weatherData?: StationWeather & { name: string };
  weatherLoading: boolean = false;

  constructor(private weatherService: WeatherService) { }

  onMarkerClick(station: Station): void {
    console.debug('[App] Marker clicked:', station);

    this.weatherLoading = true;
    console.debug('[App] weatherLoading =', this.weatherLoading);

    this.weatherService.fetchStationWeather(station.lat, station.lng, station.name)
      .subscribe({
        next: data => {
          this.weatherData = { name: station.name, ...data };
        },
        error: err => {
          console.error('[App] Error fetching weather:', err);
        },
        complete: () => {
          this.weatherLoading = false;
          console.debug('[App] weatherLoading =', this.weatherLoading);
        }
      });
  }


}
