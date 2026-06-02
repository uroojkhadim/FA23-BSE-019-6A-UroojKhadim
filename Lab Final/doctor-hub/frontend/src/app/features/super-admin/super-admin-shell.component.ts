import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardLayoutComponent, NavItem } from '../../shared/components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-super-admin-shell',
  standalone: true,
  imports: [RouterOutlet, DashboardLayoutComponent],
  template: `
    <app-dashboard-layout [navItems]="nav" title="Super Admin">
      <router-outlet />
    </app-dashboard-layout>
  `,
})
export class SuperAdminShellComponent {
  nav: NavItem[] = [
    { label: 'Control Panel', icon: 'admin_panel_settings', route: '/super-admin' },
    { label: 'All Users', icon: 'people', route: '/super-admin/users' },
    { label: 'System Settings', icon: 'settings', route: '/super-admin/settings' },
  ];
}
