import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const SUPER_ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./super-admin-shell.component').then((m) => m.SuperAdminShellComponent),
    canActivate: [roleGuard(['super_admin'])],
    children: [
      { path: '', loadComponent: () => import('./panel/panel.component').then((m) => m.SuperAdminPanelComponent) },
      { path: 'settings', loadComponent: () => import('./settings/settings.component').then((m) => m.SuperAdminSettingsComponent) },
      { path: 'users', loadComponent: () => import('../admin/users/users.component').then((m) => m.AdminUsersComponent) },
    ],
  },
];
