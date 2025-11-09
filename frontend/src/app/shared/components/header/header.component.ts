import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../services/auth.service';
import { RoleReference } from '../../../entities/enums/role-reference.enum';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  currentUser$;
  RoleReference = RoleReference;

  constructor(
    public authService: AuthService,
    private router: Router,
    private location: Location
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  goBack(): void {
    this.location.back();
  }

  logout(): void {
    this.authService.logout();
  }

  getHomeRoute(): string {
    const role = this.authService.getUserRole();
    if (role === RoleReference.RECYCLER) return '/recycler/home';
    if (role === RoleReference.ECOOPERATOR) return '/operator/home';
    return '/';
  }

  showBackButton(): boolean {
    const currentUrl = this.router.url;
    const homeRoutes = ['/recycler/home', '/operator/home', '/', '/login', '/register'];
    return !homeRoutes.includes(currentUrl);
  }
}
