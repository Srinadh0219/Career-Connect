import { Navigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Spin } from "antd";
import {
  FiUsers,
  FiMail,
  FiPhone,
  FiFileText,
  FiExternalLink,
  FiX,
  FiSearch,
  FiBookOpen,
  FiDownload,
} from "react-icons/fi";
import API_BASE_URL from "../../../config";
import "./index.css";

const ViewStudents = () => {
  const jwtToken = Cookies.get("jwt_token");
  const [studentsList, setStudentsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const getStudentsList = useCallback(async () => {
    if (!jwtToken) {
      setLoading(false);
      return;
    }
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const response = await fetch(
        `${API_BASE_URL}/employer/view-students`,
        options
      );
      if (response.ok) {
        const data = await response.json();
        setStudentsList(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  }, [jwtToken]);

  useEffect(() => {
    getStudentsList();
  }, [getStudentsList]);

  const handleViewResume = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  // Direct file downloader
  const handleDownloadResume = async (url, candidateName) => {
    if (!url) return;
    setDownloading(true);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      const extension = url.includes(".pdf") ? "pdf" : "png";
      link.download = `${candidateName || "Candidate"}_Resume.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback: Open directly
      window.open(url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  if (jwtToken === undefined) {
    return <Navigate to="/employer/login" />;
  }

  const filteredStudents = studentsList.filter((s) => {
    const term = searchInput.toLowerCase();
    const nameMatch = (s.username || "").toLowerCase().includes(term);
    const emailMatch = (s.email || "").toLowerCase().includes(term);
    const skillsMatch = (s.skills || []).some((sk) =>
      sk.toLowerCase().includes(term)
    );
    return nameMatch || emailMatch || skillsMatch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
              <FiBookOpen /> Talent Discovery
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Registered Candidates</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              Browse candidate profiles, contact via Email/Call, and download resumes ({studentsList.length} total)
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-72">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name, skill..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/80 bg-slate-900/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Candidate</th>
                    <th className="py-4 px-6">Quick Contact (Mail / Call)</th>
                    <th className="py-4 px-6">Skills</th>
                    <th className="py-4 px-6 text-right">Resume & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-sm">
                  {filteredStudents.map((student) => {
                    const initials = (student.username || "CD")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <tr
                        key={student._id}
                        className="hover:bg-slate-750/50 transition duration-150"
                      >
                        <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-500/20 shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{student.username || "Candidate"}</p>
                            <p className="text-xs text-slate-400">{student.education || "Student"}</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col sm:flex-row gap-2">
                            {student.email ? (
                              <a
                                href={`mailto:${student.email}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/20 text-xs font-medium transition"
                                title={`Send email to ${student.email}`}
                              >
                                <FiMail className="text-sm" /> Email
                              </a>
                            ) : null}
                            {student.contactNumber ? (
                              <a
                                href={`tel:${student.contactNumber}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/20 text-xs font-medium transition"
                                title={`Call ${student.contactNumber}`}
                              >
                                <FiPhone className="text-sm" /> Call
                              </a>
                            ) : null}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1.5 max-w-sm">
                            {(student.skills || []).length > 0 ? (
                              student.skills.map((sk, idx) => (
                                <span
                                  key={idx}
                                  className="px-2.5 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg text-xs font-medium whitespace-nowrap"
                                >
                                  {sk}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-500 italic">No skills listed</span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {student.resume ? (
                            <button
                              onClick={() => handleViewResume(student)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-500/20 transition"
                            >
                              <FiFileText /> View Resume
                            </button>
                          ) : (
                            <span className="text-xs text-slate-500 italic">No Resume</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-12 text-center max-w-lg mx-auto space-y-3">
            <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center text-3xl mx-auto">
              <FiUsers />
            </div>
            <h2 className="text-xl font-bold text-white">No Candidates Found</h2>
            <p className="text-slate-400 text-sm">
              No registered candidate profiles matched your search term.
            </p>
          </div>
        )}

        {/* Resume Preview Modal with Open and Download Buttons */}
        {showModal && selectedStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
                    <FiFileText className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      Resume - {selectedStudent.username || "Candidate"}
                    </h3>
                    <p className="text-xs text-slate-400">
                      {selectedStudent.education || "Candidate Resume"}
                    </p>
                  </div>
                </div>

                {/* Only Open and Download Buttons + Close */}
                <div className="flex items-center gap-3">
                  {selectedStudent.resume && (
                    <>
                      <a
                        href={selectedStudent.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/25 transition"
                      >
                        <FiExternalLink /> Open
                      </a>

                      <button
                        onClick={() =>
                          handleDownloadResume(
                            selectedStudent.resume,
                            selectedStudent.username
                          )
                        }
                        disabled={downloading}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/25 transition"
                      >
                        <FiDownload /> {downloading ? "Downloading..." : "Download"}
                      </button>
                    </>
                  )}

                  <button
                    onClick={handleCloseModal}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition ml-2"
                  >
                    <FiX className="text-xl" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto flex items-center justify-center bg-slate-950 min-h-[450px]">
                {selectedStudent.resume ? (
                  <img
                    src={selectedStudent.resume}
                    alt={`${selectedStudent.username || "Candidate"} Resume`}
                    className="max-w-full h-auto rounded-xl shadow-lg border border-slate-800 object-contain"
                  />
                ) : (
                  <p className="text-slate-400">Resume could not be displayed.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStudents;
