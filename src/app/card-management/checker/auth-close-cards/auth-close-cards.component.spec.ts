import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCloseCardsComponent } from './auth-close-cards.component';

describe('AuthCloseCardsComponent', () => {
  let component: AuthCloseCardsComponent;
  let fixture: ComponentFixture<AuthCloseCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthCloseCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCloseCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
