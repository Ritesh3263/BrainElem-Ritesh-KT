const db = require("../models");


exports.getRawQueryForCertificationSession = async (query, userId, aggregateInterests, interestId, moduleId, from = 0, size = 50) => {
  //var user = await db.user.findById(userId);

  //var userGroups = await db.group.find({ trainees: { $elemMatch: { $eq: userId } } }, { "_id": 1 })
  //var aggs = {};


  // Sort
  var sort = ["_score"];
  // Default must query
  var must_query = null;

  var must_not_query = {
    "exists": {
      "field": "origin"
    }
  }

  var filter_query = [// Must be...
    {
      "bool": {
        "should": [ // ...one of the following:
          {"bool": {
            "filter": [// Must meet all conditions for: status, isPublic, not archived 
              { "term": { "status": true } },
              { "term": { "isPublic": true } },
              { "term": { "archived": false } },
            ]
          }
        }
        ]
      }
    },
    {
      "range" : {
        "enrollmentEndDate" : {
            "gte": "now/d", 
            "time_zone": "+01:00"
        }
      }
    },
  ]

  if (moduleId) {
    filter_query[0]['bool']['should'].push({ // ...one of the following:
      "bool": {
        "filter": [// Must meet all conditions for: status, not archived and proper moduleId
          { "term": { "status": true } },
          { "term": { "archived": false } },
          { "term": { "module.keyword": { "value": moduleId } } }
        ]
      }
    })
  }


  if (aggregateInterests === 'true') {
    //Empty

  } else if (interestId) {// If interestId was provided, use this interest id
    must_query = {
      "bool": {
        "should": [{ "term": { "category._id.keyword": { "value": interestId } } }]
      }
    }
    sort = [
      { "enrollmentEndDate" : {"order" : "asc"}},
    ]
  }
  else if (query) {
    must_query = {
      "bool": {
        "should": [ // and at least one of the following
          { "match": { "name": { "query": query, "boost": 10 } } },
          { "match": { "coursePath.name": { "query": query, "boost": 1 } } },
          { "match": { "coursePath.courses.name": { "query": query, "boost": 0.1 } } },
          { "match": { "coursePath.courses.chosenChapters.chapter.name": { "query": query, "boost": 0.01 } } },
          { "match": { "coursePath.courses.chosenChapters.chosenContents.content.title": { "query": query, "boost": 0.001 } } },
        ]
      }
    }
  }else {// If no query, then no conditions

  }

  let rawQuery =
  {
    "from": from, "size": size,
    "sort" : sort,
    //"aggs": aggs,
    "query": {
      "bool":
      {
        "must_not": must_not_query,
        "filter": filter_query,
        "must": must_query
      }
    }
  }
  return rawQuery;

}

exports.getRawQueryForContent = async (query, userId, contentType, aggregateInterests, interestId, from=0, size=50) => {

    var user = await db.user.findOne({_id: userId});
    var userGroups = await db.group.find({ trainees: { $elemMatch: { $eq: userId } } }, { "_id": 1 })
    var aggs = {};
  
    var must_query = null;
    var must_not_query = []
  
    var filter_query = [// Must be...
      {"bool": {
        "should": [{ // ...one of the following:
          "bool": {
            "filter": [// 1. Both sendToLibrary and ACCEPTED,
              { "term": { "sendToLibrary": true } },
              { "term": { "libraryStatus.keyword": 'ACCEPTED' } },
              { "term": { "archivedByLibrarian": false } },
            ]
          }
        },
          { // 2. At least one group is matching.
            "bool": {
              "must": {"terms": { "groups": userGroups }},
              // Uncomment when duplicating and displaying contents will be fixed
              "must_not": [{ "term": { "libraryStatus.keyword": "ACCEPTED"}},{ "term": { "archivedByLibrarian": true } }]
            }
          },
          // 3. Owner of the content
          {
            "bool": {
              "must": {"term": { "owner._id": userId }},
              // Uncomment when duplicating and displaying contents will be fixed
              "must_not": [{ "term": { "libraryStatus.keyword": "ACCEPTED"}},{ "term": { "archivedByLibrarian": true } }]
            }
          },
          {// 4. Is cocreator.
            "bool": {
              "must": {"term": { "cocreators": userId }},
              // Uncomment when duplicating and displaying contents will be fixed
              "must_not": [{ "term": { "libraryStatus.keyword": "ACCEPTED"}},{ "term": { "archivedByLibrarian": true } }]
            }
          }
  
        ]
      }},
      {"bool": {
        "should": [ // ...one of the following:
            { "term": { "language.keyword": user.settings.language } },
            {'bool':
              {"must_not": {
                "exists": {
                  "field": "language"
                }
              }
              }
            }
        ]
      }}
    ]
  
    if (contentType) {// Filter by type of content
      filter_query.push({"bool": {"must": { "term": { "contentType.keyword": contentType  } }}})
    }
  
    // When searching for recommendations aggregate all results
    // by interests/tags in order to display most popular tags in Explore 
    if (aggregateInterests === 'true') {
      aggs = {
        "interests_ids": {
          "terms": { "field": "tags.interest._id" },
          "aggs": {
            "interests_source": {
              "top_hits": { 
                "_source": {
                  "includes": [ "tags" ]
                },
              }
            }
          }
        }
      }
      //Do not recommend content created by the user
      must_not_query.push({ "term": { "owner._id": userId } })
      must_not_query.push({ "term": { "cocreators": userId } })
  
    }
    else if (interestId) {// If interestId was provided, use this interest id
      must_query = {
        "bool": {
          "should": [{ "term": { "tags.interest._id": { "value": interestId } } }]
        }
      }
    }
    else if (query) {
      must_query = {
        "bool": {
          "should": [ // and at least one of the following
            { "match": { "title": { "query": query, "boost": 10 } } },
            { "match": { "description": { "query": query, "boost": 1 } } },
            { "match": { "capsule": { "query": query, "boost": 0.1 } } },
            { "match": { "chapter.name": { "query": query, "boost": 0.1 } } },
            { "match": { "trainingModule.name": { "query": query, "boost": 0.1 } } },
            { "match": { "tags.name": { "query": query, "boost": 0.1 } } },
            { "match": { "tags.interest.name": { "query": query, "boost": 0.01 } } },
            { "match": { "pages.elements.title": { "query": query, "boost": 0.1 } } },
            { "match": { "pages.elements.file.fileTextExtracted": { "query": query, "boost": 0.01 } } },
            { "match": { "owner.name": { "query": query, "boost": 0.01 } } },
            { "match": { "owner.surname": { "query": query, "boost": 0.01 } } },
          ]
        }
      }
      if (interestId) {// If interestId was provided, treat content with this interest id as important 
        must_query['bool']['should'].push({ "term": { "tags.interest._id": { "value": interestId, "boost": 100 } } })
      }
    }else {// If no query, then no conditions

    }
  
    if (user.isTrainee()) {
      must_not_query.push({ "term": { "hideFromTrainees": true } })
    }
    
    let rawQuery =
    {
      "from": from, "size": size,
      "aggs": aggs,
      "query": {
        "bool":
        {
          "must_not": must_not_query,
          "filter": filter_query,
          "must": must_query
        }
      }
    }
  
  



    return rawQuery;
}