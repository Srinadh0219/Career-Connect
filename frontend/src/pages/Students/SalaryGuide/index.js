import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Navigate, Link } from "react-router-dom";
import { FiSearch, FiDollarSign, FiTrendingUp, FiBriefcase, FiArrowRight } from "react-icons/fi";
import { Spin } from "antd";
import API_BASE_URL from "../../../config";
import "./index.css";

const SalaryGuide = () => {
  const jwtToken = Cookies.get("jwt_token");
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const options = {
      method: "GET",
    };
    try {
      const response = await fetch(`${API_BASE_URL}/salary-guide`, options);
      if (response.ok) {
        const salaryData = await response.json();
        setData(Array.isArray(salaryData) ? salaryData : []);
      }
    } catch (err) {
      console.error("Error fetching salary guide:", err);
    } finally {
      setLoading(false);
    }
  };

  if (jwtToken === undefined) {
    return <Navigate to="/student/login" />;
  }

  const filteredData = data.filter((item) =>
    (item.jobRole || "").toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      {/* Hero Header */}
      <div className="max-w-6xl mx-auto text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-2">
          <FiTrendingUp /> Real-time Market Compensation Data
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Find a Career <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">You'll Love</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
          Explore benchmark compensation, salary trends, and in-demand roles across top tech industries.
        </p>

        {/* Search Input Bar */}
        <div className="max-w-xl mx-auto mt-8">
          <div className="relative flex items-center bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden p-1.5 focus-within:ring-2 focus-within:ring-blue-500">
            <FiSearch className="text-slate-400 text-xl ml-4 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search by job role (e.g. Frontend Developer, Python Engineer)..."
              className="w-full bg-transparent text-white placeholder-slate-400 px-2 py-2.5 focus:outline-none text-sm sm:text-base"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                onClick={() => setSearchInput("")}
                className="text-slate-400 hover:text-white text-sm px-3 py-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Salary Cards Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FiBriefcase className="text-blue-400" /> Browse Compensation by Role
          </h2>
          <span className="text-sm font-medium text-slate-400">
            {filteredData.length} roles found
          </span>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((item, idx) => (
              <div
                key={item._id || idx}
                className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition">
                      {item.jobRole}
                    </h3>
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
                      <FiDollarSign className="text-lg" />
                    </div>
                  </div>

                  <div className="mt-4 p-3.5 bg-slate-900/60 rounded-xl border border-slate-700/40">
                    <p className="text-xs text-slate-400 font-medium">Estimated Avg Annual Salary</p>
                    <p className="text-xl font-extrabold text-emerald-400 mt-1">
                      ₹{item.salary}{" "}
                      <span className="text-xs font-normal text-slate-400">/ year</span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">High Demand</span>
                  <Link
                    to="/"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-400 hover:text-blue-300 group-hover:translate-x-1 transition"
                  >
                    View Openings <FiArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
            <p className="text-slate-400 text-lg">No salary records match your search query.</p>
            <button
              onClick={() => setSearchInput("")}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-medium transition"
            >
              Reset Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryGuide;
