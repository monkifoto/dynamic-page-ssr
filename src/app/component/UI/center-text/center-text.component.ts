import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
    selector: 'app-center-text',
    templateUrl: './center-text.component.html',
    styleUrls: ['./center-text.component.css'],
    standalone: false
})
export class CenterTextComponent implements OnInit {
  @Input() themeType!: string;


  @Input() imageURL!: string;
  @Input() showImage: boolean =false;
  @Input() _businessName: string = '';
  @Input() page: string ='';
  @Input() location: string ='';
  @Input() backgroundColor: string = '#ffffff';


  private _content!: string;
  sanitizedContent!: SafeHtml;
  @Input() textColor: string = '#000000';
  @Input() textFontSize: string = '16';
  @Input() textFontStyle: string = 'normal';
  @Input() alignText: string= 'left';

 @Input() title!: string;
  @Input() titleColor: string = '#000000';
  @Input() titleFontSize: string = '34';
  @Input() titleFontStyle: string = '#normal';

  @Input() subTitle!: string;
  @Input() subtitleColor: string = '#000000';
  @Input() subtitleFontSize: string = '14';
  @Input() subtitleFontStyle: string = '#normal';

  @Input() fullWidth: boolean = false;
  @Input() showButton: boolean = false;
  @Input() buttonText: string ='Learn More';
  @Input() buttonLink: string ='contact-us';

  @Input() boxShadow: boolean = false;
  @Input() borderRadius: number = 0;
  @Input() items: any[] = []; // ✅ List of items in the section
  @Input() isMinimal: boolean = false; // ✅ Controls minimal/full view
  @Input() showLearnMore: boolean = false; // ✅ Toggle Learn More button
  @Input() sectionImageUrl: string | null = null; // ✅ Background image
  @Input() isParallax: boolean = true; // ✅ Controls whether parallax effect is applied
  @Input() order: number = 0;


  constructor(private sanitizer: DomSanitizer, private router: Router) {}
  ngOnInit(): void {
    this.fullWidth = this.convertToBoolean(this.fullWidth);
    console.log('Center Text Component Loaded , themeType: '+ this.themeType+  ' Business Name:' + this._businessName + ' Title: ' + this.title);

    console.log("📌 Section Center Text- Initialized:", {
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


  @Input()
  set content(value: string) {
    this._content = value;
    this.sanitizedContent = this.sanitizer.bypassSecurityTrustHtml(this._content);
  }

  get titleParts(): { part1: string; part2: string | null } {
    if (this.title.includes('|')) {
      const [part1, part2] = this.title.split('|').map(part => part.trim());
      return { part1, part2 };
    }
    return { part1: this.title, part2: null };
  }

  get content(): string {
    return this._content;
  }

  navigateToContact(buttonLink:string) {
    this.router.navigate([buttonLink]);
  }

  private convertToBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value; // Already boolean
    if (typeof value === 'string') return value.toLowerCase() === 'true'; // Convert string to boolean
    return false; // Default case
  }

}
