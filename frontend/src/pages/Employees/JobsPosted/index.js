import { Spin } from "antd";
import Cookies from "js-cookie";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import {
  FiBriefcase,
  FiMapPin,
  FiUsers,
  FiCalendar,
  FiArrowRight,
  FiPlus,
  FiLayers,
} from "react-icons/fi";
import API_BASE_URL from "../../../config";
import "./index.css";

const JobsPosted = () => {
  const navigate = useNavigate();
  const jwtToken = Cookies.get("jwt_token");
  const [jobsPostedList, setJobsPostedList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const getJobsPostedList = useCallback(async () => {
    if (!jwtToken) {
      setLoading(false);
      return;
    }
    const options = {
      method: "GET",
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const response = await fetch(
        `${API_BASE_URL}/employer/jobs/posted/`,
        options
      );
      if (response.ok) {
        const data = await response.json();
        setJobsPostedList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching posted jobs:", err);
    } finally {
      setLoading(false);
    }
  }, [jwtToken]);

  useEffect(() => {
    getJobsPostedList();
  }, [getJobsPostedList]);

  if (jwtToken === undefined) {
    return <Navigate to="/employer/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header with CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
              <FiLayers /> Employer Dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Posted Job Openings</h1>
            <p className="text-slate-400 text-sm mt-1">
              Manage your active listings and track candidate applications.
            </p>
          </div>

          <div>
            <Link
              to="/employer/add-jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5"
            >
              <FiPlus className="text-lg" /> Post New Job
            </Link>
          </div>
        </div>

        {/* Jobs List */}
        <div>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : jobsPostedList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobsPostedList.map((job) => {
                const appCount = (job.applications || []).length;
                return (
                  <div
                    key={job._id}
                    onClick={() => navigate(`/employer/jobs/posted/${job._id}`)}
                    className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-xl font-bold text-white group-hover:text-indigo-400 transition">
                          {job.jobRole}
                        </h2>
                        <span className="px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold rounded-lg shrink-0">
                          {job.jobType || "Full Time"}
                        </span>
                      </div>

                      <p className="text-slate-400 text-sm mt-2 flex items-center gap-1.5">
                        <FiMapPin className="text-slate-500" /> {job.jobLocation}
                      </p>

                      <div className="mt-4 p-3 bg-slate-900/60 rounded-xl border border-slate-700/40 flex items-center justify-between">
                        <span className="text-xs text-slate-400 flex items-center gap-1.5">
                          <FiUsers className="text-indigo-400" /> Applications
                        </span>
                        <span className="text-sm font-extrabold text-white bg-slate-800 px-2.5 py-0.5 rounded-md border border-slate-700">
                          {appCount}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <FiCalendar /> {new Date(job.jobPostingDate || Date.now()).toLocaleDateString()}
                      </span>
                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-400 group-hover:translate-x-1 transition">
                        View Applicants <FiArrowRight />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-4">
              <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center text-3xl mx-auto">
                <FiBriefcase />
              </div>
              <h2 className="text-xl font-bold text-white">No Jobs Posted Yet</h2>
              <p className="text-slate-400 text-sm">
                You haven't posted any job openings yet. Start hiring top talent by posting your first job.
              </p>
              <Link
                to="/employer/add-jobs"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-600/25"
              >
                <FiPlus /> Post Your First Job
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsPosted;
