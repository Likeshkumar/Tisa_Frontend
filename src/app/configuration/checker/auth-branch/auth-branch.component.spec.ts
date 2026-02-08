import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthBranchComponent } from './auth-branch.component';

describe('AuthBranchComponent', () => {
  let component: AuthBranchComponent;
  let fixture: ComponentFixture<AuthBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthBranchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
