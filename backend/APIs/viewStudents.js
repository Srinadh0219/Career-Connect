const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { Student } = require("./startMongoose");

router.get("/", async (req, res) => {
  try {
    const studentsList = await Student.find();
    res.status(200).send(studentsList);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
