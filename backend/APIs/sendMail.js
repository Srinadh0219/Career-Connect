const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { Student } = require("./mongoDBConnection");
const otpStore = new Map();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nithinambati9@gmail.com",
    pass: "nshv cokv qdpw pdzi",
  },
});

router.post("/send-mail", async (req, res) => {
  const { jobLocation, companyName, jobRole } = req.body;
  console.log("sdjfkf");
  try {
    const students = await Student.find();
    const emailPromises = students.map((student) => {
      const mailOptions = {
        from: "nithinambati9@gmail.com",
        to: student.email,
        subject: "New Job Posted",
        text: `JobRole: ${jobRole}, Location: ${jobLocation}, Company: ${companyName}`,
      };
      console.log("SENT");
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    res.status(200).send("Emails sent successfully");
  } catch (error) {
    console.error("Error sending emails:", error);
    res.status(500).send("Error sending emails");
  }
});

router.post("/verify", (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otpStore.get(email);

  if (storedOtp === otp) {
    otpStore.delete(email); // Invalidate OTP after successful verification
    res.status(200).send({ message: "OTP verified" });
  } else {
    res.status(400).send({ message: "Invalid OTP" });
  }
});

module.exports = router;
