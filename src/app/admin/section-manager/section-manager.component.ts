import { Component, Input, OnInit } from '@angular/core';
import {
  FormGroup,
  FormArray,
  FormBuilder,
  AbstractControl,
  FormControl,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { BusinessSectionsService } from 'src/app/services/business-sections.service';
import { UploadService } from 'src/app/services/upload.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'app-section-manager',
    templateUrl: './section-manager.component.html',
    styleUrls: ['./section-manager.component.css'],
    standalone: false
})
export class SectionManagerComponent implements OnInit {
  @Input() form!: FormGroup;
  @Input() businessId!: string;
  showInactiveSections: boolean = false;
  businessesList: any[] = []; // Stores available businesses

  collapsedSections: { [sectionId: string]: boolean } = {};
  sectionGroups: { [key: string]: FormGroup[] } = {};
  pages = [
    'home',
    'aboutus',
    'services',
    'faq',
    'contactus',
    'gallery',
    'testimonials',
  ];
  pageGroups = [
    'home',
    'aboutus',
    'services',
    'gallery',
    'location',
    'testimonials',
    'faq',
    'contactus',
    'uncategorized',
  ];

  locations = ['', 'left', 'right', 'top', 'bottom'];
  componentTypes = [
    'center-text',
    'left-text',
    'right-text',
    'item-list',
    'why-us',
    'unique-features',
    'cta',
    'consultation',
    'item-list-image'
  ];
  fontStyles = ['normal', 'bold', 'italic'];

  predefinedColors = [
    { name: 'Primary', value: 'var(--primary-color)' },
    { name: 'Secondary', value: 'var(--secondary-color)' },
    { name: 'Accent', value: 'var(--accent-color)' },
    { name: 'Background', value: 'var(--background-color)' },
    { name: 'Dark Background', value: 'var(--dark-background-color)' },
    { name: 'Text', value: 'var(--text-color)' },
    { name: 'Nav Background', value: 'var(--nav-background-color)' },
    { name: 'Nav Text', value: 'var(--nav-text-color)' },
    { name: 'Nav Active Background', value: 'var(--nav-active-background)' },
    { name: 'Nav Active Text', value: 'var(--nav-active-text)' },
    { name: 'Button', value: 'var(--button-color)' },
    { name: 'Button Hover', value: 'var(--button-hover-color)' },
    { name: 'Button Text', value: 'var(--button-text-color)' },
    { name: 'Border', value: 'var(--border-color)' }
  ]

  uploadProgress: { [key: number]: Observable<number> } = {};

  predefinedImages = [
    { url: 'assets/sharedAssets/image_fx_(1).jpg' },
    { url: 'assets/sharedAssets/image_fx_(2).jpg' },
    { url: 'assets/sharedAssets/image_fx_(3).jpg' },
    { url: 'assets/sharedAssets/image_fx_(4).jpg' },
    { url: 'assets/sharedAssets/image_fx_(5).jpg' },
    { url: 'assets/sharedAssets/istockphoto-478915838-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-480743801-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-502998071-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-613308420-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-653191338-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-655931804-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-804432288-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-912405752-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-918529390-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-941789670-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1022730404-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1066099806-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1097353864-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1162510523-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1170514008-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1207318385-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1307432717-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1315315044-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1319783351-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1324090651-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1335866199-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1344063915-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1432890664-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1453597643-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1551967154-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-2012854188-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-2032240867-2048x2048.jpg' },
    { url: 'assets/sharedAssets/5388429572_df9a403081_k.jpg' },
    { url: 'assets/sharedAssets/9676303919_32372bf834_o.jpg' },
    { url: 'assets/sharedAssets/istockphoto-590615058-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1145276617-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1296176596-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1321691755-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1389452512-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1629902196-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-1860450584-2048x2048.jpg' },
    { url: 'assets/sharedAssets/istockphoto-2163609093-2048x2048.jpg' },
  ];

  get sections(): FormArray {
    return this.form.get('sections') as FormArray;
  }

  constructor(
    private fb: FormBuilder,
    private businessSectionsService: BusinessSectionsService,
    private uploadService: UploadService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.form) {
      console.error("❌ Form is missing! Ensure the parent provides it.");
      return;
    }

