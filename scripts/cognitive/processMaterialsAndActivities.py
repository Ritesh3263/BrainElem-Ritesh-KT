# Script for processing PDF files with Materials and Activities
# Issue #1195

# To obtain initial file, you must run `processAreas` 
# which will produce JSON file. 

# The goal of this script is to process and insert all PDFs with activities and materials into system.
# They will be inserted as contents with a single PDF attachment.

# Materials
# `M_<target-age-group>_<reader-type>_<area-of-development-id>_<language>_<number>_<content_title>`
# - `target-age-group` - one of `[12,15,18,24]`
# - `reader-type` - [`STUDENT`, `EMPLOYEE`, `TEACHER`, `PARENT`, `LEADER`] :exclamation: MISSING :exclamation:
# - `area-of-development-id` - from 1 to 5(as NAD)
# - `language` - one of `[EN, FR, PL]`
# - `number` - number of the material for this issue starting from 1
# - `content_title` - the title of the content
#
# Activities
# `A_<target-age-group>_<reader-type>_<area-of-development-id>_<language>_<opportunity-id>_<number>_<content_title>`
# - `target-age-group` - one of `[12,15,18,24]`
# - `reader-type` - [`STUDENT`, `EMPLOYEE`, `TEACHER`, `PARENT`, `LEADER`] :exclamation: MISSING :exclamation:
# - `area-of-development-id` - from 1 to 5(as NAD)
# - `language` - one of `[EN, FR, PL]`
# - `opportunity-id` - id of the micro issue
# - `number` - number of the material for this micro-issue starting from 1 :exclamation: MISSING :exclamation:
# - `content_title` - the title of the content
#
#
#
# To change:
# Initially provided files will require some changes such as:
#
# - Replace `BIZ` with `24` for both `activities` and `materials`
# - Add missing `reader-type` for both `activities` and `materials`
#  - by default `STUDENT` for `age-group` in 12,15,18
#  - by default `EMPLOYEE` for `age-group` = 24
# - Add missing number for `activities` - `_1_` for all
#
#


# import required module
import os
import re
import pathlib
import shutil
import copy
import json
import bson
from hashlib import sha256

current_dir = str(pathlib.Path(__file__).parent.resolve())



    
contents = []
content_files = []
content_images = []

# Load areas from file
path = current_dir+'/../../tmp.json'

with open(path) as user_file:
    file_contents = user_file.read()
    areas = json.loads(file_contents)

content_schema = {
    'showTitle': True,
    'approvedByLibrarian': True,
    'cocreators': [],
    'contentType': 'PRESENTATION',
    'description': '',
    'groups': [],
    'pages': [],
    'sendToLibrary': True,
    'showPrevButton': True,
    'showProgressBar': 'bottom',
    'libraryStatus': 'ACCEPTED',
    'approvedContentSource': '',
    'title': '----------',
    'goNextPageAutomatic': False,
    'showQuestionNumbers': 'off',
    'pages': [
        {
            "name": "page1",
            "elements": [
                {
                    "type": "expression",
                    "name": "",
                    "title": "<div class=\"select-file\" style=\"width:100%\"> </div>",
                    "readOnly": True,
                    "subtype": "file",
                    "file": ""
                }
            ]
        }
    ]
}

content_file_schema = {
    '_id': '',
    'fileName': '',
    'fileOriginalName': '',
    'mimeType': 'application/pdf',
    'fileTextExtracted': ''
}


content_image_schema = {
    '_id': '',
    'fileName': '',
    'fileOriginalName': '',
    'mimeType': 'image/png',
}


LANGS = ["ENG", "PL", "FR"]

# Remove and create a directory
def recreate_dir(path):
    if os.path.exists(path) and os.path.isdir(path):
        shutil.rmtree(path)
    os.makedirs(path)
    
# Remove and create a directory
def create_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)
    
# Add new content image to the list
# if the id deoes not yet exists
def add_content_image(id, name):
    if (id not in [c['_id'] for c in content_images]):
        content_image = copy.deepcopy(content_image_schema)
        content_image['_id'] = id
        content_image['fileName'] = name
        content_image['fileOriginalName'] = name
        content_images.append(content_image)


