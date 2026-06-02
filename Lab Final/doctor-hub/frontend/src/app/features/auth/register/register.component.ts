import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    PublicNavbarComponent,
  ],
  template: `
    <app-public-navbar />
    <div class="auth-page fade-in">
      <mat-card class="auth-card">
        <h2>Create Account</h2>
        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Role</mat-label>
            <mat-select formControlName="role">
              <mat-option value="patient">Patient</mat-option>
              <mat-option value="doctor">Doctor</mat-option>
            </mat-select>
          </mat-form-field>
          <div class="row">
            <mat-form-field appearance="outline">
              <mat-label>First Name</mat-label>
              <input matInput formControlName="firstName" />
            </mat-form-field>
            <mat-form-field appearance="outline">
              <mat-label>Last Name</mat-label>
              <input matInput formControlName="lastName" />
            </mat-form-field>
          </div>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput type="password" formControlName="password" />
            <mat-hint>Min 8 chars, uppercase & number</mat-hint>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>City</mat-label>
            <input matInput formControlName="city" />
          </mat-form-field>
          @if (form.value.role === 'doctor') {
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Treatment Type</mat-label>
              <mat-select formControlName="treatmentTypeId">
                @for (t of treatmentTypes(); track t.id) {
                  <mat-option [value]="t.id">{{ t.name }}</mat-option>
                }
              </mat-select>
            </mat-form-field>
          }
          <button mat-flat-button color="primary" class="full-width" type="submit" [disabled]="loading()">
            Register
          </button>
        </form>
        <p class="footer">Have an account? <a routerLink="/login">Login</a></p>
      </mat-card>
    </div>
  `,
  styles: `
    .auth-page { display: flex; justify-content: center; padding: 40px 24px; }
    .auth-card { width: 100%; max-width: 480px; padding: 32px; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .footer { text-align: center; margin-top: 16px; }
  `,
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private doctorService = inject(DoctorService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  treatmentTypes = signal<{ id: number; name: string }[]>([]);
  loading = signal(false);

  form = this.fb.group({
    role: ['patient', Validators.required],
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    phone: [''],
    city: [''],
    treatmentTypeId: [''],
  });

  ngOnInit(): void {
    this.doctorService.getLookup().subscribe((d: any) => this.treatmentTypes.set(d.treatmentTypes));
  }

  submit(): void {
    if (this.form.invalid) return;
    this.loading.set(true);
    this.auth.register(this.form.value).subscribe({
      next: () => {
        this.snack.open('Registration successful', 'OK', { duration: 3000 });
        this.router.navigate([this.auth.dashboardRoute()]);
      },
      error: (e) => {
        this.loading.set(false);
        this.snack.open(e.error?.message || 'Registration failed', 'Close', { duration: 4000 });
      },
    });
  }
}
