import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalFeatureComponent } from './renewal-feature.component';

describe('RenewalFeatureComponent', () => {
  let component: RenewalFeatureComponent;
  let fixture: ComponentFixture<RenewalFeatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RenewalFeatureComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
