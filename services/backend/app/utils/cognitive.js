// Cognitive functions
// Most of those functions are inside user.model and they should be moved here


// Models
const Result = require("../models/result.model");
const Ecosystem = require("../models/ecosystem.model")
const CognitiveTraitModel = require("../models/cognitiveTrait.model");
const CognitiveProfileModel = require("../models/cognitiveProfile.model");
const CognitiveTipModel = require("../models/cognitiveTip.model")
const CognitiveAreaModel = require("../models/cognitiveArea.model");
const Project = require("../models/project.model");

const { braincoreTestsIds, pedagogyTestsIds } = require("./braincoreTestsIds");
const axios = require('axios');
var https = require('https');

const areas = ['self-activation', 'self-confidence', 'communication-strategy', 'cooperation', 'regularity']
const opportunityTypes = ['sociological', 'psychological', 'development']

const nadNames = ["self-activation", "self-confidence", "communication-strategy", "cooperation", "regularity"]
const _4CTraitsNames = ["collaboration", "communication", "creativity", "critical-thinking"]
const personalityTraitsInBusinessNames = [
    "assertiveness", "leadership", "interpersonal-relation",//Social Success Factors
    "mediation-and-influence", "respect", "empathy", // Emotional Intelligence in relations with others
    "emotional-distance", "stress-management", "self-control", "sense-of-mastery", "self-esteem", "risk-taking",//Self-management
    "intrapersonal-intelligence", "self-development", "achievements"//Personal Success Factors
]
// Static text for PDFs
const staticTextsForEduReport = {
    eduTitle: {
        "EN": "Results from the pedagogical test",
        "FR": "Résultats du test pédagogique",
        "PL": "Wyniki testu pedagogicznego"
    },
    studentNameLabel: {
        "EN": "Student name:",
        "FR": "Étudiant(e):",
        "PL": "Imię i nazwisko:"
    },
    studentSchoolLabel: {
        "EN": "School name:",
        "FR": "Nom de l’école:",
        "PL": "Imię i nazwisko:"
    },
    studentDateLabel: {
        "EN": "Test taken on:",
        "FR": "Résultats du jour:",
        "PL": "Data testu:"
    },
    profileHighlights: {
        "EN": "Profile Highlights:",
        "FR": "Attributs De Profil:",
        "PL": "Cechy profilu:"
    },
    profileStrongPoints: {
        "EN": "Strong Points:",
        "FR": "Points Forts:",
        "PL": "Silne strony:"
    },
    profileWeakPoints: {
        "EN": "Weak Points:",
        "FR": "Points Faibles:",
        "PL": "Słabe strony:"
    },
    profilePageBtitle: {
        "EN": "Profile Description",
        "FR": "La Description du profil",
        "PL": "Opis profilu"
    },
    strongAndWeak: {
        "EN": "Profile Strengths and Weaknesses",
        "FR": "Points Forts et Points Faibles du Profil",
        "PL": "Mocne i Słabe Strony Profilu"
    },
    nadPageTitle: {
        "EN": "NAD Values",
        "FR": "Valeurs NAD",
        "PL": "Wartości NAD"
    },
    nadHigh: {
        "EN": "Expected Neurobiological Effects\nIn Case Of A High Score:",
        "FR": "Effets Neurobiologiques Attendu\nEn Cas De Résultats Élevés:",
        "PL": "Oczekiwane Efekty Neurobiologiczne\nW Przypadku Wysokiego Wyniku:"
    },
    nadLow: {
        "EN": "Examples Of Solutions\nIn Case Of A Low Score:",
        "FR": "Exemples De Solutions\nEn Cas De Faible Résultat:",
        "PL": "Przykładowe Rozwiązania\nW Przypadku Niskiego Wyniku:"
    },
    meaning : {
        "EN": "Score Meaning:",
        "FR": "Signification du résultat:",
        "PL": "Znaczenie wyniku:"
    },
    develop: {
        "EN": "How to increase child’s learning efficiency?",
        "FR": "Comment puis-je améliorer l’efficacité d’apprentissage de mon enfant?",
        "PL": "W jaki sposób można podnieść u dziecka skuteczność w uczeniu się?"
    },
    qnadDevelop: {
        "EN": "How to increase child’s learning efficiency?",
        "FR": "Comment puis-je améliorer l’efficacité d’apprentissage de mon enfant?",
        "PL": "W jaki sposób można podnieść u dziecka skuteczność w uczeniu się?"
    },
    socialSuccessFactorsLabel: {
        "EN": "Social Success Factors",
        "FR": "Facteurs De Réussite Sociale",
        "PL": "Czynniki Sukcesu Społecznego"
    },
    socialSuccessFactorsDescription: {
        "EN": "Social skills have a significant impact on making major progresses in many areas of life and achieving professional and private success. Achieving social success is possible thanks to finding the right position within social group and maintaining good relationships with surrounding people.",
        "FR": "Les compétences sociales ont un impact significatif sur la réalisation de progrès importants dans de nombreux domaines de la vie et sur l’accomplissement professionnel et privé. La réussite sociale est possible en trouvant la bonne position dans le groupe et en maintenant de bonnes relations avec les personnes qui le constituent.",
        "PL": "Umiejętności społeczne mają znaczący wpływ na dokonywanie dużych postępów w wielu dziedzinach życia i osiąganie sukcesów zawodowych i prywatnych. Osiągnięcie sukcesu społecznego jest możliwe dzięki znalezieniu właściwej pozycji w grupie społecznej i utrzymywaniu dobrych relacji z otaczającymi ludźmi."
    },
    emotionalLabel: {
        "EN": "Emotional Intelligence",
        "FR": "Intelligence émotionnelle",
        "PL": "Inteligencja Emocjonalna"
    },
    emotionalDescription: {
        "EN": "Emotional intelligence is the ability to recognize, understand and manage one’s own emotions and skilfully analyze and deal with emotions of the others. It is a very valued skill, really important in personal and professional life.",
        "FR": "L’intelligence émotionnelle est un ensemble d’habiletés et d’attitudes intra personnelles et sociales, ainsi qu’une corrélation entre les intentions et les actions réellement entreprises. Plus le niveau est élevé, plus il est facile pour une personne de faire face à ses émotions naissantes, d'être capable de les reconnaître et de persévérer dans ses décisions.",
        "PL": "Inteligencja emocjonalna to zespół umiejętności i postaw intrapersonalnych oraz społecznych oraz korelacja zamierzeń do faktycznie podejmowanych działań. Im wyższy poziom, tym łatwiej osoba radzi sobie z pojawiającymi się emocjami, potrafi je rozpoznawać i wytrwać w swoich postanowieniach."
    },
    individualSuccessLabel: {
        "EN": "Individual Success Factors",
        "FR": "Facteurs De Réussite Personnelle",
        "PL": "Czynniki Sukcesu Osobistego"
    },
    individualSuccessDescription: {
        "EN": "Personal success is possible thanks to good self-knowledge, setting goals and perseverance in pursuing them. Ambition and motivation for continuous self-development is indispensable in achieving individual success.",
        "FR": "La réussite personnelle est possible grâce à la conscience de soi, à la fixation d’objectifs et à la persévérance dans la réalisation de ces objectifs. L’ambition et la motivation pour un développement personnel continu sont nécessaires pour réussir individuellement.",
        "PL": "Osobisty sukces jest możliwy dzięki samoświadomości, wyznaczaniu celów i wytrwałości w ich realizacji. Ambicja i motywacja do ciągłego samorozwoju są niezbędne do osiągnięcia indywidualnego sukcesu."
    },
    strategyParentsLabel: {
        "EN": "Parents Commitment<span>Required To Enhance Student Results</span>",
        "FR": "Engagement Parental Attendu <span>Pour Améliorer Les Performances Scolaires De L’enfant</span>",
        "PL": "Przewidywane Zaangażowanie Rodziców <span>W Celu Poprawy Wyników Szkolnych Dziecka</span>"
    },
    strategyActionsLabel: {
        "EN": "Personal Intervention Strategy",
        "FR": "Stratégie Individuelle d’Intervention",
        "PL": "Indywidualna Strategia Działania"
    },
    strategyPriorityHigh: {
        "EN": "Urgent",
        "FR": "Urgente",
        "PL": "Pilne"
    },
    strategyPriorityMedium: {
        "EN": "Important",
        "FR": "Importante",
        "PL": "Ważne"
    },
    strategyPriorityLow: {
        "EN": "Optional",
        "FR": "Optionelle",
        "PL": "Opcjonalne"
    },
    expectedResults: {
        "EN": "Expected results",
        "FR": "Effet escompté",
        "PL": "Oczekiwane efekty"
    },
    mostUrgent: {
        "EN": "Most Urgent Interventions",
        "FR": "Intervention la plus urgente",
        "PL": "Najbardziej Pilne Interwencje"
    }
}


