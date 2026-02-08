import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSubTypeComponent } from './account-sub-type.component';

describe('AccountSubTypeComponent', () => {
  let component: AccountSubTypeComponent;
  let fixture: ComponentFixture<AccountSubTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountSubTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSubTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
