// generated with /scripts/generateTest.py, then inserted in to mongo and copied
const db = require("../../models");

const countriesEN = require('../world-countries/countries/en/countries.json')
const countriesFR = require('../world-countries/countries/fr/countries.json')
const countriesPL = require('../world-countries/countries/pl/countries.json')

exports.createBraincorePedagogyTests = async () => { // Action for geting result for content
    const tests = [
        {// English
            _id: '60db1aef2b4c80000732fdf5',
            image: '111111111111111111111111',
            language: 'en',
            showTitle: true,
            durationTime: 2700,
            approvedByLibrarian: true,
            allowMultipleAttempts: true,
            cocreators: [],
            contentType: 'TEST',
            description: "Increase your brain capacity with BrainCore and achieve your goals faster and easier. \n\nThe BrainCore test is a diagnostic tool created by our experienced team of scientists and psychologists, and inspired by the latest discoveries in the field of neuroscience and cognitive pedagogy. \n\nThanks to this knowledge, the Neuro Activated Diagnostic® system was created, which is able to visualise cognitive functions unique to everyone. This information will be described in detail in the report generated after completion of the test. \n\nOn top of this, the users will also learn other personalised data such as their strengths & weaknesses, emotional indicators and psychometric dimensions.",
            groups: [],
            pages: [
                {
                    elements: [
                        {
                            type: 'expression',
                            name: '2606',
                            title: 'You will find below several statements (affirmative sentences) relating to the different features and skills of students. We ask you to check the answer that best fits your beliefs, by choosing your option on the rating scale that ranges from 1 (definitely disagree) to 6 (I definitely agree).<br><br><b>1 - I strongly disagree<br>2 - I do not agree<br>3 - I rather disagree<br>4 - I rather agree<br>5 - I agree<br>6 - I definitely agree</b><br><br>There are no good or bad answers here. What matters are the answers that express your opinion. <br>Before you respond to questions, please provide basic information about yourself. The questionnaire below is entirely anonymous and we ask you only to provide the general socio-demographic data in order to facilitate better analysis of the results obtained.'
                        },
                        { 
                            type: "dropdown", 
                            name: "100", 
                            title: "Select the country", 
                            isRequired: true, 
                            choices: countriesEN.map(c=>{return {text: c.name, value: c.alpha2.toUpperCase()}})
                        },
                        {
                            type: 'radiogroup',
                            name: '2607',
                            title: 'Gender',
                            isRequired: 1,
                            choices: [
                                {
                                    text: 'Female',
                                    value: '1'
                                },
                                {
                                    text: 'Male',
                                    value: '2'
                                }
                            ]
                        },
                        {
                            type: 'dropdown',
                            name: '2608',
                            title: 'Age ',
                            isRequired: 1,
                            choices: [
                                {
                                    text: '< 12',
                                    value: '11'
                                },
                                {
                                    text: '12',
                                    value: '12'
                                },
                                {
                                    text: '13',
                                    value: '13'
                                },
                                {
                                    text: '14',
                                    value: '14'
                                },
                                {
                                    text: '15',
                                    value: '15'
                                },
                                {
                                    text: '16',
                                    value: '16'
                                },
                                {
                                    text: '17',
                                    value: '17'
                                },
                                {
                                    text: '18',
                                    value: '18'
                                },
                                {
                                    text: '19',
                                    value: '19'
                                },
                                {
                                    text: '20',
                                    value: '20'
                                },
                                {
                                    text: '21',
                                    value: '21'
                                },
                                {
                                    text: '22',
                                    value: '22'
                                },
                                {
                                    text: '23',
                                    value: '23'
                                },
                                {
                                    text: '24',
                                    value: '24'
                                },
                                {
                                    text: 'above 24',
                                    value: '25'
                                }
                            ]
                        },
                        {
                            type: 'radiogroup',
                            name: '2609',
                            title: 'Education type (school)',
                            isRequired: 1,
                            choices: [
                                {
                                    text: 'Elementary school',
                                    value: '1'
                                },
                                {
                                    text: 'Basic vocational school',
                                    value: '2'
                                },
                                {
                                    text: 'High school',
                                    value: '3'
                                },
                                {
                                    text: 'Technical secondary school',
                                    value: '4'
                                },
                                {
                                    text: 'Colleges and university',
                                    value: '5'
                                }
                            ]
                        },
                        {
                            type: 'radiogroup',
                            name: '2610',
                            title: 'Place of residence (home)',
                            isRequired: 1,
                            choices: [
                                {
                                    text: 'Village',
                                    value: '1'
                                },
                                {
                                    text: 'City',
                                    value: '2'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2714',
                            title: 'I am very committed to my tasks.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2640',
                            title: 'When I feel bad I understand why.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2683',
                            title: 'I easily lose my temper.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '6'
                                },
                                {
                                    text: 'I disagree',
                                    value: '5'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '4'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '3'
                                },
                                {
                                    text: 'I agree',
                                    value: '2'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2614',
                            title: 'While studying, I can quickly change subjects from the humanities to physical sciences or mathematics.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2652',
                            title: 'I follow intuition.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2672',
                            title: 'I think well of myself.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2643',
                            title: 'I am unable to function effectively when I am stressed.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '6'
                                },
                                {
                                    text: 'I disagree',
                                    value: '5'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '4'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '3'
                                },
                                {
                                    text: 'I agree',
                                    value: '2'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2716',
                            title: 'I have the competences to handle any situation.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2664',
                            title: 'I doubt if I can succeed.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '6'
                                },
                                {
                                    text: 'I disagree',
                                    value: '5'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '4'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '3'
                                },
                                {
                                    text: 'I agree',
                                    value: '2'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2693',
                            title: 'I express what I think directly and clearly.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2665',
                            title: 'I like working in a group.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2625',
                            title: 'I am very ambitious.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2618',
                            title: 'I can keep calm in stressful situations.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2677',
                            title: 'While justifying my opinions, I also respect the opinions of others.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2646',
                            title: 'When people have different opinions, I propose a mutual solution.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2695',
                            title: 'I cannot understand what another person feels.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '6'
                                },
                                {
                                    text: 'I disagree',
                                    value: '5'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '4'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '3'
                                },
                                {
                                    text: 'I agree',
                                    value: '2'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2628',
                            title: 'I like working alone.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2680',
                            title: 'When I study a subject which is important for me, I analyze it thoroughly.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2712',
                            title: 'I plan my time and schedule my tasks well.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2697',
                            title: 'I finish my tasks even if they are difficult.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2612',
                            title: 'I know my feelings and emotions well.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2651',
                            title: 'Controlling my emotions is difficult for me',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '6'
                                },
                                {
                                    text: 'I disagree',
                                    value: '5'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '4'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '3'
                                },
                                {
                                    text: 'I agree',
                                    value: '2'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2633',
                            title: 'I am as effective at studying difficult subjects (mathematics, physics) as in humanities.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2699',
                            title: 'I trust my intuition.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2663',
                            title: 'I like myself.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2623',
                            title: 'I can deal with stress.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2710',
                            title: 'I do well, even when I do not have the tools to do my job.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2700',
                            title: 'I avoid new challenges because I am afraid of failure.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '6'
                                },
                                {
                                    text: 'I disagree',
                                    value: '5'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '4'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '3'
                                },
                                {
                                    text: 'I agree',
                                    value: '2'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2644',
                            title: 'When something bothers me, I can speak about it clearly.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2686',
                            title: 'I like to work with other people.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2694',
                            title: 'I think of myself as an ambitious person',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2626',
                            title: 'I can control my emotions while others lose control over them.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2687',
                            title: 'When I want to convince someone to my ideas, I try to respect their opinion.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2636',
                            title: 'In conflict situations, I pay attention to the fact that both sides are satisfied with the solution.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2658',
                            title: 'I notice when someone around me does not feel well.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2637',
                            title: 'Accomplishing a project by myself is not a problem for me.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2638',
                            title: 'If something is important to me in the subjects I study, I commit myself to it.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2690',
                            title: 'I know how to plan my work.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2692',
                            title: 'Despite the difficulties, I strive to achieve my goals.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2660',
                            title: 'I understand my emotions.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2613',
                            title: 'I can control myself when I am angry.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2622',
                            title: 'While studying, I am good at learning different subjects.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2662',
                            title: 'My intuition does not disappoint me.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2708',
                            title: 'I accept myself as I am.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2685',
                            title: 'Stress motivates me to work more effectively.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2701',
                            title: 'I am confident that I can deal with any situation.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2653',
                            title: 'I feel that I am worse than most people.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '6'
                                },
                                {
                                    text: 'I disagree',
                                    value: '5'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '4'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '3'
                                },
                                {
                                    text: 'I agree',
                                    value: '2'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2654',
                            title: 'When I do not want something or disagree with something, I speak about it.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2617',
                            title: 'I prefer to work with others than to work individually.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2703',
                            title: 'I constantly try to improve myself.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2645',
                            title: 'I do well in unpredictable situations.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2676',
                            title: 'I consider what others may feel when I express my opinions.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2657',
                            title: 'While confronting opinions, I try to find common ground.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2704',
                            title: 'I notice when someone needs help around me.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2705',
                            title: 'I am more efficient when I work alone.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2689',
                            title: 'When I learn something that is important to me, I am totally absorbed in it.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2620',
                            title: 'I make a plan before I start learning.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2670',
                            title: 'I accomplish my goals with enthusiasm.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2650',
                            title: 'I know why I behaved in one way and not in the other.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2632',
                            title: 'I control my behavior, even if I am upset.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2615',
                            title: 'People say that I have a good intuition.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2684',
                            title: 'I am proud of myself.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2616',
                            title: 'I am effective in stressful situations.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2709',
                            title: 'I am dealing with problems well.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2624',
                            title: 'I often think I will not be able to handle something.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '6'
                                },
                                {
                                    text: 'I disagree',
                                    value: '5'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '4'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '3'
                                },
                                {
                                    text: 'I agree',
                                    value: '2'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2673',
                            title: 'I express my expectations and opinions clearly.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2674',
                            title: 'I feel well surrounded by many people.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2634',
                            title: 'I want to achieve more and more.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2635',
                            title: 'Unexpected situations do not make me lose control.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2655',
                            title: 'I respect what others say and think.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2678',
                            title: 'I know how to resolve conflicts in a way that appeals to each side.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2688',
                            title: 'When I talk to someone, I can imagine how this person feels.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2718',
                            title: 'I do not need help from others at school.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2629',
                            title: 'People say that I am passionate about new topics.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2630',
                            title: 'I take unexpected events into account when I plan my working time.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2707',
                            title: 'I can achieve my goals.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2698',
                            title: 'I know the source of my fears and worries.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2671',
                            title: 'Fear paralyzes me.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '6'
                                },
                                {
                                    text: 'I disagree',
                                    value: '5'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '4'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '3'
                                },
                                {
                                    text: 'I agree',
                                    value: '2'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2641',
                            title: 'All I need to make the right decisions is a quick and intuitive analysis.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2642',
                            title: 'I feel good about myself.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2715',
                            title: 'I know how to deal with criticism.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2702',
                            title: 'I express my opinions and expectations, even if I can experience resistance from others.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2711',
                            title: 'I like talking to people.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2666',
                            title: 'When I work, I set the bar high.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2667',
                            title: 'Even when I feel that something is not pleasant for me, I can master emotions and think logically.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2656',
                            title: 'While convincing others, I respect their opinions.<br>',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2627',
                            title: 'In the case of divergent opinions, I try to find a common ground.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2717',
                            title: 'Sometimes, when I talk to someone, I can feel the same emotions as the person I talk to.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2619',
                            title: 'I can work without the support of others.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2648',
                            title: 'When I get involved in something, it is important to me that it is done well.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2681',
                            title: 'I make backup plans in case something gets out of control.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2661',
                            title: 'In difficult times I manage to overcome.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2675',
                            title: 'I am ready to sacrifice many things for success.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2668',
                            title: 'I am able to put myself in the place of another person.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2647',
                            title: 'I prefer tasks on which I can decide about everything.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2679',
                            title: 'I am attracted to novelty.',
                            choices: [
                                {
                                    text: 'I strongly disagree',
                                    value: '1'
                                },
                                {
                                    text: 'I disagree',
                                    value: '2'
                                },
                                {
                                    text: 'I rather disagree',
                                    value: '3'
                                },
                                {
                                    text: 'I rather agree',
                                    value: '4'
                                },
                                {
                                    text: 'I agree',
                                    value: '5'
                                },
                                {
                                    text: 'I strongly agree',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                }
            ],
            sendToLibrary: true,
            showPrevButton: true,
            showProgressBar: 'bottom',
            libraryStatus: 'ACCEPTED',
            title: 'BrainCore Edu',
            goNextPageAutomatic: false,
            showQuestionNumbers: 'off'
        },
        {//French
            _id: '60db1d322b4c80000732fdf7',
            image: '111111111111111111111111',
            language: 'fr',
            showTitle: true,
            durationTime: 2700,
            approvedByLibrarian: true,
            allowMultipleAttempts: true,
            cocreators: [],
            contentType: 'TEST',
            description: "Augmentez vos capacités cérébrales avec BrainCore et atteignez vos objectifs plus rapidement et plus facilement. Le test BrainCore est un outil de diagnostic créé par notre équipe expérimentée de scientifiques et de psychologues, et inspiré des dernières découvertes dans le domaine des neurosciences et de la pédagogie cognitive. Grâce à ces connaissances, le système Neuro Activated Diagnostic® a été créé et permet de visualiser les fonctions cognitives propres à chacun. Ces informations seront décrites en détail dans le rapport généré à l'issue du test. En outre, les utilisateurs apprendront également d'autres données personnalisées telles que leurs forces et faiblesses, leurs indicateurs émotionnels et leurs dimensions psychométriques.",
            groups: [],
            pages: [
                {
                    elements: [
                        {
                            type: 'expression',
                            name: '2606',
                            title: 'Vous allez trouver ci-dessous plusieurs déclarations (phrases affirmatives) relatives aux différents traits caractéristiques et aux compétences des élèves. Nous vous demandons de cocher la réponse qui correspond le mieux à vos convictions, en choisissant votre option sur l’échelle de notation qui va de 1 (je ne suis pas du tout d’accord) à 6 (je suis tout à fait d’accord).<br><br><b>1 - je ne suis pas du tout d’accord<br>2 - je ne suis pas d’accord<br>3 – je ne suis pas vraiment d’accord<br>4 – je suis plutôt d’accord<br>5 – je suis d’accord<br>6 – je suis entièrement d’accord</b><br><br>Il n\'y a pas ici de bonnes ou de mauvaises réponses. Ce qui compte, ce sont les réponses qui expriment votre opinion. <br>Avant de présenter votre opinion en réponse aux déclarations suivantes, merci de nous donner quelques informations personnelles. Le questionnaire ci-dessous est entièrement anonyme et nous vous demandons uniquement de fournir les données sociodémographiques générales afin de nous faciliter une meilleure analyse des résultats obtenus. <br><br>Merci de cocher ou de sélectionner la réponse appropriée.'
                        },
                        { 
                            type: "dropdown", 
                            name: "100", 
                            title: "Sélectionnez le pays", 
                            isRequired: true, 
                            choices: countriesFR.map(c=>{return {text: c.name, value: c.alpha2.toUpperCase()}})
                        },
                        {
                            type: 'radiogroup',
                            name: '2607',
                            title: 'Sexe',
                            isRequired: 1,
                            choices: [
                                {
                                    text: 'Femme',
                                    value: '1'
                                },
                                {
                                    text: 'Homme',
                                    value: '2'
                                }
                            ]
                        },
                        {
                            type: 'dropdown',
                            name: '2608',
                            title: 'Age',
                            isRequired: 1,
                            choices: [
                                {
                                    text: '< 12',
                                    value: '11'
                                },
                                {
                                    text: '12',
                                    value: '12'
                                },
                                {
                                    text: '13',
                                    value: '13'
                                },
                                {
                                    text: '14',
                                    value: '14'
                                },
                                {
                                    text: '15',
                                    value: '15'
                                },
                                {
                                    text: '16',
                                    value: '16'
                                },
                                {
                                    text: '17',
                                    value: '17'
                                },
                                {
                                    text: '18',
                                    value: '18'
                                },
                                {
                                    text: '19',
                                    value: '19'
                                },
                                {
                                    text: '20',
                                    value: '20'
                                },
                                {
                                    text: '21',
                                    value: '21'
                                },
                                {
                                    text: '22',
                                    value: '22'
                                },
                                {
                                    text: '23',
                                    value: '23'
                                },
                                {
                                    text: '24',
                                    value: '24'
                                },
                                {
                                    text: 'above 24',
                                    value: '25'
                                }
                            ]
                        },
                        {
                            type: 'radiogroup',
                            name: '2609',
                            title: 'Type d’enseignement (école)',
                            isRequired: 1,
                            choices: [
                                {
                                    text: 'Ecole primaire\n',
                                    value: '1'
                                },
                                {
                                    text: 'Collège d\'enseignement technique\n',
                                    value: '2'
                                },
                                {
                                    text: ' Lycée d\'enseignement général',
                                    value: '3'
                                },
                                {
                                    text: 'Lycée d\'enseignement technique',
                                    value: '4'
                                },
                                {
                                    text: 'Enseignement supérieur et universités',
                                    value: '5'
                                }
                            ]
                        },
                        {
                            type: 'radiogroup',
                            name: '2610',
                            title: 'Lieu de résidence (domicile)',
                            isRequired: 1,
                            choices: [
                                {
                                    text: 'Campagne',
                                    value: '1'
                                },
                                {
                                    text: 'Ville',
                                    value: '2'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2714',
                            title: 'Je suis très impliqué dans l\'exécution de mes tâches.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2640',
                            title: 'Quand je me sens mal je comprends pourquoi.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2683',
                            title: 'Il est facile de me faire perdre mon calme.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '6'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2614',
                            title: 'Quand j’apprends, je peux passer rapidement des sciences humaines aux sciences physiques ou aux mathématiques.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2652',
                            title: 'Je suis mon intuition.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2672',
                            title: 'Je pense du bien de moi-même.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2643',
                            title: 'Quand je suis stressé, je ne suis pas en mesure de fonctionner efficacement.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '6'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2716',
                            title: 'Mes compétences me permettent de faire face à chaque situation. ',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2664',
                            title: 'Je doute que je sois capable de réussir.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '6'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2693',
                            title: 'J’exprime de façon directe et claire ce que je pense.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2665',
                            title: 'J’aime bien travailler en groupe.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2625',
                            title: 'Je suis très ambitieux.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2618',
                            title: 'Je sais garder mon calme dans les situations stressantes.  ',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2677',
                            title: 'En justifiant mes opinions je respecte aussi les avis des autres.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2646',
                            title: 'Lorsque les avis divergent, je suggère une solution commune. ',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2695',
                            title: 'J’ai du mal à comprendre ce que ressent une autre personne.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '6'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2628',
                            title: 'J’aime les tâches solitaires.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2680',
                            title: 'Quand j\'apprends une matière importante pour moi, j’analyse le sujet en profondeur.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2712',
                            title: 'Je planifie bien mon temps et ce que je dois faire',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2697',
                            title: 'Je finalise mes tâches même si celles-ci sont difficiles.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2612',
                            title: 'Je comprends bien mes sentiments et mes émotions.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2651',
                            title: 'Il est difficile pour moi de contrôler mes émotions.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '6'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2633',
                            title: 'Je suis tout aussi efficace dans l\'apprentissage des sciences dures (mathématique, science physiques) et des sciences humaines',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2699',
                            title: 'Je fais confiance à mon intuition.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2663',
                            title: 'Je m’aime bien.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2623',
                            title: 'Je sais gérer mon stress.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2710',
                            title: 'Je me débrouille bien même si je ne dispose pas d’outils pour mon travail.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2700',
                            title: 'J\'évite les nouveaux défis car j’ai peur de l\'échec.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '6'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2644',
                            title: 'Quand quelque chose me dérange je peux le dire clairement.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2686',
                            title: 'J’aime bien coopérer avec d’autres gens.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2694',
                            title: 'J’estime que je suis une personne ambitieuse.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2626',
                            title: 'Je sais contrôler mes émotions lorsque les autres perdent le contrôle.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2687',
                            title: 'Quand je souhaite convertir quelqu’un à mes idées j’essaie de respecter son opinion.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2636',
                            title: 'Dans les situations conflictuelles je fais attention à ce que les deux parties soient satisfaites de la solution.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2658',
                            title: 'Je remarque quand une personne de mon entourage ne se sent pas bien.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2637',
                            title: 'La réalisation solitaire des projets ne me pose pas de problème.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2638',
                            title: 'Si quelque chose est important pour moi dans le contenu enseigné, je m’y consacre intensément.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2690',
                            title: 'Je sais planifier mon travail.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2692',
                            title: 'Malgré les difficultés, je poursuis mes objectifs.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2660',
                            title: 'Je suis capable de comprendre mes émotions.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2613',
                            title: 'Quand je suis en colère je parviens à me contrôler.  ',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2622',
                            title: 'Quand j’apprends, je me débrouille bien avec une grande diversité de matières.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2662',
                            title: 'Mon intuition ne me trompe pas.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2708',
                            title: 'Je m‘accepte comme je suis. ',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2685',
                            title: 'Le stress me motive pour agir plus efficacement.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2701',
                            title: 'Je suis sûr de pouvoir m’en sortir à chaque situation. ',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2653',
                            title: 'Je me sens pire que la plupart des gens.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '6'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2654',
                            title: 'Quand je ne veux pas de quelque chose ou que je ne suis pas d’accord, je m’exprime.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2617',
                            title: 'Je préfère travailler en compagnie d’autres personnes que tout seul.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2703',
                            title: 'Je cherche à progresser constamment.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2645',
                            title: 'Je me débrouille bien avec les situations imprévues',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2676',
                            title: 'Quand j’exprime mes opinions je prends en compte ce que d’autres peuvent ressentir.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2657',
                            title: 'Lors d’une situation de confrontation, j’essaie d\'établir une position satisfaisante pour les deux parties.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2704',
                            title: 'Je suis capable de remarquer que quelqu’un de mon entourage a besoin d’aide.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2705',
                            title: 'En travaillant tout seul je suis plus efficace.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2689',
                            title: 'Quand j\'apprends quelque chose qui compte pour moi, je suis complètement absorbé.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2620',
                            title: 'Je planifie mes devoirs avant de commencer à étudier.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2670',
                            title: 'Je remplis mes objectifs avec enthousiasme.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2650',
                            title: 'Je sais pourquoi je me suis comporté d’une certaine façon.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2632',
                            title: 'Même si je suis énervé, je contrôle mon comportement.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2615',
                            title: 'Les gens disent que j’ai une bonne intuition.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2684',
                            title: 'Je suis fier de moi-même.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2616',
                            title: 'Je suis efficace dans les situations stressantes.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2709',
                            title: 'Je me débrouille bien avec les problèmes.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2624',
                            title: 'Souvent je pense que je ne vais pas m’en sortir.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '6'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2673',
                            title: 'J’exprime clairement mes attentes et mes opinions.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2674',
                            title: 'Je me sens bien en compagnie de nombreuses personnes.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2634',
                            title: 'Je veux obtenir toujours plus. ',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2635',
                            title: 'Les situations imprévues ne me font pas perdre le contrôle.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2655',
                            title: 'Je respecte ce que disent et pensent les autres.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2678',
                            title: 'Je sais résoudre les conflits d\'une manière qui plaît à chaque partie.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2688',
                            title: 'Quand je discute avec quelqu’un, je peux imaginer ce que ressent cette personne.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2718',
                            title: 'A l’école je n’ai pas besoins de l’aide des autres.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2629',
                            title: 'Les gens disent que je suis passionné par le nouveaux sujets.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2630',
                            title: 'Quand je planifie mon temps de travail je prends en compte les imprévus.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2707',
                            title: 'Je suis capable d’atteindre mes objectifs.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2698',
                            title: 'Je connais la source de mes craintes et de mes préoccupations.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2671',
                            title: 'La peur me paralyse.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '6'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2641',
                            title: 'Pour prendre de bonnes décisions je n’ai besoin que d’une analyse rapide et intuitive.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2642',
                            title: 'Je me sens bien avec moi-même.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2715',
                            title: 'Je sais comment gérer la critique.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2702',
                            title: 'J’exprime mes opinions et mes attentes, même si je peux rencontrer une opposition des autres. ',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2711',
                            title: 'J’aime bien parler avec les gens.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2666',
                            title: 'Quand je travaille, je mets la barre haute.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2667',
                            title: 'Même si je sens que quelque chose n’est pas agréable pour moi je sais contrôler mes émotions et penser de façon logique.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2656',
                            title: 'Quand je convaincs les autre je respecte leurs opinions.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2627',
                            title: 'En cas d’avis divergents j’essaie de trouver un compromis.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2717',
                            title: 'Parfois, quand je parle avec quelqu’un, je peux ressentir les mêmes émotions que mon interlocuteur.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2619',
                            title: 'Je sais travailler sans le support des autres.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2648',
                            title: 'Quand je me suis engagé dans quelque chose, c’est important pour moi que ça soit bien fait.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2681',
                            title: 'Je fais des plans d\'urgence au cas où quelque chose deviendrait incontrôlable.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2661',
                            title: 'Dans les moments difficiles, je parviens à me contrôler.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2675',
                            title: 'Pour atteindre le succès je suis prêt à sacrifier beaucoup.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2668',
                            title: 'Je suis capable de me mettre à la place d’une autre personne.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2647',
                            title: 'Je préfère les tâches pour lesquelles je peux décider de tout.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2679',
                            title: 'J’aime quand il y a beaucoup de nouveautés.',
                            choices: [
                                {
                                    text: 'Je ne suis pas du tout d’accord',
                                    value: '1'
                                },
                                {
                                    text: 'Je ne suis pas d\'accord',
                                    value: '2'
                                },
                                {
                                    text: 'Je ne suis pas vraiement d’accord',
                                    value: '3'
                                },
                                {
                                    text: 'Je suis plutôt d\'accord',
                                    value: '4'
                                },
                                {
                                    text: 'Je suis d\'accord',
                                    value: '5'
                                },
                                {
                                    text: 'Je suis entièrement d’accord',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                }
            ],
            sendToLibrary: true,
            showPrevButton: true,
            showProgressBar: 'bottom',
            libraryStatus: 'ACCEPTED',
            title: 'BrainCore Edu',
            goNextPageAutomatic: false,
            showQuestionNumbers: 'off'
        },
        // POLISH
        {
            _id: '60db1dc42b4c80000732fdf9',
            image: '111111111111111111111111',
            language: 'pl',
            showTitle: true,
            durationTime: 2700,
            approvedByLibrarian: true,
            allowMultipleAttempts: true,
            cocreators: [],
            contentType: 'TEST',
            description: "Rozwijaj możliwości swojego mózgu dzięki BrainCore i osiągaj swoje cele szybciej i łatwiej. Test BrainCore jest narzędziem diagnostycznym, stworzonym przez nasz doświadczony zespół naukowców i psychologów, inspirowany przez najnowsze odkrycia z dziedzin neuronauki i pedagogiki poznawczej. Dzięki tej wiedzy stworzyilśmy system Neuro Activated Diagnostic®, który umożliwia wizualizację poznawczych funkcji każdemu użytkownikowi. Te informacje zostaną opisane w szczegółowym raporcie stworzonym po wykonaniu testu. Co ważne, użytkownicy otrzymają spersonalizowane dane, takie jak: silne i słabe strony, wskaźniki emocjonalnych właściwości oraz inne psychometryczne wymiary.",
            groups: [],
            pages: [
                {
                    elements: [
                        {
                            type: 'expression',
                            name: '2606',
                            title: 'Poniżej znajduje się szereg twierdzeń odnoszących się do różnych cech i umiejętności, oraz sposobu przyswajania wiedzy. Przy każdym z nich prosimy o zaznaczenie na skali od 1 (zdecydowanie nie zgadzam się) do 6 (zdecydowanie zgadzam się) odpowiedzi, która najlepiej wyraża Twoje przekonania. <br><br><b>1 – zdecydowanie nie zgadzam się<br>2 – nie zgadzam się<br>3 – raczej nie zgadzam się<br>4 – raczej zgadzam się<br>5 – zgadzam się<br>6 – zdecydowanie zgadzam się</b><br><br>Nie ma tu dobrych, ani złych odpowiedzi. Ważne są tylko te, które wyrażają Twoją opinię na Twój temat. Nikomu Twoich odpowiedzi nie udostępnimy, rezultaty zostaną przekazane tylko Tobie, lub osobie, która poprosiła Cię o wypełnienie testu.<br>Zanim przystąpisz do odpowiedzi na poszczególne twierdzenia, prosimy o udzielenie podstawowych informacji o sobie.'
                        },
                        { 
                            type: "dropdown", 
                            name: "100", 
                            title: "Wybierz kraj", 
                            isRequired: true, 
                            choices: countriesPL.map(c=>{return {text: c.name, value: c.alpha2.toUpperCase()}})
                        },
                        {
                            type: 'radiogroup',
                            name: '2607',
                            title: 'Płeć',
                            isRequired: 1,
                            choices: [
                                {
                                    text: 'Kobieta',
                                    value: '1'
                                },
                                {
                                    text: 'Mężczyzna',
                                    value: '2'
                                }
                            ]
                        },
                        {
                            type: 'dropdown',
                            name: '2608',
                            title: 'Wiek',
                            isRequired: 1,
                            choices: [
                                {
                                    text: '< 12',
                                    value: '11'
                                },
                                {
                                    text: 'below 12',
                                    value: '12'
                                },
                                {
                                    text: '12',
                                    value: '13'
                                },
                                {
                                    text: '13',
                                    value: '14'
                                },
                                {
                                    text: '14',
                                    value: '15'
                                },
                                {
                                    text: '15',
                                    value: '16'
                                },
                                {
                                    text: '16',
                                    value: '17'
                                },
                                {
                                    text: '17',
                                    value: '18'
                                },
                                {
                                    text: '18',
                                    value: '19'
                                },
                                {
                                    text: '19',
                                    value: '20'
                                },
                                {
                                    text: '20',
                                    value: '21'
                                },
                                {
                                    text: '21',
                                    value: '22'
                                },
                                {
                                    text: '22',
                                    value: '23'
                                },
                                {
                                    text: '23',
                                    value: '24'
                                },
                                {
                                    text: 'above 24',
                                    value: '25'
                                }
                            ]
                        },
                        {
                            type: 'radiogroup',
                            name: '2609',
                            title: 'Typ szkoły',
                            isRequired: 1,
                            choices: [
                                {
                                    text: 'Szkoła podstawowa',
                                    value: '1'
                                },
                                {
                                    text: 'Zasadnicza szkoła zawodowa',
                                    value: '2'
                                },
                                {
                                    text: 'Liceum ogólnokształcące',
                                    value: '3'
                                },
                                {
                                    text: 'Technikum',
                                    value: '4'
                                },
                                {
                                    text: 'Szkoły wyższe i uniwersytety',
                                    value: '5'
                                }
                            ]
                        },
                        {
                            type: 'radiogroup',
                            name: '2610',
                            title: 'Miejsce zamieszkania',
                            isRequired: 1,
                            choices: [
                                {
                                    text: 'Wieś',
                                    value: '1'
                                },
                                {
                                    text: 'Miasto',
                                    value: '2'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2714',
                            title: 'Jestem bardzo zaangażowany w wykonywanie swoich zadań.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2640',
                            title: 'Kiedy źle się czuję, rozumiem dlaczego.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2683',
                            title: 'Łatwo tracę panowanie nad sobą.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '6'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2614',
                            title: 'Kiedy uczę się, mogę szybko przejść od nauk humanistycznych do nauk fizycznych lub matematyki.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2652',
                            title: 'Postępuję zgodnie z intuicją.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2672',
                            title: 'Dobrze myślę o sobie.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2643',
                            title: 'Gdy jestem zestresowany, nie jestem w stanie skutecznie funkcjonować.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '6'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2716',
                            title: 'Moje kompetencje pozwalają mi radzić sobie w każdej sytuacji.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2664',
                            title: 'Wątpię, czy jestem w stanie odnieść sukces.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '6'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2693',
                            title: 'Bezpośrednio i jasno wyrażam to, co myślę.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2665',
                            title: 'Lubię pracować w grupie.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2625',
                            title: 'Jestem osobą bardzo ambitną.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2618',
                            title: 'Potrafię zachować spokój w stresujących sytuacjach.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2677',
                            title: 'Uzasadniając moje opinie, szanuję także opinie innych.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2646',
                            title: 'Kiedy ludzie mają różne opinie, proponuję wspólne rozwiązanie.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2695',
                            title: 'Nie mogę zrozumieć, co czuje inna osoba.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '6'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2628',
                            title: 'Lubię pracować sam.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2680',
                            title: 'Kiedy uczę się ważnego dla mnie przedmiotu, analizuję dokładnie temat.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2712',
                            title: 'Dobrze planuję swój czas i to, co muszę zrobić.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2697',
                            title: 'Kończę swoje zadania, nawet jeśli są one trudne.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2612',
                            title: 'Dobrze znam swoje uczucia i emocje.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2651',
                            title: 'Trudno mi panować nad emocjami.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '6'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2633',
                            title: 'Jestem tak samo skuteczny w uczeniu się przedmiotów trudnych (matematyki, fizyki), jak i humanistycznych.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2699',
                            title: 'Zdaję się na swoją intuicję.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2663',
                            title: 'Lubię siebie.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2623',
                            title: 'Potrafię sobie poradzić z moim stresem.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2710',
                            title: 'Dobrze sobie radzę, nawet wtedy, gdy nie mam narzędzi do wykonania mojej pracy.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2700',
                            title: 'Unikam nowych wyzwań, ponieważ boję się porażki.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '6'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2644',
                            title: 'Kiedy coś mi przeszkadza, mogę otwarcie to powiedzieć.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2686',
                            title: 'Lubię współpracować z innymi ludźmi.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2694',
                            title: 'Uważam, że jestem osobą ambitną.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2626',
                            title: 'Umiem kontrolować swoje emocje, podczas gdy inni tracą nad nimi panowanie.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2687',
                            title: 'Kiedy chcę przekonać kogoś do moich pomysłów, staram się szanować jego opinię.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2636',
                            title: 'W sytuacjach konfliktowych zwracam uwagę na to, aby obie strony były zadowolone z rozwiązania.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2658',
                            title: 'Zauważam, kiedy ktoś wokół mnie nie czuje się dobrze.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2637',
                            title: 'Realizacja projektów w pojedynkę nie stanowi dla mnie problemu.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2638',
                            title: 'Jeśli coś jest dla mnie ważne w nauczanych przedmiotach, bardzo się temu poświęcam.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2690',
                            title: 'Wiem, jak zaplanować swoją pracę.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2692',
                            title: 'Mimo trudności, dąże do realizacji swoich celów.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2660',
                            title: 'Potrafię zrozumieć swoje emocje.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2613',
                            title: 'Kiedy jestem zły, umiem zapanować nad sobą.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2622',
                            title: 'Kiedy uczę się, dobrze sobie radzę z nauką wielu różnorodnych przedmiotów.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2662',
                            title: 'Moja intuicja mnie nie zawodzi.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2708',
                            title: 'Akceptuję siebie, takim jakim jestem.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2685',
                            title: 'Stres motywuje mnie do bardziej skutecznego działania.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2701',
                            title: 'Jestem pewien, że potrafię poradzić sobie w każdej sytuacji.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2653',
                            title: 'Czuję się gorszy niż większość ludzi.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '6'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2654',
                            title: 'Kiedy nie chcę czegoś lub nie zgadzam się z czymś, mówię o tym.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2617',
                            title: 'Wolę pracę w towarzystwie innych osób, niż indywidualnie.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2703',
                            title: 'Staram się nieustannie rozwijać.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2645',
                            title: 'Dobrze radzę sobie z nieprzewidywalnymi sytuacjami.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2676',
                            title: 'Kiedy wyrażam swoje opinie, biorę pod uwagę to, co mogą odczuwać inni.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2657',
                            title: 'Podczas konfrontacji opinii, próbuję wypracować stanowisko zadawalające obie strony.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2704',
                            title: 'Jestem w stanie zauważyć, że ktoś wokół mnie potrzebuje pomocy.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2705',
                            title: 'Pracując sam jestem bardziej wydajny.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2689',
                            title: 'Kiedy uczę się czegoś, co jest dla mnie ważne, jestem tym całkowicie pochłonięty.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2620',
                            title: 'Zanim zacznę uczyć się, robię plan.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2670',
                            title: 'Z entuzjazmem realizuję swoje cele.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2650',
                            title: 'Wiem dlaczego zachowałem się w taki, a nie inny sposób.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2632',
                            title: 'Nawet jeśli jestem zdenerwowany, panuję nad swoim zachowaniem.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2615',
                            title: 'Ludzie mówią, że mam dobrą intuicję.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2684',
                            title: 'Jestem z siebie dumny.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2616',
                            title: 'Jestem skuteczny w stresujących sytuacjach.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2709',
                            title: 'Dobrze sobie radzę z problemami.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2624',
                            title: 'Często myślę, że nie poradzę sobie z czymś.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '6'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2673',
                            title: 'Jasno wyrażam swoje oczekiwania i opinie.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2674',
                            title: 'Dobrze czuję się w otoczeniu wielu osób.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2634',
                            title: 'Chcę osiągać coraz więcej.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2635',
                            title: 'Niespodziewane sytuacje nie sprawiają, że tracę kontrolę.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2655',
                            title: 'Szanuję to, co mówią i myślą inni.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2678',
                            title: 'Wiem, jak rozwiązywać konflikty w sposób, który przemawia do każdej ze stron.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2688',
                            title: 'Kiedy rozmawiam z kimś, to mogę sobie wyobrazić, jak czuje się ta osoba.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2718',
                            title: 'W szkole nie potrzebuję pomocy innych.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2629',
                            title: 'Ludzie mówią, że pasjonuję się nowymi tematami.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2630',
                            title: 'Kiedy planuję swój czas pracy, biorę pod uwagę nieoczekiwane wydarzenia.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2707',
                            title: 'Potrafię osiągać swoje cele.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2698',
                            title: 'Znam źródło swoich obaw i zmartwień.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2671',
                            title: 'Strach mnie paraliżuje.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '6'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '1'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2641',
                            title: 'Do podjęcia trafnych decyzji wystarczy mi szybka i intuicyjna analiza.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2642',
                            title: 'Dobrze się czuję z samym sobą.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2715',
                            title: 'Wiem, jak radzić sobie z krytyką.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2702',
                            title: 'Wyrażam swoje opinie i oczekiwania, nawet jeśli mogę spotkać się ze sprzeciwem innych.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2711',
                            title: 'Lubię rozmawiać z ludźmi.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2666',
                            title: 'Kiedy pracuję, stawiam sobie wysoko poprzeczkę.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2667',
                            title: 'Nawet, gdy czuję, że coś nie jest dla mnie przyjemne, potrafię opanować emocje i myśleć logicznie.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2656',
                            title: 'Kiedy przekonuję innych, szanuję ich opinie.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2627',
                            title: 'W przypadku rozbieżnych opinii próbuję znaleźć kompromis.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2717',
                            title: 'Czasami, kiedy rozmawiam z kimś, mogę poczuć te same emocje, co mój rozmówca.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2619',
                            title: 'Potrafię pracować bez wsparcia innych.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2648',
                            title: 'Kiedy zaangażuję się w coś, to jest dla mnie ważne, żeby było dobrze to zrobione.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2681',
                            title: 'Robię plany awaryjne na wypadek, gdyby coś wymknęło się spod kontroli.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2661',
                            title: 'W trudnych chwilach, udaje mi się opanować.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2675',
                            title: 'Dla osiągnięcia sukcesu, jestem gotów do wielu wyrzeczeń.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2668',
                            title: 'Jestem w stanie postawić się w roli innej osoby.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2647',
                            title: 'Wolę zadania, w których mogę o wszystkim decydować.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                },
                {
                    elements: [
                        {
                            type: 'radiogroup',
                            isRequired: true,
                            name: '2679',
                            title: 'Lubię, gdy jest dużo nowości.',
                            choices: [
                                {
                                    text: 'Zdecydowanie nie zgadzam się',
                                    value: '1'
                                },
                                {
                                    text: 'Nie zgadzam się',
                                    value: '2'
                                },
                                {
                                    text: 'Raczej nie zgadzam się',
                                    value: '3'
                                },
                                {
                                    text: 'Raczej zgadzam się',
                                    value: '4'
                                },
                                {
                                    text: 'Zgadzam się',
                                    value: '5'
                                },
                                {
                                    text: 'Zdecydowanie zgadzam się',
                                    value: '6'
                                }
                            ]
                        }
                    ]
                }
            ],
            sendToLibrary: true,
            showPrevButton: true,
            showProgressBar: 'bottom',
            libraryStatus: 'ACCEPTED',
            title: 'BrainCore Edu',
            goNextPageAutomatic: false,
            showQuestionNumbers: 'off'
        }
    ]

    let images = [{
      _id: "111111111111111111111111",
      fileName: 'categories/braincore-pedagogy.jpg',
      fileOriginalName: 'braincore-pedagogy.jpg',
      mimeType: 'image/png',
    }]

    db.contentImage.insertMany(images, (err) => {
        if (err && err.code!=11000) console.error(err.message);
    })

    // Always remove prevoius versions
    await db.content.deleteMany({_id: { $in: tests.map(t=>t._id)}});
    
    return db.content.insertMany(tests, (err) => {
        if (err && err.code!=11000) console.error(err.message);
    })


}
