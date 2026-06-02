import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const ASSISTANT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./assistant-shell.component').then((m) => m.AssistantShellComponent),
    canActivate: [roleGuard(['assistant'])],
    children: [
      { path: '', redirectTo: 'payments', pathMatch: 'full' },
      { path: 'payments', loadComponent: () => import('./payments/payments.component').then((m) => m.AssistantPaymentsComponent) },
      { path: 'queue', loadComponent: () => import('./queue/queue.component').then((m) => m.AssistantQueueComponent) },
    ],
  },
];
