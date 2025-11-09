import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface UserPointsTransaction {
  id: string;
  userId: string;
  collectionId: string | null;
  points: number;
  transactionType: 'COLLECTION' | 'REDEMPTION' | 'BONUS';
  description: string;
  createdAt: string;
}

export interface TotalPointsResponse {
  userId: string;
  total: number;
}

@Injectable({
  providedIn: 'root'
})
export class PointsService {
  private readonly API_URL = environment.apiUrl || 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Buscar total de pontos do usuário
   */
  getTotalPoints(userId: string): Observable<TotalPointsResponse> {
    return this.http.get<TotalPointsResponse>(
      `${this.API_URL}/points/total/${userId}`
    );
  }

  /**
   * Buscar histórico de transações de pontos
   */
  getPointsHistory(userId: string): Observable<UserPointsTransaction[]> {
    return this.http.get<UserPointsTransaction[]>(
      `${this.API_URL}/points/history/${userId}`
    );
  }
}
