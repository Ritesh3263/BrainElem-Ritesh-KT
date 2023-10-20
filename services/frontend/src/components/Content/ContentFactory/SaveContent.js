import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

//
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// Services
import ModuleService from "services/module.service";
import ModuleCoreService from "services/module-core.service";
import TrainingModuleService from "services/training-module.service"
import CommonService from "services/common.service";
import ContentService from "services/content.service";
import AlgorithmsService from "services/algorithms.service";

// Styled components
import Popup from "components/common/Popup"
import CommonImageUpload from "components/common/Image";
import CommonExpandBar from 'components/common/ExpandBar'
import CommonSelectWithDrawer from "components/common/SelectWithDrawer";
import CommonTimePicker from "components/common/TimePicker"


import { ECard, EAccordion } from "styled_components";
import { EButton } from "styled_components";
import EIconButton from "styled_components/EIconButton";
import ETextField from "styled_components/TextField";
import ESwitchWithTooltip from "styled_components/SwitchWithTooltip";

// MUI v5
import { styled } from '@mui/material/styles';
import SvgIcon from "@mui/material/SvgIcon";
import Typography from '@mui/material/Typography';
import ImageListItem from '@mui/material/ImageListItem';

import { Grid } from '@mui/material';
import Box from '@mui/material/Box';

// MUI v4
import { theme } from "MuiTheme";


// Icons
import { ReactComponent as BackIcon } from 'icons/icons_48/Arrow small L.svg';


//Redux
import { useDispatch, useSelector } from "react-redux";
import { remove, setActiveIndex } from "app/features/ContentFactory/data"


const StyledECard = styled(ECard)({
  padding: '24px', 
  background: theme.palette.glass.opaque 
}) 