// Static text for PDFs
const staticTextsForReport = {
    titles: {
        "EN": "BRAINCORE PRO\n TEST RESULTS",
        "FR": "Résultat du test\n BrainCore PRO",
        "PL": "Wyniki testu\n BrainCore PRO"
    },
    individualCognitiveProfile: {
        "EN": "INDIVIDUAL COGNITIVE PROFILE",
        "FR": "PROFIL COGNITIF INDIVIDUEL",
        "PL": "Indywidualny profil poznawczy"
    },
    tableOfContents: {
        "EN": "Table of contents",
        "FR": "Table des matières",
        "PL": "Spis treści"
    },
    profileSummary: {
        "EN": "Your cognitive profile summary",
        "FR": "Résumé de votre profil cognitif",
        "PL": "Podsumowanie Twojego profilu poznawczego"
    },
    profileAttributes: {
        "EN": "Proﬁle attributes",
        "FR": "Attributs du profil",
        "PL": "Cechy profilu"
    },
    nadSummary: {
        "EN": "NAD Values Scores",
        "FR": "Scores des valeurs NAD",
        "PL": "Wyniki Twoich wartości NAD"
    },
    nadValuesShortDescription: {
        "EN": "The NAD model allows you to identify the specific traits that characterize your learning strategy.",
        "FR": "Le modèle NAD permet d’identifier les traits spécifiques qui caractérisent votre stratégie d’apprentissage.",
        "PL": "Model NAD pozwala określić cechy, które są specyficzne dla Twojej strategii uczenia się."
    },
    nadLowestHighestDescription: {
        "EN": "Every brain naturally develops its own learning strategy. We've highlighted your two most important values below.",
        "FR": "Chaque cerveau développe naturellement une stratégie d’apprentissage qui lui convient. Nous vous présentons ci-dessous vos deux valeurs les plus marquées.",
        "PL": "Każdy mózg w naturalny sposób opracowuje własną, najbardziej dla siebie odpowiednią strategię uczenia się. Oto Twoje dwie najważniejsze wartości."
    },
    nadLowest: {
        "EN": "Least favourable NAD value for learning",
        "FR": "Valeur NAD la moins favorable pour apprendre",
        "PL": "Najsłabsza wartość NAD"
    },
    nadHighest: {
        "EN": "Most favourable NAD value for learning",
        "FR": "Valeur NAD la plus favorable pour apprendre",
        "PL": "Najsilniejsza wartość NAD"
    },
    personalityTraitsInBusiness: {
        "EN": "Personal characteristics in relation to the professional environment",
        "FR": "Traits personnels en relation avec le monde professionnel",
        "PL": "Cechy osobowości w odniesieniu do środowiska zawodowego"
    },
    personalityTraitsInBusinessDescription: {
        "EN": "Your key skills",
        "FR": "Vos compétences clés",
        "PL": "Twoje kluczowe umiejętności"
    },
    selectedSolutions: {
        "EN": "Selected solutions",
        "FR": "Solutions sélectionnées",
        "PL": "Wybrane rozwiązania"
    },
    competencesOfTheFuture: {
        "EN": "COMPETENCES OF THE FUTURE",
        "FR": "Compétences clés du futur",
        "PL": "KOMPETENCJE PRZYSZŁOŚCI"
    },
    competencesOfTheFutureDescription: {
        "EN": "The 4 key competences of the 21st century",
        "FR": "Les 4 compétences clés du 21ème siècle",
        "PL": "4 kluczowe kompetencje XXI wieku"
    },
    actionsToTake: {
        "EN": "Recommended activies",
        "FR": "Actions recommandées",
        "PL": "Zalecane działania"
    },
    profile: {
        "EN": "PROFILE",
        "FR": "Profil",
        "PL": "PROFIL"
    },
    shortStory: {
        "EN": "SHORT STORY",
        "FR": "Court récit",
        "PL": "KRÓTKA HISTORIA"
    },
    mainLearningStyle: {
        "EN": "MAIN LEARNING STYLE",
        "FR": "Style principal d'apprentissage",
        "PL": "GŁÓWNY STYL UCZENIA SIĘ"
    },
    characteristics: {
        "EN": "Characteristics",
        "FR": "Caractéristiques",
        "PL": "Charakterystyka"
    },
    detailedReport: {
        "EN": "DETAILED REPORT",
        "FR": "Rapport détaillé",
        "PL": "RAPORT SZCZEGÓŁOWY"
    },
    nadValues: {
        "EN": "NAD VALUES",
        "FR": "Valeurs NAD",
        "PL": "WARTOŚCI NAD"
    },
    withAreasOfDevelopment: {
        "EN": "WITH  AREAS OF DEVELOPMENT",
        "FR": "avec domaines de développement",
        "PL": "WRAZ Z OBSZARAMI ROZWOJU"
    },
    value: {
        "EN": "VALUE",
        "FR": "Valeur",
        "PL": "WARTOŚĆ"
    },
    personalDescription: {
        "EN": "Personal description",
        "FR": "Description personnelle",
        "PL": "Opis indywidualny"
    },
    areasOfDevelopment: {
        "EN": "AREAS OF DEVELOPMENT",
        "FR": "Domaines de développement",
        "PL": "OBSZARY ROZWOJU"
    },
    opportunitiesIntroduction: {
        "EN": "This section contains potential oppportunity for improvement with a corresponding suggested solution directly below it. Consider checking off those you find most relevant for the future reference.",
        "FR": "Cette section contient de possibles opportunités d'amélioration suivies juste en dessous d'une solution suggérée. N'hésitez pas à cocher celles que vous trouvez judicieuses pour y revenir plus tard.",
        "PL": "Ta część zawiera możliwe do rozwoju obszary wraz z propozycjami rozwiązań. Zaznacz te obszary, które wydają Ci się odpowiednie, i nad którymi możesz pracować w przyszłości."
    },
    sociologicalAspects: {
        "EN": "Sociological aspects",
        "FR": "Aspects sociologiques",
        "PL": "Aspekty socjologiczne"
    },
    psychologicalAspects: {
        "EN": "Psychological aspects",
        "FR": "Aspects psychologiques",
        "PL": "Aspekty psychologiczne"
    },
    developmentAspects: {
        "EN": "Development aspects",
        "FR": "Aspects pédagogiques",
        "PL": "Aspekty rozwojowe"
    },
    opportunitiesForImprovement: {
        "EN": "Opportunities for improvement",
        "FR": "Opportunités d'améliorations",
        "PL": "Obszary możliwe do rozwoju"
    },
    suggestedSolution: {
        "EN": "Suggested solution",
        "FR": "Solution suggérée",
        "PL": "Sugerowane rozwiązanie"
    },
    c4Values: {
        "EN": "C4 VALUES",
        "FR": "4C de l'OCDE",
        "PL": "WARTOŚCI C4"
    },
    competencesOfTheFuture: {
        "EN": "KEY SKILLS OF THE FUTURE",
        "FR": "COMPETENCES CLES DU FUTUR",
        "PL": "Kluczowe kompetencje przyszłości"
    },
    socialSuccessFactorsLabel: {
        "EN": "Social Success Factors",
        "FR": "Facteurs de réussite sociale",
        "PL": "Czynniki sukcesu społecznego"
    },
    personalSuccessFactorsLabel: {
        "EN": "Personal Success Factors",
        "FR": "Facteurs de réussite personnelle",
        "PL": "Czynniki sukcesu osobistego"
    },
    emotionalIntelligenceInRelationsWithOthersLabel: {
        "EN": "Emotional Intelligence in relations with others",
        "FR": "Intelligence émotionnelle en relation avec les autres",
        "PL": "Inteligencja emocjonalna w relacjach z innymi"
    },
    selfManagementLabel: {
        "EN": "Self-management",
        "FR": "Gestion de soi",
        "PL": "Zarządzanie sobą"
    },
    lastPageNicelyDone: {
        "EN": "Nicely done!",
        "FR": "Bien joué !",
        "PL": "Dobra robota!"
    },
    lastPageYouMadeYourFirstStep: {
        "EN": "You’ve just made your first step\n on the journey of self-discovery!",
        "FR": "Vous venez de faire le premier pas\n sur le chemin de la découverte de soi !",
        "PL": "Właśnie zrobiłaś/zrobiłeś pierwszy krok\n na drodze w odkrywaniu siebie!"
    },
    lastPageText: {
        "EN": "We hope this detailed report has helped you learn a little more about yourself. We designed it as a tool to help you find the best way to progress and develop your skills in the most effective way possible. If your results are not what you expected, don't worry or get discouraged. We're convinced that, with a little hard work, you can easily maintain your progress and ensure you're ready to take on the challenges of the future!   Our BrainCore Acadmey mobile app will allow you to train, and track your scores and personal development progress in an engaging way. Available from autumn 2023 the app will set out actions to take, tailored to your profile. Try implementing the suggestions offered by your virtual coach in your daily life and challenge your habits with them. Positive change is within your grasp if you decide to take the following steps. Consider repeating the test in a few months' time, to see how you've developed over this period.  This autumn, you will receive a link to activate your personal app, which will provide you with a wealth of personalised advice.",
        "FR": "Nous espérons que ce rapport détaillé vous a aidé à en savoir un peu plus sur vous-même. Nous l'avons conçu comme un outil qui devrait vous aider à trouver la meilleure voie pour progresser et développer vos compétences de la manière la plus efficace possible. Si vos résultats ne sont pas ceux que vous attendiez, ne vous inquiétez pas et ne vous découragez pas. Nous sommes convaincus qu'avec un peu de travail, vous pourrez facilement continuer votre progression et vous préparer à relever les défis de l'avenir !   Notre application mobile BrainCore Academy vous permettra de vous entraîner, de suivre vos scores et vos progrès en matière de développement personnel de façon attrayante. Disponible dès l’automne 2023, elle contiendra des actions à entreprendre adaptées à votre profil. Essayez de mettre en œuvre les suggestions proposées par votre coach virtuel dans votre quotidien et défiez vos habitudes avec elles. Des changements positifs sont à votre portée, si vous décidez de franchir les étapes suivantes. Envisagez ensuite de refaire le test dans quelques mois, pour voir comment vous avez évolué pendant cette période.  Vous recevrez cet automne un lien pour activer votre application personnelle, qui vous permettra de recevoir de nombreux conseils personnalisés.",
        "PL": "Mamy nadzieję, że ten szczegółowy raport wzbogacił Twoją wiedzę o sobie. Zaprojektowaliśmy go jako narzędzie umożliwiające Ci znalezienie najlepszego i najbardziej efektywnego sposobu na postęp oraz rozwój Twoich umiejętności. Nie martw się ani nie zniechęcaj, jeśli wyniki odbiegały od Twoich oczekiwań. Jesteśmy przekonani, że przy odrobinie wysiłku będziesz z łatwością czynić postępy i przygotujesz się na wyzwania przyszłości!   Nasza aplikacja BrainCore Academy pozwoli Ci trenować umysł oraz śledzić postępy w niezwykle inspirujący sposób. Dostępna od jesieni 2023 roku, będzie zawierać działania dostosowane do Twojego profilu. Wdrażaj sugestie wirtualnego trenera w swoim codziennym życiu i rzuć wyzwanie swoim dotychczasowym nawykom. Jeśli zdecydujesz się podjąć kolejne kroki, pozytywne zmiany będą na wyciągnięcie ręki. Następnie, rozważ ponowne wykonanie testu za kilka miesięcy, aby zorientować się jakie zmiany nastąpiły.  Tej jesieni otrzymasz link do aktywacji aplikacji, która da Ci dostęp do wielu wartościowych (dostosowanych do Ciebie) porad."
    },
    lastPageYourOpinionTitle: {
        "EN": "Your opinion matters",
        "FR": "Votre opinion compte",
        "PL": "Twoja opinia ma znaczenie"
    },
    lastPageYourOpinionText: {
        "EN": "We would very much like to hear your opinion on the content of this report. This is why we are conducting a survey, which will allow us to improve or complete the content to better meet your needs. The survey consists of 10 questions and the time required to answer them is 2 minutes. You are free to respond anonymously or by name.",
        "FR": "Nous aimerions beaucoup connaître votre opinion par rapport au contenu de ce rapport. C’est pourquoi nous effectuons un sondage, qui nous permettra d’en améliorer ou compléter le contenu pour mieux répondre à vos besoins. Le sondage se compose de 10 questions et le temps requis pour y répondre est de 2 minutes. Vous êtes libre d'y répondre de manière anonyme ou nominative.",
        "PL": "Bardzo chcielibyśmy poznać Państwa opinię na temat treści niniejszego raportu. Dlatego przeprowadzamy ankietę, która pozwoli nam ulepszyć lub uzupełnić treść, aby lepiej odpowiadała Twoim potrzebom. Ankieta składa się z 10 pytań, a czas potrzebny na udzielenie odpowiedzi to 2 minuty. Możesz odpowiedzieć anonimowo lub z imienia i nazwiska."
    },
    lastPageYourOpinionButton: {
        "EN": "I want to participate",
        "FR": "Je participe",
        "PL": "Biorę udział"
    },
    lastPageStayInformed: {
        "EN": "Follow the development of our personalized educational solutions for students, collaborators and parents",
        "FR": "Suivez le développement de nos solutions pédagogiques personnalisées pour les étudiants, les collaborateurs et les parents",
        "PL": "Śledź rozwój naszych spersonalizowanych rozwiązań edukacyjnych dla uczniów, pracowników i rodziców."
    },
    lastPageWebsite: {
        "EN": "Visit our website",
        "FR": "Consultez notre site internet",
        "PL": "Odwiedź naszą stronę internetową"
    },
    lastPageNewsletter: {
        "EN": "Subscribe to our newsletter",
        "FR": "Abonnez-vous à notre newsletter",
        "PL": "Zapisz się do naszego newslettera"
    },
    lastPageSocial: {
        "EN": "Follow us on social networks",
        "FR": "Suivez-nous sur les réseaux sociaux",
        "PL": "Śledź nas na portalach społecznościowych"
    },
    allBlocksIntroduction: {
        "EN": "In our research and experiences, we meet people with similar performance characteristics to you. We collect a lot of information about their style of action and thinking and analyse it. That is why we guarantee the reliability of the summary you are about to read. The results, descriptions and solutions presented are tailored as much as possible to your profile. Think of them as a beacon for your development. Try to understand their meaning and their impact on your life. By implementing the proposed solutions, you have the opportunity to increase your potential mind, your effectiveness. By acting in harmony with your neurobiological profile, you will be able to build on your strengths, strengthen the structures you have already developed and develop new ones to access other capacities.",
        "FR": "Dans le cadre de nos recherches, nous rencontrons des personnes présentant des caractéristiques de performance similaires aux vôtres. Nous recueillons de nombreuses informations sur leur style d'action et de pensée et nous les analysons. C'est pourquoi nous garantissons la fiabilité du résumé que vous allez lire. Les résultats, descriptions et solutions présentés sont adaptés autant que possible à votre profil. Considérez-les comme une balise pour votre développement. Efforcez-vous de comprendre leur signification et leur impact sur votre vie. En mettant en œuvre les solutions proposées, vous avez la possibilité d'augmenter votre efficacité. En agissant en harmonie avec votre profil neurobiologique, vous pourrez vous appuyer sur vos points forts, renforcer les structures que vous avez déjà développées et en développer de nouvelles pour accéder à d'autres capacités.",
        "PL": "Realizując nasze badania, zbierając doświadczenia, spotykamy ludzi o podobnej do Twojej charakterystyce wyników. Zbieramy wiele informacji dotyczących stylu działania, myślenia i poddajemy je analizom. W związku z tym gwarantujemy rzetelność podsumowania, które za chwilę przeczytasz. Przedstawione wyniki, opisy i rozwiązania są maksymalnie dopasowane do Twojego profilu. Postaraj się potraktować je jako drogowskazy rozwoju. Włóż wysiłek w zrozumienie ich znaczenia i to jak przekładają się na Twoje życie. Dzięki wdrożeniu proponowanych rozwiązań masz okazję zwiększyć swój potencjał umysłu, efektywność działań. Poprzez harmonijne działania zgodne z Twoim neurobiologicznym profilem masz możliwość korzystać z posiadanych silnych stron, wzmacniać już rozwinięte struktury oraz rozwijać nowe- umożliwiające dostęp do innych zdolności."
    },
    nadValuesIntroduction: {
        "EN": "NAD (Neuro Activated Diagnostic) values are derived from a mathematical model developed through our pedagogical research.  This model can be used to describe the cognitive processes specific to a learning strategy, in particular the degree of intrinsic motivation, emotional stability, communication skills, and willingness to make regular effort. The latest discoveries in neuroscience have clearly shown that these qualities are essential for developing effective brain training and consolidating long-term memory.  Thanks to these unique values, we can draw up an assessment of your current cognitive functioning and then suggest possible avenues for improvement. These tips are intended to optimise your learning abilities, increase your capacity for abstraction and develop your transversal skills as a whole.",
        "FR": "Les valeurs NAD (Neuro Activated Diganostic) sont des variables assimilées au sein d’un modèle mathématique découvert grâce à nos recherches en pédagogie.   Ce modèle permet de décrire les processus cognitifs spécifiques à une stratégie d’apprentissage, notamment le degré de motivation intrinsèque, la stabilité émotionnelle, les capacités communicationnelles et le goût pour l’effort régulier. Les dernières découvertes en neurosciences ont clairement mis en évidence que ces qualités sont essentielles pour développer un entraînement cérébral efficace et consolider durablement la mémoire à long terme.   Grâce à ces valeurs uniques, nous pouvons établir un bilan de votre fonctionnement cognitif actuel et vous proposer ensuite des voies d’améliorations possibles. Ces conseils ont pour but d’optimiser vos capacités d’apprentissage, d’augmenter votre capacité d’abstraction et de développer globalement vos compétences transversales.",
        "PL": "Wartości NAD (Neuro Activated Diganostic) to wartości uzyskane w wyniku zastosowania modelu matematycznego utworzonego przez nas podczas badań edukacyjnych.   Model ten można wykorzystać do opisania procesów poznawczych, specyficznych dla strategii uczenia się, w szczególności: stopnia wewnętrznej motywacji, stabilności emocjonalnej, umiejętności komunikacyjnych i motywacji do podejmowania regularnego wysiłku. Najnowsze odkrycia w dziedzinie nauki dotyczącej mózgu i układu nerwowego wyraźnie dowodzą, że cechy te są niezbędne do opracowania skutecznego treningu mózgu – w celu przenoszenia kodowanych przez niego informacji z pamięci krótkotrwałej do długotrwałej.   Dzięki tym unikalnym wartościom możemy sporządzić ocenę Twojego obecnego funkcjonowania poznawczego, a następnie zasugerować sposoby jego poprawy. Celem tych porad jest zoptymalizowanie Twoich zdolności uczenia się, zwiększenie zdolności do myślenia abstrakcyjnego i rozwinięcie kompetencji przekrojowych jako całości."
    },
    competencesOfTheFutureIntroduction: {
        "EN": "Faced with the challenges of the 21st century (new industrial era, development of digital technologies, accelerating changes in social systems), a group of researchers - the Partnership for 21st Century Skills - has drawn up a list of 4 key skills that will ensure adaptability to the labour market, to new occupations (some of which do not yet exist) and to lifelong learning.  The 4Cs are Collaboration, Communication, Creativity and Critical Thinking.\n  Employers point out that people are capable of acquiring technical skills quickly, but that without these 4 key skills, they will not be ready to do so.   In the remainder of this report, we present the scores you obtained for these 4 particular measurements.",
        "FR": "Face aux défis du 21ème siècle (nouvelle ère industrielle, développement des technologies numériques, accélération des mutations des systèmes sociaux), un groupe de chercheurs - le Partenariat pour les compétences du 21e siècle - a élaboré une liste de 4 compétences clés qui assureront l'adaptabilité au marché du travail, aux nouveaux métiers (dont certains n'existent pas encore) et à l'apprentissage continu.   Les 4C sont : la Collaboration, la Communication, la Créativité et l’Esprit Critique.\n  Les employeurs soulignent que les gens sont capables d'acquérir rapidement des compétences techniques, mais que sans ces 4 compétences clés, ils ne seront pas prêts à le faire.  Dans la suite de ce rapport nous présentons les scores que vous avez obtenus pour ces 4 dimensions particulières.",
        "PL": "W obliczu wyzwań XXI wieku (związanych z nową erą przemysłową, rozwojem technologii cyfrowych, przyspieszeniem zmian społecznych) grupa naukowców – Partnerstwo Na Rzecz Umiejętności XXI wieku – sporządziła listę 4 kluczowych umiejętności, które zapewnią dostosowanie się do rynku pracy, przyuczenie się do nowych zawodów (niektóre jeszcze nie istnieją), a także gotowość do ciągłego uczenia się.  Tymi umiejętnościami są: współpraca, komunikacja, kreatywność i krytyczne myślenie.\n  Pracodawcy podkreślają, że ludzie są w stanie szybko zdobywać umiejętności techniczne, ale nie posiadając tych 4 kluczowych umiejętności, nie będą odpowiednio zmotywowani do ich stosowania.  W dalszej części niniejszego raportu przedstawiamy wyniki uzyskane w tych 4 konkretnych wymiarach."
    },
    personalityTraitsInBusinessIntroduction: {
        "EN": "Personality traits refer to the fairly consistent ways in which we react emotionally, cognitively and behaviourally. We can observe them, or assume their existence based on observation. Using our questionnaire, we can measure some 20 traits that influence your performance at work. They are rooted in the recognised theories of personality psychology and work psychology.\n  In this section, you will learn how your personality can be expressed in a professional context. It is sometimes difficult to identify universally important character traits. However, for each of the 15 personality traits, we have described possible behaviours according to your personal scores.\n   The 15 personality traits are divided into 4 sections:",
        "FR": "Les traits de personnalité sont des façons, assez constantes, de réagir sur le plan émotionnel, cognitif et comportemental. Nous pouvons les observer, ou supposer leur existence sur la base de l'observation. Avec notre questionnaire, nous avons la possibilité de mesurer près de 20 traits qui influencent votre performance au travail. Ils sont fondés sur les théories reconnues de la psychologie de la personnalité et de la psychologie du travail.\n   En lisant cette section, vous apprendrez comment votre personnalité peut s’exprimer dans un contexte professionnel. Il est parfois difficile d'identifier des traits de caractère d'importance universelle. Toutefois, nous avons décrit pour chacun des 15 traits de personnalité des comportements possibles en fonction de vos scores personnels.\n  Les 15 traits de personnalité sont répartis en 4 sections :",
        "PL": "Osobowość – to nasz indywidualny, dość stały sposób reagowania emocjonalnego poznawczego i behawioralnego. Dyspozycje osobnicze można wyraźnie zauważać lub zakładać ich istnienie na podstawie obserwacji. Za pomocą naszego kwestionariusza możemy zmierzyć blisko 20 cech, które wpływają na Twoją wydajność w pracy. Są one oparte na uznanych teoriach psychologii osobowości i psychologii pracy.\n  Ta sekcja pozwoli Ci dowiedzieć się, w jaki sposób Twoja osobowość może wyrażać się w kontekście zawodowym. Czasami trudno jest zidentyfikować cechy o uniwersalnym znaczeniu. Jednak dla każdej z 15 cech osobowości opisaliśmy możliwe zachowania w oparciu o Twoje osobiste wyniki.\n  15 cech osobowości podzielono na 4 grupy:"
    },
    shortStoryIntroduction: {
        "EN": "Read the story of someone whose way of thinking is similar to yours.",
        "FR": "Lisez le récit d'une personne dont la façon de penser est similaire à la vôtre.",
        "PL": "Przeczytaj krótką historię osoby, której sposób myślenia jest podobny do Twojego."
    },
    lexicon: {
        "EN": "Glossary of terms",
        "FR": "Lexique",
        "PL": "Słowniczek"
    },
    nadChartDescription: {
        "EN": "Representation of the NAD variables obtained. The centre bar represents your current average.",
        "FR": "Représentation des variables NAD obtenues. La barre centrale représente votre moyenne actuelle.",
        "PL": "Przedstawienie zmiennych uzyskanych na podstawie modelu matematycznego NAD (Neuro Activated Diagnostic). Środkowy pasek reprezentuje bieżącą średnią."
    },
    competencesOfTheFutureShortIntroduction: {
        "EN": "According to UNESCO and the World Economic Forum (WEF), the four key competencies for success are communication, collaboration, creativity and critical thinking. These skills are combined under the label “\xa04C\xa0”. Below are your scores.",
        "FR": "Selon l'UNESCO et le Forum économique mondial (WEF), les quatre compétences clés pour réussir sont la communication, la collaboration, la créativité et l'esprit critique. Ces compétences sont réunies sous le label «\xa04C\xa0». Vous trouvez ci-dessous les scores que vous avez obtenus.",
        "PL": "Według UNESCO i Światowego Forum Ekonomicznego (WEF) czterema kluczowymi kompetencjami do osiągnięcia sukcesu są: komunikacja, współpraca, kreatywność oraz krytyczne myślenie. Umiejętności te są zgrupowane pod etykietą '\xa04C\xa0';Poniżej znajdują się uzyskane przez Ciebie wyniki."
    },
    nadValuesExplanation: {
        "EN": "NAD values are the result of our neuro-pedagogical research. They are linked to complex cognitive processes, and BrainCore Coach training is essential if we want to understand their full scientific meaning.  Only certified BrainCore coaches are able to debrief these values. For more information, a list of certified coaches by country and upcoming BrainCore Coach training dates, visit www.braincore.app/coach  In this report, we decided to take an essentially psycho-pedagogical approach to provide you with keys to personal development, as well as a few tips for optimising your learning skills.  From autumn 2023, you will receive an activation key for your personal BrainCore Academy app, which will contain activities, micro-courses and many other tools to help you continue your development together with your virtual coach who will accompany you into the fascinating world of educational neuroscience.",
        "FR": "Les valeurs NAD sont le fruit de nos recherches en neuro-pédagogie. Elles sont liées à des processus cognitifs complexes, qui nécessitent une formation de Coach BrainCore pour qu’elles puissent révéler l’ensemble de leurs significations scientifiques.  Seuls les coachs BrainCore certifiés sont autorisés à opérer un débriefing de ces valeurs. Vous trouverez davantage d’informations à ce propos, ainsi qu’une liste de coachs certifiés par pays et les prochaines dates de formation de coach BrainCore sur le site www.braincore.app/coach   Dans ce rapport, nous avons décidé de vous présenter une approche essentiellement psychopédagogique pour vous apporter des clés de développement personnel, ainsi que quelques conseils pour optimiser vos compétences d’apprentissage.  Dès l’automne 2023, vous recevrez une clé d’activation pour votre application personnelle BrainCore Academy dans laquelle vous trouverez des activités, des micro-cours ainsi que bien d’autres outils pour vous permettre de poursuivre votre développement en découvrant votre coach virtuel qui vous accompagnera dans l’univers fascinant des neurosciences pédagogiques.",
        "PL": "Wartości NAD są owocami naszych badań w dziedzinie neuropedagogiki. Są one powiązane ze złożonymi procesami poznawczymi, które – jeśli mają ujawnić swoje pełne naukowe znaczenie – wymagają treningu prowadzonego przez BrainCore Coacha.  Jedynie certyfikowani trenerzy BrainCore są upoważnieni do przeprowadzania treningu poprzez debriefing tych wartości. Więcej informacji na ten temat, a także listę certyfikowanych trenerów według kraju i nadchodzących terminy szkoleń dla trenerów BrainCore można znaleźć na stronie www.braincore.app/coach  W niniejszym raporcie postanowiliśmy przedstawić Ci zasadniczo podejście psychopedagogiczne, które stanowi klucz do rozwoju osobistego, a także przekazać kilka wskazówek dotyczących optymalizacji uczenia się.  Jesienią 2023 roku otrzymasz klucz aktywacyjny do swojej osobistej aplikacji  BrainCore Academy, zawierającej aktywności, mikrokursy i wiele innych narzędzi pomocnych w kontynuowaniu rozwoju. Poznasz swojego wirtualnego trenera, który będzie Ci towarzyszył w fascynującym uniwersum neuronauki edukacyjnej."
    },
    nadValuesSubtitle: {
        "EN": "Welcome to the educational world of NAD values",
        "FR": "Bienvenue dans l’univers pédagogique des valeurs NAD",
        "PL": "Witamy w edukacyjnym świecie wartości NAD"
    },
    NadValueHigh: {
        "EN": "Your scores indicate that you have sufficient autonomy to learn effectively. We have no recommendations for you at this time. However, we are certain that everyone can always optimize their own learning style. We're working on new protocols that you'll soon find in our application.",
        "FR": "Vos scores indiquent que vous possédez suffisamment d’autonomie pour apprendre de manière efficace. Nous n’avons pour l’instant aucune recommandation à vous proposer. Nous sommes toutefois certains que chacun peut toujours optimiser sa façon d’apprendre. Nous travaillons sur de nouveaux protocoles que vous trouverez prochainement dans notre application.",
        "PL": "Twoje wyniki wskazują na to, że masz wystarczające zasoby, by efektywnie uczyć się samodzielnie. Na tym etapie nie mamy dla Ciebie żadnych zaleceń. Jesteśmy jednak pewni, że każdy może doskonalić swój sposób uczenia. Pracujemy nad nowymi rozwiązaniami, które wkrótce znajdziesz w swojej aplikacji."
    }
}




