import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { config } from './app/app.config.server';
import { SSR_BUSINESS_ID } from './app/tokens/server-request.token';

const bootstrap = (request?: Request) => {
  // 🧠 Extract hostname from request URL
  const url = new URL(request?.url || 'http://localhost');
  const hostname = url.hostname;

  // 🗺️ Map hostnames to business IDs
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

  const businessId = businessIdMap[hostname] || 'MGou3rzTVIbP77OLmZa7';

  return bootstrapApplication(AppComponent, {
    ...config,
    providers: [
      ...config.providers,
      { provide: SSR_BUSINESS_ID, useValue: businessId }
    ]
  });
};

export default bootstrap;
