import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardLayoutComponent, NavItem } from '../../shared/components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-doctor-shell',
  standalone: true,
  imports: [RouterOutlet, DashboardLayoutComponent],
  template: `
    <app-dashboard-layout [navItems]="nav" title="Doctor Dashboard">
      <router-outlet />
    </app-dashboard-layout>
  `,
})
export class DoctorShellComponent {
  nav: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/doctor' },
    { label: 'Clinics & Schedule', icon: 'business', route: '/doctor/clinics' },
    { label: 'Appointments', icon: 'event', route: '/doctor/appointments' },
    { label: 'Prescriptions', icon: 'medication', route: '/doctor/prescriptions' },
    { label: 'Medical Records', icon: 'folder_shared', route: '/doctor/records' },
    { label: 'Messages', icon: 'chat', route: '/doctor/messages' },
    { label: 'Profile', icon: 'person', route: '/doctor/profile' },
  ];
}
