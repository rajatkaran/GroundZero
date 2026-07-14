import { Resend } from "resend";

const resendApiKey = process.env.RESEND_API_KEY;

// Only initialize Resend if the API key is present
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function sendEmail({
  to,
  subject,
  html,
  from = "Ground Zero <noreply@thinkthrough.in>"
}: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  if (!resend) {
    console.warn("Resend API Key is missing. Email simulation mode active.");
    console.log(`[SIMULATED EMAIL] To: ${to} | Subject: ${subject} | From: ${from}`);
    return { success: true, simulated: true };
  }

  try {
    const response = await resend.emails.send({
      from,
      to,
      subject,
      html
    });

    console.log(`Email successfully sent via Resend to ${to}:`, response);
    return { success: true, data: response };
  } catch (error) {
    console.error("Failed to send email via Resend:", error);
    return { success: false, error };
  }
}
