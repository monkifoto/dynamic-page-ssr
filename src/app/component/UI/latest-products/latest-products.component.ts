import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
    selector: 'app-latest-products',
    templateUrl: './latest-products.component.html',
    styleUrls: ['./latest-products.component.scss'],
    standalone: false
})
export class LatestProductsComponent implements OnInit {
  @Input() layoutType: string = '';
  @Input() companies: { title: string; description: string; category: string; companyLogo?: string; link?: string, image:string; url:string;}[] = [
    {
    title: 'Ready Meds Farmacy',
    companyLogo: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FSJgFxBYkopnPR4WibCAf%2Fbusiness%2FReadMedsPharmacy.png?alt=media&token=3858e8a9-29b5-4497-ae67-976fabd34add',
    category: '',
    description: 'Ready Meds Pharmacy is a full-service long-term care pharmacy serving adult family homes, assisted living and long-term care facilities, as well as patients living independently.',
    image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FSJgFxBYkopnPR4WibCAf%2Fbusiness%2FReadMedsPharmacy.png?alt=media&token=3858e8a9-29b5-4497-ae67-976fabd34add',
    url: 'https://www.readymedspharmacy.com/'
  },
  {
    title: 'Novari Primary Care',
    companyLogo: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FSJgFxBYkopnPR4WibCAf%2Fbusiness%2Fnovariprimarycar.png?alt=media&token=452b5c99-472b-4ca7-bf3d-07011e1ffba2',
    category: '',
    description: 'Novari Primary Care is a mobile primary care service designed to treat patients in the comfort of their residential care facility.',
    image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FSJgFxBYkopnPR4WibCAf%2Fbusiness%2Fnovariprimarycar.png?alt=media&token=452b5c99-472b-4ca7-bf3d-07011e1ffba2',
    url: 'https://novariprimarycare.com'
  },
  {
    title: 'Holistia Health',
    companyLogo: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FSJgFxBYkopnPR4WibCAf%2Fbusiness%2Fhh3-logo2-WIDE.webp?alt=media&token=053879e9-bd0d-44cc-9a08-d2e298f0eb45',
    category: '',
    description: 'Holistia Health offers encompass personalized, in-person, and online programs, along with talk therapy and medication management.',
    image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FSJgFxBYkopnPR4WibCAf%2Fbusiness%2Fhh3-logo2-WIDE.webp?alt=media&token=053879e9-bd0d-44cc-9a08-d2e298f0eb45',
    url: 'https://holistiahealth.com'
  }


   ];
  @Input() products: { title: string; description: string; category: string; companyLogo?: string; link?: string, image:string; url:string; }[] = [ {
    title: 'LaunchPad Website',
    companyLogo: '',
    category: '$999',
    description: 'Get your adult family home online quickly with a simple yet professional single-page website. Perfect for a clean, mobile-friendly presence that showcases your services, location, and contact details. This package is great for those who want an affordable, no-fuss solution to establish credibility online.<br/><br/><ul><li>1 Year Free Hosting</li><li>Owner-Provided Photos</li><li>Onwer-Provided Logo</li><li>Custom Color Theme</li><li>1 year Maintenance & Updates</li></ul>',
    image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FMGou3rzTVIbP77OLmZa7%2FheroImages%2FA7400076.jpg?alt=media&token=1132bd32-3d2c-4f52-be31-3759c20b5285',
    url: ''
  },
  {
    title: 'Foundation Website',
    companyLogo: '',
    category: '$1799',
    description: 'A well-rounded five-page website designed to highlight all the key aspects of your adult family home. This package includes essential pages such as Home, About, Services, Gallery, and Contact, ensuring visitors get a complete picture of your offerings. SEO-optimized, mobile-responsive, and designed to attract potential residents and their families.<br/><br/><ul><li>3 Years of Secure Hosting</li><li>Proffessional Video</li><li>High-Quality Professional Photography</li><li>Custom Logo Design</li><li>Tailored Website Design</li><li>2 Years of Maintenance & Updates</li></ul>',
    image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FMGou3rzTVIbP77OLmZa7%2FheroImages%2FDJI_0061.jpg?alt=media&token=24aa3da1-a50d-47ec-89ae-588eb13e42a9',
    url: ''
  },
  {
    title: 'Prestige Website',
    companyLogo: '',
    category: '$2500+',
    description: 'A high-end, fully customized website tailored to your brand. This package includes professional photography and videography, custom design, logo creation, business card design, and advanced features such as integrated Google Maps, resident intake forms, and review sections. Perfect for those who want to stand out with a premium online presence. <br/><br/><ul><li>5 Years of Secure Hosting</li><li>Cinematic Professional Video</li><li>High-Resolution Professional Photography</li><li>Immersive Virtual Tour</li><li>CBespoke Logo Design</li><li>Exclusive, Custom Website Design</li><li>Comprehensive Maintenance & Updates</li></ul>',
    image: 'https://firebasestorage.googleapis.com/v0/b/afhdynamicwebsite.appspot.com/o/businesses%2FMGou3rzTVIbP77OLmZa7%2FheroImages%2FDJI_0713%20DTE-Edit.jpg?alt=media&token=31151dd0-c6fb-4cc1-acf8-eb50d617d318',
    url: ''
  }];

  displayItems: any[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  getSanitizedDescription(description: string) {
    return this.sanitizer.bypassSecurityTrustHtml(description);
  }


  ngOnInit(): void {
    console.log("Latest Products LayoutType:", this.layoutType);
    this.displayItems = this.layoutType === 'sb' ? this.products : this.companies;
  }

}
