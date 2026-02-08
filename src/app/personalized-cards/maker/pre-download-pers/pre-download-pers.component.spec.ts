import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreDownloadPersComponent } from './pre-download-pers.component';

describe('PreDownloadPersComponent', () => {
  let component: PreDownloadPersComponent;
  let fixture: ComponentFixture<PreDownloadPersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreDownloadPersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreDownloadPersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
