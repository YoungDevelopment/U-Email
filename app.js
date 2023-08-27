const sgMail = require("@sendgrid/mail");
const express = require("express");
const bodyParser = require("body-parser");
const config = require("./config.js");
const emailData = require("./Email_Data/DummyData");

const apiKey = config.SENDGRID_API_KEY;
const fromEmail = config.From_Email;
sgMail.setApiKey(apiKey);

const app = express();
app.use(bodyParser.json());

const sendEmail = async (to, subject, text) => {
  try {
    const msg = {
      to,
      from: "abdul.rehman@unifininc.com",
      subject,
      text,
    };

    await sgMail.send(msg);
    console.log(`Email sent to ${to} successfully.`);
  } catch (error) {
    console.error(`Error sending email to ${to}:`, error);
  }
};

app.post("/send-single-email", async (req, res) => {
  try {
    const { to, subject, text } = req.body;
    await sendEmail(to, subject, text);

    res.status(200).json({ message: `Email sent to ${to} successfully.` });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({
      message: "An error occurred while sending the email. Please try again",
    });
  }
});

app.post("/send-batch-emails", async (req, res) => {
  try {
    let successCount = 0;
    for (const email of emailData) {
      const { to, subject, text } = email;
      await sendEmail(to, subject, text);
      successCount++;
    }

    res
      .status(200)
      .json({ message: `${successCount} Emails sent successfully!` });
  } catch (error) {
    console.error("Error sending emails:", error);
    res
      .status(500)
      .json({ message: "An error occurred while sending the emails." });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
