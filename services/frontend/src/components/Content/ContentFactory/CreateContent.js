import React, { useEffect, useState, useRef } from "react";
import ReactDOM from 'react-dom';
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useParams, useLocation } from "react-router-dom";
import * as Survey from "survey-knockout";
import * as SurveyCreator from "survey-creator";
import showdown from 'showdown';
import Confirm from "components/common/Hooks/Confirm";
// Context
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// Services
import ContentService from "services/content.service";

// MUI v4
import { theme } from "MuiTheme";

import { ThemeProvider } from '@material-ui/core/styles';

import { useMediaQuery } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

// MUI v5
import {Grid, Box} from "@mui/material"

// Other components
import Editor from "./Editor";
import DisplayContent from "components/Content/Display/DisplayContent"
import Toolbox from "./Toolbox";
import SaveContent from "./SaveContent";

// Icons
import { ReactComponent as PreviewIcon } from 'icons/icons_48/Preview.svg';
import { ReactComponent as SaveIcon } from 'icons/icons_48/Save.svg';
import { ReactComponent as AddPageIcon } from 'icons/icons_48/add.svg';

// Styled components
import OptionsButton from "components/common/OptionsButton";
import ESvgIcon from "styled_components/SvgIcon";
import EButton from 'styled_components/Button'
import EIconButton from 'styled_components/EIconButton'
//CSS
import "./CreateContent.css";
import "survey-knockout/modern.css";
import "survey-knockout/survey.css";
import "survey-creator/survey-creator.css";


//CUSTOM WIDGETS
import * as widgets from "surveyjs-widgets";
import $ from "jquery";
import "jquery-ui-dist/jquery-ui.css";


import "jquery-bar-rating/jquery.barrating.js";
import "jquery-bar-rating/dist/themes/fontawesome-stars.css";
import "jquery-bar-rating/dist/themes/fontawesome-stars-o.css";
import "jquery-bar-rating/dist/themes/css-stars.css";

import "nouislider/distribute/nouislider.min.css";

//Redux
import {useDispatch, useSelector} from "react-redux";
import { update, remove, setActiveIndex } from "app/features/ContentFactory/data"

const useStyles = makeStyles(theme => ({

    mainContainer: {
        height: 'calc(100%)',// Full height - header
        fontFamily: "Nunito",
    },
    mainContainerExtraSmallScreen: {
        height: 'calc(100%)',// Full height - header
        background: theme.palette.glass.light,
        fontFamily: "Nunito",
    },
    editorMainContainer: {
        height: '100%',// Full height - header
    },
    toolboxMainContainer: {
        height: '100%',// Full height - header
        background: theme.palette.shades.white30,	
        borderRadius:"8px",	
        margin:"auto",
        width: '350px'
    },
    navigationMobileContainer: {
        position: 'fixed', 
        bottom: 0, width: 'fill-available',
        MozWidth: '-moz-available', 
        WebkitWidth: '-webkit-fill-available',
        zIndex: 2 
    },
    

    navigationMobile: {
        background: theme.palette.neutrals.white,
        height: '100%',
        width: '100%'
    },
    backIcon: {
        "& path": {
            stroke: theme.palette.primary.darkViolet,
        }
    },
    previewIcon: {
        "& path": {
            stroke: theme.palette.primary.darkViolet,
        }
    },
    moreIcon: {
        "& path": {
            stroke: theme.palette.primary.darkViolet,
        }
    },
    saveIcon: {
        fill: 'transparent',
        "& path": {
            stroke: theme.palette.neutrals.white,
        }
    },
}))


if (!window["surveyjs-widgets-loaded"]) {//Only once, as it was disturbing in development process
    window["$"] = window["jQuery"] = $;
    widgets.jqueryuidatepicker(Survey, $);
    widgets.jquerybarrating(Survey);
    widgets.nouislider(Survey);
    widgets.sortablejs(Survey);
    widgets.ckeditor(Survey);
    window["surveyjs-widgets-loaded"] = true;
}

SurveyCreator
    .StylesManager
    .applyTheme("modern");

