import { Component, OnInit, inject, signal } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-admin-activity',
  standalone: true,
  imports: [DatePipe],
  template: `
    <h1 class="page-title">Activity Logs</h1>
    @for (log of logs(); track log.id) {
      <div class="card-panel log">
        <strong>{{ log.action }}</strong> — {{ log.email || 'System' }} — {{ log.created_at | date:'medium' }}
      </div>
    }
  `,
  styles: `.log { margin-bottom: 8px; font-size: 0.9rem; }`,
})
export class AdminActivityComponent implements OnInit {
  private api = inject(ApiService);
  logs = signal<any[]>([]);

  ngOnInit(): void {
    this.api.get('/admin/activity').subscribe((r) => this.logs.set((r as any).data || []));
  }
}
