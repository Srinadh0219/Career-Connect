import React from "react";
import "./style.css";

const JobPostingSteps = () => {
  return (
    <div className="job-steps-container">
      <div className="step">
        <h2>1</h2>
        <h3>Create your free account</h3>
        <p>
          All you need is your email address to create an account and start
          building your job post.
        </p>
      </div>
      <div className="step">
        <h2>2</h2>
        <h3>Build your job post</h3>
        <p>
          Then just add a title, description and location to your job post, and
          you're ready to go.
        </p>
      </div>
      <div className="step">
        <h2>3</h2>
        <h3>Post your job</h3>
        <p>
          After you post your job, use our state-of-the-art tools to help you
          find dream talent.
        </p>
      </div>
    </div>
  );
};

export default JobPostingSteps;
