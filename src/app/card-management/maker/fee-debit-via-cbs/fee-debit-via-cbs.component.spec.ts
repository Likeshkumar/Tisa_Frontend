import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDebitViaCbsComponent } from './fee-debit-via-cbs.component';

describe('FeeDebitViaCbsComponent', () => {
  let component: FeeDebitViaCbsComponent;
  let fixture: ComponentFixture<FeeDebitViaCbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeeDebitViaCbsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDebitViaCbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
