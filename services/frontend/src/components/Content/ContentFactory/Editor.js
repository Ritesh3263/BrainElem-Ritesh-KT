// The main part of the ContentFactory for preview and managment of added questions and pages

import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// Contexts
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


// Services
import ContentService from "services/content.service";

// Styled compoentns
import OptionsButton from "components/common/OptionsButton";
import EIconButton from "styled_components/EIconButton";

import Popup from "components/common/Popup"
import FileUpload from "components/common/File";
import StartContentButton from "components/common/StartContentButton"


import EMenu from 'styled_components/Menu';
import ESvgIcon from "styled_components/SvgIcon";

// NEW ELEMENTS
import { Element } from "components/Content/Element"

// MUI V5
import { Box, Divider, Grid, Typography, MenuItem, InputAdornment } from "@mui/material";



// MUI V4
import { theme } from "MuiTheme";



// Icons
import { ReactComponent as AddIcon } from 'icons/icons_32/Add2_32.svg';
import { ReactComponent as BackIcon } from 'icons/icons_48/Arrow small L.svg';
import { ReactComponent as ForwardIcon } from 'icons/icons_48/Arrow small R.svg';
import { ReactComponent as DownIcon } from 'icons/icons_48/Arrow small D.svg';
import { ReactComponent as UpIcon } from 'icons/icons_48/Arrow small U.svg';
import { ReactComponent as EditIcon } from 'icons/icons_32/Edit_32.svg';
import { ReactComponent as CopyIcon } from 'icons/icons_32/Copy_32.svg';
import { ReactComponent as DeleteIcon } from 'icons/icons_32/Delete_32.svg';
import { ReactComponent as FileUploadIcon } from 'icons/icons_32/File_32.svg';

import { ReactComponent as MoveVerticallyIcon } from 'icons/icons_32/move_vertically.svg';

import { ReactComponent as EditorIcon } from 'icons/content_factory/toolbox/editor.svg';
import { ReactComponent as FileIcon } from 'icons/content_factory/toolbox/file.svg';
import { ReactComponent as TestIcon } from 'icons/content_factory/toolbox/test.svg';
import { ReactComponent as TrueFalseIcon } from 'icons/content_factory/toolbox/truefalse.svg';
import { ReactComponent as MultiSelectIcon } from 'icons/content_factory/toolbox/multiselect.svg';
import { ReactComponent as SingleSelectIcon } from 'icons/content_factory/toolbox/singleselect.svg';
import { ReactComponent as SingleLineIcon } from 'icons/content_factory/toolbox/singleline.svg';
import { ReactComponent as MultiLineIcon } from 'icons/content_factory/toolbox/multiline.svg';
import { ReactComponent as DictationIcon } from 'icons/content_factory/toolbox/dictation.svg';
import { ReactComponent as BlanksIcon } from 'icons/content_factory/toolbox/blanks.svg';
import { ReactComponent as SortIcon } from 'icons/content_factory/toolbox/sort.svg';
import { ReactComponent as RatingIcon } from 'icons/content_factory/toolbox/rating.svg';
import { ReactComponent as SliderIcon } from 'icons/content_factory/toolbox/slider.svg';
import { ReactComponent as DateIcon } from 'icons/content_factory/toolbox/date.svg';


