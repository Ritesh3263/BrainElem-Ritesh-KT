import json
from pprint import pprint

'''
JSON import from phpMyAdmin for query:

    SELECT questions.id, questions.type, questions.parent, questions.special,  question_translations.text, question_answers.order_answer as answer_value, question_answer_translations.text as answer_name, defined_answer_translations.text as defined_answer_name,  defined_answers.order_answer as defined_answer_value  FROM `questions`
    LEFT JOIN defined_answers ON defined_answers.question_type = questions.type
    LEFT JOIN defined_answer_translations ON defined_answer_translations.defined_answer_id = defined_answers.id
    LEFT JOIN question_translations ON question_translations.question_id = questions.id
    LEFT JOIN question_answers ON question_answers.questions_id = questions.id
    LEFT JOIN question_answer_translations ON question_answer_translations.question_answer_id = question_answers.id
    WHERE questions.tests_id=500 AND question_translations.language_code = 'fr' AND (question_answer_translations.language_code = 'fr' OR question_answer_translations.language_code IS NULL) AND ( defined_answer_translations.language_code = 'fr' OR  defined_answer_translations.language_code IS NULL)
    ORDER BY `questions`.`parent` ASC, question_answers.order_answer, defined_answers.order_answer
'''
with open('./questions_BrainElem_Adult_Test_pl.json',  encoding='utf-8') as json_file:
    file_content = json.load(json_file)
    for element in file_content:
        if 'data' in element.keys():
            questions = element['data']



test = {
    'showTitle': True,
    'durationTime': 2700,
    'approvedByLibrarian': True,
    'cocreators': [],
    'contentType': 'TEST',
    'description': '',
    'groups': [],
    'pages': [],
    'sendToLibrary': True,
    'showPrevButton': True,
    'showProgressBar': 'bottom',
    'libraryStatus': 'ACCEPTED',
    'title': 'BrainElem Adult Test',
    'goNextPageAutomatic': True,
    'showQuestionNumbers': 'off'
}

for question in questions:
    question_name = question['id']
    question_number = int(question['parent'])
    question_title = question['text'].replace('\n', '<br>')
    if question_number == 0:
        test['description'] = question_title
        page = {"elements": [{'type': 'expression', 'name': question_name, 'title': "Start"}]}
        test['pages'].append(page)
    elif question_number in [1, 2, 3, 4, 5]:
        choice = {'text': question['answer_name'], 'value': question['answer_value']}
        try: test['pages'][0]['elements'][question_number]['choices'].append(choice)
        except IndexError: test['pages'][0]['elements'].append({'type': 'radiogroup', 'name': question_name, 'title': question_title, 'isRequired': 1, 'choices': [choice]})
    elif question_number > 6:
        is_new_page = question['defined_answer_value'] == '1'
        answer_name = question['defined_answer_name']
        answer_value = question['defined_answer_value']
        if question['special'] == "R": answer_value = str(7 - int(answer_value))

        choice = {'text': answer_name, 'value': answer_value}
        if is_new_page:
            page = {"elements": [{'type': 'radiogroup', 'isRequired': True, 'name': question_name, 'title': question_title, "choices": [choice]}]}
            test['pages'].append(page)
        else: test['pages'][-1]['elements'][0]['choices'].append(choice)


pprint(test)
# print(json.dumps(test))



















