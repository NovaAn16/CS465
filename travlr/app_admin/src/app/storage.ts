
import { InjectionToken } from '@angular/core';

// Provide access to browser local storage.
export const BROWSER_STORAGE = new InjectionToken<Storage>(
  'Browser Storage',
  {
    providedIn: 'root',
    factory: () => localStorage
  }
);
