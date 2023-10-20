import AuthService from "./auth.service";
import {similarity, TextDifferencer} from "./DictationTools"
import {eliaAPI, baseURL} from "./axiosSettings/axiosSettings";
import i18next from "i18next";
import PdfComponent from 'styled_components/PdfComponent'
import DownloadFileButton from 'styled_components/DownloadFileButton'

// Services
import authService from 'services/auth.service'
import commonService from 'services/common.service'

// Context
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';

//MUI v4
import { theme } from "MuiTheme";


const API_ROUTE = 'contents';



// List of BrainCore Pedagogy Test ids for different languages FR/PL/EN
const pedagogyTestsIds=['60db1d322b4c80000732fdf7','60db1dc42b4c80000732fdf9', '60db1aef2b4c80000732fdf5']
// List of BrainCore Adult Test ids for different languages FR/PL/EN
const adultTestsIds = ['60aaaaef2b4c80000732fdf5','60bbbbef2b4c80000732fdf5','60ccccef2b4c80000732fdf5'];
// List of all BrainCore ids for different languages 
const braincoreTestsIds = pedagogyTestsIds.concat(adultTestsIds)

//  Check if provided id is for BrainCore Test (Pedagogy or Adult)
const isBraincoreTest = (id) => {
    return braincoreTestsIds.includes(id)
}
//  Check if provided id is for BrainCore Pedagogy Test
const isBraincorePedagogyTest = (id) => {
    return pedagogyTestsIds.includes(id)
}
//  Check if provided id is for BrainCore Adult Test
const isBraincoreAdultTest = (id) => {
    return adultTestsIds.includes(id)
}



// Get data from Context
const GET_F_getHelper = () => {
    const { F_getHelper } = useMainContext();
    return F_getHelper
}

// Get type of the BrainCore test for invitation

// Input: 
// - previousTestId - optional - id of previously taken test  
// Returns `type` which might be:
// - `adult`    - BrainCore PRO Test
// - `pedagogy` - BrainCore EDU Test
// - undefined  - used to trigger selection modal
const getBraincoreTestTypeForInvitation = (previousTestId) => {
    if (previousTestId){// Already have taken the test
        if (pedagogyTestsIds.includes(previousTestId)) return 'pedagogy'
        else return 'adult'
    }

    var F_getHelper = GET_F_getHelper()
    var {user, isEdu, userPermissions} = F_getHelper()

    // Should be able to select manually
    if (userPermissions?.bcCoach?.access ||
        commonService.isMarksModule(user) || 
        commonService.isMarketingModule(user)
    ) return undefined
    else if (isEdu) return 'pedagogy'
    else return 'adult'
}


//  Get proper BrainCore test for user himself
//  - type: type of the test, can be: `pedagogy` and `adult`. When not provided it will be set to `adult` by default
//  - lang - Language of the test in (ISO 639-1 Code 2-letters) eg: `en`, `fr`
//           When language is not provided, it will be taken from users settings.
//           If user is not logged in - language will be detected automatically
const getBraincoreTestId = (type='adult', lang=null) => {
    let userLanguage = lang||i18next.language?.slice(0, 2)

    if (type === "pedagogy") {
        if (userLanguage === 'fr') return '60db1d322b4c80000732fdf7';
        else if (userLanguage === 'pl') return '60db1dc42b4c80000732fdf9';
        else return '60db1aef2b4c80000732fdf5';
    }else if (type ==='adult'){
        if (userLanguage === 'fr') return '60aaaaef2b4c80000732fdf5';
        else if (userLanguage === 'pl') return '60bbbbef2b4c80000732fdf5';
        else return '60ccccef2b4c80000732fdf5';//EN
    }
}

// getContetnts
//   Get all contents from database, which are avaliable for the user.
//   This functon uses query parameter to determine the type and category of requested content
//   The type of the content can be a `TEST` or `PRESENTATION`
//   The category of requested content can be one of the following:
//   - owned - Content which belongs to the user,
//   - cocreated - Content which can be cocreated by the user,
//   - shared - Content which is available through library or 
//              content which was shared with one of the user's group.
const getContents = (contentType = null, contentCategory = null) => {
    return eliaAPI.get(`${API_ROUTE}?contentType=${contentType}&contentCategory=${contentCategory}`);
}

const changeVisibility = (contentId, groupId, value) => {
    if (Array.isArray(contentId)) return eliaAPI.put(`${API_ROUTE}/visibility/${groupId}`, {contentIds: contentId, value}); 
    return eliaAPI.put(`${API_ROUTE}/visibility/${groupId}/${contentId}`, {value});
}

const save = (content) => {
    let data = {"content": content}
    if (!content._id)// If new
        return eliaAPI.post(`${API_ROUTE}`, data);
    else
        return eliaAPI.put(`${API_ROUTE}/${content._id}`, data);
};


// Locking all elemets - will be hidden from trainees
const lockAllElements = (contentId) => {
    return eliaAPI.post(`${API_ROUTE}/${contentId}/lock/all`, null);
};
// Unlocking all elemets - will be visible to trainees
const unlockAllElements = (contentId) => {
    return eliaAPI.post(`${API_ROUTE}/${contentId}/unlock/all`, null);
};

// Locking the elemet - will be hidden from trainees
const lockElement = (contentId, elementName) => {
    return eliaAPI.post(`${API_ROUTE}/${contentId}/lock/${elementName}`, null);
};
// Unlocking the elemet - will be visible to trainees
const unlockElement = (contentId, elementName) => {
    return eliaAPI.post(`${API_ROUTE}/${contentId}/unlock/${elementName}`, null);
};

const allowExtraAttempt = (contentId, userId) => {
    return eliaAPI.post(`${API_ROUTE}/${contentId}/allow-extra-attempt/${userId}`, null);
};

const disallowExtraAttempt = (contentId, userId) => {
    return eliaAPI.post(`${API_ROUTE}/${contentId}/disallow-extra-attempt/${userId}`, null);
};

const remove = (content) => {
    return eliaAPI.delete(`${API_ROUTE}/${content}`);

};



const suggest = (query, contentType='') => {
    // Suggest contents names
    return eliaAPI.get(`${API_ROUTE}/suggest?query=${query}&contentType=${contentType}`);
}

const search = (query) => {
    // Search content
    return eliaAPI.get(`${API_ROUTE}/search?query=${query}`);
}

const searchByInterestId = (interestId, query) => {
    // Search content
    return eliaAPI.get(`${API_ROUTE}/search?query=${query}&interestId=${interestId}`);
}

const searchRecommended = () => {
    // Search content
    return eliaAPI.get(`${API_ROUTE}/search?searchRecommended=true`);
}

const searchByType = (query, contentType) => {
    // Autocomplete content
    return eliaAPI.get(`${API_ROUTE}/search?query=${query}&contentType=${contentType}`);
}

const getContent = (id) => {
    //  Get contents with provided id from database,if it is avaliable for the user.
    return eliaAPI.get(`${API_ROUTE}/${id}`);
}

const isContentUsedInSession = (id) => {
    //  Get contents with provided id from database,if it is used in session.
    return eliaAPI.get(`${API_ROUTE}/isContentUsedInSession/${id}`);
}

const getContentOverview = (id) => {
    //  Get contents with provided id from database,if it is avaliable for the user.
    return eliaAPI.get(`${API_ROUTE}/overview/${id}`);
}


// groupId - if undefined it will load all resutls for this content
const readForExamination = (contentId, groupId) => {
    // Read data for group examination view
    if (groupId) return eliaAPI.get(`${API_ROUTE}/examination/${contentId}/group/${groupId}`);
    return eliaAPI.get(`${API_ROUTE}/examination/${contentId}/all`);
  }

const uploadFile = (formData) => {
    //enctype: 'multipart/form-data',
    return eliaAPI.post(`${API_ROUTE}/files/upload`, formData);
}

const getFileDetails = (fileId) => {
    //  Get contents with provided id from database,if it is avaliable for the user.
    return eliaAPI.get(`${API_ROUTE}/files/${fileId}`);
}

const downloadFile = (fileId) => {
    window.open(`${API_ROUTE}/files/download/${fileId}`, '_blank')
    /*
    return eliaAPI.get(`${API_ROUTE}/download-file/${fileName}`, { responseType: 'blob' })
    .then((response) => {
        console.log( response.headers['content-originalname'] )
        const file =new Blob([response.data], {type: response.headers['content-mimetype']})
        const url = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.target = "_blank"
        link.setAttribute('download', response.headers['content-originalname']);
        document.body.appendChild(link);
        link.click();
    });
    */

}

const uploadImage = (formData) => {
    return eliaAPI.post(`${API_ROUTE}/images/upload`, formData);
}

const getImageUrl = (content) => {
    return `${baseURL}${API_ROUTE}/${content._id}/image/download`;
}

const getImageDetails = (imageId) => {
    return eliaAPI.get(`${API_ROUTE}/images/details/${imageId}`);
}

const findBestMatchingImageUrl = (tags) => {
    return eliaAPI.post(`${API_ROUTE}/images/best`, {tags: tags});
}

// Get all levels
const getAllLevels = () => {
    return eliaAPI.get(`${API_ROUTE}/levels`);
}


// Check if user if owner or cocreator of the content
const isOwnerOrCocreator = (userId, content) => {
    return (content.owner?._id == userId || content.cocreators?.includes(userId))
}

// Apply filters on the provided contents
// - contents - list of contents to filter
// - user - active user
// - filters - array of filters Supported filters:
//   - DATE
//   - TYPE
//   - OWNERSHIP
const applyFilters = (contents, user, filters) => {
    // DATE filter
    let dateFilter = filters.find(f => f.key == "DATE")
    dateFilter?.values.forEach(v => {
        if (v.selected && v.key == 'NEWEST') { contents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) }
        else if (v.selected && v.key == 'OLDEST') { contents.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) }
    })

    // TYPE filter
    let typeFilter = filters.find(f => f.key == "TYPE")
    let selectedTypes = []
    typeFilter?.values.forEach(v => {
        if (v.selected) { selectedTypes.push(v.key) }
    })
    if (selectedTypes.length) contents = contents.filter(c => selectedTypes.includes(c.contentType))


    // OWNERSHIP filter
    let ownershipFilter = filters.find(f => f.key == "OWNERSHIP")
    ownershipFilter?.values.forEach(v => {
        if (v.selected && v.key == 'MY') contents = contents.filter(c => {
            return c?.owner?._id == user.id || c.cocreators?.includes(user.id)
        })
    })

    return contents
}

const assignContentToGroup = (data) => {
    return eliaAPI.post(`${API_ROUTE}/assign-to-class`, data);
}


const normalize = (string) => {
    // Normalize string by removing all diacritic/accents
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\u0142/g, "l")
}

const isTextAnswerCorrect = (settings, answer, correctAnswer) => {
    // Check if text answer is correct
    if (settings.diacriticSensitive && settings.caseSensitive){
        if (answer.trim() === correctAnswer.trim()) return true;
    } else if (settings.caseSensitive){ // Only case sensitive
        if (normalize(answer).trim() === normalize(correctAnswer).trim()) return true;
    }else if (settings.diacriticSensitive){ // Only dircitic sensitive
        if (answer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) return true;
    }else{
        if (normalize(answer).toLowerCase().trim() === normalize(correctAnswer).toLowerCase().trim()) return true;
    }
    
    return false;


}

