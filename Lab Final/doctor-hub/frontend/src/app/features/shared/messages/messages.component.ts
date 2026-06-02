import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatListModule],
  template: `
    <h1 class="page-title">Messages</h1>
    <div class="layout">
      <mat-nav-list class="contacts card-panel">
        @for (c of contacts(); track c.id) {
          <a mat-list-item (click)="selectContact(c.id)">{{ c.first_name }} {{ c.last_name }}</a>
        }
      </mat-nav-list>
      <div class="chat card-panel">
        @for (m of messages(); track m.id) {
          <div [class.mine]="m.senderId === auth.user()?.id" class="bubble">
            <strong>{{ m.senderName }}</strong>
            <p>{{ m.body }}</p>
          </div>
        }
        @if (selectedId()) {
          <form [formGroup]="form" (ngSubmit)="send()" class="send">
            <mat-form-field appearance="outline" class="full-width"><input matInput formControlName="body" placeholder="Type message..." /></mat-form-field>
            <button mat-flat-button color="primary" type="submit">Send</button>
          </form>
        }
      </div>
    </div>
  `,
  styles: `
    .layout { display: grid; grid-template-columns: 240px 1fr; gap: 16px; min-height: 400px; }
    .bubble { padding: 8px 12px; margin: 8px 0; background: #e3f2fd; border-radius: 8px; max-width: 70%; }
    .bubble.mine { margin-left: auto; background: #e8f5e9; }
    .send { display: flex; gap: 8px; margin-top: 16px; }
    @media (max-width: 768px) { .layout { grid-template-columns: 1fr; } }
  `,
})
export class MessagesComponent implements OnInit {
  private api = inject(ApiService);
  auth = inject(AuthService);
  private fb = inject(FormBuilder);
  contacts = signal<any[]>([]);
  messages = signal<any[]>([]);
  selectedId = signal<number | null>(null);
  form = this.fb.group({ body: [''] });

  ngOnInit(): void {
    this.api.get<any[]>('/messages/contacts').subscribe((r) => this.contacts.set((r as any).data || []));
  }

  selectContact(id: number): void {
    this.selectedId.set(id);
    this.api.get<any[]>(`/messages/${id}`).subscribe((r) => this.messages.set((r as any).data || []));
  }

  send(): void {
    const receiverId = this.selectedId();
    if (!receiverId || !this.form.value.body) return;
    this.api.post('/messages', { receiverId, body: this.form.value.body }).subscribe(() => {
      this.form.reset();
      this.selectContact(receiverId);
    });
  }
}
