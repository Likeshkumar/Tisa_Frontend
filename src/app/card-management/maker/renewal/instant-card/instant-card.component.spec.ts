import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantCardComponent } from './instant-card.component';

describe('InstantCardComponent', () => {
  let component: InstantCardComponent;
  let fixture: ComponentFixture<InstantCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstantCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
