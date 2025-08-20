import React, { useState } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import "./index.css";

const AddJob = () => {
  const jwtToken = Cookies.get("jwt_token");
  const [companyName, setCompanyName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobType, setJobType] = useState("");
  const [mode, setMode] = useState("");
  const [stipend, setStipend] = useState("");
  const [companyOverview, setCompanyOverview] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [educationLevel, setEducationLevel] = useState("");
  const [jobPostingDate, setJobPostingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [applicationDeadline, setApplicationDeadline] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [applicationProcess, setApplicationProcess] = useState("");
  const [jobDuration, setJobDuration] = useState("");
  const [workHours, setWorkHours] = useState("");
  const [benefits, setBenefits] = useState("");
  const [skills, setSkills] = useState("");

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!companyName) newErrors.companyName = "Company Name is required.";
    if (!jobRole) newErrors.jobRole = "Job Role is required.";
    if (!jobLocation) newErrors.jobLocation = "Job Location is required.";
    if (!jobType) newErrors.jobType = "Job Type is required.";
    if (!mode) newErrors.mode = "Mode is required.";
    if (!stipend) newErrors.stipend = "Stipend is required.";
    if (!companyOverview)
      newErrors.companyOverview = "Company Overview is required.";
    if (!jobDescription)
      newErrors.jobDescription = "Job Description is required.";
    if (!qualifications)
      newErrors.qualifications = "Qualifications are required.";
    if (!experienceLevel)
      newErrors.experienceLevel = "Experience Level is required.";
    if (!educationLevel)
      newErrors.educationLevel = "Education Level is required.";
    if (!applicationProcess)
      newErrors.applicationProcess = "Application Process is required.";
    if (!jobDuration) newErrors.jobDuration = "Job Duration is required.";
    if (!workHours) newErrors.workHours = "Work Hours are required.";
    if (!benefits) newErrors.benefits = "Benefits are required.";
    if (!skills) newErrors.skills = "Skills are required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addJobBtn = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    const jobDetails = {
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
    };
    console.log(jobDetails);
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(jobDetails),
    };
    const response = await fetch(
      "https://careerconnect-apis.vercel.app/jobs",
      options
    );
    if (response.ok) {
      alert("Job Added Successfully!");
      setCompanyName("");
      setCompanyOverview("");
      setJobLocation("");
      setJobRole("");
      setJobType("");
      setStipend("");
      setJobDescription("");
      setQualifications("");
      setExperienceLevel("");
      setEducationLevel("");
      setJobPostingDate(new Date().toISOString().split("T")[0]);
      setApplicationDeadline(new Date().toISOString().split("T")[0]);
      setApplicationProcess("");
      setJobDuration("");
      setWorkHours("");
      setBenefits("");
      setSkills("");
      await fetch("https://careerconnect-apis.vercel.app/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          jobRole,
          jobLocation,
          companyName,
        }),
      });
    } else {
      alert("Failed to add job. Please try again.");
    }
  };

  console.log(jwtToken);

  if (jwtToken === undefined) {
    return <Navigate to="/employer/login" />;
  }
  return (
    <div className="addjob-page-bg-container">
      <form className="form-container" onSubmit={addJobBtn}>
        <div className="form-sub-container">
          <div>
            <label>Company Name:</label>
            <input
              type="text"
              value={companyName}
              maxLength={50}
              onChange={(event) => {
                setCompanyName(event.target.value);
              }}
            />
            {errors.companyName && (
              <span className="error">{errors.companyName}</span>
            )}

            <label>Job Location</label>
            <input
              type="text"
              value={jobLocation}
              maxLength={100}
              onChange={(event) => {
                setJobLocation(event.target.value);
              }}
            />
            {errors.jobLocation && (
              <span className="error">{errors.jobLocation}</span>
            )}

            <label>Job Role:</label>
            <input
              type="text"
              value={jobRole}
              maxLength={50}
              onChange={(event) => {
                setJobRole(event.target.value);
              }}
            />
            {errors.jobRole && <span className="error">{errors.jobRole}</span>}

            <label>Job Description:</label>
            <input
              type="text"
              value={jobDescription}
              maxLength={200}
              onChange={(event) => {
                setJobDescription(event.target.value);
              }}
            />
            {errors.jobDescription && (
              <span className="error">{errors.jobDescription}</span>
            )}

            <label>Job Type:</label>
            <input
              type="text"
              value={jobType}
              maxLength={30}
              onChange={(event) => {
                setJobType(event.target.value);
              }}
            />
            {errors.jobType && <span className="error">{errors.jobType}</span>}

            <label>Mode :</label>
            <input
              type="text"
              value={mode}
              maxLength={30}
              onChange={(event) => {
                setMode(event.target.value);
              }}
            />
            {errors.mode && <span className="error">{errors.mode}</span>}

            <label>Stipend</label>
            <input
              type="text"
              value={stipend}
              maxLength={20}
              onChange={(event) => {
                setStipend(event.target.value);
              }}
            />
            {errors.stipend && <span className="error">{errors.stipend}</span>}

            <label>Company Overview:</label>
            <input
              type="text"
              value={companyOverview}
              maxLength={200}
              onChange={(event) => {
                setCompanyOverview(event.target.value);
              }}
            />
            {errors.companyOverview && (
              <span className="error">{errors.companyOverview}</span>
            )}

            <label>Qualifications</label>
            <input
              type="text"
              value={qualifications}
              maxLength={200}
              onChange={(event) => {
                setQualifications(event.target.value);
              }}
            />
            {errors.qualifications && (
              <span className="error">{errors.qualifications}</span>
            )}
          </div>
          <div>
            <label>Experience Level:</label>
            <input
              type="text"
              value={experienceLevel}
              maxLength={50}
              onChange={(event) => {
                setExperienceLevel(event.target.value);
              }}
            />
            {errors.experienceLevel && (
              <span className="error">{errors.experienceLevel}</span>
            )}

            <label>Education Level Name:</label>
            <input
              type="text"
              value={educationLevel}
              maxLength={50}
              onChange={(event) => {
                setEducationLevel(event.target.value);
              }}
            />
            {errors.educationLevel && (
              <span className="error">{errors.educationLevel}</span>
            )}

            <label>Job Posting Date:</label>
            <input
              type="date"
              value={jobPostingDate}
              onChange={(event) => {
                setJobPostingDate(event.target.value);
              }}
            />

            <label>Application Deadline:</label>
            <input
              type="date"
              value={applicationDeadline}
              onChange={(event) => {
                setApplicationDeadline(event.target.value);
              }}
            />

            <label>Application Process:</label>
            <input
              type="text"
              value={applicationProcess}
              maxLength={200}
              onChange={(event) => {
                setApplicationProcess(event.target.value);
              }}
            />
            {errors.applicationProcess && (
              <span className="error">{errors.applicationProcess}</span>
            )}

            <label>Job Duration:</label>
            <input
              type="text"
              value={jobDuration}
              maxLength={50}
              onChange={(event) => {
                setJobDuration(event.target.value);
              }}
            />
            {errors.jobDuration && (
              <span className="error">{errors.jobDuration}</span>
            )}

            <label>Work Hours:</label>
            <input
              type="text"
              value={workHours}
              maxLength={50}
              onChange={(event) => {
                setWorkHours(event.target.value);
              }}
            />
            {errors.workHours && (
              <span className="error">{errors.workHours}</span>
            )}

            <label>Benefits:</label>
            <input
              type="text"
              value={benefits}
              maxLength={200}
              onChange={(event) => {
                setBenefits(event.target.value);
              }}
            />
            {errors.benefits && (
              <span className="error">{errors.benefits}</span>
            )}

            <label>Skills:</label>
            <input
              type="text"
              value={skills}
              maxLength={200}
              onChange={(event) => {
                setSkills(event.target.value);
              }}
            />
            {errors.skills && <span className="error">{errors.skills}</span>}
          </div>
        </div>
        <button type="submit" className="btn btn-dark">
          Add
        </button>
      </form>
    </div>
  );
};

export default AddJob;