# In the directory with created files
# All of files has `BIZ` instead of `24`
def replace_BIZ_with_24(parts):
    updated_parts = parts[:]
    if (parts[1] == 'BIZ'):
        updated_parts[1] = '24'
    elif (parts[2] == 'BIZ'):
        updated_parts[2] = '24'
    return updated_parts


# In the directory with created files
# Some of them are missing `_` before `title`
def fix_missing_underscore_before_title(parts):
    updated_parts = parts[:]
    if (updated_parts[0] == 'A'):
        min_len = 6
    else:
        min_len = 6
    if (len(updated_parts) == min_len):
        wrong = updated_parts[min_len-1].split(' ', 1)
        number = wrong[0]
        try:
            title = wrong[1]
        except Exception as e:
            if (type(e).__name__ == 'IndexError'):
                pdf = False
                if ('pdf' in updated_parts[min_len-1]):
                    pdf = True

                number = updated_parts[min_len -
                                       1].replace('.pdf', '').replace('.docx', '')
                if (pdf):
                    title = "?????.pdf"
                else:
                    title = "?????.docx"
            else:
                raise(e)
        # Overide wrong
        updated_parts[min_len-1] = number
        updated_parts.append(title)
    return updated_parts

# In the directory with created files
# All of them are missing `reader-type`


def fix_missing_reader_type(parts):
    updated_parts = parts[:]
    age = updated_parts[1]
    if (updated_parts[2] not in ['STUDENT', 'PARENT', 'TEACHER', 'EMPLOYEE', 'LEADER']):
        if (int(age) <= 18):
            updated_parts.insert(2, 'STUDENT')
        else:
            updated_parts.insert(2, 'EMPLOYEE')
    return updated_parts

# In the directory with created files
# Activities are missing the `number` property


def fix_missing_number(parts):
    updated_parts = parts[:]
    if (parts[0] == 'A'):
        updated_parts.insert(6, '1')
    return updated_parts

# Files provided for activities and materials had a lot of differences in the naming structure
# This function is fixing names and making them more consistant


def fix_names(debug=False):
    # For each PDF file in the current directory
    final_path = current_dir+'/READY'
    recreate_dir(final_path)
    fixed_parent_path = current_dir+"/FIXED"
    recreate_dir(fixed_parent_path)
    for LANG in LANGS:

        path = current_dir+'/'+LANG
        
        files = [f for f in os.listdir(path) if os.path.isfile(
            current_dir+'/'+LANG+'/'+f) and (f.endswith('.pdf') or f.endswith('.docx') or f.endswith('.doc'))]

        for f in files:
            # Remove _ from the titles
            old_name = f
            if (debug):
                print('RENAMING:', old_name)

            f = f.replace('_FRE_', '_FR_')
            f = f.replace('_ENG_', '_EN_')
            f = f.replace(' 3_ENG ', '_3_EN_')

            for wrong in ['A-BIZ_', 'M-12', 'M-15_', 'M-18_']:
                f = f.replace(wrong, wrong.replace('-', '_'))
            f = f.replace('A_BIZ 3_ENG 9', 'A_BIZ_3_ENG_9')
            f = f.replace(' .pdf', '.pdf')
            f = f.replace('_.pdf', '.pdf')
            f = f.replace(' .docx', '.docx')
            f = f.replace('_.docx', '.docx')
            f = f.replace('9-Pomodoro', '9_Pomodoro')

            for wrong in ['Questions_', 'Exercise_', 'Exercice_', 'Email_',
                          'MUSCLE_', 'Moments_', 'grupie_', 'souffle_pratique', 'week_plan',
                          'progress_', 'Rationalize_problematic_situations', 'Systematyka_',
                          'text_a', 'Rationaliser_les_situations_problèmatiques', 'scientifique_un',
                          'les_voleurs de temps_au quotidien', 'progresser_', 'préjugés_ et si_^',
                          'Débat_Oxford_pourquoi_y_participer', 'dlaczego_I', 'Window_', '_mind', 'Hats _', 'Willpower_',
                          '_pertur', '_Pomodo', '_pratique', 'musculaire_', 'comportement_', 'behavior_']:

                f = f.replace(wrong, wrong.replace('_', '-'))

            f = f.replace('5Dołącz', '5_Dołącz')
            f = f.replace('4Systematyka', '4_Systematyka')
            f = f.replace(' Rapport_', '_Rapport - ')
            f = f.replace('12_3_3_EN', '12_3_EN')
            f = f.replace('15_4_4_', '15_4_')
            f = f.replace('11Mountain', '11_Mountain')

            f = re.sub('.doc$', '.docx', f)
            f = re.sub('_PL([1-9])', r'_PL_\1', f)
            f = re.sub('_FR([1-9])', r'_FR_\1', f)
            f = re.sub('_EN([1-9])', r'_EN_\1', f)
            f = re.sub('_([1-9]{1,2})([A-Z])', r'_\1_\2', f)

            f = f.replace('__', '_')
            f = f.replace('  ', ' ')
            f = f.replace('^L', '')
            parts = f.split('_')

            parts = replace_BIZ_with_24(parts)
            if (debug):
                print('Replace BIZ with 24       :', parts)
            parts = fix_missing_reader_type(parts)
            #print('Add missing reader type   :', parts)
            parts = fix_missing_underscore_before_title(parts)
            #print('Add missing _ before title:', parts)
            parts = fix_missing_number(parts)
            if (debug):
                print('Add missing number        :', parts)

            parts = [p.strip() for p in parts]
            # A - for Activity M for Material
            file_type = parts[0]
            # Age group
            age_group = parts[1]
            # Area of development - ID
            reader_type = parts[2]
            # Language
            lang = parts[3]

            if (file_type == 'A'):
                # Opportunity - id
                opportunity_id = parts[5]
                # Number of file
                number = parts[6]
                # Title
                title = parts[6].strip('.pdf')
                new_name = '_'.join(parts)

            elif (file_type == 'M'):
                new_name = '_'.join(parts)

            if (debug):
                print('INTO    :', new_name)
            if (debug):
                print()
            
            fixed_path = fixed_parent_path+"/"+reader_type+"/"+file_type+"/"+LANG.replace('ENG','EN')
            create_dir(fixed_path)
            shutil.copyfile(path+"/"+old_name, fixed_path+'/'+new_name)
            if ('.pdf' in new_name):
                shutil.copyfile(path+"/"+old_name, final_path+'/'+new_name)

