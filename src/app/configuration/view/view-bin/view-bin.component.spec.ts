import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBinComponent } from './view-bin.component';

describe('ViewBinComponent', () => {
  let component: ViewBinComponent;
  let fixture: ComponentFixture<ViewBinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewBinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
