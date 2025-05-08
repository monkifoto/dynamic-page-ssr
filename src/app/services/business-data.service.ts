import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of, firstValueFrom } from 'rxjs';
import { map, switchMap, tap, distinctUntilChanged } from 'rxjs/operators';
import { BusinessService } from './business.service';
import { BusinessPageHeroService } from './business-page-hero.service';
import { Business } from '../model/business-questions.model';
import { SSR_BUSINESS_ID, SERVER_REQUEST } from "../tokens/server-request.token";
import { TransferState, makeStateKey } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BusinessDataService {
  private businessDataSubject = new BehaviorSubject<Business | null>(null);
  private businessIdSubject = new BehaviorSubject<string | null>(null);
  private locationsSubject = new BehaviorSubject<any[]>([]);
  private pageHeroSubject = new BehaviorSubject<any[]>([]);

  public businessData$: Observable<Business | null> = this.businessDataSubject.asObservable().pipe(
    distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b))
  );

  constructor(
    @Inject(SERVER_REQUEST) private req: Request | null,
    private businessService: BusinessService,
    private businessPageHeroService: BusinessPageHeroService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(SSR_BUSINESS_ID) private ssrBusinessId: string,
    private transferState: TransferState
  ) {
    if (isPlatformServer(this.platformId)) {
      console.log('📡 SERVER_REQUEST headers:', this.req?.headers);
      console.log('📡 SERVER_REQUEST url:', this.req?.url);
    }

    if (isPlatformServer(this.platformId) && this.ssrBusinessId) {
      console.log('✅ Preloading business ID on server:', this.ssrBusinessId);
      this.businessIdSubject.next(this.ssrBusinessId);
      this.loadBusinessData(this.ssrBusinessId).pipe().subscribe({
        next: (business) => {
          console.log('✅ Business data preloaded:', business?.businessName);
        },
        error: (err) => {
          console.error('❌ Error preloading business:', err);
        }
      });
    }
  }

  loadBusinessData(businessId: string): Observable<Business | null> {
    console.log('📥 loadBusinessData for ID:', businessId);
    const STATE_KEY = makeStateKey<Business>(`business-${businessId}`);

    // ✅ Memory cache
    if (this.businessDataSubject.value?.id === businessId) {
      console.log('♻️ Using cached businessDataSubject');
      return this.businessDataSubject.asObservable();
    }

    // ✅ SSR → Browser hydration
    if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(STATE_KEY)) {
      const cached = this.transferState.get<Business>(STATE_KEY, null as any);
      this.transferState.remove(STATE_KEY);
      console.log('♻️ Using business data from TransferState:', cached?.businessName);

      this.businessDataSubject.next(cached);
      this.businessIdSubject.next(businessId);
      this.loadBusinessExtras(businessId);
      return of(cached);
    }

    // ✅ Server-side or fallback fetch from Firestore
    return this.businessService.getBusinessData(businessId).pipe(
      map(business => {
        if (!business) return null;
        if (!business.sections) {
          business.sections = [];
          console.warn('⚠️ No sections found, initializing empty array');
        }
        return business;
      }),
      tap(business => {
        this.businessDataSubject.next(business);
        this.businessIdSubject.next(businessId);

        if (isPlatformServer(this.platformId) && business) {
          this.transferState.set(STATE_KEY, business);
          console.log('📤 Cached business in TransferState:', business.businessName);
        }

        this.loadBusinessExtras(businessId);
      })
    );
  }

  private async loadBusinessExtras(businessId: string) {
    try {
      const locations = await firstValueFrom(this.businessService.getLocations(businessId));
      this.locationsSubject.next(locations);
    } catch (err) {
      console.error('❌ Error loading locations:', err);
    }

    try {
      const pageHeroes = await firstValueFrom(this.businessPageHeroService.getPageHeroes(businessId));
      this.pageHeroSubject.next(pageHeroes);
    } catch (err) {
      console.error('❌ Error loading page heroes:', err);
    }
  }

  getBusinessData(): Observable<Business | null> {
    return this.businessDataSubject.asObservable();
  }

  getBusinessId(): Observable<string | null> {
    return this.businessIdSubject.asObservable();
  }

  setBusinessId(id: string) {
    this.businessIdSubject.next(id);
  }

  getLocations(): Observable<any[]> {
    return this.locationsSubject.asObservable();
  }

  getPageHeros(): Observable<any[]> {
    return this.pageHeroSubject.asObservable();
  }

  getLocationsForBusiness(businessId: string): Observable<any[]> {
    return this.businessService.getLocations(businessId);
  }
}
