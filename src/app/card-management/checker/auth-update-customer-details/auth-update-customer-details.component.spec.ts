import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthUpdateCustomerDetailsComponent } from './auth-update-customer-details.component';

describe('AuthUpdateCustomerDetailsComponent', () => {
  let component: AuthUpdateCustomerDetailsComponent;
  let fixture: ComponentFixture<AuthUpdateCustomerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthUpdateCustomerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthUpdateCustomerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
