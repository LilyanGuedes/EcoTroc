# Arquitetura DDD - EcoTroc

## Resumo das Implementações DDD

Este documento descreve as mudanças implementadas para transformar o projeto em uma arquitetura DDD completa.

---

## 1. Aggregate Roots

### **User Aggregate** (`src/modules/user/domain/entities/user.entity.ts`)

**Responsabilidades:**
- Gerencia seu próprio saldo de pontos
- Controla adição e resgate de pontos
- Emite eventos de domínio

**Métodos principais:**
- `addPointsFromCollection(collectionId, points)` - Adiciona pontos e emite `PointsAddedEvent`
- `redeemPoints(points, description)` - Resgata pontos e emite `PointsRedeemedEvent`
- Valida invariantes (ex: não permitir saldo negativo)

**Eventos emitidos:**
- `UserRegisteredEvent` - Quando usuário é criado
- `PointsAddedEvent` - Quando pontos são adicionados
- `PointsRedeemedEvent` - Quando pontos são resgatados

---

### **Collection Aggregate** (`src/modules/collection/domain/entities/collection.entity.ts`)

**Responsabilidades:**
- Gerencia ciclo de vida da coleta (PENDING → ACCEPTED/REJECTED)
- Calcula pontos baseado no material
- Valida autorização de aceitação/rejeição

**Métodos principais:**
- `acceptBy(userId)` - Aceita a coleta e emite `CollectionAcceptedEvent`
- `rejectBy(userId, reason)` - Rejeita a coleta e emite `CollectionRejectedEvent`
- Valida que apenas o dono pode responder

**Eventos emitidos:**
- `CollectionCreatedEvent` - Quando coleta é criada
- `CollectionAcceptedEvent` - Quando coleta é aceita
- `CollectionRejectedEvent` - Quando coleta é rejeitada

---

## 2. Value Objects

Todos os Value Objects são **imutáveis** e **validados no construtor**:

- **Email** - Valida formato de email
- **Password** - Hash bcrypt, mínimo 8 caracteres
- **Points** - Não permite valores negativos, apenas inteiros
- **Quantity** - Maior que zero, apenas inteiros
- **MaterialType** - Enum de materiais com pontos por unidade

---

## 3. Domain Services

### **CollectionDomainService** (`src/modules/collection/domain/services/collection.domain-service.ts`)

Coordena operações entre múltiplos Aggregates (User e Collection).

**Métodos:**
```typescript
processCollectionResponse(collection, user, accept, reason)
```
- Valida que usuário é reciclador
- Aceita/rejeita a coleta
- Adiciona pontos ao usuário (se aceito)
- Mantém consistência entre os dois Aggregates

---

## 4. Domain Events

### **Eventos Implementados:**

**User Events:**
- `UserRegisteredEvent` - Usuário criado
- `PointsAddedEvent` - Pontos adicionados
- `PointsRedeemedEvent` - Pontos resgatados

**Collection Events:**
- `CollectionCreatedEvent` - Coleta criada
- `CollectionAcceptedEvent` - Coleta aceita
- `CollectionRejectedEvent` - Coleta rejeitada

### **Infraestrutura de Eventos:**

**DomainEventPublisher** (`src/shared/domain/domain-event-publisher.ts`)
- Gerencia registro e publicação de eventos
- Permite handlers assíncronos
- Trata erros sem interromper o fluxo

---

## 5. Event Handlers

### **CollectionAcceptedHandler**
- Cria registro de transação em `UserPoints`
- Mantém histórico de pontos ganhos

### **CollectionRejectedHandler**
- Faz logging da rejeição
- Pode enviar notificações (futuro)

### **UserRegisteredHandler**
- Faz logging de novo usuário
- Pode enviar email de boas-vindas (futuro)

---

## 6. Unit of Work Pattern

### **UnitOfWork** (`src/shared/infrastructure/unit-of-work.ts`)

Garante **consistência transacional** e **publicação de eventos após commit**.

**Fluxo:**
1. Inicia transação
2. Executa operações de domínio
3. Persiste Aggregates
4. **Commit**
5. Publica eventos (somente se commit sucesso)
6. Limpa eventos dos Aggregates

**Vantagens:**
- Consistência ACID
- Eventos publicados apenas se operação suceder
- Rollback automático em caso de erro

---

## 7. Estrutura de Camadas

```
src/modules/{module}/
├── domain/                    # Camada de Domínio (regras de negócio)
│   ├── entities/             # Aggregates e Entities
│   ├── value-objects/        # Value Objects
│   ├── services/             # Domain Services
│   └── repositories/         # Interfaces de repositórios
├── application/              # Camada de Aplicação (casos de uso)
│   ├── use-cases/           # Use Cases (orquestração)
│   ├── dto/                 # DTOs de entrada/saída
│   └── event-handlers/      # Handlers de eventos
├── infrastructure/          # Camada de Infraestrutura
│   ├── orm/                # Entidades ORM (TypeORM)
│   └── repositories/       # Implementações concretas
└── interface/              # Camada de Interface
    └── controllers/        # Controllers REST
```

---

## 8. Fluxo de Resposta a Coleta (Exemplo Completo)