def flatten_directories(source_dir, dest_dir):
    """ Copy all activities/materials from nested directories
        into single directory
    """
    from fnmatch import fnmatch
    pattern = "*"
    ready_path = current_dir+'/'+dest_dir
    recreate_dir(ready_path)
    
    structure_path = current_dir+'/'+source_dir
    files = []
    for path, subdirs, files in os.walk(structure_path):
        for name in files:
            if fnmatch(name, pattern):
                source_path = os.path.join(path, name)
                shutil.copyfile(source_path, ready_path+'/'+name) 
    



def rename_files(source_dir, dest_dir):
    """ Change names to new ones based on the list provided by Tomasz
    """

    with open(current_dir+'/rename_activities.json', 'r') as file:
        rename_dict = json.loads(file.read())



    dest_path = current_dir+'/'+ dest_dir
    recreate_dir(dest_path)
    
    structure_path = current_dir+"/"+source_dir
    files = []
    for old_path, subdirs, files in os.walk(structure_path):
        for old_name in files:
            new_names = []# By default
            for new_key, old_key in rename_dict.items():
                if old_key in old_name: 
                    new_name = old_name.replace(old_key,new_key)
                    new_names.append(new_name)
            if not new_names: new_names = [old_name]

            for new_name in new_names:
                parts = new_name.split('_')
                reader_type=parts[2]
                file_type = parts[0]
                LANG = parts[4]
                new_path = dest_path+"/"+reader_type+"/"+file_type+"/"+LANG.replace('ENG','EN')
                create_dir(new_path)
                shutil.copyfile(old_path+"/"+old_name, new_path+'/'+new_name)
                    
               
def divide_by_nads(source_dir, dest_dir):   
    """ Devide activities and materials into nad directories"""    
    dest_path = current_dir+'/'+ dest_dir
    recreate_dir(dest_path)   
    
    source_path = current_dir+'/'+ source_dir
    files = [f for f in os.listdir(source_path) if os.path.isfile(
        source_path+'/'+f)]

    for f in files:
        parts = f.split('_')
        type = parts[0]
        area = parts[3]

        LANG = parts[4]
        reader_type=parts[2]
        file_type = parts[0]
        
        new_path = dest_path+"/"+area+"/"+reader_type+"/"+file_type+"/"+LANG.replace('ENG','EN')
        create_dir(new_path)
        shutil.copyfile(source_path+"/"+f, new_path+'/'+f)
        
            
