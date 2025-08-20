import Cookies from "js-cookie";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { Spin } from "antd";
import "./index.css";

const EmployerProfile = () => {
  const jwtToken = Cookies.get("jwt_token");
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  const getUserData = useCallback(async () => {
    const options = {
      method: "GET",
      headers: {
        authorization: `Bearer ${jwtToken}`,
      },
    };
    const response = await fetch(
      "https://careerconnect-apis.vercel.app/profile/student",
      options
    );
    if (response.ok) {
      const data = await response.json();
      setProfile(data);
      setSelectedOptions(data.skills || []);
      setLoading(false);
    }
  }, [jwtToken]);

  useEffect(() => {
    getUserData();
  }, [getUserData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minHeight: "40px",
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#e7f3ff",
    }),
    multiValueLabel: (provided) => ({
      ...provided,
      color: "#007bff",
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      color: "#007bff",
      ":hover": {
        backgroundColor: "#007bff",
        color: "white",
      },
    }),
  };

  const animatedComponents = makeAnimated();

  const options = [
    "C Programming",
    "C++",
    "Java",
    "Python",
    "JavaScript",
    "Ruby",
  ].map((skill) => ({
    value: skill,
    label: skill,
  }));

  const handleSave = async () => {
    setLoading(true);
    try {
      let resumeUrl = profile.resume;
      if (resume) {
        const formData = new FormData();
        formData.append("file", resume);
        formData.append("upload_preset", "image_preset");
        formData.append("cloud_name", "dqztnamkx"); // Replace with your Cloudinary upload preset
        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dqztnamkx/upload",
          formData
        ); // Replace with your Cloudinary URL
        resumeUrl = response.data.secure_url;
      }
      const updatedProfile = {
        ...profile,
        skills: selectedOptions,
        resume: resumeUrl,
      };
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${jwtToken}`,
        },
        body: JSON.stringify(updatedProfile),
      };
      const response = await fetch(
        "https://careerconnect-apis.vercel.app/profile/student",
        options
      );
      if (response.status === 200) {
        setProfile(updatedProfile);
        setIsEditing(false);
      } else if (response.status === 401) {
        alert("Invalid contact information");
      } else {
        alert("Failed to update profile");
      }
    } catch (err) {
      alert("Error updating profile:", err);
    }
    setLoading(false);
  };

  const handleChange = (selected) => {
    setSelectedOptions(selected.map((option) => option.value));
  };

  if (jwtToken === undefined) {
    return <Navigate to="/student/login" />;
  }

  return (
    <div className="profile-page-bg-container">
      {loading ? (
        <Spin />
      ) : (
        <div className="profile-page-container">
          <div className="user-profile">
            <div className="info-section">
              <h2>Candidate Profile</h2>
              <div>
                <strong>Username:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name="username"
                    value={profile.username || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  profile.username
                )}
              </div>
              <div>
                <strong>Contact:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name="contactNumber"
                    value={profile.contactNumber || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  profile.contactNumber
                )}
              </div>
              <div>
                <strong>Email:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name="email"
                    value={profile.email || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  profile.email
                )}
              </div>
              <div>
                <strong>Address:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={profile.address || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  profile.address
                )}
              </div>
              <div>
                <strong>Education:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name="education"
                    value={profile.education || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  profile.education
                )}
              </div>
              <div>
                <strong>Experience:</strong>{" "}
                {isEditing ? (
                  <input
                    type="text"
                    name="experience"
                    value={profile.experience || ""}
                    onChange={handleInputChange}
                  />
                ) : (
                  profile.experience
                )}
              </div>
              <div>
                <strong>Skills:</strong>
                {!isEditing ? (
                  <ul className="list">
                    {selectedOptions.map((skill) => (
                      <li key={skill} className="mx-2">
                        {skill}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div>
                    <Select
                      components={animatedComponents}
                      isMulti
                      options={options}
                      value={options.filter((option) =>
                        selectedOptions.includes(option.value)
                      )}
                      onChange={handleChange}
                      styles={customStyles}
                      placeholder="Select skills..."
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="resume-section">
              <div>
                <strong>Resume:</strong>{" "}
                {isEditing ? (
                  <input
                    type="file"
                    name="resume"
                    onChange={(e) => {
                      setResume(e.target.files[0]);
                    }}
                  />
                ) : (
                  profile.resume && (
                    <div>
                      <a
                        href={profile.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary mb-2 mt-2"
                      >
                        Download Resume
                      </a>
                      <img
                        src={profile.resume}
                        alt="Resume preview"
                        className="resume-preview"
                        onError={(e) => {
                          e.target.style.display = "none";
                          alert("Failed to load the resume preview image.");
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
          {!isEditing && (
            <button onClick={toggleEditing} className="mt-2">
              Edit
            </button>
          )}
          {isEditing && (
            <button onClick={handleSave} className="save" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EmployerProfile;
