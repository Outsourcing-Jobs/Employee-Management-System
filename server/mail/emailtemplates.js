export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xác minh Email của bạn</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Xác minh Email</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Xin chào,</p>
    <p>Cảm ơn bạn đã đăng ký tài khoản! Mã xác minh của bạn là:</p>
    <div style="text-align: center; margin: 30px 0;">
      <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #4CAF50;">{verificationCode}</span>
    </div>
    <p>Vui lòng nhập mã này tại trang xác thực để hoàn tất quá trình đăng ký.</p>
    <p>Vì lý do bảo mật, mã này sẽ hết hạn sau <strong>5 phút</strong>.</p>
    <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
    <p>Trân trọng,<br>Đội ngũ quản trị hệ thống</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Đây là tin nhắn tự động, vui lòng không trả lời email này.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đặt lại mật khẩu thành công</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Đặt lại mật khẩu thành công</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Xin chào,</p>
    <p>Chúng tôi gửi email này để xác nhận rằng mật khẩu của bạn đã được thay đổi thành công.</p>
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #4CAF50; color: white; width: 50px; height: 50px; line-height: 50px; border-radius: 50%; display: inline-block; font-size: 30px;">
        ✓
      </div>
    </div>
    <p>Nếu bạn không thực hiện việc đổi mật khẩu này, vui lòng liên hệ với đội ngũ hỗ trợ của chúng tôi ngay lập tức.</p>
    <p>Vì lý do bảo mật, chúng tôi khuyến nghị bạn:</p>
    <ul>
      <li>Sử dụng mật khẩu mạnh và không trùng lặp</li>
      <li>Bật xác thực hai yếu tố (nếu có)</li>
      <li>Tránh sử dụng cùng một mật khẩu cho nhiều trang web khác nhau</li>
    </ul>
    <p>Cảm ơn bạn đã đồng hành cùng chúng tôi trong việc bảo mật tài khoản.</p>
    <p>Trân trọng,<br>Đội ngũ quản trị hệ thống</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Đây là tin nhắn tự động, vui lòng không trả lời email này.</p>
  </div>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Đặt lại mật khẩu của bạn</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(to right, #4CAF50, #45a049); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">Đặt lại mật khẩu</h1>
  </div>
  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 0 0 5px 5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
    <p>Xin chào,</p>
    <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
    <p>Để tiến hành đặt lại mật khẩu, vui lòng nhấn vào nút bên dưới:</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="{resetURL}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Đặt lại mật khẩu</a>
    </div>
    <p>Vì lý do bảo mật, liên kết này sẽ hết hạn sau <strong>1 giờ</strong>.</p>
    <p>Trân trọng,<br>Đội ngũ quản trị hệ thống</p>
  </div>
  <div style="text-align: center; margin-top: 20px; color: #888; font-size: 0.8em;">
    <p>Đây là tin nhắn tự động, vui lòng không trả lời email này.</p>
  </div>
</body>
</html>
`;