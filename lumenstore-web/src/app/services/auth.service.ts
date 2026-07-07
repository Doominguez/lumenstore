import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiService } from './api.service';
import { LoginRequest, RegisterRequest, AuthResponse } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ApiService {
  private currentUserSubject = new BehaviorSubject<AuthResponse | null>(null);
  readonly currentUser$ = this.currentUserSubject.asObservable();

  private tokenSubject = new BehaviorSubject<string | null>(null);
  readonly token$ = this.tokenSubject.asObservable();

  constructor(http: HttpClient) {
    super(http);
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const storedUser = localStorage.getItem('currentUser');
      const storedToken = localStorage.getItem('token');

      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser) as AuthResponse;
        this.currentUserSubject.next(user);
        this.tokenSubject.next(storedToken);
      }
    } catch {
      this.clearSession();
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.post<AuthResponse>('/auth/login', credentials).pipe(
      tap((response) => this.handleAuthResponse(response)),
    );
  }

  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.post<AuthResponse>('/auth/register', request).pipe(
      tap((response) => this.handleAuthResponse(response)),
    );
  }

  logout(): void {
    const token = this.getToken();
    this.clearSession();

    // Notify server (best-effort, do not block)
    if (token) {
      this.post('/auth/logout', {}).subscribe({ error: () => {} });
    }
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  getCurrentUser(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  refreshToken(refreshToken: string): Observable<AuthResponse> {
    return this.post<AuthResponse>('/auth/refresh', { refreshToken }).pipe(
      tap((response) => this.handleAuthResponse(response)),
    );
  }

  getLoginHistory(): Observable<any[]> {
    return this.get<any[]>('/auth/login-history');
  }

  private handleAuthResponse(response: AuthResponse): void {
    if (response?.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUser', JSON.stringify(response));
      this.tokenSubject.next(response.token);
      this.currentUserSubject.next(response);
    }
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.tokenSubject.next(null);
    this.currentUserSubject.next(null);
  }
}
