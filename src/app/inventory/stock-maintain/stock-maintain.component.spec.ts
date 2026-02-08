import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMaintainComponent } from './stock-maintain.component';

describe('StockMaintainComponent', () => {
  let component: StockMaintainComponent;
  let fixture: ComponentFixture<StockMaintainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockMaintainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockMaintainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
