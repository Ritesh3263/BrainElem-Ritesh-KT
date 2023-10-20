# Transform JSON object of content into a form
# that can be copy-paste into spreadsheet

# TO get the JSON from JS object from database use regex similar to ObjectId\('.*)\)
# Then copy this object to developer console, and use `Copy object` option.

import json
from bs4 import BeautifulSoup



f = open('BC_CERT_TEST.json')
text = f.read()


data = json.loads(text)

# Get text from HTML
def get_text(html):
        soup = BeautifulSoup(html)
        text = soup.get_text().replace('\n', '')
        return text

for page_index, page in enumerate(data['pages']):
    for element_index, element in enumerate(page['elements']):
        text = get_text(element['title'])

        answers = ''
        if 'choices' in element:
            answers = []
            for a in element['choices']:
                if type(a) is not str and 'value' in a: answers.append(a['value'])
                else: answers.append(a.replace('\n', ''))

        correctAnswer =''
        if 'correctAnswer' in element:
            correctAnswer = element['correctAnswer']
            if type(correctAnswer) is str:
                correctAnswer = get_text(correctAnswer)
        #if page_index==2 and element_index == 4:
        element_type = element['type']
        if 'subtype' in element:
            element_type+="--"+element['subtype']
        print(page_index+1, element_index+1, element_type, text, answers, correctAnswer, sep="\t")
