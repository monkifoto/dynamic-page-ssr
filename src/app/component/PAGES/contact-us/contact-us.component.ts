import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WebContentService } from '../../../services/web-content.service';
import { BusinessDataService } from '../../../services/business-data.service';
import { Business, BusinessLocation } from '../../../model/business-questions.model';
import { MetaService } from '../../../services/meta-service.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EmailService } from '../../../services/email.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HeroComponent } from '../../UI/hero/hero.component';
import { FaqComponent } from '../../UI/faq/faq.component';
import { InformationComponent } from '../../UI/Deprecated/information/information.component';
import { GoogleMapsComponent } from '../../UI/google-maps/google-maps.component';
import { PhoneFormatPipe } from '../../../pipe/phone-format.pipe';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css'],
    standalone: true,
    imports:[CommonModule,
       FormsModule,
       ReactiveFormsModule,
      HeroComponent,
       FaqComponent,
      InformationComponent,
      GoogleMapsComponent,
    PhoneFormatPipe, HttpClientModule]
})
export class ContactUsComponent {
  business: Business | null = null;
  location: BusinessLocation | null = null;
  layoutType: string | undefined = 'demo';
  useMockMap = environment.useMockGoogleMap;

  formData = {
    name: '',
    email: '',
    phone: '',
    message: '',
    website: ''
  };

  modalVisible = false;
  modalTitle = '';
  modalMessage = '';

  constructor(
    private sanitizer: DomSanitizer,
    private businessDataService: BusinessDataService,
    private webContent: WebContentService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private emailService: EmailService,
    private router: Router,
    private metaService: MetaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  get sanitizedBusinessHours(): SafeHtml {
    return this.business?.businessHours
      ? this.sanitizer.bypassSecurityTrustHtml(this.business?.businessHours)
      : '';
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.formData.website = this.extractBaseDomain(window.location.hostname);
    }

    const id = this.route.snapshot.queryParamMap.get('id');
    if (id && isPlatformBrowser(this.platformId)) {
      window.history.replaceState({}, '', this.router.url.split('?')[0]);
    }

    this.businessDataService.businessData$.subscribe((business) => {
      if (!business) return;

      this.business = business;
      this.layoutType = business.theme?.themeType || 'demo';
      this.metaService.loadAndApplyMeta(business.id);

      this.businessDataService.getLocations().subscribe((locations) => {
        if (locations.length > 0) {
          this.location = locations[0];
        } else {
          console.warn('⚠️ No locations available.');
          this.location = null;
        }
      });
    });
  }

  onSubmit() {
    console.log(this.formData);
    this.emailService.sendEmail(this.formData).subscribe(
      (response) => {
        this.showModal('Message Sent', 'Thank you for your message! We will get back to you soon.');
      },
      (error) => {
        console.error('Error sending email', error);
        this.showModal('Error', 'There was an issue sending your message. Please try again later.');
      }
    );
  }

  private showModal(title: string, message: string) {
    this.modalTitle = title;
    this.modalMessage = message;
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
  }

  private extractBaseDomain(hostname: string): string {
    const parts = hostname.split('.');
    if (parts.length > 2) {
      return parts.slice(-2).join('.');
    }
    return hostname;
  }

  get formattedAddress(): string {
    return [
      this.location?.street,
      this.location?.city,
      this.location?.state,
      this.location?.zipcode
    ]
      .filter(part => part)
      .join(' ');
  }
}
