import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreFileDownloadComponent } from './pre-file-download.component';

describe('PreFileDownloadComponent', () => {
  let component: PreFileDownloadComponent;
  let fixture: ComponentFixture<PreFileDownloadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PreFileDownloadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreFileDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
