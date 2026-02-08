import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPinRetryCountComponent } from './reset-pin-retry-count.component';

describe('ResetPinRetryCountComponent', () => {
  let component: ResetPinRetryCountComponent;
  let fixture: ComponentFixture<ResetPinRetryCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPinRetryCountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPinRetryCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
