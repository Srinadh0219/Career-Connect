const express = require("express");
const router = express.Router();

const companyReviewsRouter = require("./companyReviews");
const salaryGuideRouter = require("./avgSalaries");
const jobsRouter = require("./jobs");
const loginRouter = require("./login");
const registerRouter = require("./register");
const OtpRouter = require("./sendMail");
const profileRouter = require("./profile");
const jobsPostedRouter = require("./jobsPosted");
const viewStudentsRouter = require("./viewStudents");
const verifyProfileRouter = require("./verifyProfile");

// Use the routes from the different files

router.use("/login", loginRouter);
router.use("/register", registerRouter);
router.use("/company-reviews", companyReviewsRouter);
router.use("/salary-guide", salaryGuideRouter);
router.use("/jobs", jobsRouter);
router.use("/", OtpRouter);
router.use("/profile", profileRouter);
router.use("/employer/jobs/posted", jobsPostedRouter);
router.use("/employer/view-students", viewStudentsRouter);
router.use("/verify-profile", verifyProfileRouter);

module.exports = router;
