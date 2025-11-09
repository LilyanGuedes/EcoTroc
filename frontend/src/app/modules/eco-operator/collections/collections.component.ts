import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { CollectionService, Collection } from '../../../services/collection.service';

@Component({
  selector: 'app-operator-collections',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatSnackBarModule,
  ],
  templateUrl: './collections.component.html',
  styleUrl: './collections.component.css'
})
export class OperatorCollectionsComponent implements OnInit {
  collections = signal<Collection[]>([]);
  loading = signal(false);

  constructor(
    private collectionService: CollectionService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCollections();
  }

  loadCollections() {
    this.loading.set(true);
    this.collectionService.getPendingCollections().subscribe({
      next: (collections) => {
        this.collections.set(collections);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading collections:', error);
        this.snackBar.open('Erro ao carregar coletas', 'OK', {
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

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'pending': 'warn',
      'accepted': 'accent',
      'rejected': 'primary'
    };
    return colors[status] || 'primary';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pendente',
      'accepted': 'Aceita',
      'rejected': 'Rejeitada'
    };
    return labels[status] || status;
  }

  goBack() {
    this.router.navigate(['/operator/home']);
  }

  declareNew() {
    this.router.navigate(['/operator/declare']);
  }
}
