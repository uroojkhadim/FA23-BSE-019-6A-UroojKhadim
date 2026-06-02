import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { AuthResponse, User, UserRole } from '../models/user.model';

const TOKEN_KEY = 'dh_token';
const USER_KEY = 'dh_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  private userSignal = signal<User | null>(this.loadUser());

  user = this.userSignal.asReadonly();
  isLoggedIn = computed(() => !!this.userSignal());
  role = computed(() => this.userSignal()?.role ?? null);

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  login(email: string, password: string) {
    return this.api.post<AuthResponse>('/auth/login', { email, password }).pipe(
      tap((res) => this.setSession(res.data.token, res.data.user))
    );
  }

  register(payload: Record<string, unknown>) {
    return this.api.post<AuthResponse>('/auth/register', payload).pipe(
      tap((res) => this.setSession(res.data.token, res.data.user))
    );
  }

  forgotPassword(email: string) {
    return this.api.post<{ message: string; resetToken?: string }>('/auth/forgot-password', { email });
  }

  resetPassword(token: string, password: string) {
    return this.api.post<{ message: string }>('/auth/reset-password', { token, password });
  }

  loadProfile() {
    return this.api.get<User>('/auth/profile').pipe(
      tap((res) => {
        if (res.data) this.setSession(this.token!, res.data as User);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.userSignal.set(null);
    this.router.navigate(['/login']);
  }

  dashboardRoute(): string {
    const routes: Record<UserRole, string> = {
      patient: '/patient',
      doctor: '/doctor',
      assistant: '/assistant',
      admin: '/admin',
      super_admin: '/super-admin',
    };
    return routes[this.userSignal()?.role || 'patient'];
  }

  private setSession(token: string, user: User): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSignal.set(user);
  }

  private loadUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }
}
