import { Injectable, inject } from '@angular/core';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class DoctorService {
  private api = inject(ApiService);

  search(params: Record<string, string | number | boolean>) {
    return this.api.get<unknown[]>('/doctors', params).pipe(
      map((res) => {
        const r = res as unknown as { data?: unknown[]; pagination?: unknown };
        return { data: r.data || [], pagination: r.pagination };
      })
    );
  }

  getById(id: number) {
    return this.api.get<unknown>(`/doctors/${id}`).pipe(map((r) => r.data));
  }

  getLookup() {
    return this.api.get<{
      treatmentTypes: unknown[];
      specializations: unknown[];
      diseases: unknown[];
    }>('/lookup').pipe(map((r) => r.data));
  }
}
