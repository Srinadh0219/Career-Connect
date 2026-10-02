import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Cookies from "js-cookie";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyRupee,
  HiOutlineOfficeBuilding,
  HiOutlineBriefcase,
  HiOutlineAcademicCap,
  HiArrowLeft,
  HiCheckCircle,
} from "react-icons/hi";
import { Spin } from "antd";
import API_BASE_URL from "../../config";
import "./index.css";

function formatDate(dateString) {
  if (!dateString) return "Not specified";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Open";
  }
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

const verifyProfile = async (jwtToken) => {
  if (!jwtToken) return false;
  try {
    const response = await fetch(`${API_BASE_URL}/verify-profile`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    });
    if (response.ok) return true;
    return false;
  } catch (error) {
    console.error("Error verifying profile:", error);
    return false;
  }
};

const checkForApplied = async (id, jwtToken) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/jobs/${id}/check-isapplied`,
      {
        method: "GET",
        headers: {
          authorization: `Bearer ${jwtToken}`,
        },
      }
    );
    if (response.ok) {
      const resData = await response.json();
      return resData.isApplied;
    }
    return false;
  } catch (error) {
    return false;
  }
};

const DetailedJobDescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const jwtToken = Cookies.get("jwt_token");
  const [jobDetails, setJobDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);

  const getData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
      if (response.ok) {
        const parsedData = await response.json();
        setJobDetails(parsedData);
      }
      if (jwtToken) {
        const applied = await checkForApplied(id, jwtToken);
        setHasApplied(applied);
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id, jwtToken]);

  useEffect(() => {
    getData();
  }, [getData]);

  const applyJobBtn = async () => {
    if (!jwtToken) {
      navigate("/student/login");
      return;
    }

    if (hasApplied) {
      alert("You have already applied for this job");
      return;
    }

    setIsApplying(true);
    const isVerified = await verifyProfile(jwtToken);

    if (!isVerified) {
      setIsApplying(false);
      alert("Please complete your profile (upload resume) before applying.");
      navigate("/student/profile");
      return;
    }

    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/jobs/apply/${id}`,
        options
      );
      if (!response.ok) {
        alert("Failed to apply for the job");
      } else {
        setHasApplied(true);
        alert("Successfully applied for this position!");
      }
    } catch (err) {
      alert("Failed to apply for the job");
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!jobDetails) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Job Not Found</h2>
        <Link to="/" className="text-blue-600 font-semibold flex items-center gap-1">
          <HiArrowLeft className="w-4 h-4" /> Back to listings
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 mb-6 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <HiArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </button>

        {/* Main Header Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200/60">
                <HiOutlineBriefcase className="w-3.5 h-3.5" />
                {jobDetails.jobType || "Job Opportunity"}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {jobDetails.jobRole}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600">
                <span className="flex items-center gap-1.5 font-bold text-slate-800">
                  <HiOutlineOfficeBuilding className="w-4 h-4 text-slate-400" />
                  {jobDetails.companyName}
                </span>
                <span className="flex items-center gap-1.5">
                  <HiOutlineLocationMarker className="w-4 h-4 text-slate-400" />
                  {jobDetails.jobLocation}
                </span>
                {jobDetails.mode && (
                  <span className="px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold text-xs capitalize">
                    {jobDetails.mode}
                  </span>
                )}
              </div>
            </div>

            {/* Apply Action Card */}
            <div className="shrink-0 flex flex-col items-start md:items-end gap-3">
              {jobDetails.stipend && (
                <div className="text-2xl font-black text-emerald-600 flex items-center">
                  <HiOutlineCurrencyRupee className="w-6 h-6" />
                  <span>{jobDetails.stipend}</span>
                </div>
              )}
              <button
                onClick={applyJobBtn}
                disabled={hasApplied || isApplying}
                className={`w-full md:w-auto px-8 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200 shadow-lg flex items-center justify-center gap-2 cursor-pointer ${
                  hasApplied
                    ? "bg-emerald-600 text-white shadow-emerald-500/20 cursor-default"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/30 active:scale-95"
                }`}
              >
                {hasApplied ? (
                  <>
                    <HiCheckCircle className="w-5 h-5 text-white" />
                    <span>Applied Already</span>
                  </>
                ) : isApplying ? (
                  <span>Submitting Application...</span>
                ) : (
                  <span>Apply for this Position</span>
                )}
              </button>
            </div>
          </div>

          {/* Quick Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-medium block mb-1">Duration</span>
              <strong className="text-sm text-slate-900">{jobDetails.jobDuration || "Flexible"}</strong>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-medium block mb-1">Working Hours</span>
              <strong className="text-sm text-slate-900">{jobDetails.workHours || "Standard"}</strong>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-medium block mb-1">Posted On</span>
              <strong className="text-sm text-slate-900">{formatDate(jobDetails.jobPostingDate)}</strong>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-medium block mb-1">Deadline</span>
              <strong className="text-sm text-rose-600">{formatDate(jobDetails.applicationDeadline)}</strong>
            </div>
          </div>
        </div>

        {/* Details Content Cards */}
        <div className="space-y-6">
          {jobDetails.companyOverview && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md">
              <h2 className="text-lg font-bold text-slate-900 mb-3">About the Company</h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {jobDetails.companyOverview}
              </p>
            </div>
          )}

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Job Description</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {jobDetails.jobDescription}
            </p>
          </div>

          {(jobDetails.qualifications || jobDetails.educationLevel || jobDetails.experienceLevel) && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md">
              <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <HiOutlineAcademicCap className="w-5 h-5 text-blue-600" />
                Requirements & Qualifications
              </h2>
              <div className="space-y-3 text-sm text-slate-700">
                {jobDetails.educationLevel && (
                  <p>
                    <strong className="text-slate-900">Education:</strong> {jobDetails.educationLevel}
                  </p>
                )}
                {jobDetails.experienceLevel && (
                  <p>
                    <strong className="text-slate-900">Experience Level:</strong> {jobDetails.experienceLevel}
                  </p>
                )}
                {jobDetails.qualifications && (
                  <p>
                    <strong className="text-slate-900">Key Qualifications:</strong> {jobDetails.qualifications}
                  </p>
                )}
                {jobDetails.skillsRequired && (
                  <p>
                    <strong className="text-slate-900">Required Skills:</strong> {jobDetails.skillsRequired}
                  </p>
                )}
              </div>
            </div>
          )}

          {jobDetails.benefits && (
            <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md">
              <h2 className="text-lg font-bold text-slate-900 mb-3">Perks & Benefits</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {jobDetails.benefits}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedJobDescription;
