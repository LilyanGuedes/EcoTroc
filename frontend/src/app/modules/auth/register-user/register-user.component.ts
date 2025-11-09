import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { RoleReference } from '../../../entities/enums/role-reference.enum';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register-user',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCardModule,
    MatSnackBarModule,
    MatIconModule
  ],
  templateUrl: './register-user.component.html',
  styleUrl: './register-user.component.css',
  standalone: true,
})
export class RegisterUserComponent implements OnInit {
  registerForm!: FormGroup;
  hidePassword = true;
  hideConfirmPassword = true;
  roles = [
    { value: RoleReference.RECYCLER, label: 'Reciclador' },
    { value: RoleReference.ECOOPERATOR, label: 'Operador de Ecoponto' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      role: [RoleReference.RECYCLER, Validators.required],
      ecopointId: ['']
    }, { validators: this.passwordMatchValidator });

    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      const ecopointIdControl = this.registerForm.get('ecopointId');
      if (role === RoleReference.ECOOPERATOR) {
        ecopointIdControl?.setValidators([Validators.required]);
      } else {
        ecopointIdControl?.clearValidators();
      }
      ecopointIdControl?.updateValueAndValidity();
    });
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ passwordMismatch: true });
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...registerData } = this.registerForm.value;

      this.authService.register(registerData).subscribe({
        next: (response) => {
          this.snackBar.open('Cadastro realizado com sucesso! Faça login para continuar.', 'OK', {
            duration: 3000
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          const message = error.error?.message || 'Erro ao realizar cadastro. Tente novamente.';
          this.snackBar.open(message, 'OK', {
            duration: 3000
          });
        }
      });
    }
  }

  isEcoOperator(): boolean {
    return this.registerForm.get('role')?.value === RoleReference.ECOOPERATOR;
  }
}
