import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonIssusedReportComponent } from './non-issused-report.component';

describe('NonIssusedReportComponent', () => {
  let component: NonIssusedReportComponent;
  let fixture: ComponentFixture<NonIssusedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonIssusedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonIssusedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
