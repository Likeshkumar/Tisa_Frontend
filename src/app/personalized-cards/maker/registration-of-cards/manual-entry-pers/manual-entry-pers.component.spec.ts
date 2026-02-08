import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualEntryPersComponent } from './manual-entry-pers.component';

describe('ManualEntryPersComponent', () => {
  let component: ManualEntryPersComponent;
  let fixture: ComponentFixture<ManualEntryPersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManualEntryPersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualEntryPersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
