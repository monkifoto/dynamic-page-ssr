import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-why-us',
    templateUrl: './why-us.component.html',
    styleUrls: ['./why-us.component.css'],
    standalone: true,
    imports: [CommonModule]
})
export class WhyUsComponent implements OnInit {
  @Input() themeType!: string;
  @Input() _businessName: string = '';
  @Input() title: string = 'title';
  @Input() subTitle: string = 'subTitle';
  @Input() items: any[] = [];
  @Input() isMinimal: boolean = false;
  @Input() showLearnMore: boolean = false;
  @Input() sectionImageUrl: string | null = null;
  @Input() isParallax: boolean = true;
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
    // console.log('Why Us Component Loaded , themeType: '+ this.themeType+  ' Business Name:' + this._businessName + ' Title: ' + this.title);

    // console.log("📌 Section Why Us- Initialized:", {
    //   order:this.order,
    //   title: this.title,
    //   titleColor: this.titleColor,
    //   titleFontSize: this.titleFontSize,

    //   subTitle: this.subTitle,
    //   subTitileColor: this.subtitleColor,
    //   subtitleFontSize: this.subtitleFontSize,

    //   showButton: this.showButton ,
    //   buttonText: this.buttonText ,
    //   buttonLink: this.buttonLink ,

    //   alignText: this.alignText,
    //   boxShadow: this.boxShadow,
    //   borderRadius: this.borderRadius,

    //   items: this.items,
    //   isMinimal: this.isMinimal,
    //   sectionImageUrl: this.sectionImageUrl,
    //   isParallax: this.isParallax,
    //   backgroundColor: this.backgroundColor,

    //   subtitleColor: this.subtitleColor,
    //   textColor: this.textColor,
    //   fullWidth: this.fullWidth
    // });
  }
}

