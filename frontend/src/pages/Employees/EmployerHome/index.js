import Cookies from "js-cookie";
import { Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import JobItem from "../../../components/JobItem";
import { Spin } from "antd";
import { HiSearch, HiOutlinePlusCircle } from "react-icons/hi";
import API_BASE_URL from "../../../config";
import "./index.css";

const EmployerHome = () => {
  const [jobsList, setJobsList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    getJobsList();
  }, []);

  const getJobsList = async () => {
    const jwtToken = Cookies.get("jwt_token");
    if (!jwtToken) {
      setLoading(false);
      return;
    }
    const apiUrl = `${API_BASE_URL}/jobs`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    try {
      const response = await fetch(apiUrl, options);
      if (response.ok) {
        const fetchedData = await response.json();
        setJobsList(Array.isArray(fetchedData) ? fetchedData : []);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken === undefined) {
    return <Navigate to="/employer/login" />;
  }

  const filteredJobsList = jobsList.filter((item) => {
    const query = searchInput.toLowerCase();
    return (
      (item.companyName || "").toLowerCase().includes(query) ||
      (item.jobRole || "").toLowerCase().includes(query) ||
      (item.jobLocation || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen bg-slate-50/60 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Recruiter Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 rounded-3xl p-8 sm:p-10 text-white mb-10 shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Recruiter Dashboard
            </h1>
            <p className="text-indigo-200 text-sm sm:text-base">
              Post new job openings, manage candidate applications, and review market compensation.
            </p>
          </div>
          <Link
            to="/employer/jobs/posting/post"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-sm shadow-lg shadow-blue-500/30 hover:from-blue-500 hover:to-indigo-500 transition-all text-decoration-none shrink-0"
          >
            <HiOutlinePlusCircle className="w-5 h-5" />
            <span>Post a New Job</span>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-8 relative max-w-2xl">
          <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="search"
            placeholder="Filter job listings by title, company, location..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Listings */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900">All Active Openings ({filteredJobsList.length})</h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredJobsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobsList.map((item) => (
              <JobItem item={item} key={item._id} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-slate-500">No jobs found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerHome;
