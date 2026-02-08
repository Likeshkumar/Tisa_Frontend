import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthAccountTypeComponent } from './auth-account-type.component';

describe('AuthAccountTypeComponent', () => {
  let component: AuthAccountTypeComponent;
  let fixture: ComponentFixture<AuthAccountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthAccountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthAccountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
