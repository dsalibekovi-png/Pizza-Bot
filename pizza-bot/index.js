const express = require("express");
const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = "8385465224:AAE7k1qxCjJ8SKG2BXleFPqaJIUPWJRF7NQ";
const TELEGRAM_CHAT_ID = "-5161585152";

const SibApiV3Sdk = require("@getbrevo/brevo");
const brevoClient = new SibApiV3Sdk.TransactionalSMSApi();
brevoClient.authentications["apiKey"].apiKey = process.env.BREVO_API_KEY;











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
    const sms = `Merci ${name} ! 🍕\nVotre commande a bien été reçue.\n\n📋 ${items}\n🏠 Type: ${type}\n💶 Total: ${total}€\n\nIstante Pizza — 04 38 49 27 35`;
    const sendSms = new SibApiV3Sdk.SendTransacSms();
    sendSms.sender = "Istante";
    sendSms.recipient = phone;
    sendSms.content = sms;
    await brevoClient.sendTransacSms(sendSms);
  }

  res.json({ success: true });
});

app.listen(3000, function() {
  console.log("Server running on port 3000");
});