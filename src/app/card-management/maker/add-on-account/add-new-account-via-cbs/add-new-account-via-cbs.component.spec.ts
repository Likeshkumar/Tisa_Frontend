import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewAccountViaCbsComponent } from './add-new-account-via-cbs.component';

describe('AddNewAccountViaCbsComponent', () => {
  let component: AddNewAccountViaCbsComponent;
  let fixture: ComponentFixture<AddNewAccountViaCbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewAccountViaCbsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewAccountViaCbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