def divide_by_opportunities(source_dir, dest_dir):   
    """ Devide activities into opportunities directories"""        
    dest_path = current_dir+'/'+ dest_dir
    recreate_dir(dest_path) 

    source_path = current_dir+'/'+ source_dir
    files = [f for f in os.listdir(source_path) if os.path.isfile(
        source_path+'/'+f)]

    for f in files:
        parts = f.split('_')
        type = parts[0]
        if type=="M": continue
        area = parts[3]

        LANG = parts[4]
        reader_type=parts[2]
        file_type = parts[0]
        
        opp_id = parts[5]
        new_path = dest_path+"/"+area+"/"+opp_id+"/"+reader_type+"/"+file_type+"/"+LANG.replace('ENG','EN')
        create_dir(new_path)
        shutil.copyfile(source_path+"/"+f, new_path+'/'+f)
    


# Based on the list of files with activities and materials
# Create:
# - JSON with `content` object
# - JSON with `contentfile` for PDF file
# - JSON with `contentimage` for image
def generate_dababase_objects(source_dir):

    ready_path = current_dir+'/'+ source_dir
    files = [f for f in os.listdir(ready_path) if os.path.isfile(
        ready_path+'/'+f) and (f.endswith('.pdf'))]

    for f in files:
        parts = f.split('_')
        type = parts[0]

        if (type == 'A'):
            if (len(parts) != 8):
                print('Incorrect format"', f)
        if (type == 'M'):
            if (len(parts) != 7):
                print('Incorrect format"', f)


        language = parts[4]

        file_title = parts[-1]
        content_title = parts[-1].replace('.pdf', '')
        
        # Generate content _id
        identifier = '_'.join(parts[:-1])
        content_id = sha256(identifier.encode('utf-8')).hexdigest()[:24]

        # Generate an ObjectId using the hash bytes

        ############################################
        # content ##################################
        ############################################        
        content = copy.deepcopy(content_schema)
        content['_id'] = content_id
        content['title'] = content_title
        
        content['language'] = language.lower()
        content['pages'][0]['elements'][0]['name'] = identifier
        content['pages'][0]['elements'][0]['file'] = content_id
        # Otherwise - search engine will not return it
        # It's outdated approach will be changed 
        content['approvedContentSource'] = content_id
        content['identifier'] = identifier
        
        duplicate = next((c for c in contents if c['identifier'] == identifier), None)
        if (duplicate):
            print("# Duplicate for ", identifier,'[ name1=', duplicate['title'], ',  name2=', content['title'],']',sep='')
            continue
        else:
            contents.append(content)
        ############################################
        # content_file ##############################
        ############################################
        content_file = copy.deepcopy(content_file_schema)
        content_file['_id'] = content_id
        content_file['fileName'] = 'cognitive/'+f
        content_file['fileOriginalName'] = file_title
        content_files.append(content_file)

# Fucntion for counting files and displaing  message to the user
def count_files(files):
    en = len([f for f in files if f['language']=='en'])
    fr = len([f for f in files if f['language']=='fr'])
    pl = len([f for f in files if f['language']=='pl'])
    print(len(files), ',',en,',',fr, ',',pl, sep="")
    
