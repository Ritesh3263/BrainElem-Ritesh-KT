const mongoose = require("mongoose");
const db = require("../models");
const contentAuthUtils = require("../utils/contentAuth");
const OrientationTestImage = require("../models/orientation_test_image.model");

exports.downloadImage = (req, res) => { // Action for downloading image
  if (req.params.imageId){
    OrientationTestImage.findById(req.params.imageId, (error, image) => {
      if (error) res.status(500).send({ message: error });
      else if (!image) res.status(404).send({ message: "Image not found." });
      else{
        res.sendFile(`/app/public/orientation_test/images/${image.fileName}`);
      }
    })
  }
  else res.status(404).send({ message: "Image not found." });
}