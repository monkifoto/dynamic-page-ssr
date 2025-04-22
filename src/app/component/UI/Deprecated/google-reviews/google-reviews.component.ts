import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { GoogleMapsLoaderService } from 'src/app/services/google-maps-loader.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';

declare var google: any;

@Component({
  selector: 'app-google-reviews',
  templateUrl: './google-reviews.component.html',
  styleUrls: ['./google-reviews.component.css'],
  standalone: false
})
export class GoogleReviewsComponent implements OnInit {
  @Input() placeId: string = '';
  reviews: any[] = [];
  currentReviewIndex: number = 0;
  intervalId: any;
  useMockReviews = environment.useMockGoogleReviews;
  isBrowser = false;

  constructor(
    private googleMapsLoader: GoogleMapsLoaderService,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      console.warn('⛔ GoogleReviewsComponent skipped on server');
      return;
    }

    if (this.useMockReviews) {
      this.loadMockReviews();
      this.startCarousel();
    } else {
      if (!this.placeId) {
        console.error('Place ID is required to fetch reviews.');
        return;
      }

      this.googleMapsLoader
        .loadScript()
        .then(() => {
          this.fetchReviews(this.placeId);
          this.startCarousel();
        })
        .catch((error) => {
          console.error('Error loading Google Maps script:', error);
        });
    }
  }

  private loadMockReviews(): void {
    this.http.get<any[]>('/assets/mocks/mock-reviews.json').subscribe({
      next: (data) => {
        this.reviews = data;
      },
      error: (err) => {
        console.error('Error loading mock reviews:', err);
      }
    });
  }

  private fetchReviews(placeId: string): void {
    const service = new google.maps.places.PlacesService(document.createElement('div'));
    service.getDetails(
      { placeId, fields: ['reviews'] },
      (place: any, status: string) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.reviews = place?.reviews || [];
        } else {
          console.error('Error fetching reviews:', status);
        }
      }
    );
  }

  private startCarousel(): void {
    this.intervalId = setInterval(() => {
      if (this.reviews.length > 0) {
        this.currentReviewIndex = (this.currentReviewIndex + 1) % this.reviews.length;
      }
    }, 10000);
  }

  selectReview(index: number): void {
    this.currentReviewIndex = index;
    this.resetCarousel();
  }

  private resetCarousel(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.startCarousel();
    }
  }
}
