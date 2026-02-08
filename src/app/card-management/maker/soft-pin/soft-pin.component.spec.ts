import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftPinComponent } from './soft-pin.component';

describe('SoftPinComponent', () => {
  let component: SoftPinComponent;
  let fixture: ComponentFixture<SoftPinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoftPinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoftPinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
