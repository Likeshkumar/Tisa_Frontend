import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViaCbsPersComponent } from './via-cbs-pers.component';

describe('ViaCbsPersComponent', () => {
  let component: ViaCbsPersComponent;
  let fixture: ComponentFixture<ViaCbsPersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViaCbsPersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViaCbsPersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
