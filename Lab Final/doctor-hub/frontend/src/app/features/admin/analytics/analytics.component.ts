import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-analytics',
  standalone: true,
  template: `
    <h1 class="page-title">Analytics Dashboard</h1>
    <div class="grid-2">
      <div class="card-panel stat-card"><h3>{{ stats()?.users?.patients || 0 }}</h3><p>Patients</p></div>
      <div class="card-panel stat-card"><h3>{{ stats()?.users?.doctors || 0 }}</h3><p>Doctors</p></div>
      <div class="card-panel stat-card"><h3>{{ stats()?.appointments?.total || 0 }}</h3><p>Appointments</p></div>
      <div class="card-panel stat-card"><h3>PKR {{ stats()?.revenue || 0 }}</h3><p>Verified Revenue</p></div>
    </div>
    <div class="card-panel">
      <h3>Appointment Status Breakdown</h3>
      <p>Pending: {{ stats()?.appointments?.pending }} · Completed: {{ stats()?.appointments?.completed }}</p>
      <p>Confirmed: {{ stats()?.appointments?.confirmed }} · Cancelled: {{ stats()?.appointments?.cancelled }}</p>
    </div>
  `,
})
export class AdminAnalyticsComponent implements OnInit {
  private api = inject(ApiService);
  stats = signal<any>(null);

  ngOnInit(): void {
    this.api.get('/admin/analytics').subscribe((r) => this.stats.set((r as any).data));
  }
}
