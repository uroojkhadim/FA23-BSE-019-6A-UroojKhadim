import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-doctor-prescriptions',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h1 class="page-title">Add Prescription</h1>
    <p class="page-subtitle">Prescriptions are immutable once created</p>
    <form [formGroup]="form" (ngSubmit)="submit()" class="card-panel">
      <mat-form-field appearance="outline" class="full-width"><mat-label>Appointment ID</mat-label><input matInput type="number" formControlName="appointmentId" /></mat-form-field>
      <mat-form-field appearance="outline" class="full-width"><mat-label>Diagnosis</mat-label><input matInput formControlName="diagnosis" /></mat-form-field>
      <mat-form-field appearance="outline" class="full-width"><mat-label>Medicines (JSON)</mat-label><textarea matInput formControlName="medicines" rows="4"></textarea></mat-form-field>
      <mat-form-field appearance="outline" class="full-width"><mat-label>Instructions</mat-label><textarea matInput formControlName="instructions" rows="2"></textarea></mat-form-field>
      <button mat-flat-button color="primary" type="submit">Create Prescription</button>
    </form>
  `,
})
export class DoctorPrescriptionsComponent {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  form = this.fb.group({
    appointmentId: [''],
    diagnosis: [''],
    medicines: ['[{"name":"Paracetamol","dosage":"500mg","frequency":"twice daily"}]'],
    instructions: [''],
  });

  submit(): void {
    let medicines;
    try { medicines = JSON.parse(this.form.value.medicines!); } catch { this.snack.open('Invalid JSON', 'OK'); return; }
    this.api.post('/prescriptions', { ...this.form.value, medicines }).subscribe({
      next: () => this.snack.open('Prescription created', 'OK'),
      error: (e) => this.snack.open(e.error?.message || 'Failed', 'Close'),
    });
  }
}
