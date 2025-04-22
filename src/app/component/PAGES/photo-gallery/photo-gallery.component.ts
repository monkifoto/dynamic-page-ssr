import { Component, OnInit, Input, ViewChild, ViewContainerRef, Type, ComponentFactoryResolver, Injector } from '@angular/core';
import { from, map, Observable, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business } from 'src/app/model/business-questions.model';
import { MetaService } from 'src/app/services/meta-service.service';
import { BusinessDataService } from 'src/app/services/business-data.service';


// Import section components
import { CenterTextComponent } from '../../UI/center-text/center-text.component';
import { RightTextComponent } from '../../UI/right-text/right-text.component';
import { LeftTextComponent } from '../../UI/left-text/left-text.component';
import { ItemListComponent } from '../../UI/item-list/item-list.component';
import { BusinessSectionsService } from 'src/app/services/business-sections.service';
import { CallToActionComponent } from '../../UI/call-to-action/call-to-action.component';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';


@Component({
    selector: 'app-photo-gallery',
    templateUrl: './photo-gallery.component.html',
    styleUrls: ['./photo-gallery.component.css'],
    standalone: false
})
export class PhotoGalleryComponent implements OnInit {
  @Input()
  businessId!: string;

  heroImages: any[] = [];
  images: any[] = [];
  businessImages: any[] = [];
  lifeStyleImages: any[] = [];
  employeeImages: any[] = [];

  business: Business | null = null;
  sections: any[] = [];
  selectedImageUrl: string | null = null;
  layoutType: string = 'demo';

    // Component map for dynamically loading sections
    componentsMap: Record<string, Type<any>> = {
      'center-text': CenterTextComponent,
      'right-text': RightTextComponent,
      'left-text': LeftTextComponent,
      'item-list': ItemListComponent,
      'cta': CallToActionComponent
    };

    @ViewChild('dynamicContainer', { read: ViewContainerRef }) container!: ViewContainerRef;
    @ViewChild('ctaContainer', { read: ViewContainerRef }) ctaContainer!: ViewContainerRef;


    constructor(
      private businessDataService: BusinessDataService,
      private route: ActivatedRoute,
      private webContent: WebContentService,
      private metaService: MetaService,
      private router: Router,
      private sectionService: BusinessSectionsService,
      private resolver: ComponentFactoryResolver,
      private injector: Injector,
      @Inject(PLATFORM_ID) private platformId: Object
    ) {}
    ngOnInit(): void {
      const id = this.route.snapshot.queryParamMap.get('id');

      // Clean up the URL if an ID param was used
      if (id && isPlatformBrowser(this.platformId)) {
        window.history.replaceState({}, '', this.router.url.split('?')[0]);
      }

      // Subscribe to the loaded business data
      this.businessDataService.businessData$.subscribe((business) => {
        if (!business) return;

        this.business = business;
        this.businessId = business.id;
        this.layoutType = business.theme?.themeType || '';

        this.loadImages();
        this.metaService.loadAndApplyMeta(this.businessId);
        this.loadSections();
      });
    }



  loadSections() {
    this.sectionService.getBusinessSections(this.businessId, 'gallery').subscribe((sections) => {
     // console.log("📌 Retrieved Sections:", sections);
      if (!sections || sections.length === 0) {
        console.warn("❗ No sections retrieved.");
        return;
      }
      this.sections = sections
      .filter(section => section.isActive !== false) // ❌ Remove inactive sections
      .sort((a, b) => (a.order || 0) - (b.order || 0)); // ✅ Sort by order
      this.loadComponents();
      this.loadCTAComponent();
    });
  }

  loadComponents() {
    if (!this.container) {
      console.error("❌ ViewContainerRef is undefined.");
      return;
    }
    this.container.clear(); // Clear previous components

    if (!this.sections.length) {
      console.warn("❗ No sections available to load.");
      return;
    }
    const gallerySections = this.sections.filter(section => section.component !== 'cta');
    gallerySections.forEach((section) => {
      this.createDynamicComponent(section, this.container);
    });
  }

  loadCTAComponent() {
    if (!this.ctaContainer) {
      console.error("❌ CTA ViewContainerRef is undefined.");
      return;
    }

    this.ctaContainer.clear(); // Clear previous CTA component

    const ctaSection = this.sections.find(section => section.component === 'cta');
    if (!ctaSection) {
      console.warn("❗ No CTA section found.");
      return;
    }

    this.createDynamicComponent(ctaSection, this.ctaContainer);
  }

