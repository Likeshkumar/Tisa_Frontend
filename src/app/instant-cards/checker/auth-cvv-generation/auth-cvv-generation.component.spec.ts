import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCvvGenerationComponent } from './auth-cvv-generation.component';

describe('AuthCvvGenerationComponent', () => {
  let component: AuthCvvGenerationComponent;
  let fixture: ComponentFixture<AuthCvvGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthCvvGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCvvGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
