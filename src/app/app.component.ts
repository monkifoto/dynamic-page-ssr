import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './component/UI/footer/footer.component';
import { NavigationComponent } from "./component/navigation/navigation.component";
// import { ThemeInitializerService } from './services/theme-initializer.service';
import { isPlatformBrowser } from '@angular/common';
import { SSR_BUSINESS_ID } from './tokens/server-request.token';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  title = 'dynamic-page-ssr';
  constructor(
    // private themeService: ThemeInitializerService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(SSR_BUSINESS_ID) private businessId: string | null
  ) {}
  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('🔍 TRANSFER_STATE in browser:', (window as any)['TRANSFER_STATE']);
    }
  }
}
