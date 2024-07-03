import Elysia from "elysia";
import postsRouter from "./routes/posts";
import authRouter from "./routes/auth";
import mailSenderRoute from "./routes/mailsender";
import { cors } from "@elysiajs/cors";

const port = process.env.PORT || 3434;

const app = new Elysia();

app.use(cors({ origin: "*" }));

app.group("/api", (app) => {
  app.use(postsRouter);
  app.use(authRouter);
  app.use(mailSenderRoute);
  return app;
});

app.listen(port);

app.onError(({ code }) => {
  if (code === "NOT_FOUND") return "Route not found :(";
});

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
