import { Component, OnInit } from '@angular/core';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business, BusinessLocation } from 'src/app/model/business-questions.model';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MetaService } from 'src/app/services/meta-service.service';
// import { Modal } from 'bootstrap';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EmailService } from 'src/app/services/email.service';
import { environment } from 'src/environments/environment';import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';



@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.component.html',
    styleUrls: ['./contact-us.component.css'],
    standalone: false
})
export class ContactUsComponent  implements OnInit{

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

  modalTitle: string = '';
  modalMessage: string = '';
  // responseModal!: Modal; // Modal instance

  constructor(
    private sanitizer: DomSanitizer,
    private businessDataService: BusinessDataService,
    private webContent: WebContentService,
    private route: ActivatedRoute,private http: HttpClient,
    private emailService: EmailService,
    private router: Router,
    private metaService: MetaService,
    @Inject(PLATFORM_ID) private platformId: Object){}


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

          // Flatten: get locations once business is confirmed
          this.businessDataService.getLocations().subscribe((locations) => {
            if (locations.length > 0) {
              this.location = locations[0];
              console.log('📍 Updated Location [0]:', this.location);
            } else {
              console.warn('⚠️ No locations available.');
              this.location = null;
            }
          });
        });
      }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const modalElement = document.getElementById('responseModal');
      if (modalElement) {
        // this.responseModal = new Modal(modalElement); // Bootstrap modal instance
      } else {
        console.error('Modal element not found.');
      }
    }, 0); // This delays execution to the next event loop cycle, ensuring the DOM is fully loaded
  }

  onSubmit() {
    console.log(this.formData);
        // Use the EmailService to send the email
        this.emailService.sendEmail(this.formData).subscribe(
          response => {
            this.modalTitle = 'Message Sent';
            this.modalMessage = 'Thank you for your message! We will get back to you soon.';
            // this.showModal();
          },
          error => {
            console.error('Error sending email', error);
            this.modalTitle = 'Error';
            this.modalMessage = 'There was an issue sending your message. Please try again later.';
            // this.showModal();
          }
        );
  }

  // Helper function to extract the base domain
  private extractBaseDomain(hostname: string): string {
    const parts = hostname.split('.');
    // Check if hostname has subdomains (e.g., subdomain.example.com)
    if (parts.length > 2) {
      return parts.slice(-2).join('.'); // Keep the last two parts (e.g., example.com)
    }
    return hostname; // If no subdomains, return as is
  }

  get formattedAddress(): string {
    return [
      this.location?.street,
      this.location?.city,
      this.location?.state,
      this.location?.zipcode
    ]
    .filter(part => part) // ✅ Remove undefined/null values
    .join(' '); // ✅ Join into a single string
  }

  // showModal() {
  //   if (this.responseModal) {
  //     this.responseModal.show();  // Use the Bootstrap modal instance to show the modal
  //   }
  // }

}
