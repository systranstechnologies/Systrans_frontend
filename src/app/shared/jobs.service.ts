import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  employmentType: string;
  workplaceType: string;
  experienceLevel: string;
  salaryRange: string | null;
  summary: string;
  description: string;
  responsibilities: string | null;
  requirements: string | null;
  benefits: string | null;
  applicationEmail: string;
  applicationUrl: string | null;
  closingDate: string | null;
  createdAt: string;
}

export type NewJob = Omit<Job, 'id' | 'createdAt'>;

@Injectable({ providedIn: 'root' })
export class JobsService {
  private readonly http = inject(HttpClient);
  private readonly adminTokenKey = 'systrans-admin-token';

  list() {
    return this.http.get<Job[]>(`${environment.apiBaseUrl}/jobs`);
  }

  isAdmin() {
    return this.http.get<{ authenticated: boolean }>(`${environment.apiBaseUrl}/admin/session`, {
      headers: this.adminHeaders(),
    });
  }

  login(password: string) {
    return this.http.post<{ authenticated: boolean; token: string }>(
      `${environment.apiBaseUrl}/admin/login`,
      { password },
    ).pipe(
      map(({ authenticated, token }) => {
        if (!authenticated || typeof token !== 'string' || !/^\d+\.[a-f\d]{64}$/i.test(token)) {
          throw new Error('The Spring API did not return a valid admin session token. Redeploy the latest backend.');
        }
        return token;
      }),
      tap((token) => sessionStorage.setItem(this.adminTokenKey, token)),
    );
  }

  logout() {
    return this.http.post<{ authenticated: boolean }>(
      `${environment.apiBaseUrl}/admin/logout`,
      {},
      { headers: this.adminHeaders() },
    ).pipe(
      tap(() => sessionStorage.removeItem(this.adminTokenKey)),
    );
  }

  create(job: NewJob) {
    return this.http.post<{ id: number }>(`${environment.apiBaseUrl}/jobs`, job, {
      headers: this.adminHeaders(),
    });
  }

  private adminHeaders(): HttpHeaders {
    const token = sessionStorage.getItem(this.adminTokenKey);
    return token ? new HttpHeaders().set('Authorization', `Bearer ${token}`) : new HttpHeaders();
  }
}