# Update initial objects with areas of delepompents 
# Add materials and activities inside
# Display status on how many are missing
def update_cognitive_areas():
    
    materials = [c for c in contents if c['identifier'].split('_')[0]=='M']
    activities = [c for c in contents if c['identifier'].split('_')[0]=='A']
    
    print('\nMaterials: ', end='')
    count_files(materials)
    print('Activities: ', end='')
    count_files(activities)
    
    opportunities_types = ['sociological', 'psychological','development']
    for area in areas:
        
        
        print("\n#### Area", area['key'], '-', area['readerType'], area['ageGroup'], ',total', ',en', ',fr', ',pl')
        identifier = '_'.join(['M',str(area['ageGroup']),area['readerType'].upper(),area['key']])+"_"
        count={"total":0}
        for lang in ["EN","FR","PL"]:
            found_materials = find_materials(area['key'],area['readerType'].upper(),area['ageGroup'], lang)

            count[lang] = len(found_materials)
            count["total"] += count[lang]
            if (not found_materials): # IF no materials - find similar
                found_materials = find_similar_materials(area['key'],area['readerType'].upper(),area['ageGroup'], lang)
                found_materials = found_materials[:1]
                
            # SAVE MATERIALS IN AREA OBJECT
            area['materials'][lang] = found_materials
        print('{0: <26}'.format(identifier), count['total'],count['EN'],count['FR'],count['PL'],sep=",")

            
            
        
        for opp_index, opportunity in enumerate(area['opportunities']):
            # For now oppotunities in all types(soc/psych/dev) share the same activities
            opportunity_type = opportunities_types[int(opportunity['key'].split('_')[1])-1]
            number = opportunity['key'].split('_')[2]
            identifier = '_'.join(['A',str(area['ageGroup']),area['readerType'].upper(),area['key'], '[A-Z]{2}', number])+"_"
            
            
            # SAVE ACTIVITIES IN AREA OBJECT
            count={"total":0}
            for lang in ["EN","FR","PL"]:
                found_activities = find_activities(area['key'],area['readerType'].upper(),area['ageGroup'], lang, number)
                count[lang] = len(found_activities)
                count["total"] += count[lang]
                if not found_activities:
                    found_activities = find_similar_activities(area['key'],area['readerType'].upper(),area['ageGroup'], lang, number)
                    found_activities = found_activities[:1]
                #print(identifier.replace("[A-Z]{2}", lang), opportunity_type, len(found_activities))
                # Save
                area['opportunities'][opp_index]['activities'][lang] = found_activities
            if (opportunity_type=='sociological'):# Print only for sociological
                print('{0: <26}'.format(identifier), count['total'],count['EN'],count['FR'],count['PL'],sep=',')
# Find matching materials        
def find_materials(areaKey, readerType, ageGroup, lang):
        identifier = '_'.join(['M',str(ageGroup),readerType.upper(),areaKey, lang])
        materials = [c for c in contents if c['identifier'].split('_')[0]=='M']

        found = [m['_id'] for m in materials if identifier in m['identifier']]
        return sorted(found)
    
# Find matching activities
def find_activities(areaKey, readerType, ageGroup, lang, number):
        identifier = '_'.join(['A',str(ageGroup),readerType.upper(),areaKey, lang, number])+"_"
        activities = [c for c in contents if c['identifier'].split('_')[0]=='A']
        
        found = [a['_id'] for a in activities if identifier in a['identifier']]
        return sorted(found)


# Get list for finding similar materials/activities
def get_similar_age_group(ageGroup):
    if (str(ageGroup)=="12"): ageGroupList = ["12", "15", "18", "24"]
    if (str(ageGroup)=="15"): ageGroupList = ["15", "18", "24", "12"]
    if (str(ageGroup)=="18"): ageGroupList = ["18", "24", "15", "12"]
    if (str(ageGroup)=="24"): ageGroupList = ["24", "18", "15", "12"]
    return ageGroupList

def get_similar_reader_type(readerType):
    if (readerType.upper()=="STUDENT"): readerTypeList = ["STUDENT","EMPLOYEE","TEACHER","PARENT","LEADER"]
    if (readerType.upper()=="EMPLOYEE"): readerTypeList = ["EMPLOYEE","STUDENT","LEADER","PARENT","TEACHER"]
    if (readerType.upper()=="PARENT"): readerTypeList = ["PARENT","TEACHER","LEADER","STUDENT","EMPLOYEE"]
    if (readerType.upper()=="TEACHER"): readerTypeList = ["TEACHER","PARENT","LEADER","STUDENT","EMPLOYEE"]
    if (readerType.upper()=="LEADER"): readerTypeList = ["LEADER","PARENT","TEACHER","EMPLOYEE","STUDENT"]
    return readerTypeList
    
# For now not all materials are provided
# This function will find the best matching materials for other users
# This will allow fill the database unless we recive all the files                
def find_similar_materials(areaKey, readerType, ageGroup, lang):
    identifier = '_'.join(['M',str(ageGroup),readerType.upper(),areaKey])+"_"
    #print('-> Missing material for',lang, end='')
    found_materials=[]
    
    ageGroupList=get_similar_age_group(ageGroup)
    readerTypeList=get_similar_reader_type(readerType)
    
    for readerType in readerTypeList:
        for ageGroup in ageGroupList:
            found_materials = find_materials(areaKey, readerType, ageGroup, lang)
            if (found_materials):
                #print(' -> replacing ->', readerType, ageGroup)
                return found_materials
    return found_materials