const hiddenCreatorElementStyles = {
    "& .svd_container": {
        height: '100% !important',
    },
    "& .svd-vertical-container__cell-content--scrollable": {

        height: 0,
    },
    "& .svd_commercial_container": {
        display: 'none !important'
    },
    "& .svd_content": {
        display: 'none !important'
    },
    "& .sv-root-modern .sv-boolean__switch": {
        backgroundColor: theme.palette.primary.violet,
    },
    "& .svd-svg-icon": {
        fill: `${theme.palette.primary.violet} !important`,
    },
    "& .svd_container .svd-main-color": {
        color: `${theme.palette.primary.violet} !important`,
    },
    "& .sjs-sortablejs-item": {// color of sortable items
        backgroundColor: `${theme.palette.primary.green} !important`,
    },
    "& .noUi-connect": {// Color of the slider
        backgroundColor: `${theme.palette.primary.green} !important`,
    },
    // ###########################################################
    //Overide SurveyJS buttons ###################################
    // ###########################################################
    "& .btn sv-btn": {
        fontFamily: "Nunito",
        background: theme.palette.gradients.pink,
        borderRadius: `16px`,
        padding: "4px 24px !important",// 4px instead of 8px
        marginRight: `3px`,
        textTransform: "none",
    },
    "& .svd_container.sv_modern_css .btn-secondary": {
        color: theme.palette.primary.creme,
        background: theme.palette.gradients.pink,
    },
    "& .svd_container.sv_modern_css .btn-danger": {
        backgroundColor: theme.palette.neutrals.white,
        color: theme.palette.primary.violet,
    },
    "& .svd_container.svd_container.svd_container .btn-primary": {
        backgroundColor: theme.palette.neutrals.white,
        color: theme.palette.primary.violet,
    },
    "& .svd_container.svd_container.svd_container .btn-secondary:hover": {
        background: theme.palette.gradients.lila,
    },
    "& .sv-root-modern .sv-checkbox--checked .sv-checkbox__svg, & .checkmark": {// Color of the chekbox
        backgroundColor: `${theme.palette.primary.violet} !important`,
    },
    "& .checkmark.svd-light-background-color": {
        backgroundColor: `transparent !important`,
        border: '1px black solid'
    },
    "& .sv-root-modern .sv-checkbox--checked .sv-checkbox__svg:hover, & .checkmark:hover": {// Color of the chekbox
        backgroundColor: `rgb(64 64 64 / 50%) !important`,
    },
    "& .checkmark:after": {// Color of the chekbox
        left: '7px !important',
        top: '5px !important'
    },
    '& .sv-radio--checked .sv-radio__svg': {
        borderColor: `${theme.palette.primary.violet} !important`,
        fill: `${theme.palette.primary.violet} !important`,
    }
}


