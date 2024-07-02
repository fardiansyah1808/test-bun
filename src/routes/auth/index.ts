import { Elysia, t } from "elysia";
import { signIn, signUp } from "./handlers";

const authRouter = new Elysia({ prefix: "/auth" })
  .post("/signin", signIn, {
    body: t.Object({
      email: t.String({
        format: "email",
        error: "Invalid email",
        minLength: 3,
        maxLength: 52,
      }),
      password: t.String({
        error: "Password is required",
        minLength: 8,
        maxLength: 256,
      }),
    }),
  })
  .post("/signup", signUp, {
    body: t.Object({
      name: t.String({
        error: "Name is required",
        minLength: 3,
        maxLength: 32,
      }),
      username: t.String({
        error: "Username is required",
        minLength: 3,
        maxLength: 20,
      }),
      email: t.String({
        format: "email",
        error: "Invalid email",
        minLength: 3,
        maxLength: 52,
      }),
      password: t.String({
        error: "Password is required",
        minLength: 8,
        maxLength: 256,
      }),
    }),
  });

export default authRouter;
