import { render } from '@react-email/components';
import { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { JSX } from 'react';
import { EmailError } from './errors/email.error';

interface MailOptions extends SMTPTransport.Options {
  body: JSX.Element;
}

export type NodemailerCreateTransport = (options: SMTPTransport.Options) => Transporter;

class EmailService {
  private transporter: Transporter;

  constructor(createTransport: NodemailerCreateTransport) {
    const {
      EMAIL_SERVER_HOST: host,
      EMAIL_SERVER_PORT: port,
      EMAIL_SERVER_USER: user,
      EMAIL_SERVER_PASSWORD: pass,
    } = process.env;

    this.transporter = createTransport({
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
      await this.transporter.sendMail(mailOptions as SMTPTransport.Options);
    } catch (err) {
      throw await EmailError.invalidTransport(err);
    }
  }
}

export default EmailService;
