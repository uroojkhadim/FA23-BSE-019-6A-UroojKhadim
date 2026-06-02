import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-assistant-payments',
  standalone: true,
  imports: [MatButtonModule, MatCardModule],
  template: `
    <h1 class="page-title">Payment Verification</h1>
    @for (p of payments(); track p.id) {
      <mat-card class="card-panel item">
        <p><strong>{{ p.first_name }} {{ p.last_name }}</strong> → Dr. {{ p.doctor_first }} {{ p.doctor_last }}</p>
        <p>Amount: PKR {{ p.amount }} · {{ p.appointment_date }}</p>
        @if (p.screenshot_url) {
          <img [src]="uploadUrl + p.screenshot_url" alt="Payment" class="screenshot" />
        }
        <div class="actions">
          <button mat-flat-button color="primary" (click)="verify(p.id, true)">Approve</button>
          <button mat-stroked-button color="warn" (click)="verify(p.id, false)">Reject</button>
        </div>
      </mat-card>
    } @empty { <p>No pending verifications.</p> }
  `,
  styles: `
    .item { margin-bottom: 16px; }
    .screenshot { max-width: 300px; border-radius: 8px; margin: 12px 0; }
    .actions { display: flex; gap: 12px; }
  `,
})
export class AssistantPaymentsComponent implements OnInit {
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);
  payments = signal<any[]>([]);
  uploadUrl = environment.uploadUrl;

  ngOnInit(): void {
    this.api.get<any[]>('/payments/pending').subscribe((r) => this.payments.set((r as any).data || []));
  }

  verify(paymentId: number, approved: boolean): void {
    this.api.put('/payments/verify', { paymentId, approved }).subscribe({
      next: () => { this.snack.open(approved ? 'Verified' : 'Rejected', 'OK'); this.ngOnInit(); },
      error: (e) => this.snack.open(e.error?.message || 'Failed', 'Close'),
    });
  }
}
