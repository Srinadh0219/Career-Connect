const express = require("express");
const { Student } = require("./mongoDBConnection");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    res.status(401).send("Invalid Access Token");
    return;
  }

  const jwtToken = authHeader.split(" ")[1];
  if (!jwtToken) res.status(403).send("Invalid JWT token");
  try {
    const payload = await jwt.verify(jwtToken, "Nithin");
    const { email } = payload;
    const user = await Student.findOne({ email });
    if (user.resume) return res.status(200).send("Valid");
    else return res.status(403).send("Invalid");
  } catch (error) {
    res.status(403).send(error.message);
  }
});

module.exports = router;
