import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { Business } from '../../../model/business-questions.model';
import { MetaService } from '../../../services/meta-service.service';
import { BusinessDataService } from '../../../services/business-data.service';
import { GoogleMapsLoaderService } from '../../../services/google-maps-loader.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeroComponent } from '../../UI/hero/hero.component';
import { firstValueFrom } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-testimonials-list',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.css'],
  standalone: true,
  imports: [CommonModule, HeroComponent],
})
export class TestimonialsListComponent implements OnInit {
  testimonials: any[] = [];
  themeType: string | null = null;
  business: Business | null = null;
  googleReviewsLoading = true;
  isBrowser: boolean;

  constructor(
    private businessDataService: BusinessDataService,
    private metaService: MetaService,
    private googleMapsLoader: GoogleMapsLoaderService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async ngOnInit(): Promise<void> {
    console.log('SSR Rendering: Testimonial Page');

    let businessData = await firstValueFrom(
      this.businessDataService.businessData$
    );

    if (!businessData) {
      const businessId = this.route.snapshot.queryParamMap.get('id');
      if (businessId) {
        businessData = await firstValueFrom(
          this.businessDataService.loadBusinessData(businessId)
        );
      }
    }

    if (businessData) {
      this.business = businessData;
      this.loadData();
    }
  }

  private loadData(): void {
    this.loadTestimonials();

    if (this.isBrowser && this.business?.placeId !== '0') {
      this.loadGoogleReviews();
    }
  }

  private loadTestimonials(): void {
    if (this.business?.testimonials) {
      const formattedTestimonials = this.business.testimonials.map(
        (testimonial: any) => ({
          ...testimonial,
          relationship: 'Testimonial',
          rawQuote: testimonial.quote,
          quote: this.sanitizeHtml(testimonial.quote),
          isGoogle: false,
        })
      );
      this.testimonials = [...this.testimonials, ...formattedTestimonials];
    }
  }

  private loadGoogleReviews(): void {
    if (!this.business?.placeId) {
      console.error('Place ID is required to fetch Google reviews.');
      return;
    }
    if (isPlatformBrowser(this.platformId)) {
      this.googleMapsLoader.loadScript().then(() => {
        const service = new google.maps.places.PlacesService(
          document.createElement('div')
        );
        service.getDetails(
          { placeId: this.business?.placeId, fields: ['reviews'] },
          (place: any, status: string) => {
            this.googleReviewsLoading = false;
            if (status === google.maps.places.PlacesServiceStatus.OK) {
              const googleReviews =
                place?.reviews?.map((review: any) => ({
                  name: review.author_name,
                  quote: review.text,
                  rawQuote: review.text,
                  relationship: 'Google Review',
                  isGoogle: true,
                  photoURL: review.profile_photo_url || null,
                })) || [];

              // Prepend Google reviews to the testimonials array
              this.testimonials = [...googleReviews, ...this.testimonials];
            } else {
              console.error('Error fetching Google reviews:', status);
            }
          }
        );
      });
    }
  }

  get googleReviewLink(): string {
    return `https://search.google.com/local/writereview?placeid=${this.business?.placeId}`;
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
