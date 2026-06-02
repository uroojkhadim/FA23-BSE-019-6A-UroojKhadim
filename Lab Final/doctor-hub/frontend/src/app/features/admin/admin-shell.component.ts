import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardLayoutComponent, NavItem } from '../../shared/components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterOutlet, DashboardLayoutComponent],
  template: `
    <app-dashboard-layout [navItems]="nav" title="Admin Dashboard">
      <router-outlet />
    </app-dashboard-layout>
  `,
})
export class AdminShellComponent {
  nav: NavItem[] = [
    { label: 'Analytics', icon: 'analytics', route: '/admin' },
    { label: 'Manage Users', icon: 'people', route: '/admin/users' },
    { label: 'Doctors', icon: 'medical_services', route: '/admin/doctors' },
    { label: 'Activity Logs', icon: 'history', route: '/admin/activity' },
  ];
}
