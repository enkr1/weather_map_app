import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, map } from 'rxjs';

export interface StationWeather {
  currentTemp: number;
  currentWindSpeed: number;
  sg2hForecast: string;
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private http: HttpClient) { }

  fetchStationWeather(lat: number, lng: number, stationName: string): Observable<StationWeather> {
    const meteo$ = this.http.get<any>(
      `https://api.open-meteo.com/v1/forecast` +
      `?` +
      `latitude=${lat}` +
      `&longitude=${lng}` +
      `&hourly=temperature_2m,wind_speed_10m` +
      `&current_weather=true` +
      `&timezone=auto`
    );

    const sg2h$ = this.http.get<any>(
      'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast'
    ).pipe(
      map(res => {
        const f = res.items?.[0]?.forecasts?.find((f: any) => f.area === stationName);
        return f?.forecast || 'Unavailable';
      })
    );

    return forkJoin({ meteo: meteo$, sg2h: sg2h$ }).pipe(
      map(({ meteo, sg2h }) => ({
        currentTemp: meteo.current_weather.temperature_2m,
        currentWindSpeed: meteo.current_weather.wind_speed_10m,
        sg2hForecast: sg2h
      }))
    );
  }


}
