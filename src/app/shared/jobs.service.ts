import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
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

  list() {
    return this.http.get<Job[]>(`${environment.apiBaseUrl}/jobs`);
  }

  isAdmin() {
    return this.http.get<{ authenticated: boolean }>(`${environment.apiBaseUrl}/admin/session`, {
      withCredentials: true,
    });
  }

  login(password: string) {
    return this.http.post<{ authenticated: boolean }>(
      `${environment.apiBaseUrl}/admin/login`,
      { password },
      { withCredentials: true },
    );
  }

  logout() {
    return this.http.post<{ authenticated: boolean }>(
      `${environment.apiBaseUrl}/admin/logout`,
      {},
      { withCredentials: true },
    );
  }

  create(job: NewJob) {
    return this.http.post<{ id: number }>(`${environment.apiBaseUrl}/jobs`, job, {
      withCredentials: true,
    });
  }
}
