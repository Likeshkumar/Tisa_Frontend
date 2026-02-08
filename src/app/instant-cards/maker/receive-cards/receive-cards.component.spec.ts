import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveCardsComponent } from './receive-cards.component';

describe('ReceiveCardsComponent', () => {
  let component: ReceiveCardsComponent;
  let fixture: ComponentFixture<ReceiveCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveCardsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
