import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastCacheService } from '../../services/forecast-cache.service';
import { combineLatest, map } from 'rxjs';


@Component({
  selector: 'app-forecast-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="frosted-container forecast-dashboard" *ngIf="vm$ | async as vm">
      <div><strong>Last Updated:</strong> {{ vm.md.updateTimestamp | date:'short' }}</div>
      <div><strong>Data Timestamp:</strong> {{ vm.md.timestamp | date:'short' }}</div>
      <div>
        <strong>Valid Period:</strong>
        {{ vm.md.validStart | date:'shortTime' }} – {{ vm.md.validEnd | date:'shortTime' }}
      </div>
      <div><strong>Areas Loaded:</strong> {{ vm.areas }} locations</div>
      <div><strong>Forecasts:</strong> {{ vm.forecasts }} entries</div>
    </div>
  `,
  styles: [`
    .forecast-dashboard {
      position: absolute;
      top: 1rem;
      left: 4rem;
      padding: 0.75rem 1rem;
      font-size: 0.9rem;
      z-index: 1001;
      line-height: 1.6;
    }
  `]
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
