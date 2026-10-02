const buffer = require("buffer");
if (!buffer.SlowBuffer) {
  buffer.SlowBuffer = buffer.Buffer;
}

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

const PORT = process.env.PORT || 8000;

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`server listening on ${PORT}...`);
  });
};

startServer();

