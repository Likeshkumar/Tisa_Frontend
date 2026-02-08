import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinMailerComponent } from './pin-mailer.component';

describe('PinMailerComponent', () => {
  let component: PinMailerComponent;
  let fixture: ComponentFixture<PinMailerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PinMailerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PinMailerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
