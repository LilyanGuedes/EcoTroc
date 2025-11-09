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
  selector: 'app-reports',
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
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  currentUser$;
  reportData = signal<any>(null);
  loading = signal<boolean>(true);
  currentDate = new Date();

  constructor(
    private authService: AuthService,
    private location: Location,
    private router: Router,
    private collectionService: CollectionService
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading.set(true);
    this.collectionService.getReports().subscribe({
      next: (data) => {
        this.reportData.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading reports:', error);
        this.loading.set(false);
      }
    });
  }

  getMaterialLabel(type: string): string {
    const labels: { [key: string]: string } = {
      'PLASTICO': 'Plástico',
      'PAPEL': 'Papel',
      'VIDRO': 'Vidro',
      'METAL': 'Metal'
    };
    return labels[type] || type;
  }

  getMaterialPercentage(materialKey: string): number {
    const data = this.reportData();
    if (!data || !data.summary.totalQuantity) return 0;

    const material = data.materialStats[materialKey];
    return Math.round((material.quantity / data.summary.totalQuantity) * 100);
  }

  printReport(): void {
    window.print();
  }

  goBack(): void {
    this.location.back();
  }

  logout(): void {
    this.authService.logout();
  }
}
