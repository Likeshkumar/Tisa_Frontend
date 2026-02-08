import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthIssuanceOfCardsPersComponent } from './auth-issuance-of-cards-pers.component';

describe('AuthIssuanceOfCardsPersComponent', () => {
  let component: AuthIssuanceOfCardsPersComponent;
  let fixture: ComponentFixture<AuthIssuanceOfCardsPersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthIssuanceOfCardsPersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthIssuanceOfCardsPersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
