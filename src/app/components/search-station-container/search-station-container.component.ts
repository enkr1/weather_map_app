import { Component, EventEmitter, Output } from '@angular/core';
import { stations, Station } from '../../models/station';
import { CommonModule } from '@angular/common';
import { combineLatest, map, Observable, startWith } from 'rxjs';
import { ForecastCacheService } from '../../services/forecast-cache.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormControl } from '@angular/forms';


@Component({
  selector: 'app-search-station-container',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatInputModule,
  ],

  templateUrl: './search-station-container.component.html',
  styleUrls: ['./search-station-container.component.scss'],
})

export class SearchStationContainerComponent {
  // value can be either a text query or the selected Station object
  ctrl = new FormControl<string | Station>('');
  stations$!: Observable<Station[]>;
  filtered$!: Observable<Station[]>;

  @Output() stationChosen = new EventEmitter<Station>();



  constructor(private readonly cache: ForecastCacheService) {
    this.stations$ = this.cache.areaMetadata$;

    this.filtered$ = combineLatest([
      this.ctrl.valueChanges.pipe(startWith('')),
      this.stations$
    ]).pipe(
      map(([raw, list]) => {
        const term = (typeof raw === 'string' ? raw : raw?.name ?? '')
          .toLowerCase().trim();
        return list.filter(s => s.name.toLowerCase().includes(term));
      })
    );
  }



  onSelected(st: Station) {
    this.stationChosen.emit(st);
    this.ctrl.setValue(st.name, { emitEvent: true }); // clear & re-emit
  }


  /** show the station name in the input after selection */
  displayFn = (s: Station | null) => s ? s.name : '';
}
