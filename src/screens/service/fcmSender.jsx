const axios = require("axios");
const { google } = require("google-auth-library");

// Load Service Account Key JSON đã tải về từ Google Cloud
const serviceAccount = require("./linkage-9deac-fd81ea907084.json"); // 🔹 Đổi thành tên file JSON của bạn

// 🛠 Hàm lấy Access Token từ Service Account
async function getAccessToken() {
  const auth = new google.auth.GoogleAuth({
    credentials: serviceAccount,
    scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
  });

  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  return accessToken.token;
}
