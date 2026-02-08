import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuanceOfCardsPersComponent } from './issuance-of-cards-pers.component';

describe('IssuanceOfCardsPersComponent', () => {
  let component: IssuanceOfCardsPersComponent;
  let fixture: ComponentFixture<IssuanceOfCardsPersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IssuanceOfCardsPersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuanceOfCardsPersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
