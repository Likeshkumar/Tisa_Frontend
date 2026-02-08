import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCardTypeComponent } from './auth-card-type.component';

describe('AuthCardTypeComponent', () => {
  let component: AuthCardTypeComponent;
  let fixture: ComponentFixture<AuthCardTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthCardTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCardTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
