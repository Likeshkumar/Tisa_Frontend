import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsmComponent } from './hsm.component';

describe('HsmComponent', () => {
  let component: HsmComponent;
  let fixture: ComponentFixture<HsmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HsmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HsmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
