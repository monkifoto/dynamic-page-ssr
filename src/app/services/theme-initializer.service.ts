import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeService } from './theme-service.service';
import { BusinessService } from './business.service';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class ThemeInitializerService {
  private firestore = getFirestore(
    getApps().length ? getApps()[0] : initializeApp(environment.firebase)
  );

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    private themeService: ThemeService,
    private businessService: BusinessService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  async loadTheme(businessID: string): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      console.log('⛔ Skipping theme load on server');
      return;
    }
    try {
      const themeRef = doc(this.firestore, `businesses/${businessID}/theme/themeDoc`);
      const themeSnap = await getDoc(themeRef);

      const themeData = themeSnap.exists() ? themeSnap.data() : null;
      const themeFileName = themeData?.['themeFileName'] || 'default.css';

      await this.themeService.applyThemeFile(themeFileName);

      if (this.isBrowser) {
        this.themeService.getThemeColors(businessID).subscribe({
          next: (themeColors) => this.applyTheme(themeColors),
          error: (err) => console.error('Error loading theme colors:', err),
        });
      }
    } catch (error) {
      console.error('Error loading business theme:', error);
      await this.themeService.applyThemeFile('default.css');
    }
  }

  applyTheme(themeColors: any): void {
    if (!this.isBrowser || !this.hasValidColors(themeColors)) {
      console.warn('Skipping theme application. Invalid data or not in browser.');
      return;
    }

    const root = document.documentElement;
    root.style.setProperty('--primary-color', themeColors.primaryColor);
    root.style.setProperty('--secondary-color', themeColors.secondaryColor);
    root.style.setProperty('--accent-color', themeColors.accentColor);
    root.style.setProperty('--background-color', themeColors.backgroundColor);
    root.style.setProperty('--dark-background-color', themeColors.darkBackgroundColor);
    root.style.setProperty('--text-color', themeColors.textColor);
    root.style.setProperty('--nav-background-color', themeColors.navBackgroundColor);
    root.style.setProperty('--nav-text-color', themeColors.navTextColor);
    root.style.setProperty('--nav-active-background', themeColors.navActiveBackground);
    root.style.setProperty('--nav-active-text', themeColors.navActiveText);
    root.style.setProperty('--button-color', themeColors.buttonColor);
    root.style.setProperty('--button-hover-color', themeColors.buttonHoverColor);
  }

  private hasValidColors(themeColors: any): boolean {
    const keys = [
      'primaryColor',
      'secondaryColor',
      'accentColor',
      'backgroundColor',
      'darkBackgroundColor',
      'textColor',
      'navBackgroundColor',
      'navTextColor',
      'navActiveBackground',
      'navActiveText',
      'buttonColor',
      'buttonHoverColor',
    ];
    return keys.every((key) => themeColors?.[key]);
  }
}
