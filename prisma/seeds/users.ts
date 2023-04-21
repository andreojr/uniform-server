import { PrismaClient } from '@prisma/client'
import { users } from '../data'

const prisma = new PrismaClient()

async function run() {
    await prisma.user.deleteMany()

    users.forEach(async user => {
        await Promise.all([
            prisma.user.create({
                data: {
                    id: user.id,
                    nome: user.nome,
                    matricula: user.matricula,
                    curso: user.curso,
                }
            })
        ]);
    });

}

run()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })