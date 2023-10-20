"""
This script will produce a JSON file containg all areas of development and opportunities with solutions
It will not contain images/activities/materials which belongs to the areas/opportunities.
To obtain final JS file, you must run `processMaterialsAndActivities` 
which will update JSON file and transform it into JS file. 

Areas Of Development are related directly to NADs values, so we have five of them.
Each of Areas Of Development has its own description, impact, benefits and assigned Materials(contents/PDF files). 
In the future, it will also be associated with our own Courses and External Courses.

Each Area Of Development is divided into smaller correlated Opportunities which belong to one of the 3 categories: 
Sociological, Psychological and Pedagogical. Each of Opportunities has its own description, 
solution and assigned Activities(contents/PDF files).
"""

# pip install openpyxl

import json
import pandas as pd
import copy

area_schema = {
    'key': '',  # 1-5
    'ageGroup': '',
    'readerType': '',
    # Those texts are missing in the spreadsheet
    'type': 'reading',
    'name': {'PL': '', 'EN': '', 'FR': ''},
    'description': {'PL': '', 'EN': '', 'FR': ''},
    'impact': {'PL': '', 'EN': '', 'FR': ''},
    'benefits': {'PL': '', 'EN': '', 'FR': ''},

    'imageUrl': '',
    'materials': {'PL': [], 'EN': [], 'FR': []},  # content id
    'courses': {'PL': [], 'EN': [], 'FR': []},  # course id
    # {title: , type: , url: }
    'externalResources': {'PL': [], 'EN': [], 'FR': []},


    'opportunities': [],  # opportunity_schema

}

opportunity_schema = {
    'key': '',  # <area>_<type>_<number>_<part> eg: 1_2_1_1
    'area': '',  # 1-5
    'type': '',  # "sociological, psychological, development
    'number': '',
    
    'ageGroup': '',
    'readerType': '',

    'area': '',  # 1-5
    'imageUrl': '',  # cover
    
    'text': {'PL': '', 'EN': '', 'FR': ''},

    'activities': {'PL': [], 'EN': [], 'FR': []},  # content id
    'solutions': [],  # solution schema
}

solution_schema = {
    'text': {'PL': '', 'EN': '', 'FR': ''},
}

LANGS = ["PL", "EN", "FR"]
READERS = ['student', 'teacher', 'parent', 'employee', 'leader']

areas_of_development = {}


# list of nad values
nads = ['self-activation', 'self-confidence',
        'communication-strategy', 'cooperation', 'regularity']

nads_images = [# Those are only names, they will be transforemd into urls in `processMaterialsAndActivities``
    'trait-self-activation',
    'trait-self-confidence',
    'trait-communication-strategy',
    'trait-cooperation',
    'trait-regularity'
]

# sheets are duplicated for other lanaugages
tabs = [val for val in nads for _ in LANGS]


def prepare_text(text):
    return str(text).replace("\n", " ").replace('"', "'").replace("\t", " ").strip()


def is_missing(text, minLen=5):
    '''
    Detect if text is missing, somtimes it is empty cell but sometimes it has X inside
    '''
    return pd.isnull(text) or not text or len(text) < minLen



