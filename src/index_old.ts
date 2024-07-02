import { Elysia } from "elysia";
import swagger from "@elysiajs/swagger";

const port = process.env.PORT || 3434;

const app = new Elysia()
  .use(swagger()) // Menambahkan middleware swagger
  .get("/", () => "Hello Elysia")
  .get("/id/1", () => "static path")
  .get("/id/:id", () => "dynamic path")
  .get("/id/*", () => "wildcard path")
  .get("/id/:id/:name", ({ params: { id, name } }) => id + " " + name)
  .post("/hi", () => "hi")
  .route("M-SEARCH", "/m-search", () => "connect")
  .onError(({ code }) => {
    if (code === "NOT_FOUND") return "Route not found :(";
  })
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
