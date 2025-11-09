import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { RoleReference } from '../entities/enums/role-reference.enum';
import { environment } from '../../environments/environment';

interface RegisterDto {
  name: string;
  email: string;
  password: string;
  role: RoleReference;
  ecopointId?: string;
}

interface LoginDto {
  email: string;
  password: string;
}

interface AuthResponse {
  accessToken: string;
}

interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: RoleReference;
  ecopointId?: string;
  pointsBalance?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = environment.apiUrl || 'http://localhost:3000';
  private currentUserSubject = new BehaviorSubject<UserResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const token = localStorage.getItem('token');
    if (token) {
      const user = localStorage.getItem('user');
      if (user) {
        this.currentUserSubject.next(JSON.parse(user));
      }
    }
  }

  register(data: RegisterDto): Observable<UserResponse> {
    return this.http.post<UserResponse>(`${this.API_URL}/users/register`, data);
  }

  login(data: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, data)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.accessToken);
          this.decodeAndStoreUser(response.accessToken);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): UserResponse | null {
    return this.currentUserSubject.value;
  }

  getUserRole(): RoleReference | null {
    const user = this.getCurrentUser();
    return user?.role || null;
  }

  private decodeAndStoreUser(token: string): void {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const user: UserResponse = {
        id: payload.sub,
        email: payload.email,
        name: payload.name || payload.email,
        role: payload.role
      };
      localStorage.setItem('user', JSON.stringify(user));
      this.currentUserSubject.next(user);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
}