def extract_data_from_file(reader_type, age_group=24, debug=False):
    """
    Extract data from the file
    """
    if (debug):
        print('\n\n\n\n### Processing file for ', reader_type, age_group)

    FILE_TYPE = reader_type.upper()

    FILE_TYPE += " "+str(age_group)
    file_name = "./scripts/cognitive/MATRIX ISSSOL "+FILE_TYPE+" PL EN FR.xlsx"
    try:
        file = pd.ExcelFile(file_name)
    except:
        file = pd.ExcelFile(file_name.replace(' EN ', ' ENG '))

    for nad in nads:  # Preapare empty object
        unique_key = str(reader_type)+'_'+str(nad)+'_'+str(age_group)
        areas_of_development[unique_key] = copy.deepcopy(area_schema)

    # For each tab in spredsheet
    for index in range(len(tabs)):

        lang = LANGS[(index) % len(LANGS)]
        sheet_number = index
        if (debug):
            print('\n### Processing sheet number', sheet_number+1)

        nad = tabs[index]
        area_key = nads.index(nad)+1
        unique_key = str(reader_type)+'_'+str(nad)+'_'+str(age_group)


        areas_of_development[unique_key]['key'] = str(area_key)
        areas_of_development[unique_key]['readerType'] = reader_type
        areas_of_development[unique_key]['ageGroup'] = age_group

        # Those are only names, they will be transforemd into urls in `processMaterialsAndActivities`
        areas_of_development[unique_key]['temporaryImageName'] = nads_images[area_key-1]

        df = pd.read_excel(file, sheet_number)
        for row in range(1, 100):
            try:
                ##################################################
                # AREAS OF DEVELOPMENT ###########################
                aod_name = df.iloc[row, 1]
                aod_description = df.iloc[row, 2]
                aod_impact = df.iloc[row, 3]
                aod_benefits = df.iloc[row, 4]
                if (aod_name and not pd.isnull(aod_name)):

                    areas_of_development[unique_key]['name'][lang] = prepare_text(
                        aod_name)
                    areas_of_development[unique_key]['name'][lang] = prepare_text(
                        aod_name)
                    areas_of_development[unique_key]['description'][lang] = prepare_text(
                        aod_description)
                    areas_of_development[unique_key]['impact'][lang] = prepare_text(
                        aod_impact)
                    areas_of_development[unique_key]['benefits'][lang] = prepare_text(
                        aod_benefits)

                ######################################################
                # EXTERNAL RESOURCES #################################
                try: 
                    external_video_title = aod_benefits = df.iloc[row, 24]
                    external_video_url = aod_benefits = df.iloc[row, 25]
                    if (not is_missing(external_video_title) and not is_missing(external_video_url)):
                        areas_of_development[unique_key]['externalResources'][lang].append(
                            {'type': 'video', 'title': external_video_title, 'url': external_video_url})
                except: pass
                try: 
                    external_presentation_title = aod_benefits = df.iloc[row, 26]
                    external_presentation_url = aod_benefits = df.iloc[row, 27]
                    if (not is_missing(external_presentation_title) and not is_missing(external_presentation_url)):
                        areas_of_development[unique_key]['externalResources'][lang].append(
                            {'type': 'presentation', 'title': external_presentation_title, 'url': external_presentation_url})
                except: pass

                #####################################
                # OPPROTUNITES AND SOLUTIONS ######################
                parts = df.iloc[row, 6].split('_')
                if len(parts) < 4:
                    continue

                number = parts[4]

                solutions_text = {
                    'sociological': prepare_text(df.iloc[row, 13]),#"id": df.iloc[row, 12]
                    'psychological': prepare_text(df.iloc[row, 15]),#"id": df.iloc[row, 14] 
                    'development': prepare_text(df.iloc[row, 17])#"id": df.iloc[row, 16]
                }
                opportunity_text = {
                    'sociological': prepare_text(df.iloc[row, 7]),#"id": df.iloc[row, 6],
                    'psychological': prepare_text(df.iloc[row, 9]),#"id": df.iloc[row, 8],
                    'development': prepare_text(df.iloc[row, 11])#"id": df.iloc[row, 10],
                }
                

                
                for index, opportunity_type in enumerate(['sociological', 'psychological', 'development']):
                    opportunity_key = str(area_key)+"_"+str(index+1)+"_"+str(number)+"_1"
                    # Try to find opportunity - it could be created for different language
                    opportunity = next((o for o in  areas_of_development[unique_key]['opportunities'] if o['key'] == opportunity_key), None)
                    
                    
                    if not opportunity:
                        opportunity_images = {
                            'sociological': str(df.iloc[row, 20]),
                            'psychological': str(df.iloc[row, 21]),
                            'development': str(df.iloc[row, 22])
                        }


                        opportunity = copy.deepcopy(opportunity_schema)
                        opportunity["key"] = opportunity_key
                        opportunity["area"] = str(area_key)
                        opportunity["type"] = opportunity_type
                        opportunity["number"] = number
                        
                        opportunity["readerType"] = reader_type
                        opportunity["ageGroup"] = age_group
                        opportunity["text"][lang] = opportunity_text[opportunity_type]
                        # Those are only names, they will be transforemd into urls in `processMaterialsAndActivities`
                        opportunity['temporaryImageName'] = opportunity_images[opportunity_type]     
                        
                        solution = copy.deepcopy(solution_schema)
                        solution['text'][lang] = solutions_text[opportunity_type]
                        opportunity['solutions'] = [solution]
                        areas_of_development[unique_key]['opportunities'].append(opportunity)
                    else:
                        #print('opportunity found', opportunity_key)
                        opportunity['text'][lang] = opportunity_text[opportunity_type]
                        opportunity['solutions'][0]['text'][lang] =  solutions_text[opportunity_type]
                    
            except Exception as e:
                if (debug):
                    print('Error in sheet', sheet_number, '(', nad,')', type(e).__name__, e)
                if (type(e).__name__ == 'AttributeError'):
                    continue
                else:
                    break
    return areas_of_development


if __name__ == "__main__":
    for reader in READERS:
        if reader in ['student', 'teacher', 'parent']:
            for age_group in ['12', '15', '18']:
                extract_data_from_file(reader, age_group, 0)
        else:
            age_group = '24'
            extract_data_from_file(reader, age_group)
    
    #extract_data_from_file('student', '12')
    #extract_data_from_file('employee', '24')
    
    
    data = [value for key, value in areas_of_development.items()]
    data = json.dumps(data)
    print(data)
