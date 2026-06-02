import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private api = inject(ApiService);

  list(params?: Record<string, string | number>) {
    return this.api.get<unknown[]>('/appointments', params).pipe(
      map((r) => {
        const res = r as unknown as { data?: unknown[]; pagination?: unknown };
        return { data: res.data || [], pagination: res.pagination };
      })
    );
  }

  create(body: unknown) {
    return this.api.post<unknown>('/appointments', body).pipe(map((r) => r.data));
  }

  updateStatus(id: number, body: unknown) {
    return this.api.put<unknown>(`/appointments/${id}/status`, body).pipe(map((r) => r.data));
  }
}
