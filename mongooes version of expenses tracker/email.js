const axios = require("axios");

async function sendResetEmail(to,link) {
  return axios.post(
    "https://api.brevo.com/v3/smtp/email",
    {
      sender: { name: "Expense tracker", email: "shubbham2101861@gmail.com" },
      to: [{ email: to }],
      subject: "Reset Your Password",
      htmlContent: `
        <h3>Reset Your Password</h3>
        <p>your password is reset:</p>
        <a href="${link}">clik here to reset your password<a>
        <img src="https://freeup.net/wp-content/uploads/2020/06/thank-you-card.jpg" alt="thank you image" width="500" height="600">
      `
    },
    {
      headers: {
        "api-key": process.env.SENDINBLUE_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
}
module.exports= sendResetEmail;