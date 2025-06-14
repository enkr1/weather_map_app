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
  // styleUrls: ['./weather-modal.component.scss'],
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
      // 1️⃣ set correct labels (time strings) :contentReference[oaicite:3]{index=3}
      this.lineChartData.labels = this.data.hourly.time;
      // 2️⃣ set correct data (temperature values)
      this.lineChartData.datasets[0].data = this.data.hourly.temperature2m;
      // 3️⃣ tell Chart to re-render :contentReference[oaicite:4]{index=4}
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
