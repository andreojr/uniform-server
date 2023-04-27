import { PrismaClient } from '@prisma/client'
import { requests } from './dataForms'

const prisma = new PrismaClient()

async function run() {

    await Promise.all(
        requests.map(async request => {
            await prisma.request.create({
                data: {
                    modelo: request.modelo,
                    cor: request.cor,
                    tamanho: request.tamanho,
                    user_id: request.user_id,
                }
            })
        })
    );
    
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