import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { BusinessDataService } from '../../services/business-data.service';
import { Business } from '../../model/business-questions.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ExpandableNavigationComponent } from '../UI/expandable-navigation/expandable-navigation.component';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, ExpandableNavigationComponent]
})
export class NavigationComponent implements OnInit {
  businessId = '';
  business: Business | null = null;
  layoutType?: string;
  menuOpen = false;

  constructor(
    private businessDataService: BusinessDataService,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.businessDataService.getBusinessData().subscribe((business) => {
      if (business) {
        this.business = business;
        this.businessId = business.id;
        this.layoutType = business.theme?.themeType;
        console.log('Navigation Logo', business.logoImage);
        console.log('Navigation ID', business.id);
      }
    });
  }

  navigateTo(page: string): void {
    const queryParams = this.businessId ? { id: this.businessId } : {};
    this.closeMenu();
    this.router.navigate([`/${page}`], { queryParams }).then(success => {
      if (!success) console.error('Navigation failed!');
    });
  }

  scrollToSection(sectionId: string): void {
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
