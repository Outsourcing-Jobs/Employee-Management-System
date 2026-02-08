import { MailService } from '../../mailer/index.js';
import { NoticeMailTemplate } from '../../mailer/templates/notice.template.js';
import { UserNotification } from '../../models/UserNotification.model.js';

// Kênh gửi email cho thông báo
export default class MailChannel {
  async send(users, notice) {
    for (const user of users) {
      if (!user.email) continue;

      // Gửi email thông báo
      try {
        const sent = await MailService.send({
          to: user.email,
          subject: notice.title,
          html: NoticeMailTemplate(notice, user),
          category: 'Notice'
        });

        if (!sent) {
          throw new Error('Mail send rejected by provider');
        }

        // Ghi nhận trạng thái gửi mail thành công
        await UserNotification.create({
          notice: notice._id,
          employee: user._id,
          channel: 'mail',
          status: 'SENT',
          deliveredAt: new Date()
        });
      } catch (err) {

        // Ghi nhận trạng thái gửi mail thất bại
        await UserNotification.create({
          notice: notice._id,
          employee: user._id,
          channel: 'mail',
          status: 'FAILED',
          error: err.message
        });

        console.error(
          `❌ Mail failed for user ${user._id}:`,
          err.message
        );
      }
    }
  }
}
