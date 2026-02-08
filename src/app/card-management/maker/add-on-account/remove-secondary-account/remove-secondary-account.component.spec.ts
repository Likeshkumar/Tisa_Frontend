import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveSecondaryAccountComponent } from './remove-secondary-account.component';

describe('RemoveSecondaryAccountComponent', () => {
  let component: RemoveSecondaryAccountComponent;
  let fixture: ComponentFixture<RemoveSecondaryAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveSecondaryAccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveSecondaryAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
