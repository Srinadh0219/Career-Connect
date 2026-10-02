import React from "react";
import { Link } from "react-router-dom";
import { HiBriefcase } from "react-icons/hi";
import "./index.css";

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <HiBriefcase className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                CAREER<span className="text-blue-400">CONNECT</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering candidates to reach their potential while helping employers discover, interview, and onboard top-tier talent effortlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">For Job Seekers</h4>
            <ul className="space-y-2 text-sm list-unstyled">
              <li>
                <Link to="/student/login" className="text-slate-400 hover:text-white transition-colors text-decoration-none">
                  Candidate Login
                </Link>
              </li>
              <li>
                <Link to="/student/signup" className="text-slate-400 hover:text-white transition-colors text-decoration-none">
                  Create Profile & Resume
                </Link>
              </li>
              <li>
                <Link to="/student/salary-guide" className="text-slate-400 hover:text-white transition-colors text-decoration-none">
                  Salary Guide
                </Link>
              </li>
              <li>
                <Link to="/student/company-reviews" className="text-slate-400 hover:text-white transition-colors text-decoration-none">
                  Company Reviews
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">For Employers</h4>
            <ul className="space-y-2 text-sm list-unstyled">
              <li>
                <Link to="/employer/login" className="text-slate-400 hover:text-white transition-colors text-decoration-none">
                  Employer Sign In
                </Link>
              </li>
              <li>
                <Link to="/employer/signup" className="text-slate-400 hover:text-white transition-colors text-decoration-none">
                  Post a Job Listing
                </Link>
              </li>
              <li>
                <Link to="/employer/view-students" className="text-slate-400 hover:text-white transition-colors text-decoration-none">
                  Discover Talent
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CareerConnect. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with modern web technologies
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
