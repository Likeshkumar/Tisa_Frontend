import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthAddOnAccountComponent } from './auth-add-on-account.component';

describe('AuthAddOnAccountComponent', () => {
  let component: AuthAddOnAccountComponent;
  let fixture: ComponentFixture<AuthAddOnAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthAddOnAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthAddOnAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
