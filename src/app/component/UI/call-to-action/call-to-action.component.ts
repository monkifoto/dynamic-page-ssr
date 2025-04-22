import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BusinessDataService } from 'src/app/services/business-data.service';

@Component({
    selector: 'app-call-to-action',
    templateUrl: './call-to-action.component.html',
    styleUrls: ['./call-to-action.component.css'],
    standalone: false
})
export class CallToActionComponent implements OnInit {


  @Input() buttonText: string = 'Get in touch';
  @Input() isButton: boolean = false;
  @Input() bgColor: string = 'var(--background-color)';


  @Input() buttonBgColor: string = 'var(--button-color)';
  @Input() buttonTextColor: string = 'var(--button-text-color)';
  @Input() borderRadius: string = '10px';
  @Input() boxShadow: string = '0px 4px 6px rgba(0, 0, 0, 0.2)';
  @Input() page: string = 'contact-us';
  @Input() layout: 'full-width' | 'centered' = 'centered';
  @Input() businessId: string ='';
  @Input() themeType!: string;
  @Input() subTitle!: string;
  @Input() imageURL!: string;
  @Input() showImage: boolean =false;
  @Input() _businessName: string = '';
  @Input() location: string ='';
  @Input() backgroundColor: string = '#ffffff';

  @Input() title: string = 'Come Meet Our Family!';
  @Input() titleColor: string = 'var(--accent-color)';
  @Input() titleFontSize: string = '34';
  @Input() titleFontStyle: string = '#normal';

  @Input() subtitleColor: string = '#000000';
  @Input() subtitleFontSize: string = '14';
  @Input() subtitleFontStyle: string = '#normal';

  @Input() content: string = 'Questions before getting started?';
  @Input() textFontSize: string = '16';
  @Input() textFontStyle: string = 'normal';
  @Input() textColor: string = 'var(--text-color)';

  @Input() fullWidth: boolean = false;
  @Input() showButton: boolean = false;
  @Input() buttonLink: string ='contact-us';
  @Input() alignText: string= 'left';
  @Input() items: any[] = [];
  @Input() isMinimal: boolean = false;
  @Input() showLearnMore: boolean = false;
  @Input() sectionImageUrl: string | null = null;
  @Input() isParallax: boolean = true;

  constructor(private router: Router ,private businessDataService: BusinessDataService) {}

  ngOnInit(): void {
    console.log("CTA Initialized with:", {
      bgColor: this.bgColor,
      textColor: this.textColor,
      titleColor: this.titleColor,
      buttonBgColor: this.buttonBgColor,
      buttonTextColor: this.buttonTextColor,
      layout: this.layout
    });
    this.fullWidth = this.convertToBoolean(this.fullWidth);
  }


  navigateTo(page:string) {
    this.businessDataService.getBusinessId().subscribe((businessId) => {
       if (businessId) {
         this.businessId = businessId;
       }
     });
     console.log('Page: '+ page + ' Parameters = '+ this.businessId);
     this.router.navigate(['/'+page], { queryParams: { id: this.businessId } });
   }

  private convertToBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value; // Already boolean
    if (typeof value === 'string') return value.toLowerCase() === 'true'; // Convert string to boolean
    return false; // Default case
  }

}
