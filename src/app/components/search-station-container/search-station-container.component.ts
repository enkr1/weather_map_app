import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-search-station-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './search-station-container.component.html',
  styleUrl: './search-station-container.component.scss'
})

export class SearchStationContainerComponent {
  constructor() {}
}
