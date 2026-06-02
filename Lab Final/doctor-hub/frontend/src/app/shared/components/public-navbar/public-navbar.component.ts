import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-public-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar class="navbar">
      <a routerLink="/" class="brand">
        <mat-icon>local_hospital</mat-icon>
        <span>Doctor Hub</span>
      </a>
      <span class="spacer"></span>
      <a mat-button routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
      <a mat-button routerLink="/doctors">Find Doctors</a>
      <a mat-button routerLink="/about">About</a>
      <a mat-button routerLink="/contact">Contact</a>
      @if (auth.isLoggedIn()) {
        <a mat-flat-button color="primary" [routerLink]="auth.dashboardRoute()">Dashboard</a>
        <button mat-button (click)="auth.logout()">Logout</button>
      } @else {
        <a mat-button routerLink="/login">Login</a>
        <a mat-flat-button color="primary" routerLink="/register">Register</a>
      }
    </mat-toolbar>
  `,
  styles: `
    .navbar { background: #fff; border-bottom: 1px solid var(--dh-border); position: sticky; top: 0; z-index: 100; }
    .brand { display: flex; align-items: center; gap: 8px; color: var(--dh-primary); font-weight: 600; font-size: 1.2rem; }
    .spacer { flex: 1; }
    .active { color: var(--dh-primary) !important; }
  `,
})
export class PublicNavbarComponent {
  auth = inject(AuthService);
}
