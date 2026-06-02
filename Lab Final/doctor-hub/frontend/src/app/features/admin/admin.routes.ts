import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-shell.component').then((m) => m.AdminShellComponent),
    canActivate: [roleGuard(['admin'])],
    children: [
      { path: '', loadComponent: () => import('./analytics/analytics.component').then((m) => m.AdminAnalyticsComponent) },
      { path: 'users', loadComponent: () => import('./users/users.component').then((m) => m.AdminUsersComponent) },
      { path: 'doctors', loadComponent: () => import('../public/doctor-search/doctor-search.component').then((m) => m.DoctorSearchComponent) },
      { path: 'activity', loadComponent: () => import('./activity/activity.component').then((m) => m.AdminActivityComponent) },
    ],
  },
];
