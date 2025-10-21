# Atualização do Banco de Dados - Endereços de Entrega

## Novidades Adicionadas

Foi adicionado um novo modelo `ShippingAddress` para gerenciar endereços de entrega dos usuários.

## Modelo Adicionado

```prisma
model ShippingAddress {
  id          String   @id @default(cuid())
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  name        String   // Nome para entrega
  phone       String   // Telefone para entrega
  street      String   // Rua
  number      String   // Número
  complement  String?  // Complemento (opcional)
  neighborhood String  // Bairro
  city        String   // Cidade
  state       String   // Estado
  zipCode     String   // CEP
  isDefault   Boolean  @default(false) // Endereço padrão
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

## Relação Adicionada

No modelo `User`, foi adicionada a relação:
```prisma
shippingAddresses ShippingAddress[]
```

## Como Aplicar as Mudanças

### 1. Gerar e Aplicar a Migração

```bash
# Gerar a migração
npx prisma migrate dev --name add_shipping_addresses

# Ou se preferir apenas aplicar as mudanças sem criar migração
npx prisma db push
```

### 2. Regenerar o Cliente Prisma

```bash
npx prisma generate
```

### 3. Verificar se as Mudanças Foram Aplicadas

```bash
npx prisma studio
```

## Funcionalidades Implementadas

- ✅ CRUD completo de endereços de entrega
- ✅ Definição de endereço padrão
- ✅ Validação de dados
- ✅ Interface responsiva com tabela
- ✅ Formulário de criação/edição
- ✅ Integração com a página de conta

## Componentes Criados

- `ShippingAddressManager` - Componente principal para gerenciar endereços
- Ações do servidor para CRUD de endereços
- Integração na página `/account`

## Estrutura dos Dados

Cada endereço inclui:
- **Informações de Contato**: Nome e telefone para entrega
- **Endereço Completo**: Rua, número, complemento, bairro, cidade, estado e CEP
- **Configurações**: Endereço padrão, timestamps de criação/atualização

## Segurança

- Usuários só podem acessar e modificar seus próprios endereços
- Validação de dados no servidor
- Relação com cascade delete (endereços são removidos quando o usuário é deletado) 