import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationWeather } from './weather.service';

@Component({
  selector: 'app-weather-modal',
  standalone: true,
  imports: [CommonModule],
  template: `



<div class="modal-content" tabindex="0" aria-modal="true" role="dialog">
  <header class="modal-header">
    <h2>{{ name }}</h2>
    <button class="close-btn" (click)="closeModal.emit()" aria-label="Close">&times;</button>
  </header>

  <section *ngIf="data; else noData">
    <div class="modal-summary">
      <div class="modal-item">
        <span class="modal-label">🌡️ Temp</span>
        <span class="modal-value">{{ data.current?.temperature }} °C</span>
      </div>
      <div class="modal-item">
        <span class="modal-label">💨 Wind</span>
        <span class="modal-value">{{ data.current?.windspeed }} km/h</span>
      </div>
      <div class="modal-item">
        <span class="modal-label">🧭 Direction</span>
        <span class="modal-value">{{ data.current?.winddirection }}°</span>
      </div>
      <div class="modal-item" *ngIf="data.current?.time">
        <span class="modal-label">🕒 Updated</span>
        <span class="modal-value">{{ data.current?.time | date:'short' }}</span>
      </div>
    </div>
    <hr>
    <details>
      <summary>Debug: Full Weather Data</summary>
      <pre>{{ data | json }}</pre>
    </details>
  </section>

  <ng-template #noData>
    <div class="modal-empty">
      <p>❗ No data available.</p>
    </div>
  </ng-template>
</div>



  `,
})


export class WeatherModalComponent implements OnChanges {
  @Input() name = '';
  @Input() data?: StationWeather;
  @Output() closeModal = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data) {
      console.debug('[WeatherModal] Input data:', this.data);
    }
  }

}
