import { Component, OnInit, inject, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [MatTableModule, MatButtonModule],
  template: `
    <h1 class="page-title">Manage Users</h1>
    <table mat-table [dataSource]="users()" class="card-panel full-width">
      <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef>Name</th><td mat-cell *matCellDef="let u">{{ u.first_name }} {{ u.last_name }}</td></ng-container>
      <ng-container matColumnDef="email"><th mat-header-cell *matHeaderCellDef>Email</th><td mat-cell *matCellDef="let u">{{ u.email }}</td></ng-container>
      <ng-container matColumnDef="role"><th mat-header-cell *matHeaderCellDef>Role</th><td mat-cell *matCellDef="let u">{{ u.role }}</td></ng-container>
      <ng-container matColumnDef="active"><th mat-header-cell *matHeaderCellDef>Active</th><td mat-cell *matCellDef="let u">{{ u.is_active ? 'Yes' : 'No' }}</td></ng-container>
      <tr mat-header-row *matHeaderRowDef="cols"></tr>
      <tr mat-row *matRowDef="let row; columns: cols"></tr>
    </table>
  `,
})
export class AdminUsersComponent implements OnInit {
  private api = inject(ApiService);
  users = signal<any[]>([]);
  cols = ['name', 'email', 'role', 'active'];

  ngOnInit(): void {
    this.api.get('/admin/users').subscribe((r: any) => this.users.set(r.data || []));
  }
}
