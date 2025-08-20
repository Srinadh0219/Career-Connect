import { Navigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Spin } from "antd";
import "./index.css";

const ViewStudents = () => {
  const jwtToken = Cookies.get("jwt_token");
  const [studentsList, setStudentsList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedResume, setSelectedResume] = useState("");
  const [loading, setLoading] = useState(true);

  const getStudentsList = useCallback(async () => {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(
      `https://careerconnect-apis.vercel.app/employer/view-students`,
      options
    );
    const data = await response.json();
    setStudentsList(data);
    setLoading(false);
  }, [jwtToken]);

  useEffect(() => {
    getStudentsList();
  }, [getStudentsList]);

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
      <h1>Students List</h1>
      {loading ? (
        <Spin />
      ) : studentsList.length > 0 ? (
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
            {studentsList.map((student) => (
              <tr key={student._id}>
                <td>{student.username}</td>
                <td>{student.email}</td>
                <td>{student.contactNumber}</td>
                <td>
                  <button
                    className="view-resume-button"
                    onClick={() => handleViewResume(student.resume)}
                  >
                    View Resume
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <h3>No students found</h3>
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

export default ViewStudents;
