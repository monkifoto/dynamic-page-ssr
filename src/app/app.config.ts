import { ApplicationConfig, inject } from '@angular/core';
import { APP_INITIALIZER, PLATFORM_ID } from '@angular/core';
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, getDoc, doc } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { environment } from '../environments/environment';

import { routes } from './app.routes';
import { MetaService } from './services/meta-service.service';
import { BusinessDataService } from './services/business-data.service';
import { ThemeService } from './services/theme-service.service';
import { SSR_BUSINESS_ID, SERVER_REQUEST } from './tokens/server-request.token';

import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { firstValueFrom } from 'rxjs';

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

    {
      provide: SSR_BUSINESS_ID,
      useValue: null,
    },

    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const platformId = inject(PLATFORM_ID);
        const meta = inject(MetaService);
        const businessData = inject(BusinessDataService);
        const themeService = inject(ThemeService);
        const businessIdToken = inject(SSR_BUSINESS_ID, { optional: true });
        const request = inject(SERVER_REQUEST, { optional: true });

        let businessId = businessIdToken ?? '';

        if (!isPlatformBrowser(platformId)) {
          const functionTarget = (process.env['FUNCTION_TARGET'] || '').toLowerCase();
          console.log('🏢 Server-side FUNCTION_TARGET:', functionTarget);

          const functionToBusinessIdMap: { [key: string]: string } = {
            "ssrhelpinghandafhcomtest": "vfCMoPjAu2ROVBbKvk0D",
            "ssrhelpinghandafhcomprod": "vfCMoPjAu2ROVBbKvk0D",

            "ssraefamilyhomecomtest": "UiSDf9elSjwcbQs2HZb1",
            "ssraefamilyhomecomprod": "UiSDf9elSjwcbQs2HZb1",

            "ssrelderlyhomecareafhcomtest": "SJgFxBYkopnPR4WibCAf",
            "ssrelderlyhomecareafhcomprod": "SJgFxBYkopnPR4WibCAf",

            "ssrprestigecareafhcomtest": "pDJgpl34XUnRblyIlBA7",
            "ssrprestigecareafhcomprod": "pDJgpl34XUnRblyIlBA7",

            "ssrcountrycrestafhcomtest": "yrNc50SvfPqwTSkvvygA",
            "ssrcountrycrestafhcomprod": "yrNc50SvfPqwTSkvvygA",

            "ssrsbmediahubcomtest": "MGou3rzTVIbP77OLmZa7",
            "ssrsbmediahubcomprod": "MGou3rzTVIbP77OLmZa7",

            "ssrserenityparkcomtest": "It4V1NeoAXQhXLJyQsf9",
            "ssrserenityparkcomprod": "It4V1NeoAXQhXLJyQsf9",
          };

          const matchedKey = Object.keys(functionToBusinessIdMap).find(key =>
            functionTarget.startsWith(key)
          );

          businessId = matchedKey ? functionToBusinessIdMap[matchedKey] : businessIdToken ?? 'MGou3rzTVIbP77OLmZa7';

          if (!matchedKey) {
            console.warn('⚠️ SSR: No matching FUNCTION_TARGET, using fallback:', businessId);
          }
        } else {
          const hostname = window.location.hostname;
          const hostnameToBusinessIdMap: { [key: string]: string } = {
            "www.serenitypark.com": "It4V1NeoAXQhXLJyQsf9",
            "test.serenitypark.com": "It4V1NeoAXQhXLJyQsf9",
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
            "serenitypark.com": "It4V1NeoAXQhXLJyQsf9",
          };
          businessId = hostnameToBusinessIdMap[hostname] ?? new URL(window.location.href).searchParams.get('id') ?? businessIdToken ?? 'MGou3rzTVIbP77OLmZa7';

          console.log('🌎 Browser context:', { hostname, businessId });
        }

        return async () => {
          try {
            console.log('🏢 APP_INITIALIZER: businessId:', businessId);

            const business = await firstValueFrom(businessData.loadBusinessData(businessId));
            console.log('✅ Loaded business data:', business?.businessName);

            const firestore = getFirestore();
            const themeRef = doc(firestore, `businesses/${businessId}/theme/themeDoc`);
            const themeSnap = await getDoc(themeRef);
            const theme = themeSnap.exists() ? themeSnap.data() : themeService.getDefaultTheme;
            const themeFile = theme?.themeFileName || 'styles.css';

            if (business) {
              meta.updateMetaTags({
                title: business.metaTitle?.trim() || business.businessName || 'Default Title',
                description: business.metaDescription?.trim() || 'Adult Family Home providing quality care.',
                keywords: business.metaKeywords || '',
                image: business.metaImage || '/assets/default-og.jpg',
                url: isPlatformBrowser(platformId) ? window.location.href : '',
              });

              if (isPlatformServer(platformId)) {
                console.log('🌐 SSR: injecting stylesheet for theme:', themeFile);
                meta.appendStyleLink(`/assets/themes/${themeFile}`);
              }

              await themeService.loadTheme(businessId);

              if (isPlatformBrowser(platformId) && business.faviconUrl) {
                meta.updateFavicon(business.faviconUrl);
              }

              await themeService.applyThemeFile(themeFile);

              const colors = await firstValueFrom(themeService.getThemeColors(businessId));
              if (themeService.hasValidColors(colors)) {
                themeService.applyTheme(colors);
              } else {
                console.warn('⚠️ Invalid theme colors:', colors);
              }
            }
          } catch (err) {
            console.error('❌ Error in APP_INITIALIZER:', err);
          }
        };
      },
    }
  ],
};
