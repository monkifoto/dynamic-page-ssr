import { Routes } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { AboutUsComponent } from './component/PAGES/about-us/about-us.component';
import { ServicesComponent } from './component/PAGES/services/services.component';
import { ContactUsComponent } from './component/PAGES/contact-us/contact-us.component';
import { PhotoGalleryComponent } from './component/PAGES/photo-gallery/photo-gallery.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './admin/login/login.component';
import { ResidentIntakeFormComponent } from './component/PAGES/resident-intake-form/resident-intake-form.component';
import { TestimonialsListComponent } from './component/PAGES/testimonials/testimonials.component';
import { FaqComponent } from './component/UI/faq/faq.component';
import { LocationPageComponent } from './component/PAGES/location-page/location-page.component';
import { NotFoundComponent } from './component/PAGES/not-found/not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'services', component: ServicesComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'gallery', component: PhotoGalleryComponent },
  { path: 'login', component: LoginComponent },
  { path: 'resident-form', component: ResidentIntakeFormComponent},
  { path: 'testimonials', component: TestimonialsListComponent},
  { path: 'faq', component: FaqComponent},
  { path: 'location', component: LocationPageComponent },


    // Admin routes (must come before the dynamic :id route to avoid conflicts)
    { path: 'login', component: LoginComponent },
    {
      path: 'admin',
      loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
    },

    // Dynamic route for HomeComponent
    { path: ':id', component: HomeComponent },

    // Default redirect
    { path: '', redirectTo: '/home', pathMatch: 'full' },

    // Wildcard redirect
    { path: '**', component: NotFoundComponent }

];
