import { PrismaClient, Role } from '@prisma/client'
import { hashPassword } from '../src/utils/hash'

const prisma = new PrismaClient()

async function createUser(name: string, email: string, psw: string, role: Role) {
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

  console.log(`✅ Utilisateur ${name} seedé avec succès.`)
  return user
}

async function createConversationWithMessages(userId: string, index: number) {
  const conv = await prisma.conversation.create({
    data: {
      userId,
      question: `Quelle est la question ${index + 1} ?`,
      answer: `Ceci est la réponse automatique à la question ${index + 1}.`,
      tokens: 42 + index * 3,
      duration: 10 + index * 2,
    },
  })

  console.log(`🗨️  Conversation ${index + 1} créée pour l'utilisateur ${userId}.`)
  return conv
}

async function seedConversationsForUser(userId: string, count: number = 3) {
  for (let i = 0; i < count; i++) {
    await createConversationWithMessages(userId, i)
  }
}

async function main() {
  const admin = await createUser("admin", "admin@example.com", "root", "ADMIN")
  const user = await createUser("ev123456", "ev@example.com", "cats", "USER")

  await seedConversationsForUser(admin.id, 2)
  await seedConversationsForUser(user.id, 3)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

// ➜ Exécution : npx ts-node prisma/seed.ts
