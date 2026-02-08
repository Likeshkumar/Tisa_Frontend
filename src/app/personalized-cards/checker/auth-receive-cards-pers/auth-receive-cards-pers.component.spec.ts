import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthReceiveCardsPersComponent } from './auth-receive-cards-pers.component';

describe('AuthReceiveCardsPersComponent', () => {
  let component: AuthReceiveCardsPersComponent;
  let fixture: ComponentFixture<AuthReceiveCardsPersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthReceiveCardsPersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthReceiveCardsPersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
