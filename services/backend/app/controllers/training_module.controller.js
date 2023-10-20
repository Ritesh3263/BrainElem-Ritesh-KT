const TrainingModule = require("../models/training_module.model");

exports.read = async (req, res) => { // Get single trainingModule by id
 let trainingModule = await TrainingModule.findById(req.params.trainingModuleId)
   .populate({path: "chapters", 
              populate: { 
                path: "capsules", 
                populate: { 
                  path: "learningPaths",
                  populate: {
                    path: "seeds"
                  }
                } 
              }
   })
  if (!trainingModule) res.status(404).send({ message: "Not found" });
  else res.status(200).json(trainingModule);
};

exports.readAll = async (req, res) => { // Get list with all trainingModules' ids 
  let trainingModules = await TrainingModule.find({origin: {$exists: false}}, '_id')
  res.status(200).json(trainingModules);
};

exports.readBooks = async (req, res) => { // Get all books associated with trainingModule
  let trainingModule = await TrainingModule.findById(req.params.trainingModuleId)
    .populate({
      path: "books"
    })
    .populate({
      path: "origin",
      populate: {
        path: "books",
      }
    })
  if (!trainingModule) res.status(404).send({ message: "Not found" });
  else if (trainingModule.origin) res.status(200).json(trainingModule.origin.books);
  else res.status(200).json(trainingModule.books);
};

exports.search = async (req, res) => { // Search for a trainingModule within ElasticSearch
  let rawQuery = 
  {
    "from" : 0, "size" : 100,
    "query": {"bool": 
                {"should": [
                   { "match": { "name":  {"query": req.query.query,"boost": 10}}},
                   { "match": { "description": {"query": req.query.query,"boost": 1}}},
                   { "match": { "chapters.name": {"query": req.query.query,"boost": 1}}},
                   { "match": { "chapters.description": {"query": req.query.query,"boost": 0.1}}},
                   { "match": { "chapters.contents.name": {"query": req.query.query,"boost": 1}}},
 //                  { "match": { "chapters.capsules.description": {"query": req.query.query,"boost": 0.1}}},
 //                  { "match": { "chapters.capsules.learningPaths.name": {"query": req.query.query,"boost": 1}}},
 //                  { "match": { "chapters.capsules.learningPaths.description": {"query": req.query.query,"boost": 0.1}}},
 //                  { "match": { "chapters.capsules.learningPaths.seeds.name": {"query": req.query.query,"boost": 0.1}}}
                ]}
     }
  }
  TrainingModule.esSearch(rawQuery, function(err, results) {
    if (err) res.status(500).send({ message: err });
    else res.status(200).json(results);
  });
};