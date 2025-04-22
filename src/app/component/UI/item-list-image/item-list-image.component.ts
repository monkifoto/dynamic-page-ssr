import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-item-list-image',
    templateUrl: './item-list-image.component.html',
    styleUrls: ['./item-list-image.component.css'],
    standalone: false
})
export class ItemListImageComponent implements OnInit {
  @Input() title: string = 'Our Services';
  @Input() subTitle:string ='';
  @Input() items: any[] = [];
  @Input() isMinimal: boolean = false;
  @Input() showLearnMore: boolean = false;
  @Input() sectionImageUrl: string | null = null;
  @Input() isParallax: boolean = true;
  @Input() themeType: string = 'demo';
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
   @Input() businessId : number = 0;
   @Input() order: number =0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.fullWidth = this.convertToBoolean(this.fullWidth);
    console.log("📌 Item List Initialized:", {
      order:this.order,
      title: this.title,
      subTitle: this.subTitle,
      items: this.items,
      isMinimal: this.isMinimal,
      sectionImageUrl: this.sectionImageUrl,
      isParallax: this.isParallax,
      backgroundColor: this.backgroundColor,
      titleColor : this.titleColor,
      subtitleColor: this.subtitleColor,
      textColor: this.textColor,
      fullWidth: this.fullWidth
    });
  }

  private convertToBoolean(value: any): boolean {
    if (typeof value === 'boolean') return value; // Already boolean
    if (typeof value === 'string') return value.toLowerCase() === 'true'; // Convert string to boolean
    return false; // Default case
  }

  get titleParts(): { part1: string; part2: string | null } {
    if (this.title.includes('|')) {
      const [part1, part2] = this.title.split('|').map(part => part.trim());
      return { part1, part2 };
    }
    return { part1: this.title, part2: null };
  }

  navigateTo(page:string) {
    this.router.navigate(['/'+page], { queryParams: { id: this.businessId } });
  }
}