const getTextDifferences = (answer, correctAnswer) => {
    if (!answer) answer = '';
    var differences = new TextDifferencer().findDifferencesBetweenStrings(correctAnswer??'',answer??'');
    var differencesAsString = differences.toString();
    return differencesAsString;
}

const getTextAnswerScore = (settings, answer, correctAnswer) => {
    // Check how much text answer is matchin correct answer(dictation)
    if (settings.diacriticSensitive && settings.caseSensitive){
        return similarity(answer.trim(), correctAnswer.trim());
    } else if (settings.caseSensitive){ // Only case sensitive
        return similarity(normalize(answer).trim(), normalize(correctAnswer).trim());
    }else if (settings.diacriticSensitive){ // Only dircitic sensitive
        return similarity(answer.toLowerCase().trim(), correctAnswer.toLowerCase().trim());
    }else{
        return similarity(normalize(answer).toLowerCase().trim(), normalize(correctAnswer).toLowerCase().trim());
    }
}


const areAllRequiredQuestionsAnswered = (survey) => {
    let allAnswered = true;
    let questions = survey.getAllQuestions(true);
    for(var i = 0; i < questions.length; i ++) {
     let q = questions[i];
     if(q.isRequired && q.isEmpty() && canBeAnswered(q) ) {
        allAnswered = false;
       break;
     }
    }
    return allAnswered
}

// NO SurveyJS
// Get all questions in content
const getAllQuestions = (content) => {
    let elements = getElements(content)
    let questions = []
    for (let element of elements){
        if (canBeAnswered(element)) questions.push(element)
    }

    return questions
}


// NO SurveyJS
// Get check if element can be answered
const canBeAnswered = (question) => {
    // Check if question can be answered
    let subtype = question.subtype
    let type = question.type || question.getType()

    if (['file'].includes(question.subtype)) return false;
    else if (type=='expression' && !question.subtype) return false
    else return true;
}


// NO SurveyJS
// If content is already verified/checked
const isChecked = (content, assignedPoints) => {
    let questions = getAllQuestions(content)
    for (let question of questions){
        if (!isQuestionChecked(question, assignedPoints)) return false
    }
    return true
}


// Get number of the question
const getQuestionNumber = (content, question) => {
    // Count all questions in a test
    var number = 0;
    let nameToFind = question.getConditionJson().name
    let elements = getElements(content)
    for (let element of elements){
        if (canBeAnswered(element)) {
            number+=1
            if (element.name == nameToFind) return number
        }
    }
}

const countQuestions = (survey) => {
    // Count all questions in a test
    let number = 0;
    survey.getAllQuestions().forEach(question => {
        if (canBeAnswered(question)) number+=1;
    })
    return number;
}

const isQuestionChecked = (question, assignedPoints) => {
    // Is question checked 
    if (question.correctAnswer === undefined){
        // If open question was already mareked
        if (assignedPoints && assignedPoints[question.name] !== undefined) return true
    }
    else return true; // Non-open question, is checked automatically
}

const countCheckedQuestions = (survey, assignedPoints) => {
    // Count all questions which are open and are marked
    var number = 0;
    survey.getAllQuestions().forEach(question => {
        if (canBeAnswered(question) && isQuestionChecked(question, assignedPoints)) number += 1;
    })
    return number;
}

const getPercentageOfCheckedQuestions = (survey, assignedPoints) => {
    // Get percentage of checked questions in a test
    let all = countQuestions(survey);
    let checked =  countCheckedQuestions(survey, assignedPoints);
    return (all ? 100 * (checked / all) : null);
}


const getPercentageOfScoredPoints = (survey, assignedPoints={}) => {
    // Get percentage of scored points in a test
    let points = getScoredPointsForTest(survey, assignedPoints);

    // Transform SurveyJS into fake JSON object
    let elements = survey.getAllQuestions()
    let elementsJSON = elements.map(e=>e.getConditionJson())
    let contentJSON = {pages: [{elements: elementsJSON}]}
    let totalPoints =  getTotalPointsForContent(contentJSON);
    return (totalPoints ? 100 * (points / totalPoints) : null);
}

