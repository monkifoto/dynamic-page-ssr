import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeInitializerService } from './theme-initializer.service';
import { BusinessDataService } from './business-data.service';
import { MetaService } from './meta-service.service';
import { SERVER_REQUEST } from '../tokens/server-request.token';
import { Request } from 'express'; // Adjust based on your server setup
import { firstValueFrom } from 'rxjs';

const businessIdMap: { [key: string]: string } = {
  "helpinghandafh.com": "vfCMoPjAu2ROVBbKvk0D",
  "www.helpinghandafh.com": "vfCMoPjAu2ROVBbKvk0D",

  "aefamilyhome.com": "UiSDf9elSjwcbQs2HZb1",
  "www.aefamilyhome.com": "UiSDf9elSjwcbQs2HZb1",

  'elderlyhomecareafh.com':'SJgFxBYkopnPR4WibCAf',
  'www.elderlyhomecareafh.com':'SJgFxBYkopnPR4WibCAf',

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

  'test.helpinghandafh.com': 'vfCMoPjAu2ROVBbKvk0D',
  'test.aefamilyhome.com': 'UiSDf9elSjwcbQs2HZb1',
  'test.countrycrestafh.com': 'yrNc50SvfPqwTSkvvygA',
  'test.prestigecareafh.com': 'pDJgpl34XUnRblyIlBA7',
};

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {

  constructor(   private themeService: ThemeInitializerService,
    private businessDataService: BusinessDataService,
    private metaService: MetaService,
    private platformId: Object) { }


    async initializeApp(){
      const req = inject(SERVER_REQUEST, { optional: true }) as Request | undefined;
      const themeService = inject(ThemeInitializerService);
      const businessDataService = inject(BusinessDataService);
      const metaService = inject(MetaService);
      const platformId = inject(PLATFORM_ID);

      let hostname = '';
      let businessId = '';

      if (req) {
        const idRaw = req.query['id'];
        const idParam = Array.isArray(idRaw) ? idRaw[0] : idRaw;
        hostname = req.hostname;
        // Don't fallback to MGou3rz... — SSR_BUSINESS_ID will already be injected
        businessId = (req as any).businessId || businessIdMap[hostname] || idParam || 'MGou3rzTVIbP77OLmZa7';
      } else if (isPlatformBrowser(platformId)) {
        const url = new URL(window.location.href);
        hostname = window.location.hostname;
        businessId = businessIdMap[hostname] || url.searchParams.get('id') || 'MGou3rzTVIbP77OLmZa7';
      } else {
        // Fallback in unknown environments (not recommended)
        hostname = '';
        businessId = 'MGou3rzTVIbP77OLmZa7';
      }

      return async () => {
        console.log('✅ Initializing app...');

        // ✅ Always load theme (safe in SSR + browser)
        try {
          await themeService.loadTheme(businessId);
        } catch (err) {
          console.error('❌ Theme error:', err);
        }

        // ⚠️ Only load business data and meta on browser
        if (isPlatformBrowser(platformId)) {
          try {
            const business = await firstValueFrom(businessDataService.loadBusinessData(businessId));
            if (business) {
              console.log('✅ Meta: Setting tags for', business.businessName);
              metaService.updateMetaTags({
                title: business.metaTitle || business.businessName || 'Default Title',
                description: business.metaDescription || 'Caring and comfort.',
                keywords: business.metaKeywords || 'adult care, family home, Renton, Kent',
                image: business.metaImage || '/assets/default-og.jpg',
                url: business.businessURL || `https://${hostname}`
              });

              if (business.faviconUrl) {
                metaService.updateFavicon(business.faviconUrl);
              }
            }
          } catch (err) {
            console.error('❌ Business data error:', err);
          }
        } else {
          console.log('⛔ Skipped businessData/meta load on SSR (SSR_BUSINESS_ID used)');
        }
      };
    }

}
