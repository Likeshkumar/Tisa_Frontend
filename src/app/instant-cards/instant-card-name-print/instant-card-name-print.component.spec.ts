import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantCardNamePrintComponent } from './instant-card-name-print.component';

describe('InstantCardNamePrintComponent', () => {
  let component: InstantCardNamePrintComponent;
  let fixture: ComponentFixture<InstantCardNamePrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantCardNamePrintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantCardNamePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
