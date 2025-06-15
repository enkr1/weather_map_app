import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationWeather } from '../../services/weather.service';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-weather-modal',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
  ],
  templateUrl: `./weather-modal.component.html`,
  styleUrl: './weather-modal.component.scss',
})




export class WeatherModalComponent implements OnChanges {
  @Input() name = '';
  @Input() data?: StationWeather;
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;



  // Chart setup:
  public lineChartType: ChartType = 'line';
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Time' } },
      y: { title: { display: true, text: 'Temperature (°C)' } }
    },
    plugins: { legend: { display: false } }
  };
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [{
      data: [],
      label: 'Temp',
      fill: true,
      tension: 0.4,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.3)'
    }]
  };


  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data?.hourly) {
      const times = this.data.hourly.time ?? [];
      const temps = this.data.hourly.temperature2m ?? [];

      // Define boundaries
      const now = new Date();
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date(now);
      end.setDate(now.getDate() + 1); // tomorrow
      end.setHours(23, 59, 59, 999);

      console.debug('[DEBUG] Start:', start.toISOString());
      console.debug('[DEBUG] End:', end.toISOString());
      start.setHours(0, 0, 0, 0);

      const filteredTimes = times.filter((iso) => {
        const t = new Date(iso);
        return t >= start && t <= end;
      });
      // Safe indices:
      const startIdx = times.indexOf(filteredTimes[0]!);
      const endIdx = times.indexOf(filteredTimes[filteredTimes.length - 1]!);

      // Slice safely:
      const filteredTemps = temps.slice(startIdx, endIdx + 1);

      this.lineChartData.labels = filteredTimes.map(iso => iso.slice(11, 16)); // "HH:MM"
      this.lineChartData.datasets[0].data = filteredTemps;



      this.chart?.update();
    }
  }

  ngAfterViewInit() {
    // if modal is already open, you can force a resize:
    setTimeout(() => this.chart?.update(), 0);
  }

  // Or, hook into your modal’s “opened” event:
  onModalOpened() {
    this.chart?.update();
  }




}
