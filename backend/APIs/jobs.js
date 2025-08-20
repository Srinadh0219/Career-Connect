const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { Jobs } = require("./startMongoose");

router.get("/", async (req, res) => {
  try {
    const jobListings = await Jobs.find({
      applicationDeadline: { $gt: new Date() },
    });
    res.status(200).send(jobListings);
  } catch (error) {
    console.error("Error fetching job listings:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Post JOB
router.post("/", async (req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).send("Invalid Access Token");
    return;
  }
  const jwtToken = authHeader.split(" ")[1];
  let payload;
  try {
    payload = jwt.verify(jwtToken, "Nithin");
  } catch (error) {
    res.status(401).send("Invalid Access Token");
    return;
  }
  const { email } = payload;
  const {
    companyName,
    jobRole,
    jobLocation,
    jobType,
    mode,
    stipend,
    companyOverview,
    jobDescription,
    qualifications,
    experienceLevel,
    educationLevel,
    jobPostingDate,
    applicationDeadline,
    applicationProcess,
    jobDuration,
    workHours,
    benefits,
    skills,
  } = req.body;

  try {
    const newJob = new Jobs({
      companyName,
      jobRole,
      jobLocation,
      jobType,
      mode,
      stipend,
      companyOverview,
      jobDescription,
      qualifications,
      experienceLevel,
      educationLevel,
      jobPostingDate,
      applicationDeadline,
      applicationProcess,
      jobDuration,
      workHours,
      benefits,
      skills,
      postedBy: email,
    });
    await newJob.save();
    res.status(200).send("Job Posted successfully");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

// Jobs Detailed API
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const job = await Jobs.findOne({ _id: id });
  res.status(200).send(job);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).send("Invalid Access Token");
    return;
  }
  const jwtToken = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(jwtToken, "Nithin");
    if (!payload) res.status(401).send("Invalid Access Token");
    const { email } = payload;
    await Jobs.updateOne({ _id: id }, { $push: { applications: email } });
  } catch (error) {
    res.status(401).send("Invalid Access Token");
    return;
  }
  const { email } = payload;
});

router.put("/apply/:id", async (req, res) => {
  const { id } = req.params;
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).send("Invalid Access Token");
    return;
  }
  const jwtToken = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(jwtToken, "Nithin");
    if (!payload) res.status(401).send("Invalid Access Token");
    const { email } = payload;
    await Jobs.updateOne({ _id: id }, { $push: { applications: email } });
    res.status(200).send("Applied successfully");
  } catch (error) {
    res.status(401).send("Invalid Access Token");
    return;
  }
});

router.get("/:id/check-isapplied", async (req, res) => {
  const { id } = req.params;

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.status(401).send("Invalid Access Token");
    return;
  }
  const jwtToken = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(jwtToken, "Nithin");
    if (!payload) res.status(401).send("Invalid Access Token");
    const { email } = payload;
    const job = await Jobs.findById(id);
    if (!job) return res.status(404).send("Job not found");
    if (job.applications.includes(email)) {
      res.status(200).send({ isApplied: true });
    } else {
      res.status(400).send({ isApplied: false });
    }
  } catch (error) {
    res.status(400).send({ isApplied: false });
  }
});

module.exports = router;
