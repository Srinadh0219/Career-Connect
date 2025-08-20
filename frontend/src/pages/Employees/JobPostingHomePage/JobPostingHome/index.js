import React from "react";
import "./style.css";
import candidateImage from "./Image.png";
import { useNavigate } from "react-router-dom";

const JobPostingHome = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="text-container">
        <h1>
          Let's hire your next great candidate.{" "}
          <span className="highlight">Fast.</span>
        </h1>
        <button
          className="post-job-button"
          onClick={() => {
            navigate("/employer/jobs/posting/post");
          }}
        >
          Post a free job*
        </button>
        <p className="terms">
          *Terms, conditions, quality standards and usage limits apply.
        </p>
      </div>
      <div className="image-container">
        <img src={candidateImage} alt="Hiring" className="image" />
      </div>
    </div>
  );
};

export default JobPostingHome;
