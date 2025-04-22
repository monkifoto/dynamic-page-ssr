// hero-manager.component.ts
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { BusinessPageHeroService } from 'src/app/services/business-page-hero.service';
import { UploadService } from 'src/app/services/upload.service';
import { Observable } from 'rxjs';
import { BusinessService } from 'src/app/services/business.service';

@Component({
    selector: 'app-hero-manager',
    templateUrl: './hero-manager.component.html',
    styleUrls: ['./hero-manager.component.css'],
    standalone: false
})
export class HeroManagerComponent implements OnInit {
  @Input() businessId!: string;
  heroForm: FormGroup;
  businesses: any[] = [];
  targetBusinessControl = new FormControl('');

  predefinedPages = [
    { value: 'home', label: 'Home' },
    { value: 'about-us', label: 'About Us' },
    { value: 'services', label: 'Services' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'location', label: 'Location' },
    { value: 'testimonials', label: 'Testimonials' },
    { value: 'contact-us', label: 'Contact Us' },
    { value: 'faq', label: 'FAQ' },
    { value: 'resident-form', label: 'Resident Form' }
  ];

  predefinedImages = [
    { url: 'assets/sharedAssets/image_fx_(1).jpg' },
    { url: 'assets/sharedAssets/istockphoto-1066099806-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1344063915-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1453597643-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1551967154-2048x2048.jpg' }
  ];

  uploadProgress: { [key: number]: Observable<number> } = {};

  constructor(
    private fb: FormBuilder,
    private pageHeroService: BusinessPageHeroService,
    private uploadService: UploadService,
    private cdRef: ChangeDetectorRef,
    private businessService: BusinessService
  ) {
    this.heroForm = this.fb.group({
      heroes: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadHeroes();
    this.loadBusinesses();
  }

  get heroes(): FormArray {
    return this.heroForm.get('heroes') as FormArray;
  }
  get targetBusinessId(): string {
    return this.targetBusinessControl.value || '';
  }

  loadHeroes() {
    if (!this.businessId) return;
    this.pageHeroService.getPageHeroes(this.businessId).subscribe(heroes => {
      this.heroes.clear();
      heroes.forEach(hero => {
        this.heroes.push(this.fb.group({
          id: [hero.id || null],
          page: [hero.page || 'home'],
          imageUrl: [hero.imageUrl || ''],
          message: [hero.message || ''],
          isActive: [hero.isActive ?? true],
          order: [hero.order || 0]
        }));
      });
      this.cdRef.detectChanges();
    });
  }

  addHero() {
    this.heroes.push(this.fb.group({
      id: [null],
      page: ['home'],
      imageUrl: [''],
      message: [''],
      isActive: [true],
      order: [0]
    }));
    this.cdRef.detectChanges();
  }

  removeHero(index: number) {
    const id = this.heroes.at(index).get('id')?.value;
    if (id && this.businessId) {
      this.pageHeroService.deletePageHero(this.businessId, id).then(() => {
        this.heroes.removeAt(index);
        this.cdRef.detectChanges();
      });
    } else {
      this.heroes.removeAt(index);
    }
  }

  uploadImage(event: Event, index: number): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.businessId) return;

    const heroGroup = this.heroes.at(index);
    const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(
      file,
      this.businessId,
      'heroImages'
    );

    downloadUrl.subscribe(url => {
      if (url) {
        heroGroup.patchValue({ imageUrl: url });
        heroGroup.get('imageUrl')?.updateValueAndValidity();
        this.cdRef.detectChanges();
      }
    });
  }

  selectPredefinedImage(index: number, url: string): void {
    const control = this.heroes.at(index);

    control.patchValue({ imageUrl: url });
    control.get('imageUrl')?.markAsDirty();
    control.get('imageUrl')?.markAsTouched();
    control.get('imageUrl')?.updateValueAndValidity();

    // Optional: helpful for debugging
    console.log(`🖼️ Predefined image selected for hero[${index}]:`, url);

    this.cdRef.detectChanges(); // Make sure Angular reflects the change
  }

  saveHero(index: number): void {
    const heroControl = this.heroes.at(index);

    if (!this.businessId) return;

    if (!heroControl.get('id')?.value && this.pageHeroService.generateNewId) {
      const generatedId = this.pageHeroService.generateNewId();
      heroControl.patchValue({ id: generatedId });
    }

    const heroData = heroControl.value;
    console.log('📤 Saving Hero:', heroData);

    this.pageHeroService
      .savePageHero(this.businessId, heroData)
      .then(() => console.log('✅ Hero saved'))
      .catch(err => console.error('❌ Save failed', err));
  }

  copyHeroToBusiness(index: number): void {
    const originalHero = this.heroes.at(index)?.value;
    const targetBusinessId = this.targetBusinessControl.value;

    if (!originalHero || !targetBusinessId) {
      console.warn('❌ Missing hero data or target business ID');
      return;
    }

    const newHero = {
      ...originalHero,
      id: this.pageHeroService.generateNewId?.() || null,
      message: `${originalHero.message} (Copy)`
    };

    this.pageHeroService
      .savePageHero(targetBusinessId, newHero)
      .then(() => {
        console.log('✅ Hero copied to:', targetBusinessId);
        alert('Hero copied successfully!');
      })
      .catch(err => console.error('❌ Error copying hero:', err));
  }

  loadBusinesses() {
    this.businessService.getAllBusinesses().subscribe(businesses => {
      this.businesses = businesses;
      this.cdRef.detectChanges();
    });
  }
}
