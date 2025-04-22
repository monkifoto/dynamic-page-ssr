import { Component, Input, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { BusinessDataService } from '../../../services/business-data.service';
import { GoogleMapsLoaderService } from '../../../services/google-maps-loader.service';
import { Business } from '../../../model/business-questions.model';
import { environment } from '../../../../environments/environment';
import { first } from 'rxjs/operators';

declare var google: any;

@Component({
  selector: 'app-testimonial-carousel',
  templateUrl: './testimonial-carousel.component.html',
  styleUrls: ['./testimonial-carousel.component.css'],
  // animations: [
  //   trigger('slideIn', [
  //     transition(':enter', [
  //       style({ opacity: 0, transform: 'translateX(-100%)' }),
  //       animate('0.5s ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
  //     ]),
  //     transition(':leave', [
  //       animate('0.5s ease-out', style({ opacity: 0, transform: 'translateX(-100%)' })),
  //     ]),
  //   ]),
  //   trigger('fadeInLeft', [
  //     transition(':enter', [
  //       style({ opacity: 0, transform: 'translateX(-100%)' }),
  //       animate('0.5s ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
  //     ]),
  //   ]),
  //   trigger('fadeInRight', [
  //     transition(':enter', [
  //       style({ opacity: 0, transform: 'translateX(100%)' }),
  //       animate('0.5s ease-in', style({ opacity: 1, transform: 'translateX(0)' })),
  //     ]),
  //   ]),
  // ],
  standalone: false
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

  constructor(
    private businessDataService: BusinessDataService,
    private googleMapsLoader: GoogleMapsLoaderService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {

    console.log('✅ TestimonialCarousel Init with ID:', this.businessId);

    if (isPlatformServer(this.platformId)) {
      console.warn('⛔ Skipping TestimonialCarousel on server');
      return; // ✅ Prevent SSR from loading anything
    }

    if (this.businessId) {
      this.initWithBusinessId(this.businessId);
    } else {
      this.businessDataService.getBusinessId().pipe(first()).subscribe((id) => {
        if (id) {
          this.businessId = id;
          this.initWithBusinessId(id);
        } else {
          console.warn('❌ TestimonialCarousel: No businessId provided or resolved.');
        }
      });
    }
  }

  private initWithBusinessId(businessId: string) {
    console.log("✅ TestimonialCarousel Init with ID:", businessId);

    this.businessDataService.loadBusinessData(businessId).pipe(first()).subscribe((business) => {
      if (!business) {
        console.warn('❌ TestimonialCarousel: No business data returned');
        return;
      }

      this.business = business;

      if (this.useMockReviews && !isPlatformServer(this.platformId)) {
        this.loadMockGoogleReviews();
      } else if (this.business.placeId !== '0') {
        this.loadGoogleReviews();
      }

      this.loadTestimonials();
      this.startAutoPlay();
    });
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  private loadMockGoogleReviews() {
    this.http.get<any[]>('/assets/mocks/mock-reviews.json').subscribe({
      next: (mockData) => {
        const googleReviews = mockData.map((review) => ({
          name: review.author_name,
          quote: review.text,
          relationship: 'Mock Google Review',
          isGoogle: true,
        }));
        this.testimonials = [...googleReviews, ...this.testimonials];
        this.currentIndex = 0;
      },
      error: (err) => console.error('❌ Failed to load mock reviews:', err),
    });
  }

  private loadGoogleReviews() {
    if (isPlatformServer(this.platformId)) {
      console.warn('⚠️ Skipping Google Maps on server.');
      return;
    }

    if (!this.placeId) {
      console.error('❌ Missing placeId for Google Reviews.');
      return;
    }

    this.googleMapsLoader.loadScript().then(() => {
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
    });
  }

  private loadTestimonials() {
    this.businessDataService.loadBusinessData(this.businessId).pipe(first()).subscribe((business) => {
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
    });
  }

  get currentTestimonial() {
    return this.testimonials.length > 0 ? this.testimonials[this.currentIndex] : null;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => this.nextSlide(), 15000);
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
