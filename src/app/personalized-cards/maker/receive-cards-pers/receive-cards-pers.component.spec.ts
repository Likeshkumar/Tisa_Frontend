import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiveCardsPersComponent } from './receive-cards-pers.component';

describe('ReceiveCardsPersComponent', () => {
  let component: ReceiveCardsPersComponent;
  let fixture: ComponentFixture<ReceiveCardsPersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiveCardsPersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiveCardsPersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
