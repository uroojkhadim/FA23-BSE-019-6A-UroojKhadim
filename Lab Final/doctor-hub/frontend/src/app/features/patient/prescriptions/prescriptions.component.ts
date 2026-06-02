import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../../core/services/api.service';
import { DatePipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-patient-prescriptions',
  standalone: true,
  imports: [MatCardModule, DatePipe, JsonPipe],
  template: `
    <h1 class="page-title">Prescriptions</h1>
    <p class="page-subtitle">Read-only — issued by your doctor</p>
    @for (rx of items(); track rx.id) {
      <mat-card class="rx">
        <mat-card-title>{{ rx.diagnosis }}</mat-card-title>
        <mat-card-subtitle>Dr. {{ rx.doctorName }} · {{ rx.createdAt | date }}</mat-card-subtitle>
        <mat-card-content>
          <pre>{{ rx.medicines | json }}</pre>
          <p>{{ rx.instructions }}</p>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: `.rx { margin-bottom: 16px; } pre { background: #f5f9fc; padding: 12px; border-radius: 8px; }`,
})
export class PatientPrescriptionsComponent implements OnInit {
  private api = inject(ApiService);
  items = signal<any[]>([]);

  ngOnInit(): void {
    this.api.get<any[]>('/prescriptions').subscribe((r) => this.items.set((r as any).data || []));
  }
}