// NO SurveyJS
// Get elements list from the content
// When singlePage is true, it will return list with all the elements
// When  singlePage is false it will return elements on page with pageNumber
const getElements = (content, singlePage=true, pageNumber=undefined) => {
    let elements = []
    let elementNumber = 1
    content?.pages?.forEach((page, pageIndex) => {
        page?.elements?.forEach(element => {
            if (singlePage || pageNumber == pageIndex + 1) elements.push({ ...element, number: elementNumber })
            elementNumber += 1
        })
    })
    return elements
}

// NO SurveyJS
// Get total/max number of points in a content
const getTotalPointsForContent = (content) => {
    var totalPoints = 0;
    let elements = getElements(content)
    elements.forEach(function (element) {
        if (canBeAnswered(element)) {
            if (element.pointsForCorrectAnswer==undefined) totalPoints +=1
            else totalPoints += element.pointsForCorrectAnswer
        }
    })
    return totalPoints;
}

const getScoredPointsForTest = (survey, assignedPoints={}) => {
    // Get number of points user recived in a test
    var scoredPoints = 0;
    survey.getAllQuestions().forEach(function (question) {
        if (canBeAnswered(question)) {
          scoredPoints += getScoredPointsForQuestion(question.getConditionJson(), survey.data, assignedPoints)
        }
    })
    return scoredPoints;
}


// NO SurveyJS
// Get points for element
const getScoredPointsForQuestion = (question, data, assignedPoints={}) => {

    // Get number of points user recived for a question
    var answer = data[question.name];
    let pointsForCorrectAnswer = question.pointsForCorrectAnswer
    // By default this is 1 point
    if (pointsForCorrectAnswer==undefined) pointsForCorrectAnswer = 1 

    var correctAnswer = question.correctAnswer;
    // Check manually assigned points
    if (assignedPoints[question.name] !== null && 
        assignedPoints[question.name] !== undefined) return assignedPoints[question.name]; 

    if (correctAnswer === undefined) { // No correct answer, eg. open question with no assigned points
        return null;
    } else if (question.subtype === 'blanks') {
        var points = 0;
        answer?.forEach(item => {
            if (item){
                let pointsForCorrectAnswer =  question.items.find(i=>i.name===item.name)?.pointsForCorrectAnswer;
                if (isTextAnswerCorrect(question, item.title, correctAnswer[item.name])) points += parseInt(pointsForCorrectAnswer);
            }
        })

        return points;
    } else if (answer === undefined) { // Empty answer / This must be below logic for blanks !!!!!!!! 
        return 0;
    } else if (question.subtype === 'dictation') {
        let score = getTextAnswerScore(question, answer, question.correctAnswer);
        let scoredPoints = score * pointsForCorrectAnswer;
        if (scoredPoints < 0.5) scoredPoints = 0
        return Math.round(scoredPoints * 100) / 100
    } else if (question.type === 'checkbox') {
        // Check if correctAnswer do not contain element which is not on the `choices` list
        // Due to SurveyJS bug, sometimes there is `other` answer inside `correctAnswer` 
        // even though its not on the `choices` list.
        let choices =  question.choices;
        correctAnswer.forEach(answer =>{
            if (!choices.includes(answer))// Remove additional answer from correctAnswer
                 correctAnswer = correctAnswer.filter(item => item !== answer)
        })
        // Check if arrays have the same elements
        if (answer.sort().join(',') === correctAnswer.sort().join(','))
            return pointsForCorrectAnswer;
        else return 0;
    } else if (['sortablelist', 'ranking'].includes(question.type)) {
        // Check if all items exist and are in the same order
        for (var i = 0; i < question.correctAnswer.length; i++) {
            if (answer[i] === undefined || correctAnswer[i] !== answer[i]) return 0;
        }
        return pointsForCorrectAnswer;
    }
    else if (question.type === 'datepicker') {
        if (answer === correctAnswer) return pointsForCorrectAnswer;
        else return 0;
    }
    else if (question.type === 'text') {
        if (isTextAnswerCorrect(question, answer, question.correctAnswer)) return pointsForCorrectAnswer;
        return 0;
    }
    else if (question.type === 'comment') {
        if (isTextAnswerCorrect(question, answer, question.correctAnswer)) return pointsForCorrectAnswer;
        return 0;
    }
    else if (answer == question.correctAnswer){// Other types
        return pointsForCorrectAnswer;
    }else{
        return 0
    }
}

