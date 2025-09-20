import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home-operator',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './home-operator.component.html',
  styleUrl: './home-operator.component.css',
})
export class HomeOperatorComponent {
  botoes = [
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
}
