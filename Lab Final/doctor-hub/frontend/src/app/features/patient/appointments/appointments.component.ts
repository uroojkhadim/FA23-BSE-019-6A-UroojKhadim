import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { AppointmentService } from '../../../core/services/appointment.service';

@Component({
  selector: 'app-patient-appointments',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    DatePipe,
  ],
  template: `
    <h1 class="page-title">My Appointments</h1>
    <div class="card-panel book-form">
      <h3>Book Appointment</h3>
      <form [formGroup]="bookForm" (ngSubmit)="book()" class="grid-2">
        <mat-form-field appearance="outline">
          <mat-label>Doctor ID</mat-label>
          <input matInput type="number" formControlName="doctorId" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Date</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="appointmentDate" />
          <mat-datepicker-toggle matIconSuffix [for]="picker" />
          <mat-datepicker #picker />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Time (HH:mm)</mat-label>
          <input matInput formControlName="appointmentTime" placeholder="10:00" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Reason</mat-label>
          <input matInput formControlName="reason" />
        </mat-form-field>
        <button mat-flat-button color="primary" type="submit">Book</button>
      </form>
    </div>
    <table mat-table [dataSource]="appointments()" class="card-panel full-width">
      <ng-container matColumnDef="doctor"><th mat-header-cell *matHeaderCellDef>Doctor</th><td mat-cell *matCellDef="let r">{{ r.doctorName }}</td></ng-container>
      <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let r">{{ r.appointmentDate | date }}</td></ng-container>
      <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r"><span class="status-chip status-{{ r.status }}">{{ r.status }}</span></td></ng-container>
      <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let r">
          @if (r.status === 'pending') {
            <button mat-button (click)="cancel(r.id)">Cancel</button>
          }
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row *matRowDef="let row; columns: cols"></tr>
    </table>
  `,
  styles: `.book-form { margin-bottom: 24px; } table { width: 100%; }`,
})
export class PatientAppointmentsComponent implements OnInit {
  private appt = inject(AppointmentService);
  private snack = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  appointments = signal<any[]>([]);
  cols = ['doctor', 'date', 'status', 'actions'];

  bookForm = this.fb.group({
    doctorId: [''],
    appointmentDate: [''],
    appointmentTime: ['10:00'],
    reason: [''],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.appt.list().subscribe((r: any) => this.appointments.set(r.data || []));
  }

  book(): void {
    const v = this.bookForm.value;
    const raw = v.appointmentDate as Date | string | null;
    const date = raw instanceof Date ? raw.toISOString().split('T')[0] : raw;
    this.appt.create({ ...v, appointmentDate: date }).subscribe({
      next: () => { this.snack.open('Appointment booked', 'OK'); this.load(); },
      error: (e) => this.snack.open(e.error?.message || 'Failed', 'Close'),
    });
  }

  cancel(id: number): void {
    this.appt.updateStatus(id, { status: 'cancelled' }).subscribe(() => this.load());
  }
}
