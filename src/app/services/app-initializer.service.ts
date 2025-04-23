import { Injectable, inject, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeInitializerService } from './theme-initializer.service';
import { BusinessDataService } from './business-data.service';
import { MetaService } from './meta-service.service';
import { SERVER_REQUEST } from '../tokens/server-request.token';
import { Request } from 'express'; // Adjust based on your server setup
import { firstValueFrom } from 'rxjs';

const businessIdMap: { [key: string]: string } = {
  // Your business ID mapping...
};

@Injectable({
  providedIn: 'root'
})
export class AppInitializerService {
  constructor(
    private themeService: ThemeInitializerService,
    private businessDataService: BusinessDataService,
    private metaService: MetaService,
    @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID here
  ) {}

  async initializeApp() {
    const req = inject(SERVER_REQUEST, { optional: true }) as Request | undefined;
    let hostname = '';
    let businessId = '';

    if (req) {
      const idRaw = req.query['id'];
      const idParam = Array.isArray(idRaw) ? idRaw[0] : idRaw;
      hostname = req.hostname;
      businessId = (req as any).businessId || businessIdMap[hostname] || idParam || 'MGou3rzTVIbP77OLmZa7';
    } else if (isPlatformBrowser(this.platformId)) {
      const url = new URL(window.location.href);
      hostname = window.location.hostname;
      businessId = businessIdMap[hostname] || url.searchParams.get('id') || 'MGou3rzTVIbP77OLmZa7';
    } else {
      hostname = '';
      businessId = 'MGou3rzTVIbP77OLmZa7';
    }

    console.log('✅ Initializing app...');

    try {
      await this.themeService.loadTheme(businessId);
    } catch (err) {
      console.error('❌ Theme error:', err);
    }

    if (isPlatformBrowser(this.platformId)) {
      try {
        const business = await firstValueFrom(this.businessDataService.loadBusinessData(businessId));
        if (business) {
          console.log('✅ Meta: Setting tags for', business.businessName);
          this.metaService.updateMetaTags({
            title: business.metaTitle || business.businessName || 'Default Title',
            description: business.metaDescription || 'Caring and comfort.',
            keywords: business.metaKeywords || 'adult care, family home, Renton, Kent',
            image: business.metaImage || '/assets/default-og.jpg',
            url: business.businessURL || `https://${hostname}`
          });

          if (business.faviconUrl) {
            this.metaService.updateFavicon(business.faviconUrl);
          }
        }
      } catch (err) {
        console.error('❌ Business data error:', err);
      }
    } else {
      console.log('⛔ Skipped businessData/meta load on SSR (SSR_BUSINESS_ID used)');
    }
  }
}
