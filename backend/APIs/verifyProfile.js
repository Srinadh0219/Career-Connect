const express = require("express");
const { Student } = require("./mongoDBConnection");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).send("Invalid Access Token");
  }

  const jwtToken = authHeader.split(" ")[1];
  if (!jwtToken) {
    return res.status(403).send("Invalid JWT token");
  }
  try {
    const payload = jwt.verify(jwtToken, "Nithin");
    const { email } = payload;
    const user = await Student.findOne({ email });
    if (user && user.resume) return res.status(200).send("Valid");
    else return res.status(403).send("Invalid");
  } catch (error) {
    return res.status(403).send(error.message);
  }
});

module.exports = router;