// Component with settings for content
// setShow - function to show/hide this page
// contentJSON - content object
// setContentJSON - update content object
// isMobileScreen - used to show/hide header
// isPreview - is preview mode
const SaveContent = ({ show, setShow, contentJSON, setContentJSON, isMobileScreen, isPreview, singleColumn=false, ...props }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['translation', 'validators', 'schoolCenter', 'levels', window.location.hostname]);

  // Redux
  const dispatch = useDispatch();
  // Load state from Redux store
  const { activeIndex } = useSelector(s => s.contentFactory);


  const [detectedCapsules, setDetectedCapsules] = useState(null);
  const [detectedTrainingModules, setDetectedTrainingModules] = useState(null);
  const [detectedChapters, setDetectedChapters] = useState(null);
  const [detectedLevels, setDetectedLevels] = useState(null);

  const [showCapsuleFeedbackPopup, setShowCapsuleFeedbackPopup] = useState(false);

  const {
    F_showToastMessage,
    F_handleSetShowLoader,
    F_getErrorMessage,
    F_getHelper
  } = useMainContext();
  const { userPermissions } = F_getHelper();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [detectedImageUrl, setDetectedImageUrl] = useState('')

  const [trainingModules, setTrainingModules] = useState(undefined)
  const [trainingModule, setTrainingModule] = useState(null)
  const [showTrainingModulesDrawer, setShowTrainingModulesDrawer] = useState(false)

  const [chapter, setChapter] = useState(null)
  const [showChaptersDrawer, setShowChaptersDrawer] = useState(false)

  const [capsule, setCapsule] = useState("");

  const [level, setLevel] = useState(null)
  const [allLevels, setAllLevels] = useState([])
  const [showLevelsDrawer, setShowLevelsDrawer] = useState(false)

  const [maxTime, setMaxTime] = useState(new Date(new Date().setHours(0, 0, 0, 0)))
  const [durationTime, setDurationTime] = useState(new Date(new Date().setHours(0, 0, 0, 0)))

  const [randomOrder, setRandomOrder] = useState(false)
  const [allowPrevious, setAllowPrevious] = useState(false)
  const [revealAnswers, setRevealAnswers] = useState(false)
  const [questionPerPage, setQuestionPerPage] = useState(false)

  const [sendToCloud, setSendToCloud] = useState(false)
  const [sendToLibrary, setSendToLibrary] = useState(true)
  const [hideFromTrainees, setHideFromTrainees] = useState(false)
  const [allowMultipleAttempts, setAllowMultipleAttempts] = useState(false)

  const [gradingScale, setGradingScale] = useState(null)
  const [gradingScales, setGradingScales] = useState(undefined)
  const [showGradingScalesDrawer, setShowGradingScalesDrawer] = useState(false)

  const [allTags, setAllTags] = useState(undefined)
  const [tags, setTags] = useState([])
  const [showTagsDrawer, setShowTagsDrawer] = useState(false)

  const [allCocreators, setAllCocreators] = useState(undefined)
  const [cocreators, setCocreators] = useState([])
  const [showCocreatorsDrawer, setShowCocreatorsDrawer] = useState(false)

  const [allBooks, setAllBooks] = useState(undefined)
  const [books, setBooks] = useState(undefined)
  const [showBooksDrawer, setShowBooksDrawer] = useState(false)

  const [allGroups, setAllGroups] = useState([])
  const [groups, setGroups] = useState([])
  const [showGroupsDrawer, setShowGroupsDrawer] = useState(false)

  const [showCoverPhoto, setShowCoverPhoto] = useState(true)
  const [showExamination, setShowExamination] = useState(true)
  const [showGeneralInformation, setShowGeneralInformation] = useState(true)
  const [showLibraryAllocation, setShowLibraryAllocation] = useState(true)
  const [showVisibility, setShowVisibility] = useState(true)
  const [showAssetsTab, setShowAssetsTab] = useState(true)

  const [isTrainingCenter] = useState(F_getHelper().manageScopeIds.isTrainingCenter)

  // Assets settings
  const [saveAsAsset, setSaveAsAsset] = useState(contentJSON.contentType == "ASSET")// Will save content also as asset
  const [saveAllElementsAsAssets, setSaveAllElementsAsAssets] = useState(false)// All elements as seperated assets


  const contentJSONRef = useRef();
  contentJSONRef.current = contentJSON

  useEffect(() => {
    var currentModule = contentJSON?.module ? { _id: contentJSON?.module } : ModuleService.getCurrentModule()
    if (currentModule?._id) {// Only when moduleId is provided. For some users it's set to 0
      F_handleSetShowLoader(true);
    }
    ModuleService.getAllTrainingModules(contentJSON?.module).then(
      (response) => {
        setTrainingModules(response.data)
      },
      (error) => {
        let errorMessage = t("Could not  load training modules.")
        F_showToastMessage(errorMessage, 'error')
      }
    )


    CommonService.getAllInterests().then(
      (response) => {
        let subinterests = [];
        response.data.forEach(interest => {
          interest.subinterests.forEach(subinterest => {
            if (contentJSON.tags && contentJSON.tags.includes(subinterest._id)) {
              subinterests.push({ _id: subinterest._id, name: t(subinterest.name), parent: t(interest.name), originalName: subinterest.name, originalParent: interest.name, isSelected: true })
            } else {
              subinterests.push({ _id: subinterest._id, name: t(subinterest.name), parent: t(interest.name), originalName: subinterest.name, originalParent: interest.name, isSelected: false })
            }
          })
        })
        setAllTags(subinterests)
      },
      (error) => {
        let errorMessage = t("Could not  load tags.")
        F_showToastMessage(errorMessage, 'error')
      }
    )


    ModuleService.getAllTrainersInModule(contentJSON?.module).then(
      (response) => {
        let trainers = response.data.map(function (user) {
          return { _id: user._id, name: user.name + " " + user.surname };
        })//.filter(u => u._id !== F_getHelper().user.id);;
        setAllCocreators(trainers)
      },
      (error) => {
        let errorMessage = t("Could not load cocreators.")
        F_showToastMessage(errorMessage, 'error')
      }
    )

    ContentService.getAllLevels().then(
      (response) => {
        let levels = response.data.map(id => {
          // Translation adjsuted to specific environment
          // eg. school in France might use different terminology than school in Switzerland
          let name = t("Level") + " " + id;
          let tooltip = t("env-"+window.location.hostname + `:CLASS_FOR_LEVEL_${id}`)
          let description = t(`levels:DESCRIPTION_FOR_LEVEL_${id}`)

          return { _id: id, name: name, description: description, tooltip: tooltip }
        })
        setAllLevels(levels)
      },
      (error) => {
        let errorMessage = t("Could not  load levels.")
        F_showToastMessage(errorMessage, 'error')
      }
    )

    ModuleService.getAllGroups(contentJSON?.module).then(
      (response) => {
        setAllGroups(response.data)
      },
      (error) => {
        let errorMessage = t("Could not  load groups.")
        F_showToastMessage(errorMessage, 'error')
      }
    )

    // Title adn description
    if (contentJSON.title) setTitle(contentJSON.title);
    if (contentJSON.description) setDescription(contentJSON.description);

    if (contentJSON.image) {
      ContentService.getImageDetails(contentJSON.image).then(response => {
        setImage(response.data)
      })
    }
    // Reveal answers
    if (contentJSON.hideFromTrainees) setHideFromTrainees(true);
    if (contentJSON.allowMultipleAttempts) setAllowMultipleAttempts(true);
    if (contentJSON.sendToLibrary) setSendToLibrary(true);
    else if (!contentJSON.sendToLibrary && contentJSON._id) setSendToLibrary(false);
    if (contentJSON.sendToCloud) setSendToCloud(true);

    if (contentJSON.contentType === "TEST") {


      ModuleCoreService.getAllGradingScalesForModule(currentModule._id).then(
        (response) => {
          let gradingScales = response.data.gradingScales.map(gs => { delete gs.description; return gs; })
          setGradingScales(gradingScales)
          // If there is no gradingscale assigned to the content yet
          if (!contentJSON.gradingScale) {
            // Find default grading scale on the list
            let defaultGradingScaleId = response.data?.defaultGradingScale?.toString()
            let defaultGradingScale = gradingScales.find(gs => gs._id.toString() === defaultGradingScaleId)
            // If there is no default use the first gs on the list
            if (!defaultGradingScale) defaultGradingScale = gradingScales[0]
            setGradingScale(defaultGradingScale)
          }
        },
        (error) => {
          let errorMessage = t("Could not  load grading scales")
          F_showToastMessage(errorMessage, 'error')
        }
      )

      // Random order
      if (contentJSON.questionsOrder === "random") setRandomOrder(true);
      // Allow previous
      if (contentJSON.showPrevButton || contentJSON.showPrevButton == undefined) setAllowPrevious(true);
      // Reveal answers
      if (contentJSON.revealAnswers) setRevealAnswers(true);
      //Question per page
      if (contentJSON.questionsOnPageMode === "questionPerPage") setQuestionPerPage(true);

      //Time
      if (contentJSON.maxTimeToFinish) {
        let d = Number(contentJSON.maxTimeToFinish);
        let time = new Date()
        time.setHours(Math.floor(d / 3600))
        time.setMinutes(Math.floor(d % 3600 / 60))
        time.setSeconds(Math.floor(d % 3600 % 60))
        setMaxTime(time)
      }
    }
    else if (contentJSON.contentType === "PRESENTATION") {
      setGradingScales([])
      //Time
      if (contentJSON.durationTime) {
        let d = Number(contentJSON.durationTime);
        let time = new Date()
        time.setHours(Math.floor(d / 3600))
        time.setMinutes(Math.floor(d % 3600 / 60))
        time.setSeconds(Math.floor(d % 3600 % 60))
        setDurationTime(time)
      }
    }

  }, []);


  useEffect(() => {
    if (allGroups != undefined && allCocreators != undefined &&
      trainingModules != undefined && gradingScales != undefined
      && allTags != undefined && allLevels != undefined && (!trainingModule || allBooks !== undefined))
      // If only one file was uploaded - use the name of the file as content title
      if (!contentJSON.title && contentJSON?.pages?.length === 1) {
        if (contentJSON.pages[0]?.elements?.length === 1 && contentJSON.pages[0].elements[0].subtype == 'file') {
          ContentService.getFileDetails(contentJSON.pages[0].elements[0].file).then(response => {
            if (response.data.fileOriginalName) {
              let fileName = response.data.fileOriginalName.replace(/\.[^/.]+$/, "")
              setTitle(fileName)
            }
          })
        }
      }
    // Hide loading screen
    setTimeout(() => F_handleSetShowLoader(false), 1500)
  }, [allGroups, allCocreators, trainingModules, gradingScales, allTags, allLevels, trainingModule, allBooks]);


  const detectLevels = () => {
    let content = { ...contentJSON }
    AlgorithmsService.detectLevels(content)
      .then(
        (response) => {
          if (response.data && response.data.levels && response.data.levels.length) {
            setDetectedLevels(response.data.levels)
          } else setDetectedLevels([])
        },
        (error) => {
          let errorMessage = t("Error while running detection algorithm  for levels.")
          console.error(errorMessage)
          //F_showToastMessage(errorMessage, 'error')
        }
      )

  }


  const detectTrainingModules = () => {
    let content = { ...contentJSON }
    AlgorithmsService.detectTrainingModules(content, trainingModules)
      .then(
        (response) => {
          if (response.data && response.data.trainingModules && response.data.trainingModules.length) {
            setDetectedTrainingModules(response.data.trainingModules)
          } else setDetectedTrainingModules([])
        },
        (error) => {
          let errorMessage = t("Error while running detection algorithm  for training modules.")
          console.error(errorMessage)
          //F_showToastMessage(errorMessage, 'error')
        }
      )

  }

  const detectChapters = () => {
    let content = { ...contentJSON }

    let parentTrainingModule = { ...trainingModule, nameFromAI: null }

    // If user selected one of the suggested training modules, send it's name back to AI
    let detectedTrainingModule = detectedTrainingModules?.find(tm => tm._id === trainingModule._id)
    if (detectedTrainingModule)
      parentTrainingModule.nameFromAI = detectedTrainingModule.nameFromAI

    AlgorithmsService.detectChapters(content, parentTrainingModule)
      .then(
        (response) => {
          if (response.data && response.data.chapters && response.data.chapters.length) {
            setDetectedChapters(response.data.chapters)
          }
          else setDetectedChapters([])
        },
        (error) => {
          let errorMessage = t("Error while running detection algorithm for chapters.")
          F_showToastMessage(errorMessage, 'error')
        }

      )
  }

  const detectCapsules = () => {
    F_handleSetShowLoader(true);
    let content = { ...contentJSON }
    let parentChapter = { ...chapter, nameFromAI: null }

    // If user selected one of the suggested chapters, send it's name back to AI
    let detectedChapter = detectedChapters?.find(ch => ch._id === chapter._id)
    if (detectedChapter) parentChapter.nameFromAI = detectedChapter.nameFromAI
    AlgorithmsService.detectCapsules(content, parentChapter)
      .then(
        (response) => {
          if (response.data && response.data.capsules && response.data.capsules.length) {
            let capsules = response.data.capsules
            capsules.forEach(c => { c.name = c.name.charAt(0).toUpperCase() + c.name.slice(1) })
            setDetectedCapsules(response.data.capsules)
            setShowCapsuleFeedbackPopup(true)
          }
          F_handleSetShowLoader(false);
        },
        (error) => {
          let errorMessage = t("Error while running detection algorithm for capsules.")
          F_showToastMessage(errorMessage, 'error')
          F_handleSetShowLoader(false);

        }

      )


  }

  const saveContent = async (event) => {
    event.preventDefault();
    F_handleSetShowLoader(true);
    //CHECK FEEDBACK AND SAVE IT #TODO #TODO
    // ...
    // ...
    let content = { ...contentJSON }

    // Save only ids of objects in databse
    // Full objects were only used during creation and for AI alogorithms
    content.chapter = chapter?._id;
    content.trainingModule = trainingModule?._id;
    content.gradingScale = gradingScale?._id;
    content.books = books?.map(b => b._id);
    if(userPermissions.bcTrainer.access || userPermissions.bcCoach.edit ) { 
      content.hideFromTrainees = false; //TODOJULY-Review
    }


    // SAVING
    try{

      // ###### SAVE BASE CONTENT ###################################
      await ContentService.save(content)
      let message = t("Content was saved successfully")
      F_showToastMessage(message, 'success')


      let isAsset = (content.contentType == "ASSET")
      
      // ##### SAVE ADDITIONALLY AS ASSET ##########################
      if (!isAsset && saveAsAsset){
        let asset = {...content}// Overide some fields
        asset._id = undefined
        asset.title = t("ASSET") + ": " + asset.title
        asset.contentType = "ASSET"

        await ContentService.save(asset)
        message = t("Asset was saved successfully")
        F_showToastMessage(message, 'success')
      }

      // ##### SAVE ALL ELEMENTS AS ASSETS ##########################
      if (saveAllElementsAsAssets) {
        let baseAsset = { ...content }// Overide some fields
        baseAsset._id = undefined
        baseAsset.durationTime = undefined
        baseAsset.maxTimeToFinish = undefined
        baseAsset.contentType = "ASSET"
        baseAsset.tags = []

        var elementNumber = 0
        for (let page of content.pages) {
          if (page.elements) {
            for (let element of page.elements) {
              let title = ''
              elementNumber += 1

              if (element.subtype == 'file') {
                // Use file name as title for the ASSET
                console.log(element.file)
                let response = await ContentService.getFileDetails(element.file)
                title = response.data?.fileOriginalName//?.replace(/\.[^/.]+$/, "")
              } else {
                // Use instruction text as the title for the ASSET 
                let span = document.createElement('span');
                span.innerHTML = element.title;
                title = span.textContent || span.innerText;
                if (title.length>40) title = title.slice(0,40)+'...'
              }

              // If missing
              if (!title.trim()) title = t("ELEMENT") + ` ${elementNumber}: ` + baseAsset.title
              await ContentService.save({...baseAsset, title: title, pages: [{elements: [element]}]})
            }
          }
        }
        message = t("All elements saved as assets successfully")
        F_showToastMessage(message, 'success')
      }


      returnToHome()
    }catch (error) {
      console.error(error)
      let errorMessage = F_getErrorMessage(error)
      F_showToastMessage(errorMessage, 'error')
      F_handleSetShowLoader(false);
    }

    
  };

  const returnToHome = () => {
    dispatch(remove(activeIndex - 1))// active index is index of tab - remove takes index of content on the list
    dispatch(setActiveIndex(0))
    navigate("/create-content")
  }


  useEffect(() => {
    if (trainingModules && trainingModules.length && contentJSON.trainingModule && !trainingModule) {
      // Set previously selected tm/chapter/capsule
      var tm = trainingModules.find(tm => tm._id == contentJSON.trainingModule._id)
      setTrainingModule(tm)
      if (contentJSON.chapter) {
        let ch = tm?.chapters.find(ch => ch._id == contentJSON.chapter._id)
        setChapter(ch)
        if (contentJSON.capsule) setCapsule(contentJSON.capsule);
      }
    }

    if (!isPreview && trainingModules && trainingModules.length) detectTrainingModules()

  }, [trainingModules]);


  function handleTrainingModuleChange(newTrainingModule) {
    // 1. The same as already selected
    if (newTrainingModule?._id === trainingModule?._id) return;
    // 2. New selected trainingModule
    else if (newTrainingModule && newTrainingModule !== 'none') {
      // Set new values for tm and reset chater and capsule
      setTrainingModule(newTrainingModule); setChapter(undefined); setCapsule('');
      // Save changes
      let content = { ...contentJSONRef.current }
      content.trainingModule = newTrainingModule;
      content.chapter = undefined
      content.capsule = ""
      setContentJSON(content);
      // 3. Unselected trainingModule
    } else {
      //Reset values for tm, chapter and capsule
      setTrainingModule(undefined); setChapter(undefined); setCapsule('');
      // Save changes
      let content = { ...contentJSONRef.current }
      content.trainingModule = undefined
      content.chapter = undefined
      content.capsule = ""
      setContentJSON(content);
    }
  }


  function handleChapterChange(newChapter) {
    // 1. The same as already selected
    if (newChapter?._id === chapter?._id) return;
    // 2. New selected chapter
    else if (newChapter && newChapter !== 'none') {
      // Set new values for chapter and resest capsule
      setChapter(newChapter); setCapsule('');
      // Save changes
      let content = { ...contentJSONRef.current }
      content.chapter = newChapter
      content.capsule = ""
      setContentJSON(content);
      // 3. Unselected chapter
    } else {
      // Reset values for chapter and capsule
      setChapter(undefined); setCapsule('');
      // Save changes
      let content = { ...contentJSONRef.current }
      content.chapter = undefined
      content.capsule = ""
      setContentJSON(content);
    }




  }
  function handleCapsuleChange(newCapsule) {
    // Set new value
    setCapsule(newCapsule)
    // Save changes
    let content = { ...contentJSONRef.current }
    content.capsule = newCapsule
    setContentJSON(content);
  }

  useEffect(() => {

    if (gradingScales && gradingScales.length && contentJSON.gradingScale && !gradingScale) {
      let gs = gradingScales.find(gs => gs._id === contentJSON.gradingScale._id)
      setGradingScale(gs)
    }
  }, [gradingScales]);

  useEffect(() => {
    if (!image && tags) {
      let subinterests = tags.map(t => { return { _id: t._id, name: t.originalName, parent: t.originalParent } })
      ContentService.findBestMatchingImageUrl(subinterests).then((response) => {
        setDetectedImageUrl(response.data)
      },
        (error) => {
          let errorMessage = t("Could not load an image.")
          F_showToastMessage(errorMessage, 'error')
        }
      )
    }
  }, [tags]);

  useEffect(() => {
    //Level
    if (allLevels && allLevels.length && contentJSON.level) {
      let l = allLevels.find(l => l._id === contentJSON.level)
      setLevel(l)
    }
    if (!isPreview && allLevels && allLevels.length) detectLevels()


    // Temporary change - autoselect level 11B ###
    if (allLevels && allLevels.length && !contentJSON.level) {
      let l = allLevels.find(l => l._id === "11B")
      setLevel(l)
    }//###########################################
  }, [allLevels]);


  useEffect(() => {
    if (allTags && allTags.length && contentJSON.tags && !tags.length) {
      let t = allTags.filter(t => contentJSON.tags.includes(t._id))
      setTags(t)
    }
  }, [allTags]);

  useEffect(() => {
    if (allCocreators && allCocreators.length && contentJSON.cocreators && !cocreators.length) {
      let cc = allCocreators.filter(cc => contentJSON.cocreators.includes(cc._id))
      setCocreators(cc)
    }
  }, [allCocreators]);

  useEffect(() => {
    if (allBooks && allBooks.length && contentJSON.books && !books?.length) {
      setBooks(contentJSON.books)
    }

  }, [allBooks]);

  useEffect(() => {
    if (allGroups && allGroups.length && contentJSON.groups && !groups.length) {
      let g = allGroups.filter(g => contentJSON.groups.includes(g._id))
      setGroups(g)
    }
  }, [allGroups]);

  useEffect(() => {
    let content = { ...contentJSON }
    content.title = title;
    setContentJSON(content)
  }, [title]);


  useEffect(() => {
    let content = { ...contentJSON }
    content.description = description;
    setContentJSON(content)
  }, [description]);

  useEffect(() => {
    let content = { ...contentJSON }
    if (image) {
      content.image = image._id;
      setContentJSON(content)
    } else if (content?.image) {// Image was removed
      content.image = null;
      setContentJSON(content)
    }
  }, [image]);

  useEffect(() => {
    let selectedTime = new Date(maxTime)
    let seconds = selectedTime.getSeconds() + selectedTime.getMinutes() * 60 + selectedTime.getHours() * 3600;

    let content = { ...contentJSON }
    content.maxTimeToFinish = seconds
    content.showTimerPanel = "top";
    content.showTimerPanelMode = "survey"
    setContentJSON(content)

  }, [maxTime]);

  useEffect(() => {
    let selectedTime = new Date(durationTime)
    let seconds = selectedTime.getSeconds() + selectedTime.getMinutes() * 60 + selectedTime.getHours() * 3600;

    let content = { ...contentJSON }
    content.durationTime = seconds
    setContentJSON(content)

  }, [durationTime]);

  useEffect(() => {

    let content = { ...contentJSON }
    if (randomOrder) {
      content.questionsOrder = "random"
      content.showQuestionNumbers = "off"
    } else {
      content.questionsOrder = undefined
      content.showQuestionNumbers = "on"
    }
    setContentJSON(content)

  }, [randomOrder]);


  useEffect(() => {
    let content = { ...contentJSON }
    content.showPrevButton = allowPrevious;
    setContentJSON(content)
  }, [allowPrevious]);


  useEffect(() => {
    let content = { ...contentJSON }
    content.revealAnswers = revealAnswers;
    setContentJSON(content)
  }, [revealAnswers]);


  useEffect(() => {

    let content = { ...contentJSON }
    if (questionPerPage) content.questionsOnPageMode = "questionPerPage";
    else content.questionsOnPageMode = "standard";
    setContentJSON(content)

  }, [questionPerPage]);

  useEffect(() => {// Change of trainingModule
    if (trainingModule && trainingModule !== 'none') {
      // Reload chapter detection for selected trainingModule
      if (detectedTrainingModules !== null) detectChapters()
      // Reload all available books for trainingModule
      TrainingModuleService.getBooks(trainingModule._id).then(
        (response) => {
          setAllBooks(response.data)
        },
        (error) => {
          let errorMessage = t("Could not load books.")
          F_showToastMessage(errorMessage, 'error')
        }
      )

    } else if (contentJSON.program) {
      setAllBooks(contentJSON.books)

    }
  }, [trainingModule]);

  useEffect(() => {// Change of chapter
    if (chapter && chapter !== 'none') {
      // Reload capsule detection for selected chapter
      if (!capsule && detectedChapters !== null) detectCapsules()

    }
  }, [chapter]);
  useEffect(() => {
    if (level) {
      let content = { ...contentJSON }
      content.level = level._id;
      setContentJSON(content)
    }
  }, [level]);


  useEffect(() => {
    let content = { ...contentJSON }
    content.detectedTrainingModules = detectedTrainingModules;
    setContentJSON(content)

    if (trainingModule && detectedTrainingModules !== null) detectChapters()

  }, [detectedTrainingModules]);

  useEffect(() => {
    let content = { ...contentJSON }
    content.detectedChapters = detectedChapters;
    setContentJSON(content)

    if (!capsule && chapter && detectedChapters !== null) detectCapsules()

  }, [detectedChapters]);

  useEffect(() => {
    let content = { ...contentJSON }
    content.detectedCapsules = detectedCapsules;
    setContentJSON(content)
  }, [detectedCapsules]);

  useEffect(() => {
    let content = { ...contentJSON }
    content.detectedLevels = detectedLevels;
    setContentJSON(content)
  }, [detectedLevels]);

  useEffect(() => {
    if (gradingScale) {
      let content = { ...contentJSON }
      content.gradingScale = gradingScale;
      setContentJSON(content)
    }
  }, [gradingScale]);


  useEffect(() => {
    let content = { ...contentJSON }
    content.tags = tags.map(t => t._id);
    setContentJSON(content)

  }, [tags]);

  useEffect(() => {
    let content = { ...contentJSON }
    content.groups = groups.map(g => g._id);;
    setContentJSON(content)

  }, [groups]);

  useEffect(() => {
    let content = { ...contentJSON }
    content.cocreators = cocreators.map(cc => cc._id);
    setContentJSON(content)

  }, [cocreators]);

  useEffect(() => {
    let content = { ...contentJSON }
    if (books === undefined) content.books = undefined;
    else content.books = books;

    setContentJSON(content)
  }, [books]);

  useEffect(() => {
    let content = { ...contentJSON }
    content.hideFromTrainees = hideFromTrainees;
    setContentJSON(content)

  }, [hideFromTrainees]);

  useEffect(() => {
    let content = { ...contentJSON }
    content.allowMultipleAttempts = allowMultipleAttempts;
    setContentJSON(content)

  }, [allowMultipleAttempts]);

  useEffect(() => {
    let content = { ...contentJSON }
    content.sendToLibrary = sendToLibrary;
    setContentJSON(content)

  }, [sendToLibrary]);

  useEffect(() => {
    let content = { ...contentJSON }
    content.sendToCloud = sendToCloud;
    setContentJSON(content)

  }, [sendToCloud]);


  const getHeader = () => {
    if (!isMobileScreen && !isPreview) return <>
      <Grid container item xs={12} alignItems="center" sx={{ mb: '32px' }} >
        <EIconButton
          onClick={() => { setShow(false) }}
          size="large" variant="contained" color="secondary">
          <SvgIcon viewBox="15 15 18 18" component={BackIcon} />
        </EIconButton>
        <Typography sx={{ ...theme.typography.h3, textAlign: 'left', float: 'left', pl: 2, color: theme.palette.primary.lightViolet, textTransform: 'capitalize' }} >
          {t(contentJSON.contentType.toLowerCase()) + ": "} {t("Saving options")}
        </Typography>
      </Grid>
    </>
    else return <></>

  }


  const getGeneralInformationTab = () => {
    if (contentJSON.contentType == "ASSET")
      return <ETextField label={t("Title")} localValue={title} localOnBlur={(event) => { setTitle(event.target.value) }} required={true} disabled={isPreview} />

    else return <CommonExpandBar value={isPreview || showGeneralInformation} setValue={setShowGeneralInformation} text={t("General information")}  sx={{mb: '24px'}}>
      <ETextField label={t("Title")} localValue={title} localOnBlur={(event) => { setTitle(event.target.value) }} required={true} disabled={isPreview} />
      {/* Temporary change - removed `required` property ######## */}
      <ETextField label={t("Description")} localValue={description} localOnBlur={event => setDescription(event.target.value)} disabled={isPreview} />
      {!contentJSON.program && <>
        {allCocreators && <CommonSelectWithDrawer name={t("Assign cocreators")}
          multiple={true}
          list={allCocreators} setSelected={setCocreators} selected={cocreators}
          showDrawer={showCocreatorsDrawer} setShowDrawer={setShowCocreatorsDrawer}
          disabled={isPreview}
        />}
      </>}

      { /* ONLY FOR Presentation */}
      {(contentJSON.contentType === "PRESENTATION") && (<>
        <CommonTimePicker name={t("Duration time")} value={durationTime} setValue={setDurationTime} disabled={isPreview} />
      </>)}


      { /* ONLY FOR TESTS */}
      {(contentJSON.contentType === "TEST") && (<>
        <CommonTimePicker name={t("Duration time")} value={maxTime} setValue={setMaxTime} disabled={isPreview} />
      </>)}


    </CommonExpandBar>
  }



  const getExaminationTab = () => {
    if (contentJSON.contentType === "TEST") return <CommonExpandBar value={isPreview || showExamination} setValue={setShowExamination} text={t("Examination")} sx={{mb: '24px'}}>

      <ESwitchWithTooltip name={t("Random order")} description={t("Display questions and answers in random order")} checked={randomOrder} onChange={() => setRandomOrder(p => !p)} disabled={isPreview}></ESwitchWithTooltip>
      <ESwitchWithTooltip name={t("Reveal correct answers")} description={t("Reveal correct answers after finishing the test")} checked={revealAnswers} onChange={() => setRevealAnswers(p => !p)} disabled={isPreview}></ESwitchWithTooltip>
      <ESwitchWithTooltip name={t("Allow to return")} description={t("Allow to return to previous pages")} checked={allowPrevious} onChange={() => setAllowPrevious(p => !p)} disabled={isPreview}></ESwitchWithTooltip>
      <ESwitchWithTooltip name={t("Question per page")} description={t("Display each question on single page")} checked={questionPerPage} onChange={() => setQuestionPerPage(p => !p)} disabled={isPreview}></ESwitchWithTooltip>
      <ESwitchWithTooltip name={t("Allow multiple attempts")} description={t("Allow trainees to take this test as many times as they want")} checked={allowMultipleAttempts} onChange={() => setAllowMultipleAttempts(p => !p)} disabled={isPreview}></ESwitchWithTooltip>
      {gradingScales &&
        <Box sx={{ mt: '24px' }}><CommonSelectWithDrawer name={t("Grading scale")} required={true} list={gradingScales} setSelected={setGradingScale} selected={gradingScale ? gradingScale : undefined}
          showDrawer={showGradingScalesDrawer} setShowDrawer={setShowGradingScalesDrawer} disabled={isPreview}
        /></Box>}




    </CommonExpandBar>

    else return <></>
  }


  const getAllocationTab = () => {
    return <CommonExpandBar value={isPreview || showLibraryAllocation} setValue={setShowLibraryAllocation} text={t("Library allocation")}  sx={{mb: '24px'}}>
      <Grid item container xs={12} spacing={'32px'}>
        <Grid item xs={12} md={singleColumn ? 12 : 6}>
          {contentJSON.program == undefined && <>
            {trainingModules && <CommonSelectWithDrawer name={t(`${isTrainingCenter ? "" : "schoolCenter:"}Select training module`)} required={true} list={trainingModules} suggested={detectedTrainingModules} setSelected={handleTrainingModuleChange} selected={trainingModule ? trainingModule : undefined}
              showDrawer={showTrainingModulesDrawer} setShowDrawer={setShowTrainingModulesDrawer} disabled={isPreview}
            />}
            {<CommonSelectWithDrawer name={t("Select chapter")} disabled={isPreview || !trainingModule} required={true} list={trainingModule?.chapters} suggested={detectedChapters} setSelected={handleChapterChange} selected={chapter}
              showDrawer={showChaptersDrawer} setShowDrawer={setShowChaptersDrawer}
            />}
            {<ETextField label={t("Select subchapter")} disabled={isPreview || !trainingModule} value={capsule} onChange={(event) => handleCapsuleChange(event.target.value)} required={true} />}

          </>}
          {contentJSON.program != undefined && <>
            {<ETextField label={t(`${isTrainingCenter ? "" : "schoolCenter:"}Select training module`)} disabled={true} value={contentJSON.programTrainingModule.newName} />}
            {<ETextField label={t("Select chapter")} disabled={true} value={contentJSON.programChapter.name ?? contentJSON.programChapter.chapter.name} />}
            {<ETextField label={t("Select subchapter")} disabled={true} value={capsule} />}

          </>}

          {<CommonSelectWithDrawer disabled={isPreview || !trainingModule || !allBooks || !(allBooks.length > 0)} name={t("Select source materials")}
            multiple={true} required={allBooks && (allBooks.length > 0)} emptyItemText={t('I did not use any of the materials above.')}
            list={allBooks} setSelected={setBooks} selected={books}
            showDrawer={showBooksDrawer} setShowDrawer={setShowBooksDrawer}
          />}

          <Grid item xs={12}>
            {!contentJSON.program && allTags &&
              // Temporary change - removed `required` property ##########
              <CommonSelectWithDrawer name={t("Tags")}
                multiple={true}
                showDrawer={showTagsDrawer} setShowDrawer={setShowTagsDrawer}
                list={allTags} selected={tags} setSelected={setTags} disabled={isPreview}
              />
            }
          </Grid>

          {/* Temporary change - Disabled level selection for French client */}
          {allLevels && <>
            <Typography sx={{ ...theme.typography.p16, color: theme.palette.neutrals.almostBlack, mb: '16px' }} >
              {t("Assign level")}
            </Typography>

            <CommonSelectWithDrawer name={t(`${isTrainingCenter ? "" : "schoolCenter:"}Select module level`)} required={true} list={allLevels} suggested={detectedLevels} setSelected={setLevel} selected={level}
              showDrawer={showLevelsDrawer} setShowDrawer={setShowLevelsDrawer} disabled={isPreview || window.location.hostname == 'fr.elia.academy'}
            /></>}
        </Grid>


        <Grid item xs={12} md={singleColumn ? 12 : 6}>
          {!contentJSON.program && <>
            {/* commented as nowhere in system we are using it for the moment */}
            {!(userPermissions.isLibrarian || userPermissions.isCloudManager) && <ESwitchWithTooltip name={t("Send to network cloud")} description={t("Share this content with all the people in your network.")} checked={sendToCloud} onChange={() => setSendToCloud(p => !p)} disabled={isPreview} />}
            {/* no need of Cloud in first version of Elia */}
            {!(userPermissions.isLibrarian || userPermissions.isCloudManager) && <ESwitchWithTooltip name={t("Publish in Public Library")} disabled={isPreview || sendToCloud} description={t("Share this content with all the people in your module")} checked={sendToCloud || sendToLibrary} onChange={() => setSendToLibrary(p => !p)} />}
          </>}
        </Grid>
      </Grid>


    </CommonExpandBar>
  }


  const getCoverPhotoName = () => {
    if (image) return t("Uploaded")+" > "+image.fileOriginalName
    else if (detectedImageUrl) {

      var fileName = detectedImageUrl.match("images/(.*).jpg/download");
      fileName = fileName[1].replaceAll('-', ' ').replace(/[0-9]/g, '');
      var splitCategory = fileName.toLowerCase().split(' ')
      for (var i = 0; i < splitCategory.length; i++) {
        splitCategory[i] = splitCategory[i].charAt(0).toUpperCase() + splitCategory[i].substring(1);     
      }
      let category = splitCategory.join(' ')
      return t("Default") + " > " + category}
  }

  const getCoverPhotoTab = () => {


    if (contentJSON.contentType == "ASSET") return <></>
    return <CommonExpandBar  value={isPreview || showCoverPhoto} setValue={setShowCoverPhoto} text={t("Cover photo")} padding={false} sx={{mb: '24px'}}>

      <Grid item xs={12}  >
        <ECard style={{   display:"block", borderRadius: "0px 0px 8px 8px"}} >
          <ImageListItem>
            <img src={image ? `/api/v1/contents/images/${image._id}/download` : `${detectedImageUrl}`} 
                  alt=" "
                  loading="lazy"
              />   
            <CommonImageUpload name={getCoverPhotoName()} type="bar" disabled={isPreview} value={image} setValue={setImage} uploadFunction={ContentService.uploadImage} getFileDetailsFunction={ContentService.getFileDetails} />
          </ImageListItem>

        </ECard>
      </Grid>
    </CommonExpandBar>
  }




  const getVisibilityTab = () => {
    if (contentJSON.contentType == "ASSET") return <></>
    return <CommonExpandBar value={isPreview || showVisibility} setValue={setShowVisibility} text={t(`${isTrainingCenter ? "" : "schoolCenter:"}Visibility to trainees`)}  sx={{mb: '24px'}}>
      <Typography sx={{ ...theme.typography.p16, color: theme.palette.neutrals.almostBlack, mb: '8px' }} >
        {t("Share with")}
      </Typography>
      {!contentJSON.program && <>
        {/* Share with Groups will be unblocked for TRAINING CENTER */}
        <CommonSelectWithDrawer name={t(`${isTrainingCenter ? "" : "schoolCenter:"}Share with groups`)}
          multiple={true}
          list={allGroups} setSelected={setGroups} selected={groups}
          showDrawer={showGroupsDrawer} setShowDrawer={setShowGroupsDrawer}
          disabled={isPreview}
        /> </>}
      <Grid item xs={12}>
        <ESwitchWithTooltip name={t("Hide from trainees")} description={t("Recommended for content which will be used as exams or homeworks. It will prevent users from displaying this content unless it's used inside a proper event.")} checked={hideFromTrainees} onChange={() => setHideFromTrainees(p => !p)} disabled={isPreview} />
      </Grid>

    </CommonExpandBar>
  }


  const getAssetsTab = () => {
    if (isPreview) return <></>
    return <CommonExpandBar value={isPreview || showAssetsTab} setValue={setShowAssetsTab} text={t('Asset options')} sx={{mb: '24px'}}>
      <ESwitchWithTooltip name={t("Save content as asset")} description={t("This content will be saved as asset - sharable object, which can be reused inside other contents.")} checked={saveAsAsset} onChange={() => setSaveAsAsset(p => !p)} disabled={contentJSON.contentType == "ASSET" || isPreview} />
      <ESwitchWithTooltip name={t("Save all elements as seperated assets")} description={t("All elements in this content will be saved as assets - sharable objects, which can be reused inside other contents.")} checked={saveAllElementsAsAssets} onChange={() => setSaveAllElementsAsAssets(p => !p)} disabled={isPreview} />
    </CommonExpandBar>

  }









  return (
    <React.Fragment>

      {showCapsuleFeedbackPopup && detectedCapsules && <Popup
        type="suggestion"
        title={t("Match subchapter to the content")}
        showTitleBorder={false}
        showAmeliaInside={true}
        text={t("Am3lia would like to know which of these subchapters (capsules) match your content?")}
        selections={detectedCapsules}
        confirmButtonText={t("Confirm")}
        confirmCallback={(selection) => { if (selection) handleCapsuleChange(selection.name); setShowCapsuleFeedbackPopup(false) }}
        absolutePosition={true}
      >
      </Popup>
      }

      <form style={{ height: "calc(100%)", pointerEvents: (isPreview ? 'auto' : 'auto') }} onSubmit={saveContent}>
        {/*<div style={{ "overflow": "auto", "paddingBottom": "30px" }}>*/}
        {/*<Button onClick={() => setShow(false)} classes={{root: classes.root}} variant="contained" size="small" color="secondary" className="float-left" as="input" type="button" >{t("Back")}</Button>*/}
        {/*  <Button className="float-right" classes={{root: classes.root}} size="small" variant="contained" color="primary" as="input" type="submit" startIcon={<SaveIcon/>}>{t("Save")}</Button>*/}
        {/*  <Button onClick={() => setShowPreviewModal(true)} className="mx-1 float-right" classes={{root: classes.root}} size="small" variant="contained" color="primary" as="input" type="button" startIcon={<VisibilityIcon/>}>{t("Preview")}</Button>*/}
        {/*</div>*/}
        <StyledECard {...props}>
          <Grid container spacing={'0px'}>
            {getHeader()}
            {/* LEFT SIDE */}
            <Grid item xs={12} lg={singleColumn ? 12 : 8} sx={singleColumn?{}:{ pr: { xs: 0, lg: '80px' } }}>
              {getGeneralInformationTab()}
              {getExaminationTab()}
              {getAllocationTab()}
            </Grid>
            {/* RIGHT SIDE */}
            <Grid item xs={12} lg={singleColumn ? 12 : 4}>
              {getCoverPhotoTab()}
              {getVisibilityTab()}
              {getAssetsTab()}
            </Grid>

            <Grid item xs={12} sx={{ px: { xs: '8px', sm: 0 } }}>
              <Box sx={{
                my: '20px', width: '100%', height: '1px',
                background: theme.palette.glass.light,
                justifyContent: 'center'
              }}></Box>
            </Grid>
            {!isPreview && <Grid container item xs={12} sx={{ justifyContent: 'space-between' }} >
              <EButton eVariant="secondary" eSize='small' onClick={() => { setShow(false) }}>
                {t("Cancel")}
              </EButton>
              <EButton type="submit" eVariant="primary" eSize='small' onClick={()=>{}}>
                {t("Save")}
              </EButton>
            </Grid>}
          </Grid>






        </StyledECard>
      </form>
    </React.Fragment>
  );
};
export default SaveContent;





