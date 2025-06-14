import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable, map } from 'rxjs';
import { ForecastCacheService } from './forecast-cache.service';



export interface StationWeather {

  // Meta
  latitude: number;
  longitude: number;
  generationtimeMs: number;
  utcOffsetSeconds: number;
  timezone: string;
  timezoneAbbreviation: string;
  elevation: number;

  // 2-hour forecast
  sg2hForecast: string | null;

  // Current
  current: {
    time: string;             // "2025-06-13T16:45"
    interval: number;        // seconds
    temperature: number;      // °C
    windspeed: number;        // km/h
    winddirection: number;    // degrees
    isDay: boolean;           // true/false
    weathercode: number;      // WMO code (for icon/description)
  };

  // Units for UI
  units: {
    temp: string;
    windspeed: string;
    winddirection: string;
    // add as needed
  };

  // Hourly for charts
  hourly: {
    time: string[];
    temperature2m: number[];
    windSpeed10m: number[];
  };

}

@Injectable({ providedIn: 'root' })
export class WeatherService {
  private readonly BASE_URL_METEO = 'https://api.open-meteo.com/v1/forecast';

  constructor(
    private http: HttpClient,
    private forecastCache: ForecastCacheService
  ) { }



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
          console.debug(`[WeatherService] res`, res);

          return {
            latitude: res.latitude,
            longitude: res.longitude,
            generationtimeMs: res.generationtime_ms,
            utcOffsetSeconds: res.utc_offset_seconds,
            timezone: res.timezone,
            timezoneAbbreviation: res.timezone_abbreviation,
            elevation: res.elevation,
            current: {
              time: res.current_weather?.time,
              interval: res.current_weather?.interval,
              temperature: res.current_weather?.temperature,
              windspeed: res.current_weather?.windspeed,
              winddirection: res.current_weather?.winddirection,
              isDay: !!res.current_weather?.is_day,
              weathercode: res.current_weather?.weathercode,
            },
            hourly: {
              time: res.hourly?.time ?? [],
              temperature2m: res.hourly?.temperature_2m ?? [],
              windSpeed10m: res.hourly?.wind_speed_10m ?? [],
            },
            units: {
              temp: res.current_weather_units?.temperature || '°C',
              windspeed: res.current_weather_units?.windspeed || 'km/h',
              winddirection: res.current_weather_units?.winddirection || '°',
            },
          };

        })
      );

    const sg2h$ = this.forecastCache.forArea(stationName);

    return forkJoin([meteo$, sg2h$]).pipe(
      map(([meteo, sg2h]) => ({
        ...meteo,
        sg2hForecast: sg2h ?? 'Unavailable'
      }))
    );



  }
}
