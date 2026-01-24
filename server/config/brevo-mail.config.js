import axios from "axios";

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

export const sendBrevoEmail = async ({
  to,
  subject,
  html,
  category,
}) => {
  try {
    const res = await axios.post(
      BREVO_API_URL,
      {
        sender: {
          email: process.env.BREVO_SENDER_EMAIL,
          name: process.env.BREVO_SENDER_NAME,
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        ...(category && { tags: [category] }),
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    return true;
  } catch (error) {
    console.error(
      "❌ Brevo send mail error:",
      error.response?.data || error.message
    );
    return false;
  }
};
