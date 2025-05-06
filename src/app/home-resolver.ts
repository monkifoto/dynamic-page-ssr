import { Injectable } from '@angular/core';
import {
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { BusinessDataService } from './services/business-data.service';
import { BusinessSectionsService } from './services/business-sections.service';
import { Business } from './model/business-questions.model';

interface HomeData {
  business: Business | null;
  sections: any[];
}

@Injectable({
  providedIn: 'root'
})
export class HomeResolver implements Resolve<HomeData> {

  constructor(
    private businessDataService: BusinessDataService,
    private sectionService: BusinessSectionsService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<HomeData> {
    return this.businessDataService.getBusinessData().pipe(
      catchError(() => of(null)),
      switchMap((business) => {
        if (!business || !business.id) {
          return of({ business: null, sections: [] });
        }
        return this.sectionService.getBusinessSections(business.id, 'home').pipe(
          map(sections => ({ business, sections })),
          catchError(() => of({ business, sections: [] }))
        );
      })
    );
  }
}