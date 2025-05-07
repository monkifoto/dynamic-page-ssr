import { Injectable, Inject, PLATFORM_ID, EnvironmentInjector, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TransferState, makeStateKey } from '@angular/core';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Theme } from '../model/business-questions.model';
import { environment } from '../../environments/environment';
import { RendererFactory2, Renderer2 } from '@angular/core';
import { getFirestore, doc, getDoc, setDoc, DocumentReference } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { runInInjectionContext } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private firestore = getFirestore(initializeApp(environment.firebase));
  private isBrowser: boolean;
  private renderer: Renderer2;
  private themeAppliedOnce = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private transferState: TransferState,
    private environmentInjector: EnvironmentInjector,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const existing = document.getElementById('theme-link');
      if (!existing) {
        const link = document.createElement('link');
        link.id = 'theme-link';
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
    }
  }

  public defaultTheme: Theme = {
    themeFileName: 'styles.css',
    primaryColor: '#fffaf2',
    secondaryColor: '#f8f3f0',
    accentColor: '#F0C987',
    backgroundColor: '#F5F3E7',
    darkBackgroundColor: '#4C6A56',
    textColor: '#2F2F2F',
    navBackgroundColor: '#F5F3E7',
    navTextColor: '#33372C',
    navActiveBackground: '#33372C',
    navActiveText: '#ffffff',
    buttonColor: '#D9A064',
    buttonHoverColor: '#c9605b',
    themeType: 'demo'
  };

  get getDefaultTheme(): Theme {
    return this.defaultTheme;
  }

  getBusinessTheme(businessId: string): Observable<Theme> {
    return from(runInInjectionContext(this.environmentInjector, async () => {
      const themeRef = doc(this.firestore, `businesses/${businessId}/theme/themeDoc`) as DocumentReference<Theme>;
      const snapshot = await getDoc(themeRef);
      const data = snapshot.exists() ? snapshot.data() : this.defaultTheme;
      return {
        ...data,
        themeType: data.themeType || 'demo',
      } as Theme;
    }));
  }

  getThemeColors(businessId: string): Observable<any> {
    const STATE_KEY = makeStateKey<any>(`theme-${businessId}`);

    if (this.transferState.hasKey(STATE_KEY) && this.isBrowser) {
      const cached = this.transferState.get(STATE_KEY, null as any);
      this.transferState.remove(STATE_KEY);
      console.log('♻️ Using cached theme from TransferState:', cached);
      return of(cached);
    }

    return from(runInInjectionContext(this.environmentInjector, async () => {
      const businessRef = doc(this.firestore, `businesses/${businessId}`);
      const businessSnap = await getDoc(businessRef);

      if (!businessSnap.exists()) {
        console.error('Theme Service - Business document does not exist for ID:', businessId);
        throw new Error('Business document does not exist');
      }

      const themeRef = doc(this.firestore, `businesses/${businessId}/theme/themeDoc`);
      const themeSnap = await getDoc(themeRef);

      const themeData = themeSnap.exists() ? themeSnap.data() : this.defaultTheme;

      if (!this.isBrowser) {
        this.transferState.set(STATE_KEY, themeData);
        console.log('📝 Writing theme to TransferState (SSR)');
      }

      if (!themeSnap.exists()) {
        await setDoc(themeRef, this.defaultTheme);
        this.applyThemeFile(this.defaultTheme.themeFileName ?? 'styles.css');
        return this.defaultTheme;
      }

      return themeData;
    })).pipe(
      catchError((error) => {
        console.error('Error fetching theme:', error);
        this.applyThemeFile(this.defaultTheme.themeFileName ?? 'styles.css');
        return of(this.defaultTheme);
      })
    );
  }

  updateColors(businessId: string, colors: any): Promise<void> {
    return runInInjectionContext(this.environmentInjector, async () => {
      const themeRef = doc(this.firestore, `businesses/${businessId}/theme/themeDoc`);
      await setDoc(themeRef, colors, { merge: true });

      if (colors.themeFileName) {
        this.applyThemeFile(colors.themeFileName);
      }
    });
  }

  resetToDefaultColors(): Observable<any> {
    return from(runInInjectionContext(this.environmentInjector, async () => {
      const defaultRef = doc(this.firestore, 'defaultSettings/colors');
      const snapshot = await getDoc(defaultRef);
      return snapshot.exists() ? snapshot.data() : this.defaultTheme;
    }));
  }

  applyThemeFile(themeFileName: string): Promise<void> {
    if (!this.isBrowser) return Promise.resolve();

    const existing = document.querySelector(`link[href="/assets/themes/${themeFileName}"]`);
    if (existing) {
      console.log(`🎯 Theme already present: ${themeFileName}`);
      return Promise.resolve();
    }

    return this.loadCss(`assets/themes/${themeFileName}`);
  }

  applyTheme(themeColors: any): void {
    if (!this.isBrowser) return;

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

    console.log('✅ Theme colors applied to :root');
  }

  hasValidColors(themeColors: any): boolean {
    const keys = [
      'primaryColor', 'secondaryColor', 'accentColor', 'backgroundColor',
      'darkBackgroundColor', 'textColor', 'navBackgroundColor',
      'navTextColor', 'navActiveBackground', 'navActiveText',
      'buttonColor', 'buttonHoverColor',
    ];
    return keys.every((key) => !!themeColors?.[key]);
  }

  private loadCss(url: string): Promise<void> {
    if (!this.isBrowser) return Promise.resolve();

    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;

      link.onload = () => {
        console.log(`Loaded theme: ${url}`);
        resolve();
      };
      link.onerror = (error) => {
        console.error(`Failed to load theme: ${url}`, error);
        reject(error);
      };

      document.head.appendChild(link);
    });
  }

  loadTheme(businessId: string): Promise<void> {
    if (this.themeAppliedOnce) return Promise.resolve();
    this.themeAppliedOnce = true;

    return new Promise((resolve) => {
      this.getThemeColors(businessId).subscribe({
        next: (theme) => {
          if (this.isBrowser && theme?.themeFileName) {
            this.applyThemeFile(theme.themeFileName);
          }
          if (this.hasValidColors(theme)) {
            this.applyTheme(theme);
          }
          resolve();
        },
        error: (err) => {
          console.error('ThemeService.loadTheme error:', err);
          if (this.isBrowser) {
            this.applyThemeFile(this.defaultTheme.themeFileName || 'styles.css');
          }
          resolve();
        }
      });
    });
  }
}
