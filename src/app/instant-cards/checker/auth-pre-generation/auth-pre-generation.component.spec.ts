import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPreGenerationComponent } from './auth-pre-generation.component';

describe('AuthPreGenerationComponent', () => {
  let component: AuthPreGenerationComponent;
  let fixture: ComponentFixture<AuthPreGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthPreGenerationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthPreGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
