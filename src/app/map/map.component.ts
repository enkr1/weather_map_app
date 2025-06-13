import {
  Component,
  AfterViewInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { stations, Station } from '../stations';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  template: `<div *ngIf="isBrowser" id="map" style="height:100vh;"></div>`,
})
export class MapComponent implements AfterViewInit, OnDestroy {
  isBrowser!: boolean;
  private map?: L.Map;

  @Output() stationClicked = new EventEmitter<Station>();

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnDestroy() {
    this.clearMap();
  }

  async ngAfterViewInit(): Promise<void> {
    if (!this.isBrowser) return;
    await this.loadAndInitMap();
  }

  private clearMap() {
    if (this.map) {
      this.map.off();
      this.map.remove();
      this.map = undefined;
    }
    if (typeof document !== 'undefined') {
      const el = document.getElementById('map');
      if (el && (el as any)._leaflet_id) {
        delete (el as any)._leaflet_id;
      }
    }
  }
  private async loadAndInitMap() {
    const L = await import('leaflet');
    (globalThis as any).L = L; // Makes L global for the plugin

    await import('leaflet.markercluster');

    // Thorough cleanup before initialisation
    this.clearMap();

    this.map = L.map('map').setView([1.3521, 103.8198], 13);
    L
      .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      })
      .addTo(this.map);
    L.Icon.Default.imagePath = 'assets/leaflet/';
    L.Icon.Default.mergeOptions({
      iconUrl: 'marker-icon.png',
      iconRetinaUrl: 'marker-icon-2x.png',
      shadowUrl: 'marker-shadow.png',
    });

    const cluster = L.markerClusterGroup();

    stations.forEach(s => {
      const marker = L.marker([s.lat, s.lng])
        .bindPopup(`<p>V2: ${s.name}</p>`)
        .on('click', () => this.stationClicked.emit(s));
      cluster.addLayer(marker);
    });

    this.map.addLayer(cluster);
  }
}
