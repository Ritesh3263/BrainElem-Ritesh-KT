const Book = require("../models/book.model");
const BookAuthor = require("../models/bookAuthor.model");

exports.add = async (req, res) => {
    const sourceMaterial = await new Book(req.body);
    try{
        await sourceMaterial.save()
        res.status(200).json({message: "Created successfully", authorId: sourceMaterial._id});
    }catch(err){
        res.status(401).send({errors: err.errors});
    }
};

exports.read = async (req, res) => {
    let sourceMaterial = await Book.findById(req.params.sourceMaterialId)
        .populate([
            {path: 'authors', select: 'name lastname'},
            {path: 'publishers', select: 'name lastname'},
        ])
    res.status(200).json(sourceMaterial);
};

exports.readAll = async (req, res) => {
    let sourceMaterials = await Book.find({})
        .populate([
            {path: 'category', select: 'name'},
            {path: 'authors', select: 'name lastname'},
            {path: 'publishers', select: 'name lastname'},
        ])
    res.status(200).json(sourceMaterials);
};

exports.update = async (req, res) => {
    res.status(200).json({ message: "Updated successfully" });
    try{
        await Book.findOneAndUpdate(
            { _id: req.params.sourceMaterialId },
            { $set: {...req.body} },
            { runValidators: true })
    }catch(err){
    res.status(401).send({errors: err.errors});
}
};

exports.remove = async (req, res) => {
    await Book.findByIdAndDelete(req.params.sourceMaterialId)
    res.status(200).json({ message: "Deleted successfully" });
};


//=> bookAuthor
exports.addBookAuthor = async (req, res) => {
    const author = await new BookAuthor(req.body);

    try{
        await author.save()
        res.status(200).json({message: "Created successfully", authorId: author._id});
    }catch(err){
        res.status(401).send({errors: err.errors});
    }

};

exports.readBookAuthor = async (req, res) => {
    let author = await BookAuthor.findById(req.params.authorId)
    res.status(200).json(author);
};

exports.readAllBookAuthors = async (req, res) => {
    let authors = await BookAuthor.find({})
    res.status(200).json(authors);
};

exports.updateBookAuthor = async (req, res) => {
    try{
        await BookAuthor.findOneAndUpdate(
            { _id: req.params.authorId },
            { $set: req.body },
            { runValidators: true })
        res.status(200).json({ message: "Updated successfully" });
    }catch(err){
        res.status(401).send({errors: err.errors});
    }

};

exports.deleteBookAuthor = async (req, res) => {
    await BookAuthor.findByIdAndDelete(req.params.authorId)
    res.status(200).json({ message: "Deleted successfully" });
};