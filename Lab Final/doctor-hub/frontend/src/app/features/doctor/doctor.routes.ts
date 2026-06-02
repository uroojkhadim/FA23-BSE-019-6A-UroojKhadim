import { Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';

export const DOCTOR_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./doctor-shell.component').then((m) => m.DoctorShellComponent),
    canActivate: [roleGuard(['doctor'])],
    children: [
      { path: '', loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DoctorDashboardComponent) },
      { path: 'clinics', loadComponent: () => import('./clinics/clinics.component').then((m) => m.DoctorClinicsComponent) },
      { path: 'appointments', loadComponent: () => import('./appointments/appointments.component').then((m) => m.DoctorAppointmentsComponent) },
      { path: 'prescriptions', loadComponent: () => import('./prescriptions/prescriptions.component').then((m) => m.DoctorPrescriptionsComponent) },
      { path: 'records', loadComponent: () => import('./records/records.component').then((m) => m.DoctorRecordsComponent) },
      { path: 'messages', loadComponent: () => import('../shared/messages/messages.component').then((m) => m.MessagesComponent) },
      { path: 'profile', loadComponent: () => import('./profile/profile.component').then((m) => m.DoctorProfileComponent) },
    ],
  },
];
