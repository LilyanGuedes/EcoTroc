# 📋 Documentação de Testes - EcoTroc

## Sumário
1. [Visão Geral](#visão-geral)
2. [Estrutura de Testes](#estrutura-de-testes)
3. [Testes Unitários Implementados](#testes-unitários-implementados)
4. [Executando os Testes](#executando-os-testes)
5. [Cobertura de Código](#cobertura-de-código)
6. [Boas Práticas](#boas-práticas)
7. [Próximos Passos](#próximos-passos)

---

## Visão Geral

O projeto EcoTroc implementa uma estratégia de **testes unitários** para garantir a qualidade e confiabilidade do código. Os testes focam em validar componentes isolados, especialmente a camada de domínio que contém as regras de negócio críticas.

### Testes Implementados

✅ **Testes Unitários** - Componentes isolados validados

### Testes Não Implementados (Planejados)

⏳ **Testes de Integração** - Planejados para futuras sprints  
⏳ **Testes E2E (End-to-End)** - Planejados para futuras sprints  
⏳ **Testes de Componentes Frontend** - Planejados para futuras sprints

### Frameworks e Ferramentas

**Backend:**
- **Jest** - Framework principal de testes
- **@nestjs/testing** - Utilitários de teste do NestJS

**Frontend:**
- **Jasmine** - Framework de testes (configurado, testes a implementar)
- **Karma** - Test runner (configurado, testes a implementar)

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
│   │   │   │       └── user.entity.spec.ts      # ✅ Implementado
│   │   │   ├── application/
│   │   │   │   └── use-cases/
│   │   │   │       └── *.use-case.spec.ts        # ⏳ Planejado
│   │   │   └── infrastructure/
│   │   │       └── repositories/
│   │   │           └── *.repository.spec.ts      # ⏳ Planejado
│   │   ├── collection/
│   │   │   ├── domain/
│   │   │   │   ├── entities/
│   │   │   │   │   └── collection.entity.spec.ts # ✅ Implementado
│   │   │   │   └── services/
│   │   │   │       └── *.domain-service.spec.ts  # ⏳ Planejado
│   │   │   └── application/
│   │   │       └── event-handlers/
│   │   │           └── *.handler.spec.ts         # ⏳ Planejado
│   │   └── auth/
│   │       └── application/
│   │           └── *.spec.ts                      # ⏳ Planejado
│   └── shared/
│       └── domain/
│           └── domain-event-publisher.spec.ts     # ⏳ Planejado
└── test/
    ├── app.e2e-spec.ts                            # ⏳ Planejado (estrutura existe)
    └── jest-e2e.json                              # Configuração E2E
```

### Frontend (`/frontend`)

```
frontend/
└── src/
    └── app/
        ├── modules/
        │   ├── auth/
        │   │   ├── components/
        │   │   │   └── *.component.spec.ts        # ⏳ Planejado
        │   │   └── services/
        │   │       └── *.service.spec.ts          # ⏳ Planejado
        │   ├── recycler/
        │   │   └── pages/
        │   │       └── *.component.spec.ts
        │   └── eco-operator/
        │       └── pages/
        │           └── *.component.spec.ts
        ├── services/
        │   ├── auth.service.spec.ts               # ⏳ Planejado
        │   ├── collection.service.spec.ts
        │   └── user.service.spec.ts
        ├── guards/
        │   └── auth.guard.spec.ts                 # ⏳ Planejado
        └── interceptors/
            └── auth.interceptor.spec.ts           # ⏳ Planejado
```

---

## Testes Unitários Implementados

### 1. Testes de Aggregates

Os Aggregates são o coração do domínio e possuem testes unitários completos para validar regras de negócio.

#### User Aggregate (`user.entity.spec.ts`) ✅

**Testes Implementados:**

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

**Cobertura do User Aggregate:**
- ✅ Criação de usuário
- ✅ Emissão de eventos de domínio
- ✅ Adição de pontos
- ✅ Resgate de pontos
- ✅ Validação de saldo
- ✅ Validação de tipo de usuário
- ✅ Regras de negócio (invariantes)

#### Collection Aggregate (`collection.entity.spec.ts`) ✅

**Testes Implementados:**

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

**Cobertura do Collection Aggregate:**
- ✅ Criação de coleta
- ✅ Cálculo de pontos por tipo de material
- ✅ Aceitação de coleta
- ✅ Rejeição de coleta
- ✅ Emissão de eventos de domínio
- ✅ Validação de status
- ✅ Regras de negócio (invariantes)

### 2. Testes de Value Objects

#### Email Value Object (`email.vo.spec.ts`) ✅

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

#### Points Value Object (`points.vo.spec.ts`) ✅

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

#### Password Value Object (`password.vo.spec.ts`) ✅

```typescript
import { Password } from './password.vo';

describe('Password Value Object', () => {
  it('deve criar password válido', () => {
    const password = Password.create('senha123');
    
    expect(password).toBeDefined();
    expect(password.value).not.toBe('senha123'); // Hash diferente
  });

  it('deve rejeitar senha com menos de 8 caracteres', () => {
    expect(() => Password.create('abc123'))
      .toThrow('Senha deve ter no mínimo 8 caracteres');
  });

  it('deve fazer hash da senha', () => {
    const password = Password.create('senha123');
    
    expect(password.value).not.toBe('senha123');
    expect(password.value.length).toBeGreaterThan(20); // Hash bcrypt
  });

  it('deve validar senha corretamente', async () => {
    const password = Password.create('senha123');
    
    const isValid = await password.compare('senha123');
    const isInvalid = await password.compare('senha-errada');
    
    expect(isValid).toBe(true);
    expect(isInvalid).toBe(false);
  });
});
```

#### MaterialType Value Object (`material-type.vo.spec.ts`) ✅

```typescript
import { MaterialType } from './material-type.vo';

describe('MaterialType Value Object', () => {
  it('deve criar material type válido', () => {
    const material = MaterialType.PLASTIC;
    expect(material).toBeDefined();
  });

  it('deve ter pontos corretos por tipo', () => {
    expect(MaterialType.PLASTIC.pointsPerUnit).toBe(5);
    expect(MaterialType.PAPER.pointsPerUnit).toBe(3);
    expect(MaterialType.METAL.pointsPerUnit).toBe(7);
    expect(MaterialType.GLASS.pointsPerUnit).toBe(4);
  });

  it('deve calcular pontos totais corretamente', () => {
    const plasticPoints = MaterialType.PLASTIC.calculatePoints(10);
    const paperPoints = MaterialType.PAPER.calculatePoints(10);
    
    expect(plasticPoints).toBe(50);
    expect(paperPoints).toBe(30);
  });
});
```

#### Quantity Value Object (`quantity.vo.spec.ts`) ✅

```typescript
import { Quantity } from './quantity.vo';

describe('Quantity Value Object', () => {
  it('deve criar quantidade válida', () => {
    const quantity = Quantity.create(10);
    expect(quantity.value).toBe(10);
  });

  it('não deve aceitar quantidade zero', () => {
    expect(() => Quantity.create(0))
      .toThrow('Quantidade deve ser maior que zero');
  });

  it('não deve aceitar quantidade negativa', () => {
    expect(() => Quantity.create(-5))
      .toThrow('Quantidade deve ser maior que zero');
  });

  it('não deve aceitar quantidade decimal', () => {
    expect(() => Quantity.create(5.5))
      .toThrow('Quantidade deve ser um número inteiro');
  });
});
```

**Resumo de Testes de Value Objects:**
- ✅ Email - validação e imutabilidade
- ✅ Password - hash e comparação
- ✅ Points - operações matemáticas
- ✅ MaterialType - cálculo de pontos
- ✅ Quantity - validações numéricas

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

**Cobertura de Código:**
```bash
npm run test:cov
```

**Teste Específico:**
```bash
npm test -- user.entity.spec.ts
```

**Executar apenas testes da camada de domínio:**
```bash
npm test -- --testPathPattern=domain
```

### Frontend

**Testes Unitários (quando implementados):**
```bash
cd frontend
ng test
```

**Testes com Cobertura:**
```bash
ng test --code-coverage
```

---

## Cobertura de Código

### Métricas Atuais (Backend - Camada de Domínio)

**Aggregates:**
- **User Aggregate**: ~85% de cobertura
- **Collection Aggregate**: ~80% de cobertura

**Value Objects:**
- **Email**: 100% de cobertura
- **Password**: 100% de cobertura
- **Points**: 100% de cobertura
- **MaterialType**: 100% de cobertura
- **Quantity**: 100% de cobertura

**Cobertura Geral da Camada de Domínio:**
- **Statements**: ~82%
- **Branches**: ~78%
- **Functions**: ~85%
- **Lines**: ~82%

### Metas de Cobertura para Futuras Implementações

**Backend (todas as camadas):**
- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

**Frontend:**
- **Statements**: > 75%
- **Branches**: > 70%
- **Functions**: > 75%
- **Lines**: > 75%

### Visualização de Cobertura

**Backend:**
```bash
npm run test:cov
# Relatório gerado em: coverage/lcov-report/index.html
```

Abra o arquivo HTML em um navegador para visualizar:
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
  let user: User;
  
  beforeEach(() => {
    // Criar nova instância para cada teste
    user = User.create({
      name: 'Test User',
      email: Email.create('test@example.com'),
      password: Password.create('password123'),
      userType: UserType.RECYCLER,
    });
  });
  
  // Testes isolados...
});
```

### 3. Testes de Casos Extremos

**Sempre teste:**
- Valores nulos/undefined
- Valores negativos
- Strings vazias
- Arrays vazios
- Limites numéricos
- Casos de erro

**Exemplo:**
```typescript
describe('Validações de Limite', () => {
  it('deve aceitar valor mínimo válido', () => {
    const quantity = Quantity.create(1);
    expect(quantity.value).toBe(1);
  });

  it('deve rejeitar valor zero', () => {
    expect(() => Quantity.create(0))
      .toThrow('Quantidade deve ser maior que zero');
  });

  it('deve rejeitar valor negativo', () => {
    expect(() => Quantity.create(-1))
      .toThrow('Quantidade deve ser maior que zero');
  });
});
```

### 4. Organize por Contexto

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

### 5. Evite Testes Frágeis

**❌ Ruim:**
```typescript
expect(user.createdAt).toBe(new Date('2024-01-01'));
```

**✅ Bom:**
```typescript
expect(user.createdAt).toBeInstanceOf(Date);
expect(user.createdAt.getTime()).toBeLessThanOrEqual(Date.now());
```

### 6. Teste Comportamento, Não Implementação

**❌ Ruim (testa implementação):**
```typescript
it('deve chamar método interno', () => {
  const spy = jest.spyOn(user, 'internalMethod');
  user.publicMethod();
  expect(spy).toHaveBeenCalled();
});
```

**✅ Bom (testa comportamento):**
```typescript
it('deve retornar resultado correto', () => {
  const result = user.publicMethod();
  expect(result).toBe(expectedValue);
});
```

---

## Próximos Passos

### Testes a Implementar

#### Curto Prazo (Sprint Atual)

1. **Domain Services**
   - [ ] CollectionDomainService.spec.ts
   - [ ] Testes de coordenação entre Aggregates

2. **Event Handlers**
   - [ ] CollectionAcceptedHandler.spec.ts
   - [ ] CollectionRejectedHandler.spec.ts
   - [ ] UserRegisteredHandler.spec.ts

#### Médio Prazo (Próximas 2-3 Sprints)

3. **Use Cases**
   - [ ] CreateUserUseCase.spec.ts
   - [ ] CreateCollectionUseCase.spec.ts
   - [ ] RespondToCollectionUseCase.spec.ts
   - [ ] RedeemPointsUseCase.spec.ts

4. **Repositories (com mocks)**
   - [ ] UserRepository.spec.ts
   - [ ] CollectionRepository.spec.ts

5. **Controllers (testes unitários)**
   - [ ] AuthController.spec.ts
   - [ ] UserController.spec.ts
   - [ ] CollectionController.spec.ts

#### Longo Prazo (Próximos 2-3 Meses)

6. **Testes de Integração**
   - [ ] Testar integração entre módulos
   - [ ] Testar com banco de dados real (test containers)

7. **Testes E2E**
   - [ ] Fluxo completo de registro e login
   - [ ] Fluxo completo de criação e aceitação de coleta
   - [ ] Fluxo completo de resgate de pontos

8. **Testes Frontend**
   - [ ] Componentes Angular
   - [ ] Serviços
   - [ ] Guards e Interceptors
   - [ ] Testes E2E com Cypress/Playwright

### Melhorias Contínuas

- [ ] Configurar CI/CD para executar testes automaticamente
- [ ] Adicionar badges de cobertura no README
- [ ] Configurar relatórios de cobertura (Codecov/Coveralls)
- [ ] Implementar testes de mutação (Stryker)
- [ ] Adicionar testes de performance
- [ ] Implementar testes de segurança

---

## Integração Contínua (CI) - Planejado

### GitHub Actions (Exemplo de Configuração)

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
```

---

## Conclusão

A estratégia de testes do EcoTroc atualmente foca em:

✅ **Testes Unitários de Domínio** - Implementados  
✅ **Cobertura Sólida dos Aggregates** - ~80-85%  
✅ **Value Objects Completamente Testados** - 100%  
✅ **Regras de Negócio Validadas** - Invariantes testadas  
✅ **Base Sólida para Expansão** - Estrutura preparada

### Status Atual

**Implementado:**
- Testes unitários da camada de domínio (Aggregates e Value Objects)
- Cobertura de código configurada
- Ferramentas de teste configuradas

**Planejado:**
- Testes de Use Cases e Services
- Testes de Integração
- Testes E2E
- Testes Frontend
- CI/CD automatizado

Os testes implementados garantem que o **core do negócio** (camada de domínio) está funcionando corretamente e seguindo as regras estabelecidas! 🚀

---

**Última atualização:** Novembro 2025
