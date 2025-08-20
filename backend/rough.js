const mysql = require("mysql");
const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
app.use(express.json());

const cors = require("cors");
app.use(cors());

// Create a connection to the database
const connection = mysql.createConnection({
  host: "localhost", // Change to your MySQL host if different
  user: "root", // MySQL username
  password: "", // MySQL password (if no password, leave it empty)
  database: "jobbyapp", // Name of your MySQL database
});

//Connecting Server to Localhost: 3000
const startServer = () => {
  app.listen(3000, () => {
    console.log("Server Running on Port No: 3000...");
  });
};

startServer();

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    return;
  }
  console.log("Connected to the database");
});

// REGISTER API
app.post("/register", async (request, response) => {
  const { username, password } = request.body;

  // Checking for username already exists or not
  connection.query(
    `SELECT * FROM user_details where username=? AND password=?`,
    [username, password],
    (err, results) => {
      if (err) {
        response.status(500).send("Error");
        return;
      } else {
        if (results.length >= 1) {
          response.status(400).send("User ALready Exists");
          return;
        } else {
          // Perform the query
          connection.query(
            `INSERT INTO user_details values(?,?)`,
            [username, password],
            (err, results) => {
              if (err) {
                console.log("err");
                response.status(500).send("Error");
                return;
              } else {
                response.status(200).send("Registration SucessFull");
              }
            }
          );
        }
      }
    }
  );
});

//LOGIN - API
app.post("/login", async (request, response) => {
  const { username, password } = request.body;

  // Perform the query
  connection.query(
    `SELECT * FROM user_details WHERE username = ? AND password = ?`,
    [username, password],
    (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        response.status(500).send("Internal Server Error");
        return;
      }

      // Check if any rows were returned from the query are 0
      if (results.length === 0) {
        response.status(400).send("Login Failure");
      } else {
        const payload = {
          username: username,
        };
        const jwtToken = jwt.sign(payload, "Nithin");
        console.log(jwtToken);
        response.status(201).send({ jwtToken });
      }
    }
  );
});

// Job Details - API
app.get("/jobs-list", async (request, response) => {
  const authHeader = request.headers["authorization"];
  let jwtToken;
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    response.status(401).send("invalid Access Token");
  } else {
    jwt.verify(jwtToken, "Nithin", async (error, payload) => {
      if (error) {
        response.send("Invalid Access Token");
      } else {
        connection.query(`SELECT * FROM job_listings`, (err, results) => {
          if (err) {
            response.status(500).send("Error");
            return;
          }
          response.status(200).send(results);
        });
      }
    });
  }
});

// Close the connection when done
connection.end((err) => {
  if (err) {
    console.error("Error closing database connection:", err);
    return;
  }
  console.log("Connection closed");
});
