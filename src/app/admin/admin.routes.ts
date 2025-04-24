import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from '../auth.guard';
import { BusinessListComponent } from './business-list/business-list.component';
import { EditBusinessComponent } from './edit-business/edit-business.component';
import { PhotoGalleryUploadComponent } from './photo-gallery-upload/photo-gallery-upload.component';
import { HomeComponent } from '../component/home/home.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'businessList', component: BusinessListComponent },
      { path: 'new', component: EditBusinessComponent },
      { path: 'edit-business/:id', component: EditBusinessComponent },
      { path: 'gallery-upload', component: PhotoGalleryUploadComponent },
      { path: ':id', component: HomeComponent }
    ]
  }
];
