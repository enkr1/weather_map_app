import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { ForecastCacheService } from '../../services/forecast-cache.service';

@Component({
  selector: 'app-forecast-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="forecast-dashboard" *ngIf="metadata$ | async as md">
      <div><strong>Last Updated:</strong> {{ md.updateTimestamp | date:'short' }}</div>
      <div><strong>Data Timestamp:</strong> {{ md.timestamp       | date:'short' }}</div>
      <div>
        <strong>Valid Period:</strong>
        {{ md.validStart | date:'shortTime' }} –
        {{ md.validEnd   | date:'shortTime' }}
      </div>
    </div>
  `,
  styles: [`
    .forecast-dashboard {
      position: absolute;
      top: 1rem;
      left: 1rem;
      background: rgba(255,255,255,0.85);
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      font-size: 0.9rem;
      z-index: 1001;
      line-height: 1.4;
    }
  `]
})
export class ForecastDashboardComponent {
  metadata$;

  constructor(private forecastCache: ForecastCacheService) {
    this.metadata$ = this.forecastCache.metadata$;
  }

}
