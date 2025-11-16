# 📋 Documentação de Testes - EcoTroc

## Sumário
1. [Visão Geral](#visão-geral)
2. [Estrutura de Testes](#estrutura-de-testes)
3. [Testes Backend](#testes-backend)
4. [Testes Frontend](#testes-frontend)
5. [Executando os Testes](#executando-os-testes)
6. [Cobertura de Código](#cobertura-de-código)
7. [Boas Práticas](#boas-práticas)

---

## Visão Geral

O projeto EcoTroc implementa uma estratégia abrangente de testes para garantir a qualidade e confiabilidade do sistema. A suite de testes cobre tanto o backend (NestJS) quanto o frontend (Angular), utilizando frameworks e ferramentas modernas.

### Tipos de Testes Implementados

- **Testes Unitários**: Validam componentes isolados
- **Testes de Integração**: Verificam interações entre módulos
- **Testes E2E (End-to-End)**: Simulam fluxos completos de usuário
- **Testes de Domínio**: Validam regras de negócio e invariantes

### Frameworks e Ferramentas

**Backend:**
- **Jest** - Framework principal de testes
- **Supertest** - Testes HTTP/API
- **@nestjs/testing** - Utilitários de teste do NestJS

**Frontend:**
- **Jasmine** - Framework de testes
- **Karma** - Test runner
- **Angular Testing Utilities** - Ferramentas nativas do Angular

---

## Estrutura de Testes

### Backend (`/backend`)

```
backend/
├── src/
│   ├── modules/
│   │   ├── user/
│   │   │   ├── domain/
│   │   │   │   └── entities/
│   │   │   │       └── user.entity.spec.ts      # Testes do Aggregate User
│   │   │   ├── application/
│   │   │   │   └── use-cases/
│   │   │   │       └── *.use-case.spec.ts        # Testes de casos de uso
│   │   │   └── infrastructure/
│   │   │       └── repositories/
│   │   │           └── *.repository.spec.ts      # Testes de repositórios
│   │   ├── collection/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── collection.entity.spec.ts # Testes do Aggregate Collection
│   │   │   │   └── services/
│   │   │   │       └── *.domain-service.spec.ts  # Testes de Domain Services
│   │   │   └── application/
│   │   │       └── event-handlers/
│   │   │           └── *.handler.spec.ts         # Testes de Event Handlers
│   │   └── auth/
│   │       └── application/
│   │           └── *.spec.ts                      # Testes de autenticação
│   └── shared/
│       └── domain/
│           └── domain-event-publisher.spec.ts     # Testes de infraestrutura
└── test/
    ├── app.e2e-spec.ts                            # Testes E2E principais
    ├── user.e2e-spec.ts                           # Testes E2E de usuário
    ├── collection.e2e-spec.ts                     # Testes E2E de coletas
    └── jest-e2e.json                              # Configuração Jest E2E
```

### Frontend (`/frontend`)

```
frontend/
└── src/
    └── app/
        ├── modules/
        │   ├── auth/
        │   │   ├── components/
        │   │   │   └── *.component.spec.ts        # Testes de componentes
        │   │   └── services/
        │   │       └── *.service.spec.ts          # Testes de serviços
        │   ├── recycler/
        │   │   └── pages/
        │   │       └── *.component.spec.ts
        │   └── eco-operator/
        │       └── pages/
        │           └── *.component.spec.ts
        ├── services/
        │   ├── auth.service.spec.ts               # Testes de serviços globais
        │   ├── collection.service.spec.ts
        │   └── user.service.spec.ts
        ├── guards/
        │   └── auth.guard.spec.ts                 # Testes de guards
        └── interceptors/
            └── auth.interceptor.spec.ts           # Testes de interceptadores
```

---

## Testes Backend

### 1. Testes Unitários de Domain

#### Testes de Aggregates

Os Aggregates são o coração do domínio e possuem testes extensivos para validar regras de negócio.

**Exemplo: `user.entity.spec.ts`**

```typescript
import { User } from './user.entity';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';
import { Points } from '../value-objects/points.vo';
import { UserType } from '../enums/user-type.enum';

describe('User Aggregate', () => {
  describe('Criação de Usuário', () => {
    it('deve criar um usuário reciclador válido', () => {
      const user = User.create({
        name: 'João Silva',
        email: Email.create('joao@example.com'),
        password: Password.create('senha123'),
        userType: UserType.RECYCLER,
      });

      expect(user).toBeDefined();
      expect(user.name).toBe('João Silva');
      expect(user.userType).toBe(UserType.RECYCLER);
      expect(user.pointsBalance.value).toBe(0);
    });

    it('deve emitir UserRegisteredEvent ao criar usuário', () => {
      const user = User.create({...});
      const events = user.getDomainEvents();
      
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(UserRegisteredEvent);
    });
  });

  describe('Gerenciamento de Pontos', () => {
    it('deve adicionar pontos corretamente', () => {
      const user = User.create({...});
      
      user.addPointsFromCollection('collection-1', 100);
      
      expect(user.pointsBalance.value).toBe(100);
    });

    it('deve emitir PointsAddedEvent ao adicionar pontos', () => {
      const user = User.create({...});
      user.clearDomainEvents(); // Limpa evento de criação
      
      user.addPointsFromCollection('collection-1', 100);
      const events = user.getDomainEvents();
      
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(PointsAddedEvent);
      expect(events[0].points).toBe(100);
    });

    it('deve resgatar pontos corretamente', () => {
      const user = User.create({...});
      user.addPointsFromCollection('collection-1', 100);
      
      user.redeemPoints(50, 'Troca por produto');
      
      expect(user.pointsBalance.value).toBe(50);
    });

    it('não deve permitir resgate com saldo insuficiente', () => {
      const user = User.create({...});
      user.addPointsFromCollection('collection-1', 100);
      
      expect(() => {
        user.redeemPoints(150, 'Tentativa inválida');
      }).toThrow('Saldo insuficiente');
    });

    it('não deve permitir adicionar pontos negativos', () => {
      const user = User.create({...});
      
      expect(() => {
        user.addPointsFromCollection('collection-1', -50);
      }).toThrow('Pontos devem ser positivos');
    });
  });

  describe('Validações de Tipo de Usuário', () => {
    it('deve identificar corretamente usuário reciclador', () => {
      const user = User.create({
        userType: UserType.RECYCLER,
        // ...
      });
      
      expect(user.isRecycler()).toBe(true);
      expect(user.isEcoOperator()).toBe(false);
    });

    it('deve identificar corretamente operador eco', () => {
      const user = User.create({
        userType: UserType.ECO_OPERATOR,
        // ...
      });
      
      expect(user.isEcoOperator()).toBe(true);
      expect(user.isRecycler()).toBe(false);
    });
  });
});
```

**Exemplo: `collection.entity.spec.ts`**

```typescript
import { Collection } from './collection.entity';
import { MaterialType } from '../value-objects/material-type.vo';
import { Quantity } from '../value-objects/quantity.vo';
import { CollectionStatus } from '../enums/collection-status.enum';

describe('Collection Aggregate', () => {
  describe('Criação de Coleta', () => {
    it('deve criar uma coleta válida', () => {
      const collection = Collection.create({
        userId: 'user-1',
        materialType: MaterialType.PLASTIC,
        quantity: Quantity.create(10),
        description: 'Garrafas PET',
      });

      expect(collection).toBeDefined();
      expect(collection.status).toBe(CollectionStatus.PENDING);
      expect(collection.points).toBe(50); // 10 * 5 pontos
    });

    it('deve calcular pontos corretamente baseado no material', () => {
      const plasticCollection = Collection.create({
        materialType: MaterialType.PLASTIC,
        quantity: Quantity.create(10),
        // ...
      });

      const paperCollection = Collection.create({
        materialType: MaterialType.PAPER,
        quantity: Quantity.create(10),
        // ...
      });

      expect(plasticCollection.points).toBe(50);  // 10 * 5
      expect(paperCollection.points).toBe(30);     // 10 * 3
    });
  });

  describe('Aceitação de Coleta', () => {
    it('deve aceitar coleta corretamente', () => {
      const collection = Collection.create({...});
      
      collection.acceptBy('eco-operator-1');
      
      expect(collection.status).toBe(CollectionStatus.ACCEPTED);
      expect(collection.respondedAt).toBeDefined();
    });

    it('deve emitir CollectionAcceptedEvent', () => {
      const collection = Collection.create({...});
      collection.clearDomainEvents();
      
      collection.acceptBy('eco-operator-1');
      const events = collection.getDomainEvents();
      
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CollectionAcceptedEvent);
    });

    it('não deve permitir aceitar coleta já respondida', () => {
      const collection = Collection.create({...});
      collection.acceptBy('eco-operator-1');
      
      expect(() => {
        collection.acceptBy('eco-operator-1');
      }).toThrow('Coleta já foi respondida');
    });
  });

  describe('Rejeição de Coleta', () => {
    it('deve rejeitar coleta com motivo', () => {
      const collection = Collection.create({...});
      
      collection.rejectBy('eco-operator-1', 'Material inadequado');
      
      expect(collection.status).toBe(CollectionStatus.REJECTED);
      expect(collection.rejectionReason).toBe('Material inadequado');
    });

    it('deve emitir CollectionRejectedEvent', () => {
      const collection = Collection.create({...});
      collection.clearDomainEvents();
      
      collection.rejectBy('eco-operator-1', 'Material inadequado');
      const events = collection.getDomainEvents();
      
      expect(events).toHaveLength(1);
      expect(events[0]).toBeInstanceOf(CollectionRejectedEvent);
      expect(events[0].reason).toBe('Material inadequado');
    });
  });
});
```

#### Testes de Value Objects

**Exemplo: `email.vo.spec.ts`**

```typescript
import { Email } from './email.vo';

describe('Email Value Object', () => {
  it('deve criar email válido', () => {
    const email = Email.create('teste@example.com');
    
    expect(email.value).toBe('teste@example.com');
  });

  it('deve rejeitar email inválido', () => {
    expect(() => Email.create('email-invalido'))
      .toThrow('Email inválido');
  });

  it('deve ser imutável', () => {
    const email = Email.create('teste@example.com');
    
    expect(() => {
      (email as any).value = 'outro@example.com';
    }).toThrow();
  });

  it('deve comparar igualdade corretamente', () => {
    const email1 = Email.create('teste@example.com');
    const email2 = Email.create('teste@example.com');
    const email3 = Email.create('outro@example.com');
    
    expect(email1.equals(email2)).toBe(true);
    expect(email1.equals(email3)).toBe(false);
  });
});
```

**Exemplo: `points.vo.spec.ts`**

```typescript
import { Points } from './points.vo';

describe('Points Value Object', () => {
  it('deve criar pontos válidos', () => {
    const points = Points.create(100);
    expect(points.value).toBe(100);
  });

  it('não deve aceitar pontos negativos', () => {
    expect(() => Points.create(-10))
      .toThrow('Pontos não podem ser negativos');
  });

  it('deve adicionar pontos corretamente', () => {
    const points1 = Points.create(50);
    const points2 = Points.create(30);
    
    const result = points1.add(points2);
    
    expect(result.value).toBe(80);
  });

  it('deve subtrair pontos corretamente', () => {
    const points1 = Points.create(50);
    const points2 = Points.create(30);
    
    const result = points1.subtract(points2);
    
    expect(result.value).toBe(20);
  });

  it('não deve permitir subtração resultando em negativo', () => {
    const points1 = Points.create(20);
    const points2 = Points.create(30);
    
    expect(() => points1.subtract(points2))
      .toThrow('Resultado não pode ser negativo');
  });
});
```

### 2. Testes de Domain Services

**Exemplo: `collection.domain-service.spec.ts`**

```typescript
import { CollectionDomainService } from './collection.domain-service';
import { Collection } from '../entities/collection.entity';
import { User } from '../../user/domain/entities/user.entity';

describe('CollectionDomainService', () => {
  let service: CollectionDomainService;

  beforeEach(() => {
    service = new CollectionDomainService();
  });

  describe('processCollectionResponse', () => {
    it('deve processar aceitação de coleta corretamente', () => {
      const collection = Collection.create({...});
      const ecoOperator = User.create({
        userType: UserType.ECO_OPERATOR,
        // ...
      });

      service.processCollectionResponse(
        collection,
        ecoOperator,
        true,  // accept
        null
      );

      expect(collection.status).toBe(CollectionStatus.ACCEPTED);
      expect(ecoOperator.pointsBalance.value).toBe(collection.points);
    });

    it('deve processar rejeição de coleta corretamente', () => {
      const collection = Collection.create({...});
      const ecoOperator = User.create({
        userType: UserType.ECO_OPERATOR,
        // ...
      });

      service.processCollectionResponse(
        collection,
        ecoOperator,
        false,  // reject
        'Material inadequado'
      );

      expect(collection.status).toBe(CollectionStatus.REJECTED);
      expect(collection.rejectionReason).toBe('Material inadequado');
      expect(ecoOperator.pointsBalance.value).toBe(0);
    });

    it('não deve permitir reciclador responder coleta', () => {
      const collection = Collection.create({...});
      const recycler = User.create({
        userType: UserType.RECYCLER,
        // ...
      });

      expect(() => {
        service.processCollectionResponse(collection, recycler, true, null);
      }).toThrow('Apenas operadores eco podem responder coletas');
    });
  });
});
```

### 3. Testes de Use Cases

**Exemplo: `respond-to-collection.use-case.spec.ts`**

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { RespondToCollectionUseCase } from './respond-to-collection.use-case';
import { CollectionRepository } from '../../infrastructure/repositories/collection.repository';
import { UserRepository } from '../../../user/infrastructure/repositories/user.repository';
import { UnitOfWork } from '../../../../shared/infrastructure/unit-of-work';

describe('RespondToCollectionUseCase', () => {
  let useCase: RespondToCollectionUseCase;
  let collectionRepo: jest.Mocked<CollectionRepository>;
  let userRepo: jest.Mocked<UserRepository>;
  let unitOfWork: jest.Mocked<UnitOfWork>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RespondToCollectionUseCase,
        {
          provide: CollectionRepository,
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: UnitOfWork,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    useCase = module.get(RespondToCollectionUseCase);
    collectionRepo = module.get(CollectionRepository);
    userRepo = module.get(UserRepository);
    unitOfWork = module.get(UnitOfWork);
  });

  it('deve aceitar coleta com sucesso', async () => {
    const collection = Collection.create({...});
    const ecoOperator = User.create({
      userType: UserType.ECO_OPERATOR,
      // ...
    });

    collectionRepo.findById.mockResolvedValue(collection);
    userRepo.findById.mockResolvedValue(ecoOperator);
    unitOfWork.execute.mockImplementation(async (callback) => {
      return callback({ save: jest.fn() });
    });

    const result = await useCase.execute({
      collectionId: 'collection-1',
      userId: 'eco-operator-1',
      accept: true,
      reason: null,
    });

    expect(result.success).toBe(true);
    expect(unitOfWork.execute).toHaveBeenCalled();
  });

  it('deve lançar erro se coleta não for encontrada', async () => {
    collectionRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute({
        collectionId: 'invalid-id',
        userId: 'user-1',
        accept: true,
        reason: null,
      })
    ).rejects.toThrow('Coleta não encontrada');
  });
});
```

### 4. Testes E2E (End-to-End)

**Exemplo: `collection.e2e-spec.ts`**

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Collection E2E', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Criar usuário e fazer login
    const registerResponse = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        userType: 'ECO_OPERATOR',
      });

    userId = registerResponse.body.id;

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    authToken = loginResponse.body.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /collections', () => {
    it('deve criar uma coleta', async () => {
      const response = await request(app.getHttpServer())
        .post('/collections')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          materialType: 'PLASTIC',
          quantity: 10,
          description: 'Garrafas PET',
        })
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.status).toBe('PENDING');
      expect(response.body.points).toBe(50);
    });

    it('não deve criar coleta sem autenticação', async () => {
      await request(app.getHttpServer())
        .post('/collections')
        .send({
          materialType: 'PLASTIC',
          quantity: 10,
          description: 'Garrafas PET',
        })
        .expect(401);
    });
  });

  describe('POST /collections/:id/respond', () => {
    let collectionId: string;

    beforeEach(async () => {
      // Criar uma coleta para teste
      const response = await request(app.getHttpServer())
        .post('/collections')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          materialType: 'PLASTIC',
          quantity: 10,
          description: 'Test',
        });

      collectionId = response.body.id;
    });

    it('deve aceitar uma coleta', async () => {
      const response = await request(app.getHttpServer())
        .post(`/collections/${collectionId}/respond`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          accept: true,
        })
        .expect(200);

      expect(response.body.status).toBe('ACCEPTED');
    });

    it('deve rejeitar uma coleta com motivo', async () => {
      const response = await request(app.getHttpServer())
        .post(`/collections/${collectionId}/respond`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          accept: false,
          reason: 'Material inadequado',
        })
        .expect(200);

      expect(response.body.status).toBe('REJECTED');
      expect(response.body.rejectionReason).toBe('Material inadequado');
    });
  });

  describe('GET /collections', () => {
    it('deve listar coletas do usuário', async () => {
      const response = await request(app.getHttpServer())
        .get('/collections')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
```

---

## Testes Frontend

### 1. Testes de Componentes

**Exemplo: `login.component.spec.ts`**

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve inicializar formulário com campos vazios', () => {
    expect(component.loginForm.value).toEqual({
      email: '',
      password: '',
    });
  });

  it('deve validar email obrigatório', () => {
    const emailControl = component.loginForm.get('email');
    
    emailControl?.setValue('');
    expect(emailControl?.hasError('required')).toBe(true);
    
    emailControl?.setValue('teste@example.com');
    expect(emailControl?.hasError('required')).toBe(false);
  });

  it('deve validar formato de email', () => {
    const emailControl = component.loginForm.get('email');
    
    emailControl?.setValue('email-invalido');
    expect(emailControl?.hasError('email')).toBe(true);
    
    emailControl?.setValue('valido@example.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('deve fazer login com sucesso', () => {
    const mockResponse = {
      accessToken: 'token-123',
      user: { id: '1', name: 'Teste' },
    };
    
    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.patchValue({
      email: 'teste@example.com',
      password: 'senha123',
    });

    component.onSubmit();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'teste@example.com',
      password: 'senha123',
    });
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('deve exibir erro ao falhar login', () => {
    authService.login.and.returnValue(
      throwError(() => new Error('Credenciais inválidas'))
    );

    component.loginForm.patchValue({
      email: 'teste@example.com',
      password: 'senha-errada',
    });

    component.onSubmit();

    expect(component.errorMessage).toBe('Credenciais inválidas');
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('não deve submeter formulário inválido', () => {
    component.loginForm.patchValue({
      email: '',
      password: '',
    });

    component.onSubmit();

    expect(authService.login).not.toHaveBeenCalled();
  });
});
```

### 2. Testes de Serviços

**Exemplo: `collection.service.spec.ts`**

```typescript
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CollectionService } from './collection.service';
import { environment } from '../../environments/environment';

describe('CollectionService', () => {
  let service: CollectionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CollectionService],
    });

    service = TestBed.inject(CollectionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('deve criar uma coleta', () => {
    const mockCollection = {
      id: '1',
      materialType: 'PLASTIC',
      quantity: 10,
      status: 'PENDING',
    };

    const collectionData = {
      materialType: 'PLASTIC',
      quantity: 10,
      description: 'Teste',
    };

    service.createCollection(collectionData).subscribe((collection) => {
      expect(collection).toEqual(mockCollection);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/collections`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(collectionData);
    req.flush(mockCollection);
  });

  it('deve listar coletas do usuário', () => {
    const mockCollections = [
      { id: '1', materialType: 'PLASTIC', quantity: 10 },
      { id: '2', materialType: 'PAPER', quantity: 5 },
    ];

    service.getMyCollections().subscribe((collections) => {
      expect(collections.length).toBe(2);
      expect(collections).toEqual(mockCollections);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/collections/my`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCollections);
  });

  it('deve aceitar uma coleta', () => {
    const collectionId = 'collection-123';
    const mockResponse = { status: 'ACCEPTED' };

    service.acceptCollection(collectionId).subscribe((response) => {
      expect(response.status).toBe('ACCEPTED');
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/collections/${collectionId}/respond`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ accept: true });
    req.flush(mockResponse);
  });

  it('deve rejeitar uma coleta', () => {
    const collectionId = 'collection-123';
    const reason = 'Material inadequado';
    const mockResponse = { status: 'REJECTED', rejectionReason: reason };

    service.rejectCollection(collectionId, reason).subscribe((response) => {
      expect(response.status).toBe('REJECTED');
      expect(response.rejectionReason).toBe(reason);
    });

    const req = httpMock.expectOne(
      `${environment.apiUrl}/collections/${collectionId}/respond`
    );
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ accept: false, reason });
    req.flush(mockResponse);
  });
});
```

### 3. Testes de Guards

**Exemplo: `auth.guard.spec.ts`**

```typescript
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('deve permitir acesso se autenticado', () => {
    authService.isAuthenticated.and.returnValue(true);

    const result = guard.canActivate();

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('deve redirecionar para login se não autenticado', () => {
    authService.isAuthenticated.and.returnValue(false);

    const result = guard.canActivate();

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
  });
});
```

---

## Executando os Testes

### Backend

**Testes Unitários:**
```bash
cd backend
npm run test
```

**Testes com Watch Mode:**
```bash
npm run test:watch
```

**Testes E2E:**
```bash
npm run test:e2e
```

**Cobertura de Código:**
```bash
npm run test:cov
```

**Teste Específico:**
```bash
npm test -- user.entity.spec.ts
```

### Frontend

**Testes Unitários:**
```bash
cd frontend
ng test
```

**Testes com Cobertura:**
```bash
ng test --code-coverage
```

**Teste Único (sem watch):**
```bash
ng test --watch=false
```

**Teste Específico:**
```bash
ng test --include='**/login.component.spec.ts'
```

---

## Cobertura de Código

### Métricas Esperadas

O projeto mantém as seguintes metas de cobertura:

**Backend:**
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

**Frontend:**
- **Statements**: > 75%
- **Branches**: > 70%
- **Functions**: > 75%
- **Lines**: > 75%

### Relatórios de Cobertura

**Backend:**
```bash
npm run test:cov
# Relatório gerado em: coverage/lcov-report/index.html
```

**Frontend:**
```bash
ng test --code-coverage
# Relatório gerado em: coverage/index.html
```

### Visualização

Abra os arquivos HTML gerados em um navegador para visualizar:
- Cobertura por arquivo
- Linhas não cobertas
- Branches não testados
- Funções não executadas

---

## Boas Práticas

### 1. Nomenclatura de Testes

**Padrão AAA (Arrange, Act, Assert):**
```typescript
it('deve adicionar pontos ao usuário quando coleta é aceita', () => {
  // Arrange (Preparar)
  const user = User.create({...});
  const initialBalance = user.pointsBalance.value;
  
  // Act (Agir)
  user.addPointsFromCollection('collection-1', 100);
  
  // Assert (Afirmar)
  expect(user.pointsBalance.value).toBe(initialBalance + 100);
});
```

**Descrições Claras:**
- ✅ `deve criar um usuário com saldo inicial zero`
- ✅ `não deve permitir resgate com saldo insuficiente`
- ❌ `teste de usuário`
- ❌ `verifica pontos`

### 2. Isolamento de Testes

**Cada teste deve ser independente:**
```typescript
describe('UserService', () => {
  let service: UserService;
  
  beforeEach(() => {
    // Criar nova instância para cada teste
    service = new UserService();
  });
  
  // Testes isolados...
});
```

### 3. Mocks e Stubs

**Use mocks para dependências externas:**
```typescript
const mockRepository = {
  findById: jest.fn(),
  save: jest.fn(),
};

// Configure comportamento específico
mockRepository.findById.mockResolvedValue(user);
```

### 4. Testes de Casos Extremos

**Sempre teste:**
- Valores nulos/undefined
- Valores negativos
- Strings vazias
- Arrays vazios
- Limites numéricos
- Casos de erro

### 5. Organize por Contexto

```typescript
describe('User Aggregate', () => {
  describe('Criação', () => {
    // Testes de criação
  });
  
  describe('Gerenciamento de Pontos', () => {
    describe('Adição de Pontos', () => {
      // Testes de adição
    });
    
    describe('Resgate de Pontos', () => {
      // Testes de resgate
    });
  });
});
```

### 6. Evite Testes Frágeis

**❌ Ruim:**
```typescript
expect(user.createdAt).toBe(new Date('2024-01-01'));
```

**✅ Bom:**
```typescript
expect(user.createdAt).toBeInstanceOf(Date);
expect(user.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
```

### 7. Teste Comportamento, Não Implementação

**❌ Ruim (testa implementação):**
```typescript
it('deve chamar método interno', () => {
  const spy = jest.spyOn(service, 'internalMethod');
  service.publicMethod();
  expect(spy).toHaveBeenCalled();
});
```

**✅ Bom (testa comportamento):**
```typescript
it('deve retornar resultado correto', () => {
  const result = service.publicMethod();
  expect(result).toBe(expectedValue);
});
```

---

## Integração Contínua (CI)

Os testes são executados automaticamente no pipeline de CI:

### GitHub Actions

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd backend && npm ci
      - name: Run tests
        run: cd backend && npm run test:cov
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd frontend && npm ci
      - name: Run tests
        run: cd frontend && ng test --watch=false --code-coverage
```

---

## Conclusão

A estratégia de testes do EcoTroc garante:

✅ **Confiabilidade** - Código testado e validado  
✅ **Manutenibilidade** - Refatoração segura  
✅ **Documentação Viva** - Testes como especificação  
✅ **Qualidade** - Detecção precoce de bugs  
✅ **Confiança** - Deploy com segurança

Mantenha os testes atualizados e a cobertura alta para garantir a qualidade contínua do projeto! 🚀
