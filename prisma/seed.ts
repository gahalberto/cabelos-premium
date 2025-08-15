import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar categorias
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'extensoes' },
      update: {},
      create: {
        name: 'Extensões',
        slug: 'extensoes',
        description: 'Extensões de cabelo natural brasileiro',
        image: '/images/categoria-extensoes.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'perucas' },
      update: {},
      create: {
        name: 'Perucas',
        slug: 'perucas',
        description: 'Perucas de cabelo natural e sintético',
        image: '/images/categoria-perucas.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'mega-hair' },
      update: {},
      create: {
        name: 'Mega Hair',
        slug: 'mega-hair',
        description: 'Mega hair para alongamento e volume',
        image: '/images/categoria-mega-hair.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'acessorios' },
      update: {},
      create: {
        name: 'Acessórios',
        slug: 'acessorios',
        description: 'Acessórios para cuidado e manutenção',
        image: '/images/categoria-acessorios.jpg',
      },
    }),
  ])

  console.log('✅ Categorias criadas:', categories.length)

  // Criar produtos de exemplo
  const products = await Promise.all([
    prisma.product.upsert({
      where: { slug: 'extensao-lisa-60cm-castanho' },
      update: {},
      create: {
        name: 'Extensão Lisa 60cm - Castanho',
        slug: 'extensao-lisa-60cm-castanho',
        description: 'Extensão de cabelo natural brasileiro, textura lisa, 60cm de comprimento na cor castanho natural.',
        price: 299.90,
        salePrice: 249.90,
        sku: 'EXT-LISA-60-CAST',
        stock: 50,
        images: [
          '/images/produtos/extensao-lisa-castanho-1.jpg',
          '/images/produtos/extensao-lisa-castanho-2.jpg',
        ],
        isActive: true,
        isFeatured: true,
        isNew: true,
        length: '60cm',
        texture: 'Lisa',
        color: 'Castanho',
        weight: '100g',
        origin: 'Brasil - Sul',
        categoryId: categories[0].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'peruca-ondulada-media-loiro' },
      update: {},
      create: {
        name: 'Peruca Ondulada Média - Loiro',
        slug: 'peruca-ondulada-media-loiro',
        description: 'Peruca de cabelo natural com ondas naturais, comprimento médio na cor loiro dourado.',
        price: 599.90,
        salePrice: 499.90,
        sku: 'PER-OND-MED-LOIRO',
        stock: 25,
        images: [
          '/images/produtos/peruca-ondulada-loiro-1.jpg',
          '/images/produtos/peruca-ondulada-loiro-2.jpg',
        ],
        isActive: true,
        isFeatured: true,
        length: 'Média (45cm)',
        texture: 'Ondulada',
        color: 'Loiro Dourado',
        weight: '150g',
        origin: 'Brasil - Sul',
        categoryId: categories[1].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'mega-hair-cacheado-80cm-preto' },
      update: {},
      create: {
        name: 'Mega Hair Cacheado 80cm - Preto',
        slug: 'mega-hair-cacheado-80cm-preto',
        description: 'Mega hair com cachos definidos, 80cm de comprimento na cor preta natural.',
        price: 399.90,
        sku: 'MEGA-CACH-80-PRETO',
        stock: 30,
        images: [
          '/images/produtos/mega-hair-cacheado-preto-1.jpg',
          '/images/produtos/mega-hair-cacheado-preto-2.jpg',
        ],
        isActive: true,
        isFeatured: false,
        isNew: true,
        length: '80cm',
        texture: 'Cacheado',
        color: 'Preto',
        weight: '120g',
        origin: 'Brasil - Sul',
        categoryId: categories[2].id,
      },
    }),
    prisma.product.upsert({
      where: { slug: 'shampoo-cabelo-natural' },
      update: {},
      create: {
        name: 'Shampoo para Cabelo Natural',
        slug: 'shampoo-cabelo-natural',
        description: 'Shampoo específico para cuidado de extensões e cabelos naturais.',
        price: 49.90,
        sku: 'SHAM-NAT-250ML',
        stock: 100,
        images: [
          '/images/produtos/shampoo-natural-1.jpg',
        ],
        isActive: true,
        categoryId: categories[3].id,
      },
    }),
  ])

  console.log('✅ Produtos criados:', products.length)

  // Criar usuário admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@cabelospremium.com' },
    update: {},
    create: {
      name: 'Administrador',
      email: 'admin@cabelospremium.com',
      role: 'ADMIN',
    },
  })

  console.log('✅ Usuário admin criado:', adminUser.email)

  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro durante o seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
