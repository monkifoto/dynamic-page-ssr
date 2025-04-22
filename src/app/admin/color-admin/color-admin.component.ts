import { Component, Input, OnInit } from '@angular/core';
import { ThemeService } from 'src/app/services/theme-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { Business } from 'src/app/model/business-questions.model';
import { BusinessService } from 'src/app/services/business.service';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

declare var $: any;
@Component({
    selector: 'app-color-admin',
    templateUrl: './color-admin.component.html',
    styleUrls: ['./color-admin.component.css'],
    standalone: false
})
export class ColorAdminComponent implements OnInit {
  themeColors$: Observable<any> | undefined;
  themeForm!: FormGroup;
  @Input() form!: FormGroup;
  @Input() business!: Business | undefined;
  @Input() businessId!: string;


  defaultThemeFileName = 'assets/themes/default.css';
  availableThemes = [
    { name: 'Helping Hand Style', fileName: 'styles.css' , type: 'hh'},
    { name: 'A&E Style', fileName: 'styles1.css' , type: 'ae'},
    { name: 'EHC Style', fileName: 'styles2.css' },
    { name: 'Clemo Style', fileName: 'clemo.css', type: 'clemo' },
    { name: 'SB Style', fileName: 'sb.css' , type: 'sb'},
    { name: 'Demo Style', fileName: 'demo.css', type: 'demo' },
    { name: 'Single Page Style', fileName: 'single_page.css', type: 'sp' },
    { name: 'Prestige', fileName: 'prestige.css', type: 'prestige'}
    // Add other theme file names here
  ];

  defaultColors: any = {
    primaryColor: '#fffaf2', // default primary color
    secondaryColor: '#f8f3f0', // default secondary color
    accentColor: '#F0C987', // default accent color
    backgroundColor: '#F5F3E7', // default background color
    darkBackgroundColor: '#4C6A56', // default dark background color
    textColor: '#2F2F2F', // default text color
    navBackgroundColor: '#F5F3E7', // default nav background color
    navTextColor: '#33372C', // default nav text color
    navActiveBackground: '#33372C', // default nav active background color
    navActiveText: '#ffffff', // default nav active text color
    buttonColor: '#D9A064', // default button color
    buttonHoverColor: '#c9605b' // default button hover color
  };

