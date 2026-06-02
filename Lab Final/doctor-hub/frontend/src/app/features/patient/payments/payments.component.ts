import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppointmentService } from '../../../core/services/appointment.service';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-patient-payments',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatFormFieldModule, MatInputModule, DatePipe],
  template: `
    <h1 class="page-title">Payments</h1>
    <p class="page-subtitle">Upload payment screenshots for pending appointments</p>
    @for (a of pending(); track a.id) {
      <div class="card-panel payment-card">
        <p><strong>{{ a.doctorName }}</strong> — {{ a.appointmentDate | date }} — PKR {{ a.payment?.amount }}</p>
        <input type="file" accept="image/*" #fileInput (change)="onFile(a.id, fileInput)" />
        <mat-form-field appearance="outline">
          <mat-label>Transaction Ref (optional)</mat-label>
          <input matInput #refInput />
        </mat-form-field>
        <button mat-flat-button color="primary" (click)="upload(a.id, fileInput, refInput.value)">Upload Screenshot</button>
      </div>
    } @empty {
      <p class="page-subtitle">No pending payment uploads.</p>
    }
  `,
  styles: `.payment-card { margin-bottom: 16px; display: flex; flex-direction: column; gap: 12px; }`,
})
export class PatientPaymentsComponent implements OnInit {
  private appt = inject(AppointmentService);
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);
  pending = signal<any[]>([]);
  private files = new Map<number, File>();

  ngOnInit(): void {
    this.appt.list({ status: 'pending' }).subscribe((r: any) => {
      const pending = (r.data || []).filter((a: any) => a.status === 'pending' || a.status === 'payment_uploaded');
      this.pending.set(pending);
    });
  }

  onFile(apptId: number, input: HTMLInputElement): void {
    if (input.files?.[0]) this.files.set(apptId, input.files[0]);
  }

  upload(apptId: number, input: HTMLInputElement, ref: string): void {
    const file = this.files.get(apptId) || input.files?.[0];
    if (!file) { this.snack.open('Select a file', 'OK'); return; }
    const fd = new FormData();
    fd.append('screenshot', file);
    fd.append('appointmentId', String(apptId));
    if (ref) fd.append('transactionRef', ref);
    this.api.upload('/payments/upload', fd).subscribe({
      next: () => { this.snack.open('Payment uploaded', 'OK'); this.ngOnInit(); },
      error: (e) => this.snack.open(e.error?.message || 'Upload failed', 'Close'),
    });
  }
}
