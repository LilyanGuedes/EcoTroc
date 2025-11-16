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

  dicas = [
    {
      titulo: 'Separe corretamente!',
      descricao: 'Lave e seque embalagens antes de descartar. Isso facilita a reciclagem e evita contaminação.',
      imagem: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=400&h=300&fit=crop'
    },
    {
      titulo: 'Plástico reciclável',
      descricao: 'Nem todo plástico é reciclável. Verifique o símbolo de reciclagem e separe corretamente.',
      imagem: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?w=400&h=300&fit=crop'
    },
    {
      titulo: 'Papel e papelão',
      descricao: 'Mantenha o papel seco e limpo. Papéis engordurados ou molhados não são recicláveis.',
      imagem: 'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=400&h=300&fit=crop'
    },
    {
      titulo: 'Vidro reutilizável',
      descricao: 'O vidro pode ser reciclado infinitas vezes sem perder qualidade. Separe por cor quando possível.',
      imagem: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&h=300&fit=crop'
    },
    {
      titulo: 'Metal vale pontos!',
      descricao: 'Latas de alumínio e outros metais são altamente valorizados na reciclagem. Amasse para economizar espaço.',
      imagem: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=400&h=300&fit=crop'
    }
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
