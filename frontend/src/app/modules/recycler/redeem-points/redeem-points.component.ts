import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { PointsService } from '../../../services/points.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-redeem-points',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
  templateUrl: './redeem-points.component.html',
  styleUrl: './redeem-points.component.css'
})
export class RedeemPointsComponent implements OnInit {
  currentUser$;
  totalPoints = signal(0);
  loading = signal(false);

  formGroup = new FormGroup({
    points: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    })
  });

  constructor(
    private http: HttpClient,
    private pointsService: PointsService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit() {
    this.loadTotalPoints();
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

  submit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.snackBar.open('Preencha todos os campos corretamente', 'OK', {
        duration: 3000
      });
      return;
    }

    const pointsToRedeem = this.formGroup.value.points!;

    if (pointsToRedeem > this.totalPoints()) {
      this.snackBar.open('Pontos insuficientes!', 'OK', {
        duration: 3000
      });
      return;
    }

    this.loading.set(true);

    const apiUrl = environment.apiUrl || 'http://localhost:3000';

    this.http.post(`${apiUrl}/users/redeem-points`, {
      points: pointsToRedeem,
      description: this.formGroup.value.description!
    }).subscribe({
      next: (response: any) => {
        this.snackBar.open(response.message || 'Pontos resgatados com sucesso!', 'OK', {
          duration: 3000
        });
        this.formGroup.reset();
        this.loadTotalPoints();
        this.loading.set(false);

        // Voltar para home após 2 segundos
        setTimeout(() => {
          this.router.navigate(['/recycler/home']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error redeeming points:', error);
        const message = error.error?.message || 'Erro ao resgatar pontos';
        this.snackBar.open(message, 'OK', {
          duration: 3000
        });
        this.loading.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/recycler/home']);
  }

  logout() {
    this.authService.logout();
  }
}
