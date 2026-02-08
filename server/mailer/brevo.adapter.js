import { sendBrevoEmail } from '../config/brevo-mail.config.js';
import { MailAdapter } from './mail.adapter.js';

export class BrevoMailAdapter extends MailAdapter {
  async send(payload) {
    return sendBrevoEmail(payload);
  }
}
