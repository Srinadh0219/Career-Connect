import React from "react";
import JobPostingHome from "./JobPostingHome";
import JobPostingSteps from "./JobPostingSteps";
import QuickHire from "./QuickHire";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";

const JobPostingHomePage = () => {
  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken === undefined) {
    return <Navigate to="/employer/login" />;
  }
  return (
    <div>
      <JobPostingHome />
      <JobPostingSteps />
      <QuickHire />
    </div>
  );
};

export default JobPostingHomePage;
