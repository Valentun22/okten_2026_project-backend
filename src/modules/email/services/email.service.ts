import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (host && user && pass) {
      this.transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
    } else {
      this.logger.warn(
        'SMTP is not configured (SMTP_HOST/SMTP_USER/SMTP_PASS). Emails will be skipped.',
      );
    }
  }

  async sendMail(to: string, subject: string, text: string) {
    if (!this.transporter) return;

    const from = process.env.SMTP_FROM || process.env.SMTP_USER!;
    try {
      await this.transporter.sendMail({ from, to, subject, text });
    } catch (e) {
      this.logger.error('Failed to send email', e as any);
    }
  }
}
