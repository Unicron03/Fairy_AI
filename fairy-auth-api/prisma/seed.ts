import { PrismaClient, Role } from '@prisma/client'
import { hashPassword } from '../src/utils/hash'

const prisma = new PrismaClient()

async function createUserWithConversations(name: string, email: string, psw: string, role: Role) {
  const hashed = await hashPassword(psw)

  const user = await prisma.user.upsert({
    where: { name },
    update: {},
    create: {
      name,
      email,
      password: hashed,
      role,
    },
  })

  console.log(`✅ Utilisateur ${name} seedé.`)

  // Crée 2 conversations avec des messages pour chaque utilisateur
  for (let i = 1; i <= 2; i++) {
    const conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
      },
    })

    await prisma.message.createMany({
      data: [
        {
          conversationId: conversation.id,
          sender: 'user',
          content: `Question ${i} de ${name} ?`,
          tokens: 15,
          duration: 4,
        },
        {
          conversationId: conversation.id,
          sender: 'assistant',
          content: `Réponse ${i} à ${name}.`,
          tokens: 30,
          duration: 6,
        },
      ],
    })

    console.log(`  ↪️  Conversation ${i} + messages seedés pour ${name}`)
  }
}

async function main() {
  await createUserWithConversations("admin", "admin@example.com", "root", "ADMIN")
  await createUserWithConversations("ev123456", "ev@example.com", "cats", "USER")
}

main()
  .catch((e) => {
    console.error("❌ Erreur dans le seed :", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

// ➜ Exécution : npx ts-node prisma/seed.ts
