import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCustomerRegistrationComponent } from './auth-customer-registration.component';

describe('AuthCustomerRegistrationComponent', () => {
  let component: AuthCustomerRegistrationComponent;
  let fixture: ComponentFixture<AuthCustomerRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthCustomerRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCustomerRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
