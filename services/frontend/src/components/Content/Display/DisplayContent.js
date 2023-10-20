// Component for displaying and executing content
// With startingPage, toolbar and page navigation
//
// SurveyJS component(<Survey.Survey>) is going to be replaced with Display.js

import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import * as Survey from "survey-react";
import { useNavigate, useLocation, useParams, BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import showdown from 'showdown';
import i18next from "i18next";

//Components
import { Box, Grid, IconButton, Typography, Container, Divider, Select, MenuItem, FormControl, Paper, ListItem, ListItemText, ListItemSecondaryAction } from '@mui/material';
// import { EButton } from "styled_components";
import ESwitchWithTooltip from "styled_components/SwitchWithTooltip";
import FileUpload from "components/common/File";
import SaveContent from "../ContentFactory/SaveContent";
import TopBar from './TopBar'
import BottomBar from './BottomBar'
import ETooltip from 'styled_components/Tooltip'
import dayjs from 'dayjs';
import BrainCoreProvideEmailPage from "./BrainCoreTest/ProvideEmailPage";

//Services
import ValidatorsService from "services/validators.service";
import ContentService from "services/content.service";
import ResultService from "services/result.service";
import AuthService from "services/auth.service";
import LogService from "services/log.service";
import EventService from "services/event.service";
import CognitiveSpace from "services/cognative-space.service"
import CommonService from "services/common.service"
// Icons
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as FileUploadIcon } from '../../../icons/icons_32/File_32.svg';
import CloseIcon from '@mui/icons-material/Close';
import LanguageIcon from '@material-ui/icons/Language';
import CancelIcon from '@mui/icons-material/Cancel';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CropFreeIcon from '@mui/icons-material/CropFree';
import MoreVertIcon from '@mui/icons-material/MoreVert';

//Other
import { baseURL } from "services/axiosSettings/axiosSettings";

import "survey-knockout/modern.css";
import "survey-knockout/survey.css";
import { makeStyles } from "@material-ui/core/styles";


// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

//CUSTOM WIDGETS
import * as widgets from "surveyjs-widgets";
import $ from 'jquery';
import "jquery-ui-dist/jquery-ui.css";
import { ArrowBackIos } from '@mui/icons-material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';


import "jquery-bar-rating/jquery.barrating.js";
import "jquery-bar-rating/dist/themes/fontawesome-stars.css";
import "jquery-bar-rating/dist/themes/fontawesome-stars-o.css";
import "jquery-bar-rating/dist/themes/css-stars.css";

import "nouislider/distribute/nouislider.min.css";


// For rendering
// import { ThemeProvider } from '@material-ui/core/styles';

import { MainProvider, useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { ToastProvider } from 'react-toast-notifications';

//MUI v4
// import { theme } from "MuiTheme";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider, flexbox, fontSize } from "@mui/system";
import StyledButton from "new_styled_components/Button/Button.styled";
import testStart from "../../../../src/img/braincore_test/adult.jpg";
import "./DisplayContent.scss";
import { theme } from "MuiTheme";
import CertificationSessionService from "../../../services/certification_session.service";
import Dialog from '@mui/material/Dialog';
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";
const { randomAnswersForBrainCoreAdultTest, randomAnswersForBrainCorePedagogyTest } = require('services/randomAnswers')

require("jquery-ui-dist/jquery-ui.js");
window["$"] = window["jQuery"] = $;

widgets.jqueryuidatepicker(Survey, $);

widgets.jquerybarrating(Survey);
widgets.nouislider(Survey);
widgets.sortablejs(Survey);
widgets.ckeditor(Survey);

const useStyles = makeStyles(theme => ({
  newButtonPrimary: {// NEW DESIGN - TO SHOULD BE MOVED INTO STYLED COMPONENTS
    // background: `${new_theme.palette.primary.PinkPurple} !important`,
    // border: 'none !important',
    // '&:hover': { background: `${new_theme.palette.secondary.Turquoise} !important` },
    // '&:disabled': {
    //   backgroundColor: `${new_theme.palette.newSupplementary.NSupGrey} !important`,
    // }
  },
  newButtonSecondary: {// NEW DESIGN - TO SHOULD BE MOVED INTO STYLED COMPONENTS
    // color: `${new_theme.palette.newSupplementary.NSupText} !important`,
    // '&:hover': { background: `${new_theme.palette.primary.PinkPurple} !important`, color: "white !important" }
  },

  newTextField: {
    '& .MuiFilledInput-root': {
      borderBottom: `2px solid ${new_theme.palette.primary.PinkPurple} !important`,
      '&.Mui-focused': {
        borderBottom: `2px solid ${new_theme.palette.secondary.Turquoise} !important`,
        '&:hover': {
          borderBottom: `2px solid ${new_theme.palette.secondary.Turquoise} !important`,
        }
      }
    }
  },
  newCheckbox: {// NEW DESIGN - TO SHOULD BE MOVED INTO STYLED COMPONENTS
    '&:not(.Mui-checked)': {
      '& svg': {
        fill: `${new_theme.palette.secondary.DarkPurple} !important`,
      }
    },
    '&.Mui-checked': {
      color: `${new_theme.palette.secondary.DarkPurple} !important`,
    },
  },

  newLinearProgress: {// NEW DESIGN - TO SHOULD BE MOVED INTO STYLED COMPONENTS
    marginBottom: '0px !important',
    background: `${new_theme.palette.secondary.DarkPurple} !important`,
    backgroundColor: `${new_theme.palette.secondary.DarkPurple} !important`,
    '& .MuiLinearProgress-bar1Determinate': {
      background: `${new_theme.palette.secondary.Turquoise} !important`,
      backgroundColor: `${new_theme.palette.secondary.Turquoise} !important`,
    }

  },

  scroll: {
    '&::-webkit-scrollbar': { width: 8 },
    overflowY: 'auto',
  },
  displayContentParent: {
    "& .sv-body__page": {
      margin: 0
    },
    "& .sv-root-modern .sv-container-modern__title": {
      display: 'none',
    },
    "& .sv-container-modern__title h3": {
      color: 'red',
    },
    "& .sv-root-modern .sv-boolean__switch": {
      backgroundColor: new_theme.palette.newSupplementary.NSupText,
    },
    "& .svd-svg-icon": {
      fill: `${new_theme.palette.newSupplementary.NSupText} !important`,
    },
    "& .svd_container .svd-main-color": {
      color: `${new_theme.palette.newSupplementary.NSupText} !important`,
    },
    "& .sjs-sortablejs-item": {// color of sortable items
      backgroundColor: `${new_theme.palette.newSupplementary.NSupText} !important`,
    },
    "& .noUi-connect": {// Color of the slider
      backgroundColor: `${new_theme.palette.newSupplementary.NSupText} !important`,
    },
    "& .sv-root-modern .sv-checkbox--checked .sv-checkbox__svg": {// Color of the chekbox
      backgroundColor: `${new_theme.palette.newSupplementary.NSupText} !important`,
    },
    "& .sv-root-modern .sv-checkbox--allowhover:hover .sv-checkbox__svg": {// Color of the chekbox
      backgroundColor: `${new_theme.palette.neutrals.darkGrey} !important`,
    },
    "& .sv-root-modern .sv-radio--checked .sv-radio__svg": {
      borderColor: `${new_theme.palette.newSupplementary.NSupText} !important`,
      fill: `${new_theme.palette.newSupplementary.NSupText} !important`,
    },
    "& .sv-header__text": {
      color: `${new_theme.palette.newSupplementary.NSupText} !important`
    },
    "& .select-file button": {
      fontFamily: 'Nunito',
      borderRadius: '10px',
      padding: `4px 24px !important`,
      backgroundColor: 'white',
      color: new_theme.palette.neutrals.lightpink,
      boxShadow: `0px 3px 1px -2px ${new_theme.palette.shades.black20}, 0px 2px 2px 0px ${new_theme.palette.shades.black20}, 0px 1px 5px 0px ${new_theme.palette.shades.black20}`,
      border: 'none'
    },
    '& input.sv-text': {
      boxShadow: `0px 0px 4px 0px ${new_theme.palette.shades.black20}`,
      borderRadius: '8px'
    },
    '& blank': {
      textAlign: 'center',
      caretColor: 'black !important',
      verticalAlign: 'middle',
      minWidth: '70px !important',
      height: '20px',
      lineHeight: '20px',
    },
    '& blank:focus': {
      backgroundColor: new_theme.palette.secondary.ui
    },
    '& .blanks .sv-question__content': {
      display: 'none !important'
    },
    '& .sv-completedpage': {
      backgroundColor: 'transparent !important',
      marginRight: '0px !important',
      marginLeft: '0px !important',
    },
    '& .sv-title': {
      fontFamily: 'unset',
      fontWeight: 'unset',
      fontStyle: 'unset',
      fontStretch: 'unset',
      lineHeight: 'unset',
      letterSpacing: 'unset'
    },

  },
  languageSelect: {
    paddingLeft: '30px',
    borderRadius: '8px !important',
    height: '40px',
    width: '200px',
    '& .MuiOutlinedInput-notchedOutline legend': {
      display: 'none'
    }
  },
  languageDiv: {
    position: 'relative',
    marginTop: "16px",
    marginBottom: "16px"
  },
  languageIcon: {
    position: 'absolute',
    left: '8px',
    top: 'calc(50% - 1px)',
    transform: 'translateY(-50%)'
  }
}))

function useIsWidthUp(breakpoint) {
  return useMediaQuery(new_theme.breakpoints.up(breakpoint));
}


function doMarkdown(survey, options) {
  //Create showdown markdown converter
  var converter = new showdown.Converter();
  //convert the markdown text to html
  let str = converter.makeHtml(options.text);
  //div.remove()
  if (str.indexOf("<p>") == 0) {
    //remove root paragraphs<p></p>
    str = str.substring(3);
    str = str.substring(0, str.length - 4);
  }
  //set html
  options.html = str;
  if (window.MathJax)
    window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub])
}

