import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, map } from 'rxjs';

export interface StationWeather {
  currentTemp: number;
  currentWindSpeed: number;
  windDirection: number;
  sg2hForecast: string;
  lastUpdateTime: string;

  // Add for charts and dashboard
  // Daily
  dailyTempMax?: number[];
  dailyTempMin?: number[];
  dailyLabels?: string[]; // e.g. ["2025-06-14", "2025-06-15", ...]

  // Hourly
  hourlyTemps?: number[];
  hourlyWinds?: number[];
  hourlyTimes?: string[];
  hourlyHumidity?: number[];
  hourlyDirectRadiation?: number[];
}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private BASE_URL_METEO = 'https://api.open-meteo.com/v1/forecast';
  private URL_SG_2H = 'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';

  constructor(private http: HttpClient) { }



  // REF: https://api.open-meteo.com/v1/forecast?latitude=1.29&longitude=103.85&hourly=relativehumidity_2m,direct_radiation&daily=temperature_2m_max,temperature_2m_min&timezone=Asia%2FSingapore&start_date=2024-11-01&end_date=2024-11-10

  /**
   * Fetches weather and forecast info for a given lat/lng/station name.
   */
  fetchStationWeather(lat: number, lng: number, stationName: string): Observable<StationWeather> {
    console.debug(`[WeatherService] Fetching weather for ${stationName} (${lat}, ${lng})`);
    const meteoUrl = this.BASE_URL_METEO +
      `?` +
      `latitude=${lat}` +
      `&longitude=${lng}` +
      `&hourly=temperature_2m,wind_speed_10m,relativehumidity_2m,direct_radiation` +
      `&daily=temperature_2m_max,temperature_2m_min` +
      `&current_weather=true` +
      `&timezone=auto`

    const meteo$ = this.http
      .get<any>(meteoUrl)
      .pipe(
        map(res => {
          const cw = res.current_weather || {};
          console.debug(`[WeatherService] cw`, cw);
          return {
            // Current
            currentTemp: cw.temperature ?? null,
            currentWindSpeed: cw.windspeed ?? null,
            windDirection: cw.winddirection ?? null,
            lastUpdateTime: cw.time ?? '',
            // Hourly fields
            hourlyTemps: res.hourly?.temperature_2m ?? [],
            hourlyTimes: res.hourly?.time ?? [],
            hourlyWinds: res.hourly?.wind_speed_10m ?? [],
            hourlyHumidity: res.hourly?.relativehumidity_2m ?? [],
            hourlyDirectRadiation: res.hourly?.direct_radiation ?? [],
            // Daily fields
            dailyTempMax: res.daily?.temperature_2m_max ?? [],
            dailyTempMin: res.daily?.temperature_2m_min ?? [],
            dailyLabels: res.daily?.time ?? [],
          };
        })
      );

    const sg2h$ = this.http
      .get<any>(this.URL_SG_2H)
      .pipe(
        map(res => {
          console.debug(`[WeatherService] 2: sg2h$`, res);
          console.debug(`[WeatherService] 3: res.items?.[0]?.forecasts`, res.items?.[0]?.forecasts);
          return res;
        }),
        map(res => {
          const forecasts = res.items?.[0]?.forecasts ?? [];
          const found = forecasts.find((f: any) => f.area === stationName);
          return found?.forecast ?? '[Unavailable]';
        })
      );

    return forkJoin([meteo$, sg2h$]).pipe(
      map(res => {
        console.debug('[WeatherService][forkJoin] combined result', res);
        return res;
      }),
      map(([meteo, sg2hForecast]) => ({
        ...meteo,
        sg2hForecast
      }))
    );


  }
}
