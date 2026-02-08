import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalizedBulkComponent } from './personalized-bulk.component';

describe('PersonalizedBulkComponent', () => {
  let component: PersonalizedBulkComponent;
  let fixture: ComponentFixture<PersonalizedBulkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalizedBulkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalizedBulkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
