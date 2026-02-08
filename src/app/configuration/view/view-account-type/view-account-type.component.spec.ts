import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAccountTypeComponent } from './view-account-type.component';

describe('ViewAccountTypeComponent', () => {
  let component: ViewAccountTypeComponent;
  let fixture: ComponentFixture<ViewAccountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewAccountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewAccountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
