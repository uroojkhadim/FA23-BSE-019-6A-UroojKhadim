import { Component, OnInit, inject, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../../core/services/api.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-patient-history',
  standalone: true,
  imports: [MatCardModule, DatePipe],
  template: `
    <h1 class="page-title">Medical History</h1>
    <p class="page-subtitle">Immutable records — cannot be edited or deleted</p>
    @for (r of records(); track r.id) {
      <mat-card class="record">
        <mat-card-title>{{ r.title }}</mat-card-title>
        <mat-card-subtitle>{{ r.doctorName }} · {{ r.createdAt | date:'medium' }}</mat-card-subtitle>
        <mat-card-content><p>{{ r.description }}</p></mat-card-content>
      </mat-card>
    } @empty { <p>No records yet.</p> }
  `,
  styles: `.record { margin-bottom: 16px; }`,
})
export class PatientHistoryComponent implements OnInit {
  private api = inject(ApiService);
  records = signal<any[]>([]);

  ngOnInit(): void {
    this.api.get<any[]>('/history').subscribe((r) => this.records.set((r as any).data || []));
  }
}
