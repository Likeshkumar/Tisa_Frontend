import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCvvGenerationPersComponent } from './auth-cvv-generation-pers.component';

describe('AuthCvvGenerationPersComponent', () => {
  let component: AuthCvvGenerationPersComponent;
  let fixture: ComponentFixture<AuthCvvGenerationPersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthCvvGenerationPersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthCvvGenerationPersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
