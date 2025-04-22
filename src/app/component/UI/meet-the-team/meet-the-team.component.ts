import { Component, OnInit } from '@angular/core';
import { WebContentService } from 'src/app/services/web-content.service';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, filter } from 'rxjs/operators';
import { Employee } from 'src/app/model/business-questions.model';

@Component({
    selector: 'app-meet-the-team',
    templateUrl: './meet-the-team.component.html',
    styleUrls: ['./meet-the-team.component.css'],
    standalone: false
})
export class MeetTheTeamComponent implements OnInit {
  employees$!: Observable<Employee[]>;

  constructor(
    private employeeService: WebContentService,
    private businessDataService: BusinessDataService
  ) {}

  ngOnInit(): void {
    console.log('Meet The Team Component Initialized');
    this.employees$ = this.businessDataService.getBusinessId().pipe(
      filter((id): id is string => !!id), // Type guard to ensure id is not null
      switchMap(businessId =>
        this.employeeService.getEmployeesByBusinessId(businessId).pipe(
          catchError(error => {
            console.error('Error fetching employees:', error);
            return of([] as Employee[]);
          })
        )
      )
    );
  }
}