    // ✅ Add `activeBusinessId` to the form if it's missing
    if (!this.form.get('activeBusinessId')) {
      console.warn("⚠️ Adding missing 'activeBusinessId' to form.");
      this.form.addControl('activeBusinessId', new FormControl(''));
    }
    this.loadBusinesses();
    this.loadSections();
  }


  loadBusinesses() {
    this.businessSectionsService.getAllBusinesses().subscribe((businesses) => {
      this.businessesList = businesses;

      this.cdRef.detectChanges();
    });
  }

  loadSections() {
    if (!this.businessId) return;

    this.businessSectionsService
      .getAllBusinessSections(this.businessId)
      .subscribe((sections) => {
        this.sections.clear();

        sections.sort((a, b) => {
          const pageComparison =
            this.pages.indexOf(a.page) - this.pages.indexOf(b.page);
          return pageComparison !== 0
            ? pageComparison
            : (a.order || 0) - (b.order || 0);
        });

        this.sectionGroups = {};
        this.pageGroups.forEach((page) => (this.sectionGroups[page] = []));

        sections.forEach((section, index) => {
         // console.log(`🔍 Section ${index + 1}:`, section); // Logs each section received
         // console.log(`🖼️ Image URL for Section ${index + 1}:`,section.sectionImageUrl ); // Specifically logs the image URL

          if (!section.id) {
            section.id = this.businessSectionsService.generateNewId(); // Ensure each section has an ID
          }


          const sectionForm = this.fb.group({
            id: [section.id],
            isActive: [section.isActive !== undefined ? section.isActive : true],
            component: [section.component || 'center-text'],
            order: [section.order || 0],
            sectionTitle: [section.sectionTitle],
            titleFontSize: [section.titleFontSize || 16],
            titleFontStyle: [section.titleFontStyle || 'normal'],
            sectionSubTitle: [section.sectionSubTitle],
            subtitleFontSize: [section.subtitleFontSize || 14],
            subtitleFontStyle: [section.subtitleFontStyle || 'normal'],
            textFontSize: [section.textFontSize || 14],
            textFontStyle: [section.textFontStyle || 'normal'],
            page: [section.page],
            location: [section.location],
            sectionContent: [section.sectionContent],
            sectionImageUrl: [section.sectionImageUrl],
            showImage: [section.showImage],
            showButton: [section.showButton || false],
            buttonText:[section.buttonText || 'Learn More'],
            buttonLink: [section.buttonLink || 'contact-us'],
            alignText: [section.alignText || 'left'],
            boxShadow:[section.boxShadow|| false],
            borderRadius: [section.borderRadius || 0],
            isMinimal: [section.isMinimal || false],
            isParallax: [section.isParallax || false],
            backgroundColor: [section.backgroundColor],
            textColor: [section.textColor],
            titleColor: [section.titleColor],
            subtitleColor: [section.subtitleColor],
            fullWidth:[section.fullWidth],
            imageSource: ['upload'],
            items: this.fb.array(
              section.items
                ? section.items.map((item) => this.createItemForm(item))
                : []
            ),
            activeBusinessId:[''],
            paddingTop: [section.paddingTop ?? 80],
            paddingBottom: [section.paddingBottom ?? 80],
            paddingLeft: [section.paddingLeft ?? 0],
            paddingRight: [section.paddingRight ?? 0],

            contentPadding: [section.contentPadding ?? 20],

          });

          const pageKey = this.pageGroups.includes(section.page) ? section.page : 'uncategorized';
          this.sectionGroups[pageKey].push(sectionForm);

          this.collapsedSections[section.id] = true;

        });
        this.cdRef.detectChanges();
      });
  }

  createItemForm(
    item: any = { title: '', description: '', icon: '' }
  ): FormGroup {
    return this.fb.group({
      title: [item.title],
      description: [item.description],
      icon: [item.icon],
    });
  }

  addSection() {
    const newSectionId = this.businessSectionsService.generateNewId(); // Generate a unique ID
    const defaultPage = 'home'; // Default section placement
    const newSection = this.fb.group({
      id: [newSectionId],
      isActive: [true],
      component: ['center-text'],
      order: [0],
      sectionTitle: [''],
      titleFontSize: [16],
      titleFontStyle: ['normal'],
      sectionSubTitle: [''],
      subtitleFontSize: [14],
      subtitleFontStyle: ['normal'],
      textFontSize: [14],
      textFontStyle: ['normal'],
      page: [defaultPage],
      location: ['center'],
      sectionImageUrl: [''],
      sectionContent: [''],
      showLearnMore: [false],
      showImage: [false],
      imageSource: ['upload'],
      showButton: [false],
      buttonText:['Learn More'],
      buttonLink: ['contact-us'],
      alignText: [ 'left'],
      boxShadow:[false],
      borderRadius: [0],
      backgroundColor: ['#ffffff'],
      textColor: ['#000000'],
      titleColor: ['#000000'],
      subtitleColor: ['#000000'],
      items: this.fb.array([]),
      activeBusinessId: [''],
      fullWidth: [false],
      paddingTop: [80],
      paddingBottom: [80],
      paddingLeft: [0],
      paddingRight: [0],
      contentPadding: [20],

    });


  // ✅ Ensure the section group exists before adding the section
  if (!this.sectionGroups[defaultPage]) {
    this.sectionGroups[defaultPage] = [];
  }

  // ✅ Add the new section to the correct group
  this.sectionGroups[defaultPage].push(newSection);

  // ✅ Collapse the new section by default
  this.collapsedSections[newSectionId] = true;

  // ✅ Trigger UI update
  this.cdRef.detectChanges();

  //console.log('✅ New section added:', newSection.value);
  }

  async removeSection(sectionId: string) {
    if (!this.businessId) {
        console.error("❌ Cannot remove section: Business ID is missing.");
        return;
    }

    // 🔴 Ask for confirmation before deleting
    const confirmed = confirm("⚠️ Are you sure you want to delete this section? This action cannot be undone.");
    if (!confirmed) {
        console.log("❌ Deletion cancelled by user.");
        return;
    }

    console.log(`🗑️ Attempting to remove section with ID: ${sectionId} from Business ID: ${this.businessId}`);

    try {
        // 🔥 Delete from Firestore
        await this.businessSectionsService.deleteSection(this.businessId, sectionId);

        // ✅ Remove from local state
        Object.keys(this.sectionGroups).forEach((page) => {
            this.sectionGroups[page] = this.sectionGroups[page].filter(
                (s) => s.get('id')?.value !== sectionId
            );
        });

        // ✅ Trigger UI update
        this.cdRef.detectChanges();

        console.log(`✅ Section successfully removed from Business ID: ${this.businessId}`);
    } catch (error) {
        console.error("❌ Error removing section:", error);
    }
}

  addItem(sectionId: string) {
    const section = this.findSectionById(sectionId);
    if (!section) return;

    const items = section.get('items') as FormArray;
    items.push(this.createItemForm());
  }

  removeItem(sectionId: string, itemIndex: number) {
    const section = this.findSectionById(sectionId);
    if (!section) return;

    const items = section.get('items') as FormArray;
    items.removeAt(itemIndex);
  }
  getItems(section: AbstractControl | null): FormArray | null {
    if (section instanceof FormGroup) {
      const items = section.get('items') as FormArray;
      //console.log('📌 Items for section:', items.value);
      return items;
    }
    return null;
  }
  async uploadImage(event: Event, sectionId: string): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file || !this.businessId) return;

    const section = this.findSectionById(sectionId);
    if (!section) return;

    try {
      const { uploadProgress, downloadUrl } = this.uploadService.uploadFile(
        file,
        this.businessId,
        'sectionsImages'
      );

      downloadUrl.subscribe((url) => {
        if (url) {
          section.patchValue({ sectionImageUrl: url });
          section.get('sectionImageUrl')?.updateValueAndValidity();
          console.log(`✅ Image uploaded successfully: ${url}`);
        }
      });
    } catch (error) {
      console.error('❌ Image upload failed:', error);
    }
  }

  clearImage(sectionId: string): void {
    const section = this.findSectionById(sectionId);
    if (section) {
      section.get('sectionImageUrl')?.setValue('');
    }
  }
  // Sets the image source (either 'upload' or 'predefined').
  setImageSource(index: number, source: string): void {
    const section = this.sections.at(index);
    section.get('imageSource')?.setValue(source);
    // Optionally clear the current image if switching to upload.
    if (source === 'upload') {
      section.get('sectionImageUrl')?.setValue('');
    }
  }

  // When a predefined image is clicked, update the section's image URL.
  selectPreferredImage(index: number, url: string): void {
    const section = this.sections.at(index);
    section.get('sectionImageUrl')?.setValue(url);
  }

  // Called when a checkbox for a predefined image is toggled.
  selectCheckboxImage(sectionId: string, url: string, event: Event): void {
    const checkbox = event.target as HTMLInputElement;
    const section = this.findSectionById(sectionId);

    if (!section) return;

    if (checkbox.checked) {
      section.get('sectionImageUrl')?.setValue(url);
    } else {
      if (section.get('sectionImageUrl')?.value === url) {
        section.get('sectionImageUrl')?.setValue('');
      }
    }
  }

  updateSection(section: FormGroup) {
    if (!this.businessId) return;

    const sectionData = section.value;

    if (!sectionData.id || sectionData.id.trim() === '') {
      console.warn("⚠️ Section is missing an ID, preventing accidental duplication.");
      return;
    }

    this.businessSectionsService
      .saveSection(this.businessId, sectionData)
      .then(() => console.log('✅ Section updated:', sectionData))
      .catch((err) => console.error('❌ Error updating section:', err));
  }

