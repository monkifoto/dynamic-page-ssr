import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-our-services-home',
    templateUrl: './our-services-home.component.html',
    styleUrls: ['./our-services-home.component.css'],
    standalone: false
})


export class OurServicesHomeComponent {
  @Input() services!: { icon: string, title: string, description: string }[];
  @Input() layoutType: string = 'demo';
  expandedServiceIndex: number | null = null;

  toggleService(index: number) {
    // Toggle the service description on or off
    this.expandedServiceIndex = this.expandedServiceIndex === index ? null : index;
  }
}
