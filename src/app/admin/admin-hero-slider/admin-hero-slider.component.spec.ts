import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminHeroSliderComponent } from './admin-hero-slider.component';

describe('AdminHeroSliderComponent', () => {
  let component: AdminHeroSliderComponent;
  let fixture: ComponentFixture<AdminHeroSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminHeroSliderComponent]
    });
    fixture = TestBed.createComponent(AdminHeroSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
