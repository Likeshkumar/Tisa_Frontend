import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCurrencyComponent } from './view-currency.component';

describe('ViewCurrencyComponent', () => {
  let component: ViewCurrencyComponent;
  let fixture: ComponentFixture<ViewCurrencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCurrencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCurrencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
