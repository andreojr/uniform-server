import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import { routes } from "./routes";

const server = fastify();

server.register(fastifyCors);
server.register(routes);

server.listen({
    port: process.env.PORT ? Number(process.env.PORT) : 3333,
    host: "0.0.0.0",
}, () => {
    console.log("HTTP Server Running!");
});