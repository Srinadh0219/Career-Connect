import { useParams, Navigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Spin } from "antd";
import "./index.css";

const Applications = () => {
  const { id } = useParams();
  const jwtToken = Cookies.get("jwt_token");
  const [applicationsList, setApplicationsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState("");
  const [loading, setLoading] = useState(true);

  const getApplicationsList = useCallback(async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(
      `https://careerconnect-apis.vercel.app/employer/jobs/posted/${id}`,
      options
    );
    const applications = await response.json();
    setApplicationsList(applications);
    setLoading(false);
  }, [jwtToken, id]);

  useEffect(() => {
    getApplicationsList();
  }, [getApplicationsList]);

  const handleViewResume = (resume) => {
    setSelectedResume(resume);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedResume("");
  };

  if (jwtToken === undefined) {
    return <Navigate to="/employer/login" />;
  }

  return (
    <div className="applications-bg-container">
      <h1>Applications</h1>
      {loading ? (
        <Spin />
      ) : (
        <table className="applications-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Resume</th>
            </tr>
          </thead>
          <tbody>
            {applicationsList.map((application) => (
              <tr key={application._id}>
                <td>{application.username}</td>
                <td>{application.email}</td>
                <td>{application.contactNumber}</td>
                <td>
                  <button
                    className="view-resume-button"
                    onClick={() => handleViewResume(application.resume)}
                  >
                    View Resume
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>
              &times;
            </span>
            <img src={selectedResume} alt="Resume" className="resume-image" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Applications;
