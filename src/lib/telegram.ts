'use server';

import type { HealthVital, PatientProfile } from "./types";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// Generic function to send a message to Telegram
async function sendTelegramMessage({ chatId, text, parseMode = 'Markdown' }: { chatId: string, text: string, parseMode?: 'Markdown' | 'HTML' }): Promise<{ ok: boolean; error?: string }> {
  if (!TELEGRAM_BOT_TOKEN) {
    const errorMessage = "Telegram bot token is not configured on the server.";
    console.error(errorMessage);
    return { ok: false, error: errorMessage };
  }

  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: parseMode,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = `Telegram API error: ${errorData.description}`;
      console.error("Failed to send Telegram message:", errorData);
      return { ok: false, error: errorMessage };
    }

    return { ok: true };

  } catch (error: any) {
    console.error("Error sending Telegram message:", error);
    return { ok: false, error: error.message || "An unknown error occurred." };
  }
}

// 1. Welcome & Help Menu
export async function sendWelcomeMessage(chatId: string, userName: string = 'User') {
  const text = `
🏥 *VitalWatch Health Monitor*

Welcome ${userName}! 👋

I can monitor your health using your wrist sensor.

━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 *Available Commands:*

• \`/vitals\` - 📊 Start health measurement
• \`/status\` - ⚙️ Check device status
• \`/calibrate\` - 🤖 Calibration guide
• \`/help\` - Show this message

━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 *Quick Start:*

1️⃣ Place sensor on inner wrist
2️⃣ Send \`/vitals\` command
3️⃣ Keep completely still
4️⃣ Receive your health report

━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 *Web Dashboard:*
${process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app'}

⚕️ *Medical Disclaimer*
This is NOT a medical device. Always consult your physician.
  `;
  return sendTelegramMessage({ chatId, text });
}

// 2. Device Status
export async function sendDeviceStatus(chatId: string, patient: PatientProfile | null) {
  const text = `
⚙️ *VitalWatch Device Status*

━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 *Device Information:*
• ID: ${patient?.device_id || 'N/A'}
• Version: 6.0 (Mock)
• Boot Count: 5 (Mock)
• Measurements: 23 (Mock)
• Uptime: 45 minutes (Mock)

📡 *Network Status:*
• WiFi: ✅ Connected (Mock)
• SSID: MyWiFi_Network (Mock)

🌐 *Vercel Backend:*
• Status: ✅ Connected
• URL: ${process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app'}

🎯 *Calibration Status:*
• Status: ✅ Calibrated (Mock)
• User Age: ${patient?.age || 'N/A'} years
• Baseline Glucose: ${patient?.baseline_hr || 95} mg/dL (Mock)

📊 *Sensor Status:*
• Contact: ✅ Detected (Mock)
• IR Signal: 48000 (Good) (Mock)

━━━━━━━━━━━━━━━━━━━━━━━━━━

Send \`/vitals\` to start measurement ❤️
  `;
   return sendTelegramMessage({ chatId, text });
}


// 3. Calibration Guide
export async function sendCalibrationGuide(chatId: string) {
    const text = `
🎯 *Calibration Guide*

Calibrate using the web dashboard for best accuracy.

━━━━━━━━━━━━━━━━━━━━━━━━━━

🌐 *Web Dashboard:*
${process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app'}/patient/settings

🩸 *Blood Pressure Calibration:*

1️⃣ Measure BP with clinical cuff
2️⃣ Start \`/vitals\` measurement
3️⃣ Enter actual BP in web dashboard
4️⃣ Repeat 3-5 times for best results

🍬 *Glucose Calibration:*

1️⃣ Fast for 8 hours (morning)
2️⃣ Measure glucose with glucometer
3️⃣ Start \`/vitals\` immediately
4️⃣ Enter actual glucose in dashboard

━━━━━━━━━━━━━━━━━━━━━━━━━━

Calibration improves accuracy from ±20% to ±10%
    `;
    return sendTelegramMessage({ chatId, text });
}

// 4. Progress Updates
export async function sendProgressUpdate(chatId: string, phase: string, progress: number, message: string) {
    const barLength = 10;
    const filledLength = Math.round(barLength * (progress / 100));
    const emptyLength = barLength - filledLength;
    const bar = '▓'.repeat(filledLength) + '░'.repeat(emptyLength);

    const text = `
⏳ *Measurement Progress*

Phase: ${phase}
Progress: ${progress}%

[${bar}]

${message}
    `;
    return sendTelegramMessage({ chatId, text });
}

export async function sendPreparationMessage(chatId: string) {
    const text = `
📋 *Measurement Starting...*

Please prepare for the reading:
- Sit comfortably in a chair.
- Place the sensor on your inner wrist.
- Ensure it's firmly pressed but not too tight.
- *Most importantly, keep completely still for the duration of the scan.*

The process will begin shortly.
    `;
    return sendTelegramMessage({ chatId, text });
}


// 5. Health Report
export async function sendHealthReport(chatId: string, vital: HealthVital) {
  const bpStatus = (vital.predicted_bp_systolic || 0) < 120 ? '✅ Normal' : '⚠️ Elevated';
  const glucoseStatus = (vital.predicted_glucose || 0) < 140 ? '✅ Normal' : '⚠️ High';

  const text = `
🏥 *VitalWatch Health Report*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📅 *Timestamp:* ${new Date(vital.timestamp).toLocaleString()}

❤️ *Heart Rate*
  • Value: ${vital.heart_rate.toFixed(1)} BPM
  • Status: ✅ Normal

🫁 *Oxygen Saturation (SpO₂)*
  • Value: ${vital.spo2.toFixed(1)}%
  • Status: ${vital.spo2 >= 95 ? '✅ Normal' : '⚠️ Low'}

🩸 *Blood Pressure (Estimated)*
  • Value: ${vital.predicted_bp_systolic?.toFixed(0)}/${vital.predicted_bp_diastolic?.toFixed(0)} mmHg
  • Status: ${bpStatus}
  • Confidence: 85% (Mock)

🍬 *Glucose Trend (Estimated)*
  • Value: ${vital.predicted_glucose?.toFixed(0)} mg/dL
  • Status: ${glucoseStatus}
  • Confidence: 70% (Mock)

📊 *Additional Metrics*
  • PPG Signal: ${vital.ppg_raw.toFixed(0)}
  • Signal Quality: ✅ Excellent (Mock)

🌐 *View Full History:*
${process.env.NEXT_PUBLIC_APP_URL || 'https://your-app.vercel.app'}/patient/health-data

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚕️ *Medical Disclaimer*
This is NOT a medical diagnostic device. Consult your physician for medical decisions.
  `;
  return sendTelegramMessage({ chatId, text });
}


// 6. Alerts
export async function sendCriticalAlert(chatId: string, severity: string, message: string) {
  const EMOJI_CRITICAL = "🚨";
  const EMOJI_WARNING = "⚠️";
  const emoji = severity === 'Critical' || severity === 'High' ? EMOJI_CRITICAL : EMOJI_WARNING;

  const text = `
${emoji} *VitalWatch Health Alert* ${emoji}

A new alert has been triggered.

*Severity:* ${severity}
*Details:* ${message}

Please log in to the Doctor's Dashboard for a full assessment or verify with a clinical device.
  `;
  return sendTelegramMessage({ chatId, text });
}
