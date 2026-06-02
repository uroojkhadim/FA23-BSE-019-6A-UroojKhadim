import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./patient-shell.component').then((m) => m.PatientShellComponent),
    canActivate: [roleGuard(['patient'])],
    children: [
      { path: '', loadComponent: () => import('./overview/overview.component').then((m) => m.PatientOverviewComponent) },
      { path: 'doctors', loadComponent: () => import('../public/doctor-search/doctor-search.component').then((m) => m.DoctorSearchComponent) },
      { path: 'appointments', loadComponent: () => import('./appointments/appointments.component').then((m) => m.PatientAppointmentsComponent) },
      { path: 'payments', loadComponent: () => import('./payments/payments.component').then((m) => m.PatientPaymentsComponent) },
      { path: 'history', loadComponent: () => import('./history/history.component').then((m) => m.PatientHistoryComponent) },
      { path: 'reports', loadComponent: () => import('./reports/reports.component').then((m) => m.PatientReportsComponent) },
      { path: 'prescriptions', loadComponent: () => import('./prescriptions/prescriptions.component').then((m) => m.PatientPrescriptionsComponent) },
      { path: 'messages', loadComponent: () => import('../shared/messages/messages.component').then((m) => m.MessagesComponent) },
      { path: 'profile', loadComponent: () => import('./profile/profile.component').then((m) => m.PatientProfileComponent) },
    ],
  },
];
