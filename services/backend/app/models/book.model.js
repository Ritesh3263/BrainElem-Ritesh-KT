// Model for storing books
const mongoose = require("mongoose");

// Creating Schema
const bookSchema = new mongoose.Schema({

    name: { type: String, required: [true, "Book must have a name"] },
    ISBN: String,// code
    year: {type: Number, default: 1999},
    status: {type: Boolean, default: false},

    level: {type: String, enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"]},
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'CategoryRef', default: undefined},

    authors: [{ type: mongoose.Schema.Types.ObjectId, ref: "BookAuthor" }],
    publishers: [{ type: mongoose.Schema.Types.ObjectId, ref: "BookAuthor" }],
}, { timestamps: true });

// Creating a Model from that Schema
const Book = mongoose.model("Book", bookSchema);

// Exporting the Model
module.exports = Book;
