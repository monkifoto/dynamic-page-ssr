import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
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
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(DOCUMENT) private document: Document
  ) {}

  appendStyleLink(href: string) {
    const existing = this.document.head.querySelector(`link[href="${href}"]`);
    if (!existing) {
      const link = this.document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      this.document.head.appendChild(link);
      console.log(`✅ SSR-injected theme: ${href}`);
    }
  }


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

    // Google / Search Engine Tags
    this.meta.updateTag({ itemprop: 'name', content: metaData.title });
    this.meta.updateTag({ itemprop: 'description', content: metaData.description });
    if (metaData.image) {
      this.meta.updateTag({ itemprop: 'image', content: metaData.image });
    }

    // Open Graph / Facebook Meta Tags
    if (metaData.url) {
      this.meta.updateTag({ property: 'og:url', content: metaData.url });
    }
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: metaData.title });
    this.meta.updateTag({ property: 'og:description', content: metaData.description });
    if (metaData.image) {
      this.meta.updateTag({ property: 'og:image', content: metaData.image });
    }

    // Twitter Meta Tags
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: metaData.title });
    this.meta.updateTag({ name: 'twitter:description', content: metaData.description });
    if (metaData.image) {
      this.meta.updateTag({ name: 'twitter:image', content: metaData.image });
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
      this.businessDataService.loadBusinessData(businessId).subscribe((business) => {
        if (business) {
          this.setMetaTagsFromBusiness(business);
        }
      });
    } else {
      this.businessDataService.getBusinessData().subscribe((business) => {
        if (business) {
          this.setMetaTagsFromBusiness(business);
        }
      });
    }
  }

  setMetaTagsFromBusiness(business: Business): void {
    if (!business) return;

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
