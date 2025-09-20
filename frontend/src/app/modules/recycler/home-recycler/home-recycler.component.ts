import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-home-recycler',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './home-recycler.component.html',
  styleUrl: './home-recycler.component.css',
})
export class HomeRecyclerComponent {
  botoes = [
    {
      nome: 'Marketplace',
      icone: '../../../../assets/store.svg',
      rota: '/store',
    },
    {
      nome: 'Pontuação',
      icone: '../../../../assets/score.svg',
      rota: '/score',
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
}
