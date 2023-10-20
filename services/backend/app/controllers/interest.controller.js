const Interest = require('../models/interest.model')

exports.getAllInterests = async (req, res) => {
  let interests = await Interest.find({})
    .populate({ path: "subinterests" })
  res.status(200).json(interests);
};