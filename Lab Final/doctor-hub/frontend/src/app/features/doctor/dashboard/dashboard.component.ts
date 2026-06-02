import { Component, OnInit, inject, signal } from '@angular/core';
import { AppointmentService } from '../../../core/services/appointment.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  template: `
    <h1 class="page-title">Doctor Dashboard</h1>
    <div class="grid-2">
      <div class="card-panel stat-card"><h3>{{ today() }}</h3><p>Today's Appointments</p></div>
      <div class="card-panel stat-card"><h3>{{ pending() }}</h3><p>Pending Requests</p></div>
    </div>
  `,
})
export class DoctorDashboardComponent implements OnInit {
  private appt = inject(AppointmentService);
  today = signal(0);
  pending = signal(0);

  ngOnInit(): void {
    this.appt.list().subscribe((r: any) => {
      const data = r.data || [];
      this.pending.set(data.filter((a: any) => a.doctorResponse === 'pending').length);
      this.today.set(data.length);
    });
  }
}
