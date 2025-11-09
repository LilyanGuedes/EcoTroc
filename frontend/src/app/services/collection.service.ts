import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Collection {
  id: string;
  userId: string;
  operatorId: string;
  materialType: string;
  quantity: number;
  points: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  respondedAt?: string;
  description?: string;
}

export interface DeclareRecyclingDto {
  userId: string;
  materialType: string;
  quantity: number;
  description?: string;
  operatorId?: string;
}

export interface RespondToCollectionDto {
  accept: boolean;
  reason?: string;
}

export interface DeclareRecyclingResponse {
  message: string;
  collection: Collection;
}

export interface RespondToCollectionResponse {
  message: string;
  collection: Collection;
}

@Injectable({
  providedIn: 'root'
})
export class CollectionService {
  private readonly API_URL = environment.apiUrl || 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  /**
   * Declarar reciclagem (Eco-Operator)
   */
  declareRecycling(data: DeclareRecyclingDto): Observable<DeclareRecyclingResponse> {
    return this.http.post<DeclareRecyclingResponse>(
      `${this.API_URL}/collections/declare`,
      data
    );
  }

  /**
   * Buscar coletas pendentes do usuário logado
   */
  getPendingCollections(): Observable<Collection[]> {
    return this.http.get<Collection[]>(`${this.API_URL}/collections/pending`);
  }

  /**
   * Responder a uma coleta (aceitar/rejeitar)
   */
  respondToCollection(
    collectionId: string,
    data: RespondToCollectionDto
  ): Observable<RespondToCollectionResponse> {
    return this.http.post<RespondToCollectionResponse>(
      `${this.API_URL}/collections/${collectionId}/respond`,
      data
    );
  }

  /**
   * Aceitar coleta
   */
  acceptCollection(collectionId: string): Observable<RespondToCollectionResponse> {
    return this.respondToCollection(collectionId, { accept: true });
  }

  /**
   * Rejeitar coleta
   */
  rejectCollection(
    collectionId: string,
    reason?: string
  ): Observable<RespondToCollectionResponse> {
    return this.respondToCollection(collectionId, { accept: false, reason });
  }

  /**
   * Buscar estatísticas de reciclagem por tipo de material
   */
  getRecyclingStats(): Observable<Collection[]> {
    return this.http.get<Collection[]>(`${this.API_URL}/collections/my-collections`);
  }

  /**
   * Buscar relatórios completos (Eco-Operator)
   */
  getReports(): Observable<any> {
    return this.http.get<any>(`${this.API_URL}/collections/reports`);
  }
}
