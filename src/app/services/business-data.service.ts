import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { BehaviorSubject, Observable, of, firstValueFrom } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { BusinessService } from './business.service';
import { BusinessPageHeroService } from './business-page-hero.service';
import { Business } from '../model/business-questions.model';
import { first } from 'rxjs/operators';
import { SSR_BUSINESS_ID } from '../tokens/server-request.token';
import { TransferState, makeStateKey } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { distinctUntilChanged } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class BusinessDataService {
  private businessDataSubject = new BehaviorSubject<Business | null>(null);
  private businessIdSubject = new BehaviorSubject<string | null>(null);
  private locationsSubject = new BehaviorSubject<any[]>([]);
  private pageHeroSubject = new BehaviorSubject<any[]>([]);

  public businessData$: Observable<Business | null> =
  this.businessDataSubject
    .asObservable()
    .pipe(
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    );

  constructor(
    private businessService: BusinessService,
    private businessPageHeroService: BusinessPageHeroService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(SSR_BUSINESS_ID) private ssrBusinessId: string,
    private transferState: TransferState
  ) {
    if (isPlatformServer(this.platformId) && this.ssrBusinessId) {
      console.log('✅ Using SSR businessId:', this.ssrBusinessId);
      this.businessIdSubject.next(this.ssrBusinessId);

      // ✅ Preload data on the server
      this.loadBusinessData(this.ssrBusinessId).pipe(first()).subscribe({
        next: (business) => {
          console.log('✅ Preloaded business data on server:', business?.businessName);
        },
        error: (err) => {
          console.error('❌ Error preloading business data on server:', err);
        }
      });
    }
  }

  loadBusinessData(businessId: string): Observable<Business | null> {
    console.log('BusinessDataService - loadBusinessData for ID:', businessId);

    const STATE_KEY = makeStateKey<Business>(`business-${businessId}`);

    // ✅ If cached in memory (already set by preload), return it
    if (this.businessDataSubject.value) {
      return this.businessDataSubject.asObservable();
    }

    // ✅ If TransferState exists (SSR → Browser), use it
    if (this.transferState.hasKey(STATE_KEY) && isPlatformBrowser(this.platformId)) {
      const cached = this.transferState.get<Business>(STATE_KEY, null as any);
      this.transferState.remove(STATE_KEY);
      this.businessDataSubject.next(cached);
      this.businessIdSubject.next(businessId);
      this.loadBusinessExtras(businessId);
      return of(cached);
    }

    // ✅ Fetch from Firestore and cache into TransferState (SSR only)
    return this.businessService.getBusinessData(businessId).pipe(
      map((business) => {
        if (!business) return null;

        if (!business.sections) {
          business.sections = [];
          console.warn('⚠️ No sections found in Firestore. Initializing empty array.');
        }

        return business;
      }),
      tap((business) => {
        this.businessDataSubject.next(business);
        this.businessIdSubject.next(businessId);

        if (business && isPlatformServer(this.platformId)) {
          this.transferState.set(STATE_KEY, business);
        }

        this.loadBusinessExtras(businessId);
      })
    );
  }


  // 🔁 Separated to avoid uncompleted subscriptions in SSR
  private async loadBusinessExtras(businessId: string) {
    try {
      const locations = await firstValueFrom(this.businessService.getLocations(businessId));
      this.locationsSubject.next(locations);
    } catch (err) {
      console.error('Error loading locations:', err);
    }

    try {
      const heroes = await firstValueFrom(this.businessPageHeroService.getPageHeroes(businessId));
      this.pageHeroSubject.next(heroes);
    } catch (err) {
      console.error('Error loading hero data:', err);
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
