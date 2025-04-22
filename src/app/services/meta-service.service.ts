import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { BusinessDataService } from './business-data.service';
import { Business } from '../model/business-questions.model';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(
    private meta: Meta,
    private title: Title,
    private businessDataService: BusinessDataService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  updateMetaTags(metaData: {
    title: string;
    description: string;
    keywords?: string;
    image?: string;
    url?: string;
  }) {
    this.title.setTitle(metaData.title);
    this.meta.updateTag({ name: 'description', content: metaData.description });
    if (metaData.keywords) {
      this.meta.updateTag({ name: 'keywords', content: metaData.keywords });
    }

    this.meta.updateTag({ property: 'og:title', content: metaData.title });
    this.meta.updateTag({ property: 'og:description', content: metaData.description });

    if (metaData.image) {
      this.meta.updateTag({ property: 'og:image', content: metaData.image });
    }

    if (metaData.url) {
      this.meta.updateTag({ property: 'og:url', content: metaData.url });
    }
  }

  updateFavicon(faviconUrl: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    const head = document.getElementsByTagName('head')[0];
    let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");

    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      head.appendChild(link);
    }

    link.href = faviconUrl;
  }

  loadAndApplyMeta(businessId?: string): void {
    if (businessId) {
      // Explicit load (used in detail pages or dynamic components)
      this.businessDataService.loadBusinessData(businessId).subscribe((business) => {
        if (business) {
          this.applyTags(business);
        }
      });
    } else {
      // Default: use already-loaded data (SSR-safe)
      this.businessDataService.getBusinessData().subscribe((business) => {
        if (business) {
          this.applyTags(business);
        }
      });
    }
  }

  private applyTags(business: Business): void {
    const metaData = {
      title: business.metaTitle || business.businessName || 'Default Title',
      description: business.metaDescription || 'Default Description',
      keywords: business.metaKeywords || 'default, keywords',
      image: business.metaImage || '/assets/default-og.jpg',
      url: business.businessURL || '',
    };

    this.updateMetaTags(metaData);

    if (isPlatformBrowser(this.platformId) && business.faviconUrl) {
      this.updateFavicon(business.faviconUrl);
    }
  }


}
