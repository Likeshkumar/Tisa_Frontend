import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgeInHeadOfficeComponent } from './acknowledge-in-head-office.component';

describe('AcknowledgeInHeadOfficeComponent', () => {
  let component: AcknowledgeInHeadOfficeComponent;
  let fixture: ComponentFixture<AcknowledgeInHeadOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcknowledgeInHeadOfficeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcknowledgeInHeadOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
