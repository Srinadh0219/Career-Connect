import React, { useState } from "react";
import Cookies from "js-cookie";
import { Navigate, useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiCalendar,
  FiFileText,
  FiCheckCircle,
  FiPlusCircle,
} from "react-icons/fi";
import API_BASE_URL from "../../../config";
import "./index.css";

const AddJob = () => {
  const navigate = useNavigate();
  const jwtToken = Cookies.get("jwt_token");
  const [companyName, setCompanyName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobType, setJobType] = useState("Full Time");
  const [mode, setMode] = useState("Remote");
  const [stipend, setStipend] = useState("");
  const [companyOverview, setCompanyOverview] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [qualifications, setQualifications] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("0-2 Years");
  const [educationLevel, setEducationLevel] = useState("Bachelor's Degree");
  const [jobPostingDate, setJobPostingDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [applicationDeadline, setApplicationDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [applicationProcess, setApplicationProcess] = useState("Online Application & Technical Interview");
  const [jobDuration, setJobDuration] = useState("Full Time");
  const [workHours, setWorkHours] = useState("40 hrs / week");
  const [benefits, setBenefits] = useState("Health Insurance, Flexible Hours, Learning Allowance");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!companyName.trim()) newErrors.companyName = "Company Name is required.";
    if (!jobRole.trim()) newErrors.jobRole = "Job Role is required.";
    if (!jobLocation.trim()) newErrors.jobLocation = "Job Location is required.";
    if (!jobType.trim()) newErrors.jobType = "Job Type is required.";
    if (!mode.trim()) newErrors.mode = "Mode is required.";
    if (!stipend.trim()) newErrors.stipend = "Stipend / Salary is required.";
    if (!companyOverview.trim()) newErrors.companyOverview = "Company Overview is required.";
    if (!jobDescription.trim()) newErrors.jobDescription = "Job Description is required.";
    if (!qualifications.trim()) newErrors.qualifications = "Qualifications are required.";
    if (!experienceLevel.trim()) newErrors.experienceLevel = "Experience Level is required.";
    if (!educationLevel.trim()) newErrors.educationLevel = "Education Level is required.";
    if (!applicationProcess.trim()) newErrors.applicationProcess = "Application Process is required.";
    if (!jobDuration.trim()) newErrors.jobDuration = "Job Duration is required.";
    if (!workHours.trim()) newErrors.workHours = "Work Hours are required.";
    if (!benefits.trim()) newErrors.benefits = "Benefits are required.";
    if (!skills.trim()) newErrors.skills = "Skills are required.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addJobBtn = async (event) => {
    event.preventDefault();
    if (!validateForm()) {
      return;
    }
    setLoading(true);
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

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(jobDetails),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/jobs`, options);
      if (response.ok) {
        alert("Job Posted Successfully!");
        try {
          await fetch(`${API_BASE_URL}/send-mail`, {
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
        } catch (mailErr) {
          console.warn("Mail dispatch error:", mailErr);
        }
        navigate("/employer/jobs/posted");
      } else {
        alert("Failed to add job. Please try again.");
      }
    } catch (err) {
      console.error("Error adding job:", err);
      alert("Failed to add job. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (jwtToken === undefined) {
    return <Navigate to="/employer/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <FiPlusCircle /> Employer Portal
          </div>
          <h1 className="text-3xl font-extrabold text-white">Post a New Job Opportunity</h1>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Connect with top candidates by providing comprehensive job requirements and perks.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <form onSubmit={addJobBtn} className="space-y-8">
            {/* Section 1: Basic Info */}
            <div>
              <h2 className="text-lg font-bold text-white border-b border-slate-700/60 pb-2 mb-4 flex items-center gap-2">
                <FiBriefcase className="text-indigo-400" /> Basic Role Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Company Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Acme Innovations"
                    value={companyName}
                    maxLength={50}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.companyName && <p className="text-rose-400 text-xs mt-1">{errors.companyName}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Job Role / Title *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={jobRole}
                    maxLength={50}
                    onChange={(e) => setJobRole(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.jobRole && <p className="text-rose-400 text-xs mt-1">{errors.jobRole}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bengaluru, India or Remote"
                    value={jobLocation}
                    maxLength={100}
                    onChange={(e) => setJobLocation(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.jobLocation && <p className="text-rose-400 text-xs mt-1">{errors.jobLocation}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Work Mode *
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Onsite">Onsite</option>
                    <option value="Offline">Offline</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Job Type *
                  </label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Stipend / Salary Range *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ₹12,00,000 / yr or ₹30,000 / mo"
                    value={stipend}
                    maxLength={50}
                    onChange={(e) => setStipend(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.stipend && <p className="text-rose-400 text-xs mt-1">{errors.stipend}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: Details & Description */}
            <div>
              <h2 className="text-lg font-bold text-white border-b border-slate-700/60 pb-2 mb-4 flex items-center gap-2">
                <FiFileText className="text-blue-400" /> Job Details & Requirements
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Company Overview *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the company and mission..."
                    value={companyOverview}
                    maxLength={300}
                    onChange={(e) => setCompanyOverview(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.companyOverview && <p className="text-rose-400 text-xs mt-1">{errors.companyOverview}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Job Description & Responsibilities *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe day-to-day responsibilities and projects..."
                    value={jobDescription}
                    maxLength={500}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {errors.jobDescription && <p className="text-rose-400 text-xs mt-1">{errors.jobDescription}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Required Skills (comma separated) *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. React, Node.js, TypeScript, Tailwind"
                      value={skills}
                      maxLength={200}
                      onChange={(e) => setSkills(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.skills && <p className="text-rose-400 text-xs mt-1">{errors.skills}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Qualifications *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. B.Tech / M.Tech in CS or relevant experience"
                      value={qualifications}
                      maxLength={200}
                      onChange={(e) => setQualifications(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    {errors.qualifications && <p className="text-rose-400 text-xs mt-1">{errors.qualifications}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Logistics & Timelines */}
            <div>
              <h2 className="text-lg font-bold text-white border-b border-slate-700/60 pb-2 mb-4 flex items-center gap-2">
                <FiCalendar className="text-emerald-400" /> Logistics & Schedule
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Experience Level
                  </label>
                  <input
                    type="text"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Education Level
                  </label>
                  <input
                    type="text"
                    value={educationLevel}
                    onChange={(e) => setEducationLevel(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Application Process
                  </label>
                  <input
                    type="text"
                    value={applicationProcess}
                    onChange={(e) => setApplicationProcess(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Job Posting Date
                  </label>
                  <input
                    type="date"
                    value={jobPostingDate}
                    onChange={(e) => setJobPostingDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={applicationDeadline}
                    onChange={(e) => setApplicationDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Work Hours
                  </label>
                  <input
                    type="text"
                    value={workHours}
                    onChange={(e) => setWorkHours(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Job Duration
                  </label>
                  <input
                    type="text"
                    value={jobDuration}
                    onChange={(e) => setJobDuration(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Perks & Benefits
                  </label>
                  <input
                    type="text"
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-base shadow-xl shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                <FiCheckCircle className="text-xl" />
                {loading ? "Publishing Job..." : "Publish Job Opening"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddJob;
