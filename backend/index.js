const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const routes = require("./APIs");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use("/", routes);

const startServer = () => {
  app.listen(8000, () => {
    console.log("server listening on 8000...");
  });
};

startServer();