// Calculate median from array of values
function calculateMedian(values) {
    if (values.length === 0) throw new Error("No inputs");

    values.sort(function (a, b) {
        return a - b;
    });

    var half = Math.floor(values.length / 2);

    if (values.length % 2)
        return values[half];

    return (values[half - 1] + values[half]) / 2.0;
}


// Auto-detect gender based on BC test results
// - resultData - data/answers in the result
// - return <string>: ['male', 'female']
exports.getGender = (resultData) => {
    let value = resultData["2607"]//Pedagogy -F=1 M=2
    if (value) {
        if (value?.toString() == '1') return "female"
        else return "male"
    }
    else {
        value = resultData["9992"]// Adult - M=1 F=2
        if (value?.toString() == '2') return "female"
        else return "male"
    }
}

// Auto-detect reader-type based on BC test results
// - readerType - type of user for which the report will be displayed
// - resultData - data/answers in the result
exports.getReaderType = (resultData) => {
    if (resultData && resultData["2608"]) return 'student'
    else return 'employee'
}

// Auto-detect age group based on reader-type and BC test results
// - readerType - type of user for which the report will be displayed
// - resultData - data/answers in the result
exports.getAgeGroup = (readerType, resultData) => {
    // Adult age by default
    let ageGroup = 24

    if (['student', 'teacher', 'parent'].includes(readerType)) {
        // For those readers 18 is a default
        ageGroup = 18
        // In Pedagogy test 2608 is the id of question about age
        if (resultData && resultData["2608"]) {
            age = parseInt(resultData["2608"])
            ageGroup = 12
            if (age > 12) ageGroup = 15
            if (age > 15) ageGroup = 18
        }
    }
    return ageGroup
}

