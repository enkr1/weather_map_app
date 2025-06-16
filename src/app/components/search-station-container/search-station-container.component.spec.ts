import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchStationContainerComponent } from './search-station-container.component';

describe('SearchStationContainerComponent', () => {
  let component: SearchStationContainerComponent;
  let fixture: ComponentFixture<SearchStationContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchStationContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchStationContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
