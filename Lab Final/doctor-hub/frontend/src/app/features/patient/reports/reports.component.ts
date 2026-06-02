import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-patient-reports',
  standalone: true,
  imports: [MatButtonModule, MatFormFieldModule, MatInputModule, DatePipe],
  template: `
    <h1 class="page-title">Medical Reports</h1>
    <div class="card-panel upload">
      <mat-form-field appearance="outline" class="full-width"><mat-label>Title</mat-label><input matInput #title /></mat-form-field>
      <input type="file" accept=".pdf,image/*" #file />
      <button mat-flat-button color="primary" (click)="upload(title.value, file)">Upload Report</button>
    </div>
    <ul>
      @for (r of reports(); track r.id) {
        <li class="card-panel"><strong>{{ r.title }}</strong> — {{ r.created_at | date }}</li>
      }
    </ul>
  `,
  styles: `.upload { display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px; } li { list-style: none; margin-bottom: 8px; }`,
})
export class PatientReportsComponent implements OnInit {
  private api = inject(ApiService);
  private snack = inject(MatSnackBar);
  reports = signal<any[]>([]);

  ngOnInit(): void {
    this.api.get<any[]>('/reports').subscribe((r) => this.reports.set((r as any).data || []));
  }

  upload(title: string, input: HTMLInputElement): void {
    const file = input.files?.[0];
    if (!file || !title) return;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', title);
    this.api.upload('/reports/upload', fd).subscribe({
      next: () => { this.snack.open('Uploaded', 'OK'); this.ngOnInit(); },
      error: (e) => this.snack.open(e.error?.message || 'Failed', 'Close'),
    });
  }
}
