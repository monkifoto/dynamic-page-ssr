import {
  Component,
  OnInit,
  ViewChild,
  ViewContainerRef,
  ComponentFactoryResolver,
  Injector,
  Type,
  ComponentRef,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MetaService } from 'src/app/services/meta-service.service';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { BusinessSectionsService } from 'src/app/services/business-sections.service';
import { Business } from 'src/app/model/business-questions.model';
import { switchMap } from 'rxjs';
import { CenterTextComponent } from '../../UI/center-text/center-text.component';
import { RightTextComponent } from '../../UI/right-text/right-text.component';
import { LeftTextComponent } from '../../UI/left-text/left-text.component';
import { ItemListComponent } from '../../UI/item-list/item-list.component';
import { CallToActionComponent } from '../../UI/call-to-action/call-to-action.component';
import { ConsultationComponent } from '../../UI/consultation/consultation.component';
import { LatestProductsComponent } from '../../UI/latest-products/latest-products.component';
import { MeetTheTeamComponent } from '../../UI/meet-the-team/meet-the-team.component';
import { TextWrapperComponent } from '../../text-wrapper/text-wrapper.component';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';

@Component({
    selector: 'app-about-us',
    templateUrl: './about-us.component.html',
    styleUrls: ['./about-us.component.css'],
    standalone: false
})
export class AboutUsComponent implements OnInit {
  sections: any[] = [];
  businessId: string = '';
  business: Business | null = null;
  business$ = this.businessDataService.businessData$;

  componentsMap: Record<string, Type<any>> = {
    'center-text': CenterTextComponent,
    'right-text': RightTextComponent,
    'left-text': LeftTextComponent,
    'item-list': ItemListComponent,
    cta: CallToActionComponent,
    consultation: ConsultationComponent,
    'meet-the-team': MeetTheTeamComponent,
    'latest-products': LatestProductsComponent,
  };

  @ViewChild('dynamicContainer', { read: ViewContainerRef })
  container!: ViewContainerRef;

  constructor(
    private sectionService: BusinessSectionsService,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private route: ActivatedRoute,
    private metaService: MetaService,
    private businessDataService: BusinessDataService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const id = this.route.snapshot.queryParamMap.get('id');
      if (id) {
        window.history.replaceState({}, '', this.router.url.split('?')[0]);
      }
    }

    this.businessDataService
      .getBusinessData()
      .subscribe((business) => {
        if (business) {
          this.businessId = business.id;
          this.business = business;
          this.loadSections();
        }
      });
  }
  ngAfterViewInit(): void {
    if (this.business) {
      this.loadComponents();
    }
  }

  loadSections() {
    this.sectionService
      .getBusinessSections(this.businessId, 'aboutus')
      .subscribe((sections) => {
        //console.log("📌 Retrieved Sections:", sections);
        if (!sections || sections.length === 0) {
          console.warn('❗ No sections retrieved from the service.');
          return;
        }
        this.sections = sections
          .filter((section) => section.isActive !== false)
          .sort((a, b) => (a.order || 0) - (b.order || 0));
        this.loadComponents();
      });
  }

  loadComponents() {
    if (!this.container) {
      console.error("❌ ViewContainerRef (container) is undefined.");
      return;
    }

    this.container.clear();

    if (!this.sections.length) {
      console.warn("❗ No sections available to load.");
      return;
    }

    // Extract CTA first
    let ctaSection: any = null;
    this.sections.sort((a, b) => (a.order || 0) - (b.order || 0));
    this.sections = this.sections.filter(section => {
      if (section.component === 'cta') {
        ctaSection = section;
        return false;
      }
      return true;
    });

    if (this.business?.theme?.themeType === 'hh') {
      let leftRightSections: any[] = [];
      let firstCenterText: any = null;
      let secondCenterText: any = null;
      let otherSections: any[] = [];

      this.sections.forEach(section => {
        if (section.component === 'center-text') {
          if (!firstCenterText) firstCenterText = section;
          else secondCenterText = section;
        } else if (section.component === 'left-text' || section.component === 'right-text') {
          leftRightSections.push(section);
        } else {
          otherSections.push(section);
        }
      });

      if (firstCenterText) {
        this.createComponent(firstCenterText);
      }

      if (leftRightSections.length > 0) {
        const wrapperRef = this.container.createComponent(TextWrapperComponent);
        leftRightSections.sort((a, b) => (a.component === 'left-text' ? -1 : 1));
        leftRightSections.forEach(section => {
          const compType = this.componentsMap[section.component];
          const childRef = wrapperRef.instance.container.createComponent(compType);
          this.applyComponentProperties(childRef.instance, section);
          childRef.changeDetectorRef.detectChanges();
        });
      }

      if (secondCenterText) {
        this.createComponent(secondCenterText);
      }

      otherSections.forEach(section => {
        this.createComponent(section);
      });

    } else {
      // Other themes (clemo, etc.)
      this.sections.forEach(section => {
        this.createComponent(section);
      });
    }

    // 🔁 Manual components like Meet the Team and Latest Products
    this.loadManualComponents();

    // ✅ CTA always last
    if (ctaSection) {
      this.createComponent(ctaSection);
    }
  }



  loadManualComponents() {
    if (this.business?.theme?.themeType == 'clemo') {
      const latestProductsFactory = this.resolver.resolveComponentFactory(
        LatestProductsComponent
      );
      const latestProductsRef = this.container.createComponent(
        LatestProductsComponent,
        {
          index: undefined,
          injector: this.injector,
        }
      );
      latestProductsRef.instance.layoutType = this.business?.theme?.themeType;
      latestProductsRef.changeDetectorRef.detectChanges();
    }

    const meetTheTeamRef = this.container.createComponent(
      MeetTheTeamComponent,
      {
        index: undefined,
        injector: this.injector,
      }
    );
    this.container.insert(meetTheTeamRef.hostView); // <-- required
    meetTheTeamRef.changeDetectorRef.detectChanges();
    meetTheTeamRef.changeDetectorRef.detectChanges();
  }

  createWrapper(group: any[]) {
    if (!group.length) return;

    // ✅ Create wrapper div dynamically
    const wrapperElement = document.createElement('div');
    wrapperElement.className = 'text-wrapper'; // ✅ Apply CSS styles

    // ✅ Ensure left-text is inserted FIRST before right-text
    group.sort((a, b) => (a.component === 'left-text' ? -1 : 1));

    // ✅ Insert left-text and right-text immediately inside the wrapper
    group.forEach((section) => {
      const componentRef = this.createComponent(section);
      if (componentRef !== null) {
        // ✅ Ensures valid component
        wrapperElement.appendChild(componentRef.location.nativeElement);
      }
    });

    // ✅ Append the wrapper to the container AFTER inserting left-text and right-text
    this.container.element.nativeElement.appendChild(wrapperElement);
  }

  createComponent(section: any): ComponentRef<any> | null {
    const componentType = this.componentsMap[section.component as keyof typeof this.componentsMap] as Type<any>;
    if (!componentType) {
      console.error(`❌ Component Not Found:`, section.component);
      return null;
    }

    const factory = this.resolver.resolveComponentFactory(componentType);
    const componentRef = this.container.createComponent(factory);
    this.applyComponentProperties(componentRef.instance, section);
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }

  applyComponentProperties(componentInstance: any, section: any) {
    const isActive = section.isActive !== undefined ? section.isActive : true;
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
    return value.replace(
      /{{\s*businessName\s*}}/g,
      this.business?.businessName || ''
    );
  }
}
