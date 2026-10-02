import { useState, useEffect } from "react";
import { RiStarSFill } from "react-icons/ri";
import { FiSearch, FiBriefcase, FiDollarSign, FiMessageSquare, FiTrendingUp } from "react-icons/fi";
import SubmitFeedback from "./SubmitFeedback";
import Cookies from "js-cookie";
import { Spin } from "antd";
import { Navigate, useLocation, Link } from "react-router-dom";
import API_BASE_URL from "../../../config";
import "./index.css";

const CompanyReviewItem = ({ item }) => {
  const avgScore = item.reviewsCount > 0 ? (item.reviewScore / item.reviewsCount).toFixed(1) : 5.0;
  const numStars = Math.min(5, Math.max(1, Math.round(avgScore)));

  const initials = (item.companyName || "CO")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-6 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md shadow-blue-500/20 shrink-0">
            {initials}
          </div>
          <div>
            <h3 className="font-bold text-lg text-white">{item.companyName}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="flex text-amber-400">
                {Array.from({ length: 5 }, (_, i) => (
                  <RiStarSFill
                    key={i}
                    className={`text-lg ${i < numStars ? "text-amber-400" : "text-slate-600"}`}
                  />
                ))}
              </div>
              <span className="text-white font-bold text-sm ml-1">{avgScore}</span>
              <span className="text-slate-400 text-xs">({item.reviewsCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
        <Link to="/salary-guide" className="hover:text-blue-400 transition flex items-center gap-1">
          <FiDollarSign /> Salaries
        </Link>
        <span className="inline-flex items-center gap-1">
          <FiMessageSquare /> Feedback
        </span>
        <Link to="/" className="hover:text-blue-400 transition flex items-center gap-1">
          <FiBriefcase /> Open Jobs
        </Link>
      </div>
    </div>
  );
};

const CompanyReviews = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const jwtToken = Cookies.get("jwt_token");
  const [companiesReviewsList, setCompaniesReviewsList] = useState([]);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    getCompaniesReviewsList();
  }, []);

  const getCompaniesReviewsList = async () => {
    const options = {
      method: "GET",
    };
    try {
      const response = await fetch(
        `${API_BASE_URL}/company-reviews`,
        options
      );
      if (response.ok) {
        const data = await response.json();
        setCompaniesReviewsList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching company reviews:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const submitFeedback = async (companyName) => {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ companyName, rating }),
    };
    try {
      await fetch(
        `${API_BASE_URL}/company-reviews`,
        options
      );
      getCompaniesReviewsList();
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  if (jwtToken === undefined) {
    return <Navigate to="/student/login" />;
  }

  const filteredCompaniesReviewsList = companiesReviewsList.filter((item) =>
    (item.companyName || "").toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      {/* Hero Banner */}
      <div className="max-w-6xl mx-auto text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-2">
          <FiTrendingUp /> Verified Candidate Reviews
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Find Great <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">Places to Work</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-base sm:text-lg">
          Discover company culture, ratings, perks, and direct reviews from employees and candidates.
        </p>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto mt-8">
          <div className="relative flex items-center bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-xl overflow-hidden p-1.5 focus-within:ring-2 focus-within:ring-blue-500">
            <FiSearch className="text-slate-400 text-xl ml-4 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search companies by name..."
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

      <div className="max-w-6xl mx-auto space-y-10">
        {/* Rating Submission Banner */}
        {pathname.startsWith("/student") && (
          <div className="bg-gradient-to-r from-slate-800/90 via-slate-800 to-indigo-950/40 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white">Rate your recent company</h3>
              <p className="text-slate-400 text-sm mt-1">
                Help fellow candidates make informed career decisions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex items-center gap-1 bg-slate-900/60 px-4 py-2 rounded-2xl border border-slate-700/50">
                {[...Array(5)].map((_, index) => {
                  const ratingValue = index + 1;
                  return (
                    <span
                      key={index}
                      className={`text-2xl cursor-pointer transition ${
                        ratingValue <= (hover || rating)
                          ? "text-amber-400 scale-110"
                          : "text-slate-600 hover:text-slate-400"
                      }`}
                      onClick={() => setRating(ratingValue)}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(0)}
                    >
                      ★
                    </span>
                  );
                })}
                <span className="ml-2 text-sm font-bold text-white">{rating} / 5</span>
              </div>

              <SubmitFeedback
                submitFeedback={submitFeedback}
                getCompaniesReviewsList={getCompaniesReviewsList}
                rating={rating}
              />
            </div>
          </div>
        )}

        {/* Company Reviews Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FiBriefcase className="text-blue-400" /> Featured Companies ({filteredCompaniesReviewsList.length})
            </h2>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Spin size="large" />
            </div>
          ) : filteredCompaniesReviewsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCompaniesReviewsList.map((item, index) => (
                <CompanyReviewItem key={item._id || index} item={item} />
              ))}
            </div>
          ) : (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
              <p className="text-slate-400 text-lg">No company reviews match your search.</p>
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
    </div>
  );
};

export default CompanyReviews;
