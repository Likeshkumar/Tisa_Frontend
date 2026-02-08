import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViaCbsUpdateComponent } from './via-cbs-update.component';

describe('ViaCbsUpdateComponent', () => {
  let component: ViaCbsUpdateComponent;
  let fixture: ComponentFixture<ViaCbsUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViaCbsUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViaCbsUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