// NO SurveyJS
// Check if question was passed based on gradingScale
const isQuestionPassed = (scored, pointsForCorrectAnswer, gradingScale) => {
    let threshold = pointsForCorrectAnswer * parseFloat(gradingScale?.passPercentage) / 100
    let passed = scored >= threshold
    return passed
}

const getGradeForTest = (survey, gradingScale, assignedPoints={}) => {
    // Get grade user recived in a test
    if (!gradingScale || !gradingScale.grades) return '';
    var percentage = getPercentageOfScoredPoints(survey, assignedPoints)
    var receivedGrade = gradingScale.grades[0];
    gradingScale.grades.forEach(grade => {
        if (grade.maxPercentage <= percentage && grade.maxPercentage > receivedGrade.maxPercentage) 
            receivedGrade = grade;
    })
    return receivedGrade.shortLabel
}


// All results for BrainCore Tests in all languages
// userId - _id of user, if not provided, returns results for current user
const getBrainCoreTestResults = (userId) => {
    return eliaAPI.get(`${API_ROUTE}/braincore-tests-results/${userId??''}`);
}

const getAcceptedContent = (contentId) => {
    return eliaAPI.get(`/accepted-content/${contentId}`);
}

// Widget for starting tests
function createOpenTestWidget(parent, question, setNestedContentModel, setShowNestedModal, t, $) {
    var startTestButton = $("<button style='width: 100%;'>" + t("Start test") + "</button>")
    getContentOverview(question.test).then(
        (response) => {
            var content = response.data;
            if (!setNestedContentModel || !setShowNestedModal){
                startTestButton.text(t('Open ') + " " + content.title)


            }
            else if (content.canDisplay) {
                startTestButton.text(t('Start') + " " + content.title)
                startTestButton.on("click", function (e) {
                    startTestButton.text(t("Open your results for") + " " + content.title)
                    setNestedContentModel(content)
                    setShowNestedModal(true)
                })
            } else if (content?.results?.length > 0) {
                startTestButton.text(t("Open your results for") + " " + content.title)
                startTestButton.on("click", function (e) {
                    window.open(`/results/${AuthService.getCurrentUser().id}/${question.test}`, '_blank').focus();
                })

            } else startTestButton.text(t("You have no access to this test."))
        },
        (error) => {
            startTestButton.text(t('Could not load test.'))
        }
    )

    parent.html(startTestButton);
}


const getFileElement = async (name, url, mimeType, inline=true) => {
    let downloadLink = <DownloadFileButton name={name} url={url}></DownloadFileButton>
    
    if (!inline) return downloadLink
    

    if (mimeType.includes('video')) 
        return (<>
            {/* {downloadLink} */}
            <video style={{maxWidth: '100%', maxHeight: "100%"}} controls>
                <source src={url} type={mimeType}/>
            </video>
        </>)

    else if (mimeType.includes('audio')) 
        return (<>
            {/* {downloadLink} */}
            <audio controls>
                <source src={url} type={mimeType}/>
            </audio>
        </>)
    else if (mimeType === 'application/pdf'){
        return <>
        <PdfComponent url={url}></PdfComponent>
        {/* <div>{downloadLink}</div> */}
        </>
    }
    else 
        return (<>
            <div>{downloadLink}</div>
            <object 
            key={name}
            data={url}
            style={{ height: '100%', minHeight: 'unset', maxWidth: '100%' }} 
            type={mimeType}
            ><div/>
        </object></>)
}
// Widget for downloading files
async function getOpenFileWidget(question, t, inline = true) {

    try {
        let response = await getFileDetails(question.file)
        let file = response.data
        let mimeType = file.mimeType
        let name = file.fileOriginalName
        let url = `${baseURL}contents/files/download/${file._id}`
        let fileElement = await getFileElement(name,url,mimeType,inline)

        
        return fileElement

    } catch {
        var downloadButton = <button style='width: 100%;'>{t("Could not load the file...")}</button>
        return downloadButton;
    }
}

