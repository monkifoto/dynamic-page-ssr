import { InjectionToken } from '@angular/core';
import { Request } from 'express';

export const SERVER_REQUEST = new InjectionToken<Request>('SERVER_REQUEST');
export const SSR_BUSINESS_ID = new InjectionToken<string>('SSR_BUSINESS_ID');
