import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, Optional } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './component/UI/footer/footer.component';
import { NavigationComponent } from "./component/navigation/navigation.component";
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TransferState } from '@angular/core';
import { SSR_BUSINESS_ID } from './tokens/server-request.token';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, NavigationComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'dynamic-page-ssr';
  platformIdType: 'server' | 'browser';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(SSR_BUSINESS_ID) private businessId: string | null,
    private transferState: TransferState
  ) {
    this.platformIdType = isPlatformBrowser(platformId) ? 'browser' : 'server';
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const ts = (window as any)['TRANSFER_STATE'];
      console.log('🔍 TRANSFER_STATE in browser:', ts ?? '(none)');

      if (!ts) {
        console.warn('⚠️ No TRANSFER_STATE found — hydration mismatch may occur.');
      }

      if (this.businessId) {
        console.log('🌐 SSR_BUSINESS_ID in browser:', this.businessId);
      }
    }
  }

  ngOnDestroy(): void {
    // SSR cleanup hook, if needed in future
  }
}
