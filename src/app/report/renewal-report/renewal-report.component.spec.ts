import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalReportComponent } from './renewal-report.component';

describe('RenewalReportComponent', () => {
  let component: RenewalReportComponent;
  let fixture: ComponentFixture<RenewalReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewalReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
