import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    standalone: false
})
export class AdminComponent {
  constructor(private router: Router, private authService: AuthService) {}

  // Navigate to the business list page
  loadBusinessList() {
    this.router.navigate(['/admin/businessList']);
  }

  // Logout the user and navigate to the login page
  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
    });
  }
}
