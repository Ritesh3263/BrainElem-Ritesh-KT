// Display content results
//  
// SurveyJS component(<Survey.Survey>) used here going to be replaced with Display.js


import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import { Grid, InputAdornment, Button, Checkbox, FormControlLabel } from "@material-ui/core";
import { ETextField } from "styled_components";
import { useNavigate, useParams, BrowserRouter } from "react-router-dom";
import * as Survey from "survey-react";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import showdown from 'showdown';
import { baseURL } from "services/axiosSettings/axiosSettings";
import ContentService from "services/content.service";
import ResultService from "services/result.service";
import "survey-knockout/modern.css";
import "survey-knockout/survey.css";
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from "MuiTheme";

import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as FileUploadIcon } from 'icons/icons_32/File_32.svg';
import FileDownload from "components/common/File";
import EBadge from 'styled_components/Badge';

//CUSTOM WIDGETS
import * as widgets from "surveyjs-widgets";
import $ from "jquery";
import "jquery-ui-dist/jquery-ui.css";


import "jquery-bar-rating/jquery.barrating.js";
import "jquery-bar-rating/dist/themes/fontawesome-stars.css";
import "jquery-bar-rating/dist/themes/fontawesome-stars-o.css";
import "jquery-bar-rating/dist/themes/css-stars.css";

import "nouislider/distribute/nouislider.min.css";
import { MainProvider, useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { ToastProvider } from 'react-toast-notifications';

// Final elements 
import {Element} from "components/Content/Element"
import StyledButton from "new_styled_components/Button/Button.styled";

require("jquery-ui-dist/jquery-ui.js");
window["$"] = window["jQuery"] = $;

widgets.jqueryuidatepicker(Survey, $);

widgets.jquerybarrating(Survey);
widgets.nouislider(Survey);
widgets.sortablejs(Survey);
widgets.ckeditor(Survey);

function doMarkdown(survey, options) {
    //Create showdown markdown converter
    var converter = new showdown.Converter();
    //convert the markdown text to html
    let str = converter.makeHtml(options.text);
    //div.remove()
    if (str.indexOf("<p>") === 0) {
        //remove root paragraphs<p></p>
        str = str.substring(3);
        str = str.substring(0, str.length - 4);
    }
    //set html
    options.html = str;
    if (window.MathJax)
        window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub])
}

const useStyles = makeStyles(theme => ({

    contentResult: {
        
        "& .sv-text": {
            padding: 0,
            borderBottom: 'none',
        },
        "& .sv-body": {
            padding: `0px !important`,
            margin: `0px !important`,
            overflow: 'auto'
        },
        "& .sv-page": {
            overflow: 'auto',
            padding: `0px !important`,
            margin: `0px !important`,
        },
        "& .sv_qbln": {
            display: 'inline-block',
        },

        "& .sv-root-modern .sv-dropdown": {
            padding: 0,
            borderBottom: '0px !important',
            height: 'unset'
        },

        "& blank": {
            minWidth: '70px !important',
            height: '20px',
            lineHeight: '20px',
            textAlign: 'center',
            caretColor: 'black !important',
            verticalAlign: 'middle',
        },

        "& .sv-root-modern .sv-container-modern__title": {
            display: 'none',
        },
        "& .sjs-sortablejs-item": {// color of sortable items
            backgroundColor: `${theme.palette.primary.green} !important`,
        },
        "& .sv-root-modern .sv-radio--checked .sv-radio__svg":{
            borderColor: `#dbdbdb !important`,
        },

    },
    topBar: {
        background: theme.palette.glass.light,
        borderRadius: 8,
        width: "100%",
        padding: 10
    },
    readOnlyInput: {
        pointerEvents: 'none',
        "& .MuiFilledInput-root": {
            background: theme.palette.neutrals.white,
            borderBottomColor: 'transparent',
            borderRadius: 8,
        }
    },
    questionName: {
        padding:0,
        fontSize: 21,
        //background: theme.palette.neutrals.white,
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start'

    },
    labelElement: {
        color: theme.palette.primary.darkViolet,
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
        fontSize: 17
    },
    questionElement: {
        padding: 5,
        marginLeft: 15,
        marginRight: 15,
    },
    answerElement: {
        padding: 5,
        background: theme.palette.glass.light,
        borderRadius: 4,
        marginLeft: 15,
        marginRight: 15
    },
    correctAnswerElement: {
        wordBreak: 'break-all',
        padding: 5,
        background: theme.palette.glass.light,
        borderRadius: 4,
        marginLeft: 15,
        marginRight: 15
    },
    optionsElement: {
        padding: 5,
        marginLeft: 15,
        marginRight: 15
    }

}))

