import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthBinComponent } from './auth-bin.component';

describe('AuthBinComponent', () => {
  let component: AuthBinComponent;
  let fixture: ComponentFixture<AuthBinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthBinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthBinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
