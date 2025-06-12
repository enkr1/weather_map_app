import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationWeather } from './weather.service';

@Component({
  selector: 'app-weather-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop" (click)="close()"></div>
    <div class="modal">
      <h2>{{ name }}</h2>
      <p>🌡️ Temp: {{ data.currentTemp }} °C</p>
      <p>💨 Wind: {{ data.currentWindSpeed }} m/s</p>
      <p>📅 Forecast: {{ data.sg2hForecast }}</p>
      <button (click)="close()">Close</button>
    </div>
  `,
  styles: [`
    .modal-backdrop {
      position: fixed; top:0; left:0; right:0; bottom:0;
      background: rgba(0,0,0,0.5);
    }
    .modal {
      position: fixed; background: #fff; padding: 1em;
      top:50%; left:50%; transform:translate(-50%,-50%);
      border-radius: 8px; box-shadow:0 2px 10px rgba(0,0,0,0.3);
    }
  `]
})
export class WeatherModalComponent {
  @Input() name!: string;
  @Input() data!: StationWeather;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
