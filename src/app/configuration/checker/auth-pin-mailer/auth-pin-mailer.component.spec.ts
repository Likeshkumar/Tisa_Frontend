import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPinMailerComponent } from './auth-pin-mailer.component';

describe('AuthPinMailerComponent', () => {
  let component: AuthPinMailerComponent;
  let fixture: ComponentFixture<AuthPinMailerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthPinMailerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthPinMailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