async duplicateSection(sectionId: string, targetBusinessId: string) {
    console.log("🛠️ Attempting to duplicate section...");
    console.log("📌 Section ID:", sectionId);
    console.log("📌 Target Business ID (before validation):", targetBusinessId);

    if (!targetBusinessId) {
        console.error("❌ Target Business ID is missing! Ensure a business is selected.");
        return;
    }

    try {
        // Find the original section using its ID
        const originalSection = this.findSectionById(sectionId);

        if (!originalSection) {
            console.error(`❌ Section with ID ${sectionId} not found.`);
            return;
        }

        // Extract section data from FormGroup
        const sectionData = originalSection.value;

        if (!sectionData) {
            console.error("❌ Failed to retrieve section data.");
            return;
        }

        console.log("🔍 Original Section Data:", sectionData);

        // ✅ Create a properly structured duplicated section
        const duplicatedSection = {
            ...sectionData,  // Copy all data
            id: this.businessSectionsService.generateNewId(),  // Generate a new ID
            sectionTitle: `${sectionData.sectionTitle || "Untitled"} (Copy)`,  // Append "Copy" to title
            items: sectionData.items ? [...sectionData.items] : []  // Ensure deep copy of items array
        };

        console.log("📌 Duplicated Section Data:", duplicatedSection);

        // ✅ Save the duplicated section to the target business
        await this.businessSectionsService.saveSection(targetBusinessId, duplicatedSection);

        console.log(`✅ Section duplicated successfully to business: ${targetBusinessId}`, duplicatedSection);
    } catch (err) {
        console.error("❌ Error duplicating section:", err);
    }
}

  toggleSection(sectionId: string): void {
    if (!sectionId) return;

    // Toggle section's collapsed state
    this.collapsedSections[sectionId] = !this.collapsedSections[sectionId];

    this.cdRef.detectChanges(); // ✅ Ensure UI updates immediately
  }

  toggleShowInactive(): void {
    console.log("🔄 Toggling Show Inactive Sections:", this.showInactiveSections);
    this.cdRef.detectChanges(); // ✅ Force UI update
  }

  findSectionById(sectionId: string): FormGroup | null {
    for (const page of Object.keys(this.sectionGroups)) {
      const section = this.sectionGroups[page].find(
        (s) => s.get('id')?.value === sectionId
      );
      if (section) return section;
    }
    return null;
  }

  logActiveBusinessId(section: FormGroup) {
    console.log("🔍 Selected Business ID:", section.get('activeBusinessId')?.value);
  }

}
