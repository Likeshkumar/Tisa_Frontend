import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCardTypeComponent } from './view-card-type.component';

describe('ViewCardTypeComponent', () => {
  let component: ViewCardTypeComponent;
  let fixture: ComponentFixture<ViewCardTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewCardTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCardTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
