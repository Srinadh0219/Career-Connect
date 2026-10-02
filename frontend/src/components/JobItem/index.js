import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import {
  HiOutlineLocationMarker,
  HiOutlineCurrencyRupee,
  HiOutlineClock,
  HiOutlineCalendar,
  HiOutlineArrowRight,
  HiOutlineOfficeBuilding,
} from "react-icons/hi";
import "./index.css";

const JobItem = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const jwtToken = Cookies.get("jwt_token");

  const { item } = props;
  const {
    _id,
    companyName,
    jobRole,
    jobLocation,
    jobType,
    mode,
    stipend,
    jobPostingDate,
    applicationDeadline,
    jobDuration,
    workHours,
  } = item || {};

  const handleShowJobDetails = () => {
    if (!jwtToken) {
      navigate("/student/login");
      return;
    }
    if (location.pathname.includes("/student") || location.pathname === "/") {
      navigate(`/student/jobs/${_id}`);
    }
  };

  function daysAgo(dateString) {
    if (!dateString) return "Recently";
    const today = new Date();
    const jobDate = new Date(dateString);
    if (isNaN(jobDate.getTime())) return "Recently";
    const diffTime = Math.abs(today - jobDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1 ? "Today" : `${diffDays}d ago`;
  }

  function formatDate(dateString) {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Open";
    }
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  // Generate deterministic background color for company avatar
  const getAvatarColor = (name) => {
    const colors = [
      "from-blue-600 to-indigo-600",
      "from-violet-600 to-purple-600",
      "from-emerald-600 to-teal-600",
      "from-amber-500 to-orange-600",
      "from-rose-500 to-pink-600",
      "from-cyan-600 to-blue-600",
    ];
    if (!name) return colors[0];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const initials = companyName
    ? companyName
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "CC";

  return (
    <div
      className="modern-job-card group relative bg-white border border-slate-200/80 rounded-2xl p-6 hover:shadow-xl hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
      onClick={handleShowJobDetails}
    >
      <div>
        {/* Card Header: Avatar, Company, Role, Days Ago */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${getAvatarColor(
                companyName
              )} text-white font-bold text-base flex items-center justify-center shadow-md shadow-slate-200`}
            >
              {initials}
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {jobRole}
              </h3>
              <p className="text-sm font-medium text-slate-500 flex items-center gap-1.5 mt-0.5">
                <HiOutlineOfficeBuilding className="w-4 h-4 text-slate-400" />
                <span>{companyName}</span>
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 whitespace-nowrap">
            {daysAgo(jobPostingDate)}
          </span>
        </div>

        {/* Location & Key Stats */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600 mb-4 flex-wrap">
          <span className="flex items-center gap-1">
            <HiOutlineLocationMarker className="w-4 h-4 text-slate-400" />
            {jobLocation || "Location Not Specified"}
          </span>
          {workHours && (
            <span className="flex items-center gap-1">
              <HiOutlineClock className="w-4 h-4 text-slate-400" />
              {workHours}
            </span>
          )}
          {jobDuration && (
            <span className="text-slate-500">
              Duration: <strong className="text-slate-700">{jobDuration}</strong>
            </span>
          )}
        </div>

        {/* Tag Badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          {stipend && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <HiOutlineCurrencyRupee className="w-3.5 h-3.5" />
              {stipend}
            </span>
          )}
          {mode && (
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/60 capitalize">
              {mode}
            </span>
          )}
          {jobType && (
            <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/60 capitalize">
              {jobType}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer: Deadline & Action */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
        <span className="text-xs text-slate-500 flex items-center gap-1.5">
          <HiOutlineCalendar className="w-4 h-4 text-slate-400" />
          <span>Deadline: <strong>{formatDate(applicationDeadline)}</strong></span>
        </span>

        <span className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform duration-200">
          View Details
          <HiOutlineArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  );
};

export default JobItem;
