import { PrismaClient } from '@prisma/client'
import { users, requests } from './dataForms'

const prisma = new PrismaClient()

async function run() {

    await Promise.all(
        users.map(async user => {
            await prisma.user.create({
                data: {
                    nome: user.nome,
                    matricula: user.matricula,
                    curso: user.curso,
                }
            })
        })
    );

    await Promise.all(
        requests.map(async request => {

            const user = await prisma.user.findUnique({
                where: {
                    matricula: request.matricula,
                }
            })

            if (user) {
                await prisma.request.create({
                    data: {
                        cor: request.cor,
                        modelo: request.modelo,
                        tamanho: request.tamanho,
                        user_id: user.id
                    }
                });
            }
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