const DisplayTestResults = (props) => {
    const { F_getErrorMessage, F_showToastMessage, F_handleSetShowLoader, F_removeAllToasts } = useMainContext();
    const classes = useStyles();
    const navigate = useNavigate();
    let { resultId, userId, contentId } = useParams();
    const { t, i18n, translationsLoaded } = useTranslation();
    const [contentModel, setContentModel] = useState();
    const [result, setResult] = useState(null);
    const [modifiedResult, setModifiedResult] = useState();
    const [content, setContent] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [isFirstPage, setIsFirstPage] = useState(false);
    const [isLastPage, setIsLastPage] = useState(false);
    const modifiedResultRef = useRef();

    // Reference for modifiedresult for editing values in question topbar
    modifiedResultRef.current = modifiedResult;



    var modifyQuestionPoints = (questionName, points) => {
        let updatedResult = { ...modifiedResultRef.current, assignedPoints: { ...modifiedResultRef.current.assignedPoints, [questionName]: points } }
        modifiedResultRef.current = modifiedResult
        // Make sure parent resuts are also updated, 
        // otherwise the changes will be reseted eg. when changing display mode
        if (props.setModifiedResult) props.setModifiedResult(updatedResult)
    }

    var modifyQuestionComment = (questionName, comment) => {
        if (comment === modifiedResultRef.current.assignedComments[questionName]) return
        if (!comment && !modifiedResultRef.current.assignedComments[questionName]) return
        let updatedResult = { ...modifiedResultRef.current, assignedComments: { ...modifiedResultRef.current.assignedComments, [questionName]: comment } }
        modifiedResultRef.current = modifiedResult
        // Make sure parent resuts are also updated, 
        // otherwise the changes will be reseted eg. when changing display mode
        if (props.setModifiedResult) props.setModifiedResult(updatedResult)
    }
    useEffect(() => {
        // There are 3 different ways to load resutls
        // 1. Using props.result
        // 2. Using resultId URL parameter
        // 3. Using userId and contentId URL parameters
        F_handleSetShowLoader(true)
        if (props.editMode !== undefined) setEditMode(props.editMode)
        if ((props.result !== undefined) && (props.content !== undefined)) {
            setResult(props.result)
            setContent(props.content)
        } else if (resultId) {
            ResultService.get(resultId).then(
                (response) => {
                    setResult(response.data)
                    setContent(response.data.content)
                },
                (error) => {
                    let errorMessage = F_getErrorMessage(error)
                    F_showToastMessage(errorMessage, 'error')
                    F_handleSetShowLoader(false);
                }
            )
        } else if (userId && contentId) {
            ResultService.getLatestResultForUser(userId, contentId).then(
                (response) => {
                    setResult(response.data)
                    setContent(response.data.content)
                },
                (error) => {
                    let errorMessage = F_getErrorMessage(error)
                    F_showToastMessage(errorMessage, 'error')
                    F_handleSetShowLoader(false);
                }
            )
        }
    }, [props.result, props.content, props.editMode]);

    useEffect(() => {
        setModifiedResult(props.modifiedResult)
    }, [props.modifiedResult]);

    useEffect(() => {
        if (result && content) {
            //F_handleSetShowLoader(true)
            Survey
                .StylesManager
                .applyTheme("modern");

            Survey.Serializer.addProperty("question", { name: "items:texitems", default: [] });
            Survey.Serializer.addProperty("question", { name: "subtype:string", default: "" });
            Survey.Serializer.addProperty("question", { name: "fileName:string", default: "" });
            Survey.Serializer.addProperty("question", { name: "file:string", default: "" });
            Survey.Serializer.addProperty("question", { name: "test:string", default: "" });
            Survey.Serializer.addProperty("question", { name: "pointsForCorrectAnswer:number", default: 1 });
            Survey.Serializer.addProperty("text", { name: "caseSensitive:boolean", default: false });
            Survey.Serializer.addProperty("comment", { name: "caseSensitive:boolean", default: false });
            Survey.Serializer.addProperty("text", { name: "diacriticSensitive:boolean", default: false });
            Survey.Serializer.addProperty("comment", { name: "diacriticSensitive:boolean", default: false });
            Survey.Serializer.addProperty("survey", { name: "gradingScale:string", default: null });
            Survey.Serializer.addProperty("survey", { name: "revealAnswers:boolean", default: false });

            let contentJSON = {
                ...content,
                showNavigationButtons: false,
                showPrevButton: true,
                mode: "display",
                showProgressBar: "off",
                questionsOrder: undefined,
                showQuestionNumbers: "on",
                maxTimeToFinish: 0, showTimerPanel: "none"
            }

            // contentJSON.pages.forEach(page => {
            //     if (page.elements) {
            //         page.elements.forEach(element => {

            //             if (element.subtype === 'blanks') {// Remove correct answers from title
            //                 let titleObj = $(`<div>${element.title}</div>`)
            //                 titleObj.find('blank').text('')
            //                 element.title = titleObj.prop('outerHTML');
            //             }
            //         })
            //     }
            // })


            let newContentModel = new Survey.Model(contentJSON)
            newContentModel.onTextMarkdown.add(doMarkdown);
            newContentModel.data = result.data

            if (props.setContentModel) {// Set contentModel for parent component
                props.setContentModel(newContentModel)
            }

            // Use page number from parent component
            if (props.currentPageNo)// Jump to provided page number
                newContentModel.currentPage = newContentModel.pages[props.currentPageNo];
            // Keep track of page number for parent component
            newContentModel.
                onCurrentPageChanged
                .add(function (survey, options) {
                    setIsFirstPage(survey.isFirstPage)
                    setIsLastPage(survey.isLastPage)
                    if (props.setCurrentPageNo) props.setCurrentPageNo(survey.currentPageNo)
                })


            newContentModel
                .onAfterRenderQuestion
                .add(async function (survey, options) {

                    var question = options.question;
                    var correctAnswer = question.correctAnswer;
                    var answer = survey.getValue(question.name);
                    var comment = editMode ? modifiedResultRef?.current?.assignedComments[question.name] : result.assignedComments[question.name]
                    var name = t("Question") + ' ' + (options.question.visibleIndex + 1)
                    let showCorrectAnswer = (survey.revealAnswers || (props.trainerMode && result?.canEdit))

                    var questionElement;

                    // Create new root element for inserting React components
                    var componentRoot = document.createElement("div");
                    componentRoot.style.width = "100%"
                    // Append it to parent of SurveyJS question element
                    options.htmlElement.parentNode.append(componentRoot)
                    // Remove SurveyJS question element
                    options.htmlElement.style.display = 'none'






                    if (ContentService.canBeAnswered(question)) {

                        // Calculate points
                        var points = ContentService.getScoredPointsForQuestion(question.getConditionJson(), survey.data, editMode ? modifiedResultRef?.current?.assignedPoints : result.assignedPoints)
                        




                        // ########################### #################################
                        // PREPARE TOP BAR ELEMENT #####################################
                        // ########################### #################################
                        // Create proper React badge element
                        let badgeColor = 'warning'
                        if (points>=0){
                            let gradingScale = props.event ? props.event.gradingScale : props.content.gradingScale
                            let passed = ContentService.isQuestionPassed(points, question.pointsForCorrectAnswer, gradingScale)
                            badgeColor = passed ? 'success' : 'error'
                        }
                        var badge = <EBadge  sx={{ ml: 1, mr: 1, mb: "-4px" }} ecolor={badgeColor}  variant="dot" />
                        var topBar = <Grid container className={`questionTopBar`}>
                            <Grid item xs={12} lg={3} className={`${classes.questionName}`} >
                                {name}
                            </Grid>
                            <Grid item xs={11} lg={9}>
                                <ETextField
                                    className={editMode ? '' : classes.readOnlyInput}
                                    
                                    label={t("Points")}
                                    InputProps={
                                        {
                                            readOnly: (!editMode),
                                            endAdornment: <InputAdornment position="start">{"/ " + question.pointsForCorrectAnswer}</InputAdornment>,
                                        }
                                    }
                                    InputLabelProps={{ shrink: true }}
                                    type="number"
                                    placeholder='0'
                                    onFocus={event => {
                                        event.target.select();
                                    }}
                                    onClick={event => {
                                        event.target.select();
                                    }}
                                    localValue={points}
                                    localOnChange={(event, localValue, setLocalValue)=>{
                                        let value = event.target.value
                                        if (value > question.pointsForCorrectAnswer || value < 0){
                                            F_showToastMessage(t("Value must be in range from 0 to ")+ question.pointsForCorrectAnswer+" "+t("points"), 'error')
                                            // Restore last correct value
                                            setLocalValue(localValue)
                                        }else{
                                            setLocalValue(value)
                                            modifyQuestionPoints(question.name, parseFloat(value))
                                        }
                                    }}
                                    localOnBlur={(event,localValue,setLocalValue)=>{
                                        F_showToastMessage(t("Updated number of points"), 'success')
                                    }}
                                />

                                {(comment || editMode) &&
                                    <ETextField
                                        className={editMode ? '' : classes.readOnlyInput}
                                        style={{ width: 'calc( 100% - 120px )' }}
                                        onFocus={event => {
                                            event.target.select();
                                        }}
                                        onClick={event => {
                                            event.target.select();
                                        }}
                                        inputProps={
                                            { readOnly: !editMode }
                                        }
                                        label="Comment"
                                        localValue={comment??''}
                                        localOnBlur={(event,localValue,setLocalValue)=>{
                                            F_showToastMessage(t("Updated comment for a question"), 'success')
                                            setLocalValue(event.target.value)
                                            modifyQuestionComment(question.name, event.target.value)
                                        }}
                                    />

                                }
                            </Grid >
                        </Grid >

                        if (question.subtype === 'blanks') answer = result.data[question.name]
                        
                        // ########################### ###########################
                        // CREATE MAIN COMPONENT #################################
                        // ########################### ###########################
                        questionElement = <Element element={question.getConditionJson()} value={answer} showCorrectAnswer={showCorrectAnswer} showSettings={true} showPointsForCorrectAnswer={true} readOnly={true} inline={question.subtype=='attachment' ? true: false}></Element>
                        // Creat main component
                        var component = <>
                            {topBar}
                            {questionElement}
                        </>
                        // Requires to provide `theme` once more and render component
                        ReactDOM.render(<BrowserRouter><ThemeProvider theme={theme}><ToastProvider placement="bottom-right"><MainProvider>{component}</MainProvider></ToastProvider></ThemeProvider></BrowserRouter>, componentRoot);


                    } else {
                        // Find and transform html elements from SurveyJS into React Components 
                        // Transform question element into React Component
                        name = t("Element") + ' ' + (options.question.visibleIndex + 1)


                            questionElement = <>
                                <div className={`${classes.topBar} ${classes.questionName}`} >
                                    {name}
                                </div>

                                <div>
                                    <Element element={question.getConditionJson()} value={answer} showCorrectAnswer={showCorrectAnswer} correctValue={correctAnswer} readOnly={true}></Element>

                                </div>
                            </>
                        
                        // Creat main component
                        var component = <>
                            {questionElement}
                        </>
                        // Requires to provide `theme` once more and render component
                        ReactDOM.render(<BrowserRouter><ThemeProvider theme={theme}><ToastProvider placement="bottom-right"><MainProvider>{component}</MainProvider></ToastProvider></ThemeProvider></BrowserRouter>, componentRoot);


                    }
                });

            setIsFirstPage(newContentModel.isFirstPage)
            setIsLastPage(newContentModel.isLastPage)
            F_removeAllToasts()//Important, otherwise custom question will be broken when toasts are hidden
            setTimeout(function () {
                F_handleSetShowLoader(false);
                setContentModel(newContentModel)
            }, 1000);
        }
    }, [result, content, editMode, , window.innerWidth, window.innerHeight]);


    if (!contentModel) return (<></>)
    else return (
        <div className={classes.contentResult}><Survey.Survey model={contentModel}> </Survey.Survey>
            <div style={{ display: 'inline-block', width: '100%', padding: '15px 0' }} >
                {!isFirstPage &&
                    <StyledButton eSize="small" eVariant="primary" onClick={() => contentModel.prevPage()}>
                        {t("Previous page")}
                    </StyledButton>

                }
                {!isLastPage &&

                    <StyledButton style={{ float: 'right' }} eSize="small" eVariant="primary" onClick={() => contentModel.nextPage()}>
                        {t("Next page")}
                    </StyledButton>

                }
            </div>
        </div>

    );
}



export default DisplayTestResults;
