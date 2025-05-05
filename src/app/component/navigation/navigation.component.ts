import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BusinessDataService } from '../../services/business-data.service';
import { Business } from '../../model/business-questions.model';
import { Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ExpandableNavigationComponent } from '../UI/expandable-navigation/expandable-navigation.component';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.css'],
    standalone: true,
    imports:[CommonModule, RouterModule, ExpandableNavigationComponent]
})

export class NavigationComponent implements OnInit {
  businessId: string = '';
  business: Business | null = null;
  menuActive: boolean = false;
  menuOpen: boolean = false;
  layoutType?: string = 'demo';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private businessDataService: BusinessDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    // Subscribe to the businessId from the service
    this.businessDataService.getBusinessId().subscribe((businessId) => {
      if (businessId) {
        this.businessId = businessId;
        this.businessDataService.getBusinessData().subscribe((data) => {
          this.business = data;
          this.layoutType = this.business?.theme.themeType;
          console.log("Navigation Logo", this.business?.logoImage);
          console.log("Navigation ID", this.business?.id);
        });
      }
    });
  }




  navigateTo(page: string): void {
    const queryParams = this.businessId ? { id: this.businessId } : {};
    //console.log('This Business id from query string:', this.businessId);
    this.closeMenu();
    this.router.navigate([`/${page}`], { queryParams }).then(success => {
      if (!success) {
        console.error('Navigation failed!');
      }
    });
  }

  scrollToSection(sectionId: string) {
    if (isPlatformBrowser(this.platformId)) {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      this.menuOpen = false;
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu(): void {
    this.menuOpen = false;
  }
}