// The main part of the contentFactory for preview and managment of added questions and pages
//  contentJSON - json object for content
//  isMobileScreen - 
//  updateElementProperty - function to update element property
//  currentPageNumber - current page open in CF 
//  setCurrentPageNumber -function to set current page open in CF 
//  addNewElement - survejs function to add new element
//  deleteElement - survejs function to delete new element
//  duplicateElement - survejs function to duplicate new element
//  editElement - survejs function to edit new element
//  creatorRef - reference to the surveyjs creator object
//  newElementId - used to trigger scroll function
//  setNewElementId - used to trigger scroll function
//  importAsset - function to import asset
export default function Editor({ contentJSON, isMobileScreen, updateElementProperty, currentPageNumber, setCurrentPageNumber, addNewElement, deleteElement, duplicateElement, editElement, creatorRef, newElementId, setNewElementId, importAsset }) {

    const { t } = useTranslation();
    const { F_handleSetShowLoader } = useMainContext();

    const [anchorPageButton, setAnchorPageButton] = useState(null); // For opening menu for page
    const [onboardingStage, setOnboardingStage] = useState(0);
    const [draggedElement, setDraggedElement] = useState()

    // Elements with hidden body - by default all elements are extended
    const [hiddenElements, setHiddenElements] = useState([])

    const newElementRef = useRef(undefined)

    const tools = [
        { name: t('Select True/False'), surveyJsType: 'boolean', icon: TrueFalseIcon },
        { name: t('Select single answer'), surveyJsType: 'radiogroup', icon: SingleSelectIcon },
        { name: t('Select multiple answers'), surveyJsType: 'checkbox', icon: MultiSelectIcon },

        { name: t('Single line answer'), surveyJsType: 'text', icon: SingleLineIcon },
        { name: t('Open answer'), surveyJsType: 'editor', icon: MultiLineIcon },
        { name: t('Dictation'), surveyJsType: 'dictation', icon: DictationIcon },
        { name: t('Blanks'), surveyJsType: 'blanks', icon: BlanksIcon },
        { name: t('Sort answers'), surveyJsType: 'sortablelist', icon: SortIcon },
        { name: t('Rating'), surveyJsType: 'barrating', icon: RatingIcon },
        { name: t('Slider'), surveyJsType: 'nouislider', icon: SliderIcon },
        { name: t('Date picker'), surveyJsType: 'datepicker', icon: DateIcon },

        { name: t('Answer with a file'), surveyJsType: 'attachment', icon: FileIcon },
        { name: t('WYSIWYG Editor'), surveyJsType: 'expression', icon: EditorIcon },
        { name: t("Upload an attachement"), surveyJsType: 'file', icon: FileIcon },
    ]


    const openPageMenu = (event) => {
        setAnchorPageButton(event.currentTarget);
    };

    const closePageMenu = () => {
        setAnchorPageButton(null);
    };


    const handleOnDrop = (event, indexOnPage = 0) => {
        // READY TO USE ELEEMNT
        var assetId = event.dataTransfer.getData("assetId")
        if (assetId) {
            importAsset(assetId)
        }


        // JUST THE NAME OF THE TOOL FROM TOOLBOX
        var surveyJsType = event.dataTransfer.getData("surveyJsType");
        if (surveyJsType) {
            event.preventDefault()
            event.stopPropagation()
            addNewElement(surveyJsType, indexOnPage);
        }
    }

    const handleDragEnd = (item) => {
        F_handleSetShowLoader(true)
        try{
            let sourceElement = creatorRef?.survey?.getQuestionByName(item.draggableId)
            let destinationPage = creatorRef?.survey?.pages[currentPageNumber - 1]
            sourceElement.moveTo(destinationPage, item.destination.index)
        }catch(error){
            console.log(item)
            console.error("Could not drop in this place",error)
        }
        setDraggedElement(undefined)
        setTimeout(()=>{F_handleSetShowLoader(false)},500)
    }



    const isSelected = (value, correctAnswer) => {
        if (correctAnswer === undefined) return false;
        if (Array.isArray(correctAnswer)) {
            return correctAnswer.includes(value)
        } else {
            return value === correctAnswer
        }
    }
    const updateFile = (element, file) => {
        if (!file) updateElementProperty(element, 'file', '')
        else updateElementProperty(element, 'file', file._id)
    }


    const getElementsComponents = () => {

        //var elements = creatorRef?.survey?.pages[currentPageNumber - 1].elements
        var elements = contentJSON.pages[currentPageNumber - 1]?.elements
        var elementsComponents = elements?.map((element, index) => {
            let surveyJSElement = creatorRef?.survey?.pages[currentPageNumber - 1].elements[index]
            var elementType = element.subtype || element.type
            // Get number of the element/question
            var elementIndexOnPage = contentJSON.pages[currentPageNumber - 1]?.elements.indexOf(element)
            var elementId = `${currentPageNumber}_${elementIndexOnPage}`

            // Find html elements
            var titleComponent = <>
                <Box sx={{ pointerEvents: "none", px: 2, py: 3 }} dangerouslySetInnerHTML={{ __html: `<div style='overflow: auto;'>${element.title}</div>` }}></Box>
            </>



            var exampleComponent = <></>
            // Extract editor's content
            let elementJSON = contentJSON.pages[currentPageNumber - 1]?.elements[index]
            if (['expression', 'file', 'boolean', 'radiogroup', 'checkbox', 'text', 'editor', 'math-editor', 'dictation', 'blanks', 'sortablelist', 'barrating', 'nouislider', 'datepicker', 'attachment'].includes(elementType)) {// NEW ELEMENTS
                titleComponent = <></>// Overide title as it is included in the new Element component
                exampleComponent = <Element element={elementJSON} showAnswer={false} showCorrectAnswer={true} showSettings={true} showPointsForCorrectAnswer={true} readOnly={true}></Element>
            } else {
                exampleComponent = <></>
            }


            exampleComponent = <Box sx={{ p: 2 }}>{exampleComponent}</Box>

            // Button to upload file
            if (element.subtype === 'dictation') {
                titleComponent = <>
                    <Box sx={{ pt: 2, px: 2 }}>
                        <FileUpload name={t("Upload audio file")} acceptTypes="audio/*" value={element.file} setValue={(file) => updateFile(element, file)} uploadFunction={ContentService.uploadFile} getFileDetailsFunction={ContentService.getFileDetails} />
                    </Box>
                </>
            } else if (element.subtype === 'file') {
                var CustomIcon = (<ESvgIcon viewBox="0 0 32 32" component={FileUploadIcon} />)
                titleComponent = <Box sx={{ pt: 2, px: 2 }}>
                    <FileUpload name={t("Upload file")} CustomIcon={CustomIcon} value={element.file} setValue={(file) => updateFile(element, file)} auto={!element.file && element.isFirstDisplay} uploadFunction={ContentService.uploadFile} getFileDetailsFunction={ContentService.getFileDetails} />
                </Box>
                element.isFirstDisplay = false

            }



            var tool = tools.find(t => t.surveyJsType == elementType)

            // Create topBar React element
            var questionTopBarComponent =
                <Grid container alignContent="center" sx={{
                    background: `${theme.palette.glass.opaque} !important`,
                    textAlign: "left !important",
                    width: "100% !important",
                    minWidth: "unset !important",
                    height: '56px',
                    borderRadius: hiddenElements.includes(surveyJSElement?.id) ? "12px !important" : "12px 12px 0px 0px !important",
                }}>
                    <Grid container alignContent="center" alignItems="center" style={{ flexWrap: 'nowrap' }} item xs={5} sm={6}>
                        <Grid item container sx={{ alignItems: 'center', width: '32px', height: '100%', pr: '16px' }}>
                            <ESvgIcon sx={{ ml: '8px', height: '100%', cursor: "grab" }} color={theme.palette.primary.violet} viewBox="3 3 26 26" component={MoveVerticallyIcon} />
                        </Grid>
                        <Grid item style={{ overflow: 'hidden' }} alignContent="center">
                            <Typography sx={{
                                ...theme.typography.p,
                                color: theme.palette.neutrals.almostBlack,
                                fontSize: "14px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",

                            }}>{t(tool?.name)}</Typography>
                            <Typography sx={{
                                ...theme.typography.p,
                                color: theme.palette.neutrals.darkGrey,
                                fontSize: "12px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}>{t("Element preview")}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container item xs={7} sm={6} className="pr-2" alignContent="center" alignItems="center" justifyContent="flex-end" style={{ flexWrap: 'nowrap' }}>

                        {!isMobileScreen && <EIconButton sx={{ mr: 1 }} onClick={() => { editElement(creatorRef, surveyJSElement) }} size="large" color="secondary">
                            <ESvgIcon viewBox="0 0 32 32" component={EditIcon} />
                        </EIconButton>}

                        <OptionsButton size="large" iconButton={true} btns={[
                            { id: 1, icon: <ESvgIcon viewBox="0 0 32 32" component={EditIcon} />, name: t("Edit"), disabled: 0, action: () => { editElement(creatorRef, surveyJSElement) } },
                            { id: 1, icon: <ESvgIcon viewBox="-8 -8 48 48" component={CopyIcon} />, name: t("Duplicate"), disabled: 0, action: () => { duplicateElement(creatorRef, surveyJSElement) } },
                            {
                                id: 2, icon: <ESvgIcon viewBox="0 0 32 32" component={DeleteIcon} />, name: t("Delete"), action: async () => {
                                    deleteElement(surveyJSElement)
                                }
                            }
                        ]}></OptionsButton>

                        <EIconButton sx={{ ml: 1 }} onClick={() => {
                            let id = surveyJSElement?.id
                            let copy = [...hiddenElements]
                            if(copy.includes(id)){
                                let index = copy.indexOf(id)
                                copy.splice(index,1)
                                setHiddenElements(copy)
                            }else{
                                copy = [...copy, id]
                                setHiddenElements(copy)
                            }
                        }} size="large" color="secondary">
                            <ESvgIcon viewBox="14 14 20 20" component={hiddenElements.includes(surveyJSElement?.id) ? DownIcon : UpIcon} />
                        </EIconButton>

                    </Grid>
                </Grid >




            // Creat main component
            var component =
                <Draggable draggable={true} draggableId={element.name} index={parseInt(elementIndexOnPage)} key={element.name}>
                    {(provided, snapshot) => (
                        <div ref={provided.innerRef}
                            onDrop={(event => { handleOnDrop(event, elementIndexOnPage + 1) })}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}>
                            <div id={surveyJSElement?.id} ref={(surveyJSElement?.id === newElementId) ? newElementRef : undefined} >
                                {questionTopBarComponent}
                                {!hiddenElements.includes(surveyJSElement?.id) && <div>
                                    <Box sx={{
                                        backgroundColor: `${theme.palette.shades.white50} !important`,
                                        borderRadius: "0px 0px 12px 12px !important",
                                    }}>
                                        {titleComponent}
                                        {exampleComponent}
                                    </Box>
                                </div>}
                                <div style={{ height: 20 }}></div>
                            </div>
                        </div>
                    )}
                </Draggable>
            return component;

        }
        )
        if (window.MathJax) window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub])

        if (newElementRef.current) {
            // If newElementRef exists, scroll to this element 
            newElementRef.current.scrollIntoView({ behavior: 'smooth' });
            // Set NewElementId to undefined, to prevent scrolling during next rendering
            setNewElementId(undefined)
        }

        return elementsComponents;
    }
    const getPagesNavigation = () => {

        return <Grid container sx={{ height: '48px', alignItems: 'center' }}>
            <Typography sx={{ ...theme.typography.h5, textAlign: 'left', pr: '36px', }}>
                {t("Pages")}
            </Typography>


            <ESvgIcon sx={{ cursor: "pointer", mr: '12px' }} onClick={() => { if (currentPageNumber > 1) setCurrentPageNumber(currentPageNumber - 1) }} viewBox="14 14 20 20" component={BackIcon} />


            {creatorRef.survey.pages.map((_, i) => {
                let pageNumber = i + 1
                return (
                    <EIconButton
                        sx={{ mx: '2px' }}
                        onMouseOver={(event) => {
                            if (draggedElement) {
                                let sourceElement = creatorRef?.survey?.getQuestionByName(draggedElement.draggableId)

                                let destinationPage = creatorRef?.survey?.pages[pageNumber - 1]
                                sourceElement.moveTo(destinationPage)

                                setCurrentPageNumber(pageNumber)

                            }
                        }}
                        onDragOver={(event) => { event.preventDefault(); setCurrentPageNumber(pageNumber) }}
                        onClick={(event) => {
                            if (pageNumber === currentPageNumber) {
                                openPageMenu(event);
                            }
                            else setCurrentPageNumber(pageNumber)


                        }}
                        key={pageNumber}
                        size="small"
                        color={pageNumber === currentPageNumber ? "primary" : "secondary"}
                    >
                        {i + 1}
                    </EIconButton>
                )

            })}
            <EIconButton
                sx={{ mx: '2px' }}
                size="small" variant="contained" color="secondary">
                <ESvgIcon onClick={() => { creatorRef.addPage(); setCurrentPageNumber(creatorRef.survey.pages.length) }} viewBox="0 0 32 32" component={AddIcon} />
            </EIconButton>

            <ESvgIcon sx={{ cursor: "pointer", ml: '12px' }} onClick={() => { if (currentPageNumber < (creatorRef.survey.pages.length)) setCurrentPageNumber(currentPageNumber + 1) }} viewBox="14 14 20 20" component={ForwardIcon} />


            <EMenu
                anchorEl={anchorPageButton}
                keepMounted
                open={Boolean(anchorPageButton)}
                onClose={closePageMenu}
            >
                <MenuItem
                    disabled={currentPageNumber === 1}
                    onClick={() => {
                        let pages = creatorRef.survey.pages
                        let currentPageIndex = currentPageNumber - 1
                        let currentPage = pages[currentPageIndex]
                        pages.splice(currentPageIndex, 1);
                        pages.splice(currentPageIndex - 1, 0, currentPage);
                        setCurrentPageNumber(currentPageNumber - 1)
                        closePageMenu()
                    }
                    }>{t("Move page to the left")}
                </MenuItem>
                <MenuItem
                    disabled={currentPageNumber === creatorRef.survey.pages.length}
                    onClick={() => {
                        let pages = creatorRef.survey.pages
                        let currentPageIndex = currentPageNumber - 1
                        let currentPage = pages[currentPageIndex]
                        pages.splice(currentPageIndex, 1);
                        pages.splice(currentPageIndex + 1, 0, currentPage);
                        setCurrentPageNumber(currentPageNumber + 1)
                        closePageMenu()
                    }
                    }>{t("Move page to the right")}
                </MenuItem>

                <MenuItem
                    disabled={(currentPageNumber === 1) && (creatorRef.survey.pages.length === 1)}
                    onClick={() => {
                        let pages = creatorRef.survey.pages
                        let currentPage = pages[currentPageNumber - 1]
                        creatorRef.survey.removePage(currentPage)
                        if (currentPageNumber > pages.length) setCurrentPageNumber(currentPageNumber - 1);
                        else creatorRef.survey.currentPage = pages[currentPageNumber - 1]

                        closePageMenu()
                    }
                    }>{t("Delate page")}
                </MenuItem>


            </EMenu>
        </Grid>

    }



    return (
        <Grid container sx={{ px: { xs: '8px', md: '16px' }, height: '100%', alignContent: 'flex-start' }}>
            <Grid container item xs={12}>
                {isMobileScreen && creatorRef && getPagesNavigation()}
            </Grid>

            <DragDropContext onDragStart={(element) => { setDraggedElement(element) }} onDragEnd={handleDragEnd}>
                <Droppable droppableId={`editor-droppable`}>
                    {(provided, snapshot) => (
                        <Grid item xs={12} sx={{ pb: 3, position: 'relative', overflowX: 'visible', overflowY: 'visible', height: 'calc(100% - 48px)', }} onDragOver={(event) => { event.preventDefault() }} onDrop={(event => { handleOnDrop(event); })} ref={provided.innerRef} {...provided.droppableProps}>
                            {!creatorRef?.survey?.pages[currentPageNumber - 1].elements.length &&
                                <Typography sx={{

                                    position: "absolute",
                                    top: "10px",
                                    fontSize: '14px',
                                    fontWeight: 300,
                                    fontStyle: 'italic',
                                    color: theme.palette.neutrals.almostBlack
                                }}>
                                    {t("Nothing was added yet ...")}
                                </Typography>

                            }

                            <Box id="hiddenCreatorElement" sx={hiddenCreatorElementStyles}></Box>
                            {creatorRef?.survey?.pages[currentPageNumber - 1].elements.length > 0 &&
                                <Box id="visibleCreatorElement" sx={{ height: '100%', overflowY: 'auto', }}>
                                    {getElementsComponents()}
                                    {provided.placeholder}
                                </Box>
                            }
                        </Grid>
                    )}
                </Droppable>
            </DragDropContext>

            {
                !isMobileScreen && <Grid item xs={12} sx={{ overflow: 'auto' }}>

                    <Divider sx={{
                        width: '100%',
                        backgroundColor: theme.palette.neutrals.white,
                        borderTopColor: theme.palette.neutrals.white
                    }} />
                    {!isMobileScreen && creatorRef && getPagesNavigation()}
                </Grid>
            }
        </Grid >
    );
};
