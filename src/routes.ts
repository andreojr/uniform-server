import { FastifyInstance } from "fastify";
import { number, z } from "zod";
import { db } from "./lib/db";
import { User } from "@prisma/client";

export async function routes(server: FastifyInstance) {

    server.get("/etapa-atual", (request, reply) => {
        reply.status(200).send(process.env.ETAPA_ATUAL);
    });

    server.get("/users", async (request, reply) => {
        const users = await db.user.findMany();

        const usersWithPay: Array<User> = [];
        
        await Promise.all(
            users.map(async (user, i) => {
                let userWithPay = {...user, pay: true,count:0};
                const requests = await db.request.findMany({
                    where: { user_id: user.id }
                });
                requests.forEach(async request => {
                    if (!request.pay) userWithPay.pay = false;
                    userWithPay.count++;
                });
                usersWithPay.push(userWithPay);
            })
        );
        
        reply.status(200).send(usersWithPay);
    });

    server.get("/users/generate-pay/:id", async (request, reply) => {
        const searchUserSchema = z.object({
            id: z.string().uuid(),
        });

        const { id } = searchUserSchema.parse(request.params);

        const results = await db.request.findMany({
            where: { user_id: id },
        });
        const allRequests = await db.request.findMany();
        const user = await db.user.findUnique({
            where: { id },
        });

        const count = results.length;

        const precoUnitario = 27;
        const freteTotal = 52.20;

        let frete = Number((freteTotal / allRequests.length).toFixed(2));
        frete = frete * count;

        reply.status(200).send({count, frete});
    });

    server.patch("/users/unpay/:matricula", async (request, reply) => {

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
                    data: { pay: false }
                });
            });

            reply.status(200).send();
        } else {
            reply.status(404).send();
        }
    });
    
    server.patch("/users/pay/:matricula", async (request, reply) => {

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

    server.patch("/users/confirm-requests/:user_id", async (request, reply) => {
        const searchUserSchema = z.object({
            user_id: z.string().uuid(),
        });
        
        const { user_id } = searchUserSchema.parse(request.params);

        await db.user.update({
            where: { id: user_id },
            data: { confirmado: true },
        });

        reply.status(200).send();
    });

    server.post("/requests", async (request, reply) => {

        if (Number(process.env.ETAPA_ATUAL) === 1) {
            const createShirtsSchema = z.object({
                cor: z.string(),
                tamanho: z.string().min(1).max(2),
                modelo: z.enum(["classica", "alternativa"]),
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
        } else reply.status(500).send();

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
                modelo: true,
                cor: true,
                tamanho: true,
                pay: true,
                user: true,
            }
        });
        reply.status(200).send(results);
    });

    server.get("/requests/count", async (request, reply) => {
        const results = await db.request.findMany();
        reply.status(200).send(results.length);
    });

    server.get("/requests/:user_id", async (request, reply) => {

        const getRequestsByUser = z.object({
            user_id: z.string().uuid(),
        });

        const { user_id } = getRequestsByUser.parse(request.params);
        const results = await db.request.findMany({
            where: { user_id },
        });
        reply.status(200).send({ count: results.length, results });
    });

    server.delete("/requests/:id", async (request, reply) => {

        if (Number(process.env.ETAPA_ATUAL) === 1) {
            const getRequestsById = z.object({
                id: z.string().uuid(),
            });
    
            const { id } = getRequestsById.parse(request.params);
            await db.request.delete({ where: { id } })
            reply.status(200).send();
        } else reply.status(500).send();
    });

    server.get("/paypass-verify/:pass", async (request, reply) => {
        const getRequestsById = z.object({
            pass: z.enum([String(process.env.PAYPASS)]),
        });

        const { pass } = getRequestsById.parse(request.params);
        reply.status(200).send();
    });
}
