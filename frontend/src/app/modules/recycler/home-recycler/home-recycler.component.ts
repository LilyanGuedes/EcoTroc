import { CommonModule, Location } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CollectionService } from '../../../services/collection.service';

@Component({
  selector: 'app-home-recycler',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    RouterModule
  ],
  templateUrl: './home-recycler.component.html',
  styleUrl: './home-recycler.component.css',
})
export class HomeRecyclerComponent implements OnInit {
  currentUser$;
  recyclingStats = signal<{ material: string; percentage: number; total: number; color: string }[]>([]);

  botoes = [
    {
      nome: 'Marketplace',
      icone: '../../../../assets/store.svg',
      rota: '/store',
    },
    {
      nome: 'Pontuação',
      icone: '../../../../assets/score.svg',
      rota: '/recycler/points',
    },
    {
      nome: 'Mapa',
      icone: '../../../../assets/map.svg',
      rota: '/mapa',
    },
    {
      nome: 'Relatórios',
      icone: '../../../../assets/report.svg',
      rota: '/report',
    },
  ];

  constructor(
    private authService: AuthService,
    private location: Location,
    private router: Router,
    private collectionService: CollectionService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.loadRecyclingStats();
  }

  loadRecyclingStats(): void {
    this.collectionService.getRecyclingStats().subscribe({
      next: (collections) => {
        const acceptedCollections = collections.filter(c => c.status === 'accepted');

        const materialMap: { [key: string]: { total: number; color: string; label: string } } = {
          'PLASTICO': { total: 0, color: 'bg-blue-500', label: 'Plástico' },
          'PAPEL': { total: 0, color: 'bg-amber-500', label: 'Papel' },
          'VIDRO': { total: 0, color: 'bg-green-500', label: 'Vidro' },
          'METAL': { total: 0, color: 'bg-gray-500', label: 'Metal' }
        };

        acceptedCollections.forEach(collection => {
          if (materialMap[collection.materialType]) {
            materialMap[collection.materialType].total += collection.quantity;
          }
        });

        const totalQuantity = Object.values(materialMap).reduce((sum, mat) => sum + mat.total, 0);

        const stats = Object.entries(materialMap).map(([key, value]) => ({
          material: value.label,
          percentage: totalQuantity > 0 ? Math.round((value.total / totalQuantity) * 100) : 0,
          total: value.total,
          color: value.color
        })).filter(stat => stat.total > 0);

        this.recyclingStats.set(stats);
      },
      error: (error) => {
        console.error('Error loading recycling stats:', error);
      }
    });
  }

  getTotalQuantity(): number {
    return this.recyclingStats().reduce((sum, stat) => sum + stat.total, 0);
  }

  goBack(): void {
    this.location.back();
  }

  logout(): void {
    this.authService.logout();
  }
}