// Check if user result is blocked by credits
// ARGS:
// userId - id of the user
exports.isBlockedByCredits = async function (userId) {
    let query = { user: userId, 'content': { $in: braincoreTestsIds }, blockedByCredits: true}
    var isBlocked = await Result.exists(query)
    return isBlocked;
}

// Find the latest BrainCore result for provided user id
// ARGS:
// userId - id of the user
// selectedFields - when provided it will only return requested fields
exports.getLatestBrainCoreResultForUser = async function (userId, selectedFields={}) {
        // Find already processed results
        let query = { user: userId, 'content': { $in: braincoreTestsIds }, traits: { $exists: true, $ne: [] }}
        var userResult = await Result.findOne(query, selectedFields)
            .populate({ path: 'user', select: ["name", "surname", "email"] })
            .sort({ createdAt: 'desc' })// first the latest results
            .exec()
        return userResult;
}


// Find list of latest results for provided users ids
// usersIds - list of users ids
exports.getLatestBrainCoreResultsForUsers = async function (usersIds) {
    // #######################################################################################
    // Find the latest traits from BrainCore results for each of the user on the list
    let results = []

    if (!usersIds) return results;
    
    for (let userId of usersIds) {
        // Find already processed results
        var userResults = await exports.getLatestBrainCoreResultForUser(userId)
        // If results are not existing - skip this user
        if (!userResults) continue;
        // If exists, add latest result of this user to the lis
        results.push(userResults)
    }

    return results
}


// Load list of users with basic informations about them and their individual traits
// results - list of users results
// traitsKeys - list of traits names(keys) to process
exports.getUsersWithTraits = async function (users, results, traitsKeys = [], readerType, lang = 'en') {
    console.log("FOR USERS", users.length)
    let resultsMap = new Map();
    results.forEach(result => resultsMap.set(result.user._id.toString(), result));

    let usersToReturn = users.map(async user => {
        let userResults = resultsMap.get(user._id.toString());
        let traits = userResults ? await this.getTraits([userResults], traitsKeys, readerType, lang) : {};

        let simpleTraits = traitsKeys.reduce((obj, traitKey) => ({
            ...obj,
            [traitKey]: {
                shortName: traits[traitKey]?.shortName,
                abbreviation: traits[traitKey]?.abbreviation,
                level: traits[traitKey]?.level,
                normalizedValue: traits[traitKey]?.normalizedValue,
                min: traits[traitKey]?.min,
                max: traits[traitKey]?.max
            }
        }), {});

        return { ...user.toObject(), traitsPromise: simpleTraits };
    });

    // Resolving all the traits promises here
    const usersWithResolvedTraits = await Promise.all(usersToReturn);

    return usersWithResolvedTraits.map(user => {
        user.traits = user.traitsPromise;
        delete user.traitsPromise;
        return user;
    });
}

// Load traits descriptions for the group of users and their latest results
// results - list of users results
// traitsKeys - list of traits names(keys) to process
// readerType - type of user for which the tip will be displayed
// lang - language of tips

