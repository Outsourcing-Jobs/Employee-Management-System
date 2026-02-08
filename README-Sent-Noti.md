🔔 Notification System – Processing Flow

Hệ thống notification được thiết kế theo kiến trúc async – queue-based, nhằm đảm bảo:

API phản hồi nhanh

Xử lý gửi mail / thông báo không block request

Dễ scale và mở rộng trong tương lai

📌 Overall Flow
Controller
  ↓
Notice (PENDING)
  ↓
RabbitMQ
  ↓
Worker
  ↓
NotificationFactory
  ↓
Strategy.resolve() → recipients
  ↓
SystemChannel | MailChannel
  ↓
UserNotification
  ↓
Notice = DONE

🧩 Step-by-step Description
1️⃣ Controller – Create Notice

API nhận request tạo thông báo

Validate dữ liệu (title, content, audience, channels, …)

Lưu notice vào database với trạng thái ban đầu:

status = PENDING


👉 Ở bước này chưa gửi mail / notification

2️⃣ Publish Message to RabbitMQ

Sau khi tạo Notice thành công

API chỉ đẩy noticeId lên RabbitMQ

publishNotification(noticeId)


📌 Lý do chỉ gửi ID:

Message nhỏ gọn

Tránh stale data

Worker luôn lấy dữ liệu mới nhất từ DB

3️⃣ Worker – Consume Message

Worker lắng nghe queue NOTIFICATION

Mỗi message đại diện cho 1 notice cần xử lý

Worker chạy độc lập với API

RabbitMQ → Worker

4️⃣ Lock Notice (Idempotent Processing)

Worker thực hiện lock logic bằng database:

PENDING → PROCESSING


Chỉ notice có status PENDING mới được xử lý

Tránh:

xử lý trùng

nhiều worker xử lý cùng 1 notice

message bị gửi lại

📌 Database là source of truth

5️⃣ NotificationFactory – Orchestration Layer

Factory chịu trách nhiệm:

chọn Recipient Strategy

chọn Delivery Channels

NotificationFactory.create(notice)

6️⃣ Strategy.resolve() – Resolve Recipients

Dựa trên notice.audience, strategy tương ứng sẽ được dùng:

Audience	Strategy
ALL_EMPLOYEES	HrBroadcastStrategy
Department-Specific	DepartmentStrategy
Employee-Specific	CustomUsersStrategy

Kết quả:

→ Danh sách Employee (recipients)

7️⃣ Channel.send() – Deliver Notification

Dựa trên notice.channels, hệ thống gửi qua từng channel:

🔹 SystemChannel

Không gửi email

Tạo record trong UserNotification

Dùng cho:

in-app notification

bell / inbox UI

🔹 MailChannel

Gửi email qua MailService (Brevo)

Lưu trạng thái gửi vào UserNotification

Mail lỗi không làm crash toàn bộ notice

8️⃣ Persist UserNotification

Mỗi user + channel sẽ tạo một record:

UserNotification
- notice
- employee
- channel
- deliveredAt


👉 Dùng cho:

lịch sử notification

audit

hiển thị UI

9️⃣ Finish Notice Processing

Khi tất cả channel xử lý xong:

Notice.status = DONE


Nếu có lỗi trong quá trình xử lý:

Notice.status = FAILED
Notice.error = error message


📌 Message luôn được ACK để tránh retry vô hạn