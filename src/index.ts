import Elysia from "elysia";
import postsRouter from "./routes/posts";
import authRouter from "./routes/auth";

const port = process.env.PORT || 3434;

const app = new Elysia();

app.group("/api", (app) => {
  app.use(postsRouter);
  app.use(authRouter);
  return app;
});

app.listen(port);

app.onError(({ code }) => {
  if (code === "NOT_FOUND") return "Route not found :(";
});

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
