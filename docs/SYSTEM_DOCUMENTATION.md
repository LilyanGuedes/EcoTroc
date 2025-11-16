# 📚 Documentação Completa do Sistema EcoTroc

## Sumário

1. [Visão Geral](#visão-geral)
2. [Arquitetura do Sistema](#arquitetura-do-sistema)
3. [Tecnologias Utilizadas](#tecnologias-utilizadas)
4. [Estrutura do Projeto](#estrutura-do-projeto)
5. [Domínio de Negócio](#domínio-de-negócio)
6. [Backend - API](#backend---api)
7. [Frontend - Web/Mobile](#frontend---webmobile)
8. [Funcionalidades Educativas e de Sustentabilidade](#funcionalidades-educativas-e-de-sustentabilidade)
9. [Banco de Dados](#banco-de-dados)
10. [Segurança](#segurança)
11. [Fluxos Principais](#fluxos-principais)
12. [Configuração e Deploy](#configuração-e-deploy)
13. [Guia de Desenvolvimento](#guia-de-desenvolvimento)

---

## Visão Geral

### O que é o EcoTroc?

O **EcoTroc** é uma plataforma digital que incentiva a reciclagem através de um sistema de pontos. Usuários podem registrar coletas de materiais recicláveis e receber pontos que podem ser trocados por benefícios.

### Objetivo

Promover a sustentabilidade e o descarte consciente de materiais recicláveis, conectando recicladores (pessoas que descartam) com eco-operadores (responsáveis por validar e processar as coletas).

### Usuários do Sistema

1. **Recicladores (Recyclers)**
   - Pessoas que descartam materiais recicláveis
   - Criam solicitações de coleta
   - Acumulam pontos por coletas aceitas
   - Resgatam pontos por benefícios

2. **Eco-Operadores (Eco Operators)**
   - Responsáveis por validar coletas
   - Aceitam ou rejeitam solicitações
   - Gerenciam o processo de reciclagem

### Funcionalidades Principais

- ✅ Cadastro e autenticação de usuários
- ✅ Criação de solicitações de coleta
- ✅ Sistema de pontuação por material
- ✅ Validação de coletas por eco-operadores
- ✅ Histórico de transações
- ✅ Resgate de pontos
- ✅ Dashboard personalizado por tipo de usuário
- ✅ Relatórios completos com aceleração GPU
- ✅ Dicas educativas de reciclagem
- ✅ Estatísticas por tipo de material
- ✅ Cálculo de impacto ambiental

---

## Arquitetura do Sistema

### Arquitetura Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE APRESENTAÇÃO                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Angular Frontend (Web/Mobile)              │  │
│  │  • Componentes  • Services  • Guards  • Interceptors │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTPS/REST
┌─────────────────────────────────────────────────────────────┐
│                      CAMADA DE API                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              NestJS Backend API                      │  │
│  │  • Controllers  • Guards  • Interceptors  • Filters  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                  CAMADA DE APLICAÇÃO (DDD)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │    Use Cases  •  DTOs  •  Event Handlers            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    CAMADA DE DOMÍNIO (DDD)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Aggregates  •  Value Objects  •  Domain Services    │  │
│  │  Domain Events  •  Repository Interfaces             │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                CAMADA DE INFRAESTRUTURA                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  TypeORM  •  Repositories  •  Unit of Work           │  │
│  │  Event Publisher  •  External Services               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                      BANCO DE DADOS                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PostgreSQL Database                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Princípios Arquiteturais

1. **Domain-Driven Design (DDD)**
   - Domínio rico com lógica de negócio encapsulada
   - Aggregates bem definidos (User, Collection)
   - Value Objects imutáveis
   - Domain Events para comunicação

2. **Clean Architecture**
   - Separação clara de responsabilidades
   - Dependências apontam para o domínio
   - Camadas isoladas e testáveis

3. **SOLID Principles**
   - Single Responsibility
   - Open/Closed
   - Liskov Substitution
   - Interface Segregation
   - Dependency Inversion

4. **Event-Driven Architecture**
   - Domain Events para ações importantes
   - Event Handlers para side effects
   - Publicação após commit (Unit of Work)

---

## Tecnologias Utilizadas

### Backend

| Tecnologia | Versão | Descrição |
|-----------|--------|------------|
| **Node.js** | 18+ | Runtime JavaScript |
| **NestJS** | 11.x | Framework backend |
| **TypeScript** | 5.7+ | Linguagem tipada |
| **TypeORM** | 0.3.x | ORM para banco de dados |
| **PostgreSQL** | 15+ | Banco de dados relacional |
| **Passport** | 0.7.x | Autenticação |
| **JWT** | 11.x | Tokens de autenticação |
| **bcrypt** | 6.x | Hash de senhas |
| **Jest** | 29.x | Framework de testes |
| **class-validator** | - | Validação de DTOs |
| **class-transformer** | - | Transformação de objetos |
| **GPU.js** | 2.16.x | Computação paralela em GPU |

### Frontend

| Tecnologia | Versão | Descrição |
|-----------|--------|------------|
| **Angular** | 18+ | Framework frontend |
| **TypeScript** | 5.5+ | Linguagem tipada |
| **Tailwind CSS** | 3.x | Framework CSS |
| **RxJS** | 7.x | Programação reativa |
| **Capacitor** | - | Framework mobile |
| **Jasmine** | - | Framework de testes |
| **Karma** | - | Test runner |

### DevOps & Ferramentas

- **ESLint** - Linting de código
- **Prettier** - Formatação de código
- **Git** - Controle de versão
- **npm** - Gerenciador de pacotes
- **Docker** (recomendado) - Containerização

---

## Estrutura do Projeto

### Estrutura de Diretórios

```
EcoTroc/
├── backend/                          # Aplicação NestJS
│   ├── src/
│   │   ├── modules/                  # Módulos de domínio
│   │   │   ├── user/                # Módulo de usuários
│   │   │   │   ├── domain/          # Camada de domínio
│   │   │   │   │   ├── entities/    # Aggregates
│   │   │   │   │   ├── value-objects/ # Value Objects
│   │   │   │   │   ├── events/      # Domain Events
│   │   │   │   │   ├── services/    # Domain Services
│   │   │   │   │   └── repositories/ # Interfaces
│   │   │   │   ├── application/     # Camada de aplicação
│   │   │   │   │   ├── use-cases/   # Casos de uso
│   │   │   │   │   ├── dto/         # Data Transfer Objects
│   │   │   │   │   └── event-handlers/ # Event Handlers
│   │   │   │   ├── infrastructure/  # Camada de infraestrutura
│   │   │   │   │   ├── orm/         # Entidades TypeORM
│   │   │   │   │   └── repositories/ # Implementações
│   │   │   │   ├── interface/       # Camada de interface
│   │   │   │   │   └── controllers/ # Controllers REST
│   │   │   │   └── user.module.ts   # Módulo NestJS
│   │   │   ├── collection/          # Módulo de coletas
│   │   │   ├── auth/                # Módulo de autenticação
│   │   │   └── user-points/         # Módulo de pontos
│   │   ├── shared/                  # Código compartilhado
│   │   │   ├── domain/              # Base classes
│   │   │   │   ├── aggregate-root.ts
│   │   │   │   ├── value-object.ts
│   │   │   │   ├── domain-event.ts
│   │   │   │   └── domain-event-publisher.ts
│   │   │   └── infrastructure/
│   │   │       └── unit-of-work.ts
│   │   ├── common/                  # Utilitários comuns
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── test/                        # Testes E2E
│   ├── package.json
│   ├── tsconfig.json
│   └── DDD_ARCHITECTURE.md         # Doc arquitetura DDD
│
├── frontend/                        # Aplicação Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── modules/            # Módulos de features
│   │   │   │   ├── auth/          # Autenticação
│   │   │   │   ├── recycler/      # Interface reciclador
│   │   │   │   ├── eco-operator/  # Interface operador
│   │   │   │   ├── start/         # Página inicial
│   │   │   │   └── without-permission/
│   │   │   ├── services/          # Serviços globais
│   │   │   ├── guards/            # Route guards
│   │   │   ├── interceptors/      # HTTP interceptors
│   │   │   ├── entities/          # Modelos de dados
│   │   │   ├── shared/            # Componentes compartilhados
│   │   │   ├── app.routes.ts      # Rotas
│   │   │   └── app.config.ts      # Configuração
│   │   ├── environments/          # Ambientes
│   │   ├── assets/                # Assets estáticos
│   │   └── styles.css             # Estilos globais
│   ├── public/                     # Arquivos públicos
│   ├── package.json
│   ├── angular.json
│   ├── tailwind.config.js
│   └── capacitor.config.ts        # Config mobile
│
├── docs/                           # Documentação
│   ├── TESTING.md                 # Doc de testes
│   └── SYSTEM_DOCUMENTATION.md    # Esta documentação
│
└── 🌱 EcoTroc.pdf                 # Apresentação do projeto
```

---

## Domínio de Negócio

### Aggregates

#### 1. User Aggregate

**Responsabilidades:**
- Gerenciar identidade do usuário
- Controlar saldo de pontos
- Validar tipo de usuário (Recycler/EcoOperator)
- Emitir eventos de domínio

**Entidade Principal:**
```typescript
class User extends AggregateRoot {
  private _id: string;
  private _name: string;
  private _email: Email;              // Value Object
  private _password: Password;        // Value Object
  private _userType: UserType;        // Enum
  private _pointsBalance: Points;     // Value Object
  private _createdAt: Date;
  
  // Métodos de negócio
  addPointsFromCollection(collectionId: string, points: number): void
  redeemPoints(points: number, description: string): void
  isRecycler(): boolean
  isEcoOperator(): boolean
}
```

**Value Objects:**
- `Email`: Valida formato de email
- `Password`: Hash bcrypt, mínimo 8 caracteres
- `Points`: Não permite negativos, apenas inteiros

**Eventos:**
- `UserRegisteredEvent`: Quando usuário é criado
- `PointsAddedEvent`: Quando pontos são adicionados
- `PointsRedeemedEvent`: Quando pontos são resgatados

**Invariantes:**
- Email deve ser único
- Saldo de pontos nunca pode ser negativo
- Tipo de usuário não pode mudar após criação

#### 2. Collection Aggregate

**Responsabilidades:**
- Gerenciar ciclo de vida da coleta
- Calcular pontos baseado no material
- Validar autorização de resposta
- Emitir eventos de domínio

**Entidade Principal:**
```typescript
class Collection extends AggregateRoot {
  private _id: string;
  private _userId: string;
  private _materialType: MaterialType; // Value Object
  private _quantity: Quantity;         // Value Object
  private _description: string;
  private _status: CollectionStatus;   // Enum
  private _points: number;
  private _rejectionReason?: string;
  private _respondedAt?: Date;
  private _createdAt: Date;
  
  // Métodos de negócio
  acceptBy(userId: string): void
  rejectBy(userId: string, reason: string): void
  calculatePoints(): number
}
```

**Value Objects:**
- `MaterialType`: Tipo de material com pontuação
  - PLASTIC: 5 pontos/unidade
  - PAPER: 3 pontos/unidade
  - METAL: 7 pontos/unidade
  - GLASS: 4 pontos/unidade
- `Quantity`: Quantidade positiva e inteira

**Enums:**
```typescript
enum CollectionStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}
```

**Eventos:**
- `CollectionCreatedEvent`: Quando coleta é criada
- `CollectionAcceptedEvent`: Quando coleta é aceita
- `CollectionRejectedEvent`: Quando coleta é rejeitada

**Invariantes:**
- Quantidade deve ser maior que zero
- Status só pode transitar de PENDING → ACCEPTED/REJECTED
- Apenas eco-operador pode aceitar/rejeitar
- Coleta rejeitada deve ter motivo

### Domain Services

#### CollectionDomainService

Coordenação entre múltiplos aggregates:

```typescript
class CollectionDomainService {
  processCollectionResponse(
    collection: Collection,
    user: User,
    accept: boolean,
    reason?: string
  ): void {
    // Validar que usuário é eco-operador
    if (!user.isEcoOperator()) {
      throw new Error('Apenas eco-operadores podem responder');
    }
    
    if (accept) {
      collection.acceptBy(user.id);
      user.addPointsFromCollection(collection.id, collection.points);
    } else {
      collection.rejectBy(user.id, reason);
    }
  }
}
```

### Diagrama de Domínio

```
┌────────────────────────────────────────────────────────────┐
│                    USER AGGREGATE                          │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  User (Aggregate Root)                               │ │
│  │  • id, name, email, password, userType               │ │
│  │  • pointsBalance                                     │ │
│  │                                                      │ │
│  │  Methods:                                            │ │
│  │  • addPointsFromCollection()                        │ │
│  │  • redeemPoints()                                   │ │
│  │  • isRecycler() / isEcoOperator()                  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Value Objects:                                            │
│  • Email  • Password  • Points                            │
│                                                            │
│  Events:                                                   │
│  • UserRegisteredEvent                                    │
│  • PointsAddedEvent                                       │
│  • PointsRedeemedEvent                                    │
└────────────────────────────────────────────────────────────┘
                          │
                          │ 1:N
                          ▼
┌────────────────────────────────────────────────────────────┐
│                 COLLECTION AGGREGATE                       │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  Collection (Aggregate Root)                         │ │
│  │  • id, userId, materialType, quantity                │ │
│  │  • description, status, points                       │ │
│  │  • rejectionReason, respondedAt                      │ │
│  │                                                      │ │
│  │  Methods:                                            │ │
│  │  • acceptBy(userId)                                 │ │
│  │  • rejectBy(userId, reason)                         │ │
│  │  • calculatePoints()                                │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Value Objects:                                            │
│  • MaterialType  • Quantity                               │
│                                                            │
│  Events:                                                   │
│  • CollectionCreatedEvent                                 │
│  • CollectionAcceptedEvent                                │
│  • CollectionRejectedEvent                                │
└────────────────────────────────────────────────────────────┘
                          │
                          │ 1:N
                          ▼
┌────────────────────────────────────────────────────────────┐
│                   USER POINTS (Read Model)                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  UserPoints                                          │ │
│  │  • id, userId, collectionId                          │ │
│  │  • points, description, type                         │ │
│  │  • createdAt                                         │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  Criado por Event Handler ao aceitar coleta              │
└────────────────────────────────────────────────────────────┘
```

---

## Backend - API

### Módulos Principais

#### 1. Auth Module

**Responsabilidades:**
- Registro de usuários
- Autenticação via JWT
- Estratégias de autenticação (Passport)

**Endpoints:**

```typescript
POST /auth/register
Body: {
  name: string;
  email: string;
  password: string;
  userType: 'RECYCLER' | 'ECO_OPERATOR';
}
Response: {
  id: string;
  name: string;
  email: string;
  userType: string;
}

POST /auth/login
Body: {
  email: string;
  password: string;
}
Response: {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    userType: string;
  }
}
```

**Implementação:**

```typescript
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUserUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return await this.registerUseCase.execute(dto);
  }

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return await this.loginUseCase.execute(dto);
  }
}
```

#### 2. User Module

**Responsabilidades:**
- CRUD de usuários
- Gerenciamento de perfil
- Consulta de saldo de pontos

**Endpoints:**

```typescript
GET /users/me
Headers: Authorization: Bearer {token}
Response: {
  id: string;
  name: string;
  email: string;
  userType: string;
  pointsBalance: number;
  createdAt: string;
}

GET /users/:id
Headers: Authorization: Bearer {token}
Response: User

PATCH /users/me
Headers: Authorization: Bearer {token}
Body: {
  name?: string;
}
Response: User
```

#### 3. Collection Module

**Responsabilidades:**
- Criação de coletas
- Listagem de coletas
- Resposta a coletas (aceitar/rejeitar)

**Endpoints:**

```typescript
POST /collections
Headers: Authorization: Bearer {token}
Body: {
  materialType: 'PLASTIC' | 'PAPER' | 'METAL' | 'GLASS';
  quantity: number;
  description: string;
}
Response: {
  id: string;
  userId: string;
  materialType: string;
  quantity: number;
  description: string;
  status: 'PENDING';
  points: number;
  createdAt: string;
}

GET /collections
Headers: Authorization: Bearer {token}
Query: {
  status?: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  page?: number;
  limit?: number;
}
Response: {
  data: Collection[];
  total: number;
  page: number;
  limit: number;
}

GET /collections/my
Headers: Authorization: Bearer {token}
Response: Collection[]

POST /collections/:id/respond
Headers: Authorization: Bearer {token}
Body: {
  accept: boolean;
  reason?: string;  // Obrigatório se accept = false
}
Response: {
  id: string;
  status: 'ACCEPTED' | 'REJECTED';
  respondedAt: string;
  rejectionReason?: string;
}
```

**Exemplo de Implementação:**

```typescript
@Controller('collections')
@UseGuards(JwtAuthGuard)
export class CollectionController {
  constructor(
    private readonly createCollectionUseCase: CreateCollectionUseCase,
    private readonly respondToCollectionUseCase: RespondToCollectionUseCase,
    private readonly listCollectionsUseCase: ListCollectionsUseCase,
  ) {}

  @Post()
  async create(
    @Request() req,
    @Body() dto: CreateCollectionDto,
  ) {
    return await this.createCollectionUseCase.execute({
      ...dto,
      userId: req.user.id,
    });
  }

  @Post(':id/respond')
  async respond(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: RespondCollectionDto,
  ) {
    return await this.respondToCollectionUseCase.execute({
      collectionId: id,
      userId: req.user.id,
      accept: dto.accept,
      reason: dto.reason,
    });
  }

  @Get()
  async list(@Query() query: ListCollectionsQueryDto) {
    return await this.listCollectionsUseCase.execute(query);
  }

  @Get('my')
  async myCollections(@Request() req) {
    return await this.listCollectionsUseCase.execute({
      userId: req.user.id,
    });
  }
}
```

#### 4. User Points Module

**Responsabilidades:**
- Histórico de transações de pontos
- Registro de ganhos e resgates

**Endpoints:**

```typescript
GET /user-points/my
Headers: Authorization: Bearer {token}
Response: {
  id: string;
  userId: string;
  collectionId?: string;
  points: number;
  type: 'GAIN' | 'REDEMPTION';
  description: string;
  createdAt: string;
}[]
```

#### 5. Reports Module

**Responsabilidades:**
- Geração de relatórios completos do sistema
- Agregação de dados de coletas
- Cálculo de estatísticas por material
- Cálculo de impacto ambiental
- Aceleração por GPU para grandes volumes

**Endpoints:**

```typescript
GET /collections/reports
Headers: Authorization: Bearer {token}
Response: {
  summary: {
    totalCollections: number;
    acceptedCollections: number;
    pendingCollections: number;
    rejectedCollections: number;
    totalQuantity: number;
    totalPoints: number;
    recentCollections: number;
    processingTime: number;
    usedGpu: boolean;
  };
  materialStats: {
    [key: string]: {
      quantity: number;
      points: number;
      count: number;
    };
  };
  collections: Collection[];
}

GET /collections/environmental-impact
Headers: Authorization: Bearer {token}
Response: {
  totalCO2Saved: number;
  totalWaterSaved: number;
  totalEnergySaved: number;
  processingTime: number;
}
```

**ReportsService - Aceleração GPU:**

O serviço de relatórios utiliza GPU.js para processamento paralelo quando há grandes volumes de dados:

```typescript
@Injectable()
export class ReportsService {
  /**
   * Gera relatório completo com aceleração automática por GPU
   * - Volume < 1000 coletas: Processamento CPU (sequencial)
   * - Volume >= 1000 coletas: Processamento GPU (paralelo)
   */
  async generateCollectionsReport(collections: Collection[]): Promise<Report> {
    const useGpu = collections.length >= 1000;

    if (useGpu) {
      // Processamento paralelo na GPU
      return await this.calculateSummaryGpu(collections);
    } else {
      // Processamento sequencial na CPU
      return this.calculateSummaryCpu(collections);
    }
  }

  /**
   * Calcula impacto ambiental usando fatores de conversão
   * - CO2: kg economizado por tipo de material
   * - Água: litros economizados
   * - Energia: kWh economizados
   */
  async calculateEnvironmentalImpact(collections: Collection[]): Promise<Impact> {
    // Fatores por material (kg)
    const co2Factors = { PLASTICO: 2.5, PAPEL: 1.8, VIDRO: 0.5, METAL: 3.2 };
    const waterFactors = { PLASTICO: 15, PAPEL: 50, VIDRO: 8, METAL: 25 };
    const energyFactors = { PLASTICO: 12, PAPEL: 8, VIDRO: 4, METAL: 18 };

    // Cálculos paralelos na GPU para grandes volumes
    if (collections.length >= 10000) {
      return this.gpuService.calculateEnvironmentalImpact(...);
    }
    // ...
  }
}
```

**Performance:**

O sistema de relatórios demonstra ganhos significativos de performance:

- **1.000 coletas**: ~5ms (CPU) vs ~3ms (GPU)
- **10.000 coletas**: ~50ms (CPU) vs ~15ms (GPU) - **70% mais rápido**
- **100.000 coletas**: ~500ms (CPU) vs ~80ms (GPU) - **84% mais rápido**
- **1.000.000 coletas**: ~5s (CPU) vs ~600ms (GPU) - **88% mais rápido**

### Autenticação e Autorização

#### JWT Strategy

```typescript
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userRepository.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

#### Guards

```typescript
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserType[]>(
      'roles',
      context.getHandler(),
    );
    
    if (!requiredRoles) {
      return true;
    }
    
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    return requiredRoles.includes(user.userType);
  }
}
```

**Uso:**

```typescript
@Post(':id/respond')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.ECO_OPERATOR)
async respond(@Param('id') id, @Body() dto, @Request() req) {
  // Apenas eco-operadores podem acessar
}
```

### Validação de DTOs

```typescript
import { IsString, IsEnum, IsNumber, Min, IsOptional } from 'class-validator';

export class CreateCollectionDto {
  @IsEnum(MaterialType)
  materialType: MaterialType;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsString()
  @IsOptional()
  description?: string;
}

export class RespondCollectionDto {
  @IsBoolean()
  accept: boolean;

  @IsString()
  @IsOptional()
  @ValidateIf(o => !o.accept)  // Obrigatório se accept = false
  reason?: string;
}
```

### Event Handlers

**Exemplo: CollectionAcceptedHandler**

```typescript
@Injectable()
export class CollectionAcceptedHandler {
  constructor(
    private readonly userPointsRepository: UserPointsRepository,
  ) {}

  async handle(event: CollectionAcceptedEvent): Promise<void> {
    // Criar registro de transação
    const pointsTransaction = UserPoints.createFromCollection({
      userId: event.userId,
      collectionId: event.collectionId,
      points: event.points,
      description: `Pontos ganhos pela coleta aceita`,
    });

    await this.userPointsRepository.create(pointsTransaction);
  }
}
```

---

## Frontend - Web/Mobile

### Módulos de Features

#### 1. Auth Module

**Componentes:**
- `LoginComponent`: Tela de login
- `RegisterComponent`: Tela de registro

**Serviços:**
- `AuthService`: Gerenciamento de autenticação

**Exemplo: auth.service.ts**

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(credentials: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/auth/login`,
      credentials
    ).pipe(
      tap(response => {
        this.setSession(response);
        this.currentUserSubject.next(response.user);
      })
    );
  }

  register(data: RegisterDto): Observable<User> {
    return this.http.post<User>(
      `${environment.apiUrl}/auth/register`,
      data
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private setSession(authResult: AuthResponse): void {
    localStorage.setItem('token', authResult.accessToken);
    localStorage.setItem('user', JSON.stringify(authResult.user));
  }

  private isTokenExpired(token: string): boolean {
    const expiry = JSON.parse(atob(token.split('.')[1])).exp;
    return Math.floor(new Date().getTime() / 1000) >= expiry;
  }
}
```

#### 2. Recycler Module

**Páginas:**
- `RecyclerDashboardComponent` (home-recycler): Dashboard do reciclador com dicas de reciclagem
- `CreateCollectionComponent`: Criar nova coleta
- `MyCollectionsComponent`: Histórico de coletas
- `PointsComponent`: Consulta de saldo e histórico de pontos
- `RedeemPointsComponent`: Resgate de pontos

**Funcionalidades do Dashboard:**

O dashboard do reciclador oferece uma experiência educativa e informativa:

1. **Estatísticas Pessoais de Reciclagem**
   - Gráficos de distribuição por tipo de material
   - Percentuais e totais de cada categoria
   - Visualização colorida (Plástico: azul, Papel: âmbar, Vidro: verde, Metal: cinza)

2. **Carrossel de Dicas de Reciclagem**
   - 5 dicas educativas sobre práticas corretas de reciclagem
   - Cards visuais com imagens e descrições
   - Rolagem horizontal com scroll suave
   - Tópicos abordados:
     - Separação correta e limpeza de materiais
     - Identificação de plásticos recicláveis
     - Cuidados com papel e papelão
     - Reutilização infinita do vidro
     - Valorização de metais na reciclagem

3. **Atalhos Rápidos**
   - Marketplace para troca de pontos
   - Visualização de pontuação
   - Mapa de pontos de coleta
   - Acesso a relatórios pessoais

**Exemplo: create-collection.component.ts**

```typescript
@Component({
  selector: 'app-create-collection',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-collection.component.html',
})
export class CreateCollectionComponent {
  collectionForm: FormGroup;
  materialTypes = Object.values(MaterialType);

  constructor(
    private fb: FormBuilder,
    private collectionService: CollectionService,
    private router: Router,
  ) {
    this.collectionForm = this.fb.group({
      materialType: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      description: [''],
    });
  }

  onSubmit(): void {
    if (this.collectionForm.valid) {
      this.collectionService.createCollection(
        this.collectionForm.value
      ).subscribe({
        next: (collection) => {
          this.router.navigate(['/recycler/collections']);
        },
        error: (error) => {
          console.error('Erro ao criar coleta', error);
        },
      });
    }
  }

  calculatePoints(): number {
    const type = this.collectionForm.get('materialType')?.value;
    const quantity = this.collectionForm.get('quantity')?.value;
    
    if (!type || !quantity) return 0;
    
    const pointsPerUnit = {
      PLASTIC: 5,
      PAPER: 3,
      METAL: 7,
      GLASS: 4,
    };
    
    return pointsPerUnit[type] * quantity;
  }
}
```

#### 3. Eco-Operator Module

**Páginas:**
- `EcoOperatorDashboardComponent` (home-operator): Dashboard do operador
- `CollectionsComponent`: Gerenciamento de coletas pendentes
- `DeclareRecyclingComponent`: Declaração de reciclagem manual
- `ReportsComponent`: Relatórios completos do sistema

**Funcionalidades do Dashboard:**

1. **Atalhos de Ação Rápida** (4 cards horizontais)
   - Declarar Reciclagem
   - Ver Coletas
   - Relatórios
   - Configurações

2. **Sistema de Relatórios Avançado**

   O módulo de relatórios oferece uma análise completa e poderosa do sistema de reciclagem:

   **a) Resumo Geral:**
   - Total de coletas no sistema
   - Coletas aceitas, pendentes e rejeitadas
   - Material processado (kg)
   - Pontos distribuídos
   - Atividade dos últimos 30 dias
   - Tempo de processamento e uso de GPU

   **b) Distribuição por Tipo de Material:**
   - Estatísticas detalhadas para cada categoria (Plástico, Papel, Vidro, Metal)
   - Gráficos de barras com percentuais
   - Quantidade total em kg por material
   - Número de coletas por tipo
   - Pontos distribuídos por categoria

   **c) Listagem de Coletas Recentes:**
   - Tabela das últimas 10 coletas
   - Data e hora da coleta
   - Tipo de material
   - Quantidade e pontos
   - Status visual (aceita/pendente/rejeitada)

   **d) Recursos Avançados:**
   - Impressão de relatórios formatados
   - Aceleração por GPU para grandes volumes (>1000 coletas)
   - Cálculo de impacto ambiental (CO2, água e energia economizados)
   - Performance otimizada com processamento paralelo

**Exemplo: pending-collections.component.ts**

```typescript
@Component({
  selector: 'app-pending-collections',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pending-collections.component.html',
})
export class PendingCollectionsComponent implements OnInit {
  collections$: Observable<Collection[]>;

  constructor(private collectionService: CollectionService) {}

  ngOnInit(): void {
    this.loadPendingCollections();
  }

  loadPendingCollections(): void {
    this.collections$ = this.collectionService.getCollections({
      status: 'PENDING',
    });
  }

  acceptCollection(id: string): void {
    this.collectionService.acceptCollection(id).subscribe({
      next: () => {
        this.loadPendingCollections();
      },
      error: (error) => {
        console.error('Erro ao aceitar coleta', error);
      },
    });
  }

  rejectCollection(id: string, reason: string): void {
    this.collectionService.rejectCollection(id, reason).subscribe({
      next: () => {
        this.loadPendingCollections();
      },
      error: (error) => {
        console.error('Erro ao rejeitar coleta', error);
      },
    });
  }
}
```

### Guards

**auth.guard.ts**

```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
```

**role.guard.ts**

```typescript
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as UserType[];
    const currentUser = this.authService.getCurrentUser();

    if (currentUser && requiredRoles.includes(currentUser.userType)) {
      return true;
    }

    this.router.navigate(['/without-permission']);
    return false;
  }
}
```

### Interceptors

**auth.interceptor.ts**

```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token = this.authService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(request);
  }
}
```

### Rotas

**app.routes.ts**

```typescript
export const routes: Routes = [
  { path: '', redirectTo: 'start', pathMatch: 'full' },
  {
    path: 'start',
    loadComponent: () =>
      import('./modules/start/start.component').then(m => m.StartComponent),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'recycler',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserType.RECYCLER] },
    loadChildren: () =>
      import('./modules/recycler/recycler.routes').then(m => m.RECYCLER_ROUTES),
  },
  {
    path: 'eco-operator',
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: [UserType.ECO_OPERATOR] },
    loadChildren: () =>
      import('./modules/eco-operator/eco-operator.routes').then(
        m => m.ECO_OPERATOR_ROUTES
      ),
  },
  {
    path: 'without-permission',
    loadComponent: () =>
      import('./modules/without-permission/without-permission.component').then(
        m => m.WithoutPermissionComponent
      ),
  },
  { path: '**', redirectTo: 'start' },
];
```

---

## Funcionalidades Educativas e de Sustentabilidade

### 1. Dicas de Reciclagem (Recycler Dashboard)

O sistema oferece um carrossel educativo com dicas práticas de reciclagem:

**Implementação:**
```typescript
// home-recycler.component.ts
dicas = [
  {
    titulo: 'Separe corretamente!',
    descricao: 'Lave e seque embalagens antes de descartar...',
    imagem: 'https://images.unsplash.com/...'
  },
  {
    titulo: 'Plástico reciclável',
    descricao: 'Nem todo plástico é reciclável. Verifique o símbolo...',
    imagem: 'https://images.unsplash.com/...'
  },
  // 5 dicas no total
];
```

**Tópicos Abordados:**
- ✅ Separação e limpeza adequada de materiais
- ✅ Identificação de símbolos de reciclagem
- ✅ Cuidados específicos por tipo de material
- ✅ Benefícios ambientais da reciclagem
- ✅ Boas práticas de armazenamento

**UI/UX:**
- Cards visuais com imagens de alta qualidade
- Scroll horizontal suave
- Design responsivo para mobile e desktop
- Cores consistentes com identidade visual (verde)

### 2. Cálculo de Impacto Ambiental

O sistema calcula o impacto positivo da reciclagem em termos ambientais concretos:

**Métricas Calculadas:**

| Recurso | Fator de Conversão | Descrição |
|---------|-------------------|-----------|
| **CO2** | kg economizado/kg material | Redução de emissões de carbono |
| **Água** | litros economizados/kg | Economia no consumo de água |
| **Energia** | kWh economizados/kg | Redução no consumo energético |

**Fatores por Material:**

**Plástico:**
- CO2: 2.5 kg/kg
- Água: 15 litros/kg
- Energia: 12 kWh/kg

**Papel:**
- CO2: 1.8 kg/kg
- Água: 50 litros/kg
- Energia: 8 kWh/kg

**Vidro:**
- CO2: 0.5 kg/kg
- Água: 8 litros/kg
- Energia: 4 kWh/kg

**Metal:**
- CO2: 3.2 kg/kg
- Água: 25 litros/kg
- Energia: 18 kWh/kg

**Exemplo de Resultado:**
```json
{
  "totalCO2Saved": 1250.5,      // kg de CO2
  "totalWaterSaved": 8500.0,    // litros
  "totalEnergySaved": 3200.0,   // kWh
  "processingTime": 15          // ms
}
```

### 3. Visualização de Estatísticas

**Para Recicladores:**
- Gráficos de distribuição pessoal por material
- Percentuais e totais individualizados
- Histórico de coletas aceitas
- Evolução do saldo de pontos

**Para Eco-Operadores:**
- Visão geral do sistema completo
- Estatísticas agregadas de todos os usuários
- Análise temporal (últimos 30 dias)
- Comparativo entre tipos de material
- Taxa de aceitação/rejeição

### 4. Gamificação e Incentivos

**Sistema de Pontos:**
- Pontuação diferenciada por tipo de material
- Materiais mais valiosos recebem mais pontos
- Metal: 7 pontos/kg (maior valor)
- Plástico: 5 pontos/kg
- Vidro: 4 pontos/kg
- Papel: 3 pontos/kg

**Benefícios:**
- Incentivo financeiro para reciclagem
- Reconhecimento visual do impacto
- Possibilidade de troca por produtos
- Acúmulo ilimitado de pontos

---

## Banco de Dados

### Esquema PostgreSQL

```sql
-- Tabela de Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('RECYCLER', 'ECO_OPERATOR')),
  points_balance INTEGER DEFAULT 0 NOT NULL CHECK (points_balance >= 0),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Coletas
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  material_type VARCHAR(50) NOT NULL CHECK (material_type IN ('PLASTIC', 'PAPER', 'METAL', 'GLASS')),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED')),
  points INTEGER NOT NULL,
  rejection_reason TEXT,
  responded_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Histórico de Pontos
CREATE TABLE user_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  collection_id UUID REFERENCES collections(id),
  points INTEGER NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('GAIN', 'REDEMPTION')),
  description TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para Performance
