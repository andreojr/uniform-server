import { FastifyInstance } from "fastify";
import { number, z } from "zod";
import { db } from "./lib/db";

export async function routes(server: FastifyInstance) {

    server.post("/requests", async (request, reply) => {


        const createShirtsSchema = z.object({
            cor: z.string(),
        });

        const createRequestSchema = z.object({
            nome: z.string(),
            matricula: z.string().regex(/^\d+$/),
            curso: z.string(),
            tamanho: z.string().length(1),
            shirts: z.array(createShirtsSchema),
        });

        const { nome, matricula, curso, tamanho, shirts } = createRequestSchema.parse(request.body);

        const user = await db.user.create({
            data: {
                nome,
                matricula,
                curso,
                tamanho,
            }
        });
        
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
                user: true,
            }
        });
        reply.status(200).send(results);
    });

    server.get("/requests/count", async (request, reply) => {
        const results = await db.request.findMany();
        reply.status(200).send(results.length);
    });
}
