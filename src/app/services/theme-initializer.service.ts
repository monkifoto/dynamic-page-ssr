import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from './theme-service.service';
import { BusinessService } from './business.service';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeInitializerService {


  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private themeService: ThemeService,
    private businessService: BusinessService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private getFirestoreInstance() {
    if (!getApps().length) {
      initializeApp(environment.firebase);
    }
    return getFirestore();
  }

  async loadTheme(businessID: string): Promise<void> {
    if (!this.isBrowser) {
      console.log('⛔ Skipping theme load on server');
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 0)); // ⚡️ Yield to next browser tick

    try {
      const firestore = this.getFirestoreInstance();
      const themeRef = doc(firestore, `businesses/${businessID}/theme/themeDoc`);
      const themeSnap = await getDoc(themeRef);

      const themeData = themeSnap.exists() ? themeSnap.data() : null;
      const themeFileName = themeData?.['themeFileName'] || 'default.css';

      await this.themeService.applyThemeFile(themeFileName);

      try {
        const themeColors = await firstValueFrom(this.themeService.getThemeColors(businessID));
        console.log('🎨 Theme file to load:', themeFileName);
        console.log('🎯 Raw theme data:', themeData);
        console.log('📦 Theme colors from Firestore:', themeColors);
        this.applyTheme(themeColors);
      } catch (err) {
        console.error('Error loading theme colors:', err);
      }
    } catch (error) {
      console.error('Error loading business theme:', error);
      await this.themeService.applyThemeFile('default.css');
    }
  }


  get defaultTheme() {
    return this.themeService.getDefaultTheme;
  }

  applyThemeFile(fileName: string): Promise<void> {
    return this.themeService.applyThemeFile(fileName);
  }

  getThemeColors(businessId: string) {
    return this.themeService.getThemeColors(businessId); // returns Observable
  }

  applyTheme(themeColors: any): void {
    this.themeService.applyTheme(themeColors);
  }

  hasValidColors(themeColors: any): boolean {
    return this.themeService.hasValidColors(themeColors);
  }
}
