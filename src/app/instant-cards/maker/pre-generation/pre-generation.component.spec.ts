import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGenerationComponent } from './pre-generation.component';

describe('PreGenerationComponent', () => {
  let component: PreGenerationComponent;
  let fixture: ComponentFixture<PreGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
