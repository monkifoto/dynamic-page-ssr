import { Component, Input } from '@angular/core';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { Router } from '@angular/router';

interface TabData {
  title: string;
  number: string;
  description: string;
  imageUrl: string;
  link: string;
}

@Component({
    selector: 'app-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.css'],
    standalone: false
})
export class StatsComponent {
  @Input() backgroundImage: string = '';
  @Input() businessId: string ='';

  constructor(private businessDataService : BusinessDataService, private router: Router){}

  tabs: TabData[] = [
    {
      title: 'Years of Experience',
      number: '20+',
      description: 'Dedicated to exceptional care with over 20 years of experience in the industry.',
      imageUrl: '/assets/sharedAssets/istockphoto-941789670-2048x2048.jpg',
      link:'/about-us'
    },
    {
      title: 'Happy Families',
      number: '60+',
      description: 'Families served with compassionate and personalized care.',
      imageUrl: '/assets/sharedAssets/istockphoto-1307432717-2048x2048.jpg',
      link:'/about-us'
    },
    {
      title: 'Services Offered',
      number: '36',
      description: 'Comprehensive range of care services tailored to meet every need.',
      imageUrl: '/assets/sharedAssets/istockphoto-2012854188-2048x2048.jpg',
      link:'/services'
    }
  ];

  selectedTabIndex = 0;

  selectTab(index: number) {
    this.selectedTabIndex = index;
  }

  get selectedTab(): TabData {
    return this.tabs[this.selectedTabIndex];
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

}