# For now not all activities are provided
# This function will find the best matching activities for other users
# This will allow fill the database unless we recive all the files                
def find_similar_activities(areaKey, readerType, ageGroup, lang, number):
    identifier = '_'.join(['M',str(ageGroup),readerType.upper(),areaKey, lang, number])
    #print('-> Missing activity for',areaKey, ageGroup, readerType, lang, end='')
    found_activities=[]
    ageGroupList=get_similar_age_group(ageGroup)
    readerTypeList=get_similar_reader_type(readerType)
    for readerType in readerTypeList:
        for ageGroup in ageGroupList:
                for number in range(15):
                    number=str(number)
                    found_activities = find_activities(areaKey, readerType, ageGroup, lang, number)
                    if (found_activities):
                        #print(' -> replacing -> ', ageGroup, readerType, lang, number)
                        return found_activities
    #print("MISSING REPLACMENT FOR ", areaKey, readerType, ageGroup, lang, number)
    return found_activities


# Create image object and assign imageUrl for each area/opportunity
# Also if activity/material exists assign those images as covers
def assign_images():
    for area in areas:
        _area_key = area['key']
        _reader_type = area['readerType']
        _age_group = area['ageGroup']

        area_image_identifier = '_'.join(["M", _age_group, _reader_type.upper(), _area_key])+"_"
        area_image_id = sha256(area_image_identifier.encode('utf-8')).hexdigest()[:24]

        area_image_name = area['temporaryImageName']
        area_image_file_name = "cognitive/materials/"+area_image_name+'.png' 
        area_image_url = 'contents/images/'+area_image_id+'/download'
        area['imageUrl'] = area_image_url
        # Create content_image
        add_content_image(area_image_id, area_image_file_name)
        for content in contents:

            if area_image_identifier in content['identifier']:
                content['image'] = area_image_id
        
        #Create content image
        for opp_index, opportunity in enumerate(area['opportunities']):
            
            _type =  _number = opportunity['key'].split('_')[1]
            _number = opportunity['key'].split('_')[2]
            opp_image_identifier = '_'.join(["A", _age_group, _reader_type.upper(), _area_key, '[A-Z]{2}', _number])+"_"
            
            type_specific_identifier = opp_image_identifier+_type
            opp_image_id = sha256(type_specific_identifier.encode('utf-8')).hexdigest()[:24]
            opp_image_name = opportunity['temporaryImageName']
            opp_image_file_name = "cognitive/activities/"+opp_image_name+'.png' 
            opp_image_url = 'contents/images/'+opp_image_id+'/download'
            opportunity['imageUrl'] = opp_image_url
            # Create content_image
            add_content_image(opp_image_id, opp_image_file_name)
            for content in contents:
                if re.match(opp_image_identifier, content['identifier']):
                    if (_reader_type.upper()=='EMPLOYEE'):
                        print(opportunity['key'], '-----------', content['identifier'], opp_image_id)
                    content['image'] = opp_image_id

            
def save_database_objects():
    # Writing to file
    with open("cognitiveContents.tmp.json", "w") as file1:
        data = json.dumps(contents)
        file1.write("exports.cognitiveContents = "+data)
    with open("cognitiveContentFiles.tmp.json", "w") as file1:
        data = json.dumps(content_files)
        file1.write('exports.cognitiveContentFiles = '+data)    
    with open("cognitiveContentImages.tmp..json", "w") as file1:
        data = json.dumps(content_images)
        file1.write('exports.cognitiveContentImages = '+data)  
    # Writing to file
    with open("cognitiveAreas.tmp.json", "w") as file1:
        data = json.dumps(areas)
        file1.write("exports.cognitiveAreas = "+data)  
        

if __name__ == "__main__":
    #fix_names(0)
    #rename_files('ACITIVITIES AND MATERIALS', 'RENAMED')
    # flatten_directories('RENAMED',  'RENAMED_FLAT')
    # divide_by_nads('RENAMED_FLAT',  'NADS')
    # divide_by_opportunities('RENAMED_FLAT',  'OPPS')
    generate_dababase_objects('RENAMED_FLAT')
    update_cognitive_areas()
    assign_images()
    save_database_objects()