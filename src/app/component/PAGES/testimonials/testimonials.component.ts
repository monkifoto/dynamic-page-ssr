import { Component, OnInit } from '@angular/core';
import { Business } from 'src/app/model/business-questions.model';
import { MetaService } from 'src/app/services/meta-service.service';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { GoogleMapsLoaderService } from 'src/app/services/google-maps-loader.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Params } from '@angular/router';
import { filter, first, Observable, of, switchMap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

declare var google: any;
@Component({
    selector: 'app-testimonials-list',
    templateUrl: './testimonials.component.html',
    styleUrls: ['./testimonials.component.css'],
    standalone: false
})
export class TestimonialsListComponent implements OnInit {
  testimonials: any[] = [];
  themeType: string | null = null;
  business: Business | null = null;
  googleReviewsLoading = true;
  constructor(
    private businessDataService: BusinessDataService,
    private metaService: MetaService,
    private googleMapsLoader: GoogleMapsLoaderService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.businessDataService.businessData$.pipe(
      first()
    ).subscribe((data) => {
      if (data) {
        this.business = data;
        this.loadData();
      } else {
        // fallback only if needed (likely never hit with AppInitializer)
        const businessId = this.route.snapshot.queryParamMap.get('id');
        if (businessId) {
          this.businessDataService.loadBusinessData(businessId).pipe(first()).subscribe((business) => {
            if (business) {
              this.business = business;
              this.loadData();
            }
          });
        }
      }
    });
  }


  private loadData(): void {
    this.loadTestimonials();
    if (isPlatformBrowser(this.platformId) && this.business?.placeId !== '0') {
      this.loadGoogleReviews();
    }
  }

  
  private loadTestimonials(): void {
    if (this.business?.testimonials) {
      const formattedTestimonials = this.business.testimonials.map((testimonial: any) => ({
        ...testimonial,
        relationship: 'Testimonial',
        rawQuote: testimonial.quote,
        quote: this.sanitizeHtml(testimonial.quote),
        isGoogle: false,
      }));
      this.testimonials = [...this.testimonials, ...formattedTestimonials];
    }
  }


  private loadGoogleReviews(): void {
    if (!this.business?.placeId) {
      console.error('Place ID is required to fetch Google reviews.');
      return;
    }

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

  get googleReviewLink(): string {
    return `https://search.google.com/local/writereview?placeid=${this.business?.placeId}`;
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
function take(arg0: number): import("rxjs").OperatorFunction<Business | null, unknown> {
  throw new Error('Function not implemented.');
}

