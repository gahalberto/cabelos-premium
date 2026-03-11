const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

async function main() {
  const sql = fs.readFileSync('/var/www/cabelos-premium/prisma/migrations/20260310000001_vendedor_activity_log/migration.sql', 'utf8');
  const prisma = new PrismaClient();
  try {
    const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0 && !s.startsWith('--'));
    for (const stmt of statements) {
      process.stdout.write('Running: ' + stmt.substring(0, 60) + '\n');
      await prisma.$executeRawUnsafe(stmt + ';');
    }
    process.stdout.write('Migration applied successfully\n');
  } catch (e) {
    process.stderr.write('Error: ' + e.message + '\n');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}
main();
