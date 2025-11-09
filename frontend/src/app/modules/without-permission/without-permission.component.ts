import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { RoleReference } from '../../entities/enums/role-reference.enum';

@Component({
  selector: 'app-without-permission',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './without-permission.component.html',
  styleUrl: './without-permission.component.css'
})
export class WithoutPermissionComponent implements OnInit {
  homeRoute: string = '/';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Determinar a rota home correta baseada no role do usuário
    const userRole = this.authService.getUserRole();

    if (userRole === RoleReference.ECOOPERATOR) {
      this.homeRoute = '/operator/home';
    } else if (userRole === RoleReference.RECYCLER) {
      this.homeRoute = '/recycler/home';
    }
  }

  goToHome(): void {
    this.router.navigate([this.homeRoute]);
  }
}
