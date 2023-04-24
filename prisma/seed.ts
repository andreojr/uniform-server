import { PrismaClient } from '@prisma/client'
import { users, requests } from './data'

const prisma = new PrismaClient()

async function run() {
    await prisma.user.deleteMany()
    await prisma.request.deleteMany()

    await Promise.all(
        users.map(async user => {
            await prisma.user.create({
                data: {
                    id: user.id,
                    nome: user.nome,
                    matricula: user.matricula,
                    curso: user.curso,
                }
            });
        })
    );

    
    await Promise.all(
        requests.map(async request => {
            await prisma.request.create({
                data: {
                    id: request.id,
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