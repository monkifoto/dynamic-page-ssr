
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
} from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { CenterTextComponent } from '../UI/center-text/center-text.component'
import { RightTextComponent } from '../UI/right-text/right-text.component'
import { LeftTextComponent } from '../UI/left-text/left-text.component'
import { HeroSliderComponent } from '../UI/hero-slider/hero-slider.component'
import { ItemListComponent } from '../UI/item-list/item-list.component'
import { TestimonialsComponent } from '../testimonials/testimonials.component'
import { TestimonialCarouselComponent } from '../UI/testimonial-carousel/testimonial-carousel.component'
import { ConsultationComponent } from '../UI/consultation/consultation.component'
import { WhyUsComponent } from '../UI/why-us/why-us.component'
import { GoogleMapsComponent } from '../UI/google-maps/google-maps.component'
import { Business } from '../../model/business-questions.model'
import { LatestProductsComponent } from '../UI/latest-products/latest-products.component'
import { CallToActionComponent } from '../UI/call-to-action/call-to-action.component'
import { FaqComponent } from '../UI/faq/faq.component'
import { ItemListImageComponent } from '../UI/item-list-image/item-list-image.component'
import { StatsComponent } from '../UI/stats/stats.component'
import { VideoComponent } from '../UI/video/video.component'
import { CommonModule, isPlatformBrowser } from '@angular/common'
import { FeaturesComponent } from '../UI/features/features.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports:[CommonModule]
})
export class HomeComponent implements OnInit {
  sections: any[] = [];
  businessId: string = ''
  business: Business | null = null;

  componentsMap: Record<string, Type<any>> = {
    'center-text': CenterTextComponent,
    'hero-slider': HeroSliderComponent,
    'right-text': RightTextComponent,
    'left-text': LeftTextComponent,
    'item-list': ItemListComponent,
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
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const homeData = data['homeData'];
      if (homeData) {
        this.business = homeData.business;
        this.businessId = homeData.business?.id ?? '';
        this.sections = (homeData.sections || [])
          .filter((section: any) => section.isActive !== false)
          .sort((a: any, b: any) => (a.order || 0) - (b.order || 0));

        if (isPlatformBrowser(this.platformId)) {
          this.loadComponents();
        }
      }
    });
  }

  loadComponents() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.container.clear();

    if (this.sections.length) {
      this.container.createComponent(HeroSliderComponent);
    }

    let consultationSection: any = null;

    this.sections.forEach((section) => {
      const componentType = this.componentsMap[section.component];
      if (!componentType) return;

      if (section.component === 'consultation') {
        consultationSection = section;
        return;
      }

      const ref = this.container.createComponent(componentType);
      this.assignComponentProperties(ref.instance, section);
    });

    this.loadManualComponents();

    if (consultationSection) {
      const ref = this.container.createComponent(this.componentsMap['consultation']);
      this.assignComponentProperties(ref.instance, consultationSection);
    }
  }

  loadManualComponents() {
    if (!isPlatformBrowser(this.platformId)) return;

    const layout = this.business?.theme?.themeType;

    if (layout === 'clemo') {
      this.container.createComponent(VideoComponent);
      const statsRef = this.container.createComponent(StatsComponent);
      statsRef.instance.businessId = this.business?.id ?? '';
      statsRef.changeDetectorRef.detectChanges();
    }

    if (layout === 'sb') {
      const latestProductsRef = this.container.createComponent(LatestProductsComponent);
      latestProductsRef.instance.layoutType = layout;
      latestProductsRef.changeDetectorRef.detectChanges();
    }

    if (this.business?.placeId) {
      const testimonialCarouselRef = this.container.createComponent(TestimonialCarouselComponent);
      testimonialCarouselRef.instance.placeId = this.business.placeId;

      if (layout === 'clemo') {
        const gmapRef = this.container.createComponent(GoogleMapsComponent);
        gmapRef.instance.layoutType = layout;
        gmapRef.instance.address = this.business?.address || '';
      }
    }

    if (layout === 'sp') {
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

      if (componentInstance.changeDetectorRef && isPlatformBrowser(this.platformId)) {
        componentInstance.changeDetectorRef.detectChanges();
      }
    }
  }

  applyReplaceKeyword(value: string): string {
    if (!value || !this.business?.businessName) return value;
    return value.replace(/{{\s*businessName\s*}}/g, this.business.businessName);
  }
}
