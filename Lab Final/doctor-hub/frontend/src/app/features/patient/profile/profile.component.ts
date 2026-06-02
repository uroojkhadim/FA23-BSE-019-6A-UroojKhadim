import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-patient-profile',
  standalone: true,
  imports: [MatCardModule],
  template: `
    <h1 class="page-title">Profile</h1>
    <mat-card class="card-panel">
      <p><strong>Name:</strong> {{ auth.user()?.firstName }} {{ auth.user()?.lastName }}</p>
      <p><strong>Email:</strong> {{ auth.user()?.email }}</p>
      <p><strong>Role:</strong> {{ auth.user()?.role }}</p>
    </mat-card>
  `,
})
export class PatientProfileComponent {
  auth = inject(AuthService);
}
