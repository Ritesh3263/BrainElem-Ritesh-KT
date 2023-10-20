'''
Script for importin translations from Exel File into JSON format

Each translation file should will have it's own sheet in the file.
'''

import pandas as pd
import json


# Languages to be included in exel files
LANGS = ['en', 'pl', 'fr']

import pandas as pd

sheets_dict = pd.read_excel('services/frontend/public/locales/translations_import.xlsx', sheet_name=None)

all_sheets = []
for name, sheet in sheets_dict.items():
    for LANG in LANGS:
        translations={}
        for index, row in sheet.iterrows():
            translations[row.iloc[0]] = row[LANG]
    with open('services/frontend/public/locales/'+LANG+'/'+name+'.json', 'w', encoding='utf-8') as f:
        json.dump(translations, f,  indent=4, ensure_ascii=False)