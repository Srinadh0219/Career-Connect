import { useParams, Navigate, Link } from "react-router-dom";
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
  FiArrowLeft,
  FiDownload,
} from "react-icons/fi";
import API_BASE_URL from "../../config";
import "./index.css";

const Applications = () => {
  const { id } = useParams();
  const jwtToken = Cookies.get("jwt_token");
  const [applicationsList, setApplicationsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const getApplicationsList = useCallback(async () => {
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
        `${API_BASE_URL}/employer/jobs/posted/${id}`,
        options
      );
      if (response.ok) {
        const applications = await response.json();
        setApplicationsList(Array.isArray(applications) ? applications : []);
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
    } finally {
      setLoading(false);
    }
  }, [jwtToken, id]);

  useEffect(() => {
    getApplicationsList();
  }, [getApplicationsList]);

  const handleViewResume = (application) => {
    setSelectedApplicant(application);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedApplicant(null);
  };

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
      window.open(url, "_blank");
    } finally {
      setDownloading(false);
    }
  };

  if (jwtToken === undefined) {
    return <Navigate to="/employer/login" />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/60 pb-6">
          <div className="flex items-center gap-4">
            <Link
              to="/employer/jobs/posted"
              className="p-2.5 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 text-slate-300 hover:text-white transition"
            >
              <FiArrowLeft className="text-xl" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Job Applicants</h1>
              <p className="text-slate-400 text-sm mt-0.5">
                Review, contact, and download resumes of candidates who applied ({applicationsList.length})
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" />
          </div>
        ) : applicationsList.length > 0 ? (
          <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700/80 bg-slate-900/60 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 px-6">Candidate</th>
                    <th className="py-4 px-6">Contact (Mail / Call)</th>
                    <th className="py-4 px-6 text-right">Resume & Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-sm">
                  {applicationsList.map((application) => {
                    const initials = (application.username || "CD")
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2);

                    return (
                      <tr
                        key={application._id}
                        className="hover:bg-slate-750/50 transition duration-150"
                      >
                        <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-500/20 shrink-0">
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-white">{application.username || "Candidate"}</p>
                            <p className="text-xs text-slate-400">Applicant</p>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col sm:flex-row gap-2">
                            {application.email ? (
                              <a
                                href={`mailto:${application.email}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/20 text-xs font-medium transition"
                                title={`Email ${application.email}`}
                              >
                                <FiMail className="text-sm" /> Email
                              </a>
                            ) : null}
                            {application.contactNumber ? (
                              <a
                                href={`tel:${application.contactNumber}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/20 text-xs font-medium transition"
                                title={`Call ${application.contactNumber}`}
                              >
                                <FiPhone className="text-sm" /> Call
                              </a>
                            ) : null}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-right">
                          {application.resume ? (
                            <button
                              onClick={() => handleViewResume(application)}
                              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition"
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
            <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-2xl flex items-center justify-center text-3xl mx-auto">
              <FiUsers />
            </div>
            <h2 className="text-xl font-bold text-white">No Applications Received Yet</h2>
            <p className="text-slate-400 text-sm">
              No candidates have applied to this job opening yet. Check back soon!
            </p>
          </div>
        )}

        {/* Resume Preview Modal with Open and Download Buttons */}
        {showModal && selectedApplicant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-800/80">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400">
                    <FiFileText className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      Resume - {selectedApplicant.username || "Candidate"}
                    </h3>
                    <p className="text-xs text-slate-400">Job Applicant</p>
                  </div>
                </div>

                {/* Only Open and Download Buttons + Close */}
                <div className="flex items-center gap-3">
                  {selectedApplicant.resume && (
                    <>
                      <a
                        href={selectedApplicant.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-600/25 transition"
                      >
                        <FiExternalLink /> Open
                      </a>

                      <button
                        onClick={() =>
                          handleDownloadResume(
                            selectedApplicant.resume,
                            selectedApplicant.username
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
                {selectedApplicant.resume ? (
                  <img
                    src={selectedApplicant.resume}
                    alt={`${selectedApplicant.username || "Candidate"} Resume`}
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

export default Applications;
