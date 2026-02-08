import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MakePrimaryAccountComponent } from './make-primary-account.component';

describe('MakePrimaryAccountComponent', () => {
  let component: MakePrimaryAccountComponent;
  let fixture: ComponentFixture<MakePrimaryAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakePrimaryAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakePrimaryAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
