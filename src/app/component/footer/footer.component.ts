import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { WebContentService } from '../../services/web-content.service';
import { Business } from '../../model/business-questions.model';
import { AuthService } from 'src/app/services/auth.service';
import { ThemeService } from 'src/app/services/theme-service.service';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';


@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css'],
    standalone: false
})
export class FooterComponent implements OnInit {
  business: Business | null = null;
  businessId: string | null = null;
  isAdmin = false;
  isAuthenticated$: Observable<boolean> | undefined;
  themeFileName?: string;
  layoutType?: string = 'demo';
  envName = environment.production ? 'Production' : 'Development';
  useMockMap = environment.useMockGoogleMap;
useMockReviews = environment.useMockGoogleReviews;


  constructor(
    private route: ActivatedRoute,
    private webContentService: WebContentService,
    private authService: AuthService,
    private themeService : ThemeService,
    private businessDataService: BusinessDataService,
    private router: Router
  ) {

  }

  navigateToIntakeForm() {
    this.router.navigate(['/resident-form'], {
      queryParams: { id: this.businessId },
    });
  }

  navigateTo(page: string): void {
    this.businessDataService.getBusinessId().subscribe((businessId) => {
      const id = businessId || this.businessId;
      const queryParams = id ? { id } : {};

      console.log('Navigating to:', page, 'with params:', queryParams);

      this.router.navigate([`/${page}`], { queryParams }).then(success => {
        if (!success) {
          console.error('Navigation failed!');
        }
      });
    });
  }

  ngOnInit(): void {
    // Subscribe to the business data from the BusinessDataService
    this.businessDataService.getBusinessData().subscribe(data => {
      this.business = data;
      //console.log("Footer business: ", this.business);
    });

    // Subscribe to get the businessId from the BusinessDataService
    this.businessDataService.getBusinessId().subscribe(businessId => {
      if (businessId) {
        this.businessId = businessId;
        this.layoutType = this.business?.theme.themeType;

        // Load the theme information based on the businessId
        this.themeService.getBusinessTheme(this.businessId).subscribe(tf => {
          if (tf) {
            this.themeFileName = tf.themeFileName;
          }
        });
      }
    });

    // Check if the user is authenticated
    this.isAuthenticated$ = this.authService.isAuthenticated();
  }
}
