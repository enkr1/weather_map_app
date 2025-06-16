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
import { Station } from '../../models/station';
import { firstValueFrom } from 'rxjs';
import { ForecastCacheService } from '../../services/forecast-cache.service';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private map?: L.Map;
  private markerIndex = new Map<string, L.Marker>();
  private cluster?: any;

  @Output() stationClicked = new EventEmitter<Station>();

  readonly isBrowser: boolean = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private forecastCache: ForecastCacheService,
  ) {
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

  /** Called by the parent when the user chooses a station in search */
  panToStation(st: Station): void {
    console.debug(`[DEBUG] panToStation - Pan to ${st.name} (${st.lat}, ${st.lng})`);
    console.debug('[DEBUG] panToStation - Requested station →', st);

    const marker = this.markerIndex.get(st.name);
    console.debug('[DEBUG] panToStation - marker? →', marker);
    if (!marker || !this.map) { return; }
    console.debug('[DEBUG] panToStation - Found marker →', marker);

    this.cluster!.zoomToShowLayer(marker!, () => {
      marker.openPopup();
      if (this.map) this.map.setView(
        marker.getLatLng(),
        this.map.getZoom() + 1,
        { animate: true }
      );
      // this.map!.panTo(marker.getLatLng(), { animate: true });
    });

    marker.openPopup();
    this.stationClicked.emit(st);
  }


  private async loadAndInitMap() {
    const leafletMod = await import('leaflet');
    const L = leafletMod.default;
    (globalThis as any).L = L;

    // load the plugin *after* you’ve exposed L
    await import('leaflet.markercluster');

    // Thorough cleanup before initialisation
    this.clearMap();

    this.map = L.map('map').setView([1.3521, 103.8198], 11);

    L
      .tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '&copy; OpenStreetMap contributors'
        }
      )
      .addTo(this.map);
    L.Icon.Default.imagePath = 'assets/leaflet/';
    L.Icon.Default.mergeOptions({
      iconUrl: 'marker-icon.png',
      iconRetinaUrl: 'marker-icon-2x.png',
      shadowUrl: 'marker-shadow.png',
    });

    this.cluster = L.markerClusterGroup();

    // Preloaded data
    const stations = await firstValueFrom(this.forecastCache.areaMetadata$);

    stations.forEach(s => {
      const marker = L
        .marker([s.lat, s.lng])
        .bindPopup(`<p style="text-align: center;">${s.name}</p>`)
        .on('click', () => {
          // zoom in by 3.
          this.map?.setView(marker.getLatLng(), this.map.getZoom() + 3, { animate: true });
          return this.stationClicked.emit(s)
        });
      this.cluster.addLayer(marker);
      this.markerIndex.set(s.name, marker);
    });


    this.map.addLayer(this.cluster);
  }


}
