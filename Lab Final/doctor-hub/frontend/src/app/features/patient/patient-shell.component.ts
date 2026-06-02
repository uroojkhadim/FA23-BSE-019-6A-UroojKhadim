import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardLayoutComponent, NavItem } from '../../shared/components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-patient-shell',
  standalone: true,
  imports: [RouterOutlet, DashboardLayoutComponent],
  template: `
    <app-dashboard-layout [navItems]="nav" title="Patient Dashboard">
      <router-outlet />
    </app-dashboard-layout>
  `,
})
export class PatientShellComponent {
  nav: NavItem[] = [
    { label: 'Overview', icon: 'dashboard', route: '/patient' },
    { label: 'Search Doctors', icon: 'search', route: '/patient/doctors' },
    { label: 'Appointments', icon: 'event', route: '/patient/appointments' },
    { label: 'Payments', icon: 'payments', route: '/patient/payments' },
    { label: 'Medical History', icon: 'history', route: '/patient/history' },
    { label: 'Reports', icon: 'description', route: '/patient/reports' },
    { label: 'Prescriptions', icon: 'medication', route: '/patient/prescriptions' },
    { label: 'Messages', icon: 'chat', route: '/patient/messages' },
    { label: 'Profile', icon: 'person', route: '/patient/profile' },
  ];
}
