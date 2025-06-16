import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable, of, ReplaySubject } from 'rxjs';
import { tap, shareReplay, catchError } from 'rxjs/operators';
import { map } from 'rxjs/operators';
import { stations } from '../models/station';

export interface TwoHourForecastItem {
  area: string;
  forecast: string;
}

export interface TwoHourForecastResponse {
  area_metadata: Array<{
    name: string;
    label_location: {
      latitude: number;
      longitude: number;
    };
  }>,
  items: Array<{
    update_timestamp: string;
    timestamp: string;
    valid_period: { start: string; end: string; };
    forecasts: TwoHourForecastItem[];
  }>;
  /* …other top-level fields omitted for brevity… */
}



@Injectable({ providedIn: 'root' })
export class ForecastCacheService {
  private readonly URL =
    'https://api.data.gov.sg/v1/environment/2-hour-weather-forecast';

  // ReplaySubject will cache the last emitted value for any
  // subscribers, even if they subscribe after the HTTP has completed.
  private cache$ = new ReplaySubject<TwoHourForecastResponse>(1);
  private fallback: TwoHourForecastResponse = {
    area_metadata: stations.map(s => ({
      name: s.name,
      label_location: { latitude: s.lat, longitude: s.lng }
    })),
    items: [{
      update_timestamp: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      valid_period: { start: '', end: '' },
      forecasts: stations.map(s => ({
        area: s.name,
        forecast: '[Offline] Recovering ...'
      }))
    }]
  };



  constructor(private http: HttpClient) {
    this.load();  // Kick off the fetch immediately
  }



  /** Fetch and cache the forecast once */
  private load(): void {
    this.http.get<TwoHourForecastResponse>(this.URL)
      .pipe(
        tap(res => console.debug('[ForecastCache] Loaded', res)),
        catchError(error => {
          console.error('[ForecastCache] Load failed:', error);
          return of(this.fallback);
        }),
      )
      .subscribe(this.cache$);
  }

  /** Expose the raw response */
  get all$(): Observable<TwoHourForecastResponse> {
    return this.cache$.asObservable();
  }

  /** Expose just the metadata (first item) */
  get metadata$(): Observable<{
    updateTimestamp: string;
    timestamp: string;
    validStart: string;
    validEnd: string;
  }> {
    return this.all$.pipe(
      tap(res => {
        if (!res.items?.length) {
          console.warn('[ForecastCache] no items array!');
        }
      }),
      // map to only the first item’s metadata
      map((res: TwoHourForecastResponse) => {
        const item = res.items[0]!;
        return {
          updateTimestamp: item.update_timestamp,
          timestamp: item.timestamp,
          validStart: item.valid_period.start,
          validEnd: item.valid_period.end
        };
      }),
      shareReplay(1)
    );
  }

  get areaMetadata$(): Observable<{ name: string; lat: number; lng: number }[]> {
    return this.all$.pipe(
      map(res =>
        res.area_metadata.map(a => ({
          name: a.name,
          lat: a.label_location.latitude,
          lng: a.label_location.longitude
        }))
      ),
      shareReplay(1)
    );
  }

  /** Expose the forecasts array by area */
  public forArea(area: string): Observable<string | null> {
    return this.all$.pipe(
      map((res) => {
        const item = res.items[0]!;
        const f = item.forecasts.find(f => f.area === area);
        return f?.forecast ?? null;
      })
    );
  }
}
