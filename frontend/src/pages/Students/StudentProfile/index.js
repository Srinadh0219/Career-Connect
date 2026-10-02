import Cookies from "js-cookie";
import { useEffect, useState, useCallback, useRef } from "react";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";
import { Spin } from "antd";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBriefcase,
  FiFileText,
  FiEdit3,
  FiX,
  FiUploadCloud,
  FiDownload,
  FiArrowLeft,
  FiHome,
  FiCheckCircle,
  FiAlertCircle,
  FiPlus,
  FiTrash2,
  FiPaperclip,
} from "react-icons/fi";
import API_BASE_URL from "../../../config";
import "./index.css";

const POPULAR_SKILL_SUGGESTIONS = [
  "React",
  "Node.js",
  "JavaScript",
  "Python",
  "Java",
  "SQL",
  "TypeScript",
  "Tailwind CSS",
  "MongoDB",
  "Docker",
  "AWS",
  "Git",
];

const StudentProfile = () => {
  const jwtToken = Cookies.get("jwt_token");
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fileInputRef = useRef(null);

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(""), 3500);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(""), 3500);
    }
  };

  const getUserData = useCallback(async () => {
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
      const response = await fetch(`${API_BASE_URL}/profile/student`, options);
      if (response.ok) {
        const data = await response.json();
        setProfile(data || {});
        setSkills(data && Array.isArray(data.skills) ? data.skills : []);
      }
    } catch (err) {
      console.error("Error fetching student profile:", err);
    } finally {
      setLoading(false);
    }
  }, [jwtToken]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  // Add individual skill
  const handleAddSkill = async (skillToAdd) => {
    const trimmed = (skillToAdd || newSkillInput).trim();
    if (!trimmed) return;

    if (skills.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      showNotification(`Skill "${trimmed}" is already added.`, true);
      setNewSkillInput("");
      return;
    }

    const updatedSkills = [...skills, trimmed];
    setSkills(updatedSkills);
    setNewSkillInput("");

    // Auto-save skills update
    try {
      const updatedProfile = {
        ...profile,
        skills: updatedSkills,
      };
      const fetchOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatedProfile),
      };
      await fetch(`${API_BASE_URL}/profile/student`, fetchOptions);
      setProfile(updatedProfile);
      showNotification(`Added skill "${trimmed}"!`);
    } catch (err) {
      console.error("Error saving skill:", err);
    }
  };

  // Remove individual skill
  const handleRemoveSkill = async (skillToRemove) => {
    const updatedSkills = skills.filter((s) => s !== skillToRemove);
    setSkills(updatedSkills);

    try {
      const updatedProfile = {
        ...profile,
        skills: updatedSkills,
      };
      const fetchOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatedProfile),
      };
      await fetch(`${API_BASE_URL}/profile/student`, fetchOptions);
      setProfile(updatedProfile);
      showNotification(`Removed "${skillToRemove}"`);
    } catch (err) {
      console.error("Error removing skill:", err);
    }
  };

  // Direct Resume Upload
  const handleDirectResumeUpload = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    setResumeUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "image_preset");
      formData.append("cloud_name", "dqztnamkx");

      let resumeUrl = "";
      try {
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dqztnamkx/upload",
          formData
        );
        resumeUrl = response.data.secure_url;
      } catch (cloudErr) {
        console.warn("Cloudinary upload failed, using file reader fallback:", cloudErr);
        resumeUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      if (resumeUrl) {
        const updatedProfile = {
          ...profile,
          resume: resumeUrl,
          resumeFileName: file.name,
        };

        const fetchOptions = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Bearer ${jwtToken}`,
          },
          body: JSON.stringify(updatedProfile),
        };

        const response = await fetch(`${API_BASE_URL}/profile/student`, fetchOptions);
        if (response.ok) {
          setProfile(updatedProfile);
          showNotification(`Resume "${file.name}" uploaded successfully!`);
        } else {
          showNotification("Failed to save resume.", true);
        }
      }
    } catch (err) {
      console.error("Error uploading resume:", err);
      showNotification("Error uploading resume.", true);
    } finally {
      setResumeUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Remove Resume
  const handleRemoveResume = async () => {
    if (!window.confirm("Are you sure you want to remove your resume?")) return;
    try {
      const updatedProfile = {
        ...profile,
        resume: "",
        resumeFileName: "",
      };
      const fetchOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatedProfile),
      };
      await fetch(`${API_BASE_URL}/profile/student`, fetchOptions);
      setProfile(updatedProfile);
      showNotification("Resume removed.");
    } catch (err) {
      showNotification("Error removing resume.", true);
    }
  };

  // Save General Profile Details
  const handleSaveProfile = async () => {
    setSaveLoading(true);
    try {
      const updatedProfile = {
        ...profile,
        skills,
      };
      const fetchOptions = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatedProfile),
      };
      const response = await fetch(`${API_BASE_URL}/profile/student`, fetchOptions);
      if (response.ok) {
        setProfile(updatedProfile);
        setIsEditing(false);
        showNotification("Profile details updated successfully!");
      } else {
        showNotification("Failed to update profile details.", true);
      }
    } catch (err) {
      showNotification("Error updating profile.", true);
    } finally {
      setSaveLoading(false);
    }
  };

  if (jwtToken === undefined) {
    return <Navigate to="/student/login" />;
  }

  const initials = profile.username
    ? profile.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "ST";

  const getCleanResumeName = () => {
    if (profile.resumeFileName) return profile.resumeFileName;
    if (profile.resume) {
      const urlParts = profile.resume.split("/");
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart && lastPart.length < 35 && (lastPart.includes(".pdf") || lastPart.includes(".png") || lastPart.includes(".jpg"))) {
        return decodeURIComponent(lastPart);
      }
      return `${profile.username || "Candidate"}_Resume.pdf`;
    }
    return "Resume.pdf";
  };

  return (
    <div className="min-h-screen bg-slate-950 py-8 px-4 sm:px-6 lg:px-8 text-slate-100">
      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Spin size="large" />
        </div>
      ) : (
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Top Breadcrumb & Alerts */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              to="/student"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs sm:text-sm font-semibold transition"
            >
              <FiArrowLeft className="text-blue-400" />
              <FiHome className="text-blue-400" />
              <span>Back to Home / Browse Jobs</span>
            </Link>

            {successMessage && (
              <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm animate-in fade-in">
                <FiCheckCircle className="shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}
            {errorMessage && (
              <div className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs sm:text-sm font-medium flex items-center gap-2 shadow-sm animate-in fade-in">
                <FiAlertCircle className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* 2-Column Responsive Dashboard Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column (Profile Card & Resume Widget - 4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Profile Card */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-extrabold mx-auto shadow-lg shadow-blue-500/25">
                  {initials}
                </div>

                <h1 className="text-xl font-bold text-white mt-4">
                  {profile.username || "Candidate Name"}
                </h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  {profile.education || "Job Seeker"}
                </p>

                <div className="mt-5 pt-4 border-t border-slate-800 text-left space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <FiMail className="text-blue-400 shrink-0 text-sm" />
                    <span className="truncate">{profile.email || "No email"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FiPhone className="text-emerald-400 shrink-0 text-sm" />
                    <span>{profile.contactNumber || "No contact added"}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <FiMapPin className="text-purple-400 shrink-0 text-sm" />
                    <span className="truncate">{profile.address || "Location not set"}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition shadow-md shadow-blue-600/20 flex items-center justify-center gap-2"
                    >
                      <FiEdit3 /> Edit Details
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="w-1/2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={saveLoading}
                        className="w-1/2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition shadow-md shadow-emerald-600/20"
                      >
                        {saveLoading ? "Saving..." : "Save"}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Short & Sweet Resume Widget */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-bold text-white flex items-center gap-2">
                    <FiPaperclip className="text-emerald-400" /> Resume / CV
                  </h2>
                  <span className="text-[11px] text-slate-400">PDF / Image</span>
                </div>

                {profile.resume ? (
                  <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 shrink-0">
                        <FiFileText className="text-lg" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-white truncate" title={getCleanResumeName()}>
                          {getCleanResumeName()}
                        </p>
                        <p className="text-[10px] text-emerald-400">✓ Uploaded & Active</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
                      <a
                        href={profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white text-center text-xs font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <FiDownload className="text-xs" /> View
                      </a>

                      <button
                        onClick={() => fileInputRef.current && fileInputRef.current.click()}
                        disabled={resumeUploading}
                        className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-center text-xs font-semibold transition flex items-center justify-center gap-1.5"
                      >
                        <FiUploadCloud className="text-xs" /> {resumeUploading ? "..." : "Replace"}
                      </button>

                      <button
                        onClick={handleRemoveResume}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                        title="Remove resume"
                      >
                        <FiTrash2 className="text-xs" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-800 rounded-xl p-4 text-center space-y-2">
                    <p className="text-xs text-slate-400">No resume uploaded</p>
                    <button
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                      disabled={resumeUploading}
                      className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition flex items-center justify-center gap-2"
                    >
                      <FiUploadCloud /> {resumeUploading ? "Uploading..." : "Upload Resume"}
                    </button>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/*"
                  className="hidden"
                  onChange={handleDirectResumeUpload}
                />
              </div>
            </div>

            {/* Right Column (Personal Info & Key Skills - 8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Key Skills Section with Individual Add Button */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FiBriefcase className="text-indigo-400" /> Key Skills & Technologies
                  </h2>
                  <span className="text-xs text-slate-400 font-medium">
                    {skills.length} skills added
                  </span>
                </div>

                {/* Add Skill Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddSkill();
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    placeholder="Type a skill (e.g. React, Python, AWS)..."
                    value={newSkillInput}
                    onChange={(e) => setNewSkillInput(e.target.value)}
                    className="flex-1 px-4 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-xl text-xs sm:text-sm font-semibold transition shadow-md shadow-indigo-600/20 flex items-center gap-1.5 shrink-0"
                  >
                    <FiPlus className="text-base" /> Add Skill
                  </button>
                </form>

                {/* Popular Skill Quick Add Suggestions */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Quick Suggestions:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_SKILL_SUGGESTIONS.filter((s) => !skills.includes(s))
                      .slice(0, 6)
                      .map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => handleAddSkill(suggestion)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 rounded-lg text-[11px] font-medium transition flex items-center gap-1"
                        >
                          <FiPlus className="text-[10px] text-indigo-400" /> {suggestion}
                        </button>
                      ))}
                  </div>
                </div>

                {/* Added Skills Tag List */}
                <div className="pt-2">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Your Skills:
                  </span>
                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold rounded-xl"
                        >
                          <span>{skill}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-slate-400 hover:text-rose-400 p-0.5 rounded transition"
                            title={`Remove ${skill}`}
                          >
                            <FiX className="text-xs" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      No skills added yet. Type a skill above and click Add Skill!
                    </p>
                  )}
                </div>
              </div>

              {/* Personal & Educational Information */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FiUser className="text-blue-400" /> Personal & Academic Background
                  </h2>
                  {isEditing && (
                    <span className="text-xs text-amber-400 font-medium">
                      Editing Mode Active
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={profile.username || ""}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="p-2.5 bg-slate-950/60 rounded-xl text-slate-200 text-xs sm:text-sm border border-slate-800/80 font-medium">
                        {profile.username || "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Email Address
                    </label>
                    <div className="p-2.5 bg-slate-950/60 rounded-xl text-slate-400 text-xs sm:text-sm border border-slate-800/80">
                      {profile.email || "Not specified"}
                    </div>
                  </div>

                  {/* Contact Number */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Contact Number
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="contactNumber"
                        value={profile.contactNumber || ""}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="p-2.5 bg-slate-950/60 rounded-xl text-slate-200 text-xs sm:text-sm border border-slate-800/80 font-medium">
                        {profile.contactNumber || "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* Location / Address */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Location / City
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="address"
                        value={profile.address || ""}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="p-2.5 bg-slate-950/60 rounded-xl text-slate-200 text-xs sm:text-sm border border-slate-800/80 font-medium">
                        {profile.address || "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* Education */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Education / Degree
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="education"
                        placeholder="e.g. B.Tech Computer Science"
                        value={profile.education || ""}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="p-2.5 bg-slate-950/60 rounded-xl text-slate-200 text-xs sm:text-sm border border-slate-800/80 font-medium">
                        {profile.education || "Not specified"}
                      </div>
                    )}
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                      Experience Level
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="experience"
                        placeholder="e.g. 0-1 Years / Fresher"
                        value={profile.experience || ""}
                        onChange={handleInputChange}
                        className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <div className="p-2.5 bg-slate-950/60 rounded-xl text-slate-200 text-xs sm:text-sm border border-slate-800/80 font-medium">
                        {profile.experience || "Not specified"}
                      </div>
                    )}
                  </div>
                </div>

                {isEditing && (
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProfile}
                      disabled={saveLoading}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition shadow-md shadow-emerald-600/20"
                    >
                      {saveLoading ? "Saving..." : "Save Details"}
                    </button>
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

export default StudentProfile;
