import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  Injector,
  Type,
  ComponentRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { MetaService } from '../../../services/meta-service.service';
import { BusinessDataService } from '../../../services/business-data.service';
import { BusinessSectionsService } from '../../../services/business-sections.service';
import { Business } from '../../../model/business-questions.model';

import { CenterTextComponent } from '../../UI/center-text/center-text.component';
import { RightTextComponent } from '../../UI/right-text/right-text.component';
import { LeftTextComponent } from '../../UI/left-text/left-text.component';
import { ItemListComponent } from '../../UI/item-list/item-list.component';
import { CallToActionComponent } from '../../UI/call-to-action/call-to-action.component';
import { ConsultationComponent } from '../../UI/consultation/consultation.component';
import { ItemListImageComponent } from '../../UI/item-list-image/item-list-image.component';
import { TestimonialImageComponent } from '../../UI/testimonial-image/testimonial-image.component';
import { HeroComponent } from '../../UI/hero/hero.component';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TestimonialImageComponent,
    HeroComponent,
  ],
})
export class ServicesComponent implements OnInit, AfterViewInit {
  sections: any[] = [];
  businessId: string = '';
  business: Business | null = null;
  business$: Observable<Business | null>;
  isBrowser: boolean;

  @ViewChild('dynamicContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;

  componentsMap: Record<string, Type<any>> = {
    'center-text': CenterTextComponent,
    'right-text': RightTextComponent,
    'left-text': LeftTextComponent,
    'item-list': ItemListComponent,
    cta: CallToActionComponent,
    consultatioin: ConsultationComponent,
    'item-list-image': ItemListImageComponent,
  };

  constructor(
    private sectionService: BusinessSectionsService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private route: ActivatedRoute,
    private metaService: MetaService,
    private businessDataService: BusinessDataService,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.business$ = this.businessDataService.businessData$;
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    // const id = this.route.snapshot.queryParamMap.get('id');
    // if (id && this.isBrowser) {
    //   window.history.replaceState({}, '', this.router.url.split('?')[0]);
    // }

    this.businessDataService.businessData$.subscribe((business) => {
      if (!business) return;
      this.business = business;
      this.businessId = business.id;
      this.metaService.loadAndApplyMeta(this.businessId);
      this.loadSections();
    });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    setTimeout(() => {
      if (!this.container) return;
      if (this.business && this.sections.length) {
        this.loadComponents();
      } else {
        setTimeout(() => {
          if (this.sections.length) {
            this.loadComponents();
          }
        }, 500);
      }
    }, 500);
  }

  loadSections() {
    this.sectionService
      .getBusinessSections(this.businessId, 'services')
      .subscribe((sections) => {
        if (!sections?.length) return;

        this.sections = sections
          .filter((section) => section.isActive !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0));

        if (this.isBrowser) {
          this.loadComponents();
        }
      });
  }

  loadComponents() {
    if (!this.isBrowser || !this.container) return;

    this.container.clear();
    if (!this.sections.length) return;

    if (this.business?.theme?.themeType === 'hh') {
      let firstItemList: null = null,
        secondItemList = null;
      let leftRightSections: any[] = [],
        centerTextSection = null,
        ctaSection = null;

      this.sections.forEach((section) => {
        switch (section.component) {
          case 'item-list':
            if (!firstItemList) firstItemList = section;
            else secondItemList = section;
            break;
          case 'left-text':
          case 'right-text':
            leftRightSections.push(section);
            break;
          case 'center-text':
            centerTextSection = section;
            break;
          case 'cta':
            ctaSection = section;
            break;
        }
      });

      if (firstItemList) this.createComponent(firstItemList);
      if (secondItemList) this.createComponent(secondItemList);

      if (this.isBrowser) {
        if (leftRightSections.length) {
          const wrapper = document.createElement('div');
          wrapper.className = 'text-wrapper';

          leftRightSections.sort((a, b) =>
            a.component === 'left-text' ? -1 : 1
          );
          leftRightSections.forEach((section) => {
            const comp = this.createComponent(section);
            if (comp) wrapper.appendChild(comp.location.nativeElement);
          });

          if (this.container.element?.nativeElement) {
            this.container.element.nativeElement.appendChild(wrapper);
          }
        }
      }

      if (centerTextSection) this.createComponent(centerTextSection);
      if (ctaSection) this.createComponent(ctaSection);
    } else {
      this.sections.forEach((section) => this.createComponent(section));
    }
  }

  createComponent(section: any): ComponentRef<any> | null {
    const componentType =
      this.componentsMap[section.component as keyof typeof this.componentsMap];
    if (!componentType || !this.container) return null;

    const factory = this.resolver.resolveComponentFactory(componentType);
    const componentRef = this.container.createComponent(factory);

    this.applyComponentProperties(componentRef.instance, section);
    return componentRef;
  }

  applyComponentProperties(instance: any, section: any) {
    const isActive = section.isActive !== undefined ? section.isActive : true;
    Object.assign(instance, {
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

    });
  }

  applyReplaceKeyword(value: string): string {
    if (!value || !this.business?.businessName) return value;
    return value.replace(/{{\s*businessName\s*}}/g, this.business.businessName);
  }

  navigateToContact(): void {
    if (this.businessId) {
      this.router.navigate(['/contact-us'], {
        queryParams: { id: this.businessId },
      });
    }
  }
}
