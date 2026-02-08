import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssusedReportComponent } from './issused-report.component';

describe('IssusedReportComponent', () => {
  let component: IssusedReportComponent;
  let fixture: ComponentFixture<IssusedReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssusedReportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssusedReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
