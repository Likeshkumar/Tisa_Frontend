import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthAccountSubTypeComponent } from './auth-account-sub-type.component';

describe('AuthAccountSubTypeComponent', () => {
  let component: AuthAccountSubTypeComponent;
  let fixture: ComponentFixture<AuthAccountSubTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthAccountSubTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthAccountSubTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
