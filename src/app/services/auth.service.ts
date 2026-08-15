import { Service, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

export interface TmsUser {
  displayName: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

@Service()
export class AuthService {
  private http = inject(HttpClient);

  currentUser = signal<TmsUser | null>(null);
  isAuthenticated = computed(() => this.currentUser() !== null);

  hasRole(role: string): boolean {
    const user = this.currentUser();
    return user?.role === role || user?.role === 'Admin';
  }

  async login(credentials: LoginRequest): Promise<void> {
    await firstValueFrom(
      this.http.post<void>(`${environment.apiUrl}/auth/login`, credentials)
    );

    const user = await firstValueFrom(
      this.http.get<TmsUser>(`${environment.apiUrl}/auth/me`)
    );

    this.currentUser.set(user);
  }

  async logout(): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post<void>(`${environment.apiUrl}/auth/logout`, {})
      );
    } finally {
      this.currentUser.set(null);
    }
  }

  async checkSession(): Promise<void> {
    try {
      const user = await firstValueFrom(
        this.http.get<TmsUser>(`${environment.apiUrl}/auth/me`)
      );
      this.currentUser.set(user);
    } catch {
      this.currentUser.set(null);
    }
  }
}
