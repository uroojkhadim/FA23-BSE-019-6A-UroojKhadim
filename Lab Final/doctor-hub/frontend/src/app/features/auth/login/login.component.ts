import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    PublicNavbarComponent,
  ],
  template: `
    <app-public-navbar />
    <div class="auth-page fade-in">
      <mat-card class="auth-card">
        <h2>Welcome Back</h2>
        <p>Sign in to your Doctor Hub account</p>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" />
          </mat-form-field>
          <a routerLink="/forgot-password" class="forgot">Forgot password?</a>
          <button mat-flat-button color="primary" class="full-width" type="submit" [disabled]="loading()">
            @if (loading()) { <mat-spinner diameter="20" /> } @else { Login }
          </button>
        </form>
        <p class="footer">No account? <a routerLink="/register">Register</a></p>
      </mat-card>
    </div>
  `,
  styles: `
    .auth-page { display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 64px); padding: 24px; }
    .auth-card { width: 100%; max-width: 420px; padding: 32px; }
    h2 { margin: 0; color: var(--dh-primary); }
    .forgot { display: block; text-align: right; margin-bottom: 16px; font-size: 0.9rem; }
    .footer { text-align: center; margin-top: 16px; color: var(--dh-muted); }
  `,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  loading = signal(false);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    const { email, password } = this.form.value;
    this.auth.login(email!, password!).subscribe({
      next: () => {
        this.snack.open('Login successful', 'OK', { duration: 3000 });
        this.router.navigate([this.auth.dashboardRoute()]);
      },
      error: (e) => {
        this.loading.set(false);
        this.snack.open(e.error?.message || 'Login failed', 'Close', { duration: 4000 });
      },
    });
  }
}
