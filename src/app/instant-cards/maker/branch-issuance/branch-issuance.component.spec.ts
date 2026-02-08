import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchIssuanceComponent } from './branch-issuance.component';

describe('BranchIssuanceComponent', () => {
  let component: BranchIssuanceComponent;
  let fixture: ComponentFixture<BranchIssuanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BranchIssuanceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchIssuanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
