import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-doctor-clinics',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  template: `
    <h1 class="page-title">Clinics & Schedules</h1>
    <form [formGroup]="form" (ngSubmit)="addClinic()" class="card-panel grid-2">
      <mat-form-field appearance="outline"><mat-label>Clinic Name</mat-label><input matInput formControlName="name" /></mat-form-field>
      <mat-form-field appearance="outline"><mat-label>City</mat-label><input matInput formControlName="city" /></mat-form-field>
      <mat-form-field appearance="outline" class="full-width"><mat-label>Address</mat-label><input matInput formControlName="address" /></mat-form-field>
      <button mat-flat-button color="primary" type="submit">Add Clinic</button>
    </form>
    @for (c of clinics(); track c.id) {
      <div class="card-panel">
        <h3>{{ c.name }} — {{ c.city }}</h3>
        <p>{{ c.address }}</p>
        @for (s of c.schedules; track s.id) {
          <p>Day {{ s.day_of_week }}: {{ s.start_time }} - {{ s.end_time }}</p>
        }
      </div>
    }
  `,
})
export class DoctorClinicsComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  clinics = signal<any[]>([]);
  form = this.fb.group({ name: [''], address: [''], city: [''], phone: [''] });

  ngOnInit(): void {
    this.api.get<any[]>('/clinics').subscribe((r) => this.clinics.set((r as any).data || []));
  }

  addClinic(): void {
    this.api.post('/clinics', this.form.value).subscribe({
      next: () => { this.snack.open('Clinic added', 'OK'); this.ngOnInit(); },
      error: (e) => this.snack.open(e.error?.message || 'Failed', 'Close'),
    });
  }
}
