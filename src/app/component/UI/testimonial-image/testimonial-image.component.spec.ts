import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestimonialImageComponent } from './testimonial-image.component';

describe('TestimonialImageComponent', () => {
  let component: TestimonialImageComponent;
  let fixture: ComponentFixture<TestimonialImageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TestimonialImageComponent]
    });
    fixture = TestBed.createComponent(TestimonialImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
