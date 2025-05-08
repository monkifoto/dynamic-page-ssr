import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { SectionTitleComponent } from '../section-title/section-title.component';
import { WebContentService } from '../../../services/web-content.service';
import { BusinessDataService } from '../../../services/business-data.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap, filter } from 'rxjs/operators';
import { Employee } from '../../../model/business-questions.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-meet-the-team',
  templateUrl: './meet-the-team.component.html',
  styleUrls: ['./meet-the-team.component.css'],
  standalone: true,
  imports: [CommonModule, SectionTitleComponent]
})
export class MeetTheTeamComponent implements OnInit {
  employees$!: Observable<Employee[]>;
  isBrowser: boolean;

  constructor(
    private employeeService: WebContentService,
    private businessDataService: BusinessDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return; // 🚫 Avoid hydration issues
    }

    console.log('✅ Meet The Team Component Initialized (Browser Only)');
    this.employees$ = this.businessDataService.getBusinessId().pipe(
      filter((id): id is string => !!id), // Ensure it's not null
      switchMap(businessId =>
        this.employeeService.getEmployeesByBusinessId(businessId).pipe(
          catchError(error => {
            console.error('❌ Error fetching employees:', error);
            return of([] as Employee[]);
          })
        )
      )
    );
  }
}
