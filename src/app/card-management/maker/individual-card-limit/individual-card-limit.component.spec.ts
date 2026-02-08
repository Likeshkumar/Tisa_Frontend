import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualCardLimitComponent } from './individual-card-limit.component';

describe('IndividualCardLimitComponent', () => {
  let component: IndividualCardLimitComponent;
  let fixture: ComponentFixture<IndividualCardLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndividualCardLimitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualCardLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
