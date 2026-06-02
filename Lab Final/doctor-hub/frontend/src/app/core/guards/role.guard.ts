import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../models/user.model';

export const roleGuard = (roles: UserRole[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const user = auth.user();
  if (user && roles.includes(user.role)) return true;
  router.navigate([auth.isLoggedIn() ? auth.dashboardRoute() : '/login']);
  return false;
};
