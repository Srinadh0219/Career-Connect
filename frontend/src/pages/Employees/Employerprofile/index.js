import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Spin } from "antd";
import {
  FiUser,
  FiMail,
  FiBriefcase,
  FiEdit3,
  FiCheck,
  FiX,
} from "react-icons/fi";
import API_BASE_URL from "../../../config";
import "./index.css";

const EmployerProfile = () => {
  const jwtToken = Cookies.get("jwt_token");
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const getUserData = useCallback(async () => {
    if (!jwtToken) {
      setIsLoading(false);
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
        `${API_BASE_URL}/profile/employer`,
        options
      );
      if (response.ok) {
        const data = await response.json();
        setUserData(data || {});
      }
    } catch (err) {
      console.error("Error fetching employer profile:", err);
    } finally {
      setIsLoading(false);
    }
  }, [jwtToken]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  const handleSave = async () => {
    setSaveLoading(true);
    const options = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        accept: "application/json",
        authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(userData),
    };
    try {
      const response = await fetch(
        `${API_BASE_URL}/profile/employer`,
        options
      );
      if (response.ok) {
        await response.json();
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Error saving employer profile:", err);
    } finally {
      setSaveLoading(false);
    }
  };

  if (jwtToken === undefined) {
    return <Navigate to="/employer/login" />;
  }

  const initials = userData.companyName
    ? userData.companyName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "EM";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
      ) : (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header Card */}
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
              <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-indigo-500/30">
                  {initials}
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white">
                    {userData.companyName || "Employer Profile"}
                  </h1>
                  <p className="text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-2">
                    <FiUser className="text-indigo-400" /> {userData.username || "Recruiter"}
                  </p>
                  <p className="text-slate-400 mt-0.5 flex items-center justify-center sm:justify-start gap-2">
                    <FiMail className="text-blue-400" /> {userData.email || "No email"}
                  </p>
                </div>
              </div>

              <div>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <FiEdit3 /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-medium transition"
                    >
                      <FiX /> Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saveLoading}
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-lg shadow-emerald-500/25 transition"
                    >
                      <FiCheck /> {saveLoading ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details Card */}
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <h2 className="text-xl font-bold text-white border-b border-slate-700/60 pb-3 flex items-center gap-2">
              <FiBriefcase className="text-indigo-400" /> Company & Account Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Contact Person / Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={userData.username || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, username: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <div className="p-3.5 bg-slate-900/40 rounded-xl text-slate-200 font-medium border border-slate-700/40">
                    {userData.username || "Not specified"}
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Registered Email
                </label>
                <div className="p-3.5 bg-slate-900/40 rounded-xl text-slate-300 font-medium border border-slate-700/40">
                  {userData.email || "Not specified"}
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Company Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="companyName"
                    value={userData.companyName || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, companyName: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <div className="p-3.5 bg-slate-900/40 rounded-xl text-slate-200 font-medium border border-slate-700/40">
                    {userData.companyName || "Not specified"}
                  </div>
                )}
              </div>

              {/* Current Job Role */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">
                  Designation / Role
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="currentJobRole"
                    value={userData.currentJobRole || ""}
                    onChange={(e) =>
                      setUserData({ ...userData, currentJobRole: e.target.value })
                    }
                    className="w-full px-4 py-2.5 bg-slate-900/60 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <div className="p-3.5 bg-slate-900/40 rounded-xl text-slate-200 font-medium border border-slate-700/40">
                    {userData.currentJobRole || "HR / Recruiter"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerProfile;
