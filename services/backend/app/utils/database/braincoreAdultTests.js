// generated with /scripts/generateTest.py, then inserted in to mongo and copied
const db = require("../../models");


const countriesEN = require('../world-countries/countries/en/countries.json')
const countriesFR = require('../world-countries/countries/fr/countries.json')
const countriesPL = require('../world-countries/countries/pl/countries.json')


exports.createBraincoreAdultTests = async () => { // Action for geting result for content
    const tests = [
        {// French
            _id: '60aaaaef2b4c80000732fdf5',
            image: '222222222222222222222222',
            approvedContentSource: '60aaaaef2b4c80000732fdf5', // TODO - to be deleted once LIbrary changes are finished
            language: 'fr',
            allowMultipleAttempts: true,
            approvedByLibrarian: true,
            cocreators: [],
            contentType: 'TEST',
            description: "Augmentez vos capacités cérébrales avec BrainCore et atteignez vos objectifs plus rapidement et plus facilement. \n\nLe test BrainCore Pro est un outil de diagnostic créé par notre équipe expérimentée de scientifiques et de psychologues, et inspiré des dernières découvertes dans le domaine des neurosciences et de la pédagogie cognitive. \n\nGrâce à ces connaissances, nous avons créé le système Neuro Activated Diagnostic® qui permet de visualiser les fonctions cognitives propres à chacun. \n\nUne fois le test complété, vous recevez votre profil cognitif, faisant partie du rapport BrainCore Pro.\n\nLe rapport contient également d’autres données personnalisées telles que vos forces et faiblesses, vos indicateurs émotionnels et vos dimensions psychométriques. \n\nVous trouverez ces informations indispensables, non-seulement pour votre développement professionnel, mais aussi pour votre développement personnel.",
            durationTime: 2700,
            goNextPageAutomatic: false,
            groups: [],
            pages: [{
                elements: [{
                    name: '9991',
                    title: 'Bienvenue au test BrainCore Pro ! Vous allez trouver ci-dessous plusieurs déclarations (phrases affirmatives) relatives aux différents traits de personnalité et aux compétences d’apprentissage.<br><br>Nous vous demandons de cocher la réponse qui correspond le mieux à vos convictions, dans le cadre de votre activité professionnelle, en choisissant votre option sur l’échelle de notation qui va de 1 (je ne suis pas du tout d’accord) à 6 (je suis entièrement d’accord).<br><br><b>1 – je ne suis pas du tout d’accord<br>2 – je ne suis pas d’accord<br>3 – je ne suis pas vraiment d’accord<br>4 – je suis plutôt d’accord<br>5 – je suis d’accord<br>6 – je suis entièrement d’accord</b><br><br>Il n\'y a pas ici de bonnes ou de mauvaises réponses. Ce qui compte, ce sont les réponses qui expriment votre opinion.<br><br>Merci de nous donner quelques informations personnelles. Nous vous demandons uniquement de fournir les données sociodémographiques générales afin de nous faciliter une meilleure analyse des résultats obtenus.<br><br>Merci de cocher ou de sélectionner la réponse appropriée.',
                    type: 'expression'
                }]
            },
            {
                elements: [
                    {
                        type: "dropdown",
                        name: "100",
                        title: "Sélectionnez le pays",
                        isRequired: true,
                        choices: countriesFR.map(c => { return { text: c.name, value: c.alpha2.toUpperCase() } })
                    },
                    {
                        choices: [{ text: 'Homme', value: '1' },
                        { text: 'Femme', value: '2' }],
                        isRequired: 1,
                        name: '9992',
                        title: 'Sexe :',
                        type: 'radiogroup'
                    },
                    {
                        choices: [{ text: '18-24 ans', value: '1' },
                        { text: '25-36 ans', value: '2' },
                        { text: '37-50 ans', value: '3' },
                        { text: '51-65 ans', value: '4' },
                        { text: '65 ans et plus', value: '5' }],
                        isRequired: 1,
                        name: '9993',
                        title: 'Âge :',
                        type: 'radiogroup'
                    },
                    {
                        choices: [{
                            text: 'Ecole primaire / niveau élémentaire',
                            value: '1'
                        },
                        {
                            text: 'Diplôme de fin de scolarité / Diplôme national du brevet (DNB)',
                            value: '2'
                        },
                        {
                            text: 'Baccalauréat / Maturité / CFC',
                            value: '3'
                        },
                        {
                            text: 'Bachelor / formation spécialisée (bac + 2/+3)',
                            value: '4'
                        },
                        {
                            text: 'Master / formation supérieure (bac + 4/+5)',
                            value: '5'
                        },
                        {
                            text: 'Formation post-grade (bac +6 et davantage)',
                            value: '6'
                        }],
                        isRequired: 1,
                        name: '9994',
                        title: 'Niveau de formation le plus élevé :',
                        type: 'radiogroup'
                    },
                    {
                        choices: [{
                            text: 'à la campagne ou un village jusqu’à 9’999 habitants',
                            value: '1'
                        },
                        {
                            text: 'dans une ville de moins de 49 999 habitants',
                            value: '2'
                        },
                        {
                            text: 'dans une ville de 50 0000 à 99 999 habitants',
                            value: '3'
                        },
                        {
                            text: 'dans une ville de plus de 100 0000 habitants',
                            value: '4'
                        }],
                        isRequired: 1,
                        name: '9995',
                        title: 'Dans quel environnement habitez-vous ?',
                        type: 'radiogroup'
                    },
                    {
                        choices: [{
                            text: 'sans conduite de personnel',
                            value: '1'
                        },
                        {
                            text: 'avec conduite de personnel',
                            value: '2'
                        },
                        {
                            text: 'les deux options ci-dessus (dans le cas où vous exercez différentes niveau d’encadrement différencié)',
                            value: '3'
                        }],
                        isRequired: 1,
                        name: '9996',
                        title: 'Dans le cadre de votre activité professionnelle, exercez-vous ou avez-vous exercé une fonction:',
                        type: 'radiogroup'
                    }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10007',
                    title: 'J’influence facilement les opinions et les convictions des autres.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10013',
                    title: 'Je planifie bien mon temps et les choses que j’ai à faire.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10015',
                    title: 'J’aime travailler tout(e) seul(e).',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10023',
                    title: 'Les situations stressantes absorbent mes pensées.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10025',
                    title: 'Je noue volontiers de nouveaux contacts.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10027',
                    title: 'Au travail, je préfère la stabilité et le confort plutôt que l’incertitude et l’entreprise de projets présentant un risque.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10039',
                    title: 'Je fais confiance à mon intuition.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10041',
                    title: 'Je m’adapte facilement aux nouvelles situations.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10045',
                    title: 'Je sais identifier les émotions que j’éprouve.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10049',
                    title: 'J’aime la routine et la répétition.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10051',
                    title: 'En regardant ma vie, il me semble que j’ai du mal à me remettre de mes échecs.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10069',
                    title: 'Je sais donner un retour d’information, même si cette information est difficile à accepter par son destinataire.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10071',
                    title: 'Il est facile de provoquer en moi une émotion.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10073',
                    title: 'Je préfère travailler entouré(e) d’autres personnes plutôt que de travailler seul(e).',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10077',
                    title: 'Lorsque je ne veux pas quelque chose ou je ne suis pas d’accord avec quelque chose, je le dis.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10079',
                    title: 'J’évite le risque.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10083',
                    title: 'Je sais comment diminuer efficacement mon niveau de stress.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10085',
                    title: 'Je doute facilement de mes propres croyances.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10093',
                    title: 'Parfois, j’ai le sentiment de ne pas savoir ce que j’attends de la vie.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10105',
                    title: 'Je m’identifie avec mon travail et je m’engage beaucoup pour l’intérêt de l’entreprise.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10107',
                    title: 'Je préfère analyser plutôt qu’agir impulsivement.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10109',
                    title: 'Je planifie rarement ce que j’ai à faire. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10111',
                    title: 'J’aime quand quelqu’un gère mon travail.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10113',
                    title: 'Je peux imaginer ce que les autres peuvent ressentir, même si eux-mêmes, ils ne le définissent pas.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10115',
                    title: 'Dans des situations de conflit, je veille à ce que les deux parties soient satisfaites d’une solution.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10117',
                    title: 'Je traite tout le monde avec respect, même ceux qui pensent autrement que moi.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10123',
                    title: 'Les gens me définissent comme une personne ambitieuse.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10129',
                    title: 'Je me débrouille bien, même lorsque je n’ai pas les outils pour faire mon travail.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10139',
                    title: 'D’habitude je garde mon calme, même si je suis sous forte pression.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10143',
                    title: 'Je finis toujours mes tâches, même si cela me coûte beaucoup.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10145',
                    title: 'J’aime chercher des solutions alternatives, même si les solutions traditionnelles sont à ma portée.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10149',
                    title: 'Quand j’entreprends quelque chose de nouveau, je m’attends à réussir.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10151',
                    title: 'Je parle de manière convaincante et je peux convaincre les autres de ce en quoi je crois.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10153',
                    title: 'Je suis d’accord de consacrer une part de mon temps libre au travail.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10159',
                    title: 'La réalisation des projets seul ne me pose aucun problème.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10161',
                    title: 'J’éprouve des difficultés pour identifier les émotions des autres.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10163',
                    title: 'J’essaie de concilier les parties en conflit.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10165',
                    title: 'Je respecte les opinions des autres, même si nous ne pensons pas de la même manière.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10167',
                    title: 'Je garde mon sang-froid quoi qu’il arrive.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10173',
                    title: 'J’exprime clairement mes attentes et opinions.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10175',
                    title: 'Je pense souvent que je ne parviendrai pas à gérer une situation.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10177',
                    title: 'Je doute de mes capacités. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10181',
                    title: 'J’ai une haute opinion de moi-même.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10183',
                    title: 'Quand je ne sais pas quoi faire, je me fie à mon "instinct".',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10191',
                    title: 'Je suis très engagé(e) dans les missions qui me sont confiées.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10193',
                    title: 'Lorsque j’ai un problème à résoudre, je recherche des façons de penser nouvelles et originales.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10197',
                    title: 'Il est difficile de tirer quelque chose de positif des échecs.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10201',
                    title: 'Mes collègues savent qu’ils peuvent compter sur moi, parce que je suis prêt(e) à faire des sacrifices pour l’intérêt de l’entreprise.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10203',
                    title: 'Je préfère travailler sur de courts projets qui donnent des résultats rapides et concrets.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10223',
                    title: 'Je pense que la prise de risques est une composante de la réussite.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10225',
                    title: 'Je connais bien ma valeur.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10227',
                    title: 'Le stress me paralyse et j’ai du mal à le maîtriser.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10237',
                    title: 'J’ai du mal à identifier mes émotions.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10243',
                    title: 'Il y a des situations dans ma vie qui m’empêchent de retrouver un sentiment de bien-être.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10245',
                    title: 'En général je me sens heureux(se).',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10247',
                    title: 'Je n’ai aucune prise sur ce que font les autres, mais je tiens à donner mon opinion.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10251',
                    title: 'Ça me fatigue quand les autres réfléchissent trop au lieu d’agir.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10253',
                    title: 'Je sais organiser la réalisation des missions plus complexes.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10255',
                    title: 'J’accepte difficilement les ordres donnés par les autres. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10259',
                    title: 'Lors d’une dispute, j’essaie d’entendre les deux parties.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10265',
                    title: 'Je préfère écouter plutôt que parler.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10267',
                    title: 'Je mène une vie confortable et j’essaie de ne pas me mettre de pression.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10275',
                    title: 'Je me débrouille bien dans des situations stressantes.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10277',
                    title: 'Je ne suis pas aussi compétent(e) et intelligent(e) que je pourrais l’être.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10283',
                    title: 'Je me comporte comme je veux.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10289',
                    title: 'Je n’aime pas essayer de nouvelles choses.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10291',
                    title: 'Je suis capable de gérer la perte et l’échec. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10293',
                    title: 'Quand les choses tournent mal, je suis persuadé(e) que j’y ferai face.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10301',
                    title: 'Au lieu de planifier je préfère agir.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10305',
                    title: 'J’ai le sentiment que je n’arrive pas à comprendre le raisonnement de mon interlocuteur.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10309',
                    title: 'Je respecte ce que les autres disent et pensent.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10311',
                    title: 'Je suis une personne émotive, je suis perturbé(e) par des situations inquiétantes et difficiles.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10315',
                    title: 'Les objectifs ambitieux me procurent beaucoup de satisfaction. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10319',
                    title: 'Je suis prêt(e) à faire n’importe quoi pour atteindre mon objectif.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10321',
                    title: 'Au travail, les autres se débrouillent mieux que moi. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10323',
                    title: 'Je sais maîtriser mon stress. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10325',
                    title: 'Je suis fier/fière de moi.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10327',
                    title: 'Je comprends assez rapidement la manière dont je dois me comporter dans une situation délicate.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10329',
                    title: 'Il est difficile pour moi d’accepter des changements après qu’un plan de départ ait été validé.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10331',
                    title: 'Même si je suis en colère, je me maîtrise.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10333',
                    title: 'Je suis capable de nommer mes émotions, besoins et comportements dans chaque situation.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10335',
                    title: 'L’enthousiasme m’accompagne tout au long de mon chemin jusqu’à ce que l’objectif soit atteint.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10345',
                    title: 'Lorsque quelque chose est important pour moi dans ce que j’ai à faire, je m’y engage beaucoup.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10349',
                    title: 'Avant de démarrer une mission, je fais un plan.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10351',
                    title: 'Je suis plus efficace quand je travaille seul(e).',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10353',
                    title: 'J’arrive difficilement à identifier dans quel état d’esprit est mon interlocuteur.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10361',
                    title: 'J’aime travailler avec d’autres personnes.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10365',
                    title: 'J’évite la confrontation avec les autres, par peur d’exprimer mes émotions ou mes opinions.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10371',
                    title: 'Je sais me calmer.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10375',
                    title: 'Je me fie à mon expérience.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10377',
                    title: 'Malgré les actions planifiées, je m’adapte facilement à des situations changeantes. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10381',
                    title: 'Je connais bien mes sentiments et mes émotions.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10385',
                    title: 'J’aime la routine et mes habitudes.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10387',
                    title: 'Je dispose de larges ressources qui me permettent de faire face même à des situations difficiles.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10393',
                    title: 'Il y a des situations où je travaille plus longtemps que ce que l’on exige de moi.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10395',
                    title: 'J’aime bien voir des résultats rapides de mes actions.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10399',
                    title: 'Au travail j’apprécie quand les schémas de fonctionnement me sont imposés.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10403',
                    title: 'Lors d’une confrontation des avis, j’essaie d’élaborer une position satisfaisante pour les deux parties.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10407',
                    title: 'Penser à mes problèmes provoque souvent en moi des émotions.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10413',
                    title: 'Lorsque quelque chose me dérange je le communique ouvertement. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10415',
                    title: 'En prenant des risques, je vois l’opportunité de progresser.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10419',
                    title: 'Le stress me motive à agir plus efficacement.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10425',
                    title: 'Changer ses plans parce que les circonstances changent mène souvent à l’erreur.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10427',
                    title: 'Même si je suis envahi(e) par les émotions, je reste maître de moi-même.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10431',
                    title: 'Je poursuis mes objectifs avec enthousiasme. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10433',
                    title: 'J’apprécie plus la répétition et la stabilité que de pratiquer des expériences.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10439',
                    title: 'J’ai le don de persuasion.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10443',
                    title: 'Ça me fatigue lorsque je dois attendre trop lentement les résultats de mes actions.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10445',
                    title: 'Bien souvent je commence à faire un travail avant de réfléchir à comment m’y prendre.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10447',
                    title: 'Je préfère les tâches que je peux gérer de manière entièrement indépendante.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10451',
                    title: 'En cas de divergence des avis, j’essaie de trouver un compromis.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10453',
                    title: 'Je n’attache aucune importance aux opinions des autres, j’exprime librement mes idées.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10457',
                    title: 'Dans un groupe je suis plutôt un observateur qu’une vedette.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10461',
                    title: 'Je donne mes opinions ou mes attentes, même si je n’ai pas l’approbation des autres.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10467',
                    title: 'J’ai des bonnes astuces pour gérer le stress.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10473',
                    title: 'Les changements de plans m’incitent à agir.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10477',
                    title: 'Parfois, j’agis sans réfléchir et je n’arrive pas à le justifier.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10479',
                    title: 'J’essaie de progresser sans cesse.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10483',
                    title: 'Après divers échecs, je suis capable de bien performer relativement rapidement.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10485',
                    title: 'La majeure partie de ma vie je vois le verre à moitié vide.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10487',
                    title: 'Je ne sais pas trop comment convaincre les autres s’ils sont d’un autre avis.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10489',
                    title: 'Je sépare catégoriquement ma vie privée de ma vie professionnelle.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10497',
                    title: 'Lorsque je parle avec quelqu’un, je suis capable de m’imaginer comment cette personne se sent.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10501',
                    title: 'Je veille à ce que mes propos ne blessent pas les autres.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10503',
                    title: 'Les situations imprévues ne m’empêchent pas de maîtriser mes émotions.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10507',
                    title: 'Je suis une personne ambitieuse. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10511',
                    title: 'Je prends des risques pour atteindre les objectifs que je me suis fixés. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10513',
                    title: 'Je sais gérer les problèmes.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10519',
                    title: 'Les bonnes décisions ne peuvent être prises qu’avec une bonne analyse des informations et méthode.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10523',
                    title: 'Dans des moments difficiles, j’arrive à me contrôler.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10535',
                    title: 'Il est important pour moi d’être une personne influente.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10539',
                    title: 'J’analyse et j’envisage précisément divers scénarios et options avant d’agir.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10541',
                    title: 'Je choisis soigneusement les différentes actions pour atteindre mon but.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10545',
                    title: 'Parfois, lorsque je parle avec quelqu’un, je peux ressentir les mêmes émotions que mon interlocuteur.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10551',
                    title: 'Je sais maîtriser mes émotions tandis que les autres en perdent le contrôle.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10553',
                    title: 'Je puise mon énergie au contact des gens',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10561',
                    title: 'Je suis convaincu(e) de pouvoir gérer n’importe quelle situation.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10571',
                    title: 'Lorsque quelqu’un me parle avec colère, je réagis de la même façon.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10575',
                    title: 'Je suis prêt(e) à faire de grands sacrifices pour atteindre mon objectif.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '1'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '3'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '4'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10577',
                    title: 'J’ai l’impression que beaucoup de choses dépendent de moi.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Je ne suis pas du tout d’accord',
                        value: '6'
                    },
                    {
                        text: "Je ne suis pas d'accord",
                        value: '5'
                    },
                    {
                        text: 'Je ne suis pas vraiment d’accord',
                        value: '4'
                    },
                    {
                        text: "Je suis plutôt d'accord",
                        value: '3'
                    },
                    {
                        text: "Je suis d'accord",
                        value: '2'
                    },
                    {
                        text: 'Je suis entièrement d’accord',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10581',
                    title: 'Dans mon travail j’essaie d’économiser de l’énergie.',
                    type: 'radiogroup'
                }]
            }],
            sendToLibrary: true,
            showPrevButton: true,
            showProgressBar: 'bottom',
            showQuestionNumbers: 'off',
            showTitle: true,
            libraryStatus: 'ACCEPTED',
            title: 'BrainCore Pro'

        },
        // POLISH
        {
            _id: '60bbbbef2b4c80000732fdf5',
            image: '222222222222222222222222',
            approvedContentSource: '60bbbbef2b4c80000732fdf5', // TODO - to be deleted once LIbrary changes are finished
            language: 'pl',
            approvedByLibrarian: true,
            allowMultipleAttempts: true,
            cocreators: [],
            contentType: 'TEST',
            description: "Rozwijaj możliwości swojego mózgu dzięki BrainCore i osiągaj swoje cele szybciej i łatwiej. Test BrainCore jest narzędziem diagnostycznym, stworzonym przez nasz doświadczony zespół naukowców i psychologów, inspirowany przez najnowsze odkrycia z dziedzin neuronauki i pedagogiki poznawczej. Dzięki tej wiedzy stworzyilśmy system Neuro Activated Diagnostic®, który umożliwia wizualizację poznawczych funkcji każdemu użytkownikowi. Te informacje zostaną opisane w szczegółowym raporcie stworzonym po wykonaniu testu. Co ważne, użytkownicy otrzymają spersonalizowane dane, takie jak: silne i słabe strony, wskaźniki emocjonalnych właściwości oraz inne psychometryczne wymiary.",
            durationTime: 2700,
            goNextPageAutomatic: false,
            groups: [],
            libraryStatus: 'ACCEPTED',
            pages: [{
                elements: [{
                    name: '9991',
                    title: 'Poniżej znajduje się szereg twierdzeń odnoszących się do różnych cech i umiejętności, oraz sposobu przyswajania wiedzy. Przy każdym z nich prosimy o zaznaczenie na skali od 1 (zdecydowanie nie zgadzam się) do 6 (zdecydowanie zgadzam się) odpowiedzi, która najlepiej wyraża Twoje przekonania. <br><br><b>1 – zdecydowanie nie zgadzam się<br>2 – nie zgadzam się<br>3 – raczej nie zgadzam się<br>4 – raczej zgadzam się<br>5 – zgadzam się<br>6 – zdecydowanie zgadzam się</b><br><br>Nie ma tu dobrych, ani złych odpowiedzi. Ważne są tylko te, które wyrażają Twoją opinię na Twój temat. Nikomu Twoich odpowiedzi nie udostępnimy, rezultaty zostaną przekazane tylko Tobie, lub osobie, która poprosiła Cię o wypełnienie testu.<br>Zanim przystąpisz do odpowiedzi na poszczególne twierdzenia, prosimy o udzielenie podstawowych informacji o sobie.',
                    type: 'expression'
                }]
            },
            {
                elements: [
                    {
                        type: "dropdown",
                        name: "100",
                        title: "Wybierz kraj",
                        isRequired: true,
                        choices: countriesPL.map(c => { return { text: c.name, value: c.alpha2.toUpperCase() } })
                    },
                    {
                        choices: [{ text: 'Mężczyzna', value: '1' },
                        { text: 'Kobieta', value: '2' }],
                        isRequired: 1,
                        name: '9992',
                        title: 'Płeć',
                        type: 'radiogroup'
                    },
                    {
                        choices: [{ text: '< 18-24', value: '1' },
                        { text: '25-36', value: '2' },
                        { text: '37-50', value: '3' },
                        { text: '51-65', value: '4' },
                        { text: '> 65', value: '5' }],
                        isRequired: 1,
                        name: '9993',
                        title: 'Wiek',
                        type: 'radiogroup'
                    },
                    {
                        choices: [{ text: 'Podstawowe', value: '1' },
                        { text: 'Gimanzjalne', value: '2' },
                        {
                            text: 'Branżowe/Zawodowe',
                            value: '3'
                        },
                        { text: 'Średnie', value: '4' },
                        { text: 'Wyższe', value: '5' },
                        { text: 'Inne', value: '6' }],
                        isRequired: 1,
                        name: '9994',
                        title: 'Wykształcenie',
                        type: 'radiogroup'
                    },
                    {
                        choices: [{ text: 'Wieś', value: '1' },
                        {
                            text: 'Miasto do 20 tys mieszkańców',
                            value: '2'
                        },
                        {
                            text: 'Miasto od 20 do 100 tys mieszkańców',
                            value: '3'
                        },
                        {
                            text: 'Miasto od 100 tys',
                            value: '4'
                        }],
                        isRequired: 1,
                        name: '9995',
                        title: 'Miejsce zamieszkania',
                        type: 'radiogroup'
                    },
                    {
                        choices: [{
                            text: 'Pracownik (osoba niezarządzająca innymi)',
                            value: '1'
                        },
                        {
                            text: 'Osoba zarządzająca innymi',
                            value: '2'
                        },
                        {
                            text: 'Obie powyższe opcje',
                            value: '3'
                        }],
                        isRequired: 1,
                        name: '9996',
                        title: 'Funkcja w pracy',
                        type: 'radiogroup'
                    }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10007',
                    title: 'Z łatwością wpływam na poglądy i przekonania innych osób.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10013',
                    title: 'Dobrze planuję swój czas i to, co mam do zrobienia.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10015',
                    title: 'Lubię pracować samodzielnie.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10023',
                    title: 'Sytuacje stresujące pochłaniają moje myśli.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10025',
                    title: 'Chętnie nawiązuję nowe kontakty.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10027',
                    title: 'Preferuję stabilność i wygodę w pracy niż zmienność i podejmowanie ryzykownych projektów.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10039',
                    title: 'Ufam swojej intuicji.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10041',
                    title: 'Łatwo dostosowuję się do nowych okoliczności.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10045',
                    title: 'Rozpoznaję przeżywane przeze mnie emocje.      ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10049',
                    title: 'Lubię rutynę i swoje przyzwyczajenia.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10051',
                    title: 'Patrząc na swoje życie odnoszę wrażenie, że dość trudno jest mi się pozbierać po trudnych sytuacjach/ porażkach.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10069',
                    title: 'Potrafię dać informację zwrotną, nawet jeśli jest ona trudna do zaakceptowania przez jej odbiorcę.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10071',
                    title: 'Łatwo wzbudzić we mnie emocje.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10073',
                    title: 'Wolę pracę w towarzystwie innych osób, niż indywidualnie.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10077',
                    title: 'Kiedy nie chcę czegoś lub nie zgadzam się z czymś, mówię o tym.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10079',
                    title: 'Unikam ryzyka.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10083',
                    title: 'Wiem, jak skutecznie obniżyć swój poziom stresu.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10085',
                    title: 'Łatwo mi wątpić w swoje własne przekonania.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10093',
                    title: 'Czasami mam poczucie, że nie wiem czego chcę od życia.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10105',
                    title: 'Identyfikuje się z moją pracą i wkładam dużo zaangażowania w dobro firmy.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10107',
                    title: 'Wolę analizować, niż działać pochopnie.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10109',
                    title: 'Rzadko planuję wykonanie swojej pracy.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10111',
                    title: 'Lubię, kiedy ktoś kieruje moją pracą.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10113',
                    title: 'Wyobrażam sobie, co mogą czuć inni, nawet jeśli sami tego nie nazywają.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10115',
                    title: 'W sytuacjach konfliktowych zwracam uwagę na to, aby obie strony były zadowolone z rozwiązania.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10117',
                    title: 'Odnoszę się z szacunkiem do wszystkich ludzi, nawet tych o odmiennych poglądach niż moje. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10123',
                    title: 'Ludzie określają mnie jako osobę ambitną. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10129',
                    title: 'Dobrze sobie radzę, nawet wtedy, gdy nie mam narzędzi do wykonania mojej pracy.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10139',
                    title: 'Zwykle zachowuję spokój, nawet pod dużą presją.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10143',
                    title: 'Kończę swoje zadania, nawet jeżeli wymagają ode mnie wysiłku.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10145',
                    title: 'Lubię szukać alternatywnych rozwiązań, nawet jeśli tradycyjne rozwiązania są dostępne.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10149',
                    title: 'Kiedy podejmuję się czegoś nowego, oczekuję, że to się uda.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10151',
                    title: 'Mówię w sposób przekonujący i potrafię przekonać innych do tego, w co wierzę.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10153',
                    title: 'Jestem w stanie poświęcić swój prywatny czas w imię pracy.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10159',
                    title: 'Realizacja projektów w pojedynkę nie stanowi dla mnie problemu.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10161',
                    title: 'Identyfikacja emocji przeżywanych przez innych sprawia mi trudność. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10163',
                    title: 'Staram się dążyć do pogodzenia zwaśnionych stron.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10165',
                    title: 'Szanuję czyjeś opinie, nawet w sytuacji gdy mamy odmienne poglądy.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10167',
                    title: 'Niezależnie od sytuacji panuję nad sobą.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10173',
                    title: 'Jasno wyrażam swoje oczekiwania i opinie.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10175',
                    title: 'Często myślę, że nie poradzę sobie z czymś.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10177',
                    title: 'Wątpię w swoje umiejętności. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10181',
                    title: 'Dobrze myślę o sobie.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10183',
                    title: 'Kiedy nie wiem, co zrobić, wierzę w swoje "przeczucie".',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10191',
                    title: 'Jestem bardzo zaangażowany w wykonywanie swoich zadań.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10193',
                    title: 'Kiedy muszę rozwiązać jakiś problem, szukam nowych i oryginalnych sposobów myślenia.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10197',
                    title: 'Z porażek trudno wyciągnąć coś pozytywnego.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10201',
                    title: 'W pracy wiedzą, że mogą na mnie liczyć, ponieważ jestem zdolny do wielu poświęceń dla dobra firmy.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10203',
                    title: 'Preferuję pracować nad krótkimi projektami dającymi szybkie i konkretne rezultaty.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10223',
                    title: 'Uważam, że podejmowanie ryzyka jest składową sukcesu.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10225',
                    title: 'Znam swoją wartość.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10227',
                    title: 'Stres paraliżuje mnie i trudno mi nad nim zapanować. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10237',
                    title: 'Mam trudność w określeniu, jakie emocje przeżywam.  ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10243',
                    title: 'Są w moim życiu sytuacje które nie pozwalają mi wrócić do poczucia dobrostanu.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10245',
                    title: 'Na ogół czuję się szczęśliwy.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10247',
                    title: 'Nie mam wpływu na to co zrobią inni, ale mogę wypowiedzieć własne zdanie.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10251',
                    title: 'Męczy mnie, gdy inni długo się zastanawiają, zamiast działać.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10253',
                    title: 'Potrafię dobrze zorganizować działania w bardziej skomplikowanych zadaniach.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10255',
                    title: 'Trudno przychodzi mi przyjmowanie poleceń od innych.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10259',
                    title: 'Podczas kłótni, staram się słuchać obu stron. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10265',
                    title: 'Chętniej słucham niż mówię.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10267',
                    title: 'Mam swobodny styl życia, staram się nie wywierać na sobie żadnych presji.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10275',
                    title: 'Dobrze radzę sobie w sytuacjach stresowych.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10277',
                    title: 'Nie jestem tak zdolny i inteligentny, jak mógłbym być.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10283',
                    title: 'Zachowuję się tak jak bym chciał.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10289',
                    title: 'Nie lubię eksperymentować z nowymi doświadczeniami.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10291',
                    title: 'Potrafię radzić sobie ze stratą i przegraną.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10293',
                    title: 'Kiedy wydarza się coś nie po mojej myśli, wierzę że sobie z tym poradzę.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10301',
                    title: 'Zamiast planować wolę działać.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10305',
                    title: 'Często mam poczucie, że nie potrafię zrozumieć sposobu myślenia rozmówcy.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10309',
                    title: 'Szanuję to, co mówią i myślą inni.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10311',
                    title: 'Jestem emocjonalny, bardzo przeżywam niepokojące i trudne sytuacje.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10315',
                    title: 'Osiąganie ambitnych celów sprawia mi satysfakcję.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10319',
                    title: 'Jestem gotów zrobić wszystko, aby osiągnąć swój cel.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10321',
                    title: 'Inni radzą sobie w pracy lepiej ode mnie. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10323',
                    title: 'Potrafię sobie poradzić ze stresem.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10325',
                    title: 'Jestem z siebie dumny.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10327',
                    title: 'Dość szybko zdaję sobie sprawę, jak należy się zachować w podbramkowej sytuacji.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10329',
                    title: 'Z trudem przychodzi mi zaakceptowanie zmian w pierwotnych ustaleniach.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10331',
                    title: 'Nawet jeśli jestem zdenerwowany, panuję nad swoim zachowaniem.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10333',
                    title: 'W każdej sytuacji potrafię nazwać swoje emocje, potrzeby, zachowania.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10335',
                    title: 'Entuzjazm towarzyszy mi podczas całej drogi aż do osiągnięcia celu.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10345',
                    title: 'Jeśli coś w moich zadaniach jest dla mnie ważne, bardzo się temu poświęcam.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10349',
                    title: 'Zanim zacznę realizować zadanie, robię plan.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10351',
                    title: 'Pracując sam, jestem bardziej wydajny.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10353',
                    title: 'Trudno mi  określać, w jakim nastroju jest osoba, z którą rozmawiam bądź przebywam. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10361',
                    title: 'Lubię współpracować z innymi ludźmi.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10365',
                    title: 'Unikam konfrontacji z innymi, w obawie przed wyrażeniem swoich emocji czy opinii.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10371',
                    title: 'Potrafię się uspokoić.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10375',
                    title: 'Ufam swemu doświadczeniu.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10377',
                    title: 'Pomimo zaplanowanych działań, potrafię dostosować się do zmieniającej się sytuacji.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10381',
                    title: 'Dobrze znam swoje uczucia i emocje.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10385',
                    title: 'Lubie rutynę i swoje przyzwyczajenia.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10387',
                    title: 'Mam bogate zasoby, które pozwalają mi sobie radzić nawet w trudnych sytuacjach.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10393',
                    title: 'Zdarzają się sytuacje kiedy pracuję dłużej, niż się tego ode mnie wymaga.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10395',
                    title: 'Lubię widzieć szybkie rezultaty swoich działań.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10399',
                    title: 'Cenię sobie, kiedy w pracy mam narzucone konkretne zasady działania.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10403',
                    title: 'Podczas konfrontacji opinii, próbuję wypracować stanowisko zadawalające obie strony.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10407',
                    title: 'Myślenie o moich problemach, często powoduje, że opanowują mnie emocje.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10413',
                    title: 'Kiedy mi coś przeszkadza, otwarcie to komunikuję.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10415',
                    title: 'W podjęciu ryzyka, widzę możliwość rozwoju.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10419',
                    title: 'Stres motywuje mnie do bardziej skutecznego działania.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10425',
                    title: 'Zmiana planów, ze względu na zmianę okoliczności, często prowadzi na manowce.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10427',
                    title: 'Nawet kiedy targają mną emocje, umiem zapanować nad sobą.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10431',
                    title: 'Z entuzjazmem realizuję swoje cele.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10433',
                    title: 'Powtarzalność i stabilność cenię wyżej niż eksperymenty.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10439',
                    title: 'Mam dar przekonywania.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10443',
                    title: 'Męczy mnie długie czekanie na efekty moich działań.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10445',
                    title: 'Dość często zaczynam wykonywać zadanie, zanim przemyślę jak je zrobić.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10447',
                    title: 'Wolę zadania, w których mogę o wszystkim decydować.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10451',
                    title: 'W przypadku rozbieżnych opinii próbuję znaleźć kompromis.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10453',
                    title: 'Nie przejmuję się opiniami innych - śmiało wyrażam swoje poglądy.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10457',
                    title: 'W grupie jestem raczej obserwatorem niż gwiazdą.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10461',
                    title: 'Wyrażam swoje opinie i oczekiwania, nawet jeśli mogę spotkać się ze sprzeciwem innych.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10467',
                    title: 'Mam swoje sprawdzone sposoby na zapanowanie nad stresem. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10473',
                    title: 'Zmiany planów pobudzają mnie do działania.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10477',
                    title: 'Czasami działam pod wpływem chwili i trudno jest mi to uzasadnić.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10479',
                    title: 'Staram się nieustannie rozwijać.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10483',
                    title: 'Mimo doświadczania różnych porażek, potrafię w miarę szybko znów dobrze funkcjonować.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10485',
                    title: 'Przez większość życia widzę szklankę do połowy pustą.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10487',
                    title: 'Nie bardzo wiem jak przekonywać innych, jeśli mają inne zdanie.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10489',
                    title: 'Stanowczo oddzielam życie zawodowe od prywatnego.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10497',
                    title: 'Kiedy rozmawiam z kimś, to mogę sobie wyobrazić, jak czuje się ta osoba.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10501',
                    title: 'Dbam, by moje komunikaty nie urażały innych.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10503',
                    title: 'Niespodziewane sytuacje nie sprawiają, że tracę kontrolę.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10507',
                    title: 'Jestem osobą ambitną.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10511',
                    title: 'Podejmuję ryzyko, aby osiągnąć postawione sobie cele. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10513',
                    title: 'Dobrze sobie radzę z problemami.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10519',
                    title: 'Słuszne decyzje podejmuje się jedynie w oparciu o analizę danych i procedury postępowania.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10523',
                    title: 'W trudnych chwilach, udaje mi się opanować.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10535',
                    title: 'Potrafię tak mówić, żeby przekonać innych.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10539',
                    title: 'Dokładnie analizuję i rozważam różne scenariusze i warianty, zanim podejmę działanie.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10541',
                    title: 'Trafnie dobieram poszczególne kroki działania, aby osiągnąć cel.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10545',
                    title: 'Czasami, kiedy rozmawiam z kimś, mogę poczuć te same emocje, co mój rozmówca.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10551',
                    title: 'Umiem kontrolować swoje emocje, podczas gdy inni tracą nad nimi panowanie.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10553',
                    title: 'Czerpię energię z przebywania z ludźmi. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10561',
                    title: 'Jestem pewien, że potrafię poradzić sobie w każdej sytuacji.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10571',
                    title: 'Gdy ktoś mówi do mnie ze złością, reaguję tym samym.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10575',
                    title: 'Jestem gotów do wielu wyrzeczeń, dla osiągnięcia celów.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '1'
                    },
                    { text: 'Nie zgadzam się', value: '2' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '3'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '4'
                    },
                    { text: 'Zgadzam się', value: '5' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10577',
                    title: 'Mam wrażenie, że na wiele rzeczy mam wpływ.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'Zdecydowanie nie zgadzam się',
                        value: '6'
                    },
                    { text: 'Nie zgadzam się', value: '5' },
                    {
                        text: 'Raczej nie zgadzam się',
                        value: '4'
                    },
                    {
                        text: 'Raczej zgadzam się',
                        value: '3'
                    },
                    { text: 'Zgadzam się', value: '2' },
                    {
                        text: 'Zdecydowanie zgadzam się',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10581',
                    title: 'W wykonywaniu zadań staram się oszczędzać energię.',
                    type: 'radiogroup'
                }]
            }],
            sendToLibrary: true,
            showPrevButton: true,
            showProgressBar: 'bottom',
            showQuestionNumbers: 'off',
            showTitle: true,
            title: 'BrainCore Pro'
        },
        {
            _id: '60ccccef2b4c80000732fdf5',
            image: '222222222222222222222222',
            approvedContentSource: '60ccccef2b4c80000732fdf5', // TODO - to be deleted once LIbrary changes are finished
            language: 'en',
            approvedByLibrarian: true,
            allowMultipleAttempts: true,
            cocreators: [],
            contentType: 'TEST',
            description: 'Increase your brain capacity with BrainCore and achieve your goals faster and easier. \n\n The BrainCore Pro Test is a diagnostic tool created by our experienced team of scientists and psychologists, and inspired by the latest discoveries in the field of neuroscience and cognitive pedagogy. \n\n Thanks to this, we’ve created the Neuro Activated Diagnostic® system, which visualises your unique cognitive functions. \n\n When you complete the test, you’ll receive your own cognitive profile via your personalized BrainCore Pro Report. You will also receive other invaluable information like your strengths & areas of development, emotional indicators, and psychometric dimensions, that can help you grow in your professional and personal lives.',
            durationTime: 2700,
            goNextPageAutomatic: false,
            groups: [],
            libraryStatus: 'ACCEPTED',
            pages: [{
                elements: [{
                    name: '9991',
                    title: 'Welcome to the BrainCore Pro Test. In this test you will be presented with a series of affirmative statements relating to learning and skills development. <br><br> Your task is to rate each statement according to how much you agree or disagree with it, on a scale of 1-6, as part of your professional activity, where one means you strongly disagree and 6 means you strongly agree.  <br><br><b>1 - I strongly disagree<br>2 - I do not agree<br>3 - I rather disagree<br>4 - I rather agree<br>5 - I agree<br>6 - I definitely agree</b><br><br>There are no good or bad answers. What matters is how much you identify with each statement. <br><br> Before you start, please take a moment to provide basic information about yourself. The answers to the questions below are completely anonymized. We use this information to facilitate better analysis of the results.',
                    type: 'expression'
                }]
            },
            {
                elements: [
                    {
                        type: "dropdown",
                        name: "100",
                        title: "Which country do you currently live in?",
                        isRequired: true,
                        choices: countriesEN.map(c => { return { text: c.name, value: c.alpha2.toUpperCase() } })
                    },
                    {
                        choices: [{ text: 'Man', value: '1' },
                        { text: 'Women', value: '2' }],
                        isRequired: 1,
                        name: '9992',
                        title: 'What is your gender?',
                        type: 'radiogroup'
                    },
                    {
                        choices: [{ text: '18-24 years old', value: '1' },
                        { text: '25-36 years old', value: '2' },
                        { text: '37-50 years old', value: '3' },
                        { text: '51-65 years old', value: '4' },
                        { text: '65 and over', value: '5' }],
                        isRequired: 1,
                        name: '9993',
                        title: 'What is your age?',
                        type: 'radiogroup'
                    },
                    {
                        choices: [{
                            text: 'Primary school / elementary level',
                            value: '1'
                        },
                        {
                            text: 'School-leaving diploma / National patent diploma (DNB))',
                            value: '2'
                        },
                        {
                            text: 'Baccalaureate / Maturity / CFC',
                            value: '3'
                        },
                        {
                            text: 'Bachelor / specialized training (bac + 2/+3)',
                            value: '4'
                        },
                        {
                            text: 'Master / higher education (bac + 4/+5)',
                            value: '5'
                        },
                        {
                            text: 'Post-graduate training (bac +6 and more))',
                            value: '6'
                        }],
                        isRequired: 1,
                        name: '9994',
                        title: 'What is the highest degree or level of education you have completed?',
                        type: 'radiogroup'
                    },
                    {
                        choices: [{
                            text: 'in the countryside or a village up to 9,999 inhabitants',
                            value: '1'
                        },
                        {
                            text: 'in a city of less than 49,999 inhabitants',
                            value: '2'
                        },
                        {
                            text: 'in a city of 50,000 to 99,999 inhabitants',
                            value: '3'
                        },
                        {
                            text: 'in a city of more than 100,000 inhabitants',
                            value: '4'
                        }],
                        isRequired: 1,
                        name: '9995',
                        title: 'How big is the place that you live?',
                        type: 'radiogroup'
                    },
                    {
                        choices: [{
                            text: 'I have not managed staff',
                            value: '1'
                        },
                        {
                            text: 'I have managed staff',
                            value: '2'
                        },
                        {
                            text: 'I have done both (if you have worked in positions with different levels of supervisory responsibility)',
                            value: '3'
                        }],
                        isRequired: 1,
                        name: '9996',
                        title: 'Describe your professional experience with staff management',
                        type: 'radiogroup'
                    }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10007',
                    title: 'I easily influence the views and beliefs of others.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10013',
                    title: 'I plan my time and what I need to do well.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10015',
                    title: 'I like to work on my own',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10023',
                    title: 'Stressful situations consume my thoughts.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10025',
                    title: 'I like to make new contacts.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10027',
                    title: 'At work, I prefer stability and comfort than volatility and taking on risky projects.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10039',
                    title: 'I trust my intuition.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10041',
                    title: 'I adapt easily to new situations.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10045',
                    title: 'I identify the emotions I experience.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10049',
                    title: 'I like routine and repetition.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10051',
                    title: 'Looking at my life, it seems to me that I have a hard time recovering from my failures.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10069',
                    title: 'I know how to give feedback, even if it is difficult for the recipient to accept.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10071',
                    title: 'I am easily stirred up by emotions.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10073',
                    title: 'I prefer to work around others rather than by myself.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10077',
                    title: 'When I don\'t want something or disagree with something, I say it.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10079',
                    title: 'I avoid risk.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10083',
                    title: 'I know how to effectively lower my stress level.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10085',
                    title: 'It\'s easy for me to doubt my own beliefs.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10093',
                    title: 'Sometimes I feel like I don\'t know what I want in life.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10105',
                    title: 'I identify with my work and engage whole heartedly in the success of the company.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10107',
                    title: 'I prefer to analyse a situation rather than acting impulsively.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10109',
                    title: 'I rarely plan my work.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10111',
                    title: 'I like to have someone manage my work.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10113',
                    title: 'I can recognize the emotional states and feelings of others.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10115',
                    title: 'In conflict situations, I do my best to ensure that both parties are satisfied with the solution.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10117',
                    title: 'I treat everyone with respect, even those with different views than mine. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10123',
                    title: 'People describe me as ambitious.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10129',
                    title: 'I get by well, even when I don\'t have the tools to do my job.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10139',
                    title: 'I usually remain calm, even under tons of pressure.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10143',
                    title: 'I finish my tasks even if they require me to make an effort.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10145',
                    title: 'I like to look for alternatives even if traditional solutions are available.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10149',
                    title: 'When I undertake something new, I expect success.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10151',
                    title: 'I speak in a convincing manner and can convince others of what I believe in.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10153',
                    title: 'I am able to sacrifice my private time in the name of work.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10159',
                    title: 'Implementing projects by myself is not a problem for me.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10161',
                    title: 'I find it difficult to identify the emotions experienced by others. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10163',
                    title: 'I seek to reconcile disputing parties.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10165',
                    title: 'I respect other people\'s opinions, even when we have differing views.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10167',
                    title: 'Regardless of the situation, I stay in control.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10173',
                    title: 'I clearly express my expectations and opinions.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10175',
                    title: 'When faced with unclear situations, I think I won\'t be able to handle things.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10177',
                    title: 'I doubt my abilities. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10181',
                    title: 'I think highly of myself. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10183',
                    title: 'When I don\'t know what to do, I trust my gut feeling.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10191',
                    title: 'I am very committed to doing my job.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10193',
                    title: 'When I need to solve a problem, I look for new and original ways of thinking.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10197',
                    title: 'It\'s hard to gain anything positive out of my failures.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10201',
                    title: 'At work, they know they can count on me because I am capable of making many sacrifices for the good of the company.e good of the company.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10203',
                    title: 'I prefer to work on short-term projects that give quick and tangible results .',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10223',
                    title: 'I believe that taking risks is a part of success.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10225',
                    title: 'I know my own value.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10227',
                    title: 'Stress paralyzes me and I find it difficult to control it. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10237',
                    title: 'I have a hard time defining the emotions I am experiencing. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10243',
                    title: 'There are situations in my life that prevent me from finding a sense of well-being.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10245',
                    title: 'In general, I feel happy. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10247',
                    title: 'Although I have influence on what others will do, I seek to voice my own opinion.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10251',
                    title: 'It tires me out when others take a long time to think instead of acting.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10253',
                    title: 'I know how to organise the implementation of more complex tasks.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10255',
                    title: 'I find it difficult to accept orders from others.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10259',
                    title: 'During an argument, I try to listen to both sides.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10265',
                    title: 'I prefer to listen more than to speak.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10267',
                    title: 'I have a relaxed lifestyle and try not to put any pressure on myself.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10275',
                    title: 'I can handle stressful situations well.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10277',
                    title: 'I am not as capable and intelligent as I could be.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10283',
                    title: 'I behave in the manner I would like.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10289',
                    title: 'I don\'t like trying new things.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10291',
                    title: 'I can cope with failure and loss.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10293',
                    title: 'When things start going bad, I know I can handle it. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10301',
                    title: 'Instead of planning, I prefer to act.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10305',
                    title: 'I have the feeling that I cannot understand my interlocutor\'s reasoning.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10309',
                    title: 'I respect what others say and think.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10311',
                    title: 'I am an emotional person, and I am disturbed by worrying and difficult situations. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10315',
                    title: 'Achieving ambitious goals gives me satisfaction.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10319',
                    title: 'I am willing to do anything to achieve my goal.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10321',
                    title: 'Others are doing better than me at work. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10323',
                    title: 'I can deal with stress.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10325',
                    title: 'I am proud of myself.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10327',
                    title: 'I realize fairly quickly how I should behave in a tricky situation.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10329',
                    title: 'I find it difficult to accept changes to the original plan.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10331',
                    title: 'Even if I am nervous, I am in control of my behavior.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10333',
                    title: 'I can identify my emotions, needs and behaviors in any situation.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10335',
                    title: 'I feel enthusiastic along the entire path to reaching my goal.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10345',
                    title: 'If something is important to me in what I need to do, I am very dedicated to it.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10349',
                    title: 'Before I start a task, I make a plan.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10351',
                    title: 'While working alone, I am more efficient.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10353',
                    title: 'I have a hard time identifying the mood of my interlocutor.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10361',
                    title: 'I like working with other people.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10365',
                    title: 'I avoid confrontation with others, for fear of expressing my emotions or opinions.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10371',
                    title: 'I can calm myself down.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10375',
                    title: 'I trust in my experience.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10377',
                    title: 'Despite of planned activities, I am able to adapt to changes in the situation.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10381',
                    title: 'I am well aware of my feelings and emotions.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10385',
                    title: 'I like the routine and my habits.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10387',
                    title: 'I have abundant resources that allow me to cope, even in difficult situations.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10393',
                    title: 'There are times when I work longer than is required of me.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10395',
                    title: 'I like to see quick results from my actions.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10399',
                    title: 'I appreciate being given specific instructions and operating procedures at work.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10403',
                    title: 'When confronting opinions, I try to develop a position that satisfies both sides.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10407',
                    title: 'Thinking about my problems often causes me to be overcome by emotion.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10413',
                    title: 'When something bothers me, I openly communicate it.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10415',
                    title: 'I see an opportunity for growth in taking risks.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10419',
                    title: 'Stress motivates me to act more effectively.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10425',
                    title: 'Changing plans because circumstances change often leads to mistakes.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10427',
                    title: 'Even when I am torn by emotions, I can control myself.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10431',
                    title: 'I enthusiastically pursue my goals.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10433',
                    title: 'I prefer repetitive things and a stable environment than performing experimentation.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10439',
                    title: 'I have the gift of persuasion.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10443',
                    title: 'Waiting a long time for the results of my actions tires me out. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10445',
                    title: 'Quite often I start doing a task before I have thought through how  to go about it.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10447',
                    title: 'I prefer tasks where I can decide everything.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10451',
                    title: 'When there are divergent opinions, I try to find a compromise.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10453',
                    title: 'I do not care about the opinions of others. I boldly express my views.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10457',
                    title: 'In a group, I am an observer rather than a main character.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10461',
                    title: 'I express my opinions and expectations, even if I may face opposition from others.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10467',
                    title: 'I have my own effective ways to control stress. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10473',
                    title: 'Changes in plans spur me to action.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10477',
                    title: 'Sometimes I act on the spur of the moment and find it difficult to justify it.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10479',
                    title: 'I try to develop myself constantly.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10483',
                    title: 'After various failures, I am able to function well relatively quickly.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10485',
                    title: 'For most of my life, I see the glass half empty.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10487',
                    title: 'I don\'t really know how to convince others if they have a different opinion.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10489',
                    title: 'I separate my professional and private life categorically.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10497',
                    title: 'When I talk to someone, I can imagine how that person feels.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10501',
                    title: 'I take care that my communications do not offend others.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10503',
                    title: 'Unexpected situations do not make me lose control.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10507',
                    title: 'I am ambitious.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10511',
                    title: 'I take risks to achieve the goals I set for myself. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10513',
                    title: 'I handle problems well.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10519',
                    title: 'The right decisions are made only on the basis of data analysis and procedure.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10523',
                    title: 'In difficult moments, I manage to control myself.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10535',
                    title: 'I can speak in such a way to convince others.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10539',
                    title: 'I precisely analyze and consider various scenarios and options before I take action.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10541',
                    title: 'I carefully select the various steps needed to achieve my goal.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10545',
                    title: 'Sometimes, when I talk to someone, I can feel their emotions. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10551',
                    title: 'I can control my emotions while others lose control of them.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10553',
                    title: 'I draw energy from being with people. ',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10561',
                    title: 'I am confident that I can handle any situation.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10571',
                    title: 'When someone speaks to me with anger, I respond in the same way.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10575',
                    title: 'I am willing to make many sacrifices for the sake of achieving my goal.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '1'
                    },
                    { text: 'I disagree', value: '2' },
                    {
                        text: 'I rather disagree',
                        value: '3'
                    },
                    { text: 'I rather agree', value: '4' },
                    { text: 'I agree', value: '5' },
                    {
                        text: 'I strongly agree',
                        value: '6'
                    }],
                    isRequired: true,
                    name: '10577',
                    title: 'I feel that many things depend on me.',
                    type: 'radiogroup'
                }]
            },
            {
                elements: [{
                    choices: [{
                        text: 'I strongly disagree',
                        value: '6'
                    },
                    { text: 'I disagree', value: '5' },
                    {
                        text: 'I rather disagree',
                        value: '4'
                    },
                    { text: 'I rather agree', value: '3' },
                    { text: 'I agree', value: '2' },
                    {
                        text: 'I strongly agree',
                        value: '1'
                    }],
                    isRequired: true,
                    name: '10581',
                    title: 'I try to conserve my energy when working. ',
                    type: 'radiogroup'
                }]
            }],
            sendToLibrary: true,
            showPrevButton: true,
            showProgressBar: 'bottom',
            showQuestionNumbers: 'off',
            showTitle: true,
            title: 'BrainCore Pro'
        }


    ]

    let images = [{
        _id: "222222222222222222222222",
        fileName: 'categories/braincore-adult.png',
        fileOriginalName: 'braincore-adult.png',
        mimeType: 'image/png',
    }]

    db.contentImage.insertMany(images, (err) => {
        if (err && err.code!=11000) console.error(err.message);
    })

    // Always remove prevoius versions
    await db.content.deleteMany({ _id: { $in: tests.map(t => t._id) } });

    return db.content.insertMany(tests, (err) => {
        if (err && err.code!=11000) console.error(err.message);
    })


}
