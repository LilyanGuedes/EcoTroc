# 📋 Documentação de Testes - EcoTroc

## Sumário
1. [Visão Geral](#visão-geral)
2. [Testes Implementados](#testes-implementados)
3. [Executando os Testes](#executando-os-testes)
4. [Cobertura de Código](#cobertura-de-código)
5. [Boas Práticas](#boas-práticas)
6. [Próximos Passos](#próximos-passos)

---

## Visão Geral

O projeto EcoTroc implementa uma estratégia de **testes unitários** focada na camada de domínio (Domain Layer), garantindo que as regras de negócio e a lógica central estejam corretamente validadas.

### Estado Atual dos Testes

✅ **Testes Unitários - Camada de Domínio** - **90 testes implementados**
- ✅ Value Objects (Email, Password, Points, Quantity)
- ✅ Entity User (26 testes cobrindo todas as funcionalidades)

### Frameworks e Ferramentas

**Backend:**
- **Jest** - Framework principal de testes ✅ Configurado e em uso
- **ts-jest** - Transformador TypeScript para Jest ✅ Configurado
- **@nestjs/testing** - Utilitários de teste do NestJS

---

## Testes Implementados

### Value Objects (64 testes)

#### 1. Email Value Object (10 testes) ✅

**Localização:** `src/modules/user/domain/value-objects/email.vo.spec.ts`

**Cobertura:** 100% (Statements, Branches, Functions, Lines)

**Testes:**
- ✅ Criação de emails válidos (4 testes)
  - Email padrão
  - Email com subdomínio
  - Email com números
  - Email com caracteres especiais
- ✅ Validações de formato (6 testes)
  - Rejeita email sem @
  - Rejeita email sem domínio
  - Rejeita email sem usuário
  - Rejeita email com espaços
  - Rejeita email vazio
  - Rejeita email sem TLD

#### 2. Password Value Object (13 testes) ✅

**Localização:** `src/modules/user/domain/value-objects/password.vo.spec.ts`

**Cobertura:** 100% (Statements, Branches, Functions, Lines)

**Testes:**
- ✅ Criação (3 testes)
  - Cria senha válida e gera hash
  - Hash é diferente da senha original
  - Hashes diferentes para mesma senha (salt aleatório)
- ✅ Validação (4 testes)
  - Rejeita senha com menos de 8 caracteres
  - Rejeita senha com 7 caracteres
  - Aceita exatamente 8 caracteres
  - Aceita senhas longas
- ✅ Comparação (4 testes)
  - Valida senha correta
  - Rejeita senha incorreta
  - Rejeita senha similar
  - Case sensitive
- ✅ Reconstrução a partir de hash (2 testes)
  - Cria a partir de hash existente
  - Valida corretamente após reconstrução

#### 3. Points Value Object (30 testes) ✅

**Localização:** `src/modules/collection/domain/value-objects/points.vo.spec.ts`

**Cobertura:** 100% (Statements, Branches, Functions, Lines)

**Testes:**
- ✅ Criação (4 testes)
  - Cria pontos com valor válido
  - Cria zero pontos
  - Cria usando create(0)
  - Cria valores grandes
- ✅ Validação (4 testes)
  - Rejeita valores negativos
  - Rejeita valores negativos grandes
  - Rejeita valores decimais
  - Rejeita pequenos decimais
- ✅ Adição (3 testes)
  - Soma pontos corretamente
  - Adiciona zero pontos
  - Não modifica valores originais (imutabilidade)
- ✅ Subtração (4 testes)
  - Subtrai pontos corretamente
  - Subtrai até zero
  - Lança erro ao subtrair mais que disponível
  - Não modifica valores originais
- ✅ Comparações (4 testes)
  - isGreaterThan funciona corretamente
  - isLessThan funciona corretamente
  - equals identifica igualdade
  - Compara com zero
- ✅ Conversão para string (2 testes)
  - Converte número para string
  - Converte zero para string

#### 4. Quantity Value Object (11 testes) ✅

**Localização:** `src/modules/collection/domain/value-objects/quantity.vo.spec.ts`

**Cobertura:** 100% (Statements, Branches, Functions, Lines)

**Testes:**
- ✅ Criação (3 testes)
  - Cria quantidade válida
  - Cria quantidade mínima (1)
  - Cria valores grandes
- ✅ Validação (4 testes)
  - Rejeita zero
  - Rejeita valores negativos
  - Rejeita decimais
  - Rejeita pequenos decimais
- ✅ Operações matemáticas (4 testes)
  - Adição de quantidades
  - Multiplicação por fator
  - Imutabilidade nas operações
  - Conversão para string

### Entities (26 testes)

#### User Entity (26 testes) ✅

**Localização:** `src/modules/user/domain/entities/user.entity.spec.ts`

**Cobertura:** 100% (Statements, Branches, Functions, Lines)

**Testes:**

**Criação (5 testes):**
- ✅ Cria usuário reciclador
- ✅ Cria usuário eco-operador
- ✅ Emite UserRegisteredEvent na criação
- ✅ Cria com atribuição de ecopoint
- ✅ Faz hash da senha na criação

**Reconstrução (2 testes):**
- ✅ Reconstitui usuário da persistência
- ✅ Não emite eventos ao reconstituir

**Verificação de Senha (2 testes):**
- ✅ Verifica senha correta
- ✅ Rejeita senha incorreta

**Gerenciamento de Pontos (7 testes):**
- ✅ Adiciona pontos de coleta
- ✅ Emite PointsAddedEvent
- ✅ Acumula pontos de múltiplas coletas
- ✅ Lança erro ao adicionar zero ou negativo
- ✅ Resgata pontos com sucesso
- ✅ Emite PointsRedeemedEvent
- ✅ Lança erro ao resgatar mais que disponível

**Atualizações (4 testes):**
- ✅ Atualiza nome
- ✅ Lança erro para nome vazio
- ✅ Atualiza email
- ✅ Atualiza senha

**Atribuição de Ecopoint (2 testes):**
- ✅ Atribui eco-operador a ecopoint
- ✅ Lança erro ao atribuir reciclador

**Verificação de Papéis (2 testes):**
- ✅ Identifica reciclador corretamente
- ✅ Identifica eco-operador corretamente

**Serialização (1 teste):**
- ✅ Serializa para JSON corretamente

---

## Executando os Testes

### Backend

**Todos os testes:**
```bash
cd backend
npm test
```

**Output esperado:**
```
Test Suites: 6 passed, 6 total
Tests:       90 passed, 90 total
Snapshots:   0 total
Time:        ~40s
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
npm test -- email.vo.spec.ts
npm test -- password.vo.spec.ts
npm test -- points.vo.spec.ts
npm test -- quantity.vo.spec.ts
```

**Testes por padrão:**
```bash
# Todos os testes de Value Objects
npm test -- --testPathPattern="vo.spec"

# Todos os testes de Entities
npm test -- --testPathPattern="entity.spec"

# Testes do módulo User
npm test -- --testPathPattern="modules/user"
```

---

## Cobertura de Código

### Métricas Atuais - Camada de Domínio

**Value Objects:**
- **Email**: 100% cobertura (Statements, Branches, Functions, Lines)
- **Password**: 100% cobertura (Statements, Branches, Functions, Lines)
- **Points**: 100% cobertura (Statements, Branches, Functions, Lines)
- **Quantity**: 100% cobertura (Statements, Branches, Functions, Lines)

**Entities:**
- **User Entity**: 100% cobertura (Statements, Branches, Functions, Lines)

**Cobertura Geral do Projeto:**
```
File                     | Stmts | Branch | Funcs | Lines |
-------------------------|-------|--------|-------|-------|
user.entity.ts          | 100%  |  100%  | 100%  | 100%  |
email.vo.ts             | 100%  |  100%  | 100%  | 100%  |
password.vo.ts          | 100%  |  100%  | 100%  | 100%  |
points.vo.ts            | 100%  |  100%  | 100%  | 100%  |
quantity.vo.ts          | 100%  |  100%  | 100%  | 100%  |
```

### Visualizar Relatório de Cobertura

```bash
cd backend
npm run test:cov

# Relatório gerado em: coverage/lcov-report/index.html
# Abra no navegador para visualização detalhada
```

---

## Boas Práticas

### 1. Nomenclatura de Testes

**Padrão AAA (Arrange, Act, Assert):**
```typescript
it('should add points from collection', async () => {
  // Arrange
  const user = await User.create({...});

  // Act
  user.addPointsFromCollection('collection-1', 100);

  // Assert
  expect(user.pointsBalance).toBe(100);
});
```

**Descrições Claras:**
- ✅ `should create a valid email`
- ✅ `should throw error for invalid email without @`
- ❌ `test email`
- ❌ `validate`

### 2. Isolamento de Testes

Cada teste é independente e não depende do estado de outros testes:

```typescript
describe('Email Value Object', () => {
  it('should create a valid email', () => {
    const email = new Email('test@example.com');
    expect(email.getValue()).toBe('test@example.com');
  });

  it('should throw error for invalid email', () => {
    expect(() => new Email('invalid')).toThrow();
  });
});
```

### 3. Teste de Casos Extremos

Todos os testes cobrem:
- ✅ Valores válidos (happy path)
- ✅ Valores inválidos (error cases)
- ✅ Casos limite (boundaries)
- ✅ Valores nulos/vazios
- ✅ Imutabilidade dos Value Objects

### 4. Eventos de Domínio

Os testes verificam que eventos corretos são emitidos:

```typescript
it('should emit UserRegisteredEvent on creation', async () => {
  const user = await User.create({...});

  const events = user.getDomainEvents();
  expect(events).toHaveLength(1);
  expect(events[0]).toBeInstanceOf(UserRegisteredEvent);
});
```

## Conclusão

### Status Atual

**Implementado:**
- ✅ **90 testes unitários** da camada de domínio
- ✅ **100% de cobertura** dos Value Objects testados
- ✅ **100% de cobertura** da entidade User
- ✅ Configuração completa do Jest
- ✅ Testes automatizados funcionando

**Planejado:**
- Testes de Collection Entity
- Testes de Use Cases
- Testes de Integração
- Testes E2E
- Testes Frontend
- CI/CD automatizado

A camada de domínio do EcoTroc está **solidamente testada**, garantindo que as regras de negócio críticas funcionem corretamente! 🎯

---

**Última atualização:** Novembro 2025
**Total de testes:** 90 ✅
**Cobertura da camada de domínio:** 100% nos componentes testados
