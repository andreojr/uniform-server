import { FastifyInstance } from "fastify";
import { number, z } from "zod";
import { db } from "./lib/db";

export async function routes(server: FastifyInstance) {

    server.post("/requests", async (request, reply) => {

        const createRequestSchema = z.object({
            nome: z.string(),
            matricula: z.string().regex(/^\d+$/),
            curso: z.string(),
            tamanho: z.string().length(1),
            cor: z.string(),
            quantidade: z.number().int(),
        });

        const data = createRequestSchema.parse(request.body);

        await db.request.create({ data });
        reply.status(201).send();
    });

    server.get("/login/:matricula", async (request, reply) => {

        const loginSchema = z.object({
            matricula: z.string().regex(/^\d+$/),
        });
        
        const { matricula } = loginSchema.parse(request.params);

        const result = await db.request.findUnique({
            where: { matricula }
        });

        if (result) reply.status(200).send(result);
        else reply.status(404).send();
    });

    server.get("/requests", async (request, reply) => {
        const results = await db.request.findMany();
        reply.status(200).send(results);
    });

    server.get("/requests/count", async (request, reply) => {
        const results = await db.request.findMany();

        let count = 0;
        results.forEach(result => {
            count = count + result.quantidade;
        });

        reply.status(200).send(count);
    });
}