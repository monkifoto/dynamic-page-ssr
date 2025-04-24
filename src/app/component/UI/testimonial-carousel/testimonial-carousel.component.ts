import {
  Component, Input, OnInit, OnDestroy,
  Inject, PLATFORM_ID
} from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BusinessDataService } from '../../../services/business-data.service';
import { GoogleMapsLoaderService } from '../../../services/google-maps-loader.service';
import { Business } from '../../../model/business-questions.model';
import { environment } from '../../../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { animate, style, transition, trigger } from '@angular/animations';

declare var google: any;

@Component({
  selector: 'app-testimonial-carousel',
  templateUrl: './testimonial-carousel.component.html',
  styleUrls: ['./testimonial-carousel.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('0.5s ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
      transition(':leave', [
        animate('0.5s ease-out', style({ opacity: 0, transform: 'translateX(-100%)' })),
      ]),
    ]),
    trigger('fadeInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('0.5s ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
    trigger('fadeInRight', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('0.5s ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
      ]),
    ]),
  ],
  standalone: true,
  imports: [CommonModule]
})
export class TestimonialCarouselComponent implements OnInit, OnDestroy {
  @Input() businessId!: string;
  @Input() placeId!: string;

  business: Business | null = null;
  useMockReviews = environment.useMockGoogleReviews;
  testimonials: any[] = [];
  currentIndex = 0;
  private autoPlayInterval: any;
  private maxTextLength = 300;
  isBrowser: boolean;

  constructor(
    private businessDataService: BusinessDataService,
    private googleMapsLoader: GoogleMapsLoaderService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async ngOnInit() {
    console.log('✅ TestimonialCarousel Init with ID:', this.businessId);

    if (!this.isBrowser) {
      console.warn('⛔ Skipping TestimonialCarousel on server');
      return;
    }

    if (!this.businessId) {
      const id = await firstValueFrom(this.businessDataService.getBusinessId());
      if (id) this.businessId = id;
    }

    if (this.businessId) {
      await this.initWithBusinessId(this.businessId);
    } else {
      console.warn('❌ TestimonialCarousel: No businessId provided or resolved.');
    }
  }

  async initWithBusinessId(businessId: string) {
    const business = await firstValueFrom(this.businessDataService.loadBusinessData(businessId));

    if (!business) {
      console.warn('❌ TestimonialCarousel: No business data returned');
      return;
    }

    this.business = business;

    if (this.useMockReviews) {
      await this.loadMockGoogleReviews();
    } else if (this.business.placeId !== '0') {
      this.loadGoogleReviews();
    }

    this.loadTestimonials();
    this.startAutoPlay();
  }

  ngOnDestroy() {
    if (this.isBrowser) this.stopAutoPlay();
  }

  async loadMockGoogleReviews() {
    try {
      const mockData = await firstValueFrom(this.http.get<any[]>('/assets/mocks/mock-reviews.json'));
      const googleReviews = mockData.map((review) => ({
        name: review.author_name,
        quote: review.text,
        relationship: 'Mock Google Review',
        isGoogle: true,
      }));
      this.testimonials = [...googleReviews, ...this.testimonials];
      this.currentIndex = 0;
    } catch (err) {
      console.error('❌ Failed to load mock reviews:', err);
    }
  }

  private loadGoogleReviews() {
    if (!this.placeId) {
      console.error('❌ Missing placeId for Google Reviews.');
      return;
    }

    this.googleMapsLoader.loadScript().then(() => {
      if (isPlatformBrowser(this.platformId)) {
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      service.getDetails(
        { placeId: this.placeId, fields: ['reviews'] },
        (place: any, status: string) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            const googleReviews = place.reviews?.map((review: any) => ({
              name: review.author_name,
              quote: review.text,
              relationship: 'Google Review',
              isGoogle: true,
            })) || [];
            this.testimonials = [...googleReviews, ...this.testimonials];
            this.currentIndex = 0;
          } else {
            console.error('❌ Google Reviews failed with status:', status);
          }
        }
      );
    }
    });
  }

  private async loadTestimonials() {
    const business = await firstValueFrom(this.businessDataService.loadBusinessData(this.businessId));
    if (business?.testimonials?.length) {
      const formatted = business.testimonials.map((testimonial) => ({
        ...testimonial,
        relationship: 'Testimonial',
        isGoogle: false,
        rawQuote: testimonial.quote,
        quote: this.sanitizeHtml(testimonial.quote),
      }));
      this.testimonials = [...this.testimonials, ...formatted];
    }
  }

  get currentTestimonial() {
    return this.testimonials.length > 0 ? this.testimonials[this.currentIndex] : null;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  startAutoPlay() {
    if (this.isBrowser && this.testimonials.length > 1) {
      this.autoPlayInterval = setInterval(() => this.nextSlide(), 15000);
    }
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  previousSlide() {
    if (this.testimonials.length > 0) {
      this.currentIndex = (this.currentIndex - 1 + this.testimonials.length) % this.testimonials.length;
    }
  }

  nextSlide() {
    if (this.testimonials.length > 0) {
      this.currentIndex = (this.currentIndex + 1) % this.testimonials.length;
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  truncateText(text: string | undefined): string {
    return text && text.length > this.maxTextLength ? text.slice(0, this.maxTextLength) : text || '';
  }

  isTruncated(text: string | undefined): boolean {
    return !!text && text.length > this.maxTextLength;
  }

  navigateTo(page: string) {
    this.router.navigate(['/' + page], {
      queryParams: { id: this.businessId },
    });
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  get googleReviewLink(): string {
    return `https://search.google.com/local/writereview?placeid=${this.placeId}`;
  }
}
