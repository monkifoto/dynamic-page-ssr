import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BusinessDataService } from 'src/app/services/business-data.service';

@Component({
    selector: 'app-consultation',
    templateUrl: './consultation.component.html',
    styleUrls: ['./consultation.component.css'],
    standalone: false
})
export class ConsultationComponent{
 @Input() themeType!: string;
 @Input() title!: string;
 @Input() subTitle!: string;
 @Input() imageURL!: string;
 @Input() showImage: boolean =false;
 @Input() _businessName: string = '';
 @Input() page: string ='';
 @Input() location: string ='';
 @Input() backgroundColor: string = '#ffffff';
 @Input() textColor: string = '#000000';
 @Input() titleColor: string = '#000000';
 @Input() titleFontSize: string = '34';
 @Input() subtitleColor: string = '#000000';
 @Input() subtitleFontSize: string = '14';
 @Input() fullWidth: boolean = false;
 @Input() showButton: boolean = false;
 @Input() buttonText: string ='Learn More';
 @Input() buttonLink: string ='contact-us';
 @Input() alignText: string= 'left';
 @Input() boxShadow: boolean = false;
 @Input() borderRadius: number = 0;
 @Input() items: any[] = []; // ✅ List of items in the section
 @Input() isMinimal: boolean = false; // ✅ Controls minimal/full view
 @Input() showLearnMore: boolean = false; // ✅ Toggle Learn More button
 @Input() sectionImageUrl: string | null = null; // ✅ Background image
 @Input() isParallax: boolean = true; // ✅ Controls whether parallax effect is applied
 @Input() businessId: string ='';
 @Input()
 set content(value: string) {
   this._content = value;
   this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this._content);
 }

   private _content!: string;
   sanitizedContent!: SafeHtml;

  constructor(
    private sanitizer: DomSanitizer,
     private router: Router,
     private businessDataService: BusinessDataService
    ) {}

  navigateToContact(id: string | undefined | null) {
    this.router.navigate(['/contact-us'], { queryParams: { id } });
  }

  navigateTo(page:string) {
   this.businessDataService.getBusinessId().subscribe((businessId) => {
      if (businessId) {
        this.businessId = businessId;
      }
    });
    
    this.router.navigate(['/'+page], { queryParams: { id: this.businessId } });
  }
}
