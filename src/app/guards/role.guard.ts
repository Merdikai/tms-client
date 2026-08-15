import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (expectedRole: string): CanActivateFn => {
  return async () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (!auth.isAuthenticated()) {
      await auth.checkSession();
    }

    if (auth.isAuthenticated() && auth.hasRole(expectedRole)) {
      return true;
    }

    if (!auth.isAuthenticated()) {
      return router.createUrlTree(['/login']);
    }

    // If authenticated but unauthorized for this specific role, redirect to appropriate home
    if (auth.hasRole('Instructor')) {
      return router.createUrlTree(['/dashboard']);
    } else if (auth.hasRole('Student')) {
      return router.createUrlTree(['/student']);
    }

    return router.createUrlTree(['/courses']);
  };
};
