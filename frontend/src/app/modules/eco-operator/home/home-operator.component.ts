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
  selector: 'app-home-operator',
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
  templateUrl: './home-operator.component.html',
  styleUrl: './home-operator.component.css',
})
export class HomeOperatorComponent implements OnInit {
  currentUser$;
  declarationStats = signal<{ material: string; percentage: number; total: number; color: string }[]>([]);
  totalDeclarations = signal<number>(0);
  totalQuantity = signal<number>(0);
  pendingCount = signal<number>(0);
  acceptedCount = signal<number>(0);

  botoes = [
    {
      nome: 'Declarar Reciclagem',
      icone:'../../../../assets/recycle-sign.png',
      rota: '/operator/declare',
      cor: 'from-green-500 to-emerald-500'
    },
    {
      nome: 'Coletas Pendentes',
      icone: '../../../../assets/expired.png',
      rota: '/operator/collections',
      cor: 'from-blue-500 to-cyan-500'
    },
    {
      nome: 'Mapa',
      icone:'../../../../assets/location.png',
      rota: '/operator/map',
      cor: 'from-purple-500 to-pink-500'
    },
    {
      nome: 'Relatórios',
      icone: '../../../../assets/statistics.png',
      rota: '/operator/reports',
      cor: 'from-amber-500 to-orange-500'
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
    this.loadDeclarationStats();
  }

  loadDeclarationStats(): void {
    this.collectionService.getRecyclingStats().subscribe({
      next: (collections) => {
        // Total de declarações
        this.totalDeclarations.set(collections.length);

        // Contagem por status
        this.pendingCount.set(collections.filter(c => c.status === 'pending').length);
        this.acceptedCount.set(collections.filter(c => c.status === 'accepted').length);

        const materialMap: { [key: string]: { total: number; color: string; label: string } } = {
          'PLASTICO': { total: 0, color: 'bg-blue-500', label: 'Plástico' },
          'PAPEL': { total: 0, color: 'bg-amber-500', label: 'Papel' },
          'VIDRO': { total: 0, color: 'bg-green-500', label: 'Vidro' },
          'METAL': { total: 0, color: 'bg-gray-500', label: 'Metal' }
        };

        collections.forEach(collection => {
          if (materialMap[collection.materialType]) {
            materialMap[collection.materialType].total += collection.quantity;
          }
        });

        const totalQty = Object.values(materialMap).reduce((sum, mat) => sum + mat.total, 0);
        this.totalQuantity.set(totalQty);

        const stats = Object.entries(materialMap).map(([key, value]) => ({
          material: value.label,
          percentage: totalQty > 0 ? Math.round((value.total / totalQty) * 100) : 0,
          total: value.total,
          color: value.color
        })).filter(stat => stat.total > 0);

        this.declarationStats.set(stats);
      },
      error: (error) => {
        console.error('Error loading declaration stats:', error);
      }
    });
  }

  goBack(): void {
    this.location.back();
  }

  logout(): void {
    this.authService.logout();
  }
}