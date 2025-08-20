const express = require("express");
const router = express.Router();
const { CompanyReviews } = require("./startMongoose");

//Get Companies Reviews API
router.get("/", async (req, res) => {
  const data = await CompanyReviews.find();
  res.status(200).send(data);
});

//POST Company with rating
router.post("/", async (req, res) => {
  const { companyName, rating } = req.body;
  const company = await CompanyReviews.findOne({ companyName: companyName });
  if (company === null) {
    const newCompany = new CompanyReviews({
      companyName,
      reviewScore: rating,
      reviewsCount: 1,
    });
    await newCompany.save();
  } else {
    await CompanyReviews.updateOne(
      { companyName: companyName },
      {
        $set: {
          reviewScore: company.reviewScore + rating,
          reviewsCount: company.reviewsCount + 1,
        },
      }
    );
  }
});

module.exports = router;
