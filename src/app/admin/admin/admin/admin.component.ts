import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.css'],
    standalone: true,
    imports:[CommonModule, RouterOutlet]
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
