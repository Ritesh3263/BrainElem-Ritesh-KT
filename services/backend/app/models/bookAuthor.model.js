// Model for storing books authors
const mongoose = require("mongoose");

// Creating Schema
const bookAuthorSchema = new mongoose.Schema({
    name: { type: String, required: [true, "BookAuthor must have a name"] },
    lastname: { type: String, required: [true, "BookAuthor must have a lastname"], }
}, { timestamps: true });

// Creating a Model from that Schema
const BookAuthor = mongoose.model("BookAuthor", bookAuthorSchema);

// Exporting the Model
module.exports = BookAuthor;