// get who is the heighest content creator
const getHighestContentCreator = () => {
    return eliaAPI.get(`${API_ROUTE}/getHighestContentCreator`);
}

// number of new contents per week/month/year
const numberOfNewContentsPerTime = (basis) => {
    return eliaAPI.get(`${API_ROUTE}/numberOfNewContentsPerTime/${basis}`);
}

//  count Created materials 
const countCreatedMaterials = () => {
    return eliaAPI.get(`${API_ROUTE}/countCreatedMaterials`);
}

const countContentAcceptedByLibrarian = (userId) => {
    if (userId) return eliaAPI.get(`countContentAcceptedByLibrarian/${userId}`); // user average content creation time
    else return eliaAPI.get(`countContentAcceptedByLibrarian`); // all users average content creation time
}

const countLessons = (userId) => {
    if (userId) return eliaAPI.get(`countLessons/${userId}`); // user average content creation time
    else return eliaAPI.get(`countLessons`); // all users average content creation time
  }
  
  const countTests = (userId) => {
    if (userId) return eliaAPI.get(`countTests/${userId}`); // user average content creation time
    else return eliaAPI.get(`countTests`); // all users average content creation time
  }

  function getItemFromLocalStorage(key) {
    const itemString = localStorage.getItem(key);
    const item = JSON.parse(itemString);
    return item;
  }
const functions = {
    save,
    remove,
    suggest,
    search,
    searchByInterestId,
    searchRecommended,
    uploadFile,
    getFileDetails,
    downloadFile,
    getContent,
    getContentOverview,
    readForExamination,
    searchByType,
    getContents,
    isTextAnswerCorrect,
    getElements,
    areAllRequiredQuestionsAnswered,
    canBeAnswered,
    getTotalPointsForContent,
    getScoredPointsForTest,
    getScoredPointsForQuestion,
    getPercentageOfScoredPoints,
    isQuestionPassed,
    getGradeForTest,
    pedagogyTestsIds,
    adultTestsIds,
    isBraincoreTest,
    isBraincorePedagogyTest,
    isBraincoreAdultTest,
    getBraincoreTestTypeForInvitation,
    getBraincoreTestId,
    getBrainCoreTestResults,
    assignContentToGroup,
    getAcceptedContent,
    lockAllElements,
    unlockAllElements,
    lockElement,
    unlockElement,
    allowExtraAttempt,
    disallowExtraAttempt,
    uploadImage,
    getImageUrl,
    getImageDetails,
    findBestMatchingImageUrl, 
    isContentUsedInSession,
    isOwnerOrCocreator,
    applyFilters,
    getQuestionNumber,
    countQuestions,
    isChecked,
    isQuestionChecked,
    countCheckedQuestions,
    getPercentageOfCheckedQuestions,
    getAllLevels,
    createOpenTestWidget,
    getFileElement,
    getOpenFileWidget,
    getTextDifferences, 
    getHighestContentCreator,
    numberOfNewContentsPerTime,
    countCreatedMaterials,
    countContentAcceptedByLibrarian,
    countLessons,
    countTests,
    changeVisibility,
    getItemFromLocalStorage
};

export default functions;
