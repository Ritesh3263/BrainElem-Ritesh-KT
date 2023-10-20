# Transform simple key:value JSON with translations
# into object matching schema in database

import json
import copy

def get_empty_value(array=False): return [] if array else ''
def get_lang_schema(array=False): return {'PL': get_empty_value(array), 'EN': get_empty_value(array), 'FR': get_empty_value(array)}
def get_gender_schema(array=False): return {'masculine':  get_lang_schema(array),'female':  get_lang_schema(array)}

schema = {
    'key': '',
    'name': get_lang_schema(),
    'attributes': get_gender_schema(True),
    'story': get_gender_schema(),
    'learningStyleCharacteristics': get_gender_schema(), 
    'learningStyleExplanation': get_gender_schema(),  
    'development': get_gender_schema()
}

PROFILES = ['0','1', '2', '3', '4', '5','6', '7', '8', '9', '10', '11', '12', '13', '14']

READERS = ['student', 'teacher', 'employee', 'parent', 'leader']
LEVELS = ['1', '2', '3', '4', '5']


data = []

def assign_values_based_on_gender(object, keys, file, missing, LANG):
    #print(keys)
    #if (LANG=="FR" and len(keys)>1):print('keys',keys)
    if not keys:
        object['masculine'][LANG] = missing+"(M)"
        object['female'][LANG] = missing+"(F)"
        return

    masculine_key = next((key for key in  keys if '-masc' in key),None)
    female_key = next((key for key in  keys if '-fem' in key),None)

    if (not masculine_key or not female_key):
        value = file[keys[0]]
        if not value: value=missing
        object['masculine'][LANG] = value+"(M)"
        object['female'][LANG] = value+"(F)"
    else:
        value=file[masculine_key]
        if not value: value=missing
        object['masculine'][LANG] = value
        value=file[female_key]
        if not value: value=missing
        object['female'][LANG] = value
        

for LANG in ['EN','FR','PL']:
    with open('./scripts/cognitive/oldFormat/'+LANG.lower()+'/profiles.json') as f:
        file = json.load(f)
    keys = [key for key, text in file.items()]

    for PROFILE in PROFILES:
        #print("NAD", NAD)
        profileFiltered = [k for k in keys if k.startswith(PROFILE+'-')]

        # The same for all readers
        nameKey = next((key for key in profileFiltered if '-name' in key), None)

        for READER in READERS:
            missing=LANG+"->"+READER+"->MISSING"
            #print("READER", READER)
            existing = [d for d in data if d['key'] == PROFILE and d['readerType'] == READER]
            if (not existing):
                document = copy.deepcopy(schema)
                document['key'] = PROFILE
                document['readerType'] = READER
            else:
                document=existing[0]
            
        
            readerFiltered = [k for k in profileFiltered if READER in k]

            document['name'][LANG] = file[nameKey] if file[nameKey] else missing
            


            learningStyleCharacteristicsKeys = [key for key in  readerFiltered if '-style' in key]
            assign_values_based_on_gender(document['learningStyleCharacteristics'], learningStyleCharacteristicsKeys, file, missing, LANG)

            

            learningStyleExplanationKeys =  [key for key in  readerFiltered if '-explanation' in key]
            assign_values_based_on_gender(document['learningStyleExplanation'], learningStyleExplanationKeys, file, missing, LANG)
            
            developmentKeys =  [key for key in  readerFiltered if '-development' in key]
            assign_values_based_on_gender(document['development'], developmentKeys, file, missing, LANG)


            storyKeys = [key for key in  readerFiltered if '-story' in key and 'introduction' not in key]
            assign_values_based_on_gender(document['story'], storyKeys, file, missing, LANG)

            
            
            # The same for all profiles
           
            attributeKeys = [key for key in readerFiltered if '-trait' in key]
            masculineAttributeKeys = [key for key in  attributeKeys if '-masc' in key]
            femaleAttributeKeys = [key for key in  attributeKeys if '-fem' in key]
            
            
            
            if not attributeKeys: 
                document['attributes']['masculine'][LANG] = [missing,missing]
                document['attributes']['female'][LANG] = [missing,missing]
            else:
                for attributeKey in masculineAttributeKeys:
                    value = file[attributeKey] if file[attributeKey] else missing
                    document['attributes']['masculine'][LANG].append(value)
                for attributeKey in femaleAttributeKeys:
                    value = file[attributeKey] if file[attributeKey] else missing
                    document['attributes']['female'][LANG].append(value)
            
            if not existing: data.append(document)

data = json.dumps(data)
print(data)