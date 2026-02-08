import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCardOrderComponent } from './auth-card-order.component';

describe('AuthCardOrderComponent', () => {
  let component: AuthCardOrderComponent;
  let fixture: ComponentFixture<AuthCardOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthCardOrderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCardOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