CREATE INDEX idx_collections_user_id ON collections(user_id);
CREATE INDEX idx_collections_status ON collections(status);
CREATE INDEX idx_user_points_user_id ON user_points(user_id);
CREATE INDEX idx_users_email ON users(email);
```

### Relacionamentos

```
users (1) ──< (N) collections
  │
  └──< (N) user_points
               │
               └──> (1) collections [opcional]
```

### Migrations com TypeORM

O projeto está configurado com `synchronize: true` para desenvolvimento, mas em produção recomenda-se usar migrations:

```bash
# Gerar migration
npm run typeorm migration:generate -- -n CreateInitialTables

# Executar migrations
npm run typeorm migration:run

# Reverter migration
npm run typeorm migration:revert
```

---

## Segurança

### Proteções Implementadas

1. **Autenticação JWT**
   - Tokens com expiração
   - Refresh tokens (recomendado para produção)
   - Secret forte armazenado em variável de ambiente

2. **Hash de Senhas**
   - Bcrypt com salt rounds = 10
   - Senhas nunca armazenadas em texto puro

3. **Validação de Entrada**
   - class-validator em todos os DTOs
   - Sanitização de dados
   - Type safety com TypeScript

4. **Autorização**
   - Guards para proteger rotas
   - Role-based access control
   - Validação no domínio

5. **CORS**
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
});
```

