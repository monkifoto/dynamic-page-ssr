import { ApplicationConfig, provideZoneChangeDetection, inject, PLATFORM_ID } from '@angular/core';
import { APP_INITIALIZER } from '@angular/core';
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
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
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

    // Always provide a fallback for SSR_BUSINESS_ID
    {
      provide: SSR_BUSINESS_ID,
      useValue: null
    },

    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const platformId = inject(PLATFORM_ID);
        const meta = inject(MetaService);
        const businessData = inject(BusinessDataService);
        const businessIdToken = inject(SSR_BUSINESS_ID, { optional: true });

        let hostname = '';
        let businessId = '';

        if (!isPlatformBrowser(platformId)) {
          // 🧠 Server context
          const req = inject(SERVER_REQUEST, { optional: true }) as ExpressRequest | undefined;
          const hostnameFromFirebase = req?.hostname || '';

          const matched = hostnameFromFirebase.match(/---ssr(.*?)-/);
          const keyFromHostname = matched ? matched[1] : '';

          const businessIdMap: { [key: string]: string } = {
            "helpinghandafhcom": "vfCMoPjAu2ROVBbKvk0D",
            "aefamilyhomecom": "UiSDf9elSjwcbQs2HZb1",
            "elderlyhomecareafhcom": "SJgFxBYkopnPR4WibCAf",
            "prestigecareafhcom": "pDJgpl34XUnRblyIlBA7",
            "countrycrestafhcom": "yrNc50SvfPqwTSkvvygA",
            "sbmediahubcom": "MGou3rzTVIbP77OLmZa7"
          };


        businessId = businessIdMap[keyFromHostname] || 'MGou3rzTVIbP77OLmZa7';

        console.log('🏢 Server context:', { hostnameFromFirebase, keyFromHostname, businessId });
          // const businessIdFromHeader = req?.headers?.['x-business-id'] as string | undefined;
          // const idRaw = req?.query?.['id'];
          // const idParam = Array.isArray(idRaw) ? idRaw[0] : idRaw;

          // businessId = businessIdFromHeader || (idParam as string) || 'MGou3rzTVIbP77OLmZa7';
          // console.log('🏢 Server context:', { businessId });

        } else {
          // 🌐 Browser context
          const url = new URL(window.location.href);
          hostname = url.hostname || '';

          const businessIdMap: { [key: string]: string } = {
            "helpinghandafh.com": "vfCMoPjAu2ROVBbKvk0D",
            "www.helpinghandafh.com": "vfCMoPjAu2ROVBbKvk0D",
            "aefamilyhome.com": "UiSDf9elSjwcbQs2HZb1",
            "www.aefamilyhome.com": "UiSDf9elSjwcbQs2HZb1",
            "elderlyhomecareafh.com": "SJgFxBYkopnPR4WibCAf",
            "www.elderlyhomecareafh.com": "SJgFxBYkopnPR4WibCAf",
            "prestigecareafh.com": "pDJgpl34XUnRblyIlBA7",
            "www.prestigecareafh.com": "pDJgpl34XUnRblyIlBA7",
            "countrycrestafh.com": "yrNc50SvfPqwTSkvvygA",
            "www.countrycrestafh.com": "yrNc50SvfPqwTSkvvygA",
            "sbmediahub.com": "MGou3rzTVIbP77OLmZa7",
            "sp.sbmediahub.com": "KyQfU7hjez0uXRfAjqcu",
            "elderlyhc.sbmediahub.com": "SJgFxBYkopnPR4WibCAf",
            "prestige.sbmediahub.com": "pDJgpl34XUnRblyIlBA7",
            "cc.sbmediahub.com": "yrNc50SvfPqwTSkvvygA",
            "hh.sbmediahub.com": "vfCMoPjAu2ROVBbKvk0D",
            "ae.sbmediahub.com": "UiSDf9elSjwcbQs2HZb1",
            "www.sbmediahub.com": "MGou3rzTVIbP77OLmZa7",
            "test.helpinghandafh.com": "vfCMoPjAu2ROVBbKvk0D",
            "test.aefamilyhome.com": "UiSDf9elSjwcbQs2HZb1",
            "test.countrycrestafh.com": "yrNc50SvfPqwTSkvvygA",
            "test.prestigecareafh.com": "pDJgpl34XUnRblyIlBA7",
          };

          businessId = businessIdToken || businessIdMap[hostname] || url.searchParams.get('id') || 'MGou3rzTVIbP77OLmZa7';
          console.log('🌎 Browser context:', { hostname, businessId });
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
                url: hostname ? `https://${hostname}` : ''
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
