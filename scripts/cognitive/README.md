# How to update data


## Virual Coach

##### What should I download:

- All `MATRIX` files eg. `MATRIX ISSSOL EMPLOYEE 24 PL EN FR.xlsx`
- All `PDF files` with materials/activities
- All `images/covers` for materials/activities (from cloud)

##### What should I run:

- `python3 scripts/cognitive/processAreas.py > tmp.json`
- `python3 scripts/cognitive/processMaterialsAndActivities.py`

##### What should I do with the output:

- Copy content of `tmp.json` into `backend/app/utils/database/cognitiveAreas.js`
- Copy PDF files with materials/activities into `/mnt/data/<ENV>/backend/public/content/files/cognitive`
- Copy `images/covers` into `/mnt/data/local/backend/public/content/images/cognitive/`






## MySpace

##### What should I download:

- `NAD Profile Tips FAQ FR ENG PL  X_X_XX.xlsx`

##### What should I do:

Copy data from `NAD Profile Tips FAQ FR ENG PL` into:

- `scripts/cognitive/oldFormat/<LANG>/traits.json`
- `scripts/cognitive/oldFormat/<LANG>/profiles.json`
- `scripts/cognitive/oldFormat/<LANG>/tips.json`
- `scripts/cognitive/oldFormat/<LANG>/tips_biz.json`
- `scripts/cognitive/oldFormat/<LANG>/faq-questions.json`
- `scripts/cognitive/oldFormat/<LANG>/faq-answers.json`


Then run:

- `python3 scripts/cognitive/processTraitsForMySpace.py > tmp1.json`
- `python3 scripts/cognitive/processProfiles.py > tmp2.json`
- `python3 scripts/cognitive/processTips.py > tmp3.json`
- `python3 scripts/cognitive/processFaqs.py > tmp4.json`


##### What should I do with the output:

- Copy content of `tmp1.json` into `backend/app/utils/database/cognitiveTraitsForMySpace.js` 
- Copy content of `tmp2.json` into `backend/app/utils/database/cognitiveProfiles.js` 
- Copy content of `tmp3.json` into `backend/app/utils/database/cognitiveTips.js` 
- Copy content of `tmp4.json` into `backend/app/utils/database/cognitiveFaqs.js` 






## PDF report

##### What should I download:

- `ADDITIONAL TRAITS X_X_XX.xlsx`
- `PDF_REPORT_STATIC_TRANSLATIONS X_X_XX.xlsx`



##### What should I run:

- `python3 scripts/cognitive/processTraitsForReportAndTeamModule.py > tmp1.json` (at the bottom select pdf report)
- `python3  scripts/cognitive/processPDFReportStaticTranslations.py > tmp2.json`

##### What should I do with the output:

- Copy content of `tmp1.json` into `utils/database/cognitiveTraitsForPdfReport.js`
- Copy content of `tmp2.json` into `utils/cognitive.js`




## Sentinel/HRD/TeamModule

##### What should I download:

- `Descriptions for teammodule.xlsx`

##### What should I run:

- `python3 scripts/cognitive/processTraitsForReportAndTeamModule.py > tmp1.json` (at the bottom select team module)

##### What should I do with the output:

- Copy content of `tmp1.json` into `utils/database/cognitiveTraitsForTeamModule.js`



## Traits names/abbreviations:

##### What should I download:

- `TRAITS_NAMES_4_05_23.xlsx`

##### What should I do:

Copy content of this file into:

- `scripts/cognitive/traitsAbbreviations.json`
- `scripts/cognitive/traitsNames.json`

##### What should I do with the output:

Reprocess traits for MySpace/Sentinel/PDF report.