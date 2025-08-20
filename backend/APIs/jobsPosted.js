const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { Jobs, Student } = require("./startMongoose");

router.get("/", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send("Authorization header missing");
  }

  const jwtToken = authHeader.split(" ")[1];
  if (!jwtToken) {
    return res.status(401).send("JWT token missing");
  }

  try {
    const payload = jwt.verify(jwtToken, "Nithin");
    if (!payload) {
      return res.status(401).send("Invalid token payload");
    }

    const { email } = payload;

    const jobs = await Jobs.find({ postedBy: email });
    return res.status(200).send(jobs);
  } catch (error) {
    console.error(error);
    return res.status(401).send("Invalid access token");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Jobs.findOne({ _id: id });

    if (!job) {
      return res.status(404).send({ message: "Job not found" });
    }

    const data = await Student.find({ email: { $in: job.applications } });

    res.status(200).send(data);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Server error" });
  }
});

module.exports = router;
