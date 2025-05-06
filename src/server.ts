import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import express, { Request, Response, NextFunction } from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';
import { SSR_BUSINESS_ID } from './app/tokens/server-request.token';
import { appConfig } from './app/app.config';
import { ApplicationConfig } from '@angular/core';
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.get(
  '**',
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: 'index.html'
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('**', (req: Request, res: Response, next: NextFunction) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  const functionTarget = (process.env['FUNCTION_TARGET'] || '').toLowerCase();
  console.log('🏢 Server-side FUNCTION_TARGET:', functionTarget);

  const functionToBusinessIdMap: { [key: string]: string } = {
    "ssrhelpinghandafhcomtest": "vfCMoPjAu2ROVBbKvk0D",
    "ssrhelpinghandafhcomprod": "vfCMoPjAu2ROVBbKvk0D",

    "ssraefamilyhomecomtest": "UiSDf9elSjwcbQs2HZb1",
    "ssraefamilyhomecomprod": "UiSDf9elSjwcbQs2HZb1",

    "ssrelderlyhomecareafhcomtest": "SJgFxBYkopnPR4WibCAf",
    "ssrelderlyhomecareafhcomprod": "SJgFxBYkopnPR4WibCAf",

    "ssrprestigecareafhcomtest": "pDJgpl34XUnRblyIlBA7",
    "ssrprestigecareafhcomprod": "pDJgpl34XUnRblyIlBA7",

    "ssrcountrycrestafhcomtest": "yrNc50SvfPqwTSkvvygA",
    "ssrcountrycrestafhcomprod": "yrNc50SvfPqwTSkvvygA",

    "ssrsbmediahubcomtest": "MGou3rzTVIbP77OLmZa7",
    "ssrsbmediahubcomprod": "MGou3rzTVIbP77OLmZa7",
    "ssrserenityparkcomtest": "It4V1NeoAXQhXLJyQsf9",
    "ssrserenityparkcomprod": "It4V1NeoAXQhXLJyQsf9",
  };
  const matchedKey = Object.keys(functionToBusinessIdMap).find(key => key.startsWith(functionTarget));
  const businessId = matchedKey ? functionToBusinessIdMap[matchedKey] : 'MGou3rzTVIbP77OLmZa7';

  commonEngine
    .render({
      bootstrap, documentFilePath: indexHtml, url: `${protocol}://${headers.host}${originalUrl}`, publicPath: browserDistFolder, providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }, { provide: SSR_BUSINESS_ID, useValue: businessId }]
    })
    .then((html) => res.send(html))
    .catch((err) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export default app;
