import { Elysia, t } from "elysia";
import { signIn, signUp } from "./handlers";

const authRouter = new Elysia({ prefix: "/auth" })
  .post("/signin", signIn)
  .post("/signup", signUp);

export default authRouter;
