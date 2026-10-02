import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineLockClosed,
  HiEye,
  HiEyeOff,
  HiArrowRight,
  HiArrowLeft,
  HiBriefcase,
  HiCheckCircle,
} from "react-icons/hi";
import API_BASE_URL from "../../../config";
import "./index.css";

const CandidateSignUp = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const submitBtn = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!username || !email || !password) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    const userDetails = { username, password, email };
    const url = `${API_BASE_URL}/register/student`;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(userDetails),
    };

    try {
      const response = await fetch(url, options);
      if (response.ok) {
        setSuccessMessage("Account created successfully! Redirecting to login...");
        setUsername("");
        setPassword("");
        setEmail("");
        setTimeout(() => {
          navigate("/student/login");
        }, 1500);
      } else {
        const errText = await response.text();
        setErrorMessage(errText || "User already exists or registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("Unable to connect to server. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
      {/* Background glowing gradients */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 -right-4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Button above Card */}
      <div className="w-full max-w-md mb-3 flex items-center justify-between z-10">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors py-2 px-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-750 border border-slate-700/80 shadow-md text-decoration-none"
        >
          <HiArrowLeft className="text-sm text-blue-400" />
          <span>Back to Home</span>
        </Link>

        <span className="text-[11px] text-slate-400 font-medium">Job Seeker Registration</span>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 border border-slate-100 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2 mb-3 text-decoration-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/30">
              <HiBriefcase className="w-6 h-6" />
            </div>
            <span className="font-extrabold text-xl text-slate-900">CareerConnect</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Create Candidate Account</h1>
          <p className="text-sm text-slate-500 mt-1">
            Join thousands of students and job seekers
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl mb-6 text-sm font-semibold text-center">
          <button
            type="button"
            className="py-2 rounded-lg bg-white text-blue-600 shadow-sm transition-all"
          >
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => navigate("/employer/signup")}
            className="py-2 rounded-lg text-slate-500 hover:text-slate-900 transition-all"
          >
            Employer
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-600 text-xs font-medium text-center">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-medium text-center flex items-center justify-center gap-1.5">
            <HiCheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={submitBtn} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name / Username
            </label>
            <div className="relative">
              <HiOutlineUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                placeholder="John Doe"
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <HiOutlineMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <HiOutlineLockClosed className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                placeholder="Create a strong password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-11 py-3 rounded-xl border border-slate-200 text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? (
                  <HiEyeOff className="w-5 h-5" />
                ) : (
                  <HiEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <span>Creating Account...</span>
            ) : (
              <>
                <span>Create Candidate Account</span>
                <HiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-6 text-center text-sm text-slate-500 border-t border-slate-100 pt-5">
          Already have an account?{" "}
          <Link
            to="/student/login"
            className="font-bold text-blue-600 hover:text-blue-700 text-decoration-none"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CandidateSignUp;