### **Antes (SEM DDD):**
```typescript
// Use Case fazia TUDO:
- Buscar collection
- Validar usuário
- Aceitar/rejeitar
- Criar UserPoints
- Salvar collection
- Salvar userPoints
```

### **Depois (COM DDD):**

#### **1. Controller**
```typescript
@Post(':id/respond')
async respond(@Param('id') id, @Body() dto, @Request() req) {
  return await respondToCollectionUseCase.execute({
    collectionId: id,
    userId: req.user.id,
    accept: dto.accept,
    reason: dto.reason,
  });
}
```

#### **2. Use Case (Orquestração)**
```typescript
async execute(dto) {
  return await unitOfWork.execute(async (manager) => {
    // Buscar Aggregates
    const collection = await collectionRepo.findById(dto.collectionId);
    const user = await userRepo.findById(dto.userId);

    // Lógica de domínio
    collectionDomainService.processCollectionResponse(
      collection, user, dto.accept, dto.reason
    );

    // Persistir dentro da transação
    await manager.save(collection);
    await manager.save(user);

    return { result, aggregates: [collection, user] };
  });
  // UnitOfWork publica eventos após commit
}
```

#### **3. Domain Service**
```typescript
processCollectionResponse(collection, user, accept, reason) {
  // Validações de domínio
  if (!user.isRecycler()) throw new Error('...');

  if (accept) {
    collection.acceptBy(user.id);        // Emite CollectionAcceptedEvent
    user.addPointsFromCollection(        // Emite PointsAddedEvent
      collection.id,
      collection.points
    );
  } else {
    collection.rejectBy(user.id, reason); // Emite CollectionRejectedEvent
  }
}
```

#### **4. Aggregates**
```typescript
// Collection Aggregate
acceptBy(userId) {
  if (this._userId !== userId) throw new Error('...');
  if (this._status !== PENDING) throw new Error('...');

  this._status = ACCEPTED;
  this._respondedAt = new Date();

  this.addDomainEvent(new CollectionAcceptedEvent(...));
}

// User Aggregate
addPointsFromCollection(collectionId, points) {
  if (points <= 0) throw new Error('...');

  this._pointsBalance = this._pointsBalance.add(Points.create(points));

  this.addDomainEvent(new PointsAddedEvent(...));
}
```

#### **5. Event Handlers (Após Commit)**
```typescript
// CollectionAcceptedHandler
async handle(event: CollectionAcceptedEvent) {
  // Criar registro de transação
  const pointsTransaction = UserPoints.createFromCollection({...});
  await userPointsRepo.create(pointsTransaction);
}
```

---

## 9. Princípios DDD Aplicados

✅ **Aggregates** - User e Collection são Aggregate Roots
✅ **Value Objects** - Email, Password, Points, Quantity, MaterialType
✅ **Domain Events** - 6 eventos implementados
✅ **Domain Services** - CollectionDomainService coordena Aggregates
✅ **Repository Pattern** - Interfaces no domínio, implementação na infra
✅ **Unit of Work** - Consistência transacional
✅ **Ubiquitous Language** - Nomes refletem o domínio (Recycler, EcoOperator, Collection)
✅ **Separation of Concerns** - Camadas bem definidas

---

## 10. Vantagens da Arquitetura DDD

### **Antes:**
- Lógica de negócio espalhada nos Use Cases
- Sem garantia de consistência entre User e Collection
- Eventos publicados mesmo se transação falhar
- Difícil manutenção e testes

### **Depois:**
- Lógica centralizada no domínio (Aggregates e Domain Services)
- Consistência garantida pelo Unit of Work
- Eventos publicados apenas após commit bem-sucedido
- Código mais testável e manutenível
- Agregates ricos com comportamento próprio
- Histórico completo via eventos

---

## 11. Próximos Passos Sugeridos

1. **Event Sourcing** (opcional) - Armazenar todos os eventos para auditoria completa
2. **CQRS** - Separar comandos de queries para melhor performance
3. **Sagas** - Processos longos e distribuídos
4. **Integration Events** - Comunicação com outros sistemas
5. **Testes de Domínio** - Garantir invariantes e regras de negócio

---

## 12. Como Usar

### **Criar novo Aggregate:**
```typescript
export class MyAggregate extends AggregateRoot {
  // ... propriedades privadas

  static create(params) {
    const aggregate = new MyAggregate(...);
    aggregate.addDomainEvent(new MyCreatedEvent(...));
    return aggregate;
  }

  doSomething() {
    // lógica de domínio
    this.addDomainEvent(new SomethingDoneEvent(...));
  }
}
```

### **Criar Domain Event:**
```typescript
export class MyEvent extends DomainEvent {
  constructor(
    public readonly aggregateId: string,
    public readonly data: any,
  ) {
    super();
  }
}
```

### **Usar Unit of Work:**
```typescript
await unitOfWork.execute(async (manager) => {
  // buscar aggregates
  // executar lógica de domínio
  // persistir

  return { result, aggregates: [aggregate1, aggregate2] };
});
// Eventos publicados automaticamente após commit
```

---

**Arquitetura implementada por: Claude Code**
**Data: 2025-10-03**
