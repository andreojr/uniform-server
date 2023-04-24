import { FastifyInstance } from "fastify";
import { number, z } from "zod";
import { db } from "./lib/db";
import { User } from "@prisma/client";

export async function routes(server: FastifyInstance) {

    server.get("/users/pay/:matricula", async (request, reply) => {

        const searchUserSchema = z.object({
            matricula: z.string().regex(/^\d+$/),
        });
        
        const { matricula } = searchUserSchema.parse(request.params);

        const user = await db.user.findUnique({
            where: { matricula }
        });

        if (user) {
            const requests = await db.request.findMany({
                where: { user_id: user.id }
            });

            requests.forEach(async request => {
                await db.request.update({
                    where: { id: request.id },
                    data: { pay: true }
                });
            });

            reply.status(200).send();
        } else {
            reply.status(404).send();
        }
    });

    server.post("/requests", async (request, reply) => {


        const createShirtsSchema = z.object({
            cor: z.string(),
            tamanho: z.string().min(1).max(2),
        });

        const createRequestSchema = z.object({
            nome: z.string(),
            matricula: z.string().regex(/^\d+$/),
            curso: z.string(),
            shirts: z.array(createShirtsSchema),
        });

        const { nome, matricula, curso, shirts } = createRequestSchema.parse(request.body);

        const userExists = await db.user.findUnique({ where: { matricula } });
        let user: User;
        if (!userExists) {
            user = await db.user.create({
                data: {
                    nome,
                    matricula,
                    curso,
                }
            });
        } else {
            user = userExists;
        }
        
        shirts.forEach(async shirt => {
            await db.request.create({
                data: {
                    ...shirt,
                    user_id: user.id,
                }
            })
        });
        reply.status(201).send();
    });

    server.get("/login/:matricula", async (request, reply) => {

        const loginSchema = z.object({
            matricula: z.string().regex(/^\d+$/),
        });
        
        const { matricula } = loginSchema.parse(request.params);

        const result = await db.user.findUnique({
            where: { matricula }
        });

        if (result) reply.status(200).send(result);
        else reply.status(404).send();
    });

    server.get("/requests", async (request, reply) => {
        const results = await db.request.findMany({
            select: {
                id: true,
                cor: true,
                tamanho: true,
                user: true,
            }
        });
        reply.status(200).send(results);
    });

    server.get("/requests/count", async (request, reply) => {
        const results = await db.request.findMany();
        reply.status(200).send(results.length);
    });

    server.get("/requests/:id", async (request, reply) => {

        const getRequestsByUser = z.object({
            id: z.string().uuid(),
        });

        const { id } = getRequestsByUser.parse(request.params);
        const results = await db.request.findMany({
            where: {
                user_id: id
            },
        });
        reply.status(200).send({ count: results.length, results });
    });

    server.delete("/requests/:id", async (request, reply) => {

        const getRequestsById = z.object({
            id: z.string().uuid(),
        });

        const { id } = getRequestsById.parse(request.params);
        await db.request.delete({ where: { id } })
        reply.status(200).send();
    });
}
