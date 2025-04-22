import { Component, OnInit } from '@angular/core';
import { WebContentService } from 'src/app/services/web-content.service';
import { Business } from 'src/app/model/business-questions.model';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MetaService } from 'src/app/services/meta-service.service';
// import { Modal } from 'bootstrap';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EmailService } from 'src/app/services/email.service';

@Component({
    selector: 'app-sp-contact-us-component',
    templateUrl: './sp-contact-us-component.component.html',
    styleUrls: ['./sp-contact-us-component.component.css'],
    standalone: false
})
export class SpContactUsComponentComponent implements OnInit {
  business: Business | null = null;
  layoutType: string | undefined = 'demo';

  formData = {
    name: '',
    email: '',
    message: '',
    website: '', // defer initialization
  };

  modalTitle: string = '';
  modalMessage: string = '';

  constructor(
    private sanitizer: DomSanitizer,
    private businessDataService: BusinessDataService,
    private webContent: WebContentService,
    private route: ActivatedRoute,
    private http: HttpClient,
    private emailService: EmailService,
    private metaService: MetaService
  ) {}

  get sanitizedBusinessHours(): SafeHtml {
    return this.business?.businessHours
      ? this.sanitizer.bypassSecurityTrustHtml(this.business.businessHours)
      : '';
  }

  ngOnInit(): void {
    // ✅ SSR-safe window check
    if (typeof window !== 'undefined') {
      this.formData.website = this.extractBaseDomain(window.location.hostname);
    }

    this.businessDataService.businessData$.subscribe((business) => {
      this.business = business;

      if (business?.id) {
        this.metaService.loadAndApplyMeta(business.id);
        this.layoutType = business?.theme?.themeType;
      }
    });
  }

  onSubmit() {
    console.log(this.formData);

    this.emailService.sendEmail(this.formData).subscribe(
      () => {
        this.modalTitle = 'Message Sent';
        this.modalMessage = 'Thank you for your message! We will get back to you soon.';
      },
      error => {
        console.error('Error sending email', error);
        this.modalTitle = 'Error';
        this.modalMessage = 'There was an issue sending your message. Please try again later.';
      }
    );
  }

  private extractBaseDomain(hostname: string): string {
    const parts = hostname.split('.');
    return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
  }
}
