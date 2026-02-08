import { BrevoMailAdapter } from './brevo.adapter.js';

const adapter = new BrevoMailAdapter();

export const MailService = {
  send: (payload) => adapter.send(payload)
};
