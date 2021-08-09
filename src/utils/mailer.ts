import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { config } from "../config";

const transport = nodemailer.createTransport({
  host: config.email.smtp.host,
  port: config.email.smtp.port,
  auth: {
    user: config.email.smtp.username,
    pass: config.email.smtp.password
  }
});

interface SendMailOptions {
  from?: string;
  to: string;
  subject: string;
  html: string;
}

interface SendMailResponse {
  from: string | false;
  to: string[];
  messageId: string;
}

export const send_email = async (options: SendMailOptions): Promise<SendMailResponse> => {
  const info = await new Promise<SMTPTransport.SentMessageInfo>((resolve, reject) => {
    transport.sendMail(
      {
        from: options.from || config.email.smtp.from,
        to: options.to,
        html: options.html,
        subject: options.subject
      },
      (err, info) => {
        if (err) return reject(err);
        return resolve(info);
      }
    );
  });

  return { from: info.envelope.from, to: info.envelope.to, messageId: info.messageId };
};
