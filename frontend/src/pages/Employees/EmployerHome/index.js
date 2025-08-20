import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import JobItem from "../../../components/JobItem";
import { Spin } from "antd";
import "./index.css";

const EmployerHome = () => {
  const [jobsList, setJobsList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getJobsList();
  }, []);

  const getJobsList = async () => {
    const apiUrl = `https://careerconnect-apis.vercel.app/jobs`;
    const jwtToken = Cookies.get("jwt_token");
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    const response = await fetch(apiUrl, options);
    if (response.ok) {
      const fetchedData = await response.json();
      console.log(fetchedData);
      setJobsList(fetchedData);
      setLoading(false);
    }
  };
  const jwtToken = Cookies.get("jwt_token");
  if (jwtToken === undefined) {
    return <Navigate to="/employer/login" />;
  }

  return (
    <div className="home-page-bg-container">
      <div className="home-page-main-container">
        <div className="home-search-container shadow-md shadow-gray-300">
          <input
            type="search"
            placeholder="Search by Company, Job Roles and Location"
            className="border-r p-2"
          />
          <button className="btn btn-primary">Find Jobs</button>
        </div>
        <a
          className="text-blue-800 font-bold self-center my-[10px]"
          href="/employer/jobs/posting/post"
        >
          Post a Job on Jobby
        </a>
        <hr className="self-center w-75" />
        <h1 className="self-center">Jobs</h1>
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <div className="jobs-list-container">
            {jobsList.map((item) => (
              <JobItem item={item} key={item._id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default EmployerHome;
