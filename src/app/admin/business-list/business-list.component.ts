import { Component, OnInit } from '@angular/core';
import { BusinessService } from 'src/app/services/business.service';
import { Business } from 'src/app/model/business-questions.model';
import { Router } from '@angular/router';

@Component({
    selector: 'app-business-list',
    templateUrl: './business-list.component.html',
    styleUrls: ['./business-list.component.css'],
    standalone: false
})
export class BusinessListComponent implements OnInit {
  businesses: Business[] = [];
  showActiveOnly: boolean = true;

  constructor(private businessService: BusinessService, private router: Router) { }

  ngOnInit(): void {
    this.loadBusinesses();
  }



  loadBusinesses(): void {
    if (this.showActiveOnly) {
      this.businessService.getActiveBusinesses().subscribe(businesses => {
        this.businesses = businesses;
        //console.log(businesses);
      });
    } else {
      this.businessService.getAllBusinesses().subscribe(businesses => {
        this.businesses = businesses;
       // console.log(businesses);
      });
    }
  }


  editBusiness(id: string): void {
    this.router.navigate(['/admin/edit-business', id]);
  }

  deleteBusiness(id: string): void {
    if (confirm('Are you sure you want to delete this business?')) {
      this.businessService.updateBusiness(id, { isActive: false })
        .then(() => {
          alert('Business deleted successfully!');
          this.loadBusinesses();
        })
        .catch(err => console.error('Error deleting business', err));
    }
  }

  addNewBusiness(): void {
    this.router.navigate(['/admin/new']);
  }
}
