import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-why-us',
    templateUrl: './why-us.component.html',
    styleUrls: ['./why-us.component.css'],
    standalone: false
})
export class WhyUsComponent implements OnInit {
  @Input() themeType!: string;
  @Input() _businessName: string = '';
  @Input() title: string = 'title';  // ✅ Dynamically set from the section
  @Input() subTitle: string = 'subTitle';  // ✅ Dynamically set from the section
  @Input() items: any[] = []; // ✅ List of items in the section
  @Input() isMinimal: boolean = false; // ✅ Controls minimal/full view
  @Input() showLearnMore: boolean = false; // ✅ Toggle Learn More button
  @Input() sectionImageUrl: string | null = null; // ✅ Background image
  @Input() isParallax: boolean = true; // ✅ Controls whether parallax effect is applied
  @Input() layoutType: string ='demo';
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
  @Input() order: number = 0;

  constructor( private route: ActivatedRoute){}
  ngOnInit(): void {
    console.log('Why Us Component Loaded , themeType: '+ this.themeType+  ' Business Name:' + this._businessName + ' Title: ' + this.title);

    console.log("📌 Section Why Us- Initialized:", {
      order:this.order,
      title: this.title,
      titleColor: this.titleColor,
      titleFontSize: this.titleFontSize,

      subTitle: this.subTitle,
      subTitileColor: this.subtitleColor,
      subtitleFontSize: this.subtitleFontSize,

      showButton: this.showButton ,
      buttonText: this.buttonText ,
      buttonLink: this.buttonLink ,

      alignText: this.alignText,
      boxShadow: this.boxShadow,
      borderRadius: this.borderRadius,

      items: this.items,
      isMinimal: this.isMinimal,
      sectionImageUrl: this.sectionImageUrl,
      isParallax: this.isParallax,
      backgroundColor: this.backgroundColor,

      subtitleColor: this.subtitleColor,
      textColor: this.textColor,
      fullWidth: this.fullWidth
    });
  }
}

