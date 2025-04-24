import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

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
      {
        path: 'businessList',
        canActivate: [() => !isPlatformServer(inject(PLATFORM_ID))],
        component: BusinessListComponent
      },
      {
        path: 'new',
        canActivate: [() => !isPlatformServer(inject(PLATFORM_ID))],
        component: EditBusinessComponent
      },
      {
        path: 'edit-business/:id',
        canActivate: [() => !isPlatformServer(inject(PLATFORM_ID))],
        component: EditBusinessComponent
      },
      {
        path: 'gallery-upload',
        canActivate: [() => !isPlatformServer(inject(PLATFORM_ID))],
        component: PhotoGalleryUploadComponent
      },
      {
        path: ':id',
        component: HomeComponent
      }
    ]
  }
];
