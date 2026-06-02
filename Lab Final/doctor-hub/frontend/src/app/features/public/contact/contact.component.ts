import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublicNavbarComponent } from '../../../shared/components/public-navbar/public-navbar.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, PublicNavbarComponent],
  template: `
    <app-public-navbar />
    <div class="page-container fade-in">
      <h1 class="page-title">Contact Us</h1>
      <form [formGroup]="form" (ngSubmit)="send()" class="card-panel" style="max-width: 500px">
        <mat-form-field appearance="outline" class="full-width"><mat-label>Name</mat-label><input matInput formControlName="name" /></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Email</mat-label><input matInput formControlName="email" /></mat-form-field>
        <mat-form-field appearance="outline" class="full-width"><mat-label>Message</mat-label><textarea matInput formControlName="message" rows="4"></textarea></mat-form-field>
        <button mat-flat-button color="primary" type="submit">Send Message</button>
      </form>
    </div>
  `,
})
export class ContactComponent {
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  form = this.fb.group({ name: [''], email: [''], message: [''] });

  send(): void {
    this.snack.open('Thank you! We will respond shortly.', 'OK', { duration: 4000 });
    this.form.reset();
  }
}