exports.getTraits = async function (results, traitsKeys = [], readerType, lang = 'en') {
    const LANG = lang.toUpperCase()

    if (!results?.length) return {}

    // Auto detect readerType if it is not provided
    if (!readerType) readerType = results.length > 1 ? 'team-leader' : 'leader'

    // ############################################################
    // 1. Calculate average level, median, min and max values for the users
    let traitsToReturn = {}
    let missing = ['time-and-cost', "personal-engagement"]
    for (let traitKey of traitsKeys) {
        traitsToReturn[traitKey] = {}
        let listOfNormalizedValues = []// used to calculate median
        // let levelSum = 0;// used to calculate average
        let normalizedValueSum = 0;// used to calculate average
        let minValue;// minimal value accross all users
        let maxValue;// maximal value accross all users


        // Temporary solution - missing values in users traits
        // time-and-cost is not implemented at all
        // 4C only exists for Adult test
        if (missing.includes(traitKey) && !(traitKey in results[0].traits)) {
            traitsToReturn[traitKey] = {
                key: traitKey,
                level: 3,
                shortName: (traitKey.charAt(0).toUpperCase() + traitKey.slice(1)).replaceAll('-', ' '),
                mainDefinition: 'mainDefinition - Missing trait',
                actions: ["action 1 - missing trait"],
                median: 6,
                normalizedValue: 6,
                normalizedValueAverage: 6,
                min: 4.5,
                max: 7.5,
                listOfNormalizedValues: [6]
            }
            continue
        }

        // For each result
        for (let userResults of results) {
            let baseTraitKey = traitKey
            if (traitKey.includes('strong-and-weak-points-for-')) {
                baseTraitKey = traitKey.replace('strong-and-weak-points-for-', '')
            }
            let userTraits = userResults.traits
            let value = userTraits[baseTraitKey]?.normalizedValue
            listOfNormalizedValues.push(value)
            if (results.length > 1) {
                if (minValue == undefined || value < minValue) minValue = value// override min value
                if (maxValue == undefined || value > maxValue) maxValue = value// override max value
            } else {
                minValue = userTraits[baseTraitKey]?.min
                maxValue = userTraits[baseTraitKey]?.max
            }
            normalizedValueSum += value // increase sum
            // levelSum += userTraits[baseTraitKey]?.level// increase sum
        }

        // Calculate median
        let median = calculateMedian(listOfNormalizedValues)
        if (traitKey!='current-performance-indicator') median = Number(median?.toFixed(1))

        let normalizedValue = median

        // Calculate averages
        let normalizedValueAverage = normalizedValueSum / results.length
        normalizedValueAverage = Number(normalizedValueAverage.toFixed(1))

        let medianLevel = 5
        if (traitKey=='current-performance-indicator'){
            median = Number(Math.round(median))
            normalizedValue = Number(Math.round(normalizedValue))
            minValue = Number(Math.round(minValue))
            maxValue = Number(Math.round(maxValue))
            normalizedValueAverage = Number(Math.round(normalizedValueAverage))

            // Calculate level for the median
            if (median < 20)      medianLevel = 1
            else if (median < 40) medianLevel = 2
            else if (median < 60) medianLevel = 3
            else if (median < 80) medianLevel = 4

        } else {
            minValue = Number(minValue?.toFixed(1))
            maxValue = Number(maxValue?.toFixed(1))
            normalizedValueAverage = Number(normalizedValueAverage?.toFixed(1))
            // Calculate level for the median
            if   (median < 1+1*1.8)    medianLevel = 1
            else if (median < 1+2*1.8) medianLevel = 2
            else if (median < 1+3*1.8) medianLevel = 3
            else if (median < 1+4*1.8) medianLevel = 4
        }


        traitsToReturn[traitKey] = {
            key: traitKey,
            level: medianLevel,
            median: median,
            normalizedValue: median,
            normalizedValueAverage: normalizedValueAverage,
            min: minValue,
            max: maxValue
        }



    }
    // #################################
    // 2. Find descriptions  in database
    let traitsDocuments = await CognitiveTraitModel.find({ key: { $in: Object.keys(traitsToReturn) }, readerType: readerType });
    let traitsDocumentMap = new Map();
    traitsDocuments.forEach(doc => traitsDocumentMap.set(doc.key, doc));

    for (let [key, trait] of Object.entries(traitsToReturn)) {

        //if (strongAndWeakPoints) queryKey = "strong-and-weak-points-for-" + queryKey
        let traitDocument = traitsDocumentMap.get(trait.key);
        // If not found - skip this trait
        if (!traitDocument){
            traitsToReturn[key] = {
                ...traitsToReturn[key],
                abbreviation: "",
                shortName: trait.key+"(MISSING)",
                mainDefinition: "Missing in database for "+readerType,
                shortDescription: "",
                descriptions: ["Missing in database for "+readerType],
                actions: ["Missing in database for "+readerType],
                neurobiologicalEffects: [],
                lowestDefinition: '',
                lowestActions: '',
                highestDefinition: '',
                highestActions: '',

            }
            continue

        }

        //#############################################################################
        // For some triats we only have 2 available texts: `low` and `high`
        // Untill texts for all levels will be provided, we decided to 
        // display `low` text for normalized values in <1,5.5> and hight text in (5.5, 10>
        // As this is only temporary solution I decided to do it here, 
        // so I don't have to adjust database models and other places in code
        // chekcREADRE TYPE!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        let personalisedDescription = traitDocument?.descriptions[`level_${trait.level}`][LANG]
        if (readerType=='employee' && personalityTraitsInBusinessNames.includes(key)){
            if (traitsToReturn[key].normalizedValue > 5.5) personalisedDescription = traitDocument?.descriptions[`level_5`][LANG]//High text
            else personalisedDescription = traitDocument?.descriptions[`level_1`][LANG]//Low text
        }//#############################################################################


        traitsToReturn[key] = {
            ...traitsToReturn[key],
            abbreviation: traitDocument?.abbreviation[LANG],
            shortName: traitDocument?.shortName[LANG],
            mainDefinition: traitDocument?.mainDefinition[LANG],
            shortDescription: traitDocument?.shortDescription[LANG],
            descriptions: personalisedDescription,
            actions: traitDocument?.actions[`level_${trait.level}`][LANG],
            neurobiologicalEffects: traitDocument?.neurobiologicalEffects[LANG],
            lowestDefinition: traitDocument?.lowestDefinition[LANG],
            lowestActions: traitDocument?.actions[`lowest`][LANG],
            highestDefinition: traitDocument?.highestDefinition[LANG],
            highestActions: traitDocument?.actions[`highest`][LANG],

        }

        // // For NAD values also include individual actions for users with minimal values
        // if (results.length > 1 && ['self-activation', 'self-confidence', 'communication-strategy', 'cooperation', 'regularity', 'current-performance-indicator'].includes(key)) {
        //     //Sort people starting with the lowet value
        //     let sortedResults = results.sort((r1, r2) => { return r1.traits[trait.key].normalizedValue - r2.traits[trait.key].normalizedValue })

        //     // To controll for which levels we already assigned individual action
        //     let levelsCovered = []

        //     for (let lowestResult of sortedResults) {
        //         let level = lowestResult.traits[trait.key].level

        //         // Max 2 individual actions
        //         if (levelsCovered.length > 1) break

        //         // Make sure that the same action is not proposed twice for different users
        //         if (levelsCovered.includes(level)) continue
        //         else levelsCovered.push(level)

        //         // Select proper reader type for individual actions
        //         let individualReaderType = 'leader'// For now only leader in the future also teacher

        //         // Find document in database
        //         let traitDocument = await CognitiveTraitModel.findOne({ key: trait.key, readerType: individualReaderType })
        //         let individualActions = traitDocument?.actions[`level_${level}`][LANG]
        //         // Add name and surname at the beggining 
        //         individualActions = individualActions.map(a => { return lowestResult.user.name + ' ' + lowestResult.user.surname + ' - ' + a })
        //         // Add the actions to the list
        //         traitsToReturn[key].actions = traitsToReturn[key].actions.concat(individualActions)
        //     }







        // }

    }


    return traitsToReturn
}


// Load data about profile based on result object
// - result  - id of the user for which data will be loaded
// - readerType - type of user for which the report will be displayed
// - lang - language of data
exports.getProfiles = async function (result, readerType, lang = 'en') {
    const LANG = lang.toUpperCase()
    let ageGroup = this.getAgeGroup(readerType, result)
    let gender = this.getGender(result.data)=='female'?'female':'masculine'

    // Find profile with highest value
    let profilesTmp = { ...result.profiles }
    let profile = Object.keys(profilesTmp).reduce((a, b) => profilesTmp[a] > profilesTmp[b] ? a : b);

    // Find in db
    let profileDocument = await CognitiveProfileModel.findOne({ key: profile, readerType: readerType, ageGroup: ageGroup.toString() })
    // If didnt found for specific ageGroup, try to find universal
    if (!profileDocument) profileDocument = await CognitiveProfileModel.findOne({ key: profile, readerType: readerType, $or: [{ ageGroup: { $exists: false } }, { ageGroup: '' }] })
    if (!profileDocument) return null

    let profiles = {
        'main': {
            'name': profileDocument.name[LANG],
            'story': profileDocument.story[gender][LANG],
            'learningStyleCharacteristics': profileDocument.learningStyleCharacteristics[gender][LANG],
            'learningStyleExplanation': profileDocument.learningStyleExplanation[gender][LANG],
            'attributes': profileDocument.attributes[gender][LANG],
            'development': profileDocument.development[gender][LANG]
        }
    }

    profiles['values'] = result.profiles

    return profiles

}

// Get assignedproject cognitve collections
// user - for which data will be prepared
// readerType - type of user for which opportunities will be displayed
// lang - language of tips
exports.getAssignedCognitiveCollections = async (user, readerType, lang) => {
    var userId = user._id.toString()
    var traits = { // Used to get name of the trait which is associated with area of development
        '1': await this.getTraitForArea('1', readerType, lang ?? 'en'),
        '2': await this.getTraitForArea('2', readerType, lang ?? 'en'),
        '3': await this.getTraitForArea('3', readerType, lang ?? 'en'),
        '4': await this.getTraitForArea('4', readerType, lang ?? 'en'),
        '5': await this.getTraitForArea('5', readerType, lang ?? 'en')
    }


    let projects = await Project.find({ "cognitiveBlockCollection.users": user._id }, { 'cognitiveBlockCollection.cognitiveBlocks': 0 }).sort({ 'cognitiveBlockCollection.createdAt': 'desc' })// first the latest results


    let opportunities = await user.getOpportunities(readerType, lang ?? 'en', undefined, 5)

    let collections = []
    for (let project of projects) {// Find collections for the user
        for (let collection of project.cognitiveBlockCollection) {
            if (collection?.users?.includes(userId.toString())) {

                // Transform to object
                collection = collection.toObject()
                // Not needed
                delete collection['users']

                // Assign feedback
                let useful = undefined;
                let confirmed = undefined;
                let favourite = undefined;
                if (collection?.feedback && userId in collection?.feedback) {
                    let feedback = collection?.feedback[userId]
                    if (feedback) {
                        useful = feedback.useful
                        confirmed = feedback.confirmed
                        favourite = feedback.favourite
                    }
                }
                delete collection['feedback']

                collection = { ...collection, useful: useful, confirmed: confirmed, favourite: favourite }
                // Find associated opportunity
                let opportunity = opportunities.find(o => o.key == collection.opportunity)
                collection.opportunity = { ...opportunity, area: { ...opportunity?.area, trait: { key: traits[opportunity?.area.key].key, shortName: traits[opportunity.area.key].shortName } } }
                collections.push(collection)
            }
        }
    }
    return collections
}


// Preapare tips objects for display
// results - for which data will be prepared
// readerType - type of user for which opportunities will be displayed
// lang - language of tips
exports.prepareTips = async (results, readerType, lang) => {

    var LANG = lang.toUpperCase()

    // Default to student or employee
    if (!readerType) readerType = this.getReaderType(results?.data)
    let ageGroup = this.getAgeGroup(readerType, results?.data)


    var tipsToReturn = []
    for (let tip of results.tips) {

        let id = tip._id
        // In previous version of algorithm, id contained group in the id
        id = id.replace('_group1', '')// Remove if exists
        id = id.replace('_group2', '')// Remove if exists
        id = id.replace('_group3', '')// Remove if exists


        // Find in db
        let tipDocument = await CognitiveTipModel.findOne({ key: id, readerType: readerType, ageGroup: ageGroup.toString() })
        if (!tipDocument) continue

        let feedback = processFeedback(tip.feedback, results.user)

        let tipToReturn = {
            _id: `${id}`,
            introduction: tipDocument.introduction[LANG],
            text: tipDocument.text[LANG],
            reasoning: tipDocument.reasoning[LANG],
            ...feedback
        }
        tipsToReturn.push(tipToReturn)
    }

    return tipsToReturn
}

// get random element from array
const getRandom = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}




// Find a trait associated with area
// areaKey - area key 
// readerType - type of user for which opportunities will be displayed
// lang - language of tips
exports.getTraitForArea = async (areaKey, readerType, lang) => {
    if (areaKey=='1') traitKey = 'self-activation'
    else if (areaKey=='2') traitKey = 'self-confidence'
    else if (areaKey=='3') traitKey = 'communication-strategy'
    else if (areaKey=='4') traitKey = 'cooperation'
    else if (areaKey=='5') traitKey = 'regularity'
    
    let traitDocument = await CognitiveTraitModel.findOne({ key: traitKey, readerType: readerType??'employee' }, {key: 1, shortName: 1})
    if (!traitDocument) return undefined
    return {key: traitDocument.key, shortName: traitDocument.shortName[lang.toUpperCase()]}
}

// Get random opportunities for each type
// array - list of opportunities
// number - number of opportunities to return in each type 
const getRandomOpportunitiesForEachType = (array, number = 2) => {
    let selected = []
    for (let type of opportunityTypes) {
        let matching = array.filter(o => o.type == type)
        let random = matching.sort(() => 0.5 - Math.random())
        selected = selected.concat(random.slice(0, number))
    }
    return selected
}


