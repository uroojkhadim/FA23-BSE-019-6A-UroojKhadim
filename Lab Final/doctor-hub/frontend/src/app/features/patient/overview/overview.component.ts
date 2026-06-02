import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppointmentService } from '../../../core/services/appointment.service';

@Component({
  selector: 'app-patient-overview',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <h1 class="page-title">Welcome back</h1>
    <p class="page-subtitle">Your health dashboard at a glance</p>
    <div class="grid-2">
      <div class="card-panel stat-card">
        <mat-icon>event</mat-icon>
        <h3>{{ upcoming() }}</h3>
        <p>Upcoming Appointments</p>
      </div>
      <div class="card-panel stat-card">
        <mat-icon>check_circle</mat-icon>
        <h3>{{ completed() }}</h3>
        <p>Completed Visits</p>
      </div>
    </div>
    <div class="actions card-panel">
      <a mat-flat-button color="primary" routerLink="/patient/doctors">Find a Doctor</a>
      <a mat-stroked-button color="primary" routerLink="/patient/appointments">View Appointments</a>
    </div>
  `,
  styles: `.actions { display: flex; gap: 12px; margin-top: 24px; }`,
})
export class PatientOverviewComponent implements OnInit {
  private appt = inject(AppointmentService);
  upcoming = signal(0);
  completed = signal(0);

  ngOnInit(): void {
    this.appt.list().subscribe((res: any) => {
      const data = res.data || [];
      this.upcoming.set(data.filter((a: any) => ['pending', 'payment_uploaded', 'verified', 'confirmed'].includes(a.status)).length);
      this.completed.set(data.filter((a: any) => a.status === 'completed').length);
    });
  }
}
