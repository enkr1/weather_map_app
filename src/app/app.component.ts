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
    <app-map
      (stationClicked)="onMarkerClick($event)"
    ></app-map>

    <div *ngIf="weatherLoading">Loading…</div>

    <app-weather-modal
      *ngIf="weatherData"
      [name]="weatherData.name"
      [data]="weatherData"
      (closeModal)="weatherData = undefined">
    </app-weather-modal>

  `
})
export class AppComponent {
  weatherData?: StationWeather & { name: string };
  weatherLoading: boolean = false;

  constructor(private weatherService: WeatherService) { }

  onMarkerClick(station: Station): void {
    console.debug('[App] Marker clicked:', station);

    this.weatherLoading = true;
    this.weatherService
      .fetchStationWeather(station.lat, station.lng, station.name)
      .subscribe({
        next: data => {
          console.debug('[App] Weather data received for', station.name, data);
          this.weatherData = { name: station.name, ...data };
        },
        error: err => {
          console.error('[App] Error fetching weather:', err);
          // Optionally display an error modal or toast
        },
        complete: () => {
          this.weatherLoading = false;
        }
      });
  }


}
