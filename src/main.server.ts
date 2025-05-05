import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

console.log('🟢 [mainserver..ts] Browser bootstrap starting...');
console.time('🔥 Angular bootstrap time');

const bootstrap = () => {
  return bootstrapApplication(AppComponent, appConfig)
    .then((appRef) => {
      console.log('✅ [main.server.ts] Angular app bootstrapped successfully.');
      return appRef; // ✅ return the ApplicationRef as required
    })
    .catch((err) => {
      console.error('❌ [main.server.ts] Angular bootstrap failed:', err);
      throw err; // also rethrow to let Angular handle the failure
    });
};

export default bootstrap;
