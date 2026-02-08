import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantManualRegistrationComponent } from './instant-manual-registration.component';

describe('InstantManualRegistrationComponent', () => {
  let component: InstantManualRegistrationComponent;
  let fixture: ComponentFixture<InstantManualRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantManualRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantManualRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
