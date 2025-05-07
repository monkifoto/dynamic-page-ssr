import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { SERVER_REQUEST } from './app/tokens/server-request.token';

bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    ...appConfig.providers,
    {
      provide: SERVER_REQUEST,
      useValue: null // ✅ Browser-safe fallback
    }
  ]
}).catch((err) => console.error(err));
