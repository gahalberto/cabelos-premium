const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs'); // ou 'bcrypt' dependendo do seu package.json

const prisma = new PrismaClient();

async function main() {
  const email = "admin@cabelospremium.com";
  const newPassword = "admcabelos";
  
  // Gerando o hash com salt 12 conforme solicitado
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);

  try {
    const user = await prisma.user.update({
      where: { email: email },
      data: { password: hashedNewPassword },
    });
    console.log(`✅ Senha do usuário ${email} atualizada com sucesso!`);
  } catch (error) {
    console.error("❌ Erro ao atualizar: Usuário não encontrado ou erro no banco.");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
