import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";
import "./index.css";

const SalaryGuide = () => {
  const jwtToken = Cookies.get("jwt_token");
  const [data, setData] = useState([]);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const options = {
      method: "GET",
    };
    const response = await fetch(
      "https://careerconnect-apis.vercel.app/salary-guide",
      options
    );
    if (response.ok) {
      const data = await response.json();
      setData(data);
    }
  };

  if (jwtToken === undefined) {
    return <Navigate to="/student/login" />;
  }

  const filteredData = data.filter((item) =>
    item.jobRole.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <>
      <div className="salary-page-top-container bg-blue-950 text-white p-5">
        <h3 className="font-bold">Find a Career You'll Love</h3>
        <p>
          Explore which careers have the highest job satisfaction, best salaries
          and more
        </p>
        <div className="salary-guide-search-container shadow-md">
          <input
            type="search"
            placeholder="Search by Job Roles"
            className="border-1 border-gray-400 p-2 text-black"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button className="btn btn-primary mb-3 ml-2">Find Jobs</button>
        </div>
      </div>
      <div className="salary-page-bottom-container">
        <h4 className="font-bold text-center">
          Browse Top Paying Companies by Industry
        </h4>
        <div className="salaries-list-container">
          {filteredData.map((item) => (
            <div className="salary-item">
              <h4 className="text-lg font-bold">{item.jobRole}</h4>
              <p className="font-bold text-blue-800 text-md">
                Avg Salary Rs.{item.salary} {"  "} per year
              </p>
              <p className="font-underline">job openings</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default SalaryGuide;
