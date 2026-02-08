import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthUnblockUserComponent } from './auth-unblock-user.component';

describe('AuthUnblockUserComponent', () => {
  let component: AuthUnblockUserComponent;
  let fixture: ComponentFixture<AuthUnblockUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthUnblockUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthUnblockUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
