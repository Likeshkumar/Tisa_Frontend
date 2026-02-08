import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuanceOfCardsToBranchesComponent } from './issuance-of-cards-to-branches.component';

describe('IssuanceOfCardsToBranchesComponent', () => {
  let component: IssuanceOfCardsToBranchesComponent;
  let fixture: ComponentFixture<IssuanceOfCardsToBranchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssuanceOfCardsToBranchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuanceOfCardsToBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
