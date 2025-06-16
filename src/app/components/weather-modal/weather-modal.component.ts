import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { StationWeather } from '../../services/weather.service';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { BaseChartDirective } from 'ng2-charts';

// ✅ Register Chart core + plugin ONCE here:
Chart.register(...registerables, annotationPlugin);

@Component({
  selector: 'app-weather-modal',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './weather-modal.component.html',
  styleUrl: './weather-modal.component.scss',
})
export class WeatherModalComponent implements OnChanges, AfterViewInit {
  @Input() name = '';
  @Input() data?: StationWeather;
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  currentIndex = 0;

  public lineChartType: ChartType = 'line';
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { title: { display: true, text: 'Time' } },
      y: { title: { display: true, text: 'Temperature (°C)' } },
    },
    plugins: {
      legend: { display: false },
      annotation: {
        annotations: {
          nowLine: {
            type: 'line',
            xMin: 0,
            xMax: 0,
            borderColor: 'red',
            borderWidth: 1,
            label: {
              content: 'Now',
              backgroundColor: 'red',
              color: '#fff',
              position: 'start',
            },
          },
        },
      },
    },
  };

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Temperature',
        fill: true,
        tension: 0.4,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.3)',
      },
    ],
  };

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.data?.hourly) {
      const allTimes = this.data.hourly.time;
      const allTemps = this.data.hourly.temperature2m;

      const now = new Date();
      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      const tomorrowEnd = new Date(todayStart);
      tomorrowEnd.setDate(todayStart.getDate() + 1);
      tomorrowEnd.setHours(23, 59, 59, 999);

      const filteredTimes: string[] = [];
      const filteredTemps: number[] = [];

      allTimes.forEach((iso, idx) => {
        const t = new Date(iso);
        if (t >= todayStart && t <= tomorrowEnd) {
          filteredTimes.push(iso);
          filteredTemps.push(allTemps[idx]);
        }
      });

      this.lineChartData.labels = filteredTimes.map((iso) =>
        iso.slice(11, 16)
      );
      this.lineChartData.datasets[0].data = filteredTemps;

      // Recompute filteredTimes & this.currentIndex...
      const nowHour = new Date().getHours();
      this.currentIndex = filteredTimes.findIndex(t => new Date(t).getHours() === nowHour);
      if (this.currentIndex < 0) this.currentIndex = 0;

      // Safely navigate the nested structure:
      // Safely retrieve annotations
      const annPlugin = this.lineChartOptions?.plugins?.annotation;
      const anns = annPlugin?.annotations;

      // If 'annotations' is an object (not an array), update nowLine
      if (anns && !Array.isArray(anns) && 'nowLine' in anns) {
        const line = (anns as Record<string, any>)['nowLine'];
        line.xMin = this.currentIndex;
        line.xMax = this.currentIndex;
      }

        this.chart?.update();
    }
  }

  ngAfterViewInit() {
    // Optional: ensure chart adjusts if modal opens
    setTimeout(() => this.chart?.update(), 0);
  }
}