// Get random opportunities based on lowValues values
// Find 6 solutions
// @twaleczko
// - We need to add 6 Solutions in that page; The rule will be
//   - Take the NAD values that are "very low" or "low"
//   A - If there is only one low NAD value, pick at random two socio + two psycho + two peda solutions for this value
//   B - If there are more than one low value, take the 2 lowest NAD values. Pick at random one socio + one psycho + one peda solution for each of these 2 values
//   C - If there is no low NAD value - return empty list
const getRandomOpportunities = (lowValues, sortedAreas) => {
    let opportunities = []
    if (lowValues.length == 1) { // CASE A
        opportunities = getRandomOpportunitiesForEachType(lowValues[0].opportunities, 2)
    } else if (lowValues.length > 1) {// CASE B
        let a1 = getRandomOpportunitiesForEachType(lowValues[0].opportunities, 1)
        let a2 = getRandomOpportunitiesForEachType(lowValues[1].opportunities, 1)
        opportunities = opportunities.concat(a1).concat(a2)
    } else if (lowValues.length == 0) {// CASE C
        opportunities = []
    }
    return opportunities
}

// Process feedback from all users
// and return ready to use properties
// allFeedback - object containing feedback from all the users
// userId - user to which the feedback is refering to
const processFeedback = (allFeedback, userId) => {
    var myConfirmationFeedback = null;
    var othersConfirmationFeedback = 0;
    var confirmedAt = null;
    let favourite = false
    let useful = 0

    if (allFeedback) {
        for (const [uid, feedback] of Object.entries(allFeedback)) {

            // For confirmation feedback
            if (Number.isInteger(feedback['confirmed'])) {
                if (uid == userId) {// User himself
                    myConfirmationFeedback = feedback['confirmed']
                    confirmedAt = feedback['confirmedAt']
                }
                // Other users
                else othersConfirmationFeedback += (feedback['confirmed'] ?? 0)
            }

            if (uid == userId) {// User himself
                favourite = feedback['favourite']
                useful = feedback['useful']
            }
        }
    }

    return { myConfirmationFeedback, othersConfirmationFeedback, favourite, useful, confirmedAt }
}

// Prepare Areas of development for display
// Event if there are no results it will return the opportunities
// Results are only used to load feedback and set proper ageGroup
// ###########################################
// results - for which data will be prepared
// readerType - type of user for which opportunities will be displayed
// lang - language of tips
exports.prepareAreas = async (results, readerType, lang) => {
    var LANG = lang.toUpperCase()


    // Default to student or employee
    if (!readerType) readerType = this.getReaderType(results?.data)
    let ageGroup = this.getAgeGroup(readerType, results?.data)
    // Prepare areas to return
    // Fetch proper text
    let areasToReturn = []
    for (let areaName of areas) {
        let index = areas.indexOf(areaName)
        let areaKey = (index + 1).toString()

        // Find in db
        let materialsPath = "materials." + LANG
        let activitiesPath = "opportunities.activities" + "." + LANG
        let areaDocument = await CognitiveAreaModel.findOne({ key: areaKey, readerType: readerType, ageGroup: ageGroup.toString() })
            .populate({ path: materialsPath, select: ['_id', 'title'] })
            .populate({ path: activitiesPath, select: ['_id', 'title'] })
        if (!areaDocument) continue


        // Find text
        let name = areaDocument.name[LANG]
        let description = areaDocument.description[LANG]
        let benefits = areaDocument.benefits[LANG]
        let impact = areaDocument.impact[LANG]
        let type = areaDocument.type
        let externalResources = areaDocument.externalResources[LANG]
        let materials = areaDocument.materials[LANG].map(m => { return { ...m.toObject(), url: '/content/display/' + m._id } })
        let courses = areaDocument.courses[LANG]
        let imageUrl = areaDocument.imageUrl

        // Load feedback
        let userArea = results?.traits[areaName]
        let feedback = {}
        if (userArea) feedback = processFeedback(userArea.feedback, results.user)
        let level = userArea?.level??1

        let opportunities = areaDocument.opportunities.map(o => {
            let solutions = o.solutions.map(s => { return { text: s.text[LANG] } })

            let randomMaterial = getRandom(materials) ?? null
            let randomExternalResource = getRandom(externalResources) ?? null

            return {
                _id: o.key,  // _id is outdataed, olny the `key` should be used in the future
                key: o.key, text: o.text[LANG],
                level: level,
                area: {
                    key: areaKey,
                    name: name,
                    abbreviation: userArea?.abbreviation,
                    materials: materials,
                    material: randomMaterial,
                    course: getRandom(courses) ?? null,
                    externalResources: externalResources,
                    externalResource: randomExternalResource,
                },


                solutions: solutions,
                activities: o.activities[LANG].map(a => { return { ...a.toObject(), url: '/content/display/' + a._id } }),

                imageUrl: o.imageUrl,
                type: o.type,
                typeText:o.type,//To be removed
            }
        })



        areasToReturn.push({
            _id: areaKey,// _id is outdataed, olny the `key` should be used in the future
            key: areaKey, name, description, benefits, impact,
            type: type, 
            typeText: type,//To be removed
            opportunities: opportunities,
            materials: materials,
            imageUrl: imageUrl,
            level: level,
            abbreviation: userArea?.abbreviation,
            normalizedValue: userArea?.normalizedValue,
            ...feedback
        })
    }

    return areasToReturn
}

// Preaare opportunity objects for display
// Event if there are no results it will return the opportunities
// Results are only used to load feedback and set proper ageGroup
// ###########################################
// - results - for which feedaback will be loaded - can be undefined
// - readerType - type of user for which opportunities will be displayed
// - lang - language of tips
// - areaKeys - only set when areas were selected manually
// - maxLevel - opportunites up to this level will be returned
exports.prepareOpportunities = async (results, readerType, lang, areaKeys, maxLevel = 3) => {
    var LANG = lang.toUpperCase()

    let userOpportunities = results?.opportunities ?? []

    // Default to student or employee
    if (!readerType) readerType = this.getReaderType(results?.data)
    let ageGroup = this.getAgeGroup(readerType, results?.data)

    let allAreas = await this.prepareAreas(results, readerType, lang)

    let opportunities = []
    let selectedAreas = allAreas.filter(a => parseInt(a.level) <= maxLevel)
    if (areaKeys) selectedAreas = selectedAreas.filter(a => areaKeys.includes(a.key))
    if (selectedAreas){
        let allOpportunitiesInAreas = selectedAreas?.map(a => a.opportunities).flat(1)
        opportunities = allOpportunitiesInAreas//.filter(o => opportunitiesToFind.includes(o.key))
    }
    opportunities = opportunities.map(o => {
        let userOpportunity = userOpportunities.find(uo => uo._id == o.key)
        let feedback = {}
        if (userOpportunity) feedback = processFeedback(userOpportunity.feedback, results.user._id)
        let randomActivity = getRandom(o.activities) ?? null

        return {
            ...o,
            activity: randomActivity,
            ...feedback
        }
    })
    return opportunities
}

