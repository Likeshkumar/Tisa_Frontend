import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthBranchIssuanceComponent } from './auth-branch-issuance.component';

describe('AuthBranchIssuanceComponent', () => {
  let component: AuthBranchIssuanceComponent;
  let fixture: ComponentFixture<AuthBranchIssuanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthBranchIssuanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthBranchIssuanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
