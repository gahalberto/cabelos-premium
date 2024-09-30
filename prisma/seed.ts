import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.product.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      name: 'basic',
      description: 'Plano Básico',
      price: 49.0,
      stock: 10000,
    },
  });

  await prisma.product.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      name: 'silver',
      description: 'Plano Silver',
      price: 67.0,
      stock: 1000000,
    },
  });

  await prisma.product.upsert({
    where: { id: 4 },
    update: {},
    create: {
      id: 4,
      name: 'premium',
      description: 'Plano Premium',
      price: 97.0,
      stock: 1000000,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
