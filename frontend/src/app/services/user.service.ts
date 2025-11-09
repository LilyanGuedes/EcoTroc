import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RoleReference } from '../entities/enums/role-reference.enum';

export interface User {
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
export class UserService {
  private readonly API_URL = environment.apiUrl || 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Buscar usuários (pode adicionar filtros depois)
   */
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/users`);
  }

  /**
   * Buscar usuário por ID
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/users/${id}`);
  }

  /**
   * Buscar usuários recicladores (filtro no backend se disponível)
   */
  getRecyclers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/users?role=recycler`);
  }
}
