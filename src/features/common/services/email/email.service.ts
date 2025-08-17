import { render } from '@react-email/components';
import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { JSX } from 'react';
import { EmailError } from './errors/email.error';

interface MailOptions extends SMTPTransport.Options {
  body: JSX.Element;
}

class EmailService {
  private static instance: EmailService;
  private transporter: Transporter;

  private constructor() {
    const {
      EMAIL_SERVER_HOST: host,
      EMAIL_SERVER_PORT: port,
      EMAIL_SERVER_USER: user,
      EMAIL_SERVER_PASSWORD: pass,
    } = process.env;

    this.transporter = nodemailer.createTransport({
      host,
      port: Number(port),
      secure: port === '465',
      auth: { user, pass },
    });
  }

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendMail(options: MailOptions): Promise<void> {
    try {
      const { body, ...mailOptions } = options;
      mailOptions.html = await render(body);
      await this.transporter.sendMail(mailOptions as SMTPTransport.Options);
    } catch (err) {
      throw EmailError.invalidTransport(err);
    }
  }
}

export default EmailService;
