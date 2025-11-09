import { Component, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { RoleReference } from '../../../entities/enums/role-reference.enum';

@Component({
  selector: 'app-login',
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
    MatSnackBarModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
})
export class LoginComponent {
  hidePassword: boolean = true;

  public readonly formGroup = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
  });

  public readonly loading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  async submit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.snackBar.open('Preencha todos os campos obrigatórios', 'OK', {
        duration: 3000
      });
      return;
    }

    if (this.loading()) return;
    this.loading.set(true);

    try {
      const loginData = {
        email: this.formGroup.value.email!,
        password: this.formGroup.value.password!,
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.snackBar.open('Login realizado com sucesso!', 'OK', {
            duration: 3000
          });

          // Usar o currentUser$ Observable para garantir que temos o user atualizado
          this.authService.currentUser$.subscribe(user => {
            if (user && user.role) {
              console.log('User role após login:', user.role); // Debug

              if (user.role === RoleReference.ECOOPERATOR) {
                this.router.navigate(['/operator/home']);
              } else if (user.role === RoleReference.RECYCLER) {
                this.router.navigate(['/recycler/home']);
              } else {
                // Fallback caso role não seja reconhecido
                console.warn('Role não reconhecido:', user.role);
                this.router.navigate(['/']);
              }
            }
          }).unsubscribe(); // Unsubscribe imediatamente após pegar o valor
        },
        error: (error) => {
          console.error(error);
          const message = error.error?.message || 'Não foi possível realizar o login. Verifique as credenciais e tente novamente.';
          this.snackBar.open(message, 'OK', {
            duration: 3000
          });
          this.loading.set(false);
        },
        complete: () => {
          this.loading.set(false);
        }
      });
    } catch (error) {
      this.loading.set(false);
      this.snackBar.open('Erro inesperado. Tente novamente.', 'OK', {
        duration: 3000
      });
    }
  }
}
