import { ApplicationConfig, provideZoneChangeDetection, inject, PLATFORM_ID } from '@angular/core';
import { APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore, getDoc, doc } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { MetaService } from './services/meta-service.service';
import { BusinessDataService } from './services/business-data.service';
import { SERVER_REQUEST, SSR_BUSINESS_ID } from './tokens/server-request.token';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';
import { ThemeService } from './services/theme-service.service';

let initialized = false;

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

        let hostname = '';
        let businessId = '';

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

          // businessId = functionToBusinessIdMap[functionTarget] || 'MGou3rzTVIbP77OLmZa7';
          const matchedKey = Object.keys(functionToBusinessIdMap)
          .find(key => key.startsWith(functionTarget));
        businessId = matchedKey ? functionToBusinessIdMap[matchedKey] : 'MGou3rzTVIbP77OLmZa7';
        console.log('✅ SSR: Matched businessId from FUNCTION_TARGET:', { functionTarget, matchedKey, businessId });
        } else {
          const url = new URL(window.location.href);
          hostname = url.hostname || '';
          const hostnameToBusinessIdMap: { [key: string]: string } = {
            "helpinghandafh.com": "vfCMoPjAu2ROVBbKvk0D",
            "www.helpinghandafh.com": "vfCMoPjAu2ROVBbKvk0D",
            "test.helpinghandafh.com": "vfCMoPjAu2ROVBbKvk0D",

            "aefamilyhome.com": "UiSDf9elSjwcbQs2HZb1",
            "www.aefamilyhome.com": "UiSDf9elSjwcbQs2HZb1",
            "test.aefamilyhome.com": "UiSDf9elSjwcbQs2HZb1",

            "elderlyhomecareafh.com": "SJgFxBYkopnPR4WibCAf",
            "www.elderlyhomecareafh.com": "SJgFxBYkopnPR4WibCAf",
            "test.elderlyhomecareafh.com": "SJgFxBYkopnPR4WibCAf",

            "prestigecareafh.com": "pDJgpl34XUnRblyIlBA7",
            "www.prestigecareafh.com": "pDJgpl34XUnRblyIlBA7",
            "test.prestigecareafh.com": "pDJgpl34XUnRblyIlBA7",

            "countrycrestafh.com": "yrNc50SvfPqwTSkvvygA",
            "www.countrycrestafh.com": "yrNc50SvfPqwTSkvvygA",
            "test.countrycrestafh.com": "yrNc50SvfPqwTSkvvygA",

            "sbmediahub.com": "MGou3rzTVIbP77OLmZa7",
            "www.sbmediahub.com": "MGou3rzTVIbP77OLmZa7",
            "test.sbmediahub.com": "MGou3rzTVIbP77OLmZa7",

            "serenitypark.com": "It4V1NeoAXQhXLJyQsf9",
            "www.serenitypark.com": "It4V1NeoAXQhXLJyQsf9",
            "test.serenitypark.com": "It4V1NeoAXQhXLJyQsf9",
          };
          businessId = businessIdToken || hostnameToBusinessIdMap[hostname] || url.searchParams.get('id') || 'MGou3rzTVIbP77OLmZa7';
          console.log('🌎 Browser context:', { hostname, businessId });
        }

        return async () => {
          if (initialized) {
            console.log('⚠️ Skipping duplicate APP_INITIALIZER for', businessId);
            return;
          }
          initialized = true;
          // console.trace("app-initializer.service.ts", "initializeApp", businessId);

          try {
            const business = await firstValueFrom(businessData.loadBusinessData(businessId));
            console.log('✅ Loaded business data:', business?.businessName);

            const firestore = getFirestore();
            const themeRef = doc(firestore, `businesses/${businessId}/theme/themeDoc`);
            const themeSnap = await getDoc(themeRef);
            const theme = themeSnap.exists() ? themeSnap.data() : themeService.defaultTheme;
            const themeFile = theme?.themeFileName || 'styles.css';

            if (!isPlatformBrowser(platformId)) {
              console.log('🌐 SSR: injecting stylesheet for theme:', themeFile);
              meta.appendStyleLink(`/assets/themes/${themeFile}`);
            }

            if (business) {
              meta.updateMetaTags({
                title: business.metaTitle?.trim() || business.businessName || 'Default Title',
                description: business.metaDescription?.trim() || 'Adult Family Home providing quality care.',
                keywords: business.metaKeywords || 'adult care, Renton, Kent, Washington',
                image: business.metaImage || '/assets/default-og.jpg',
                url: hostname ? `https://${hostname}` : ''
              });

              await themeService.loadTheme(business.id || businessId);

              if (isPlatformBrowser(platformId) && business.faviconUrl) {
                meta.updateFavicon(business.faviconUrl);
              }

              await themeService.applyThemeFile(themeFile);
              const themeColors = await firstValueFrom(themeService.getThemeColors(businessId));
              if (themeService.hasValidColors(themeColors)) {
                themeService.applyTheme(themeColors);
              } else {
                console.warn('⚠️ Invalid theme colors:', themeColors);
              }
            }
          } catch (err) {
            console.error('❌ Error in APP_INITIALIZER:', err);
          }
        };
      },
    },
  ],
};
