import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthHsmComponent } from './auth-hsm.component';

describe('AuthHsmComponent', () => {
  let component: AuthHsmComponent;
  let fixture: ComponentFixture<AuthHsmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthHsmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthHsmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
