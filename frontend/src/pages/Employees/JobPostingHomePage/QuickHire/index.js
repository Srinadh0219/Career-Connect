import React from "react";
import Visibility from "./visibility.svg";
import Quality from "./quality.svg";
import Organise from "./organise.svg";
import Verify from "./verify.svg";
import "./style.css";

const QuickHire = () => {
  return (
    <div className="recruitment-journey-container">
      <h1>Save time and effort in your recruitment journey.</h1>
      <p>
        Finding the best fit for the job shouldn’t be a full-time job. Indeed’s
        simple and powerful tools let you source, screen and hire faster.
      </p>
      <div className="features">
        <div className="feature">
          <img src={Visibility} alt="Visibility" className="logo" />
          <h2>Get more visibility</h2>
          <p>Sponsor your job to ensure it gets seen by the right people.</p>
        </div>
        <div className="feature">
          <img src={Quality} alt="Visibility" className="logo" />
          <h2>Find quality applicants</h2>
          <p>
            List your required skills for the job so relevant candidates apply.
          </p>
        </div>
        <div className="feature">
          <img src={Verify} alt="Visibility" className="logo" />
          <h2>Verify their abilities</h2>
          <p>
            Add screener questions and assessments to test applicants’ skills.
          </p>
        </div>
        <div className="feature">
          <img src={Organise} alt="Visibility" className="logo" />
          <h2>Organise your candidates</h2>
          <p>
            View and sort CVs, send messages and schedule interviews – all on
            Indeed.
          </p>
        </div>
      </div>
      <div className="cta">
        <h1>Get started in minutes!</h1>
        <button>Start Posting</button>
      </div>
    </div>
  );
};

export default QuickHire;
