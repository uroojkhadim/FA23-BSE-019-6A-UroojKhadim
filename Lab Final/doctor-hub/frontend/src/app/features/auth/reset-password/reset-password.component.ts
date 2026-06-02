import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    ReactiveFormsModule,
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
        <h2>Reset Password</h2>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>New Password</mat-label>
            <input matInput type="password" formControlName="password" />
          </mat-form-field>
          <button mat-flat-button color="primary" class="full-width" type="submit">Reset</button>
        </form>
      </mat-card>
    </div>
  `,
  styles: `.auth-page { display: flex; justify-content: center; padding: 48px; } .auth-card { max-width: 420px; padding: 32px; width: 100%; }`,
})
export class ResetPasswordComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  private token = '';

  form = this.fb.group({ password: ['', [Validators.required, Validators.minLength(8)]] });

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
  }

  submit(): void {
    this.auth.resetPassword(this.token, this.form.value.password!).subscribe({
      next: () => {
        this.snack.open('Password reset successful', 'OK');
        this.router.navigate(['/login']);
      },
      error: (e) => this.snack.open(e.error?.message || 'Failed', 'Close'),
    });
  }
}
