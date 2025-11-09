import { Component, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { CollectionService } from '../../../services/collection.service';
import { UserService, User } from '../../../services/user.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { startWith, map } from 'rxjs/operators';

interface MaterialOption {
  value: string;
  label: string;
  pointsPerUnit: number;
}

@Component({
  selector: 'app-declare-recycling',
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
    MatSelectModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatMenuModule,
    MatDividerModule,
  ],
  templateUrl: './declare-recycling.component.html',
  styleUrl: './declare-recycling.component.css',
})
export class DeclareRecyclingComponent {
  currentUser$;

  public readonly materials: MaterialOption[] = [
    { value: 'PLASTICO', label: 'Plástico', pointsPerUnit: 10 },
    { value: 'PAPEL', label: 'Papel', pointsPerUnit: 5 },
    { value: 'VIDRO', label: 'Vidro', pointsPerUnit: 8 },
    { value: 'METAL', label: 'Metal', pointsPerUnit: 12 },
  ];

  public recyclers = signal<User[]>([]);
  public filteredRecyclers = signal<User[]>([]);

  public readonly formGroup = new FormGroup({
    userSearch: new FormControl('', { nonNullable: true }),
    userId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    materialType: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    quantity: new FormControl(0, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(0.1)],
    }),
    description: new FormControl('', { nonNullable: true }),
  });

  public readonly loading = signal(false);
  public readonly estimatedPoints = signal(0);

  constructor(
    private collectionService: CollectionService,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {
    this.currentUser$ = this.authService.currentUser$;

    this.formGroup.valueChanges.subscribe(() => {
      this.calculateEstimatedPoints();
    });

    // Carregar recicladores
    this.loadRecyclers();

    // Configurar filtro de autocomplete
    this.formGroup.get('userSearch')?.valueChanges.pipe(
      startWith(''),
      map(value => this._filterRecyclers(value || ''))
    ).subscribe(filtered => this.filteredRecyclers.set(filtered));
  }

  loadRecyclers() {
    this.userService.getUsers().subscribe({
      next: (users) => {
        // Filtrar apenas recicladores
        const recyclers = users.filter(u => u.role === 'recycler');
        this.recyclers.set(recyclers);
        this.filteredRecyclers.set(recyclers);
      },
      error: (error) => {
        console.error('Error loading recyclers:', error);
        this.snackBar.open('Erro ao carregar lista de recicladores', 'OK', {
          duration: 3000
        });
      }
    });
  }

  private _filterRecyclers(value: string): User[] {
    const filterValue = value.toLowerCase();
    return this.recyclers().filter(user =>
      user.name.toLowerCase().includes(filterValue) ||
      user.email.toLowerCase().includes(filterValue)
    );
  }

  onRecyclerSelected(user: User) {
    this.formGroup.patchValue({
      userId: user.id,
      userSearch: `${user.name} (${user.email})`
    });
  }

  displayRecycler(user: User | null): string {
    return user ? `${user.name} (${user.email})` : '';
  }

  calculateEstimatedPoints() {
    const materialType = this.formGroup.get('materialType')?.value;
    const quantity = this.formGroup.get('quantity')?.value || 0;

    const material = this.materials.find(m => m.value === materialType);
    if (material) {
      this.estimatedPoints.set(Math.round(quantity * material.pointsPerUnit));
    } else {
      this.estimatedPoints.set(0);
    }
  }

  async submit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.snackBar.open('Preencha todos os campos obrigatórios', 'OK', {
        duration: 3000,
      });
      return;
    }

    if (this.loading()) return;
    this.loading.set(true);

    const declarationData = {
      userId: this.formGroup.value.userId!,
      materialType: this.formGroup.value.materialType!,
      quantity: this.formGroup.value.quantity!,
      description: this.formGroup.value.description || '',
      operatorId: this.authService.getCurrentUser()?.id,
    };

    this.collectionService.declareRecycling(declarationData).subscribe({
      next: (response) => {
        this.snackBar.open(response.message || 'Reciclagem declarada com sucesso!', 'OK', {
          duration: 3000,
        });
        this.formGroup.reset();
        this.estimatedPoints.set(0);
        this.loading.set(false);
      },
      error: (error) => {
        console.error(error);
        const message =
          error.error?.message ||
          'Erro ao declarar reciclagem. Verifique o ID do usuário.';
        this.snackBar.open(message, 'OK', {
          duration: 3000,
        });
        this.loading.set(false);
      },
    });
  }

  goBack() {
    this.router.navigate(['/operator/home']);
  }

  logout(): void {
    this.authService.logout();
  }
}