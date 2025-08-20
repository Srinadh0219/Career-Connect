const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { Student, Employer } = require("./startMongoose");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

router.get("/student", async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("dkjnafak");
    res.status(401).send("Invalid Access Token");
    return;
  }
  const jwtToken = authHeader.split(" ")[1];

  try {
    // Verify JWT token
    const payload = await jwt.verify(jwtToken, "Nithin");
    if (!payload) {
      res.status(401).send("Invalid Access Token");
      return;
    }
    // Configure Cloudinary

    const { email } = payload;
    const userDetails = await Student.findOne({ email });
    res.status(200).send(userDetails);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.get("/employer", async (req, res) => {
  const authHeader = req.headers["authorization"];
  console.log(authHeader);
  if (!authHeader) {
    res.status(401).send("Invalid Access Token");
    return;
  }
  const jwtToken = authHeader.split(" ")[1];
  try {
    // Verify JWT token
    const payload = await jwt.verify(jwtToken, "Nithin");
    if (!payload) {
      res.status(401).send("Invalid Access Token");
      return;
    }
    const { email } = payload;
    const userDetails = await Employer.findOne({ email });
    res.status(200).send(userDetails);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.put("/student", async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("dkjnafak");
    res.status(401).send("Invalid Access Token");
    return;
  }
  const jwtToken = authHeader.split(" ")[1];

  try {
    // Verify JWT token
    const payload = await jwt.verify(jwtToken, "Nithin");
    if (!payload) {
      res.status(401).send("Invalid Access Token");
      return;
    }
    // Configure Cloudinary
    const {
      username,
      skills,
      experience,
      education,
      address,
      contactNumber,
      resume,
    } = req.body;
    if (contactNumber.length !== 10) {
      res.status(401).send("Invalid Contact Number");
    }
    const { email } = payload;
    const userDetails = await Student.updateOne(
      { email },
      {
        $set: {
          username: username,
          skills: skills,
          experience: experience,
          education: education,
          address,
          contactNumber,
          resume,
        },
      }
    );
    res.status(200).send(userDetails);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

router.put("/employer", async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).send("Invalid Access Token");
    return;
  }
  const jwtToken = authHeader.split(" ")[1];

  try {
    // Verify JWT token
    const payload = await jwt.verify(jwtToken, "Nithin");
    if (!payload) {
      res.status(401).send("Invalid Access Token");
      return;
    }
    // Configure Cloudinary
    const { username, companyName, currentJobRole, companyLocation } = req.body;
    const { email } = payload;
    const userDetails = await Employer.updateOne(
      { email },
      {
        $set: {
          username,
          companyName,
          currentJobRole,
          companyLocation,
        },
      }
    );
    res.status(200).send(userDetails);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