  createDynamicComponent(section: any, containerRef: ViewContainerRef) {
    const componentType = this.componentsMap[section.component as keyof typeof this.componentsMap] as Type<any>;
    if (!componentType) {
      console.error(`❌ Component Not Found:`, section.component);
      return;
    }

    const factory = this.resolver.resolveComponentFactory(componentType);
    const componentRef = containerRef.createComponent(factory, undefined, this.injector);
    const isActive = section.isActive !== undefined ? section.isActive : true;
    Object.assign(componentRef.instance, {
      isActive : [isActive],
        order: section.order || 0,

        _businessName: this.business?.businessName || '',

        themeType: this.business?.theme?.themeType,
        items: section.items || [],
        isMinimal: section.isMinimal || false,
        isParallax: section.isParallax ?? true,
        backgroundColor: section.backgroundColor || '#ffffff',

        content: this.applyReplaceKeyword(section.sectionContent || ''),
        textColor: section.textColor || '#000000',
        textFontSize: section.textFontSize || '16',
        textFontStyle: section.textFontStyle || 'normal',
        alignText: section.alignText || 'left',

        title: this.applyReplaceKeyword(section.sectionTitle || ''),
        titleColor: section.titleColor || '#000000',
        titleFontSize: section.titleFontSize || '36',
        titleFontStyle: section.titleFontStyle || 'normal',

        subTitle: this.applyReplaceKeyword(section.sectionSubTitle || ''),
        subtitleColor: section.subtitleColor || '#000000',
        subtitleFontSize: section.subtitleFontSize || '14',
        subtitleFontStyle: section.subtitleFontStyle || 'normal',

        fullWidth: section.fullWidth || false,
        showBtn: section.showLearnMore || false,
        showButton: section.showButton || false,
        buttonText: section.buttonText || 'Learn More',
        buttonLink: section.buttonLink || '',

        showImage: !!section.sectionImageUrl,
        sectionImageUrl: section.sectionImageUrl || '',

        boxShadow: section.boxShadow || false,
        borderRadius: section.borderRadius ?? 10,
        page: section.page,
        location: section.location,
        businessId: this.business?.id,
    });
  }

  applyReplaceKeyword(value: string): string {
    if (!value || !this.business?.businessName) return value;
    return value.replace(/{{\s*businessName\s*}}/g, this.business.businessName);
  }


  loadImages(): void {
    type GalleryTarget = 'heroImages' | 'images' | 'businessImages' | 'lifeStyleImages' | 'employeeImages';

    const imageCategories: { key: string; target: GalleryTarget }[] = [
      { key: 'heroImages', target: 'heroImages' },
      { key: 'gallery', target: 'images' },
      { key: 'business', target: 'businessImages' },
      { key: 'lifeStyle', target: 'lifeStyleImages' },
      { key: 'employee', target: 'employeeImages' },
    ];

    imageCategories.forEach(({ key, target }) => {
      this.webContent.getBusinessUploadedImagesById(this.businessId, key).pipe(
        switchMap((images) => {
          //console.log(`Raw Firestore images for ${key}:`, images); // Debugging Step 1

          // Convert async calls to a Promise array
          const checks = images.map(async (image) => {
            const exists = await this.webContent.checkImageExists(image.url);
            return exists ? image : null;
          });

          return from(Promise.all(checks));
        }),
        map((images) => images.filter((image) => image !== null)),
        map((filteredImages) => {
         // console.log(`Filtered images for ${target}:`, filteredImages); // Debugging Step 2

          return filteredImages
          .map(img => ({
            url: img.url,
            title: (img as any).title?.trim() || null,
            description: (img as any).description?.trim() || null,
            link: (img as any).link?.trim() || null,
            order: !isNaN(Number((img as any).order)) ? Number((img as any).order) : 999
          }))

            .sort((a, b) => a.order - b.order);
        })
      ).subscribe((sortedImages) => {
        //console.log(`Sorted images for ${target}:`, sortedImages); // Debugging Step 3

        // Ensure target exists
        if (!this[target]) {
          this[target] = [];
        }

        this[target] = sortedImages;
      });
    });
  }

  onImageClick(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
  }

  closeLightbox() {
    this.selectedImageUrl = null;
  }

  onCloseModal() {
    this.selectedImageUrl = null;
  }


  navigateToContact(id: string | null | undefined) {
    //console.log('navigateToContact id', id);
    this.router.navigate(['/contact-us'], { queryParams: { id } });
  }

}
