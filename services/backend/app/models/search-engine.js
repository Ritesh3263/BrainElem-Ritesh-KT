const elasticsearch = require('elasticsearch');
const axios = require('axios')


exports.searchengine = new elasticsearch.Client({ host: `${process.env.SEARCH_ENGINE_HOST}:${process.env.SEARCH_ENGINE_PORT}` });


const mapping = {
    "settings": {
        "analysis": {
            "filter": {
                "autocomplete_filter": {
                    "type": "edge_ngram",
                        "min_gram": "4",
                            "max_gram": "20"
                },
                "word_joiner": {
                    "type": "word_delimiter",
                        "catenate_all": true
                },
                "english_stop": {
                    "type": "stop",
                        "stopwords": "_english_"
                },
                "english_stemmer": {
                    "type": "stemmer",
                        "language": "english"
                },
                "english_possessive_stemmer": {
                    "type": "stemmer",
                        "language": "possessive_english"
                },
                "french_elision": {
                    "type": "elision",
                        "articles_case": true,
                            "articles": [
                                "l", "m", "t", "qu", "n", "s",
                                "j", "d", "c", "jusqu", "quoiqu",
                                "lorsqu", "puisqu"
                            ]
                },
                "french_stop": {
                    "type": "stop",
                        "stopwords": "_french_"
                },
                "french_stemmer": {
                    "type": "stemmer",
                        "language": "light_french"
                },
                "company_stop": {
                    "type": "stop",
                        "stopwords": ["sarl", "societ", "SA"]
                }
            },
            "analyzer": {
                "default": {
                    "tokenizer": "standard",
                        "filter": [
                            "asciifolding",
                            "lowercase",
                            "english_stemmer",
                            "english_possessive_stemmer",

                            "french_elision",
                            "french_stemmer",
                        ]
                },
                "autocomplete": {
                    "type": "custom",
                        "tokenizer": "standard",
                            "filter": [
                                "asciifolding",
                                "lowercase",
                                "english_stemmer",
                                "english_possessive_stemmer",
                                "french_elision",
                                "french_stemmer",
                                "word_joiner",
                                "autocomplete_filter",
                            ]
                }
            }
        }
    }
}

exports.removeIndex = async (name) => {
    // Fully remove the indexes to prevent the issue with incorrect indexing
    // StatusCodeError: [illegal_argument_exception] analyzer [autocomplete] has not been configured in mappings 
    try {
        await axios.delete(`http://${process.env.SEARCH_ENGINE_HOST}:${process.env.SEARCH_ENGINE_PORT}/${name}`);
        console.log("###ELASTICSEARCH### Removed indexes for", name)  
    }
    catch (e) {console.error("###ELASTICSEARCH### Error when removing index for "+name, e.toJSON()?.msg)}
}

exports.createMapping = (model, name) => {
    return new Promise(resolve => {
        model.createMapping(mapping, async (err, mapping) => {
                if (err){
                    console.error("###ELASTICSEARCH### Error when creating mapping for", name, err?.toJSON()?.msg)
                    await exports.removeIndex(name)
                    setTimeout(()=>{
                        console.log('###ELASTICSEARCH### Retry to create mappings for ', name)
                        this.createMapping(model, name)
                    }, 10000)
                    
                    //throw(err)
                } else {
                    resolve(mapping)
                    console.log("###ELASTICSEARCH### Mapping created successfully for " + name)
                    synchronizeSearchengineWithDatabase(model, name);
                }
            })
    });
}

function synchronizeSearchengineWithDatabase(model, name) {
        var count = 0;
        let dataStream = model.synchronize()
        dataStream.on('data', function (err, doc) { count++; });
        dataStream.on('close', function () { console.log('###ELASTICSEARCH### Indexed ' + count +" " + name +' documents.'); });
        dataStream.on('error', function (err) { console.error(err); });
  }