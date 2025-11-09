import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { CollectionService, Collection } from '../../../services/collection.service';
import { PointsService } from '../../../services/points.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-points',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatMenuModule,
    MatSnackBarModule,
  ],
  templateUrl: './points.component.html',
  styleUrl: './points.component.css'
})
export class PointsComponent implements OnInit {
  pendingCollections = signal<Collection[]>([]);
  totalPoints = signal<number>(0);
  pendingPoints = signal<number>(0);
  loading = signal(false);
  currentUser$;

  constructor(
    private collectionService: CollectionService,
    private pointsService: PointsService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.loadPendingCollections();
    this.loadTotalPoints();
  }

  loadPendingCollections() {
    this.loading.set(true);
    this.collectionService.getPendingCollections().subscribe({
      next: (collections) => {
        this.pendingCollections.set(collections);
        this.pendingPoints.set(
          collections.reduce((sum, c) => sum + c.points, 0)
        );
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading pending collections:', error);
        this.snackBar.open('Erro ao carregar coletas pendentes', 'OK', {
          duration: 3000
        });
        this.loading.set(false);
      }
    });
  }

  loadTotalPoints() {
    const userId = this.authService.getCurrentUser()?.id;
    if (!userId) {
      console.error('User ID not found');
      return;
    }

    this.pointsService.getTotalPoints(userId).subscribe({
      next: (response) => {
        this.totalPoints.set(response.total);
      },
      error: (error) => {
        console.error('Error loading total points:', error);
        this.snackBar.open('Erro ao carregar pontos totais', 'OK', {
          duration: 3000
        });
      }
    });
  }

  respondToCollection(collection: Collection, accept: boolean) {
    this.loading.set(true);
    this.collectionService.respondToCollection(collection.id, { accept }).subscribe({
      next: (response) => {
        this.snackBar.open(response.message, 'OK', {
          duration: 3000
        });
        this.loadPendingCollections();
        if (accept) {
          this.loadTotalPoints();
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error responding to collection:', error);
        this.snackBar.open('Erro ao responder coleta', 'OK', {
          duration: 3000
        });
        this.loading.set(false);
      }
    });
  }

  getMaterialIcon(materialType: string): string {
    const icons: { [key: string]: string } = {
      'PLASTICO': 'recycling',
      'PAPEL': 'description',
      'VIDRO': 'wine_bar',
      'METAL': 'build'
    };
    return icons[materialType] || 'help';
  }

  getMaterialLabel(materialType: string): string {
    const labels: { [key: string]: string } = {
      'PLASTICO': 'Plástico',
      'PAPEL': 'Papel',
      'VIDRO': 'Vidro',
      'METAL': 'Metal'
    };
    return labels[materialType] || materialType;
  }

  logout(): void {
    this.authService.logout();
  }
}