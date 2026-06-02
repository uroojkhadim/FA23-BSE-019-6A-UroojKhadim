import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-super-admin-settings',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h1 class="page-title">System Settings</h1>
    <form [formGroup]="form" (ngSubmit)="save()" class="card-panel">
      <mat-form-field appearance="outline" class="full-width"><mat-label>App Name</mat-label><input matInput formControlName="app_name" /></mat-form-field>
      <mat-form-field appearance="outline" class="full-width"><mat-label>Currency</mat-label><input matInput formControlName="consultation_currency" /></mat-form-field>
      <button mat-flat-button color="primary" type="submit">Save Settings</button>
    </form>
  `,
})
export class SuperAdminSettingsComponent implements OnInit {
  private api = inject(ApiService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  form = this.fb.group({ app_name: [''], consultation_currency: [''] });

  ngOnInit(): void {
    this.api.get('/admin/settings').subscribe((r) => this.form.patchValue((r as any).data || {}));
  }

  save(): void {
    Object.entries(this.form.value).forEach(([key, value]) => {
      this.api.put('/admin/settings', { key, value }).subscribe();
    });
    this.snack.open('Settings saved', 'OK');
  }
}
