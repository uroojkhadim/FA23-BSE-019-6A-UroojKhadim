import { Component, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth.service';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  template: `
    <mat-sidenav-container class="layout">
      <mat-sidenav mode="side" opened class="sidenav">
        <div class="sidenav-brand">
          <mat-icon>local_hospital</mat-icon>
          <span>Doctor Hub</span>
        </div>
        <mat-nav-list>
          @for (item of navItems(); track item.route) {
            <a mat-list-item [routerLink]="item.route" routerLinkActive="active">
              <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
              <span matListItemTitle>{{ item.label }}</span>
            </a>
          }
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar class="topbar">
          <span>{{ title() }}</span>
          <span class="spacer"></span>
          <span class="user">{{ auth.user()?.firstName }} ({{ auth.user()?.role }})</span>
          <button mat-icon-button (click)="auth.logout()" title="Logout">
            <mat-icon>logout</mat-icon>
          </button>
        </mat-toolbar>
        <main class="content fade-in">
          <ng-content />
        </main>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    .layout { height: 100vh; }
    .sidenav { width: 260px; background: #fff; border-right: 1px solid var(--dh-border); }
    .sidenav-brand {
      display: flex; align-items: center; gap: 8px; padding: 20px;
      color: var(--dh-primary); font-weight: 600; font-size: 1.1rem;
      border-bottom: 1px solid var(--dh-border);
    }
    .active { background: rgba(21, 101, 192, 0.08); color: var(--dh-primary) !important; }
    .topbar { background: #fff; border-bottom: 1px solid var(--dh-border); }
    .content { padding: 24px; min-height: calc(100vh - 64px); background: var(--dh-bg); }
    .spacer { flex: 1; }
    .user { margin-right: 8px; color: var(--dh-muted); font-size: 0.9rem; }
  `,
})
export class DashboardLayoutComponent {
  auth = inject(AuthService);
  navItems = input.required<NavItem[]>();
  title = input('Dashboard');
}