// Load data for PDF report for selected result
// - result - result for which data will be loaded
// - readerType - type of user for which the report will be displayed
// - lang - language of data        
// It retuns {status: <int>, message: <str>, data: <object>}
exports.getDataForCognitiveReport = async function (result, readerType, lang = 'en') {
    const LANG = lang.toUpperCase()
    let data = {}

    // Auto detect readerType if it is not provided
    if (!readerType) readerType = this.getReaderType(result.data)
    data['pages'] = []

    profiles = await this.getProfiles(result, readerType, lang)

    let traits = await this.getTraits([result], [
        "current-performance-indicator",// QNAD
        "emotional-intelligence-global",
        ...nadNames,
        ...personalityTraitsInBusinessNames,
        ..._4CTraitsNames

    ],
        readerType, lang)
    let preparedAreas = await this.prepareAreas(result, readerType, lang)

    // #########################################################################################################
    // ### COVER ##################################################################
    // #########################################################################################################
    let page = {};
    page = {
        pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
        staticTexts: {
            individualCognitiveProfile: staticTextsForReport.individualCognitiveProfile[LANG],
            title: staticTextsForReport.titles[LANG],
            profileAttributes: staticTextsForReport.profileAttributes[LANG]
        },
        date: result.createdAt.toISOString().split('T')[0],
        user: { name: result.user?.name, surname: result.user?.surname, email: result.user?.email }
    }
    data['pages'].push(page)

    // #########################################################################################################
    // ### TABLE OF CONTENTS ##################################################################
    // #########################################################################################################

    var nadsPageNumber = 8
    var nadPages = []
    for (let nad of nadNames) {
        nadPages.push({title: traits[nad].shortName, page: nadsPageNumber.toString()})
        //if (traits[nad].level<3) nadsPageNumber+=4
        nadsPageNumber+=1
    }

    var _4CpageNumber = nadsPageNumber+1
    var _4CPages = []
    for (let trait of _4CTraitsNames) {
        _4CPages.push({title: traits[trait].shortName, page: _4CpageNumber.toString()})
        _4CpageNumber+=1
    }
    
    
    //personalityTraitsInBusinessNames
    var personalityTraitsInBusinessPageNumber = _4CpageNumber+1
    var personalityTraitsInBusinessPages = []
    for (let trait of personalityTraitsInBusinessNames) {
        personalityTraitsInBusinessPages.push({title: traits[trait].shortName, page: personalityTraitsInBusinessPageNumber.toString()})
        personalityTraitsInBusinessPageNumber+=1
    }
    
    var tableOfContentsPage = {
        pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
        staticTexts: {
            tableOfContents: staticTextsForReport.tableOfContents[LANG],

        },

        pages: [
            {title: staticTextsForReport.profileSummary[LANG], page: '3'},
            {title: staticTextsForReport.profile[LANG], page: '6'},
            {title: staticTextsForReport.nadValues[LANG], page: '7', subpages: nadPages},
            {title: staticTextsForReport.c4Values[LANG], page: nadsPageNumber.toString(), subpages: _4CPages},
            {title: staticTextsForReport.personalityTraitsInBusiness[LANG], page: _4CpageNumber.toString(), subpages: personalityTraitsInBusinessPages}
            

        
        ]

    }
    data['pages'].push(tableOfContentsPage)
    // #########################################################################################################
    // ### PAGE 3 - QNAD + PROFILE ATTRIBUTES ##################################################################
    // #########################################################################################################
    page = {};
    page = {
        pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
        staticTexts: {
            individualCognitiveProfile: staticTextsForReport.individualCognitiveProfile[LANG],
            title: staticTextsForReport.titles[LANG],
            profileAttributes: staticTextsForReport.profileAttributes[LANG]
        },
        date: result.createdAt.toISOString().split('T')[0],
        user: { name: result.user?.name, surname: result.user?.surname, email: result.user?.email},
        profile: { attributes: profiles?.main?.attributes ?? [] },
        traits: {
            'current-performance-indicator': {
                abbreviation: traits['current-performance-indicator']?.abbreviation,
                shortName: traits['current-performance-indicator']?.shortName,
                shortDescription: traits['current-performance-indicator']?.shortDescription,
                mainDefinition: traits['current-performance-indicator']?.mainDefinition,
                descriptions: traits['current-performance-indicator']?.descriptions,
                level: traits['current-performance-indicator']?.level,
                normalizedValue: Number(Math.round(traits['current-performance-indicator']?.normalizedValue))
            }
        }

    }
    data['pages'].push(page)

    // #########################################################################################################
    // ### PAGE 4 - NAD-CHART + LOWEST/HIGHEST NAD #############################################################
    // #########################################################################################################
    page = {
        pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
        traits: {},
        staticTexts: {
            nadSummary: staticTextsForReport.nadSummary[LANG],
            nadValuesShortDescription: staticTextsForReport.nadValuesShortDescription[LANG],
            nadChartDescription: staticTextsForReport.nadChartDescription[LANG],
            lexicon: staticTextsForReport.lexicon[LANG],
            nadLowest: staticTextsForReport.nadLowest[LANG],
            nadLowestHighestDescription: staticTextsForReport.nadLowestHighestDescription[LANG],
            nadHighest: staticTextsForReport.nadHighest[LANG],
            value: staticTextsForReport.value[LANG]
        }
    }
    min = 'self-activation'
    max = 'self-activation'
    for (let nad of nadNames) {
        if (traits[nad]?.normalizedValue >= traits[max]?.normalizedValue) max = nad
        if (traits[nad]?.normalizedValue <= traits[min]?.normalizedValue) min = nad
        page.traits[nad] = {
            abbreviation: traits[nad]?.abbreviation,
            shortName: traits[nad]?.shortName,
            shortDescription: traits[nad]?.shortDescription,
            normalizedValue: traits[nad]?.normalizedValue,
            min: traits[nad]?.min,
            max: traits[nad]?.max,
        }

    }
    page.traits[min].lowestDefinition = traits[min]?.lowestDefinition
    page.traits[min].lowestActions = traits[min]?.lowestActions

    page.traits[max].highestDefinition = traits[max]?.highestDefinition
    page.traits[max].highestActions = traits[max]?.highestActions
    
    page.lowestTrait = page.traits[min]
    page.highestTrait = page.traits[max]
    
    data['pages'].push(page)

    // #########################################################################################################
    // ### PAGE 5 - TRAITS CHARTS ##############################################################################
    // #########################################################################################################
    page = {
        pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
        traits: {},
        solutions: {},
        staticTexts: {
            personalityTraitsInBusiness: staticTextsForReport.personalityTraitsInBusiness[LANG],
            personalityTraitsInBusinessDescription: staticTextsForReport.personalityTraitsInBusinessDescription[LANG],
            competencesOfTheFuture: staticTextsForReport.competencesOfTheFuture[LANG],
            competencesOfTheFutureDescription: staticTextsForReport.competencesOfTheFutureDescription[LANG],
            competencesOfTheFutureIntroduction: staticTextsForReport.competencesOfTheFutureIntroduction[LANG],
            competencesOfTheFutureShortIntroduction: staticTextsForReport.competencesOfTheFutureShortIntroduction[LANG],
            selectedSolutions: staticTextsForReport.selectedSolutions[LANG],
            noSelectedSolutions: staticTextsForReport.selectedSolutions[LANG],
            noSelectedSolutionsIntro: "",
            noSelectedSolutionsText: staticTextsForReport.NadValueHigh[LANG],
        }
    }

    for (let trait of ["assertiveness", "leadership", "interpersonal-relation", 'emotional-intelligence-global',
        "intrapersonal-intelligence", "self-development", "achievements",
        "collaboration", "communication", "creativity", "critical-thinking"]) {
        let normalizedValue = traits[trait]?.normalizedValue
        page.traits[trait] = {
            // Those tratis are not inside cognitiveTraits model
            // And they dont have translated names for the moment
            // temporary use key
            shortName: traits[trait]?.shortName,
            shortDescription: traits[trait]?.shortDescription,
            normalizedValue: normalizedValue,
        }
    }


    let opportunities = []
    let solutions = []
    totalLength = 0
    // Sorted from lowest to highest level
    let sortedAreas = preparedAreas.sort((a1, a2) => a1.normalizedValue - a2.normalizedValue)
    console.log('Searching solutions for', sortedAreas.map(a=>a.abbreviation+" "+a.normalizedValue))
    let lowValues = sortedAreas.filter(a => a.normalizedValue < 5.5)
    if (lowValues.length){
        do {
            opportunities = getRandomOpportunities(lowValues, sortedAreas)
            solutions = opportunities.map(o => {return {...o.solutions[0]}})//, text: o.solutions[0].text +" ("+o.area.abbreviation+")"}})
            totalLength = solutions.reduce((a, b) => a + b?.text?.length, 0)
            console.log('Finding solutions - totalLength:', totalLength)
        } while (totalLength > 1400);
    }
    console.log(`Found ${solutions.length} solutions`)

    page.solutions = solutions

    data['pages'].push(page)


    // #########################################################################################################
    // ### PAGE 6 - PROFILE 1 ##################################################################################
    // #########################################################################################################
    page = {
        pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
        staticTexts: {
            profile: staticTextsForReport.profile[LANG],
            shortStoryIntroduction: staticTextsForReport.shortStoryIntroduction[LANG],
            shortStory: staticTextsForReport.shortStory[LANG],
            mainLearningStyle: staticTextsForReport.mainLearningStyle[LANG],
            characteristics: staticTextsForReport.characteristics[LANG],
            //explanation: staticTextsForReport.explanation[LANG],
            actionsToTake: staticTextsForReport.actionsToTake[LANG],
        },
        profile: {
            story: profiles?.main?.story,
            learningStyleCharacteristics: profiles?.main?.learningStyleCharacteristics,
            learningStyleExplanation: profiles?.main?.learningStyleExplanation,
            development: profiles?.main?.development
        }
    }
    data['pages'].push(page)


    // #########################################################################################################
    // ### PAGE 7 - NAD INTRODUCTION ###########################################################################
    // #########################################################################################################
    page = {
        pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
        staticTexts: {
            detailedReport: staticTextsForReport.detailedReport[LANG],
            nadValues: staticTextsForReport.nadValues[LANG],
            withAreasOfDevelopment: staticTextsForReport.withAreasOfDevelopment[LANG],
            nadValuesShortDescription: staticTextsForReport.nadValuesShortDescription[LANG],
            nadValuesIntroduction: staticTextsForReport.nadValuesIntroduction[LANG],
            nadValuesExplanation: staticTextsForReport.nadValuesExplanation[LANG],
            nadValuesSubtitle: staticTextsForReport.nadValuesSubtitle[LANG],
            value: staticTextsForReport.value[LANG]
        },
        traits: {}
    }

    for (let nad of nadNames) {
        page.traits[nad] = {
            shortName: traits[nad]?.shortName,
            abbreviation: traits[nad]?.abbreviation
        }

    }

    data['pages'].push(page)
    // #########################################################################################################
    // ### PAGE 8-XX - NAD VALUES ##############################################################################
    // #########################################################################################################
    for (let nad of nadNames) {
        page = {
            pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
            staticTexts: {
                value: staticTextsForReport.value[LANG],
                personalDescription: staticTextsForReport.personalDescription[LANG],
                actionsToTake: staticTextsForReport.actionsToTake[LANG],
            },
            traits: {}
        }

        page.traits[nad] = {
            abbreviation: traits[nad]?.abbreviation,
            shortName: traits[nad]?.shortName,
            level: traits[nad]?.level,
            normalizedValue: traits[nad]?.normalizedValue,
            mainDefinition: traits[nad]?.mainDefinition,
            actions: traits[nad].actions,
            descriptions: traits[nad]?.descriptions
        }
        data['pages'].push(page)


        // // For values low and very low - display opportunities
        // if (traits[nad]?.level < 3) {
        //     let area = preparedAreas.find(a => a.key == (areas.indexOf(nad) + 1))

        //     for (let type of opportunityTypes) {
        //         // #########################################################################################################
        //         // ### PAGE - OPPORTUNITIES ################################################################################
        //         // #########################################################################################################
        //         page = {
        //             pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
        //             staticTexts: {
        //                 areasOfDevelopment: staticTextsForReport.areasOfDevelopment[LANG],
        //                 opportunitiesForImprovement: staticTextsForReport.opportunitiesForImprovement[LANG],
        //                 opportunitiesIntroduction: staticTextsForReport.opportunitiesIntroduction[LANG],
        //                 suggestedSolution: staticTextsForReport.suggestedSolution[LANG]
        //             },
        //             opportunities: opportunities
        //         }

        //         if (type == 'sociological') page.staticTexts.sociologicalAspects = staticTextsForReport.sociologicalAspects[LANG]
        //         else if (type == 'psychological') page.staticTexts.psychologicalAspects = staticTextsForReport.psychologicalAspects[LANG]
        //         else if (type == 'development') page.staticTexts.developmentAspects = staticTextsForReport.developmentAspects[LANG]

        //         let matchingOopportunities = area.opportunities.filter(o => o.type == type)

        //         page.opportunities = matchingOopportunities.map(o => { return { text: o.text, solutions: o.solutions, type: o.type } })
        //         data['pages'].push(page)
        //     }
        // }else{
        //     // 3 empty pages
        //     data['pages'].push({}, {}, {})

        // }
        data['pages'].push({}, {}, {})



    }

    // #########################################################################################################
    // ### PAGE - C4 TRAITS INTRODUCTION ##################################################################
    // #########################################################################################################
    page = {
        pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
        staticTexts: {
            detailedReport: staticTextsForReport.detailedReport[LANG],
            c4Values: staticTextsForReport.c4Values[LANG],
            competencesOfTheFuture: staticTextsForReport.competencesOfTheFuture[LANG],
            competencesOfTheFutureIntroduction: staticTextsForReport.competencesOfTheFutureIntroduction[LANG]
        },
        traits: {}
    }

    for (let trait of _4CTraitsNames) {
        page.traits[trait] = {
            shortName: traits[trait]?.shortName
        }

    }

    data['pages'].push(page)

    // #########################################################################################################
    // ### PAGES - 4C TRAITS ###################################################################################
    // #########################################################################################################
    for (let trait of _4CTraitsNames) {
        page = {
            pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
            staticTexts: {
                competencesOfTheFuture: staticTextsForReport.competencesOfTheFuture[LANG],
                personalDescription: staticTextsForReport.personalDescription[LANG],
            },
            traits: {}
        }

        page.traits[trait] = {
            shortName: traits[trait]?.shortName,
            mainDefinition: traits[trait]?.mainDefinition,
            descriptions: traits[trait]?.descriptions,
            level: traits[trait]?.level,
            normalizedValue: traits[trait]?.normalizedValue,
        }
        data['pages'].push(page)

    }
    // #########################################################################################################
    // ### PAGE - ADDITIONAL TRAITS INTRODUCTION ###############################################################
    // #########################################################################################################
    page = {
        pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
        staticTexts: {
            detailedReport: staticTextsForReport.detailedReport[LANG],
            personalityTraitsInBusiness: staticTextsForReport.personalityTraitsInBusiness[LANG],
            personalityTraitsInBusinessIntroduction: staticTextsForReport.personalityTraitsInBusinessIntroduction[LANG],
            socialSuccessFactorsLabel: staticTextsForReport.socialSuccessFactorsLabel[LANG],
            selfManagementLabel: staticTextsForReport.selfManagementLabel[LANG],
            emotionalIntelligenceInRelationsWithOthersLabel: staticTextsForReport.emotionalIntelligenceInRelationsWithOthersLabel[LANG],
            personalSuccessFactorsLabel: staticTextsForReport.personalSuccessFactorsLabel[LANG],
        },
        traits: {}
    }

    for (let trait of personalityTraitsInBusinessNames) {
        page.traits[trait] = {
            shortName: traits[trait]?.shortName
        }

    }

    data['pages'].push(page)
    // #########################################################################################################
    // ### PAGES - ADDITIONAL TRAITS - Social Success Factors  #################################################
    // #########################################################################################################
    for (let trait of ["assertiveness", "leadership", "interpersonal-relation"]) {
        page = {
            pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
            staticTexts: {
                socialSuccessFactorsLabel: staticTextsForReport.socialSuccessFactorsLabel[LANG],
                personalDescription: staticTextsForReport.personalDescription[LANG],
            },
            traits: {}
        }

        page.traits[trait] = {
            shortName: traits[trait]?.shortName,
            mainDefinition: traits[trait]?.mainDefinition,
            descriptions: traits[trait]?.descriptions,
            level: traits[trait]?.level,
            normalizedValue: traits[trait]?.normalizedValue,
        }
        data['pages'].push(page)

    }
    // #########################################################################################################
    // ### PAGES - ADDITIONAL TRAITS - Emotional Intelligence in relations with others #########################
    // #########################################################################################################
    for (let trait of ["mediation-and-influence", "respect", "empathy"]) {
        page = {
            pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
            staticTexts: {
                emotionalIntelligenceInRelationsWithOthersLabel: staticTextsForReport.emotionalIntelligenceInRelationsWithOthersLabel[LANG],
                personalDescription: staticTextsForReport.personalDescription[LANG],
            },
            traits: {}
        }

        page.traits[trait] = {
            shortName: traits[trait]?.shortName,
            mainDefinition: traits[trait]?.mainDefinition,
            descriptions: traits[trait]?.descriptions,
            level: traits[trait]?.level,
            normalizedValue: traits[trait]?.normalizedValue,
        }
        data['pages'].push(page)

    }
    // #########################################################################################################
    // ### PAGES - ADDITIONAL TRAITS - Self-management  ########################################################
    // #########################################################################################################
    for (let trait of ["emotional-distance", "stress-management", "self-control", "sense-of-mastery", "self-esteem", "risk-taking"]) {
        page = {
            pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
            staticTexts: {
                selfManagementLabel: staticTextsForReport.selfManagementLabel[LANG],
                personalDescription: staticTextsForReport.personalDescription[LANG],
            },
            traits: {}
        }

        page.traits[trait] = {
            shortName: traits[trait]?.shortName,
            mainDefinition: traits[trait]?.mainDefinition,
            descriptions: traits[trait]?.descriptions,
            level: traits[trait]?.level,
            normalizedValue: traits[trait]?.normalizedValue,
        }
        data['pages'].push(page)

    }
    // #########################################################################################################
    // ### PAGES - ADDITIONAL TRAITS - Personal Success Factors  ###############################################
    // #########################################################################################################
    for (let trait of ["intrapersonal-intelligence", "self-development", "achievements"]) {
        page = {
            pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
            staticTexts: {
                personalSuccessFactorsLabel: staticTextsForReport.personalSuccessFactorsLabel[LANG],
                personalDescription: staticTextsForReport.personalDescription[LANG],
            },
            traits: {}
        }

        page.traits[trait] = {
            shortName: traits[trait]?.shortName,
            mainDefinition: traits[trait]?.mainDefinition,
            descriptions: traits[trait]?.descriptions,
            level: traits[trait]?.level,
            normalizedValue: traits[trait]?.normalizedValue,
        }
        data['pages'].push(page)

    }

    // #########################################################################################################
    // ### LAST PAGE ###########################################################################################
    // #########################################################################################################
    
    var surveyLink = 'https://evaluation.braincore.swiss/survey-adult-fr'
    var QRCode = 'https://cloud.braincore.ch/s/L2jpZeCAaD3b4Qq/preview'

    if (lang.toLowerCase()=='pl'){
        surveyLink = 'https://evaluation.braincore.swiss/survey-adult-pl'
        QRCode = 'https://cloud.braincore.ch/s/xqAgHLY66oTnAjH/preview'
    }



    
    page = {
        pageNumber: data['pages'].filter(p=>Object.keys(p).length !== 0).length+1,
        staticTexts: {
            lastPageNicelyDone: staticTextsForReport.lastPageNicelyDone[LANG],
            lastPageYouMadeYourFirstStep: staticTextsForReport.lastPageYouMadeYourFirstStep[LANG],
            lastPageText: staticTextsForReport.lastPageText[LANG],
            lastPageYourOpinionTitle: staticTextsForReport.lastPageYourOpinionTitle[LANG],
            lastPageYourOpinionText: staticTextsForReport.lastPageYourOpinionText[LANG],
            lastPageYourOpinionButton: staticTextsForReport.lastPageYourOpinionButton[LANG],

            lastPageStayInformed: staticTextsForReport.lastPageStayInformed[LANG],
            lastPageNewsletter: staticTextsForReport.lastPageNewsletter[LANG],
            lastPageSocial: staticTextsForReport.lastPageSocial[LANG],
            lastPageWebsite: staticTextsForReport.lastPageWebsite[LANG],
        },
        urls: {
            newsletter: "https://brainelem.com/#newsletter",
            twitter: "https://twitter.com/brainelem",
            linkedin: "https://www.linkedin.com/company/brainelem/",
            linkedinj: "https://www.linkedin.com/in/jjmbraincore/",
            website: "https://www.brainelem.com",
            survey: surveyLink,
            QRCode: QRCode
        }
    }

    data['pages'].push(page)




    return { status: 200, message: 'Found', data: data }
}




