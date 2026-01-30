'use server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

const EMOJI_CRITICAL = "🚨";
const EMOJI_WARNING = "⚠️";

type Severity = 'Critical' | 'High' | 'Medium' | 'Low' | 'Predictive';

export async function sendTelegramAlert(
    patientName: string, 
    severity: Severity, 
    message: string
): Promise<{ok: boolean; error?: string}> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    const errorMessage = "Telegram bot token or chat ID is not configured on the server.";
    console.error(errorMessage);
    return { ok: false, error: errorMessage };
  }

  const emoji = severity === 'Critical' || severity === 'High' ? EMOJI_CRITICAL : EMOJI_WARNING;

  const formattedMessage = `
${emoji} *VitalWatch Health Alert* ${emoji}

A new alert has been triggered for patient *${patientName}*.

*Severity:* ${severity}
*Details:* ${message}

Please log in to the Doctor's Dashboard for a full assessment.
  `;

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: formattedMessage,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `Telegram API error: ${errorData.description}`;
      console.error("Failed to send Telegram alert:", errorData);
      return { ok: false, error: errorMessage };
    }

    console.log("Successfully sent Telegram alert.");
    return { ok: true };

  } catch (error: any) {
    console.error("Error sending Telegram alert:", error);
    return { ok: false, error: error.message || "An unknown error occurred while sending Telegram alert." };
  }
}
