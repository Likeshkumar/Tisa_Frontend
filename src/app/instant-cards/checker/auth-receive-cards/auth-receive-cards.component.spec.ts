import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthReceiveCardsComponent } from './auth-receive-cards.component';

describe('AuthReceiveCardsComponent', () => {
  let component: AuthReceiveCardsComponent;
  let fixture: ComponentFixture<AuthReceiveCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthReceiveCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthReceiveCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