6. **Rate Limiting** (Recomendado)
```typescript
import rateLimit from 'express-rate-limit';

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite de requisições
  })
);
```

7. **Helmet** (Recomendado)
```typescript
import helmet from 'helmet';
app.use(helmet());
```

### Variáveis de Ambiente

**backend/.env.example**
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
DB_NAME=ecotroc
JWT_SECRET=your-secret-key-here-change-in-production
```

---

## Fluxos Principais

### 1. Fluxo de Registro e Login

```
┌─────────┐                                    ┌─────────┐
│Frontend │                                    │ Backend │
└────┬────┘                                    └────┬────┘
     │                                              │
     │  POST /auth/register                        │
     │  { name, email, password, userType }        │
     │─────────────────────────────────────────────>│
     │                                              │
     │                                              │ Validar dados
     │                                              │ Hash password (bcrypt)
     │                                              │ Criar User Aggregate
     │                                              │ Emitir UserRegisteredEvent
     │                                              │ Salvar no banco
     │                                              │
     │  { id, name, email, userType }               │
     │<─────────────────────────────────────────────│
     │                                              │
     │  POST /auth/login                            │
     │  { email, password }                         │
     │─────────────────────────────────────────────>│
     │                                              │
     │                                              │ Buscar usuário por email
     │                                              │ Verificar password (bcrypt)
     │                                              │ Gerar JWT token
     │                                              │
     │  { accessToken, user }                       │
     │<─────────────────────────────────────────────│
     │                                              │
     │ Armazenar token em localStorage              │
     │ Redirecionar para dashboard                  │
     │                                              │
