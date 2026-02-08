import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccountSubTypeComponent } from './view-account-sub-type.component';

describe('ViewAccountSubTypeComponent', () => {
  let component: ViewAccountSubTypeComponent;
  let fixture: ComponentFixture<ViewAccountSubTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAccountSubTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAccountSubTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
