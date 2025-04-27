import { ApplicationConfig, provideZoneChangeDetection, inject, PLATFORM_ID } from '@angular/core';
import { APP_INITIALIZER  } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppInitializerService } from './services/app-initializer.service';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MetaService } from './services/meta-service.service';
import { BusinessDataService } from './services/business-data.service';
import { SERVER_REQUEST, SSR_BUSINESS_ID } from './tokens/server-request.token';
import { Business } from './model/business-questions.model';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
// import { ThemeInitializerService } from './services/theme-initializer.service';
import type { Request as ExpressRequest } from 'express';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),
    provideAnimations(),
    provideClientHydration(withEventReplay()),

    // ✅ Fix: Provide SSR_BUSINESS_ID fallback for browser builds
    {
      provide: SSR_BUSINESS_ID,
      useValue: null // or 'MGou3rzTVIbP77OLmZa7' for local testing
    },

    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const platformId = inject(PLATFORM_ID);
        const meta = inject(MetaService);
        const businessData = inject(BusinessDataService);
        // const themeService = inject(ThemeInitializerService);
        const businessIdToken = inject(SSR_BUSINESS_ID, { optional: true });

        let hostname = '';
        let businessId = '';

        if (!isPlatformBrowser(platformId)) {
          // 🧠 Server context
          const req = inject(SERVER_REQUEST, { optional: true }) as ExpressRequest | undefined;

          const idRaw = req?.query?.['id'];
          const idParam = Array.isArray(idRaw) ? idRaw[0] : idRaw;
          hostname = req?.hostname || '';
          businessId = (req as any)?.businessId || idParam || 'MGou3rzTVIbP77OLmZa7';
        } else {
          // 🌐 Browser context
          const url = new URL(window.location.href);
          hostname = window.location.hostname;
          businessId = businessIdToken || url.searchParams.get('id') || 'MGou3rzTVIbP77OLmZa7';
        }

        return async () => {
          try {
            const business = await firstValueFrom(businessData.loadBusinessData(businessId));

            if (business) {
              meta.updateMetaTags({
                title: business.metaTitle?.trim() || business.businessName || 'Default Title',
                description: business.metaDescription?.trim() || 'Adult Family Home providing quality care.',
                keywords: business.metaKeywords || 'adult care, Renton, Kent, Washington',
                image: business.metaImage || '/assets/default-og.jpg',
                url: `https://${hostname}`
              });

              if (isPlatformBrowser(platformId) && business.faviconUrl) {
                meta.updateFavicon(business.faviconUrl);
              }
            }
          } catch (err) {
            console.error('❌ Error in APP_INITIALIZER:', err);
          }
        };
      }


    }
  ]
};
