import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreGenerationPersComponent } from './pre-generation-pers.component';

describe('PreGenerationPersComponent', () => {
  let component: PreGenerationPersComponent;
  let fixture: ComponentFixture<PreGenerationPersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreGenerationPersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreGenerationPersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
