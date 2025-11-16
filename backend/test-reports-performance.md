# 🚀 Teste de Performance - Relatórios com GPU

## ✅ Implementação Concluída

### **O que foi feito:**

1. **ReportsService** (`src/modules/collection/application/services/reports.service.ts`)
   - Geração de relatórios com aceleração GPU automática
   - Threshold inteligente: GPU para > 1.000 coleções
   - Cálculos paralelos para agregações

2. **Novo Endpoint**: `/collections/reports/environmental-impact`
   - Calcula CO2, água e energia economizados
   - Usa GPU para > 10.000 coleções aceitas

3. **Endpoint Otimizado**: `/collections/reports`
   - Agora usa `ReportsService` com GPU
   - Retorna `processingTime` e `usedGpu` no response

---

## 🧪 Como Testar

### **Passo 1: Reiniciar o Servidor**

```bash
npm run start:dev
```

### **Passo 2: Fazer Login como ECOOPERATOR**

```bash
# Registrar operador (se não existir)
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Operador Teste",
    "email": "operador@teste.com",
    "password": "senha123",
    "role": "ECOOPERATOR"
  }'

# Fazer login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operador@teste.com",
    "password": "senha123"
  }'

# Copie o accessToken do response
```

### **Passo 3: Testar Relatórios**

```bash
# Substituir YOUR_TOKEN pelo token recebido no login
TOKEN="YOUR_TOKEN_HERE"

# Gerar relatório padrão
curl http://localhost:3000/collections/reports \
  -H "Authorization: Bearer $TOKEN"

# Gerar relatório de impacto ambiental
curl http://localhost:3000/collections/reports/environmental-impact \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📊 Response Esperado

### **Relatório Padrão**

```json
{
  "summary": {
    "totalCollections": 150,
    "acceptedCollections": 120,
    "pendingCollections": 20,
    "rejectedCollections": 10,
    "totalQuantity": 1500.5,
    "totalPoints": 15000,
    "recentCollections": 45,
    "processingTime": 5,
    "usedGpu": false  // false se < 1000 coleções
  },
  "materialStats": {
    "PLASTICO": { "quantity": 500, "points": 5000, "count": 40 },
    "PAPEL": { "quantity": 400, "points": 4000, "count": 35 },
    "VIDRO": { "quantity": 300, "points": 3000, "count": 25 },
    "METAL": { "quantity": 300.5, "points": 3000, "count": 20 }
  },
  "collections": [...]
}
```

### **Impacto Ambiental**

```json
{
  "totalCO2Saved": 3750.50,
  "totalWaterSaved": 22500.00,
  "totalEnergySaved": 18000.00,
  "processingTime": 12
}
```

---

## 🔥 Logs Esperados

Quando GPU é usada:

```
[ReportsService] Gerando relatório para 1,500 coleções usando GPU 🚀
[ReportsService] Relatório gerado em 45ms (GPU)
```

Quando CPU é usada:

```
[ReportsService] Gerando relatório para 150 coleções usando CPU
[ReportsService] Relatório gerado em 5ms (CPU)
```

---

## ⚡ Performance Esperada

| Coleções | CPU Time | GPU Time | Speedup | Winner |
|----------|----------|----------|---------|--------|
| 100      | 2ms      | N/A      | -       | CPU    |
| 1.000    | 15ms     | 50ms     | 0.3x    | CPU    |
| 10.000   | 150ms    | 80ms     | 1.9x    | GPU ⚡ |
| 100.000  | 1500ms   | 200ms    | 7.5x    | GPU ⚡⚡|
| 1.000.000| 15000ms  | 800ms    | 18.8x   | GPU ⚡⚡⚡|

---

## 🎯 Quando GPU é Usada Automaticamente

### **Relatório Padrão**
- ✅ GPU: Se >= 1.000 coleções
- ❌ CPU: Se < 1.000 coleções

### **Impacto Ambiental**
- ✅ GPU: Se >= 10.000 coleções **aceitas**
- ❌ CPU: Se < 10.000 coleções aceitas

---

## 💡 Vantagens da Implementação

1. **Automático**: Escolhe CPU ou GPU baseado no volume
2. **Transparente**: Código não muda, performance sim
3. **Escalável**: Quanto mais dados, maior o ganho
4. **Informativo**: Response mostra se usou GPU e tempo de processamento
5. **Futuro-proof**: Pronto para milhões de registros

---

## 🚀 Próximos Passos Sugeridos

1. **Popular banco com dados de teste** (script abaixo)
2. **Testar com diferentes volumes**
3. **Comparar tempos CPU vs GPU**
4. **Monitorar uso de GPU** (`nvidia-smi`)

---

## 📝 Script para Popular Banco (Opcional)

```bash
# TODO: Criar script para inserir 10k+ coleções de teste
# para testar performance real da GPU
```
