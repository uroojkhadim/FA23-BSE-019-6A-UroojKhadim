import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiUrl;

  get<T>(path: string, params?: Record<string, string | number | boolean>) {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          httpParams = httpParams.set(k, String(v));
        }
      });
    }
    return this.http.get<{ success: boolean; data?: T; [key: string]: unknown }>(`${this.base}${path}`, {
      params: httpParams,
    });
  }

  post<T>(path: string, body: unknown): Observable<{ success: boolean; data: T }> {
    return this.http.post<{ success: boolean; data: T }>(`${this.base}${path}`, body);
  }

  put<T>(path: string, body: unknown): Observable<{ success: boolean; data: T }> {
    return this.http.put<{ success: boolean; data: T }>(`${this.base}${path}`, body);
  }

  patch<T>(path: string, body: unknown): Observable<{ success: boolean; data: T }> {
    return this.http.patch<{ success: boolean; data: T }>(`${this.base}${path}`, body);
  }

  upload(path: string, formData: FormData) {
    return this.http.post<{ success: boolean; data: unknown }>(`${this.base}${path}`, formData);
  }
}
