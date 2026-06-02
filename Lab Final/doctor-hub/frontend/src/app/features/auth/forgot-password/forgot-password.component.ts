import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    PublicNavbarComponent,
  ],
  template: `
    <app-public-navbar />
    <div class="auth-page">
      <mat-card class="auth-card">
        <h2>Forgot Password</h2>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput formControlName="email" />
          </mat-form-field>
          <button mat-flat-button color="primary" class="full-width" type="submit">Send Reset Link</button>
        </form>
        @if (resetToken()) {
          <p class="dev-token">Dev token: <a [routerLink]="['/reset-password']" [queryParams]="{ token: resetToken() }">Reset now</a></p>
        }
        <p class="footer"><a routerLink="/login">Back to login</a></p>
      </mat-card>
    </div>
  `,
  styles: `
    .auth-page { display: flex; justify-content: center; padding: 48px; }
    .auth-card { max-width: 420px; padding: 32px; width: 100%; }
    .dev-token { background: #fff3e0; padding: 12px; border-radius: 8px; font-size: 0.85rem; }
  `,
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private snack = inject(MatSnackBar);
  resetToken = signal<string | null>(null);

  form = this.fb.group({ email: ['', [Validators.required, Validators.email]] });

  submit(): void {
    this.auth.forgotPassword(this.form.value.email!).subscribe({
      next: (res: any) => {
        this.snack.open(res.data?.message || 'Check your email', 'OK', { duration: 5000 });
        if (res.data?.resetToken) this.resetToken.set(res.data.resetToken);
      },
      error: (e) => this.snack.open(e.error?.message || 'Error', 'Close'),
    });
  }
}
