import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminRoutingModule } from './admin-routing.module';
// import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin/admin.component';
import { BusinessListComponent } from './business-list/business-list.component';
// import { BusinessLocationsComponent } from './business-locations/business-locations.component';


@NgModule({
  declarations: [
    // LoginComponent,
    AdminComponent,
    BusinessListComponent,
    // HeroManagerComponent,
    // BusinessLocationsComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    FormsModule
  ],
  exports:[
    // BusinessLocationsComponent
  ]
})
export class AdminModule { }
