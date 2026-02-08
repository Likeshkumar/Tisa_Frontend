import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthFeeComponent } from './auth-fee.component';

describe('AuthFeeComponent', () => {
  let component: AuthFeeComponent;
  let fixture: ComponentFixture<AuthFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthFeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
