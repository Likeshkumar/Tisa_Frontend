import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewHsmComponent } from './view-hsm.component';

describe('ViewHsmComponent', () => {
  let component: ViewHsmComponent;
  let fixture: ComponentFixture<ViewHsmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewHsmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewHsmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
