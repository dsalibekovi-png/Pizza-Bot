const express = require("express");
const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = "8385465224:AAE7k1qxCjJ8SKG2BXleFPqaJIUPWJRF7NQ";
const TELEGRAM_CHAT_ID = "-5161585152";

const BREVO_API_KEY = process.env.BREVO_API_KEY;











async function sendToTelegram(message) {
  const url = "https://api.telegram.org/bot" + TELEGRAM_TOKEN + "/sendMessage";
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "HTML",
    }),
  });
  return response.json();
}

app.post("/webhook/order", async (req, res) => {
  const name = req.body.name;
  const items = req.body.items;
  const type = req.body.type;
  const phone = req.body.phone;
  const total = req.body.total;

  const message = "<b>NOUVELLE COMMANDE!</b>\n\nClient: " + name + "\nCommande: " + items + "\nType: " + type + "\nTelephone: " + phone + "\nTotal: " + total + "€";

  await sendToTelegram(message);

  if (phone) {
    const sms = `Istante Pizza\nMerci ${name}! Commande recue:\n${items}\n${type} - ${total}EUR\nTel: 04 38 49 27 35`;
    await fetch("https://api.brevo.com/v3/transactionalSMS/sms", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: "ist1tePizza",
        recipient: phone,
        content: sms,
      }),
    });
  }

  res.json({ success: true });
});

app.get("/get-time", (_req, res) => {
  const now = new Date().toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  res.json({ current_time: now });
});

app.post("/voice", async (_req, res) => {
  const now = new Date().toLocaleTimeString("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="wss://api.elevenlabs.io/v1/convai/twilio?agent_id=${process.env.ELEVENLABS_AGENT_ID}&amp;xi-api-key=${process.env.ELEVENLABS_API_KEY}">
      <Parameter name="current_time" value="${now}"/>
    </Stream>
  </Connect>
</Response>`;

  res.set("Content-Type", "text/xml");
  res.send(twiml);
});

app.listen(3000, function() {
  console.log("Server running on port 3000");
});