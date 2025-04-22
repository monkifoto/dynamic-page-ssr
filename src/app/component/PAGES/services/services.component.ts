import { Component, OnInit, AfterViewInit, ViewChild, ViewContainerRef, ComponentFactoryResolver, Injector, Type, ComponentRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { ItemListImageComponent } from '../../UI/item-list-image/item-list-image.component';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';


@Component({
    selector: 'app-services',
    templateUrl: './services.component.html',
    styleUrls: ['./services.component.css'],
    standalone: false
})
export class ServicesComponent implements OnInit, AfterViewInit {
  sections: any[] = [];
  businessId: string = '';
  business: Business | null = null;
  business$ = this.businessDataService.businessData$;

  componentsMap: Record<string, Type<any>> = {
    'center-text': CenterTextComponent,
    'right-text': RightTextComponent,
    'left-text': LeftTextComponent,
    'item-list': ItemListComponent,
    'cta': CallToActionComponent,
    'consultatioin' : ConsultationComponent,
    'item-list-image': ItemListImageComponent
  };

  @ViewChild('dynamicContainer', { read: ViewContainerRef }) container!: ViewContainerRef;

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
    const id = this.route.snapshot.queryParamMap.get('id');

    // Clean URL if ?id= was passed
    if (id && isPlatformBrowser(this.platformId)) {
      window.history.replaceState({}, '', this.router.url.split('?')[0]);
    }

    this.businessDataService.businessData$.subscribe((business) => {
      if (!business) return;

      this.business = business;
      this.businessId = business.id;
      this.metaService.loadAndApplyMeta(this.businessId);
      this.loadSections();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (!this.container) {
        console.error("❌ ViewContainerRef (container) is still undefined after ViewInit.");
        return;
      }
      if (this.business && this.sections.length) {
        //console.log("✅ View and Sections Ready – Loading Components...");
        this.loadComponents();
      } else {
        console.warn("❗ Sections are not loaded yet, retrying...");
        setTimeout(() => {
          if (this.sections.length) {
            //console.log("✅ Sections loaded after retry – Loading Components...");
            this.loadComponents();
          }
        }, 500);
      }
    }, 500);
  }

  loadSections() {
    this.sectionService.getBusinessSections(this.businessId, 'services').subscribe((sections) => {
      console.log("📌 Retrieved Sections:", sections);
      if (!sections || sections.length === 0) {
        console.warn("❗ No sections retrieved from the service.");
        return;
      }
      this.sections = sections
      .filter(section => section.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
      this.loadComponents();
    });
  }

  loadComponents() {
    if (!this.container) {
      console.error("❌ ViewContainerRef (container) is undefined.");
      return;
    }

    this.container.clear(); // ✅ Clear previous components

    if (!this.sections.length) {
      console.warn("❗ No sections available to load.");
      return;
    }

    // ✅ Sort sections based on 'order' from the database
    this.sections.sort((a, b) => (a.order || 0) - (b.order || 0));

    if (this.business?.theme?.themeType === 'hh') {
      console.log("Loading sections for HH layout");
    let leftRightSections: any[] = [];
    let firstItemList: any = null;
    let secondItemList: any = null;
    let centerTextSection: any = null;
    let ctaSection: any = null;
    let otherSections: any[] = [];
    let wrapperElement: HTMLElement;

    // ✅ Identify `item-list`, `left-text/right-text`, `center-text`, and `cta`
    this.sections.forEach((section) => {
      if (section.component === 'item-list') {
        if (!firstItemList) {
          firstItemList = section;
        } else {
          secondItemList = section;
        }
      } else if (section.component === 'left-text' || section.component === 'right-text') {
        leftRightSections.push(section);
      } else if (section.component === 'center-text') {
        centerTextSection = section;
      } else if (section.component === 'cta') {
        ctaSection = section;
      } else {
        otherSections.push(section);
      }
    });

    // ✅ 1️⃣ Render first `item-list`
    if (firstItemList) {
      //console.log("✅ Rendering first item-list...");
      this.createComponent(firstItemList);
    }

    // ✅ 2️⃣ Render second `item-list`
    if (secondItemList) {
      //console.log("✅ Rendering second item-list...");
      this.createComponent(secondItemList);
    }

    // ✅ 3️⃣ Create wrapper but DO NOT append it yet
    if (leftRightSections.length > 0) {
      //console.log("✅ Creating wrapper for left-right text...");
      wrapperElement = document.createElement('div');
      wrapperElement.className = 'text-wrapper';

      // ✅ Sort left-text before right-text
      leftRightSections.sort((a, b) => (a.component === 'left-text' ? -1 : 1));

      // ✅ Insert left-text and right-text into wrapper
      leftRightSections.forEach((section) => {
        const componentRef = this.createComponent(section);
        if (componentRef) {
          wrapperElement.appendChild(componentRef.location.nativeElement);
        }
      });

      // ✅ Now insert wrapper AFTER the second item-list
      this.container.element.nativeElement.appendChild(wrapperElement);
    }

    // ✅ 4️⃣ Render center-text AFTER wrapper
    if (centerTextSection) {
      //console.log("✅ Rendering center-text...");
      this.createComponent(centerTextSection);
    }

    // ✅ 5️⃣ Ensure CTA is last
    if (ctaSection) {
      //console.log("✅ Rendering CTA at last position...");
      this.createComponent(ctaSection);
    }
  }else{
    // Load components based on the 'order' property
    console.log("Loading sections based on order");
    this.sections.sort((a, b) => (a.order || 0) - (b.order || 0));
    this.sections.forEach((section) => {
        this.createComponent(section);
    });

}
  }

  createWrapper(group: any[]) {
    if (!group.length || !isPlatformBrowser(this.platformId)) return;

    // ✅ Create wrapper div dynamically in the browser only
    const wrapperElement = document.createElement('div');
    wrapperElement.className = 'text-wrapper';

    // ✅ Sort left-text before right-text
    group.sort((a, b) => (a.component === 'left-text' ? -1 : 1));

    // ✅ Create and append each component to the wrapper
    group.forEach((section) => {
      const componentRef = this.createComponent(section);
      if (componentRef !== null && componentRef.location?.nativeElement) {
        wrapperElement.appendChild(componentRef.location.nativeElement);
      }
    });

    // ✅ Append the wrapper to the container
    if (this.container?.element?.nativeElement) {
      this.container.element.nativeElement.appendChild(wrapperElement);
    }
  }

  createComponent(section: any, insertBeforeElement?: HTMLElement): ComponentRef<any> | null {
    const componentType = this.componentsMap[section.component as keyof typeof this.componentsMap] as Type<any>;
    if (!componentType) {
      console.error(`❌ Component Not Found:`, section.component);
      return null; // Prevent errors if the component is not found
    }

    const factory = this.resolver.resolveComponentFactory(componentType);
    const componentRef = this.container.createComponent(factory);

    this.applyComponentProperties(componentRef.instance, section);

    // ✅ If we need to insert before the wrapper, do it manually
    if (insertBeforeElement) {
      this.container.element.nativeElement.insertBefore(
        componentRef.location.nativeElement,
        insertBeforeElement
      );
    } else {
      if (isPlatformBrowser(this.platformId)) {
        this.container.element.nativeElement.appendChild(componentRef.location.nativeElement);
      }
    }

    return componentRef;
  }




  applyComponentProperties(componentInstance: any, section: any) {

    const isActive = section.isActive !== undefined ? section.isActive : true;
    Object.assign(componentInstance, {
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
      location: section.location
    });
  }
  applyReplaceKeyword(value: string): string {
    if (!value || !this.business?.businessName) return value;

    // Match {{businessName}} instead of {businessName}
    return value.replace(/{{\s*businessName\s*}}/g, this.business.businessName);
  }

  navigateToContact(): void {
    if (this.businessId) {
      this.router.navigate(['/contact-us'], { queryParams: { id: this.businessId } });
    }
  }
}
