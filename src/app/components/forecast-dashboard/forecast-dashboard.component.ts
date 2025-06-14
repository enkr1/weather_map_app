import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastCacheService } from '../../services/forecast-cache.service';
import { combineLatest, map } from 'rxjs';


@Component({
  selector: 'app-forecast-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast-dashboard.component.html',
  styleUrl: './forecast-dashboard.component.scss',
})

export class ForecastDashboardComponent {
  metadata$;
  vm$;

  constructor(private forecastCache: ForecastCacheService) {
    this.forecastCache = this.forecastCache;
    this.metadata$ = this.forecastCache.metadata$;
    this.vm$ = combineLatest([
      this.forecastCache.metadata$,
      this.forecastCache.areaMetadata$,
      this.forecastCache.all$
    ]).pipe(
      // Map to a convenient view model:
      map(([md, areas, full]) => ({
        md,
        areas: areas.length,
        forecasts: full.items[0]?.forecasts?.length || 0
      }))
    );

  }

}
