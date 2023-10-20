# Transform simple key:value JSON with translations
# into object matching schema in database

# "FORMAT": "tip_<row>_<number>_<target-age-group>_<reader-type>",
# "---1": "For old EDU list replace age group(group1,group2,group3) with student_12,student_15,student_18",
# "---2": "For BIZ tips replace number with row.",

import json
import copy

schema = {
    'key': '',
    'mobile': False,
    'ageGroup': '',
    'readerType': '',
    'question': {'PL': '', 'EN': '', 'FR': ''},
    'answer': {'PL': '', 'EN': '', 'FR': ''},
}

READERS = ['student', 'teacher', 'employee', 'parent', 'leader']

data = []

for LANG in ['EN', 'FR', 'PL']:
    
    
    with open('./scripts/cognitive/oldFormat/'+LANG.lower()+'/faq-questions.json') as f:
        questions_file = json.load(f)
    questions_keys = [key for key, text in questions_file.items()]

    with open('./scripts/cognitive/oldFormat/'+LANG.lower()+'/faq-answers.json') as f:
        answers_file = json.load(f)
    answers_keys = [key for key, text in answers_file.items()]

    for question_key in questions_keys:
        elements = question_key.split('-')
        number= elements[1]
        
        # Find if exists from different langs
        existing_document = next((d for d in data if d['key'] == number), None)
        if not existing_document: document = copy.deepcopy(schema)
        else: document = existing_document
        
        document['key'] = number
        document['question'][LANG] = questions_file[question_key] if questions_file[question_key] else "MISSING->FAQ_QUESTION "+str(number)+"->"+LANG
        answer_key = question_key.replace('question','answer') 
        document['answer'][LANG] = answers_file[answer_key] if answers_file[answer_key] else "MISSING->FAQ_ANSWER "+str(number)+"->"+LANG

        
        if not existing_document: data.append(document)



data = json.dumps(data)
print(data)
