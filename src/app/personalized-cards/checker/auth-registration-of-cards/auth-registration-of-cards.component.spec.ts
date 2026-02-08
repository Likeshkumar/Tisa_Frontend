import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthRegistrationOfCardsComponent } from './auth-registration-of-cards.component';

describe('AuthRegistrationOfCardsComponent', () => {
  let component: AuthRegistrationOfCardsComponent;
  let fixture: ComponentFixture<AuthRegistrationOfCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthRegistrationOfCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthRegistrationOfCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