  constructor(
    private themeService: ThemeService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router,
    private businessService: BusinessService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.businessId = params.get('id')!;
      if (this.businessId) {
        // Fetch the theme colors from the service
        console.log("Color-admin: - Business ID:", this.businessId);
        this.themeColors$ = this.themeService.getThemeColors(this.businessId);

        // Initialize the form with controls
        this.themeForm = this.fb.group({
          themeFileName: [this.defaultThemeFileName],
          themeType: [''],
          backgroundColor: ['', [Validators.required, this.hexValidator]],
          darkBackgroundColor: ['', [Validators.required, this.hexValidator]],
          primaryColor: ['', [Validators.required, this.hexValidator]],
          secondaryColor: ['', [Validators.required, this.hexValidator]],
          accentColor: ['', [Validators.required, this.hexValidator]],
          buttonColor: ['', [Validators.required, this.hexValidator]],
          buttonHoverColor: ['', [Validators.required, this.hexValidator]],
          textColor: ['', [Validators.required, this.hexValidator]],
          navBackgroundColor: ['', [Validators.required, this.hexValidator]],
          navTextColor: ['', [Validators.required, this.hexValidator]],
          navActiveBackground: ['', [Validators.required, this.hexValidator]],
          navActiveText: ['', [Validators.required, this.hexValidator]]
        });

        // Populate the form when the themeColors$ observable emits the data
        this.themeColors$.pipe(take(1)).subscribe(themeColors => {
          this.themeForm.patchValue(themeColors);
          if (themeColors.themeFileName) {
            this.themeService.applyThemeFile(themeColors.themeFileName);
          }
        });
      }
      else{
        console.log("Color-admin: - Business does not exist");
         // Initialize the form with controls
         this.themeForm = this.fb.group({
          themeFileName: [this.defaultThemeFileName],
          backgroundColor: this.defaultColors.backgroundColor,
          darkBackgroundColor:this.defaultColors.darkBackgroundColor,
          primaryColor: this.defaultColors.primaryColor,
          secondaryColor: this.defaultColors.secondaryColor,
          accentColor: this.defaultColors.accentColor,
          buttonColor: this.defaultColors.buttonColor,
          buttonHoverColor: this.defaultColors.buttonHoverColor,
          textColor:this.defaultColors.textColor,
          navBackgroundColor: this.defaultColors.navBackgroundColor,
          navTextColor: this.defaultColors.navTextColor,
          navActiveBackground: this.defaultColors.navActiveBackground,
          navActiveText: this.defaultColors.navActiveText,
        });
      }
    });
  }

  // Helper method to validate the hex color format
  hexValidator(control: any) {
    const hexColorPattern = /^#([0-9A-F]{3}){1,2}$/i;
    if (!hexColorPattern.test(control.value)) {
      return { invalidHex: true };
    }
    return null;
  }

  showSaveModal = false;

  openSaveConfirmation() {
    this.showSaveModal = true;
  }

  confirmSave() {
    this.onSubmit();
    this.showSaveModal = false;
  }

  cancelSave() {
    this.showSaveModal = false;
  }

  onSubmit() {
    if (this.themeForm.valid) {
      const updatedColors = this.themeForm.value;
      this.themeService.updateColors(this.businessId, updatedColors).then(() => {
        console.log('Color-admin: -Colors updated successfully');
        $('#saveConfirmationModal').modal('hide');
      }).catch(error => {
        console.error('Color-admin: -Error updating colors:', error);
      });
    }
  }

  resetToDefault() {
    this.themeService.resetToDefaultColors().pipe(take(1)).subscribe(defaultColors => {
      if (!defaultColors) {
        defaultColors = this.themeService.defaultTheme; // Fallback to the hardcoded defaultTheme in case the Firestore document is missing
      }

      // Reset the form with the default colors
      this.themeForm.patchValue(defaultColors);

      // Save the default colors to Firestore
      this.themeService.updateColors(this.businessId, defaultColors).then(() => {
        console.log('Color-admin: - Colors reset to default and saved successfully');
      }).catch(error => {
        console.error('Color-admin: - Error resetting colors to default:', error);
      });
    });
  }

  updateHexInput(event: Event, controlName: string) {
    const color = (event.target as HTMLInputElement).value;
    this.themeForm.patchValue({
      [controlName]: color
    });
  }

  updateColorInput(event: Event, controlName: string) {
    const hex = (event.target as HTMLInputElement).value;
    if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
      this.themeForm.patchValue({
        [controlName]: hex
      });
    }
  }

  onThemeChange(event: any) {
    const selectedThemeFile = event.target.value;
    this.themeForm.patchValue({ themeFileName: selectedThemeFile });
  }

  // onThemeFileChange(event: Event) {
  //   const selectedThemeFile = (event.target as HTMLSelectElement).value;

  //   // Update the theme file name in Firestore
  //   this.businessService.updateThemeFileName(selectedThemeFile).then(() => {
  //     console.log(`Theme file updated to: ${selectedThemeFile}`);
  //     this.themeForm.patchValue({ themeFileName: selectedThemeFile });
  //   this.themeService.applyThemeFile(selectedThemeFile);
  //   }).catch(error => {
  //     console.error('Error updating theme file:', error);
  //   });
  // }

  onThemeFileChange(event: any) {
    const selectedThemeFile = event.target.value;

    // Find the selected theme in the availableThemes array
    const selectedTheme = this.availableThemes.find(theme => theme.fileName === selectedThemeFile);

    if (selectedTheme) {
      // Extract the theme file and type (default to empty string if undefined)
      const themeType = selectedTheme.type || '';

      // Update the form values
      this.themeForm.patchValue({
        themeFileName: selectedThemeFile,
        themeType: themeType
      });

      console.log(`Selected Theme File: ${selectedThemeFile}, Type: ${themeType}`);
    }
  }

}