export default function CreateContent(props) {
    const classes = useStyles();
    const navigate = useNavigate();
    const isMobileScreen = useMediaQuery(theme => theme.breakpoints.down("sm"), { noSsr: true });
    const isExtraSmallScreen = useMediaQuery(theme => theme.breakpoints.down("xs"), { noSsr: true });
    const { t, i18n } = useTranslation();
    const { isConfirmed } = Confirm();

    const [creator, setCreator] = useState(null);
    const [contentType, setContentType] = useState(props.contentType)
    const [currentPageNumber, setCurrentPageNumber] = useState(1)

    // Redux
    // Load state from Redux store
    const {activeIndex, contents} = useSelector(s=>s.contentFactory);
    const dispatch = useDispatch();

    // setCurrentRoute
    const { setMyCurrentRoute, F_showToastMessage, F_handleSetShowLoader } = useMainContext();

    const stateRef = useRef();
    const location = useLocation();

    const [windowHeight, setWindowHeight] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);

    const [contentJSON, setContentJSON] = useState({});
    const [isContentTooLarge, setIsContentTooLarge] = useState(false);
    const [showSavingPage, setShowSavingPage] = useState(false);
    const [showPreview, setShowPreview] = useState(false);

    const [newElementId, setNewElementId] = useState(undefined);

    const [dismissCounter, setDismissCounter] = useState(0);
    const [anchorNavigationButton, setAnchorNavigationButton] = useState(null); // For opening menu for page
    const openNavigationMenu = (event) => { setAnchorNavigationButton(event.currentTarget); };
    const closeNavigationMenu = () => { setAnchorNavigationButton(null); };
    stateRef.current = { "contentJSON": contentJSON, creator: creator, currentPageNumber: currentPageNumber };

    useEffect(() => {
        if (!showPreview) setMyCurrentRoute("Content Factory")
    }, [showPreview])
    

    useEffect(() => {
        if (currentPageNumber && stateRef.current?.creator?.survey?.currentPage != null)
            stateRef.current.creator.survey.currentPage = stateRef.current.creator.survey.pages[currentPageNumber - 1]
    }, [currentPageNumber])

    useEffect(() => {//Autosave changes in redux state
        if (Object.keys(contentJSON).length !== 0) {
            try {
                dispatch(update(structuredClone(contentJSON)))
                setIsContentTooLarge(false)
            } catch (error) {
                if (error.name === 'QuotaExceededError' && !isContentTooLarge) {
                    setIsContentTooLarge(true)
                    F_showToastMessage("Content is too large. Autosaving will be disabled.", 'error')
                }
                else console.log(error)
            }
        }
    }, [contentJSON]);


    const refreshCorrectAnswerInModalEditor = () => {
        let refreshButton = $('#surveyquestioneditorwindow div[data-property="correctAnswer"] .btn-secondary')
        F_handleSetShowLoader(true)
        setTimeout(() => {
            refreshButton.trigger('click');
            F_handleSetShowLoader(false)
        }, 400)

    }

    useEffect(() => {
        if (!showPreview){
            const updateWindowDimensions = () => {
                setWindowHeight(window.innerHeight);
                setWindowWidth(window.innerWidth);
            };

            window.addEventListener("resize", updateWindowDimensions);
            return () => window.removeEventListener("resize", updateWindowDimensions)
        }
    }, [showPreview]);

    useEffect(() => { // Connect/disconnect observer for surveyquestioneditorwindow
        if (creator) {
            window.questionEditorWindowStyleObserver = new window.MutationObserver(mutations => mutations.forEach(m => {
                // Make sure changes were not already made to the modal window
                // Solve problem with for maxizing/minmazing WYSIWYG editor
                let alradyProcessed = document.getElementById('tool-name-element');
                if (alradyProcessed !== null) return
                
                
                var questionEditorWindow = $('#surveyquestioneditorwindow');
                if (questionEditorWindow.is(":visible")) {
                    let name = questionEditorWindow.find('div[data-property="name"] input').val()
                    let element = stateRef.current.creator?.survey?.getQuestionByName(name)

                    // Find proper icon and name based on surveyJS type
                    const toolsNames = {
                        'boolean': t("Select True/False"),
                        'radiogroup': t("Select single answer"),
                        'checkbox': t("Select multiple answers"),
                        'text': t("Single line answer"),
                        'editor': t("Open answer"),
                        'dictation': t("Dictation"),
                        'blanks': t("Blanks"),
                        'sortablelist': t("Sort answers"),
                        'barrating': t("Rating"),
                        'nouislider': t("Slider"),
                        'datepicker': t("Date picker"),
                        'attachment': t("Answer with a file"),
                        'expression': t("WYSIWYG Editor"),
                        'file': t("Upload an attachement"),
                        'test': t("Upload a test")
                    }

                    let refreshButton = questionEditorWindow.find('div[data-property="correctAnswer"] .btn-secondary')
                    let choicesTab = questionEditorWindow.find('.svd_items_table')
                    var choicesButtons = $('#surveyquestioneditorwindow .svd-items-control-footer input')

                    choicesTab.on('drop dragend', 'tr', function () {
                        refreshCorrectAnswerInModalEditor();
                    })
                    choicesTab.on('mouseup', 'div.svd-itemvalue-action', function () {
                        refreshCorrectAnswerInModalEditor();
                    })
                    choicesTab.on('keyup', 'div.svd-itemvalue-action', function () {
                        refreshCorrectAnswerInModalEditor();
                    })

                    choicesTab.on('change', 'input.form-control.svd-control.svd_editor_control.svd-focusable', function (event) {
                        refreshCorrectAnswerInModalEditor();
                    })

                    choicesButtons.on('click', function () {
                        refreshCorrectAnswerInModalEditor();
                    })

                    let toolName = toolsNames[element.subtype || element.getType()]
                    let editorElement = questionEditorWindow.find('div.svd-accordion-tab-content:first')
                    var toolNameElement = document.createElement("div");
                    toolNameElement.setAttribute('id', 'tool-name-element')
                    toolNameElement.innerHTML = toolName
                    toolNameElement.style.fontSize = '25px'
                    toolNameElement.style.fontWeight = 'bold'
                    toolNameElement.style.marginBottom = '15px'
                    editorElement.prepend(toolNameElement)


                    let subtype = element.subtype
                    if (subtype === "math-editor") {
                        questionEditorWindow.find('div[data-property="correctAnswer"]').addClass('math-editor')
                    }
                    else if (subtype === "blanks") {
                        let titleElement = questionEditorWindow.find('div[data-property="title"]');
                        titleElement.addClass('blanks')

                        let addBlankButton = <ThemeProvider theme={theme}><>
                        <p>{t("Select a place inside textarea and then press `Add new blank` button. To edit exiting blanks just double-click on them.")}</p>
                        <EButton size="small" eVariant="secondary"  startIcon={<AddPageIcon />}
                            onClick={() => {
                            document.querySelector(".modal-content .blanks .cke_button__blanks").click()
                            }}>
                                {t("Add new blank")}
                        </EButton></></ThemeProvider>

                        let addBlankButtonRoot = document.createElement("div");
                        addBlankButtonRoot.style.width = "100%";
                        titleElement.after(addBlankButtonRoot)
                        ReactDOM.render(addBlankButton, addBlankButtonRoot);
                        questionEditorWindow.find('div[data-property="title"]').after(addBlankButton)
                        questionEditorWindow.find('div[data-property="correctAnswer"]').hide()
                        questionEditorWindow.find('div[data-property="pointsForCorrectAnswer"]').hide()
                    }
                    if (subtype === "file" || subtype === "test") {
                        questionEditorWindow.find('div[data-property="title"]').hide()
                        questionEditorWindow.find('div[data-property="pointsForCorrectAnswer"]').hide()
                    }
                    else if (subtype === "attachment") {
                        //
                    }
                    else if (!questionEditorWindow.find('div[data-property="correctAnswer"]').length) {
                        questionEditorWindow.find('div[data-property="pointsForCorrectAnswer"]').hide()
                    }

                }
            }))
            try {
                window.questionEditorWindowStyleObserver.observe(document.getElementById('surveyquestioneditorwindow'), { attributes: true, attributeFilter: ['style'] })
            }catch (error){
                console.error("Could not observe question editor window")
            }
        }

        return () => {
            if (window.questionEditorWindowObserver) window.questionEditorWindowObserver.disconnect()
        };

    }, [creator]);


    useEffect(() => {// Close saving page whenever tab was changed
        setShowSavingPage(false)
    }, [activeIndex])


    useEffect(() => {
        if ((contentType && !showSavingPage && !showPreview) || dismissCounter) {
            F_handleSetShowLoader(true)
            let timer = setTimeout(() => {
                setCurrentPageNumber(1);
                const CKEDITOR = window.CKEDITOR;

                var CkEditor_ModalEditor = {
                    afterRender: function (modalEditor, htmlElement) {
                        if (typeof CKEDITOR === "undefined") return;
                        var editor = CKEDITOR.replace(htmlElement);
                        var isUpdating = false;
                        editor.on("change", function () {
                            isUpdating = true;
                            modalEditor.editingValue = editor.getData();
                            isUpdating = false;
                        });
                        editor.setData(modalEditor.editingValue);
                        modalEditor.onValueUpdated = function (newValue) {
                            if (!isUpdating) {
                                editor.setData(newValue);
                            }
                        };
                    },
                    destroy: function (modalEditor, htmlElement) {
                        if (typeof CKEDITOR === "undefined") return;
                        var instance = CKEDITOR.instances[htmlElement.id];
                        if (instance) {
                            instance.removeAllListeners();
                            instance.destroy(true);
                            CKEDITOR.remove(instance);
                        }
                    }
                };
                SurveyCreator.SurveyPropertyModalEditor.registerCustomWidget("text", CkEditor_ModalEditor);


                //Create showdown markdown converter
                var converter = new showdown.Converter();
                function doMarkdown(survey, options) {
                    //convert the markdown text to html
                    var str = converter.makeHtml(options.text);
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


                //frLocale = Survey.surveyLocalization.locales["fr"];
                //frLocale.addPanel = "Dodaj panel";
                SurveyCreator.localization.currentLocale = i18n.language;


                // Change item editor icons
                Survey.settings.allowShowEmptyTitleInDesignMode = false;
                Survey.settings.allowShowEmptyDescriptionInDesignMode = false;

                // ### ### ### ### ### ### ### ### ### ### ### ### ### ##
                // ### ### ### Add new properties ### ### ### ### ### ###
                // ### ### ### ### ### ### ### ### ### ### ### ### ### ##
                // Add a property to the base question class and as result to all questions 

                // Add properties to survey
                Survey.Serializer.addProperty("survey", { name: "_id:string", default: null });
                Survey.Serializer.addProperty("survey", { name: "contentType:string", default: null });

                Survey.Serializer.addProperty("survey", { name: "durationTime:number", default: 0 });
                Survey.Serializer.addProperty("survey", { name: "language:text", default: 'fr' });

                Survey.Serializer.addProperty("survey", { name: "trainingModule:string", default: null });
                Survey.Serializer.addProperty("survey", { name: "chapter:string", default: null });
                Survey.Serializer.addProperty("survey", { name: "capsule:string", default: null });
                Survey.Serializer.addProperty("survey", { name: "level:string", default: null });

                Survey.Serializer.addProperty("survey", { name: "image:string", default: null });

                Survey.Serializer.addProperty("survey", { name: "tags:object", default: [] });
                Survey.Serializer.addProperty("survey", { name: "groups:object", default: [] });
                Survey.Serializer.addProperty("survey", { name: "cocreators:object", default: [] });
                Survey.Serializer.addProperty("survey", { name: "books:object", default: null });

                Survey.Serializer.addProperty("survey", { name: "hideFromTrainees:boolean", default: false });
                Survey.Serializer.addProperty("survey", { name: "allowMultipleAttempts:boolean", default: false });
                Survey.Serializer.addProperty("survey", { name: "sendToLibrary:boolean", default: true });
                Survey.Serializer.addProperty("survey", { name: "sendToCloud:boolean", default: false });

                Survey.Serializer.addProperty("question", { name: "subtype:string", readOnly: true, default: null });
                Survey.Serializer.addProperty("question", { name: "isFirstDisplay:boolean", default: true });

                Survey.Serializer.addProperty("question", { name: "items:texitems", default: [] });

                Survey.Serializer.addProperty("question", { name: "file:string", default: "" });

                // List of AI detections which are suggested to the user
                Survey.Serializer.addProperty("survey", { name: "detectedLevels:object", default: [] });
                Survey.Serializer.addProperty("survey", { name: "detectedTrainingModules:object", default: [] });
                Survey.Serializer.addProperty("survey", { name: "detectedChapters:object", default: [] });
                Survey.Serializer.addProperty("survey", { name: "detectedCapsules:object", default: [] });


                Survey.Serializer.findProperty("itemvalue", "text").visible = false;

                // ### ### ### ### ### ### ### ### ### ### ### ### ### ##
                // ### ### ### Show only requested properties ### ### ###
                // ### ### ### ### ### ### ### ### ### ### ### ### ### ##
                var maxVisibleIndex = 0;
                const showTheProperty = (className, propertyName, visibleIndex) => {
                    if (!visibleIndex) visibleIndex = ++maxVisibleIndex;
                    else {
                        if (visibleIndex > maxVisibleIndex) maxVisibleIndex = visibleIndex;
                    }
                    //Use Survey Serializer to find the property, it looks for property in the class and all it's parents
                    var property = Survey.Serializer.findProperty(className, propertyName)
                    if (!property) return;
                    property.visibleIndex = visibleIndex;
                    //Custom JavaScript attribute that we will use in onShowingProperty event
                    property.showProperty = true;
                }

                showTheProperty("question", "title");

                showTheProperty("question", "name");
                showTheProperty("survey", "title");
                showTheProperty("question", "subtype");

                // Remove option for adding logo 
                Survey.Serializer.removeProperty("survey", "logo");


                // Show Designer, Test Survey, JSON Editor and additionally Logic tabs
                var options = {
                    showDesignerTab: false,
                    // the embedded survey tab. It is hidden by default
                    showEmbededSurveyTab: false,
                    // the test survey tab. It is shown by default
                    showTestSurveyTab: false,
                    // the JSON text editor tab. It is shown by default
                    showJSONEditorTab: false,
                    // show the "Options" button menu. It is hidden by default 
                    showOptions: false,
                    // Set this survey option to false if you want to hide the expand/collapse button for showing survey logo/title.
                    allowControlSurveyTitleVisibility: false,
                    // Hide pages
                    //pageEditMode: "single",
                    showElementEditorAsPropertyGrid: false,
                    showTitlesInExpressions: true,

                    //allowEditExpressionsInTextEditor: false,

                    showSurveyTitle: "always",
                };


                //if (contentType === "TEST" || contentType === "ASSET") {
                options.questionTypes = ["checkbox", "text", "comment", "radiogroup", "dropdown", "rating", "boolean", "ranking", "expression"];
                Survey.Serializer.addProperty("question", { name: "pointsForCorrectAnswer:number", default: 1 });
                Survey.Serializer.addProperty("text", { name: "caseSensitive:boolean", default: false });
                Survey.Serializer.addProperty("comment", { name: "caseSensitive:boolean", default: false });
                Survey.Serializer.addProperty("text", { name: "diacriticSensitive:boolean", default: false });
                Survey.Serializer.addProperty("comment", { name: "diacriticSensitive:boolean", default: false });
                Survey.Serializer.addProperty("survey", { name: "gradingScale:string", default: null });
                Survey.Serializer.addProperty("survey", { name: "revealAnswers:boolean", default: false });
                showTheProperty("question", "pointsForCorrectAnswer");
                showTheProperty("question", "correctAnswer");
                showTheProperty("text", "caseSensitive");
                showTheProperty("comment", "caseSensitive");
                showTheProperty("text", "diacriticSensitive");
                showTheProperty("comment", "diacriticSensitive");
                showTheProperty("selectbase", "choices");
                showTheProperty("nouislider", "rangeMax");
                showTheProperty("nouislider", "rangeMin");
                Survey.Serializer.addProperty("question", { name: "locked:boolean", default: false });
                showTheProperty("question", "locked");
                
            
                //if (contentType === "PRESENTATION" || contentType === "ASSET") {
                Survey.Serializer.addProperty("question", { name: "test:string", default: "" });
                //Survey.Serializer.addProperty("question", { name: "locked:boolean", default: false });
                //Survey.Serializer.removeProperty("question", "pointsForCorrectAnswer")
                //options.questionTypes = ["expression"];

                //showTheProperty("question", "locked");
                


                // Remove inplace question editing 
                SurveyCreator.removeAdorners(["title"])
                //Remove default properties layout in property grid and have only one "general" category.
                SurveyCreator.SurveyQuestionEditorDefinition.definition = {};
                //create the SurveyJS Creator and render it in div with id equals to "creatorElement"
                var creator = new SurveyCreator.SurveyCreator("hiddenCreatorElement", options);
                //Show toolbox in the right container. It is shown on the left by default
                creator.showToolbox = "right";
                // Set custom designer placeholder
                creator.placeholderHtml = '<div></div>';
                //Show property grid in the right container, combined with toolbox
                creator.showPropertyGrid = "none";
                // Inplace editing edit itemvalue.value and not itemvalue.text
                creator.inplaceEditForValues = true;
                creator.onSetPropertyEditorOptions.add(function (sender, options) {
                    options.editorOptions.showTextView = false;
                });

                creator
                    .onQuestionAdded
                    .add(function (sender, options) {
                        var q = options.question;
                        //if (contentType === "TEST") {
                            //if (q.subtype=='blanks') 
                        if (q.title === q.name) q.title = "<span style='font-size: 14px;'>" + t("Click on the edit icon to adjust the element.") + "</span>"
                    });


                //Use it to show properties that has our showProperty custom attribute equals to true
                creator.onShowingProperty.add(function (sender, options) {
                    options.canShow = options.property.showProperty === true;
                });

                creator.toolbox.addItem({
                    name: "attachment",
                    isCopied: false,
                    title: t("Fill in the blanks"),
                    json: { "type": "expression", "subtype": "attachment" }
                });

                //if (contentType === "TEST" || contentType === "ASSET") {

                creator.toolbox.addItem({
                    name: "blanks",
                    isCopied: false,
                    title: t("Fill in the blanks"),
                    json: { "type": "text", "subtype": "blanks", 'pointsForCorrectAnswer': 0 }
                });

                creator.toolbox.addItem({
                    name: "dictation",
                    isCopied: false,
                    title: t("Dictation"),
                    json: { "type": "comment", "subtype": "dictation", 'pointsForCorrectAnswer': 1 }
                });

                creator.toolbox.addItem({
                    name: "math",
                    isCopied: false,
                    iconName: "icon-expression",
                    title: t("Math"),
                    json: { "type": "editor", "subtype": "math-editor" }
                });
                //}
                //else if (contentType === "PRESENTATION" || contentType === "ASSET") {

                    // creator.toolbox.addItem({
                    //     name: "test",
                    //     isCopied: false,
                    //     iconName: "icon-checkbox",
                    //     title: t("Test"),
                    //     json: { "type": "expression", "subtype": "test", "readOnly": "true", "title": '<div class="select-test" style="width:100%"> </div>' }
                    // });


                    // creator.toolbox.removeItem("datepicker");
                    // creator.toolbox.removeItem("barrating");
                    // creator.toolbox.removeItem("nouislider");
                    // creator.toolbox.removeItem("sortablelist");
                    // creator.toolbox.removeItem("editor");

                //}

                // Both test and presentation
                creator.toolbox.addItem({
                    name: "file",
                    isCopied: false,
                    iconName: "icon-file",
                    title: t("File"),
                    json: { "type": "expression", "subtype": "file", "readOnly": "true", "title": '<div class="select-file" style="width:100%"> </div>' }
                });


                function createBlanksWidget(parent, question) {
                    question.items = [];
                    question.correctAnswer = {};

                    let instruction = question.title
                    var htmlObject = document.createElement('div');
                    htmlObject.innerHTML = instruction;
                    let blanks = htmlObject.getElementsByTagName("blank");
                    let totalPointsForCorrectAnswer = 0
                    for (var i = 0; i < blanks.length; i++) {
                        // name is an id
                        let name = blanks[i].id
                        // title is a correct answer
                        let title = blanks[i].innerHTML
                        question.correctAnswer[name] = title
                        // points for this correct blank 
                        let pointsForCorrectAnswer = blanks[i].getAttribute('value')
                        let item = { name: name, title: '', pointsForCorrectAnswer: pointsForCorrectAnswer }
                        
                        totalPointsForCorrectAnswer+=parseInt(pointsForCorrectAnswer)
                        question.items.push(item)
                    }
                    question.pointsForCorrectAnswer = totalPointsForCorrectAnswer

                }
                creator
                    .onPropertyValueChanging
                    .add(function (survey, options) {
                        //ROPERTY_CHANGED IN EDITOR
                        if (['value', 'rangeMin', 'rangeMax'].includes(options.propertyName)) {
                            refreshCorrectAnswerInModalEditor()
                        }
                    })

                creator
                    .onModified
                    .add(function (survey, options) {
                        if (options.type === "QUESTION_CHANGED_BY_EDITOR") {
                            F_handleSetShowLoader(true)
                            setTimeout(() => F_handleSetShowLoader(false), 500)

                            if (options.question.subtype === 'blanks') {// When banks are modified, html object must be adjusted 
                                let questionParentElement = window.document.getElementById(options.question.id)
                                createBlanksWidget(questionParentElement, options.question)
                            }
                        }
                    })
                creator
                    .onDesignerSurveyCreated
                    .add(function (editor, options) {

                        options
                            .survey
                            .onAfterRenderQuestion
                            .add(function (survey, options) {

                            });


                        options
                            .survey
                            .onTextMarkdown
                            .add(doMarkdown);
                    });




                // ### ### ### ### ### ### ### ### ### ### ### ### ### ##
                // ### ### ### Auto-save form ### ### ## ### ### ### ###
                // ### ### ### ### ### ### ### ### ### ### ### ### ### ##
                //Automatically save survey definition on changing. Hide "Save" button
                creator.isAutoSave = true;
                //Show state button here
                //creator.showState = true;
                //Setting this callback will make visible the "Save" button
                creator.saveSurveyFunc = function (saveNo, callback) {
                    let content = { ...stateRef.current.contentJSON }
                    // When auto save, overide only pages and title.
                    // Do not overide other settings, as they might been changed meanwhile inside SaveContent page
                    content.pages = creator.JSON.pages;
                    setContentJSON(content)

                    //We assume that we can't get error on saving data in local storage
                    //Tells creator that changing (saveNo) saved successfully.
                    //Creator will update the status from Saving to saved
                    callback(saveNo, true);
                }

                // Load from memory
                var activeContent =  structuredClone(contents[activeIndex-1])

                // If file was uploaded by `Upload external resources` in Welcome page
                let isExternalFile = !activeContent._id && activeContent.externalFile 
                if (isExternalFile) {
                    let file = activeContent.externalFile
                    activeContent.pages = [
                        {
                            "name": "page1",
                            "elements": [
                                {
                                    "type": "expression",
                                    "name": "question1",
                                    "title": "<div class=\"select-file\" style=\"width:100%\"> </div>",
                                    "readOnly": true,
                                    "subtype": "file",
                                    "file": file._id,
                                    "isFirstDisplay": false//Prevent auto-open for file-selector
                                    //"fileOriginalName": file.fileOriginalName,
                                    //"fileTextExtracted": file.fileTextExtracted
                                }
                            ]
                        }
                    ]
                    // Remove state - to prevent running once more
                    delete activeContent.externalFile
                }

                if (contentType === "PRESENTATION") activeContent.showQuestionNumbers = "off";
                else if (contentType === "TEST") activeContent.hideFromTrainees = true;


                // Load content from active tab
                var contentText =  JSON.stringify(activeContent)
                // If it's not a edit mode and object in localStorage has _id, clean localStorage

                creator.text = contentText
                setContentJSON(JSON.parse(contentText))
                setCreator(creator)
                setTimeout(() => {
                    // If file was uploaded by `Upload external resources` in Welcome page
                    if (isExternalFile){
                        // Go directly to saving page
                        setShowSavingPage(true)
                    } else F_handleSetShowLoader(false)
                
                }, 1200)
            }, 500);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [windowWidth, windowHeight, contentType, showSavingPage, showPreview, dismissCounter, activeIndex]);

    const dismiss = async () => {
        if (!await isConfirmed(t("Are you sure you want to dismiss all the changes?"))) return
        else {
            dispatch(remove(activeIndex-1))// active index is index of tab - remove takes index of content on the list
            dispatch(setActiveIndex(0))

            setShowSavingPage(false)
            setDismissCounter(dismissCounter+1)
        }
    }


    // Generate unique name of element which is used as id
    const generateElementName = () => {
        let name = (Math.random() + 1).toString(36).substring(2)
        return name
    }

    // Import asset into exising content by loadin asset
    // and inserting all it's elements into current page 
    const importAsset = async (assetId) => {
        F_handleSetShowLoader(true)
        // Prepare new elements from asset
        let response = await ContentService.getContent(assetId)
        let asset = response.data
        let newElements = []
        for (let page of asset.pages) {
            if (page.elements) {
                for (let element of page.elements) {
                    // generate new name/id
                    newElements.push({...element, name: generateElementName() })
                }
            }
        }

        let updatedContentJSON = { ...contentJSON }
        var currentPage = updatedContentJSON.pages[currentPageNumber - 1]
        if (currentPage) {
            if (currentPage.elements) currentPage.elements.push(...newElements)
            else currentPage.elements = newElements
        }
        else updatedContentJSON.pages[currentPageNumber - 1] = { name: `page${currentPageNumber}`, elements: newElements }
        //console.log('updatedContentJSON', updatedContentJSON)

        stateRef.current.creator.changeText(JSON.stringify(updatedContentJSON))
        setContentJSON(updatedContentJSON)
        F_handleSetShowLoader(false)
    }

    const deleteElement = (question) => {
        F_handleSetShowLoader(true)
        let pages = stateRef.current.creator.survey.pages
        let currentPageIndex = (stateRef.current.currentPageNumber - 1)
        let currentPage = pages[currentPageIndex]
        currentPage.removeQuestion(question)
        setTimeout(() => F_handleSetShowLoader(false), 300)
    }

    const duplicateElement = (creator, question) => {
        F_handleSetShowLoader(true)
        creator.fastCopyQuestion(question)
        setTimeout(() => F_handleSetShowLoader(false), 300)
    }

    const editElement = (creator, question) => {
        F_handleSetShowLoader(true)
        creator.showModalElementEditor(question)
        setTimeout(() => F_handleSetShowLoader(false), 500)
    }

    const updateElementProperty = (element, propertyName, value) => {
        let updatedContentJSON = { ...contentJSON }
        updatedContentJSON.pages.forEach(page => {
            if (page.elements) {
                page.elements.forEach(pageElement => {
                    if (pageElement.name === element.name) {
                        console.log('Setting ', propertyName, ' to ', value)
                        pageElement[propertyName] = value
                        //pageElement['title'] = 'xss'
                    }
                })
            }
        })
        stateRef.current.creator.text = JSON.stringify(updatedContentJSON)
        setContentJSON(updatedContentJSON)
        //setCreator(stateRef.current.creator)
    }

    const addNewElement = (questionType, index = undefined) => {
        F_handleSetShowLoader(true)
        let pages = stateRef.current.creator.survey.pages
        let currentPageIndex = stateRef.current.currentPageNumber - 1
        let currentPage = pages[currentPageIndex]
        let item = stateRef.current.creator.toolbox.getItemByName(questionType);

        var qJson = { ...item.json }
        // Randomize quesiton name, otherwise adding ckeditor throws an error
        qJson.name = generateElementName()
        var newElement = Survey.JsonObject.metaData.createClass(qJson.type);
        new Survey.JsonObject().toObject(qJson, newElement);
        if (index !== undefined) currentPage.addQuestion(newElement, index);
        else {
            currentPage.addQuestion(newElement);
        }
        setNewElementId(newElement.id)
        setTimeout(() => F_handleSetShowLoader(false), 300)

    }

    const getEditor = () => {
        let props = { contentJSON, updateElementProperty, isMobileScreen, setCurrentPageNumber, newElementId, setNewElementId, deleteElement, editElement, duplicateElement, addNewElement, importAsset }
        props.creatorRef = stateRef.current.creator
        props.currentPageNumber = stateRef.current.currentPageNumber
        return <Editor {...props}></Editor>
    }

    const getToolbox = () => {
        let props = { isMobileScreen, addNewElement, getNavigation, importAsset }
        return <Toolbox {...props}></Toolbox>
    }

    
    const navigationButtons = [
        {id: 1, name: t("Clear the document"),  disabled: 0, action: ()=>{closeNavigationMenu(); dismiss();}},
        {id: 2,  name: t("Save as new"), disabled: !contentJSON._id, action:() => {
            let content = { ...contentJSON }
            content.title = "";
            content.description = "";
            content.updatedAt = undefined
            content.createdAt = undefined
            content._id = undefined
            setContentJSON(content)
            navigate(`/create-content`, {replace: true})
            closeNavigationMenu()
            setShowSavingPage(true)
        }}
    ] 

    const getMobileNavigation = () => {
        return <div className={`${classes.navigationMobileContainer}`}>
            <Grid container item xs={12} className={`${classes.navigationMobile} py-1`} alignContent="space-around" justifyContent="flex-start">
                <div className="p-2" style={{ width: "fit-content", margin: 'auto' }}>
                    <EIconButton sx={{mr:3}} size="large" onClick={() => {setShowSavingPage(true) }}  color="secondary">
                        <ESvgIcon viewBox="0 0 48 48" className={classes.saveIcon} component={SaveIcon} />
                    </EIconButton>
                    <EIconButton sx={{mr:3}} size="large" onClick={() => { setShowPreview(true) }}  color="secondary">
                        <ESvgIcon viewBox="0 0 48 48" className={classes.previewIcon} component={PreviewIcon} />
                    </EIconButton>
                    <div style={{display: 'inline-block'}}><OptionsButton size="large" iconButton={true} btns={navigationButtons}></OptionsButton></div>
                    {/* <EIconButton onClick={(event) => { openNavigationMenu(event) }} className={`${classes['icon-button-large']}`} variant="contained" color="secondary">
                        <ESvgIcon viewBox="0 0 32 32" className={classes.moreIcon} component={MoreIcon} />
                    </EIconButton> */}
                </div>
            </Grid>

        </div>
    }
    const getNavigation = () => {
        return <Grid item xs={12} container sx={{justifyContent: 'space-between', alignItems: 'center'}}>
            <Grid item xs={7} lg={8}>
            {<EButton onClick={() => { setShowSavingPage(true) }} sx={{width: "100%", '& span': {overflow: 'hidden', display: 'block', textOverflow: 'ellipsis'}, minWidth: 'unset'}} eSize="medium" variant="contained" color="primary"   >{t("Saving options")}</EButton>}
            </Grid>
            <EIconButton onClick={() => { setShowPreview(true) }} size="large" variant="contained" color="secondary" >
                <ESvgIcon viewBox="0 0 48 48" className={classes.previewIcon} component={PreviewIcon} />	
            </EIconButton>            
            <div style={{display: 'inline-block'}}><OptionsButton size="large" iconButton={true} btns={navigationButtons}></OptionsButton></div>

        </Grid>

    }


    const getSavingPage = () => {
        let props = { contentJSON, setContentJSON, isMobileScreen }
        props.show = showSavingPage;
        props.setShow = setShowSavingPage;
        return <SaveContent {...props} />
    }


    if (showPreview) return <DisplayContent setShow={setShowPreview} isContentFactory={true} isPreview={true} content={contentJSON} />
    else return (
        <>
            {showSavingPage &&
                <div className={isExtraSmallScreen ? classes.mainContainerExtraSmallScreen : classes.mainContainer} style={{ position: 'relative' }} >
                    {getSavingPage()}
                </div>
            }
            {!showSavingPage &&
                <Grid className={isExtraSmallScreen ? classes.mainContainerExtraSmallScreen : classes.mainContainer} container style={{ position: 'relative' }}>
                    {(isMobileScreen) && <>
                        {getEditor()}
                        {getToolbox()}
                        {getMobileNavigation()}
                    </>}
                    {(!isMobileScreen) && <>
                        <Box sx={{width: {sm: 'calc(100% - 300px)', lg: 'calc(100% - 400px)'}}} className={classes.editorMainContainer}>
                            {getEditor()}
                        </Box>
                        <Box  sx={{width: {sm: '300px',lg: '400px'}}} className={classes.toolboxMainContainer}>
                            {getToolbox()}
                        </Box>
                    </>}

                </Grid>
            }
        </>
    )
};
