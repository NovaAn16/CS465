
import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';

import { BROWSER_STORAGE } from '../storage';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {

  // Access the browser storage provider
  const storage = inject(BROWSER_STORAGE);

  // Only attach a JWT to protected Travlr API requests
  const isTravlrAPI =
    req.url.startsWith('http://localhost:3000/api/');

  const isProtectedMethod =
    req.method === 'POST' ||
    req.method === 'PUT' ||
    req.method === 'DELETE';

  const isAuthenticationRequest =
    req.url.endsWith('/login') ||
    req.url.endsWith('/register');

  if (
    isTravlrAPI &&
    isProtectedMethod &&
    !isAuthenticationRequest
  ) {
    const token = storage.getItem('travlr-token');

    if (token) {
      const authReq: HttpRequest<unknown> = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });

      return next(authReq);
    }
  }

  return next(req);
};
