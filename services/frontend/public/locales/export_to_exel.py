'''
Script for exporting translations into Exel File so they can be translated by no technical people

Each translation file will have it's own sheet in the file.
'''

import pandas as pd
import json


# Languages to be included in exel files
LANGS = ['en', 'pl', 'fr']

# Files to include in extraction process - without .json
NAMES = ['common']


def load_file(LANG, NAME):
    # Opening JSON file with translations
    f = open('services/frontend/public/locales/'+LANG+'/'+NAME+'.json')
    # JSON object as a dictionary
    file_data = json.load(f)
    return file_data


writer = pd.ExcelWriter("translations.xlsx", engine = 'openpyxl')# alternative: xlsxwriter

# For each file in each lanaguage
for NAME in NAMES:
    TRANSLATIONS_IN_FILE = {}
    INDEX = []
    COLUMNS = []
    DATA = []

    file_data = load_file(LANGS[0], NAME)
    INDEX = file_data.keys()

    for I in INDEX:# INITIALIZE WITH EMPTY ARRAYS
        DATA.append([])

    for LANG in LANGS:
        COLUMNS.append(LANG)
        file_data = load_file(LANG, NAME)

        for count, value in enumerate(INDEX):
            value = file_data[value] if value in file_data else ""
            DATA[count].append(value)


    df1 = pd.DataFrame(DATA,
                       index=INDEX,
                       columns=COLUMNS)
    # for LANG in LANGS:
    print(NAME)
    df1.to_excel(writer,
                 sheet_name=NAME)
writer.close()
