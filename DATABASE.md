# Configuração do Banco de Dados - Cabelos Premium

## PostgreSQL com Docker

O projeto utiliza PostgreSQL como banco de dados, configurado para rodar em containers Docker.

### Configuração

1. **Docker Compose**: O arquivo `docker-compose.yml` está configurado com:
   - PostgreSQL 15
   - Banco de dados: `cabelos_premium`
   - Usuário: `postgres`
   - Senha: `postgres123`
   - Porta: `5432`

2. **Variáveis de Ambiente**: O arquivo `.env` contém todas as configurações necessárias:
   - `DATABASE_URL`: String de conexão com o PostgreSQL
   - `NEXTAUTH_SECRET`: Chave secreta para NextAuth.js
   - Configurações para MercadoPago, Stripe, etc.

### Comandos Úteis

#### Iniciar o banco de dados:
```bash
docker-compose up -d
```

#### Parar o banco de dados:
```bash
docker-compose down
```

#### Verificar logs do container:
```bash
docker-compose logs postgres
```

#### Acessar o banco via psql:
```bash
docker exec -it cabelos-premium-postgres psql -U postgres -d cabelos_premium
```

### Prisma

#### Gerar o Prisma Client:
```bash
npx prisma generate
```

#### Sincronizar schema com o banco:
```bash
npx prisma db push
```

#### Executar migrações:
```bash
npx prisma migrate dev
```

#### Popular banco com dados iniciais:
```bash
npm run seed
```

#### Visualizar dados no Prisma Studio:
```bash
npx prisma studio
```

### Schema do Banco

O schema inclui as seguintes entidades principais:

- **User**: Usuários do sistema (clientes, especialistas e admins)
  - Tipos de usuário: CLIENTE (padrão), ESPECIALISTA, ADMIN
- **Category**: Categorias de produtos
- **Product**: Produtos (extensões, perucas, mega hair, etc.)
- **Order**: Pedidos
- **OrderItem**: Itens dos pedidos
- **Review**: Avaliações dos produtos
- **WishlistItem**: Lista de desejos
- **CartItem**: Carrinho de compras

### Tipos de Usuário

- **CLIENTE**: Padrão para novos registros, pode comprar produtos
- **ESPECIALISTA**: Profissionais que podem oferecer serviços
- **ADMIN**: Administradores do sistema

### Dados Iniciais

O seed cria:
- 4 categorias padrão (Extensões, Perucas, Mega Hair, Acessórios)
- 4 produtos de exemplo
- 1 usuário administrador (admin@cabelospremium.com)

### Próximos Passos

1. Configure as variáveis de ambiente no `.env` com suas credenciais reais
2. Ajuste o schema conforme necessário para seu negócio
3. Implemente as APIs de CRUD para cada entidade
4. Configure NextAuth.js para autenticação
5. Integre com MercadoPago/Stripe para pagamentos
