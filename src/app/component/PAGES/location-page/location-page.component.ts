import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BusinessDataService } from '../../../services/business-data.service';
import { Business } from '../../../model/business-questions.model';
import { GoogleMapsLoaderService } from '../../../services/google-maps-loader.service';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeroComponent } from '../../UI/hero/hero.component';




declare var google: any;

@Component({
    selector: 'app-location-page',
    templateUrl: './location-page.component.html',
    styleUrls: ['./location-page.component.css'],
    standalone: true,
    imports:[CommonModule, HeroComponent]
})
export class LocationPageComponent implements OnInit {
  business: Business | null = null;
  location: any = null;
  layoutType: string | undefined = 'demo';
  locationIndex: number | null = null;
  private map: any;
  private geocoder: any;
  useMockMap = environment.useMockGoogleMap;
  constructor(
    private route: ActivatedRoute,
    private businessDataService: BusinessDataService,
    private googleMapsLoader: GoogleMapsLoaderService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.locationIndex = Number(params['locationIndex']);

      // 🔄 Clean up URL if locationIndex was in query params
      if (params['locationIndex']) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
          replaceUrl: true
        });
      }

      // ✅ Business data already loaded in AppInitializer
      this.businessDataService.getBusinessData().subscribe(business => {
        if (business) {
          this.business = business;
          this.loadBusinessData(); // 🔥 still needed to use the locationIndex
        }
      });
    });
  }

  private loadBusinessData(): void {
    this.businessDataService.getBusinessData().subscribe((business) => {
      if (!business) {
        console.error("❌ Business data is null.");
        return;
      }

      //console.log("✅ Business Data Loaded:", business);

      this.business = business;
      this.layoutType = business.theme?.themeType;

      // 🔥 Debug: Log locations BEFORE using locationIndex
      console.log("📍 Locations in Business Data:", business.locations);
      console.log("🔢 Requested Location Index:", this.locationIndex);

      this.businessDataService.getLocations().subscribe((locations) => {
        if (locations && this.locationIndex !== null && this.locationIndex < locations.length) {
          this.location = locations[this.locationIndex];
          this.loadMap();
        } else {
          console.error("❌ Invalid or missing locationIndex or locations array.");
        }
      });
    });
  }


  private loadMap(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (this.useMockMap) {
      console.log('Mock map mode: displaying static map image.');
      return;
    }

    if (!this.location) {
      console.warn('⛔ Cannot load map: location is null');
      return;
    }

    this.googleMapsLoader.loadScript().then(() => {
      this.initializeMap();
      this.showAddressOnMap(`${this.location.street}, ${this.location.city}, ${this.location.state} ${this.location.zipcode}`);
    }).catch(error => {
      console.error('Error loading Google Maps script:', error);
    });
  }

  private initializeMap(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    if (isPlatformBrowser(this.platformId)) {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    });
    this.geocoder = new google.maps.Geocoder();
  }
  }

  private showAddressOnMap(address: string): void {
    this.geocoder.geocode({ address }, (results: any, status: any) => {
      if (status === 'OK') {
        this.map.setCenter(results[0].geometry.location);
        this.map.setZoom(12);
        new google.maps.Marker({
          map: this.map,
          position: results[0].geometry.location
        });
      } else {
        console.error('Geocode was not successful: ' + status);
      }
    });
  }

  navigateTo(page:string) {
     this.router.navigate(['/'+page], { queryParams: { id: this.business?.id } });
   }
}
