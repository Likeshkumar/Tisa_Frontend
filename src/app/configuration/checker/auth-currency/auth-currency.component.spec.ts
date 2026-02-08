import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCurrencyComponent } from './auth-currency.component';

describe('AuthCurrencyComponent', () => {
  let component: AuthCurrencyComponent;
  let fixture: ComponentFixture<AuthCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthCurrencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
