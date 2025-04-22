
import { getFirestore, doc, getDoc, setDoc, DocumentReference } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, take } from 'rxjs/operators';
import { Theme } from '../model/business-questions.model';
import { environment } from '../../environments/environment';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private firestore = getFirestore(initializeApp(environment.firebase));
  // private themeLink: HTMLLinkElement;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
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

  getBusinessTheme(businessId: string): Observable<Theme> {
    const themeRef = doc(this.firestore, `businesses/${businessId}/theme/themeDoc`) as DocumentReference<Theme>;
    return from(getDoc(themeRef)).pipe(
      map((snapshot) => {
        const data = snapshot.exists() ? snapshot.data() : this.defaultTheme;
        return {
          ...data,
          themeType: data.themeType || 'demo',
        } as Theme;
      })
    );
  }

  getThemeColors(businessId: string): Observable<any> {
    const businessRef = doc(this.firestore, `businesses/${businessId}`);
    const themeRef = doc(this.firestore, `businesses/${businessId}/theme/themeDoc`);

    return from(getDoc(businessRef)).pipe(
      take(1),
      switchMap(businessSnap => {
        if (!businessSnap.exists()) {
          console.error('Theme Service - GetTheme Colors - Business document does not exist! for Business ID:', businessId);
          return throwError(() => new Error('Theme Service - Business document does not exist'));
        }

        return from(getDoc(themeRef)).pipe(
          switchMap(themeSnap => {
            if (themeSnap.exists()) {
              return of(themeSnap.data());
            } else {
              return from(setDoc(themeRef, this.defaultTheme)).pipe(
                switchMap(() => {
                  this.applyThemeFile(this.defaultTheme.themeFileName ?? 'styles.css');
                  return of(this.defaultTheme);
                })
              );
            }
          })
        );
      }),
      catchError(error => {
        console.error('Error fetching theme:', error);
        this.applyThemeFile(this.defaultTheme.themeFileName ?? 'styles.css');

        return of(this.defaultTheme);
      })
    );
  }

  updateColors(businessId: string, colors: any): Promise<void> {
    const themeRef = doc(this.firestore, `businesses/${businessId}/theme/themeDoc`);
    return setDoc(themeRef, colors, { merge: true })
      .then(() => {
        if (colors.themeFileName) {
          this.applyThemeFile(colors.themeFileName);
        }
      })
      .catch(error => {
        console.error('Theme Service - Error updating colors:', error);
        throw new Error(error);
      });
  }

  resetToDefaultColors(): Observable<any> {
    const defaultRef = doc(this.firestore, 'defaultSettings/colors');
    return from(getDoc(defaultRef)).pipe(
      switchMap(snapshot => {
        if (snapshot.exists()) {
          return of(snapshot.data());
        } else {
          console.warn('No default colors found in Firestore.');
          return of(this.defaultTheme);
        }
      })
    );
  }

  applyThemeFile(themeFileName: string): Promise<void> {
    if (!this.isBrowser) return Promise.resolve(); // SSR-safe
    const themePath = `assets/themes/${themeFileName}`;
    return this.loadCss(themePath);
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
}
