import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-doctor-records',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h1 class="page-title">Medical Records</h1>
    <p class="page-subtitle">Append-only — records cannot be deleted</p>
    <form [formGroup]="form" (ngSubmit)="submit()" class="card-panel">
      <mat-form-field appearance="outline"><mat-label>Patient ID</mat-label><input matInput type="number" formControlName="patientId" /></mat-form-field>
      <mat-form-field appearance="outline" class="full-width"><mat-label>Title</mat-label><input matInput formControlName="title" /></mat-form-field>
      <mat-form-field appearance="outline" class="full-width"><mat-label>Description</mat-label><textarea matInput formControlName="description" rows="4"></textarea></mat-form-field>
      <button mat-flat-button color="primary" type="submit">Add Record</button>
    </form>
  `,
})
export class DoctorRecordsComponent {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  form = this.fb.group({ patientId: [''], title: [''], description: [''], recordType: ['consultation'] });

  submit(): void {
    this.api.post('/history', this.form.value).subscribe({
      next: () => this.snack.open('Record added', 'OK'),
      error: (e) => this.snack.open(e.error?.message || 'Failed', 'Close'),
    });
  }
}
