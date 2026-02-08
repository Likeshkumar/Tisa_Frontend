import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFeeComponent } from './view-fee.component';

describe('ViewFeeComponent', () => {
  let component: ViewFeeComponent;
  let fixture: ComponentFixture<ViewFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewFeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
