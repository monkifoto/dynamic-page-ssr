import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { GoogleMapsLoaderService } from 'src/app/services/google-maps-loader.service'; // Adjust the path as necessary
import { environment } from 'src/environments/environment';

declare var google: any; // Declare google object for TypeScript

@Component({
    selector: 'app-google-maps',
    templateUrl: './google-maps.component.html',
    styleUrls: ['./google-maps.component.css'],
    standalone: false
})
export class GoogleMapsComponent implements OnInit, OnChanges {
  @Input() address: string = ''; // Input for the address to display on the map
  @Input() layoutType: string = 'demo'; // Example additional input

  useMockMap = environment.useMockGoogleMap;

  private map: any;
  private geocoder: any;

  constructor(private googleMapsLoader: GoogleMapsLoaderService) {}

  ngOnInit(): void {
    console.log('Google Map Address:', this.address);

    if (this.useMockMap) {
      console.log('Mock map mode: displaying static map image.');
      return;
    }

    // Load the Google Maps script via the service
    this.googleMapsLoader
      .loadScript()
      .then(() => {
        this.initializeMap();
        if (this.address) {
          this.showAddressOnMap(this.address);
        }
      })
      .catch((error) => {
        console.error('Error loading Google Maps script:', error);
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.useMockMap) return;

    if (changes['address'] && !changes['address'].firstChange) {
      this.showAddressOnMap(changes['address'].currentValue);
    }
  }

  private initializeMap(): void {
    this.map = new google.maps.Map(document.getElementById('map'), {
      center: { lat: -34.397, lng: 150.644 }, // Default center
      zoom: 8, // Default zoom
    });
    this.geocoder = new google.maps.Geocoder();
  }

  private showAddressOnMap(address: string): void {
    this.geocoder.geocode({ address: address }, (results: any, status: any) => {
      if (status === 'OK') {
        this.map.setCenter(results[0].geometry.location);

        // Adjust zoom to show a 10-mile area
        const bounds = new google.maps.LatLngBounds();
        bounds.extend(results[0].geometry.location);
        this.map.fitBounds(bounds);
        const scale = 10 * 1609.34; // 10 miles in meters
        this.map.setZoom(this.getZoomLevel(scale));

        new google.maps.Marker({
          map: this.map,
          position: results[0].geometry.location,
        });
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  }

  private getZoomLevel(radiusInMeters: number): number {
    const equatorLength = 40075004; // Earth's circumference in meters
    const widthInPixels = document.getElementById('map')?.offsetWidth || 640; // Default width if unavailable
    const metersPerPixel = equatorLength / (256 * Math.pow(2, this.map.getZoom()));
    return Math.floor(Math.log2(equatorLength / (radiusInMeters * metersPerPixel)));
  }
}
