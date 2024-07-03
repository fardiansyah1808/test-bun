import { Elysia, t } from "elysia";
import { sendEmail } from "./handlers";

const mailSenderRoute = new Elysia({ prefix: "/mailsender" }).post(
  "/send",
  sendEmail
);

export default mailSenderRoute;
