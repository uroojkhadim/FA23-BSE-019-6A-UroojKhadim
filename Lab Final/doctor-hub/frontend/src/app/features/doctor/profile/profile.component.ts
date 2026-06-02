import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-doctor-profile',
  standalone: true,
  template: `<h1 class="page-title">Profile</h1><div class="card-panel"><p>{{ auth.user()?.firstName }} {{ auth.user()?.lastName }}</p></div>`,
})
export class DoctorProfileComponent {
  auth = inject(AuthService);
}
