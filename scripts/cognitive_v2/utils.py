import os, shutil, json

BASE_DIR = './scripts/cognitive_v2'
INIT_DATABASE_PATH = "./services/backend/app/utils/database"
LANGS = ["FR", "EN", "PL"]
READER_TYPES = ['leader', 'team-leader', 'employee', 'student', 'teacher', 'class-teacher', 'parent']
READER_TYPES_DESCIPTIONS ={
    'student': "A 'student' type signifies that the following content is intended for kids who have completed the BrainCore Edu Test and are seeking information about themselves. For instance, when students access their MySpace or obtain their PDF report, they will encounter these names and descriptions. Equivalent of `employee` for HR.",
    'teacher': "A 'teacher' type signifies that the following content is intended for teachers who are seeking information about students who have completed the BrainCore Edu Test. For instance, when teachers access Sentinel->MyTeams->Results and selects a single user they will encounter these names and descriptions.  Equivalent of `leader` for HR.",
    'class-teacher': "A 'class-teacher' type signifies that the following content is intended for teachers who are seeking information about group of students who have completed the BrainCore Edu Test. For instance, when teacher access Sentinel->MyTeams->Results and selects group of students, they will encounter these names and descriptions. Equivalent of `team-leader` for HR.",
    'parent': "A 'parent' type signifies that the following content is intended for parents who are seeking information about their kids who have completed the BrainCore Edu Test. For instance, when parents downlad PDF report for their kid, they will encounter these names and descriptions.",
    'employee': "An `'employee' type signifies that the following content is intended for adult individuals who have completed the BrainCore Pro Test and are seeking information about themselves.For instance, when adults access their MySpace or obtains their PDF report, they will encounter these names and descriptions. Equivalent of `student` for EDU.", 
    'leader': "A 'leader' type signifies that the following content is intended for adults who are seeking information about single adult who have completed the BrainCore Pro Test. For instance, when managers access Sentinel->MyTeams->Results and selects single empoyee, they will encounter these names and descriptions. Equivalent of `teacher` for EDU.",
    'team-leader': "A 'team-leader' type signifies that the following content is intended for adult managers/leaders who are seeking information about group of adults who have completed the BrainCore Pro Test. For instance, when managers access Sentinel->MyTeams->Results and selects group of empoyees, they will encounter these names and descriptions.  Equivalent of `class-teacher` for EDU.",
}
AREAS = ['self-activation', 'self-confidence', 'communication-strategy', 'cooperation', 'regularity']
NAD_NAMES = ["self-activation", 
             "self-confidence", 
             "communication-strategy", 
             "cooperation", 
             "regularity",
             "strong-and-weak-points-for-self-activation", 
             "strong-and-weak-points-for-self-confidence", 
             "strong-and-weak-points-for-communication-strategy", 
             "strong-and-weak-points-for-cooperation", 
             "strong-and-weak-points-for-regularity"
             ]
OPPORTUNITY_TYPES = ['sociological', 'psychological', 'development']

TRAITS_GROUP_4C = ["collaboration", "communication", "creativity", "critical-thinking"]
TRAITS_GROUP_BUSSINESS = [
    "assertiveness", "leadership", "interpersonal-relation",#Social Success Factors
    "mediation-and-influence", "respect", "empathy", # Emotional Intelligence in relations with others
    "emotional-distance", "stress-management", "self-control", "sense-of-mastery", "self-esteem", "risk-taking",#Self-management
    "intrapersonal-intelligence", "self-development", "achievements"#Personal Success Factors
]
TRAITS_GROUP_SCORES_19 = ["self-motivation", "self-knowledge",
                          "self-control", "adaptability",
                          "intuition", "self-esteem",
                          "stress-management", "sense-of-mastery",
                          "risk-taking", "assertiveness",
                          "extraversion", "ambition",
                          "emotional-distance", "respect",
                          "mediation-and-influence", "empathy",
                          "need-for-independence", "motivation",
                          "methodology-and-organization"]

TRAITS_GROUP_SCORES_HR = [
    "resilience",
    "optimism",
    "persuasion",
    "personal-engagement",
    "need-for-action"
]

TIP_SCHEMA = {
    'key': '',
    'ageGroup': '',
    'readerType': '',
    'introduction': {'PL': '', 'EN': '', 'FR': ''},
    'text': {'PL': '', 'EN': '', 'FR': ''},
    'reasoning': {'PL': '', 'EN': '', 'FR': ''},
}


TRAIT_SCHEMA = {
    'key': '',
    'ageGroup': '',
    'readerType': '',
    'abbreviation': {'PL': '', 'EN': '', 'FR': ''},
    'shortName': {'PL': '', 'EN': '', 'FR': ''},
    'shortDescription': {'PL': '', 'EN': '', 'FR': ''},
    'mainDefinition': {'PL': '', 'EN': '', 'FR': ''},
    'lowestDefinition': {'PL': '', 'EN': '', 'FR': ''},
    'highestDefinition': {'PL': '', 'EN': '', 'FR': ''},
    'descriptions': {
        'level_1': {'PL': [], 'EN': [], 'FR': []},
        'level_2': {'PL': [], 'EN': [], 'FR': []},
        'level_3': {'PL': [], 'EN': [], 'FR': []},
        'level_4': {'PL': [], 'EN': [], 'FR': []},
        'level_5': {'PL': [], 'EN': [], 'FR': []}
    },
    'actions': {'level_1': {'PL': [], 'EN': [], 'FR': []},
                'level_2': {'PL': [], 'EN': [], 'FR': []},
                'level_3': {'PL': [], 'EN': [], 'FR': []},
                'level_4': {'PL': [], 'EN': [], 'FR': []},
                'level_5': {'PL': [], 'EN': [], 'FR': []},
                'lowest': {'PL': [], 'EN': [], 'FR': []},
                'highest': {'PL': [], 'EN': [], 'FR': []}
                },
    'neurobiologicalEffects': {'PL': [], 'EN': [], 'FR': []}

}

# Remove and create a directory
def recreate_dir(path):
    if os.path.exists(path) and os.path.isdir(path):
        shutil.rmtree(path)
    os.makedirs(path)
    
# Remove and create a directory
def create_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

def load_json_from_initial_database_file(name):
    with open('./services/backend/app/utils/database/'+name) as f:
        json_part = f.read().split('=', 1)[1]
        return json.loads(json_part)