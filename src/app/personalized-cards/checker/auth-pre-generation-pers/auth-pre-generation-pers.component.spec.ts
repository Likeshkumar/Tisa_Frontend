import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPreGenerationPersComponent } from './auth-pre-generation-pers.component';

describe('AuthPreGenerationPersComponent', () => {
  let component: AuthPreGenerationPersComponent;
  let fixture: ComponentFixture<AuthPreGenerationPersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthPreGenerationPersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthPreGenerationPersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
