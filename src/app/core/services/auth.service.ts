import { Injectable, computed, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { User } from '../models/user.model';

const TOKEN_KEY = 'ibero_access_token';

interface AuthResponse {
  accessToken: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly currentUserSignal = signal<User | null>(null);
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUserSignal() !== null);

  constructor(
    private readonly http: HttpClient,
    private readonly router: Router,
  ) {}

  get token(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  async login(email: string, password: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password }),
    );
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    await this.loadCurrentUser();
  }

  async register(email: string, password: string, fullName: string): Promise<void> {
    const res = await firstValueFrom(
      this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, { email, password, fullName }),
    );
    localStorage.setItem(TOKEN_KEY, res.accessToken);
    await this.loadCurrentUser();
  }

  async loadCurrentUser(): Promise<void> {
    if (!this.token) {
      this.currentUserSignal.set(null);
      return;
    }
    try {
      const user = await firstValueFrom(this.http.get<User>(`${environment.apiUrl}/users/me`));
      this.currentUserSignal.set(user);
    } catch {
      this.logout();
    }
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUserSignal.set(null);
    void this.router.navigate(['/login']);
  }
}