// Round to 1 decimal place
const roundNumber = (number) => {
    return Math.round(number * 10) / 10
}


// Base ULR for the BrainCore server
const OLD_BRAINCORE_BASE_URL = 'https://v2.dev.braincore.ch'
// For local environment
// docker inspect $(docker ps | grep cakephp | awk "{print \$1}" ) | grep "IPAddress"
//const OLD_BRAINCORE_BASE_URL = 'http://cakephp'


// Prepare request data for old BrainCore platform
// result - result for which report will be generated
// user- user who will be described in the report
// template - the type of template to use
//            ['short', 'long', 'lpdfv2']  
//            - short - short version(first page) of the report from 2019
//            - long - the full report from 2019
//            - lpdfv2 - full report from 2020
// role - Type of the user for which data will be displayed(reader).
//        [student, parent, teacher]
//        for French only parent is supported
//        for Polish parent,teacher and students are supported
// lang - language of the PDF report
exports.prepareDataRequestForOldReport = async (result, user, template, role, lang) => {
    if (!['student', 'teacher','parent'].includes(role)) role = 'parent'
    let module = (await user?.getModules())[0]

    if (!result.profiles || !result.traits || !result.tips) {
        return res.status(500).send({ message: "Results were not processed yet" });
    }

    // Format traits and round value to 1 decimal place
    let processed_traits = [];
    let traits = Object.keys(result.traits).map(key => ({ name: key, ...result.traits[key] }));
    for (let trait of traits) {// QNAD was in range 1-10 before
        if (trait.name == 'current-performance-indicator' && trait.normalizedValueBeforeScaling) 
            trait.normalizedValueBeforeScaling = roundNumber(trait?.normalizedValueBeforeScaling / 10)
        processed_traits.push(trait)
    }


    let data = {
        user: { traits: processed_traits, profiles: result.profiles },
        gender: exports.getGender(result.data),
        user_name: result.user.name,
        user_surname: result.user.surname,
        language: lang.toLowerCase(),
        origin: user?.settings?.origin??"fr_FR",
        school_name: module?.name || "BrainCore Module",
        role: role,
        template: template,
        report_date: result.createdAt.toISOString().substring(0, 10),
        baseUrl: OLD_BRAINCORE_BASE_URL
    };

    return data;

}

// Download PDF report from old BrainCore platform
// requestData - data to sent in reqest
exports.downloadOldReport = async (requestData) => {
    //Send those traits values combined with other information to generator server
    let generatorUrl = OLD_BRAINCORE_BASE_URL + "/results/download";
    console.log("Creating user on old BC server", generatorUrl)
    await axios.create({ httpsAgent: new https.Agent({ keepAlive: true }) });
    let response = await axios.post(generatorUrl, requestData)
    let downloadUrl = response.data
    console.log("Downloading old PDF report from ", downloadUrl)

    response = await axios.get(downloadUrl, {
        responseType: 'arraybuffer', headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/pdf'
        }
    },)
    const buffer = Buffer.from(response.data)

    return { buffer: buffer };
};


// Get data for EDU PDF report
// It will conatined processed data from old BrainCore platform
// - result - result for which data will be loaded
// - readerType - type of user for which the report will be displayed
// - lang - language of data  
// - requestData - data to sent in reqest to old BrainCore
exports.getDataForEduCognitiveReport = async (result, readerType, lang, requestData) => {
    //Send those traits values combined with other information to generator server
    let generatorUrl = OLD_BRAINCORE_BASE_URL + "/results/download";
    console.log("Creating user on old BC server", generatorUrl)
    await axios.create({ httpsAgent: new https.Agent({ keepAlive: true }) });
    let response = await axios.post(generatorUrl, requestData)
    var responseData = response.data
    var responseDataKeys = Object.keys(responseData)
    responseDataKeys.push('emotional-intelligence-global')

    // Select proper language for static texts 
    let staticTexts = {};
    let LANG = requestData.language.toUpperCase()
    Object.keys(staticTextsForEduReport).forEach(function(key, index) {
        let value = staticTextsForEduReport[key][LANG]
        staticTexts[key] = value
    });

    // Adjust traits
    let traitsToLoad = []
    responseDataKeys.forEach(function(key, index) {
        if (key in result.traits) traitsToLoad.push(key)
    });
    // Load traits
    // Force 'employee' readerType
    let traits = await this.getTraits([result], traitsToLoad, 'employee', lang)

    // Adjust traits
    let fixedResponseData = {}
    responseDataKeys.forEach(function(key, index) {
        let value = responseData[key]
        if (key in result.traits){// Add values for each trait
            value = {
                abbreviation: traits[key].abbreviation, 
                shortName: traits[key].shortName, 
                normalizedValue: traits[key].normalizedValue,
                min: traits[key].min,
                max: traits[key].max,
                level: traits[key].level,
                mainDefinition: traits[key]?.mainDefinition,
                shortDescription: traits[key]?.shortDescription,
                ...value}
        }

        if (key=='profiles'){
            // HERE SPLIT THE  TEXT

        }
        fixedResponseData[key] = value;
    });


    var data = {
        user: {
            name: requestData.user_name,
            surname: requestData.user_surname,
            module: requestData.school_name,
            date: requestData.report_date,
            gender: requestData.gender,

        },
        staticTexts:  staticTexts,
        traitsLists: {// Used to iterate and load templates
            nads: [
                'self-activation',
                'self-confidence',
                'communication-strategy',
                'cooperation',
                'regularity',
            ],
            ssf: [
                'self-assertion',
                'leadership',
                'interpersonal-relation'
            ],
            emo: [
                'self-control',
                'self-esteem',
                'stress-management',
                'sense-of-mastery',
                'risk-taking',
                'emotional-distance',
                'respect',
                'mediation-and-influence',
                'empathy'
            ],
            isf: [
                'intrapersonal-intelligence',
                'self-development',
                'achievements'
            ]
        },
        ...fixedResponseData,
    }
    


    

    return data
};