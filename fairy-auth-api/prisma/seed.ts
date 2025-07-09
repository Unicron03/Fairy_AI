import { PrismaClient, Role } from '@prisma/client'
import { hashPassword } from '../src/utils/hash'

const prisma = new PrismaClient()

async function createUser(name: string, email: string, psw: string, role: Role) {
    const hashed = await hashPassword(psw)

    await prisma.user.upsert({
        where: { name: name },
        update: {},
        create: {
            name: name,
            email: email,
            password: hashed,
            role: role
        }
    })

    console.log(`✅ Utilisateur ${name} seedé avec succès.`)
}

async function main() {
    createUser("admin", "admin@example.com", "root", "ADMIN")
    createUser("ev123456", "ev@example.com", "cats", "USER")
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

// npx ts-node prisma/seed.ts