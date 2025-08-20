const express = require("express");
const router = express.Router();
const { AvgSalaries } = require("./startMongoose");

router.get("/", async (req, res) => {
  const data = await AvgSalaries.find();
  res.status(200).send(data);
});

module.exports = router;