const DisplayContent = (props) => {
  const classes = useStyles();
  let { contentId, eventId } = useParams();
  const { t, i18n } = useTranslation(['translation', 'braincoreTest']);
  const [content, setContent] = useState();
  const [updatedContent, setUpdatedContent] = useState();
  const [event, setEvent] = useState();
  const [contentModel, setContentModel] = useState();
  const [showResultsButton, setShowResultsButton] = useState(false);
  const [resultId, setResultId] = useState(null);
  const [isEmpty, setIsEmpty] = useState(false)
  // First page with questions/elements
  const [isFirstPage, setIsFirstPage] = useState(false);
  // Last page is the last page with questions/elements
  const [isLastPage, setIsLastPage] = useState(false);
  // Confirmation page is used to finish the test
  const [isConfirmationPage, setIsConfirmationPage] = useState(false);
  // Completed page is used to display StartAgain button or Go To Results
  const [isCompletedPage, setIsCompletedPage] = useState(false);
  const [completedPageMessage, setCompletedPageMessage] = useState();
  // Use for restarting state, in case somone takes the content again 
  const [resetCounter, setResetCounter] = useState(0);
  // Number of non-empty pages in content
  const [pagesCount, setPagesCount] = useState(0)
  // Current page number
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  // Error to display when clicking on start button
  const [errorMessage, setErrorMessage] = useState();


  const [topBarHeight, setTopBarHeight] = useState(0);
  const [bottomBarHeight, setBottomBarHeight] = useState(0);

  // Email of the user who took BrainCore test and are not logged-in
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState('');
  const [showStatus, setShowStatus] = useState('To do');

  const urlParams = new URLSearchParams(window.location.search);

  const navigate = useNavigate();
  const location = useLocation();
  const titleRef = useRef();
  const contentModelRef = useRef();
  const contentContainerRef = useRef();
  const topBarHeightRef = useRef();
  const bottomBarHeightRef = useRef();
  const autosaveFucnctionRef = useRef();
  const autosaveIntervalRef = useRef();
  const stopTrackRef = useRef(() => { });

  const timeRef = useRef(0);
  const awayTimeRef = useRef(0);
  const inactiveTimeRef = useRef(0);
  const awayCountRef = useRef(0);
  const inactiveCountRef = useRef(0);

  const teamIdRef = useRef()
  // In individual invitation links - email is included
  const emailFromUrlParams = urlParams.get('email')
  const emailRef = useRef(emailFromUrlParams??'')
  const agreedForMarketingRef = useRef(false)
  const resultToSave = useRef()

  const isSmUp = useIsWidthUp("sm");

  contentModelRef.current = contentModel;

  const { F_getHelper, F_getLocalTime, F_showToastMessage, setMyCurrentRoute, F_getErrorMessage, F_handleSetShowLoader, activeNavigationTab, setActiveNavigationTab, setNavigationTabs } = useMainContext();

  const { userPermissions } = F_getHelper();

  const isTmID = location.search.includes('tmId');
  // Page before starting content
  var isBC = ContentService.isBraincoreTest(content?._id)
  const [isStartingPage, setIsStartingPage] = useState(() => isBC ? true : false)
  var user = AuthService.getCurrentUser()

  // Handle language switch for BrainCore tests
  const [testId, setTestId] = useState(contentId);
  const isPedagogyTest = ContentService.isBraincorePedagogyTest(content?._id);


  // Type of the BrainCore test
  const type = urlParams.get('type')

  // Congitive block ID
  const [block, setBlock] = useState();
  const blockId = urlParams.get('blockId')


  // If `removeIsRequired` is set to true during preview mode
  // the `isRequired` property will be removed from all elements
  const removeIsRequired = urlParams.get('removeIsRequired')
  const [updateStatus, setUpdateStatus] = React.useState(false);

  // Handle language switch for BrainCore tests  for unlogged users (actually /braincore/test/)
  let userLanguage = '';
  if (user) userLanguage = user.language;
  else {
    userLanguage = i18next.language?.slice(0, 2);
    if (!['en', 'fr', 'pl'].includes(userLanguage)) userLanguage = 'en';//'pl'
  }

  var languageOptions = [{ value: 'en', label: 'English' }, { value: 'fr', label: "Francais" }, { value: 'pl', label: 'Polski' }]

  const defaultLanguage = urlParams.get('lang') || userLanguage; //if lang parameter is not present in the URL load it from the browser
  if (!user && i18n.language != defaultLanguage) i18n.changeLanguage(defaultLanguage)

  // Extract details from brainCore test invitation generated in Sentinel for single user
  const inviter = urlParams.get('inviter');
  const invitationToken = urlParams.get('invitationToken');
  const moduleId = urlParams.get('moduleId');

  // Team id is provided when link is generated in Sentinel for specific team
  const teamId = urlParams.get('teamId');
  teamIdRef.current = teamId

  useEffect(() => {
    if (props.content) {
      setIsStartingPage(true);
      if (Object.keys(props.content).length) {
        setContent(props.content)
      } else {
        F_showToastMessage(t("Could not load the content."), "error")
      }
    }
  }, [props.content])

  // 2. Content loaded based on contentID parameter from URL
  useEffect(() => {
    if (!props.content && !content && contentId) loadContent(contentId)
  }, [contentId]);


  // 3. Content loaded based on contentID parameter from props
  useEffect(() => {
    if (props.contentId) {
      setIsStartingPage(true);
      loadContent(props.contentId)
    }
  }, [props.contentId]);

    // 4. Event passed directly as on of the properties
  // Must be loaded by EventService.display(eventId)
  useEffect(() => {
    if (props.event) {
      setIsStartingPage(true);
      if (Object.keys(props.event).length) {
        setEvent(props.event)
        setContent(props.event.assignedContent)
      } else {
        F_showToastMessage(t("Could not load the event."), "error")
      }
    }
  }, [props.event])
  // 5. Event loaded based on eventId parameter from URL
  useEffect(() => {
    if (!event && eventId) loadEvent(eventId)
  }, [eventId]);

  // 6. Event loaded based on eventId parameter from props
  useEffect(() => {
    if (props.eventId) {
      setIsStartingPage(true);
      loadEvent(props.eventId)
    }
  }, [props.eventId]);

  useEffect(() => {
    // goNextPageAutomatic is disabled only for mobile 
    if (isSmUp && isBC) setContent({ ...content, goNextPageAutomatic: true })
  }, [isSmUp, isBC, content?._id]);

  useEffect(() => {
    if (blockId) loadBlock(blockId)
  }, [blockId]);

  useEffect(() => {
    if (contentId || eventId) {// Only when accesed by URL
      if (props.isPreview) setMyCurrentRoute("Preview")
      else setMyCurrentRoute("Display")
    }
  }, [contentId, eventId]);


  // Set tobBarHeight
  useEffect(() => {
    if (topBarHeightRef.current) setTopBarHeight(topBarHeightRef.current.clientHeight)
  }, [contentModel, topBarHeightRef?.current?.clientHeight])

   // Set bottomBarHeight
   useEffect(() => {
    if (bottomBarHeightRef.current) setBottomBarHeight(bottomBarHeightRef.current.clientHeight)
  }, [contentModel, bottomBarHeightRef?.current?.clientHeight])

  // Manage displaying additional settings tab, usefull for preview
  // When `props.showSettingsTab` is not set, the tabs will not be displayed
  useEffect(() => {
    if (props.showSettingsTab) {
      setNavigationTabs([
        { name: t("Content Preview") },
        { name: t("Content Details") }
      ])
    } else {
      setNavigationTabs([]);
      setActiveNavigationTab(0);
    }

    return function cleanup() {
      setNavigationTabs([]);
      setActiveNavigationTab(0);
    };
  }, [props.showSettingsTab]);

  // Start main timer in contentModel 
  useEffect(() => {
    if (contentModel && !isStartingPage && !errorMessage) {
      F_handleSetShowLoader(true)
      contentModel.startTimer()
      setTimeout(() => F_handleSetShowLoader(false), 500)
    }
  }, [isStartingPage, contentModel])

  // Tracking time - spent, inactive and out of focus
  // Those values are saved inside local variables
  useEffect(() => {
    if (!isStartingPage && !isEmpty) {
      // Scroll for the first page
      // Scrolling in onAfterRenderPage does not work
      if (titleRef.current) titleRef.current.scrollIntoView(false)
      if (contentContainerRef.current) contentContainerRef.current.scroll(0, 0)

      // When closing starting page and loading first page
      if (contentModelRef?.current?.isFirstPage) setIsFirstPage(true)

      // LogService.trackUser returns stopTrack function
      stopTrackRef.current = LogService.trackUser(
        function (time, awayTime, inactiveTime, awayCount, inactiveCount) {
          timeRef.current += time
          // Override timer from surveyJS
          if (contentModelRef.current) contentModelRef.current.timeSpent = parseInt(timeRef.current)

          awayTimeRef.current += awayTime
          inactiveTimeRef.current += inactiveTime
          awayCountRef.current += awayCount
          inactiveCountRef.current += inactiveCount
        }
        , 10, // interval
        false // logging
      );


      return () => {
        stopTrackRef.current()
      }
    }
  }, [isStartingPage, isEmpty])

  // Autosave all the answers and time details in localStorage
  useEffect(() => {
    if (content && !isStartingPage && !isEmpty) {
      var interval = 5;
      function autosave() {
        let currentPageNo = contentModelRef?.current?.currentPageNo;
        let state = {
          time: contentModelRef.current.timeSpent,
          awayTime: awayTimeRef.current, inactiveTime: inactiveTimeRef.current,
          awayCount: awayCountRef.current, inactiveCount: inactiveCountRef.current,
          currentPageNo: currentPageNo,
          data: contentModelRef?.current?.data
        }

        console.log('Autosaving state...')
        window.localStorage.setItem(content._id, JSON.stringify(state));
      }
      autosaveFucnctionRef.current = autosave;
      autosaveIntervalRef.current = setInterval(autosave, interval * 1000);
    }
    // Clear the interval when this hook/component unmounts so it doesn't keep
    return () => {
      clearInterval(autosaveIntervalRef.current);
    }
  }, [content, isStartingPage, isEmpty])


  useEffect(() => {
    if (content) {
      F_handleSetShowLoader(true)

      // Color customization
      var mainColor = new_theme.palette.primary.PWhite;
      var mainHoverColor = new_theme.palette.neutrals.blue;
      var textColor = new_theme.palette.neutrals.darkestGrey;
      var headerColor = new_theme.palette.neutrals.darkestGrey;
      var headerBackgroundColor = new_theme.palette.primary.PWhite;
      var bodyBackgroundColor = new_theme.palette.primary.PWhite;
      var bodyContainerBackgroundColor = new_theme.palette.neutrals.white;

      var defaultThemeColorsSurvey = Survey
        .StylesManager
        .ThemeColors["modern"];
      defaultThemeColorsSurvey["$main-color"] = mainColor;
      defaultThemeColorsSurvey["$main-hover-color"] = mainHoverColor;
      defaultThemeColorsSurvey["$text-color"] = textColor;
      defaultThemeColorsSurvey["$header-color"] = headerColor;
      defaultThemeColorsSurvey["$header-background-color"] = headerBackgroundColor;
      defaultThemeColorsSurvey["$body-container-background-color"] = bodyContainerBackgroundColor;
      defaultThemeColorsSurvey["$body-background-color"] = bodyBackgroundColor;

      Survey
        .StylesManager
        .applyTheme("modern");

      Survey.Serializer.addProperty("question", { name: "items:texitems", default: [] });
      Survey.Serializer.addProperty("question", { name: "file:string", default: "" });
      Survey.Serializer.addProperty("question", { name: "subtype:string", default: "" });
      Survey.Serializer.addProperty("question", { name: "test:string", default: "" });
      Survey.Serializer.addProperty("question", { name: "testId:string", default: "" });
      Survey.Serializer.addProperty("question", { name: "locked:boolean", default: false });
      Survey.Serializer.addProperty("question", { name: "pointsForCorrectAnswer:number", default: 1 });
      Survey.Serializer.addProperty("text", { name: "caseSensitive:boolean", default: false });
      Survey.Serializer.addProperty("comment", { name: "caseSensitive:boolean", default: false });
      Survey.Serializer.addProperty("text", { name: "diacriticSensitive:boolean", default: false });
      Survey.Serializer.addProperty("comment", { name: "diacriticSensitive:boolean", default: false });
      Survey.Serializer.addProperty("survey", { name: "gradingScale:string", default: null });
      Survey.Serializer.addProperty("survey", { name: "revealAnswers:boolean", default: false });

      function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      }
      function createBlanksWidget(survey, parent, question) {

        function getCaretCharacterOffsetWithin(element) {
          // Get caret (cursor) position in contentEditable area containing HTML content
          //https://stackoverflow.com/questions/4767848/get-caret-cursor-position-in-contenteditable-area-containing-html-content
          var caretOffset = 0;
          var doc = element.ownerDocument || element.document;
          var win = doc.defaultView || doc.parentWindow;
          var sel;
          if (typeof win.getSelection != "undefined") {
            sel = win.getSelection();
            if (sel.rangeCount > 0) {
              var range = win.getSelection().getRangeAt(0);
              var preCaretRange = range.cloneRange();
              preCaretRange.selectNodeContents(element);
              preCaretRange.setEnd(range.endContainer, range.endOffset);
              caretOffset = preCaretRange.toString().length;
            }
          } else if ((sel = doc.selection) && sel.type != "Control") {
            var textRange = sel.createRange();
            var preCaretTextRange = doc.body.createTextRange();
            preCaretTextRange.moveToElementText(element);
            preCaretTextRange.setEndPoint("EndToEnd", textRange);
            caretOffset = preCaretTextRange.text.length;
          }
          return caretOffset;
        }

        function loadAnswers(parent, question) {
          // Load answers from survey data into the view
          $(parent).find("blank").each(function (index) {
            var blank = this
            if (survey.data && Object.keys(survey.data).length !== 0) {
              var id = $(blank).attr('id');
              var blankItem = question.items.find(obj => { return obj.name === id })
              var blankItemIndex = question.items.indexOf(blankItem)
              let data = survey.data
              if (question.name in data) {
                var answers = data[question.name]
                if (blankItemIndex in answers) {
                  let answer = answers[blankItemIndex]
                  blank.innerHTML = answer.title
                }
              }
            }
            $(blank).attr('contenteditable', 'true');
          })

          // assignEventListeners after the blanks were loaded 
          assignEventListeners(parent, question)
        }


        function saveAnswers(parent, question) {
          // Save answers from the view into survey data
          $(parent).find("blank").each(function (index) {
            var blank = this
            var id = $(blank).attr('id');
            var answer = $(blank).text();
            var blankItem = question.items.find(obj => { return obj.name === id })
            var blankItemIndex = question.items.indexOf(blankItem)
            //question.items[index]['title'] = answer
            let data = survey.getValue(question.name)
            if (!data) data = [];
            data[blankItemIndex] = { "name": id, "title": answer }
            survey.setValue(question.name, data)
          })
          loadAnswers(parent, question)
        }

        function assignEventListeners(parent, question) {
          // Handle editing blanks
          $(parent).find("blank").unbind()
          $(parent).find("blank").on("input", function () {
            // After changing the value I manually save result inside survey.data
            // After saving blanks elements are beeing removed(SurveyJS does that)
            // So after the saving, I find the proper element once more and set the cursor at the right position
            let blankId = $(this).attr('id')
            var el = $(parent).find("#" + blankId)[0]
            // Save the caret position
            var caretPosition = getCaretCharacterOffsetWithin(el)
            // Save answers
            saveAnswers(parent, question)
            // Restore the caret
            el = $(parent).find("#" + blankId)[0]
            if (el.innerHTML.length) { // if there is some text
              var range = document.createRange()
              var sel = window.getSelection()
              range.setStart(el.childNodes[0], caretPosition)
              range.collapse(true)
              sel.removeAllRanges()
              sel.addRange(range)
            } else el.focus();// just focus
          })

          // Handle enter key pressed
          parent.querySelectorAll("blank").forEach(function (blank) {
            // Override ENTER with TAB button
            $(blank).on('keydown', function (e) {
              if (e.code === "Enter") {
                e.preventDefault();
                $(blank).next().focus();
              }
            })
          });
        }

        // Load the answers
        loadAnswers(parent, question);
      }

      function createDictationWidget(survey, question, value) {
        var parent = $(`#${question.id} .sv-question__header`)
        let component = <>
          <audio controls>
            <source src={`${baseURL}contents/files/download/${question.file}`} />
            <p><a href={`${baseURL}contents/files/download/${question.file}`}>{t("Download the audio file")}</a></p>
          </audio>
        </>

        // Create new root element for inserting React components
        var componentRoot = document.createElement("div");
        componentRoot.style.width = "100%"
        // Append it to parent of SurveyJS question element
        parent.append(componentRoot)
        // Requires to provide `theme` once more and render component
        ReactDOM.render(<BrowserRouter><ThemeProvider theme={new_theme}><ToastProvider placement="bottom-right"><MainProvider>{component}</MainProvider></ToastProvider></ThemeProvider></BrowserRouter>, componentRoot);


      }

      function createAttachmentWidget(survey, question, value) {
        //let data = contentModelRef?.current?.data;
        var parent = $(`#${question.id} .sv-question__content`)
        var CustomIcon = (<SvgIcon viewBox="0 0 32 32" component={FileUploadIcon} />)
        let component = <FileUpload name={t("Uploaded file")} CustomIcon={CustomIcon}
          isPreview={props.isPreview}
          value={value}
          setValue={(file) => {
            survey.setValue(question.name, file?._id)
            //survey.setValue(question.name, file._id)
          }}
          removeFunction={ResultService.removeFile}
          uploadFunction={ResultService.uploadFile}
          getFileDetailsFunction={ResultService.getFileDetails}
        />



        // Create new root element for inserting React components
        var componentRoot = document.createElement("div");
        componentRoot.style.width = "100%"
        // Append it to parent of SurveyJS question element
        parent.empty()
        parent.append(componentRoot)
        // Requires to provide `theme` once more and render component
        ReactDOM.render(<BrowserRouter><ThemeProvider theme={new_theme}><ToastProvider placement="bottom-right"><MainProvider>{component}</MainProvider></ToastProvider></ThemeProvider></BrowserRouter>, componentRoot);

      }


      // Remove correct answers for blanks from content
      var localContent = JSON.parse(JSON.stringify(content));//CLONE
      localContent = { ...localContent, showNavigationButtons: false, showProgressBar: "off", showQuestionNumbers: "on" }
      if (localContent.pages) {
        if (localContent.questionsOrder === 'random') {
          localContent.pages = shuffleArray(localContent.pages)
        }
        localContent.pages.forEach(page => {
          if (page.elements) {
            if (localContent.questionsOrder === 'random') {
              page.elements = shuffleArray(page.elements)
            }
            page.elements.forEach(element => {
              // Do not require answers in preview mode
              // This will allow managers to preview blocks faster when creating Projects in Sentinel
              if (props.isPreview && removeIsRequired) element.isRequired = false
              if (element.type == 'boolean'){ 
                element.labelTrue= t('True')
                element.labelFalse= t('False')
              }
              if (element.subtype == 'blanks') {
                let titleObj = $(`<div>${element.title}</div>`)
                titleObj.find('blank').text('')
                element.title = titleObj.prop('outerHTML');
              }
              // Random order of answers 
              if (localContent.questionsOrder === 'random' && ['checkbox', 'radiogroup', 'sortablelist'].includes(element.type)) {
                element.choicesOrder = "random";
              }
            })
          }
        })
      }

      const lockElement = (content, elementName) => {
        F_handleSetShowLoader(true)

        ContentService.lockElement(content._id, elementName).then(
          (response) => {
            loadContent(content._id)
            F_showToastMessage(t("Element locked"), 'success')
          },
          (error) => {
            let errorMessage = F_getErrorMessage(error)
            F_showToastMessage(errorMessage, 'error')
          }
        )
      }

      const unlockElement = (content, elementName) => {
        F_handleSetShowLoader(true)
        ContentService.unlockElement(content._id, elementName).then(
          (response) => {
            loadContent(content._id)
            F_showToastMessage(t("Element unlocked"), 'success')
          },
          (error) => {
            let errorMessage = F_getErrorMessage(error)
            F_showToastMessage(errorMessage, 'error')
          }
        )
      }


      let newContentModel = new Survey.Model(localContent)
      newContentModel.onTextMarkdown.add(doMarkdown);

      // Load autosaved data
      if (props.isPreview) window.localStorage.removeItem(content._id)// Remove autosave
      let autosave = window.localStorage.getItem(content._id);
      if (autosave) {
        autosave = JSON.parse(autosave);
        newContentModel.data = autosave.data;
        if (autosave.currentPageNo && newContentModel.questionsOrder != 'random')// Jump to provided page number
          newContentModel.currentPage = newContentModel.pages[autosave.currentPageNo];

        timeRef.current = autosave.time;
        newContentModel.timeSpent = parseInt(autosave.time) // Set directly in model

        awayTimeRef.current = autosave.awayTime;
        inactiveTimeRef.current = autosave.inactiveTime
        awayCountRef.current = autosave.awayCount;
        inactiveCountRef.current = autosave.inactiveCount

        setIsLastPage(newContentModel.isLastPage)

      }


      newContentModel
        .onValueChanged
        .add(function (survey, options) {
          if (options.question.subtype === 'attachment') {
            createAttachmentWidget(survey, options.question, options.value)
          }
          autosaveFucnctionRef.current()

        })
      newContentModel
        .onAfterRenderPage
        .add(async function (survey, options) {
          // Not working for the first page as contentContainerRef is not defined
          if (contentContainerRef.current) contentContainerRef.current.scroll(0, 0)
        })

      newContentModel
        .onAfterRenderQuestion
        .add(async function (survey, options) {


          if (userPermissions.isTrainee && !event && !content.canEdit && !content.canExamine && !props.isContentFactory && options.question?.locked) {
            options.htmlElement.parentElement.style.display = 'none'
          }
          if (options.question.subtype) {
            options.htmlElement.parentElement.classList.add(options.question.subtype);
          }

          if (options.question.subtype === 'blanks') {
            createBlanksWidget(survey, options.htmlElement, options.question)
          }

          if (options.question.subtype === 'attachment') {
            createAttachmentWidget(survey, options.question, survey.getValue(options.question.name))
          }
          else if (options.question.subtype === 'dictation') {
            createDictationWidget(survey, options.question, survey.getValue(options.question.name))
          }




          var question = options.question;
          // Create new root elements for inserting React components
          var aboveQuestionElementRoot = document.createElement("div");
          aboveQuestionElementRoot.style.width = "100%"



          // Append it to parent of SurveyJS question element
          options.htmlElement.querySelector(".sv-question__header").prepend(aboveQuestionElementRoot)
          // Remove SurveyJS question number element
          options.htmlElement.querySelector(".sv-question__num").style.display = 'none'


          // Above question
          var aboveQuestionElement=<></>
          if (ContentService.canBeAnswered(question)){
            var name = t("Question")
            let number = ContentService.getQuestionNumber(content, question)
            if (newContentModel.questionsOrder != 'random') name += " " + number?.toString()
            aboveQuestionElement = <>
            <Grid container className="display_content_1">
              <Grid item xs={8}>
                <Typography variant="body3" component="span" sx={{ color: new_theme.palette.newSupplementary.NSupTextL, borderBottom: `1px solid ${new_theme.palette.primary.PBorder}`, mb: 3, display: 'inline-block' }}>{name}</Typography>
              </Grid>
              {/* <Grid xs={4} item>
                {!props.isContentFactory && content.canExamine && <ESwitchWithTooltip name={t("Show to students")} fontSize="16px" checked={!question.locked} onChange={() => { question.locked ? unlockElement(content, question.name) : lockElement(content, question.name) }} />}
              </Grid> */}
            </Grid>
            <Typography variant="list1" component="h6" sx={{color:new_theme.palette.neutrals.darkGrey, mb:2}}>
              {t("Instructions")}
            </Typography>
            
            {/* <hr style={{ marginTop: '5px', marginBottom: '20px', backgroundColor: "#fff" }} /> */}
            </>
          }
          if (!isBC) {
            // Requires to provide `theme` once more and render component
            ReactDOM.render(<BrowserRouter><ThemeProvider theme={new_theme}><ToastProvider placement="bottom-right"><MainProvider>{aboveQuestionElement}</MainProvider></ToastProvider></ThemeProvider></BrowserRouter>, aboveQuestionElementRoot);
          }
          // Question is a file
          var fileParent = $(options.htmlElement.querySelector(".select-file"));
          if (fileParent.length) {
            var questionElement = options.htmlElement.querySelector("h5")

            let fileElement = await ContentService.getOpenFileWidget(options.question, t)

            var fileElementRoot = document.createElement("div");
            fileElementRoot.style.width = "100%"
            // Append it to parent of SurveyJS question element
            questionElement.prepend(fileElementRoot)
            ReactDOM.render(<BrowserRouter><ThemeProvider theme={new_theme}><ToastProvider placement="bottom-right"><MainProvider>{fileElement}</MainProvider></ToastProvider></ThemeProvider></BrowserRouter>, fileElementRoot);
          }



        });




      newContentModel.onComplete.add(async (survey, options) => {
        clearInterval(autosaveIntervalRef.current);// Stop autosave interval
        stopTrackRef.current()// Stop tracking
        let result = {
          timeSpent: timeRef.current, awayTime: awayTimeRef.current, inactiveTime: inactiveTimeRef.current,
          awayCount: awayCountRef.current, inactiveCount: inactiveCountRef.current,
          content: content._id,
          event: eventId,
          data: survey.data
        }

        if (content.contentType == "TEST") {
          let gradingScale = event ? event.gradingScale : content.gradingScale
          var points = ContentService.getScoredPointsForTest(survey) // Points recived in the test
          var totalPoints = ContentService.getTotalPointsForContent(content) // Max points for the test
          let percentage = ContentService.getPercentageOfScoredPoints(survey) // Percentage of scored points
          let grade = ContentService.getGradeForTest(survey, gradingScale) // Grade from the test
          result = { ...result, points: points, totalPoints: totalPoints, grade: grade, percentage: percentage }
        }
        // Restert time tracking variables
        timeRef.current = 0;
        awayTimeRef.current = 0;
        inactiveTimeRef.current = 0;
        awayCountRef.current = 0;
        inactiveCountRef.current = 0;

        // If results already exist - use it
        if (!resultToSave.current) resultToSave.current = result
        else result = resultToSave.current

        if (!props.isPreview) {
          // If user is not logged in and he finished BrainCore test
          if (!user && isBC) {
            // Saving result
            ResultService.add({ 
              result: resultToSave.current, 
              agreedForMarketing: agreedForMarketingRef.current, 
              email: emailRef.current,
              teamId: teamIdRef.current,
              inviter: inviter,
              invitationToken: invitationToken,// For individual links
              moduleId: moduleId// For individual links
            
            }).then(
              (response) => {
                window.localStorage.removeItem(content._id)// Remove autosave
                navigate(`/braincore/test/done?type=${type}`)
              },
              (error) => {
                let errorMessage = F_getErrorMessage(error)
                F_showToastMessage(errorMessage, 'error')
              }
            )

          } else {

            if (block) {
              CognitiveSpace.changeStatus(blockId, { status: 'done' }).then((resp) => {
                F_showToastMessage(t("Status updated"), "success");
              });
            }

            ResultService.add({ result: result }).then(
              (response) => {
                let message = t("Saved successfully")
                F_showToastMessage(message, 'success')
                if (content.contentType == "TEST") {
                  setShowResultsButton(true)
                }
                setResultId(response.data.resultId)
                window.localStorage.removeItem(content._id)// Remove autosave
                setIsLastPage(false)
                setIsConfirmationPage(false)
                setIsCompletedPage(true)
              },
              (error) => {
                let errorMessage = F_getErrorMessage(error)
                F_showToastMessage(errorMessage, 'error')
              }
            )
          }


          survey.completedHtml = "<h4>" + t("Thank you for your time") + "</h4>"
        } else {
          if (content.contentType == "TEST")
            setCompletedPageMessage(t("You have scored") + " " + points + " " + t("out of") + " " + totalPoints + " " + t("points"))
          console.log('RESTERT')
          window.localStorage.removeItem(content._id)// Remove autosave
          setIsLastPage(false)
          setIsConfirmationPage(false)
          setIsCompletedPage(true)
        }

      });

      setShowResultsButton(false);
      setIsEmpty(!content?.pages?.some(p => p?.elements?.length))
      let notEmptyPages = content?.pages?.filter(p => p.elements?.length)
      if (content.questionsOnPageMode === "questionPerPage") {
        let elementsCount = 0;
        notEmptyPages.forEach(p => elementsCount += p.elements?.length)
        setPagesCount(elementsCount)
      }
      else setPagesCount(notEmptyPages?.length)

      //if (!errorMessage) F_removeAllToasts()//Important, otherwise custom question will be broken when toasts are hidden(disabled for errors)
      F_handleSetShowLoader(false); setContentModel(newContentModel);
      //else setTimeout(function () { F_handleSetShowLoader(false); newContentModel.startTimer(); setContentModel(newContentModel) }, 1000);
    }
  }, [props.show, content, resetCounter]);

  useEffect(() => {
    if (isBC) {
      setIsStartingPage(true)
    }
  }, [isBC])

  function doOnCurrentPageChanged(survey) {
    if (titleRef.current) titleRef.current.scrollIntoView(false)
    setIsFirstPage(survey.isFirstPage)
    setIsLastPage(survey.isLastPage)
    setCurrentPageNumber(survey.currentPageNo + 1)
    autosaveFucnctionRef.current()
  }

  

  const handleLanguageChangeForBrainCoreTest = (event) => {
    const lang = event.target.value;
    let url = `/braincore/test?lang=${lang}`;

    for(var key of urlParams.keys()) {
      if (key == 'lang') continue
      let value = urlParams.get(key);
      url += `&${key}=${value}`
    }
    if (!user) i18n.changeLanguage(lang)
    navigate(url, { replace: true })
  };

  // This will be called after answering last question in content with `goNextPageAutomatic`
  function doOnCompleteLastPage() {
    setIsConfirmationPage(true)
  }

  function displayResults(userId) {
    if (!userId) userId = user.id;
    let url = `/results/`

    // If finished Braincore test - redirect to cognitive space
    if (isBC) url = '/myspace'
    else if (event) url += `event/${event._id}/${userId}`
    else url += `${userId}/${content._id}`
    if (props.displayResultsInNewTab) window.open(url, '_blank').focus();
    else navigate(url)
  }

  function displayResultsNotBC(userId) {
    // if (!isBC && userPermissions.bcTrainer.access) {
    //   contentModelRef.current.doComplete();
    // }
    if (!userId) userId = user.id;
    let url = `/results/`

    // If finished Braincore test - redirect to cognitive space
    if (isBC) url = '/myspace'
    else if (event) url += `event/${event._id}/${userId}`
    else url += `${userId}/${content._id}`
    if (props.displayResultsInNewTab) window.open(url, '_blank').focus();
    else navigate(url)
  }

  // const isTmID = () => {
  //   return tmId ? true : false
  // }

  // Loading event object
  const loadEvent = (eventId) => {
    F_handleSetShowLoader(true)
    EventService.display(eventId).then(res => {
      setEvent(res.data)
      setContent(res.data.assignedContent)
      setUpdatedContent(res.data);
      setErrorMessage(undefined)
      F_handleSetShowLoader(false)
      setIsStartingPage(true)
      if(res?.data?.assignedContent?.status) setShowStatus(res?.data?.assignedContent?.status)
    }).catch(error => {// Could not event content for display
      F_handleSetShowLoader(false)
      let eventDisplayErrorMessage = F_getErrorMessage(error)

      console.log(eventDisplayErrorMessage)
      if (eventDisplayErrorMessage == "ALREADY_TAKEN") eventDisplayErrorMessage = t("You have already taken this event in the past. You are not allowed to do it again.")
      else if (eventDisplayErrorMessage == "ALREADY_FINISHED") eventDisplayErrorMessage = t("You are late. This event has already finished.")
      else if (eventDisplayErrorMessage == "NOT_FOUND") eventDisplayErrorMessage = t("This event was not found.")
      else if (eventDisplayErrorMessage == "NOT_YET_STARTED") eventDisplayErrorMessage = t("This event has not yet started.")
      else if (eventDisplayErrorMessage == "NOT_ALLOWED") eventDisplayErrorMessage = t("You are not allowed to join this event.")


      setErrorMessage(eventDisplayErrorMessage)
      F_showToastMessage(eventDisplayErrorMessage, 'error')

      // In case event was re-scheduled
      setIsStartingPage(true)

      // Try to load overview, just to display title,description etc.
      EventService.overview(eventId).then(res => {
        setEvent(res.data)
        setContent(res.data.assignedContent)
        setUpdatedContent(res.data.assignedContent);
        if(res?.data?.assignedContent?.status) setShowStatus(res?.data?.assignedContent?.status)
      }).catch(error => {
        let errorMessage = F_getErrorMessage(error)
        F_showToastMessage(errorMessage, 'error')
      })
    })

  }
  // Loading content object
  const loadContent = (contentId) => {
    F_handleSetShowLoader(true)
    ContentService.getContent(contentId).then((res) => {
      setContent(res.data)
      setUpdatedContent(res.data);
      if (errorMessage) {// If previously had error - start content after reloading
        setErrorMessage(undefined)
        //setIsStartingPage(false)
      }
      F_handleSetShowLoader(false)
    }).catch((error) => { // Could not load content for display
      F_handleSetShowLoader(false)

      let contentDisplayErrorMessage = F_getErrorMessage(error)
      setErrorMessage(contentDisplayErrorMessage)
      F_showToastMessage(contentDisplayErrorMessage, 'error')

      // Try to load overview, just to display title,description etc.
      ContentService.getContentOverview(contentId).then(res => {
        setContent(res.data)
        setUpdatedContent(res.data);
      }).catch(error => {
        console.error(error)
        let errorMessage = F_getErrorMessage(error)
        setContent(undefined)
        setContentModel(undefined)
        F_showToastMessage(errorMessage, 'error')
      })
    }
    )

  }

  const getDescription = (content) => {
    const getdes = content?.description ? content?.description : content?.assignedContent?.description
    if (getdes) {
      const arr = getdes.split('\n');
      const resultArr = [];
      arr.forEach((item, i) => {
        if (i > 0) resultArr.push(<br />);
        resultArr.push(item);
      });
      return (<p> {resultArr} </p>)
    }
    else if (props.isContentFactory) return t("Example of description")
    else return ''
  }

  const getTitleComponent = () => {
    return <Typography ref={titleRef} variant="body1" component="h1"
      sx={isBC ? { color: new_theme.palette.primary.MedPurple, fontSize: { xs: 30, lg: isBC ? 48 : 40 } } : { fontWeight: '700' }}>
      {!event?.name && !content?.title && t("Example of title")}
      {event ? event.name : content?.title}
      {/* {!isBC && <Divider className="heading_divider"></Divider>} */}
    </Typography>

  }

  const getStartButtonText = () => {
    // Check lang
    getStatus(content, "update")
    if (isBC) return t("braincoreTest:Take the test")
    else if (content?.results?.length) return t("Start again")
    else return t("Start")
  }

  // DATA IN THIS COMPONENT CAN BE LOADED BY ONE OF THE SIX FOLLOWING WAYS:
  // 1. Content passed directly as on of the properties
  // Must be loaded by ContentService.getContent(contentId)
  

  




  const changeBlockStatus = (blockId, data) => {
    F_handleSetShowLoader(true);
    if (data.status == 'done') {// When status set to `done`, make sure all the required questions are answers
      let allAnswered = ContentService.areAllRequiredQuestionsAnswered(contentModelRef.current)
      if (allAnswered) doOnCompleteLastPage()
      else F_showToastMessage(t("Please answer all the required questions"), "info");
      F_handleSetShowLoader(false)
    } else {
      CognitiveSpace.changeStatus(blockId, data).then((resp) => {
        F_showToastMessage(t("Status updated"), "success");
        loadBlock(blockId)
        F_handleSetShowLoader(false)
      });
    }

  }

  const loadBlock = (blockId) => {
    CognitiveSpace.getBlockDetails(blockId).then(
      (response) => {
        setBlock(response.data)
      },
      (error) => {
        let errorMessage = F_getErrorMessage(error)
        F_showToastMessage(t("Could not load block details"), 'error')
      }
    )
  }

  


  

 
  if (props.show === false || !contentModel) return (<></>)
  else if (props.showSettingsTab && activeNavigationTab === 1) {
    // Show preview of saving page
    let props = { contentJSON: content, isPreview: true, setContentJSON: () => { }, isMobileScreen: false, getNavigation: () => { }, setShow: () => { }, show: true }
    return <SaveContent {...props} />

  }


  const ShowFullScreen = () => {
    $('.sticky-top').addClass('isDisplayContent');
    setShowFullScreen("showFullScreen")
  }

  const HideFullScreen = () => {
    $('.sticky-top').removeClass('isDisplayContent');
    setShowFullScreen("");
  }

  const getStatus = (content, type) => {
    if (content?.assignedContent?.status && type == "update") {
      setShowStatus("In progress");
    }
  }

  const submitStatus = (content) => {
    // if (!isBC && userPermissions.bcTrainer.access) {
    //   contentModelRef.current.doComplete();
    // }
    let status = {
      status: "DONE"
    }
    contentModelRef.current.doComplete();
    CertificationSessionService.saveContentProgress(content._id, status).then(res => {
      F_showToastMessage(res?.data?.message, "success");
      navigate("/coaches");
    })
  }

  // Only for development 
  // Used to fill BrainCore Test with random answers
  const fillWithRandomAnswers = (range) => {
    if (ContentService.isBraincoreAdultTest(content._id))
      contentModelRef.current.data = randomAnswersForBrainCoreAdultTest(range);
    else if (ContentService.isBraincorePedagogyTest(content._id))
      contentModelRef.current.data = randomAnswersForBrainCorePedagogyTest(range);
    doOnCompleteLastPage()
  };

  const handleClose = () => {
    setUpdateStatus(false);
  };

  const statusConfirmation = () => {
    return (
      <Dialog
        open={updateStatus}
        // onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx:{
            padding: '24px', 
            textAlign: 'center'
          }
        }}
      >
        <Typography variant="body1" component="h3" sx={{mb: 3, fontWeight: 'bold'}}>{t("Great Work!")}</Typography>
        <Typography variant="body1" component="h3" sx={{mb: 3}}>{t("Do you want to change status to Done?")}</Typography>
        <Box sx={{mt: 4}}>
          <StyledButton eVariant="primary" eSize="medium" sx={{width: '100%', mb: 3}} onClick={() => submitStatus(content)}>{t("Yes")}</StyledButton>
          <StyledButton eVariant="secondary" eSize="medium" sx={{width: '100%'}} onClick={() => navigate("/coaches")}>{t("Skip")}</StyledButton>
        </Box>
      </Dialog>
    )
  }


  return (
    <ThemeProvider theme={new_theme}>
      <Box className={isBC ? "braincoreTest displayContent" : "displayContent"}>
        {!user && isBC && <Box sx={{ width: '100%', height: '80px', padding: { xs: '16px 0px 0px 16px', sm: '16px 0px 0px 24px' }, background: new_theme.palette.neutrals.white }}>
          <img style={{ height: '40px' }} src='/img/brand/BrainCore_Solutions_Logo.svg' />
        </Box>}


        <Container classes={{ root: classes.displayContentParent }} sx={{ py: user ? '0px' : '24px', width: '100%' }} maxWidth="xl">

          {/* MAIN */}
          <Grid container className="display_content_2" style={{ backgroundColor: "white", overflow: 'auto', alignContent: isBC ? 'center' : '' }}
            sx={{ padding: { xs: '16px', md: '40px', lg: '40px' }, borderRadius: "16px", height: `calc(100% - ${topBarHeight}px)`, background: new_theme.palette.glass.light }}
          >
            
            {(event != undefined || isTmID) &&
              <Grid item xs={12}>
                <div className="heading" style={{ marginBottom: '30px', display: 'flex', alignItems: 'center' }}>
                  {user && <StyledEIconButton color="primary" size="large" sx={{mr: 1}}>
                    <ChevronLeftIcon onClick={() => {
                      console.log("click", isBC);
                      props.backBtnFn ? props.backBtnFn() :
                        // isBC ? navigate(-1) : navigate('/my-courses', { state: { tabIndex: 2 } })
                        navigate(-1)
                    }} />
                  </StyledEIconButton>}
                  <Box sx={isBC ? {} : { display: 'flex', justifyContent: 'space-between', width: '100%', flexDirection:{xs:'column', md:'row'} }}>
                    {getTitleComponent()}
                    <Box sx={{ display: 'flex'}}>

                      {event && 
                      <Box sx={{ mr: 3 }}>
                        <Typography variant="body4" component="span">{t("Scheduled ")}: {dayjs(content?.date).format('DD/MM/YYYY')}</Typography>
                      </Box>}
                      <Box>
                        {event && <Typography variant="subtitle1" component="span" sx={{ mr: 1, backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '22px', padding: '6px 10px' }}>{updatedContent?.eventType}</Typography>}
                        {!event && <Typography variant="subtitle1" component="span" sx={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '22px', padding: '6px 10px' }}>{updatedContent?.contentType}</Typography>}
                        {/* <Typography variant="subtitle1" component="span" sx={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '22px', padding: '6px 10px' }}>{t("Quiz")}</Typography> */}
                      </Box>
                    </Box>
                  </Box>
                </div>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: !userPermissions.bcTrainer.access ? 'space-between' : 'center', backgroundColor: new_theme.palette.newSupplementary.SupCloudy, padding: '12px', mb: 2 }}>
                  {
                    !userPermissions.bcTrainer.access && <Typography variant="body4" component="span">{t("Status")} <span style={{ border: `1px solid ${new_theme.palette.newSupplementary.NSupText}`, width: '100px', borderRadius: '8px', padding: '4px 8px', display: 'inline-flex', justifyContent: 'space-between' }}>{showStatus}</span></Typography>
                  }
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="subtitle1" component="span" sx={{ mr: 3, cursor: 'pointer' }} onClick={ShowFullScreen}><CropFreeIcon sx={{ backgroundColor: new_theme.palette.primary.PWhite, height: '30px', width: '30px', borderRadius: '50%', padding: '5px', mr: 1 }} /> {t("Full screen")}</Typography>
                    {/* <Typography variant="subtitle1" component="span"><MoreVertIcon sx={{ backgroundColor: new_theme.palette.primary.PWhite, height: '30px', width: '30px', borderRadius: '50%', padding: '5px', mr: 1 }} /> {t("More")}</Typography> */}
                  </Box>
                </Box>
              </Grid>
            }

            <div style={{ minHeight: '600px', width: '100%', display: 'flex', flexDirection: 'column' }} className={`${event != undefined || isTmID ? showFullScreen + ' d_flex_displaycont' : ''}`}>
              <CloseIcon className="top_close_icon" sx={{ display: 'none', cursor: 'pointer' }} onClick={HideFullScreen} />
              {/* STARTING PAGE */}
              {isStartingPage &&
                <>
                  {isBC &&
                    <>
                      <Grid container>
                        <Grid item xs={12} order={{ xs: isBC ? 1 : '', sm: isBC ? 1 : '' }}>
                          <Grid container>
                            <Grid item xs={12}>
                              <div className="heading" style={{ marginBottom: '30px', display: 'flex', alignItems: 'baseline' }}>
                                {user && <div className='arrow_icon'>
                                  <ArrowBackIos onClick={() => {
                                    console.log("click", isBC);
                                    props.backBtnFn ? props.backBtnFn() :
                                      isBC ? navigate(-1) : navigate('/coaches', { state: { tabIndex: 2 } })
                                  }} />
                                </div>}
                                <div style={isBC ? {} : { display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                                  {getTitleComponent()}

                                  <div className={classes.languageDiv}>
                                    <LanguageIcon className={classes.languageIcon} />
                                    <Select sx={{ minWidth: '200px', width: { xs: '100%', sm: 'unset' } }} value={defaultLanguage} onChange={handleLanguageChangeForBrainCoreTest} className={classes.languageSelect}>
                                      {languageOptions.map(option => (
                                        <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                      ))}
                                    </Select>
                                  </div>
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ pr: { md: 3 }, textAlign: { md: 'right' }, mb: { xs: 0, md: 0 } }}>
                              <div className="top_bars">
                                {!props?.hideTopBar && <Box sx={{ width: '100%' }} ref={topBarHeightRef}><TopBar
                                  {...props} content={content} event={event}
                                  currentPageNumber={currentPageNumber}
                                  isStartingPage={isStartingPage}
                                  reloadContent={loadContent}
                                  reloadEvent={loadEvent}
                                  onBackButton={props.setShow ? () => { props.setShow(false) } : undefined}>
                                </TopBar></Box>}
                              </div>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item xs={12} md={6} sx={{ pr: { md: 3 } }} order={{ xs: 2, md: 1 }}>
                          <Typography variant="body3" sx={{ fontSize: { xs: '16px', lg: '16px' }, fontFamily: 'Nunito', }}>
                            {getDescription(content)}
                          </Typography>

                          <div className="mb-flex" style={{ marginTop: '30px' }}>
                            <StyledButton className={isBC ? classes.newButtonPrimary : undefined} eSize="small" eVariant="primary"
                              sx={isBC ? { mr: 2, width: { xs: '100%', sm: 'unset' } } : { mr: 2 }}

                              onClick={
                                () => {
                                  if(user && (event != undefined || isTmID)){
                                    if (!isEmpty){
                                      let status = {
                                        status: "ONGOING"
                                      }
                                      CertificationSessionService.saveContentProgress(content._id, status).then(res => {
                                        setShowStatus("ONGOING")
                                        F_showToastMessage(res?.data?.message, "success");
                                      }).catch(error => {
                                        let statusDisplayErrorMessage = F_getErrorMessage(error)
                                        F_showToastMessage(statusDisplayErrorMessage, 'error')
                                      })
                                    }
                                  }
                                  if (isEmpty) F_showToastMessage("This content is empty.", 'info')
                                  else if (errorMessage) {
                                    if (event) loadEvent(event._id)
                                    else if (content) loadContent(content._id)
                                  } else setIsStartingPage(false)
                                }}>
                              {getStartButtonText()}
                            </StyledButton>
                            {content.contentType == "TEST" && ((!event && content?.results?.length > 0) || (event && event?.results?.length > 0)) &&
                              <StyledButton className={isBC ? classes.newButtonSecondary : undefined} eSize="small" eVariant="secondary"
                                sx={{ width: { xs: '100%', sm: 'unset' } }}
                                onClick={
                                  () => { displayResults() }}>
                                {t("See my results")}
                              </StyledButton>
                            }
                          </div>
                        </Grid>
                        <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }} sx={{ mb: { xs: '16px', md: '0px' } }}>
                          <div className="bgImage">
                            <img src={`${testStart}`} style={{ width: '100%', maxWidth: 800 }} />
                          </div>
                        </Grid>
                      </Grid>
                    </>
                  }
                  {
                    !isBC &&
                    <>
                      <Grid item xs={12} sx={{ height: 'calc(100% - 117px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                          <Typography variant="h1" component="h1" sx={{ mb: 4, color: new_theme.palette.newSupplementary.NSupText }}>
                            {content?.title ? content?.title : content?.assignedContent?.title}
                          </Typography>
                          <Typography variant="body4" component="p" sx={{ mb: 3 }}>
                            {getDescription(content)}
                          </Typography>

                          <div>
                            <StyledButton className={isBC ? classes.newButtonPrimary : undefined} eSize="small" eVariant="primary"
                              sx={isBC ? { mr: 2, width: { xs: '100%', sm: 'unset' } } : { mr: 2 }}

                              onClick={
                                () => {
                                  if (user && (event != undefined || isTmID)) {
                                    if (!isEmpty) {
                                      let status = {
                                        status: "ONGOING"
                                      }
                                      CertificationSessionService.saveContentProgress(content._id, status).then(res => {
                                        setShowStatus("ONGOING")
                                        F_showToastMessage(res?.data?.message, "success");
                                      }).catch(error => {
                                        let statusDisplayErrorMessage = F_getErrorMessage(error)
                                        F_showToastMessage(statusDisplayErrorMessage, 'error')
                                      })
                                    }
                                  }
                                  if (isEmpty) F_showToastMessage("This content is empty.", 'info')
                                  else if (errorMessage) {
                                    if (event) loadEvent(event._id)
                                    else if (content) loadContent(content._id)
                                  } else setIsStartingPage(false)
                                }}>
                              {getStartButtonText()}
                            </StyledButton>
                            {/* {content.contentType == "TEST" && ((!event && content?.results?.length > 0) || (event && event?.results?.length > 0)) &&
                          <StyledButton className={isBC ? classes.newButtonSecondary : undefined} eSize="small" eVariant="secondary"
                            sx={{ width: { xs: '100%', sm: 'unset' } }}
                            onClick={
                              () => { displayResults() }}>
                            {t("See my results")}
                          </StyledButton>
                        } */}
                          </div>
                        </Box>
                      </Grid>
                    </>
                  }

                </>
              }


              {/* CONFIRMATION PAGE */}
              {/* {
                 userPermissions.bcCoach.access &&
                statusConfirmation()
              } */}
              {/* {!isStartingPage && isConfirmationPage && !userPermissions.bcCoach.access && */}
              {!isStartingPage && isConfirmationPage && !isCompletedPage &&
                <>
                  {
                    (updatedContent?.eventType != undefined || isTmID) && userPermissions.bcCoach.access ? <>
                      {statusConfirmation()}
                    </> : <>
                      <Grid container className="display_content_4" item xs={12} sx={{ height: isBC ? '100%' : 'calc(100% - 117px)', backgroundClip: 'content-box !important', background: new_theme.palette.neutrals.white, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', px: { xs: 0, md: 2 }, margin: 'auto' }}>
                        <Grid container style={{justifyContent: !user && isBC ? 'center' : 'inherit'}}>
                          {(user) &&
                            <>
                              <Grid item xs={12}>
                                <Grid container justifyContent='center' alignItems='center' flexDirection='column' sx={{ pt: 4, gap: '30px' }}>
                                  <Typography variant="h3" component="h3" sx={{ fontFamily: 'Nunito', color: new_theme.palette.neutrals.almostBlack, fontSize: '36px', fontWeight: 700, textAlign: "center" }}>
                                    {t("Almost there")}
                                  </Typography>

                                  <Grid item sx={{ display: 'flex', gap: '16px' }}>

                                    {!resultToSave.current && <Grid item>
                                      <StyledButton eSize="large" eVariant="secondary" onClick={
                                        () => setIsConfirmationPage(false)}>
                                        {t("Back")}
                                      </StyledButton>
                                    </Grid>}
                                    <StyledButton eSize="large" eVariant="primary" onClick={
                                      () => {
                                        contentModelRef.current.doComplete()
                                      }}>
                                      {t("Finish")}
                                    </StyledButton>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </>}
                          {/* For users who are not logged-in */}
                          {(!user && isBC) && <BrainCoreProvideEmailPage contentModelRef={contentModelRef} agreedForMarketingRef={agreedForMarketingRef} emailRef={emailRef} emailFromUrlParams={emailFromUrlParams} classes={classes}></BrainCoreProvideEmailPage>}
                        </Grid>
                      </Grid>
                    </>
                  }
                </>
              }
              {/* COMPLETED PAGE */}
              {isCompletedPage &&
                <>
                  {updatedContent?.eventType != undefined || isTmID ?
                    <>
                      <Grid container className="display_content_5" sx={{ height: '100%' }}>
                        <Grid item xs={12} sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography variant="h3" component="h3" sx={{ mb: 4, color: new_theme.palette.neutrals.almostBlack, fontSize: '36px', fontWeight: 700, textAlign: "center" }}>
                            {t("Thank you for your time!")}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {content.contentType != "PRESENTATION" &&  <StyledButton eSize="medium" eVariant="primary" sx={{ mr: 2 }} onClick={() => displayResultsNotBC()}>
                              {t("See my results")}
                            </StyledButton>} 
                            {/* <StyledButton eSize="medium" eVariant="secondary" sx={{ mr: 2 }} onClick={() => { */}
                            <StyledButton eSize="medium" eVariant="secondary" sx={{ mr: 2 }} onClick={() => submitStatus(content)}>
                              {t("Close")}
                            </StyledButton>
                          </Box>
                        </Grid>
                      </Grid>
                    </> :
                    <>
                      <Grid item xs={12} className="display_content_5" sx={{ px: { xs: 0, md: 2 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ marginBottom: '18px', textAlign: 'center' }}>
                          <img src="/img/brand/webtest2.png" style={{ height: '200px' }} />
                        </div>
                        <Typography variant="h1" component="h1" sx={{ textAlign: "center" }}>
                          {t("Thank you for your time!")}
                        </Typography>

                        {completedPageMessage && <>
                          <Typography variant="body3" component="p" sx={{ color: new_theme.palette.neutrals.darkestGrey, textAlign: "center" }}>
                            {completedPageMessage}
                          </Typography>
                        </>}

                        <Grid container justifyContent='center' sx={{ pt: 4 }}>
                          {showResultsButton &&
                            <Grid item>
                              <StyledButton eSize="medium" eVariant="primary" sx={{ mr: 2 }} onClick={() => displayResults()}>
                                {t("View details")}
                              </StyledButton>
                            </Grid>
                          }
                          {<Grid item>
                            <StyledButton eSize="medium" eVariant="secondary" sx={{ mr: 2 }} onClick={() => {
                              if (props.backBtnFn) {
                                props.backBtnFn()
                                return
                              }
                              if (props.setShow) props.setShow(false)
                              else if (location.key) isBC ? navigate(-1) : navigate('/myresources')
                              else window.close()
                            }}>
                              {t("Close")}
                            </StyledButton>
                          </Grid>}

                          {(props.isPreview || content.contentType == "PRESENTATION") &&
                            <Grid item><StyledButton eSize="medium" eVariant="primary"
                              onClick={() => { F_handleSetShowLoader(true); setIsStartingPage(true); setResetCounter(resetCounter + 1); setIsCompletedPage(false) }}>
                              {t("Take again")}
                            </StyledButton></Grid>
                          }
                        </Grid>
                      </Grid>
                    </>}
                </>
              }

              {/* CONTENT + BOTTOM BAR */}
              {!isBC && !isStartingPage && !isCompletedPage && !isConfirmationPage && 
                <>
                  {/* CONTENT */}
                  <Grid className={`display_content_6`} ref={contentContainerRef} item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>

                    {/* <div className="heading" style={{ marginBottom: isBC ? '0px' : '30px', display: 'flex', alignItems: 'baseline' }}>
                    {user &&
                      <div className='arrow_icon'>
                        <ArrowBackIos onClick={() => {
                          props.backBtnFn ? props.backBtnFn() :
                            isBC ? navigate(-1) : navigate('/myspace', { state: { tabIndex: 2 } })

                        }} />
                      </div>
                    }
                    <div>
                      {getTitleComponent()}
                    </div>

                  </div> */}
                    {block &&
                      <div className="displayFlex align-items-center mb-clm">
                        <div className="displayFlex align-items-center">
                          <Typography variant="subtitle3" component="h6" sx={{ fontWeight: '500' }}>{t("Status")}</Typography>
                          <FormControl className='status-dd' sx={{ m: 1, minWidth: 120, }} size="small">
                            <Select
                              id="demo-select-small"
                              value={block?.status ?? 'todo'}
                              onChange={(e) => {
                                changeBlockStatus(block?._id, {
                                  'status': e.target.value
                                })
                              }}
                            >
                              <MenuItem value={"todo"}>{t('TO DO')}</MenuItem>
                              <MenuItem value={"in_progress"}>{t('Progress')}</MenuItem>
                              <MenuItem value={"done"}>{t('Done')}</MenuItem>

                            </Select>
                          </FormControl>
                        </div>
                        <ListItem className="chip-without-close" dense={true}>
                          <ListItemText
                            primary={t("Deadline") + ": " + F_getLocalTime(block.deadline, true)}
                          />
                        </ListItem>

                      </div>
                    }
                    {/* {
                    !isBC && currentPageNumber == 1 &&
                    <>
                      <div className="heading_image">
                        <img src={`${baseURL}contents/images/${content.image}/download`} />
                      </div>
                    </>
                  } */}
                    <div className={"surveyElement other-test"}>
                      <Survey.Survey model={contentModel} completeLastPage={doOnCompleteLastPage} onCurrentPageChanged={doOnCurrentPageChanged}> </Survey.Survey>
                    </div>
                  </Grid>
                  {/* BOTTOM BAR */}
                  <Grid className="display_content_7" ref={bottomBarHeightRef} item xs={12} sx={{ display: 'flex', alignItems: 'flex-end', position: 'relative', zIndex: 1, backgroundClip: 'content-box !important', px: { xs: 0, md: 2 } }}>
                    <BottomBar content={content} contentModel={contentModel} isPreview={props.isPreview} pagesCount={pagesCount}
                      showResultsButton={showResultsButton} displayResults={() => displayResults()}
                      isEmpty={isEmpty} setIsStartingPage={setIsStartingPage}
                      classes={classes}
                      resetCounter={resetCounter} setResetCounter={setResetCounter}
                      isConfirmationPage={isConfirmationPage} setIsConfirmationPage={setIsConfirmationPage}
                      isCompletedPage={isCompletedPage} isFirstPage={isFirstPage} isLastPage={isLastPage} setUpdateStatus={setUpdateStatus}>
                    </BottomBar>
                  </Grid>

                </>
              }
              {isBC && !isStartingPage && !isConfirmationPage && !isCompletedPage &&
                <>
                  {/* CONTENT */}
                  <Grid className="display_content_6" ref={contentContainerRef} item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>

                    <div className="heading" style={{ marginBottom: isBC ? '0px' : '30px', display: 'flex', alignItems: 'baseline' }}>
                      {user &&
                        <div className='arrow_icon'>
                          <ArrowBackIos onClick={() => {
                            props.backBtnFn ? props.backBtnFn() :
                              isBC ? navigate(-1) : navigate('/myspace', { state: { tabIndex: 2 } })
                          }} />
                        </div>
                      }
                      <div>
                        {getTitleComponent()}
                        {ContentService.isBraincoreTest(content._id) && CommonService.isDevelopment() &&
                          <ETooltip title={<>
                              <>{"This button is only visible for development and can be useful for quick tests. When clicked - all the questions will be asigned with radndom answers"}</>
                              <br/><br/>{"You can also control the range of answers by selecting:"}<br/>
                              <button style={{margin: '5px'}} onClick={()=>{fillWithRandomAnswers('low')}}>{"Low values"}</button>
                              <button style={{margin: '5px'}}  onClick={()=>{fillWithRandomAnswers('medium')}}>{"Medium values"}</button>
                              <button style={{margin: '5px'}} onClick={()=>{fillWithRandomAnswers('high')}}>{"High values"}</button>
                              </>
                          }>
                            <StyledButton className={classes.newButtonSecondary} eSize="small" eVariant="secondary"
                              onClick={
                                () => {
                                  fillWithRandomAnswers('random')
                                }}>
                              {t("Fill all the answers")}
                            </StyledButton></ETooltip>}
                      </div>

                    </div>
                    {!isBC &&
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Typography variant="subtitle3" component="h6" sx={{ fontWeight: '500' }}>{t("Status")}</Typography>
                        <FormControl className='status-dd' sx={{ m: 1, minWidth: 120, }} size="small">
                          <Select
                            id="demo-select-small"
                            defaultValue={0}

                          >
                            <MenuItem sx={{ fontSize: '16px' }} value={0}>TO DO</MenuItem>
                            <MenuItem sx={{ fontSize: '16px' }} value={1}>Progress</MenuItem>
                            <MenuItem sx={{ fontSize: '16px' }} value={2}>Done</MenuItem>
                          </Select>
                        </FormControl>
                        <ListItem className="chip-without-close" dense={true}>
                          <ListItemText
                            primary="Deadline : 23.12.2024"
                          />

                        </ListItem>

                      </div>}
                    <div className={"surveyElement"}>
                      <Survey.Survey model={contentModel} completeLastPage={doOnCompleteLastPage} onCurrentPageChanged={doOnCurrentPageChanged}> </Survey.Survey>
                    </div>
                  </Grid>
                  {/* BOTTOM BAR */}
                  <Grid className="display_content_7" ref={bottomBarHeightRef} item xs={12} sx={{ display: 'flex', alignItems: 'flex-end', position: 'relative', zIndex: 1, backgroundClip: 'content-box !important', px: { xs: 0, md: 2 } }}>
                    <BottomBar content={content} contentModel={contentModel} isPreview={props.isPreview} pagesCount={pagesCount}
                      showResultsButton={showResultsButton} displayResults={() => displayResults()}
                      isEmpty={isEmpty} setIsStartingPage={setIsStartingPage}
                      classes={classes}
                      resetCounter={resetCounter} setResetCounter={setResetCounter}
                      isConfirmationPage={isConfirmationPage} setIsConfirmationPage={setIsConfirmationPage}
                      isCompletedPage={isCompletedPage} isFirstPage={isFirstPage} isLastPage={isLastPage}>
                    </BottomBar>
                  </Grid>

                </>
              }
            </div>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}



export default DisplayContent;
