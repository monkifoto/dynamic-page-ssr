import { Title } from '@angular/platform-browser';
import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  Injector,
  Type,
  PLATFORM_ID,
  Inject
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetaService } from '../../services/meta-service.service';
import { BusinessDataService } from '../../services/business-data.service';
import { BusinessSectionsService } from '../../services/business-sections.service';
import { CenterTextComponent } from '../UI/center-text/center-text.component';
import { RightTextComponent } from '../UI/right-text/right-text.component';
import { LeftTextComponent } from '../UI/left-text/left-text.component';
import { HeroSliderComponent } from '../UI/hero-slider/hero-slider.component';
import { ItemListComponent } from '../UI/item-list/item-list.component';
import { FeaturesComponent } from '../UI/features/features.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { TestimonialCarouselComponent } from '../UI/testimonial-carousel/testimonial-carousel.component';
import { ConsultationComponent } from '../UI/consultation/consultation.component';
import { WhyUsComponent } from '../UI/why-us/why-us.component';
import { GoogleMapsComponent } from '../UI/google-maps/google-maps.component';
import { Business } from '../../model/business-questions.model';
import { Observable } from 'rxjs';
import { IconListComponent } from '../UI/Deprecated/icon-list/icon-list.component';
import { LatestProductsComponent } from '../UI/latest-products/latest-products.component';
import { CallToActionComponent } from '../UI/call-to-action/call-to-action.component';
import { FaqComponent } from '../UI/faq/faq.component';
import { ItemListImageComponent } from '../UI/item-list-image/item-list-image.component';
import { StatsComponent } from '../UI/stats/stats.component';
import { VideoComponent } from '../UI/video/video.component';
import { Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports:[CommonModule]
})
export class HomeComponent implements OnInit {
  sections: any[] = [];
  businessId: string = '';
  business: Business | null = null;
  business$: Observable<Business | null> | undefined;

  componentsMap: Record<string, Type<any>> = {
    'center-text': CenterTextComponent,
    'hero-slider': HeroSliderComponent,
    'right-text': RightTextComponent,
    'left-text': LeftTextComponent,
    'item-list': ItemListComponent,
    'icon-list': IconListComponent,
    'unique-features': FeaturesComponent,
    'testimonials': TestimonialsComponent,
    'testimonials-carousel': TestimonialCarouselComponent,
    'why-us': WhyUsComponent,
    'google-map': GoogleMapsComponent,
    'latest-products': LatestProductsComponent,
    'cta': CallToActionComponent,
    'consultation': ConsultationComponent,
    'item-list-image': ItemListImageComponent
  };

  @ViewChild('dynamicContainer', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  constructor(
    private sectionService: BusinessSectionsService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private route: ActivatedRoute,
    private metaService: MetaService,
    private businessDataService: BusinessDataService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    // Initialize business$ here
    this.business$ = this.businessDataService.businessData$;

    this.businessDataService.getBusinessData().subscribe((business) => {
      if (business) {
        this.business = business;
        this.businessId = business.id!;
        this.loadSections();
      } else {
        console.warn('⚠️ No business data available in HomeComponent');
      }
    });
  }

  loadSections() {
    this.sectionService
      .getBusinessSections(this.businessId, 'home')
      .subscribe((sections) => {
        if (!sections || sections.length === 0) {
          console.warn('❗ No sections retrieved from the database');
          return;
        }

        this.sections = sections
          .filter((section) => section.isActive !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        this.loadComponents();
      });
  }

  loadComponents() {
    this.container.clear();
    this.container.createComponent(HeroSliderComponent);

    if (!this.sections.length) {
      console.warn('❗ No sections available to load.');
      return;
    }

    let consultationSection: any = null;

    this.sections.forEach((section) => {
      const componentType = this.componentsMap[
        section.component as keyof typeof this.componentsMap
      ] as Type<any>;

      if (!componentType) {
        console.error(`Component Not Found:`, section.component);
        return;
      }

      if (section.component === 'consultation') {
        consultationSection = section;
        return;
      }

      const componentRef = this.container.createComponent(componentType);
      this.assignComponentProperties(componentRef.instance, section);
    });

    this.loadManualComponents();

    if (consultationSection) {
      const consultationComponentType = this.componentsMap[
        'consultation'
      ] as Type<any>;

      if (consultationComponentType) {
        const consultationRef = this.container.createComponent(
          consultationComponentType
        );
        this.assignComponentProperties(
          consultationRef.instance,
          consultationSection
        );
      } else {
        console.error(`Consultation Component Not Found!`);
      }
    }
  }

  loadManualComponents() {
    if (this.business?.theme?.themeType === 'clemo') {
      this.container.createComponent(VideoComponent);
    }

    // Manually Load LatestProductsComponent if Business is SB
    if (this.business?.theme?.themeType == 'sb') {
      const latestProductsRef = this.container.createComponent(LatestProductsComponent);
      latestProductsRef.instance.layoutType = this.business?.theme?.themeType;
      latestProductsRef.changeDetectorRef.detectChanges();
    }

    // Manually Load StatusComponent if Business is Clemo
    if (this.business?.theme?.themeType == 'clemo') {
      const statsRef = this.container.createComponent(StatsComponent);
      statsRef.instance.businessId = this.business?.id;
      statsRef.changeDetectorRef.detectChanges();
    }

    // Manually Load TestimonialCarouselComponent if Business Has a Google Place ID
    if (isPlatformBrowser(this.platformId) && this.business?.placeId) {
      const testimonialCarouselRef = this.container.createComponent(TestimonialCarouselComponent);
      testimonialCarouselRef.instance.placeId = this.business.placeId;
    }

    // GOOGLE MAP COMPONENT
    if (this.business?.placeId && this.business?.theme?.themeType === 'clemo') {
      const gmapRef = this.container.createComponent(GoogleMapsComponent);
      gmapRef.instance.layoutType = this.business?.theme?.themeType || 'demo';
      gmapRef.instance.address = this.business?.address || '';
    }

    // FAQ COMPONENT
    if (this.business?.theme?.themeType === 'sp') {
      this.container.createComponent(FaqComponent);
    }
  }

  assignComponentProperties(componentInstance: any, section: any) {
    const isActive = section.isActive !== undefined ? section.isActive : true;
    if (componentInstance && typeof componentInstance === 'object') {
      Object.assign(componentInstance, {
        isActive: [isActive],
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

      if (componentInstance.changeDetectorRef) {
        componentInstance.changeDetectorRef.detectChanges();
      }
    }
  }

  applyReplaceKeyword(value: string): string {
    if (!value || !this.business?.businessName) return value;
    return value.replace(/{{\s*businessName\s*}}/g, this.business.businessName);
  }
}
