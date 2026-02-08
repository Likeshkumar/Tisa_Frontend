import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveCardsInBranchesComponent } from './receive-cards-in-branches.component';

describe('ReceiveCardsInBranchesComponent', () => {
  let component: ReceiveCardsInBranchesComponent;
  let fixture: ComponentFixture<ReceiveCardsInBranchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveCardsInBranchesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveCardsInBranchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
