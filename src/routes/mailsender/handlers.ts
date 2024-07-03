import { Context } from "elysia";
import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

type EmailData = {
  from: {
    email: string;
    name: string;
  };
  to: [
    {
      email: string;
      name: string;
    }
  ];
  subject: string;
  text: string;
  html: string;
  personalization: [
    {
      email: string;
      data: {
        company: string;
      };
    }
  ];
};

export const sendEmail = async (ctx: Context) => {
  //   const bearer = process.env.MAILERSEND_API;

  //   try {
  //     const response = await axios.post(
  //       "https://api.mailersend.com/v1/email",
  //       ctx.body,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${bearer}`,
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     console.log("Email sent successfully:", response.status); // Tambahkan logging
  //     return response.status;
  //   } catch (error: any) {
  //     console.error("Error sending email:", error);
  //     return new Response(JSON.stringify({ message: error.message }), {
  //       status: 500,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //   }

  const mailerSend = new MailerSend({
    apiKey: process.env.MAILERSEND_API!,
  });

  const data = ctx.body as EmailData;
  console.log("data", data);

  const sentFrom = new Sender(data.from.email, data.from.name);

  const recipients = data.to.map(
    (recipient) => new Recipient(recipient.email, recipient.name)
  );

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setReplyTo(sentFrom)
    .setSubject(data.subject)
    .setHtml(data.html)
    .setText(data.text);

  await mailerSend.email.send(emailParams);
};
