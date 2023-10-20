var axios = require('axios');
var { populateContentFiles } = require('../utils/content')


exports.detectCapsules = async (req, res) => { // Action for detecting capsule for content
    let content = req.body.content;
    content = await populateContentFiles(content);
    let response = await axios.post(`${process.env.ELIA_ALGORITHMS_URL}/capsules/detect`, { "content": { "content": content }, "parent_chapter": {...req.body.parentChapter } })
    res.status(200).json(response.data);
};

exports.detectChapters = async (req, res) => { // Action for detecting chapters for content
    let content = req.body.content;
    content = await populateContentFiles(content);
    let response = await axios.post(`${process.env.ELIA_ALGORITHMS_URL}/chapters/detect`, { "content": { "content": content }, "parent_training_module": {...req.body.parentTrainingModule } })
    res.status(200).json(response.data);
};

exports.detectTrainingModules = async (req, res) => { // Action for detecting trainingModule for content
    let content = req.body.content;
    content = await populateContentFiles(content);
    let response = await axios.post(`${process.env.ELIA_ALGORITHMS_URL}/training-modules/detect`, { "content": { "content": content }, "training_modules": { "training_modules": req.body.trainingModulesList } })
    response.data['trainingModules'] = response.data['training_modules']
    delete response.data['training_modules']
    res.status(200).json(response.data);
};

exports.detectLevels = async (req, res) => { // Action for detecting level for content
    let content = req.body.content;
    content = await populateContentFiles(content);
    let response = await axios.post(`${process.env.ELIA_ALGORITHMS_URL}/levels/detect`, { "content": content })
    response.data.levels.forEach(l => {
        l._id = l.name
    })
    res.status(200).json(response.data);
};

// Suggest capsules found in books/materials, based on chapter
exports.suggestCapsules = async (req, res) => {
    let response = await axios.post(`${process.env.ELIA_ALGORITHMS_URL}/capsules/suggest`, req.body)
    let capsules = [];
    var regex = /.*/g
    regex = /3/g

    response.data.capsules.forEach(capsule => {
        if (Object.values(capsule['Book Names']).some(bookName => regex.test(bookName)))
            capsules.push({ name: capsule['Name'], level: req.body.level, type: "capsule" })
    })
    res.status(200).json(capsules);
};


// Suggest chapters found in books/materials, based on training-module name
exports.suggestChapters = async (req, res) => {
    let response = await axios.post(`${process.env.ELIA_ALGORITHMS_URL}/chapters/suggest`, req.body)
    let chapters = [];

    var regex = /3/g

    response.data.chapters.forEach(chapter => {
        if (Object.values(chapter['Book Names']).some(bookName => regex.test(bookName)))
            chapters.push({ name: chapter['Name'], type: "chapter" })
    })
    res.status(200).json(chapters);
}