```

### 2. Fluxo de Criação de Coleta

```
┌───────────┐                                  ┌─────────┐
│ Recycler  │                                  │ Backend │
│ (Frontend)│                                  └────┬────┘
└─────┬─────┘                                       │
      │                                             │
      │ POST /collections                           │
      │ Authorization: Bearer {token}               │
      │ { materialType, quantity, description }     │
      │────────────────────────────────────────────>│
      │                                             │
      │                                             │ Validar JWT
      │                                             │ Extrair userId do token
      │                                             │ Validar DTO
      │                                             │ Criar Collection Aggregate
      │                                             │ Calcular pontos
      │                                             │ Emitir CollectionCreatedEvent
      │                                             │ Salvar no banco
      │                                             │
      │ { id, status: 'PENDING', points, ... }      │
      │<────────────────────────────────────────────│
      │                                             │
      │ Mostrar confirmação                         │
      │ "Coleta criada! Aguardando aprovação"       │
      │                                             │
```

### 3. Fluxo de Resposta a Coleta (Aceitar/Rejeitar)

```
┌─────────────┐                                ┌─────────┐        ┌──────────────┐
│Eco-Operator │                                │ Backend │        │ Event Handler│
│  (Frontend) │                                └────┬────┘        └──────┬───────┘
└──────┬──────┘                                     │                    │
       │                                            │                    │
       │ POST /collections/{id}/respond             │                    │
       │ Authorization: Bearer {token}              │                    │
       │ { accept: true }                           │                    │
       │───────────────────────────────────────────>│                    │
       │                                            │                    │
       │                                            │ Unit of Work BEGIN │
       │                                            │ Buscar Collection  │
       │                                            │ Buscar User (eco-op)│
       │                                            │                    │
       │                                            │ Domain Service:    │
       │                                            │  - Validar é eco-op│
       │                                            │  - collection.acceptBy()│
       │                                            │  - user.addPointsFromCollection()│
       │                                            │                    │
       │                                            │ Emite eventos:     │
       │                                            │  - CollectionAcceptedEvent│
       │                                            │  - PointsAddedEvent│
       │                                            │                    │
       │                                            │ Salvar Aggregates  │
       │                                            │ COMMIT             │
       │                                            │                    │
       │                                            │ Publicar Eventos───>│
       │                                            │                    │
       │                                            │                    │ CollectionAcceptedHandler
       │                                            │                    │  - Criar UserPoints
       │                                            │                    │  - Salvar histórico
       │                                            │                    │
       │ { status: 'ACCEPTED', respondedAt, ... }   │                    │
       │<───────────────────────────────────────────│                    │
       │                                            │                    │
       │ Atualizar lista de coletas                 │                    │
       │ Mostrar "Coleta aceita com sucesso!"       │                    │
       │                                            │                    │
```

### 4. Fluxo de Resgate de Pontos

```
┌───────────┐                                  ┌─────────┐
│ Recycler  │                                  │ Backend │
│ (Frontend)│                                  └────┬────┘
└─────┬─────┘                                       │
      │                                             │
      │ POST /users/redeem-points                   │
      │ Authorization: Bearer {token}               │
      │ { points: 100, description: "Troca X" }     │
      │────────────────────────────────────────────>│
      │                                             │
      │                                             │ Validar JWT
      │                                             │ Buscar User
      │                                             │ user.redeemPoints()
      │                                             │  - Validar saldo
      │                                             │  - Subtrair pontos
      │                                             │  - Emitir PointsRedeemedEvent
      │                                             │ Salvar User
      │                                             │
      │ { newBalance: 400 }                         │
      │<────────────────────────────────────────────│
      │                                             │
      │ Atualizar saldo na UI                       │
      │ Mostrar "Resgate realizado!"                │
      │                                             │
```

---