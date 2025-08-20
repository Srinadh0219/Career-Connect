import "bootstrap/dist/css/bootstrap.css";
import { useLocation, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
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
    }
    if (location.pathname.includes("/student"))
      navigate(`/student/jobs/${_id}`);
  };

  function daysAgo(dateString) {
    const today = new Date();
    const jobDate = new Date(dateString);
    const diffTime = Math.abs(today - jobDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }
    const options = { year: "numeric", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  }

  return (
    <div
      className="job-item p-4 m-3 shadow-sm shadow-gray-400"
      onClick={handleShowJobDetails}
    >
      <div className="space-y-1">
        <div className="flex justify-between">
          <strong>{jobRole} </strong>
          <p>{daysAgo(jobPostingDate)} days ago</p>
        </div>
        <div>
          <strong> {companyName} </strong>
        </div>
        <p> {jobLocation}</p>
        <div className="flex">
          <p className="bg-gray-300 px-2 py-1 rounded-sm mx-2">{stipend}</p>
          <p className="bg-gray-300 px-2 py-1 rounded-sm mx-2">{mode}</p>
          <p className="bg-gray-300 px-2 py-1 rounded-sm">{jobType}</p>
        </div>
        <p>Duration: {jobDuration}</p>
        <p> Working Hours: {workHours}</p>
        <p>
          <strong>Deadline: </strong> {formatDate(applicationDeadline)}
        </p>
      </div>
    </div>
  );
};

export default JobItem;
