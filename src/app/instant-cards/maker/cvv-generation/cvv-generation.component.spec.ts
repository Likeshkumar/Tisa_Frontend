import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvvGenerationComponent } from './cvv-generation.component';

describe('CvvGenerationComponent', () => {
  let component: CvvGenerationComponent;
  let fixture: ComponentFixture<CvvGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvvGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvvGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
