import { render } from '@react-email/components';
import nodemailer, { SendMailOptions, Transporter } from 'nodemailer';
import { JSX } from 'react';
import { EmailError } from './errors/email.error';

interface MailOptions extends SendMailOptions {
  body: JSX.Element;
}

class EmailService {
  private transporter: Transporter;

  constructor() {
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

  async sendMail(options: MailOptions): Promise<void> {
    try {
      const { body, ...mailOptions } = options;
      mailOptions.html = await render(body);
      await this.transporter.sendMail(mailOptions);
    } catch (err) {
      throw EmailError.invalidTransport(err);
    }
  }
}

export default EmailService;
