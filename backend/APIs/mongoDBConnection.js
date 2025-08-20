const mongoose = require("mongoose");

const MONGO_URI =
  "mongodb+srv://nithinambati2:yLbT7wHeE14Surh1@cluster0.9qpuxmc.mongodb.net/jobby?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI, {})
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log("Error connecting to DB:", err));

// Define User schemas
const userSchema1 = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  skills: { type: Array, required: false },
  resume: { type: String, required: false },
  education: { type: String, required: false },
  experience: { type: String, required: false },
  address: { type: String, required: false },
  contactNumber: { type: String, required: false },
  qualifications: { type: Array, required: false },
  jobsApplied: { type: Array, required: false },
});

const userSchema2 = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  companyName: { type: String, required: false },
  currentJobRole: { type: String, required: false },
  jobsPosted: { type: Array, required: false },
});

const jobSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  jobRole: { type: String, required: true },
  jobLocation: { type: String, required: true },
  jobType: { type: String, required: true },
  mode: { type: String, required: true },
  stipend: { type: String, required: true },
  companyOverview: { type: String, required: false },
  jobDescription: { type: String, required: true },
  qualifications: { type: String, required: false },
  experienceLevel: { type: String, required: false },
  educationLevel: { type: String, required: true },
  jobPostingDate: { type: Date, required: true },
  applicationDeadline: { type: Date, required: true },
  applicationProcess: { type: String, required: true },
  jobDuration: { type: String, required: true },
  numberOfOpenings: { type: String, required: false },
  workHours: { type: String, required: true },
  benefits: { type: String, required: false },
  skillsRequired: { type: String, required: false },
  postedBy: { type: String, required: false },
  applications: { type: Array, required: false },
});

const salarySchema = new mongoose.Schema({
  jobRole: { type: String, required: true },
  salary: { type: String, required: true },
});

const reviewSchema = new mongoose.Schema({
  companyName: { type: String, required: true },
  reviewsCount: { type: Number, required: true },
  reviewScore: { type: Number, required: true },
});

const Student = mongoose.model("student-logins", userSchema1);
const Employer = mongoose.model("employer-logins", userSchema2);
const Jobs = mongoose.model("jobs", jobSchema);
const AvgSalaries = mongoose.model("avg-salaries", salarySchema);
const CompanyReviews = mongoose.model("company-reviews", reviewSchema);

module.exports = { Student, Employer, Jobs, AvgSalaries, CompanyReviews };
