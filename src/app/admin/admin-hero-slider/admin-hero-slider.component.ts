import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { Business, SliderConfig } from 'src/app/model/business-questions.model';
import { BusinessService } from 'src/app/services/business.service';
import { UploadService } from 'src/app/services/upload.service';

@Component({
    selector: 'app-admin-hero-slider',
    templateUrl: './admin-hero-slider.component.html',
    styleUrls: ['./admin-hero-slider.component.css'],
    standalone: false
})
export class AdminHeroSliderComponent implements OnInit {
  sliderForm: FormGroup;
  uploadProgress: number[] = [];
  isSaving = false;
  message: string | null = null;

  sliderHeights: string[] = [
    '10vh', '20vh', '30vh', '40vh', '50vh', '60vh', '70vh', '80vh', '90vh', '100vh'
  ];

  @Input() business!: Business | undefined;
  @Input() businessId!: string;

  constructor(
    private fb: FormBuilder,
    private businessService: BusinessService,
    private uploadService: UploadService
  ) {
    this.sliderForm = this.fb.group({
      slides: this.fb.array([]),
      sliderConfig: this.fb.group({
        navigation: ['side'],
        sideButtons: [true],
        sliderHeight: ['100vh'],
        buttonBorderRadius: ['25px'],
        subtitleSize: ['1.5rem'],
        subtitleWeight: ['600']
      })
    });
  }

  ngOnInit(): void {
    this.loadSliderData();
  }

  get slides(): FormArray {
    return this.sliderForm.get('slides') as FormArray;
  }

  get sliderConfig(): FormGroup {
    return this.sliderForm.get('sliderConfig') as FormGroup;
  }

  loadSliderData(): void {
    this.businessService.getBusiness(this.businessId).subscribe((business) => {
      if (!business) {
        console.warn('AdminHeroSliderComponent - No business data found.');
        return;
      }

      // Clear slides and add the data from the backend
      this.slides.clear();
      if (business.heroSlider) {
        business.heroSlider.forEach((slide: any) => this.addSlide(slide));
      }

      // Load and apply slider configuration from the database
      if (business.sliderConfig) {
        this.applySliderConfig(business.sliderConfig);
      } else {
        console.warn('AdminHeroSliderComponent - No sliderConfig found in database.');
      }
    });
  }

  applySliderConfig(config: SliderConfig): void {
    // Apply slider configuration to the form
    this.sliderForm.patchValue({
      sliderConfig: {
        navigation: config.navigation ?? 'side',
        sideButtons: config.sideButtons ?? true,
        sliderHeight: config.sliderHeight ?? '100vh',
        buttonBorderRadius: config.buttonBorderRadius ?? '25px',
        subtitleSize: config.subtitleSize ?? '1.5rem',
        subtitleWeight: config.subtitleWeight ?? '600'
      }
    });
    //console.log('AdminHeroSliderComponent - Loaded slider config:', config);
  }

  addSlide(slide: any = { title: '', subtitle: '', backgroundImage: '', buttons: [] }): void {
    this.slides.push(
      this.fb.group({
        title: [slide.title, Validators.required],
        subtitle: [slide.subtitle],
        backgroundImage: [slide.backgroundImage],
        buttons: this.fb.array(
          slide.buttons.map((button: any) =>
            this.fb.group({
              text: [button.text, Validators.required],
              link: [button.link, Validators.required],
              outline: [button.outline],
            })
          )
        ),
      })
    );
  }

  removeSlide(index: number): void {
    this.slides.removeAt(index);
  }

  addButton(slideIndex: number): void {
    const buttons = this.slides.at(slideIndex).get('buttons') as FormArray;
    buttons.push(
      this.fb.group({
        text: ['', Validators.required],
        link: ['', Validators.required],
        outline: [false],
      })
    );
  }

  removeButton(slideIndex: number, buttonIndex: number): void {
    const buttons = this.slides.at(slideIndex).get('buttons') as FormArray;
    buttons.removeAt(buttonIndex);
  }

  uploadImage(event: Event, slideIndex: number): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];
      const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(
        file,
        this.businessId,
        'heroImages'
      );

      this.uploadProgress[slideIndex] = 0;

      uploadProgress.subscribe((progress) => {
        this.uploadProgress[slideIndex] = progress;
      });

      downloadUrl.subscribe((url) => {
        this.slides.at(slideIndex).get('backgroundImage')?.setValue(url);
        this.uploadProgress[slideIndex] = 100; // Complete
      });
    } else {
      console.error('No file selected');
    }
  }

  getButtons(slide: AbstractControl): FormArray {
    return slide.get('buttons') as FormArray;
  }

  saveSliderData(): void {
    if (this.sliderForm.valid) {
      this.isSaving = true;
      const updatedData = {
        heroSlider: this.sliderForm.value.slides,
        sliderConfig: this.sliderForm.value.sliderConfig // Ensure sliderConfig is included in the data
      };

      this.businessService.updateBusiness(this.businessId, updatedData).then(
        () => {
          this.isSaving = false;
          this.message = 'Slider data saved successfully!';
          setTimeout(() => (this.message = null), 3000);
        },
        (error) => {
          this.isSaving = false;
          this.message = 'Failed to save slider data. Please try again.';
          console.error('Error saving slider data:', error);
        }
      );
    }
  }
}
