import { Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { AppointmentService } from '../../../core/services/appointment.service';

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [MatTableModule, MatButtonModule],
  template: `
    <h1 class="page-title">Appointments</h1>
    <table mat-table [dataSource]="rows()" class="card-panel full-width">
      <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let r">{{ r.patientName }}</td></ng-container>
      <ng-container matColumnDef="date"><th mat-header-cell *matHeaderCellDef>Date</th><td mat-cell *matCellDef="let r">{{ r.appointmentDate }}</td></ng-container>
      <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r"><span class="status-chip status-{{ r.status }}">{{ r.status }}</span></td></ng-container>
      <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let r">
          @if (r.status === 'verified') {
            <button mat-button (click)="update(r.id, 'confirmed', 'accepted')">Confirm</button>
          }
          @if (r.status === 'confirmed') {
            <button mat-button (click)="update(r.id, 'completed')">Complete</button>
          }
          <button mat-button (click)="update(r.id, 'cancelled', 'rejected')">Reject</button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row *matRowDef="let row; columns: cols"></tr>
    </table>
  `,
})
export class DoctorAppointmentsComponent implements OnInit {
  private appt = inject(AppointmentService);
  rows = signal<any[]>([]);
  cols = ['patient', 'date', 'status', 'actions'];

  ngOnInit(): void {
    this.appt.list().subscribe((r: any) => this.rows.set(r.data || []));
  }

  update(id: number, status: string, doctorResponse?: string): void {
    this.appt.updateStatus(id, { status, doctorResponse }).subscribe(() => this.ngOnInit());
  }
}
