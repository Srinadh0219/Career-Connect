# 🚀 Career-Connect — Modern Job Portal & Hiring Platform


[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-Backend-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

A full-stack **MERN** job portal web application connecting ambitious candidates with top employers. Features rich candidate profiles, dynamic skill tagging, direct resume uploads with preview & download modal actions, instant one-click recruiter contact (Email & Call), comprehensive job search filters, company reviews, and an interactive salary guide.

---

---

## ✨ Key Features

### 👨‍🎓 For Candidates / Job Seekers
- **Modern Dashboard:** Comprehensive 2-column profile layout with personal bio, key skills tags, and live resume management.
- **Dynamic Skills Management:** Add and manage skills with individual badge removal.
- **Resume Upload & Preview:** Fast resume file upload with real-time status and preview.
- **Job Discovery & Search:** Search jobs with query filters (Title, Location, Experience, Salary) and view detailed job specifications.
- **Application Tracking:** Apply to listings in one click and track application statuses (`Submitted`, `Reviewed`, `Shortlisted`, `Rejected`).
- **Company Reviews & Ratings:** Read authentic employee feedback and submit verified reviews.
- **Salary Guide:** Explore salary benchmarks across various domains and experience levels.

### 🏢 For Employers / Recruiters
- **Job Posting & Management:** Create, publish, edit, and delete job postings.
- **Candidate Pool Directory ("View Candidates"):** Browse all registered candidates with full skill tags and quick recruiter actions.
- **Resume Modal (Open & Download):** Inspect applicant resumes directly in-browser or download them locally with one click.
- **Instant Candidate Outreach:** Contact candidates directly via phone (`tel:`) or email (`mailto:`) straight from the recruiter table.
- **Applicant Review Pipeline:** Review applications per job post with real-time status updates.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (Hooks, Context API), React Router DOM, Lucide Icons, Modern CSS3 & Glassmorphism |
| **Backend** | Node.js, Express.js, RESTful APIs |
| **Database** | MongoDB Atlas / Mongoose |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs |
| **Deployment** | Vercel (Frontend), Render / Railway (Backend) |

---

## 📂 Project Structure

```text
Career-Connect/
├── backend/
│   ├── APIs/
│   │   ├── companyReviews.js     # Company reviews and ratings endpoints
│   │   ├── jobs.js               # Job creation, fetching, application endpoints
│   │   ├── mongoDBConnection.js  # MongoDB database connection
│   │   ├── profile.js            # User profile and resume handling
│   │   └── verifyProfile.js      # Auth verification & tokens
│   ├── index.js                  # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── public/                   # Static assets & index.html
│   ├── src/
│   │   ├── components/           # Reusable UI components (JobItem, Modals, etc.)
│   │   ├── layouts/              # Header, Footer, and Navigation
│   │   ├── pages/
│   │   │   ├── Employees/        # Recruiter pages (AddJobs, JobsPosted, ViewStudents)
│   │   │   ├── Students/         # Candidate pages (Profile, SalaryGuide, Reviews)
│   │   │   └── Home/             # Landing page with hero & search
│   │   ├── config.js             # Dynamic API URL configuration
│   │   ├── App.js                # Root router & layout wrapper
│   │   └── index.js
│   └── package.json
│
├── .gitignore
└── README.md
