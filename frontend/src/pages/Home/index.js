import { useState, useEffect } from "react";
import JobItem from "../../components/JobItem";
import { Spin } from "antd";
import { Link } from "react-router-dom";
import {
  HiSearch,
  HiOutlineSparkles,
  HiOutlineDocumentText,
  HiOutlineOfficeBuilding,
  HiArrowSmRight,
} from "react-icons/hi";
import API_BASE_URL from "../../config";
import "./index.css";

const Home = () => {
  const [jobsList, setJobsList] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [selectedMode, setSelectedMode] = useState("all");

  useEffect(() => {
    getJobsList();
  }, []);

  const getJobsList = async () => {
    const apiUrl = `${API_BASE_URL}/jobs`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
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

  const filteredJobsList = jobsList.filter((item) => {
    const query = searchInput.toLowerCase();
    const matchesSearch =
      (item.companyName || "").toLowerCase().includes(query) ||
      (item.jobRole || "").toLowerCase().includes(query) ||
      (item.jobLocation || "").toLowerCase().includes(query);

    const matchesMode =
      selectedMode === "all" ||
      (item.mode || "").toLowerCase() === selectedMode.toLowerCase();

    return matchesSearch && matchesMode;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-semibold uppercase tracking-wider mb-6">
            <HiOutlineSparkles className="w-4 h-4 text-blue-400" />
            Empowering Careers & Accelerating Hiring
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Discover Your Next Career Move <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Or Hire Exceptional Talent
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 mb-10 leading-relaxed">
            Connecting passionate candidates with forward-thinking companies. Browse verified job opportunities and apply directly with your resume.
          </p>

          {/* Integrated Search Box */}
          <div className="max-w-3xl mx-auto bg-white/10 p-2 sm:p-2.5 rounded-2xl backdrop-blur-md shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <div className="relative flex-1 w-full">
                <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="search"
                  placeholder="Job title, keywords, company, or location..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white text-slate-900 placeholder-slate-400 text-sm border-none outline-none focus:outline-none focus:ring-0"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <button
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-sm border-none shadow-md shadow-blue-500/30 transition-all duration-200 flex items-center justify-center gap-2"
                onClick={() => {}}
              >
                <span>Search Jobs</span>
              </button>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
            {["all", "remote", "hybrid", "offline"].map((mode) => (
              <button
                key={mode}
                onClick={() => setSelectedMode(mode)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition-all duration-200 ${
                  selectedMode === mode
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/60"
                }`}
              >
                {mode === "all" ? "All Modes" : mode}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Dual Role Callouts */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Candidate Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-lg shadow-slate-100 flex items-center justify-between gap-4 hover:border-blue-500/30 transition-all">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-blue-600 font-semibold text-xs tracking-wider uppercase">
                <HiOutlineDocumentText className="w-4 h-4" />
                For Candidates
              </div>
              <h2 className="font-bold text-lg text-slate-900">
                Ready for your next opportunity?
              </h2>
              <p className="text-sm text-slate-500">
                Build your profile, upload your resume, and apply with 1-click.
              </p>
            </div>
            <Link
              to="/student/login"
              className="shrink-0 px-4 py-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold text-sm transition-all duration-200 flex items-center gap-1 text-decoration-none shadow-sm"
            >
              <span>Get Started</span>
              <HiArrowSmRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Employer Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-lg shadow-slate-100 flex items-center justify-between gap-4 hover:border-indigo-500/30 transition-all">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
                <HiOutlineOfficeBuilding className="w-4 h-4" />
                For Employers
              </div>
              <h2 className="font-bold text-lg text-slate-900">
                Hiring great talent today?
              </h2>
              <p className="text-sm text-slate-500">
                Post job openings and connect with verified candidates quickly.
              </p>
            </div>
            <Link
              to="/employer/login"
              className="shrink-0 px-4 py-2.5 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-600 hover:text-white font-semibold text-sm transition-all duration-200 flex items-center gap-1 text-decoration-none shadow-sm"
            >
              <span>Post a Job</span>
              <HiArrowSmRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Jobs Listing Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 w-full flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Explore Job Openings
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Showing {filteredJobsList.length} verified listings
            </p>
          </div>

          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 self-start sm:self-auto"
            >
              Clear Search Filters
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spin size="large" />
            <p className="text-sm text-slate-500 mt-4">Loading job openings...</p>
          </div>
        ) : filteredJobsList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobsList.map((item) => (
              <JobItem item={item} key={item._id} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-300">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-4">
              <HiSearch className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No jobs found matching your search</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search terms, removing filters, or browsing all available jobs.
            </p>
            <button
              onClick={() => {
                setSearchInput("");
                setSelectedMode("all");
              }}
              className="mt-5 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
