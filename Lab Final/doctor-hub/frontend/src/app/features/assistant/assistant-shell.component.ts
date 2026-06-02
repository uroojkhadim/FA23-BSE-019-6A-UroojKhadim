import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardLayoutComponent, NavItem } from '../../shared/components/dashboard-layout/dashboard-layout.component';

@Component({
  selector: 'app-assistant-shell',
  standalone: true,
  imports: [RouterOutlet, DashboardLayoutComponent],
  template: `
    <app-dashboard-layout [navItems]="nav" title="Assistant Dashboard">
      <router-outlet />
    </app-dashboard-layout>
  `,
})
export class AssistantShellComponent {
  nav: NavItem[] = [
    { label: 'Payment Verification', icon: 'payments', route: '/assistant/payments' },
    { label: 'Appointment Queue', icon: 'queue', route: '/assistant/queue' },
  ];
}
