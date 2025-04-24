import { ApplicationConfig, provideZoneChangeDetection, inject } from '@angular/core';
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
import { SSR_BUSINESS_ID } from './tokens/server-request.token';
import { Business } from './model/business-questions.model';
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
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: () => {
        const meta = inject(MetaService);
        const businessData = inject(BusinessDataService);
        const businessId = inject(SSR_BUSINESS_ID);

        return () => {
          console.log('🟡 APP_INITIALIZER starting');

          const loadPromise = firstValueFrom(businessData.loadBusinessData(businessId)).then(data => {
            if (data) {
              console.log('✅ APP_INITIALIZER: business data loaded');
              meta.setMetaTagsFromBusiness(data);
            } else {
              console.warn('⚠️ APP_INITIALIZER: No business data returned');
            }
          }).catch(err => {
            console.error('❌ APP_INITIALIZER error', err);
          });

          const timeoutPromise = new Promise(resolve => {
            setTimeout(() => {
              console.warn('⏰ APP_INITIALIZER fallback timeout after 5s');
              resolve(true);
            }, 5000);
          });

          return Promise.race([loadPromise, timeoutPromise])
            .then(() => {
              console.log('✅ APP_INITIALIZER complete');
              return true;
            });
        };
      }
    }

  ]
};

