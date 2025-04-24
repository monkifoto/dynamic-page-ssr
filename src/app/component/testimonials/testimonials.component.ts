import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Testimonial } from '../../model/business-questions.model';

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TestimonialsComponent {
  @Input() testimonials!: Testimonial[] | undefined;
  @Input() layoutType: string = 'demo';

  currentIndex: number = 0;
  autoAdvanceInterval: any;
  isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser && Array.isArray(this.testimonials) && this.testimonials.length > 0) {
      this.startAutoAdvance();
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      this.stopAutoAdvance();
    }
  }

  setSlide(index: number) {
    this.currentIndex = index;
    this.restartAutoAdvance(); // Restart timer when manually changing slides
  }

  startAutoAdvance() {
    if (Array.isArray(this.testimonials) && this.testimonials.length > 1) {
      this.autoAdvanceInterval = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % this.testimonials!.length;
      }, 5000);
    }
  }

  stopAutoAdvance() {
    if (this.autoAdvanceInterval) {
      clearInterval(this.autoAdvanceInterval);
    }
  }

  restartAutoAdvance() {
    this.stopAutoAdvance();
    this.startAutoAdvance();
  }
}
