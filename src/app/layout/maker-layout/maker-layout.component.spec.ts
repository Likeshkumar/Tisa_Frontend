import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MakerLayoutComponent } from './maker-layout.component';



describe('MakerLayoutComponent', () => {
  let component: MakerLayoutComponent;
  let fixture: ComponentFixture<MakerLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MakerLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MakerLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
