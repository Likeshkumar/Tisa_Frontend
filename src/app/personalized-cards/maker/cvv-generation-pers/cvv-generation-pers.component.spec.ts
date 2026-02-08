import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CvvGenerationPersComponent } from './cvv-generation-pers.component';

describe('CvvGenerationPersComponent', () => {
  let component: CvvGenerationPersComponent;
  let fixture: ComponentFixture<CvvGenerationPersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CvvGenerationPersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvvGenerationPersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
