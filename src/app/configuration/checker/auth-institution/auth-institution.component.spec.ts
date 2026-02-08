import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthInstitutionComponent } from './auth-institution.component';

describe('AuthInstitutionComponent', () => {
  let component: AuthInstitutionComponent;
  let fixture: ComponentFixture<AuthInstitutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthInstitutionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthInstitutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
