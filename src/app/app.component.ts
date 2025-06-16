import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService, StationWeather } from './services/weather.service';
import { MapComponent } from './components/map/map.component';
import { WeatherModalComponent } from './components/weather-modal/weather-modal.component';
import { Station } from './models/station';
import { ForecastDashboardComponent } from './components/forecast-dashboard/forecast-dashboard.component';
import { SearchStationContainerComponent } from './components/search-station-container/search-station-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MapComponent,
    WeatherModalComponent,
    ForecastDashboardComponent,
    SearchStationContainerComponent,
  ],
  templateUrl: "./app.component.html",
})



export class AppComponent {
  weatherData?: StationWeather & { name: string };
  picked?: Station;
  @ViewChild('mapComp') mapComp!: MapComponent;

  constructor(private weatherService: WeatherService) {

  }

  onStationChosen(st: Station) {
    this.picked = st;
    this.mapComp.panToStation(st);
  }

  closeModal(): void {
    this.picked = undefined;
  }

  onMarkerClick(station: Station): void {
    this.picked = station;
    console.debug('[DEBUG] Marker clicked:', station);

    this.weatherService
      .fetchStationWeather(
        station.lat,
        station.lng,
        station.name
      )
      .subscribe({
        next: data => {
          this.weatherData = { name: station.name, ...data };
        },
        error: err => {
          console.error('[DEBUG] Error fetching weather:', err);
          alert('Error fetching weather data. Please try again later.');
        },
        complete: () => {
          console.debug('[DEBUG] complete');
        }
      });
  }


}
