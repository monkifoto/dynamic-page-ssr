import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BusinessService } from 'src/app/services/business.service';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { take } from 'rxjs';

@Component({
    selector: 'app-business-locations',
    templateUrl: './business-locations.component.html',
    styleUrls: ['./business-locations.component.css'],
    standalone: false
})
export class BusinessLocationsComponent implements OnInit {
  @Input() businessId!: string;
  locationForm: FormGroup;
  isSaving = false;
  message: string | null = null;
  @Output() locationsUpdated = new EventEmitter<any>();

  constructor(private fb: FormBuilder, private businessService: BusinessService, private businessDataService: BusinessDataService, private cdr: ChangeDetectorRef) {
    this.locationForm = this.fb.group({
      locations: this.fb.array([])
    });
  }

  ngOnInit(): void {
    if (this.businessId) {
      this.loadLocations();
    }
  }

  get locations(): FormArray {
    return this.locationForm.get('locations') as FormArray;
  }

  /** 📌 Load locations from Firestore */
  loadLocations(): void {
    this.businessDataService.getLocationsForBusiness(this.businessId)
    .pipe(take(1))
    .subscribe(
      locations => {
        console.log("📍 Firestore Locations Retrieved:", locations);
        if (locations && locations.length > 0) {
          this.setLocations(locations);
        } else {
          console.warn("⚠️ No locations found in Firestore.");
        }
      },
      error => {
        console.error("❌ Error retrieving locations:", error);
      }
    );
  }

  /** 📌 Add a new empty location field in UI */
  addLocation(location: any = {locationName:'', street: '', city: '', state: '', zipcode: '', phone: '', fax: '', email: '', image: '', businessHours:'' }): void {
    this.locations.push(
      this.fb.group({
        locationName : [location.locationName, Validators.required],
        street: [location.street, Validators.required],
        city: [location.city, Validators.required],
        state: [location.state, Validators.required],
        zipcode: [location.zipcode, Validators.required],
        phone: [location.phone, [Validators.required, Validators.pattern(/^\d{10}$/)]],
        fax: [location.fax],
        email: [location.email],
        image: [location.image],
        businessHours: [location.businessHours]
      })
    );
  }

  /** 📌 Remove a location from UI and Firestore */
  removeLocation(index: number): void {
    const locationId = this.locations.at(index).value.id;
    if (locationId) {
      this.businessService.deleteLocation(this.businessId, locationId).then(() => {
        console.log("✅ Location deleted successfully!");
      }).catch(error => {
        console.error("❌ Error deleting location:", error);
      });
    }
    this.locations.removeAt(index);
  }

  /** 📌 Save all locations in Firestore */
  saveLocations(): void {
    //console.log("🔥 Saving Locations...");

    if (this.locationForm.invalid) {
      console.error("❌ Location Form is INVALID:", this.locationForm.value);
      this.locationForm.markAllAsTouched();
      return;
    }

    const locations = this.locationForm.value.locations;

    locations.forEach((location: { id: string; }) => {
      if (location.id) {
        // Update existing location
        this.businessService.updateLocation(this.businessId, location.id, location).then(() => {
          console.log("✅ Location updated successfully!");
        }).catch(error => {
          console.error("❌ Error updating location:", error);
        });
      } else {
        // Add new location
        this.businessService.addLocation(this.businessId, location).then(() => {
          console.log("✅ New location added successfully!");
        }).catch(error => {
          console.error("❌ Error adding location:", error);
        });
      }
    });

    this.message = "Locations saved successfully!";
  }

  setLocations(locations: any[]): void {
    //console.log("📥 Setting Locations in Form:", locations);

    const locationArray = this.locationForm.get('locations') as FormArray;
    locationArray.clear();

    locations.forEach(location => {
      locationArray.push(
        this.fb.group({
          id: [location.id || null],
          locationName: [location.locationName || '' , Validators.required],
          street: [location.street || '', Validators.required],
          city: [location.city || '', Validators.required],
          state: [location.state || '', Validators.required],
          zipcode: [location.zipcode || location.zipcode || '', Validators.required],
          phone: [location.phone || ''],
          fax: [location.fax || ''],
          email: [location.email || '', [Validators.required, Validators.email]],
          image: [location.image || ''],
          businessHours: [location.businessHours || '']
        })
      );
    });

    //console.log("✅ Locations populated in Form:", this.locationForm.value);
    this.cdr.detectChanges(); // 🔥 Force UI to update
  }
}
