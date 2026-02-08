import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthIndividualCardLimitComponent } from './auth-individual-card-limit.component';

describe('AuthIndividualCardLimitComponent', () => {
  let component: AuthIndividualCardLimitComponent;
  let fixture: ComponentFixture<AuthIndividualCardLimitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthIndividualCardLimitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthIndividualCardLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
