const express = require("express");
const app = express();
app.use(express.json());

const TELEGRAM_TOKEN = "8385465224:AAE7k1qxCjJ8SKG2BXleFPqaJIUPWJRF7NQ";
const TELEGRAM_CHAT_ID = "-5161585152";

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
  const items = req.body.items;
  const address = req.body.address;
  const phone = req.body.phone;
  const total = req.body.total;

  const message = "<b>НОВЫЙ ЗАКАЗ!</b>\n\nЗаказ: " + items + "\nАдрес: " + address + "\nТелефон: " + phone + "\nСумма: " + total + " EUR";

  await sendToTelegram(message);
  res.json({ success: true });
});

app.listen(3000, function() {
  console.log("Server running on port 3000");
});