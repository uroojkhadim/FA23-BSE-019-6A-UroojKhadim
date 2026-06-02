import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-super-admin-panel',
  standalone: true,
  template: `
    <h1 class="page-title">Super Admin Control Panel</h1>
    <p class="page-subtitle">Full system access and management</p>
    <div class="grid-2">
      <div class="card-panel stat-card"><h3>{{ stats()?.users?.patients || 0 }}</h3><p>Patients</p></div>
      <div class="card-panel stat-card"><h3>{{ stats()?.users?.doctors || 0 }}</h3><p>Doctors</p></div>
      <div class="card-panel stat-card"><h3>{{ stats()?.users?.admins || 0 }}</h3><p>Admins</p></div>
      <div class="card-panel stat-card"><h3>{{ stats()?.appointments?.total || 0 }}</h3><p>Total Appointments</p></div>
    </div>
  `,
})
export class SuperAdminPanelComponent implements OnInit {
  private api = inject(ApiService);
  stats = signal<any>(null);

  ngOnInit(): void {
    this.api.get('/admin/analytics').subscribe((r) => this.stats.set((r as any).data));
  }
}
