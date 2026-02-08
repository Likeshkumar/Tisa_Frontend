import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AckInHoComponent } from './ack-in-ho.component';

describe('AckInHoComponent', () => {
  let component: AckInHoComponent;
  let fixture: ComponentFixture<AckInHoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AckInHoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AckInHoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
