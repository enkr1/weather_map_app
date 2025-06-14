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
      const temps = this.data.hourly.temperature2m ?? [];
      const times = this.data.hourly.time ?? [];

      const limit = 24;
      const slicedTemps = temps.slice(-limit);
      const slicedTimes = times.slice(-limit);
      // const prettyTimes = slicedTimes.map(t => t.substring(11, 16)); // "16:00"

      this.lineChartData.datasets[0].data = slicedTemps;
      this.lineChartData.labels = slicedTimes;
      // this.lineChartData.labels = prettyTimes;

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
