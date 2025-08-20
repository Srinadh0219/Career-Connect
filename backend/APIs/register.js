const express = require("express");
const router = express.Router();
const { Student, Employer } = require("./startMongoose");

router.post("/student", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if user already exists

    const existingUser = await Student.findOne({ username, email });
    if (existingUser) {
      res.status(400).send("User already exists");
      return;
    }
    // Create new user
    const newUser = new Student({ username, password, email });
    await newUser.save();

    res.status(200).send("Registration Successful");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.post("/employer", async (req, res) => {
  const { username, password, email } = req.body;

  try {
    // Check if user already exists
    const existingUser = await Employer.findOne({ username, email });
    if (existingUser) {
      res.status(400).send("User already exists");
      return;
    }

    // Create new user
    const newUser = new Employer({ username, password, email });
    await newUser.save();

    res.status(200).send("Registration Successful");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
