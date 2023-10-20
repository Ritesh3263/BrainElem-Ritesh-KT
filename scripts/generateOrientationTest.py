import json
from pprint import pprint

'''
JSON import from phpMyAdmin for query:

    SELECT q.id, q.type, q.parent, q.special, q.options, qt.text, qa.order_answer as answer_value, qat.text as answer_name, dat.text as defined_answer_name,  da.order_answer as defined_answer_value  FROM questions q
    LEFT JOIN defined_answers da ON da.question_type = q.type
    LEFT JOIN defined_answer_translations dat ON dat.defined_answer_id = da.id
    LEFT JOIN question_translations qt ON qt.question_id = q.id
    LEFT JOIN question_answers qa ON qa.questions_id = q.id
    LEFT JOIN question_answer_translations qat ON qat.question_answer_id = qa.id
    WHERE q.tests_id=426 AND qt.language_code = 'pl' AND (qat.language_code = 'pl' OR qat.language_code IS NULL) AND ( dat.language_code = 'pl' OR  dat.language_code IS NULL)
    ORDER BY q.parent ASC, qa.order_answer, da.order_answer
'''
with open('./questions_Orientation_Test_pl.json') as json_file:
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
    'status': 'AWAITING',
    'title': 'Orientation test',
    'goNextPageAutomatic': True,
    'showQuestionNumbers': 'off'
}

for question in questions:
    question_name = question['id']
    question_number = int(question['parent'])
    question_title = question['text'].replace('\n', '<br>')
    if question_number == 1:
        test['description'] = question_title
    elif question_number == 3:
        page = {"elements": [{'type': 'expression', 'name': question_name, 'title': question_title}]}
        test['pages'].append(page)
    elif question_number in [4, 6, 7]:
        choice = {'text': question['answer_name'], 'value': question['answer_value']}
        try: test['pages'][0]['elements'][question_number-3]['choices'].append(choice)
        except IndexError: test['pages'][0]['elements'].append({'type': 'radiogroup', 'name': question_name, 'title': question_title, 'isRequired': 1, 'choices': [choice]})
    elif question_number in [5]:#AGE
        choice = {'text': question['answer_name'], 'value': str(int(question['answer_value'])+7)}
        try:
            test['pages'][0]['elements'][int(question_number)-3]['choices'].append(choice)
        except IndexError: 
            test['pages'][0]['elements'].append({'type': 'dropdown', 'name': question_name, 'title': question_title, 'isRequired': 1, 'choices': []})
            test['pages'][0]['elements'][int(question_number)-3]['choices'].append(choice)
    elif question_number == 9:
        # ----- 4 answers INSTRUCTION ----- 
        page = {"elements": [{'type': 'expression', 'name': question_name, 'title': question_title}]}
        test['pages'].append(page)
    elif (question_number > 9 and question_number < 64):
        # ----- 4 answers ----- 
        is_new_page = 0
        elements = []
        if question['type'] == '11':
            if question['defined_answer_value'] == '1':
                is_new_page = 1;
            answer_name = question['defined_answer_name']
            answer_value = question['defined_answer_value']
            choice = {'text': answer_name, 'value': answer_value}
            elements.append({'type': 'radiogroup', 'isRequired': True, 'name': question_name, 'title': question_title, "choices": [choice]}) 
            if is_new_page == 1:
                page = {"elements": elements}
                test['pages'].append(page)
            else: test['pages'][-1]['elements'][0]['choices'].append(choice)
    
    elif question_number == 65:
        # ----- picture answers INSTRUCTION ----- 
        page = {"elements": [{'type': 'expression', 'name': question_name, 'title': question_title}]}
        test['pages'].append(page)
    
    elif (question_number > 67 and question_number < 213):
        # ----- picture answers ----- 
        is_new_page = question['defined_answer_value'] == '1'
        answer_name = question['defined_answer_name']
        answer_value = question['defined_answer_value']
        # to always have 5 digits 
        if len(question['options']) == 3:
            image = question['options'].replace("_", "aaa")
        elif len(question['options']) == 4:
            image = question['options'].replace("_", "aa")
        elif len(question['options']) == 5:
            image = question['options'].replace("_", "a")

        picture_question_title = "<p>Czy chciał(a)byś znaleźć się w sytuacji zawodowej lub wykonywać czynność widoczną na zdjęciu?&nbsp;&nbsp;</p>\n\n<p><img alt=\"\" src=\"/api/v1/orientationTests/images/{}000abcdabcdabcdabcd/download\" style=\"display: block; margin-left: auto; margin-right: auto; height: 320px;\" /></p>\n".format(image);
        choice = {'text': answer_name, 'value': answer_value}
        if is_new_page:
            page = {"elements": [{'type': 'radiogroup', 'isRequired': True, 'name': question_name, 'title': picture_question_title, "choices": [choice]}]}
            test['pages'].append(page)
        else: test['pages'][-1]['elements'][0]['choices'].append(choice)

    elif question_number == 215:
        # ----- 6 answers INSTRUCTION ----- 
        page = {"elements": [{'type': 'expression', 'name': question_name, 'title': question_title}]}
        test['pages'].append(page)

    elif question_number > 215:
        # ----- 6 answers ----- 
        is_new_page = question['defined_answer_value'] == '1'
        answer_name = question['defined_answer_name']
        answer_value = question['defined_answer_value']
        choice = {'text': answer_name, 'value': answer_value}
        if is_new_page:
            page = {"elements": [{'type': 'radiogroup', 'isRequired': True, 'name': question_name, 'title': question_title, "choices": [choice]}]}
            test['pages'].append(page)
        else: test['pages'][-1]['elements'][0]['choices'].append(choice)

pprint(test)
# print(json.dumps(test))



















