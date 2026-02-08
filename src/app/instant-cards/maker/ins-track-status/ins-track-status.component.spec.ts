import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsTrackStatusComponent } from './ins-track-status.component';

describe('InsTrackStatusComponent', () => {
  let component: InsTrackStatusComponent;
  let fixture: ComponentFixture<InsTrackStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InsTrackStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InsTrackStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
