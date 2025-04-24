import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    standalone: true,
    imports:[CommonModule, RouterOutlet]
})
export class AdminComponent {
  isBrowser: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  // Navigate to the business list page
  loadBusinessList() {
    if (this.isBrowser) {
    this.router.navigate(['/admin/businessList']);
    }
  }

  // Logout the user and navigate to the login page
  logout() {
    if (this.isBrowser) {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
  }
}
