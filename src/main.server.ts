import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideServerRendering } from '@angular/platform-server';
import { SERVER_REQUEST } from './app/tokens/server-request.token';

console.log('🟢 [main.server.ts] Server bootstrap starting...');


// ✅ Patch: Add default providers to handle optional server context (e.g. during prerender)
const bootstrap = () => {
  console.time('🔥 Angular bootstrap time');
  return bootstrapApplication(AppComponent, {
    ...appConfig,
    providers: [
      ...appConfig.providers,
      provideServerRendering(),
      // ✅ Prevent SSR failure during prerender by ensuring SERVER_REQUEST is always defined
      {
        provide: SERVER_REQUEST,
        useValue: null, // Safe fallback to prevent NullInjectorError
      },
    ],
  })
    .then((appRef) => {
      console.log('✅ [main.server.ts] Angular app bootstrapped successfully.');
      console.timeEnd('🔥 Angular bootstrap time');
      return appRef;
    })
    .catch((err) => {
      console.error('❌ [main.server.ts] Angular bootstrap failed:', err);
      throw err;
    });
};

export default bootstrap;
