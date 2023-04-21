import { PrismaClient } from '@prisma/client'
import { requests } from '../data'

const prisma = new PrismaClient()

async function run() {
    await prisma.request.deleteMany()

    requests.forEach(async request => {
        await Promise.all([
            prisma.request.create({
                data: {
                    id: request.id,
                    cor: request.cor,
                    tamanho: request.tamanho,
                    user_id: request.user_id,
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