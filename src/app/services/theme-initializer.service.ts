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
  constructor(
    private themeService: ThemeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  loadTheme(businessID: string): Promise<void> {
    return this.themeService.loadTheme(businessID);
  }

  // Convenience passthroughs (for admin or external use)
  get defaultTheme() {
    return this.themeService.getDefaultTheme;
  }

  applyThemeFile(fileName: string): Promise<void> {
    return this.themeService.applyThemeFile(fileName);
  }

  getThemeColors(businessId: string) {
    return this.themeService.getThemeColors(businessId);
  }

  applyTheme(themeColors: any): void {
    this.themeService.applyTheme(themeColors);
  }

  hasValidColors(themeColors: any): boolean {
    return this.themeService.hasValidColors(themeColors);
  }
}
