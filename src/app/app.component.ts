import { Component } from '@angular/core';
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
  weatherLoading: boolean = false;

  constructor(private weatherService: WeatherService) { }

  onMarkerClick(station: Station): void {
    console.debug('[App] Marker clicked:', station);

    this.weatherLoading = true;
    console.debug('[App] weatherLoading =', this.weatherLoading);

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
          this.weatherLoading = false;
          console.error('[App] Error fetching weather:', err);
          alert('Error fetching weather data. Please try again later.');
        },
        complete: () => {
          this.weatherLoading = false;
          console.debug('[App] weatherLoading =', this.weatherLoading);
        }
      });
  }


}
