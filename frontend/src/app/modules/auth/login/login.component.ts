import { Component, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgxMaskDirective,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
})
export class LoginComponent {
  hidePassword: boolean = true;
  // private readonly authService = inject(AuthService);

  // private readonly snackbarService = inject(ISnackbarService);

  // private readonly router = inject(Router);

  // private readonly activatedRoute = inject(ActivatedRoute);

  public readonly formGroup = new FormGroup({
    cellphone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  public readonly loading = signal(false);

  async submit() {
    // if (this.formGroup.invalid) {
    //   this.formGroup.markAllAsTouched();
    //   this.snackbarService.open({
    //     type: 'warning',
    //     message: 'Preencha todos os campos obrigatórios',
    //   });
    //   return;
    // }
    // if (this.loading()) return;
    // this.loading.set(true);
    // try {
    //   await this.authService.login({
    //     cellphone: this.formGroup.value.cellphone!,
    //     password: this.formGroup.value.password!,
    //   });
    //   this.snackbarService.open({
    //     type: 'success',
    //     message: 'Login realizado com sucesso!',
    //   });
    //   const backTo = this.activatedRoute.snapshot.queryParams.backTo;
    //   await this.router.navigate([backTo ? decodeURI(backTo) : '/'], {
    //     queryParams: { backTo: undefined },
    //     queryParamsHandling: 'merge',
    //   });
    // } catch (error) {
    //   console.error(error);
    //   const currentValues = { ...this.formGroup.value };
    //   const handler = new FormGroupErrorHandler(this.formGroup);
    //   const handled = handler.handleRequestError(error);
    //   this.formGroup.patchValue(currentValues);
    //   if (!handled) {
    //     this.snackbarService.open({
    //       type: 'error',
    //       message: handler.getErrorMessage(
    //         error,
    //         'Não foi possível realizar o login. Verifique as credenciais e tente novamente.',
    //       ),
    //     });
    //   } else {
    //     this.snackbarService.open({
    //       message: 'Verifique os erros no formulário',
    //       type: 'warning',
    //     });
    //   }
    // } finally {
    //   this.loading.set(false);
    // }
  }
}
