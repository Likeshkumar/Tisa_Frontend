import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantViaCbsRegistrationComponent } from './instant-via-cbs-registration.component';

describe('InstantViaCbsRegistrationComponent', () => {
  let component: InstantViaCbsRegistrationComponent;
  let fixture: ComponentFixture<InstantViaCbsRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantViaCbsRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantViaCbsRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
