import { Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { AppointmentService } from '../../../core/services/appointment.service';

@Component({
  selector: 'app-assistant-queue',
  standalone: true,
  imports: [MatTableModule],
  template: `
    <h1 class="page-title">Appointment Queue</h1>
    <table mat-table [dataSource]="rows()" class="card-panel full-width">
      <ng-container matColumnDef="patient"><th mat-header-cell *matHeaderCellDef>Patient</th><td mat-cell *matCellDef="let r">{{ r.patientName }}</td></ng-container>
      <ng-container matColumnDef="doctor"><th mat-header-cell *matHeaderCellDef>Doctor</th><td mat-cell *matCellDef="let r">{{ r.doctorName }}</td></ng-container>
      <ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>Status</th><td mat-cell *matCellDef="let r"><span class="status-chip status-{{ r.status }}">{{ r.status }}</span></td></ng-container>
      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row *matRowDef="let row; columns: cols"></tr>
    </table>
  `,
})
export class AssistantQueueComponent implements OnInit {
  private appt = inject(AppointmentService);
  rows = signal<any[]>([]);
  cols = ['patient', 'doctor', 'status'];

  ngOnInit(): void {
    this.appt.list().subscribe((r: any) => this.rows.set(r.data || []));
  }
}
