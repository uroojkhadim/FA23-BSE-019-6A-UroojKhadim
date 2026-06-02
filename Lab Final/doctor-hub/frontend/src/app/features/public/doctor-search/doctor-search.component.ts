import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar.component';
import { DoctorService } from '../../../core/services/doctor.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-doctor-search',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    PublicNavbarComponent,
  ],
  template: `
    <app-public-navbar />
    <div class="page-container fade-in">
      <h1 class="page-title">Find Your Doctor</h1>
      <p class="page-subtitle">Search by disease, treatment type, specialization, city, and more</p>

      <form [formGroup]="filterForm" class="filters card-panel">
        <mat-form-field appearance="outline">
          <mat-label>Search</mat-label>
          <input matInput formControlName="search" placeholder="Name, qualification..." />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Treatment Type</mat-label>
          <mat-select formControlName="treatmentTypeId">
            <mat-option value="">All</mat-option>
            @for (t of lookup()?.treatmentTypes; track t.id) {
              <mat-option [value]="t.id">{{ t.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Specialization</mat-label>
          <mat-select formControlName="specializationId">
            <mat-option value="">All</mat-option>
            @for (s of lookup()?.specializations; track s.id) {
              <mat-option [value]="s.id">{{ s.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Disease</mat-label>
          <mat-select formControlName="diseaseId">
            <mat-option value="">All</mat-option>
            @for (d of lookup()?.diseases; track d.id) {
              <mat-option [value]="d.id">{{ d.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>City</mat-label>
          <input matInput formControlName="city" />
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Min Rating</mat-label>
          <mat-select formControlName="minRating">
            <mat-option value="">Any</mat-option>
            <mat-option value="4">4+</mat-option>
            <mat-option value="4.5">4.5+</mat-option>
          </mat-select>
        </mat-form-field>
      </form>

      @if (loading()) {
        <div class="loading"><mat-spinner /></div>
      } @else {
        <div class="grid-2">
          @for (doc of doctors(); track doc.id) {
            <mat-card class="doctor-card">
              <mat-card-header>
                <mat-icon mat-card-avatar>person</mat-icon>
                <mat-card-title>Dr. {{ doc.firstName }} {{ doc.lastName }}</mat-card-title>
                <mat-card-subtitle>{{ doc.treatmentType }} · {{ doc.city }}</mat-card-subtitle>
              </mat-card-header>
              <mat-card-content>
                <p>{{ doc.qualification }}</p>
                <div class="meta">
                  <span><mat-icon>star</mat-icon> {{ doc.rating }} ({{ doc.ratingCount }})</span>
                  <span>PKR {{ doc.consultationFee }}</span>
                </div>
                @if (doc.specializations?.length) {
                  <p class="specs">{{ doc.specializations.join(', ') }}</p>
                }
              </mat-card-content>
              <mat-card-actions>
                <a mat-button color="primary" [routerLink]="['/doctors', doc.id]">View Profile</a>
              </mat-card-actions>
            </mat-card>
          } @empty {
            <p class="empty">No doctors found. Try adjusting filters.</p>
          }
        </div>
        <mat-paginator
          [length]="total()"
          [pageSize]="pageSize"
          [pageIndex]="page() - 1"
          (page)="onPage($event)"
        />
      }
    </div>
  `,
  styles: `
    .filters { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-bottom: 24px; }
    .doctor-card { transition: transform 0.2s; }
    .doctor-card:hover { transform: translateY(-4px); }
    .meta { display: flex; justify-content: space-between; color: var(--dh-muted); margin-top: 8px; }
    .meta mat-icon { font-size: 16px; width: 16px; height: 16px; vertical-align: middle; }
    .specs { font-size: 0.85rem; color: var(--dh-accent); }
    .loading { display: flex; justify-content: center; padding: 48px; }
    .empty { grid-column: 1 / -1; text-align: center; color: var(--dh-muted); }
  `,
})
export class DoctorSearchComponent implements OnInit {
  private fb = inject(FormBuilder);
  private doctorService = inject(DoctorService);

  lookup = signal<{ treatmentTypes: { id: number; name: string }[]; specializations: { id: number; name: string }[]; diseases: { id: number; name: string }[] } | null>(null);
  doctors = signal<any[]>([]);
  loading = signal(false);
  total = signal(0);
  page = signal(1);
  pageSize = 9;

  filterForm = this.fb.group({
    search: [''],
    treatmentTypeId: [''],
    specializationId: [''],
    diseaseId: [''],
    city: [''],
    minRating: [''],
    available: ['true'],
  });

  ngOnInit(): void {
    this.doctorService.getLookup().subscribe((d) => this.lookup.set(d as any));
    this.filterForm.valueChanges.pipe(debounceTime(400)).subscribe(() => {
      this.page.set(1);
      this.load();
    });
    this.load();
  }

  onPage(e: PageEvent): void {
    this.page.set(e.pageIndex + 1);
    this.load();
  }

  load(): void {
    this.loading.set(true);
    const v = this.filterForm.value;
    this.doctorService
      .search({ ...v, page: this.page(), limit: this.pageSize } as Record<string, string | number>)
      .subscribe({
        next: (res: any) => {
          this.doctors.set(res.data || []);
          this.total.set(res.pagination?.total || 0);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }
}
