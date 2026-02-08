import { channelRegistry } from './registry.js';
import SystemChannel from './System.channel.js';
import MailChannel from './Mail.channel.js';

channelRegistry.register('system', SystemChannel);
channelRegistry.register('mail', MailChannel);
