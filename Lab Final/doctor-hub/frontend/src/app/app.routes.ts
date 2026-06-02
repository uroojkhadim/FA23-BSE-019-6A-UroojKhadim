import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/public/landing/landing.component').then((m) => m.LandingComponent) },
  { path: 'home', redirectTo: '', pathMatch: 'full' },
  { path: 'doctors', loadComponent: () => import('./features/public/doctor-search/doctor-search.component').then((m) => m.DoctorSearchComponent) },
  { path: 'about', loadComponent: () => import('./features/public/about/about.component').then((m) => m.AboutComponent) },
  { path: 'contact', loadComponent: () => import('./features/public/contact/contact.component').then((m) => m.ContactComponent) },
  { path: 'login', canActivate: [guestGuard], loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent) },
  { path: 'register', canActivate: [guestGuard], loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent) },
  { path: 'forgot-password', loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent) },
  { path: 'reset-password', loadComponent: () => import('./features/auth/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent) },
  { path: 'patient', canActivate: [authGuard], loadChildren: () => import('./features/patient/patient.routes').then((m) => m.PATIENT_ROUTES) },
  { path: 'doctor', canActivate: [authGuard], loadChildren: () => import('./features/doctor/doctor.routes').then((m) => m.DOCTOR_ROUTES) },
  { path: 'assistant', canActivate: [authGuard], loadChildren: () => import('./features/assistant/assistant.routes').then((m) => m.ASSISTANT_ROUTES) },
  { path: 'admin', canActivate: [authGuard], loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES) },
  { path: 'super-admin', canActivate: [authGuard], loadChildren: () => import('./features/super-admin/super-admin.routes').then((m) => m.SUPER_ADMIN_ROUTES) },
  { path: '**', redirectTo: '' },
];
