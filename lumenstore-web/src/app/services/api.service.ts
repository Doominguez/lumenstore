import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { retry, catchError, timeout } from 'rxjs/operators';

export const API_URL = '/api/v1';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  protected apiUrl = API_URL;
  private readonly DEFAULT_TIMEOUT = 30000; // 30s
  private readonly MAX_RETRIES = 1;

  constructor(protected http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${endpoint}`).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      retry({ count: this.MAX_RETRIES, delay: (_error, retryCount) => timer(retryCount * 1000) }),
      catchError((error) => this.handleError(error)),
    );
  }

  post<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${endpoint}`, body).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      catchError((error) => this.handleError(error)),
    );
  }

  put<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}${endpoint}`, body).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      catchError((error) => this.handleError(error)),
    );
  }

  patch<T>(endpoint: string, body: unknown): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}${endpoint}`, body).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      catchError((error) => this.handleError(error)),
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${endpoint}`).pipe(
      timeout(this.DEFAULT_TIMEOUT),
      catchError((error) => this.handleError(error)),
    );
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error('Network error: Please check your connection');
    }
    return throwError(() => error);
  }
}
