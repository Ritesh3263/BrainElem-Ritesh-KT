// Components for displaying single content element 
// They will replace all the SurveuJS elements used for the moment
// First they will be used only for readOnly preview/
// Then they will replace all active elements eg. during taking a test etc. 

import React, { lazy, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Contexts
import { baseURL } from "services/axiosSettings/axiosSettings";

//Services
import ContentService from "services/content.service";
import ResultService from "services/result.service";

// MUI v4
import { theme } from "MuiTheme";

// MUI v5
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

// Styled components
import ESelect from "styled_components/Select"
import ESlider from "new_styled_components/Slider/Slider.styled";
import ESvgIcon from "styled_components/SvgIcon"
import ESwitchWithTooltip from "styled_components/SwitchWithTooltip";

import { ECheckbox, ETextField, ERadioButton, EButton } from "styled_components";

import FileUpload from "components/common/File";
// Icons
import { ReactComponent as RatingIcon } from 'icons/content_factory/RatingIcon.svg';
import { ReactComponent as RatingBorderIcon } from 'icons/content_factory/RatingBorderIcon.svg';
import { ReactComponent as CheckIcon } from 'icons/content_factory/CheckIcon.svg';
import { ReactComponent as CheckBorderIcon } from 'icons/content_factory/CheckBorderIcon.svg';
import { ReactComponent as RadioIcon } from 'icons/content_factory/RadioIcon.svg';
import { ReactComponent as RadioBorderIcon } from 'icons/content_factory/RadioBorderIcon.svg';
import { ReactComponent as MoveVerticallyIcon } from 'icons/icons_32/move_vertically.svg';
import { ReactComponent as ArrowDownIcon } from 'icons/icons_48/Arrow small D.svg';
import { ReactComponent as FileUploadIcon } from 'icons/icons_32/File_32.svg';
import { new_theme } from "NewMuiTheme";
import "./Element.scss";
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";


const ElementCorrectAnswerLabel = styled(Typography)({
    ...theme.typography.p,
    display: 'inline-block',
    paddingLeft: '16px',
    fontSize: '1rem',
    color: new_theme.palette.secondary.SLightGreen,
    fontWeight: '400'
})


// Universal component which will load proper element based on element type
// - element - element to display
// - value - seleceted value
// - setValue - function to set value
// - inline - optional - only for `file` and `attachment` if true file will be displayed inline
// - readOnly - is element read only
// - showAnswer - to show answer field
// - showCorrectAnswer - to show correct value
// - showPointsForCorrectAnswer -  to control the visibility of max points for element
// - elementPassPercentage - optional - when provided this value will be displayed in `points` section
// - showSettings - to control the visibility of settings of the element
export function Element({ element, value, setValue = () => { }, inline = false, readOnly = false, showInstruction = true, showAnswer = true, showCorrectAnswer = false, showPointsForCorrectAnswer = false, elementPassPercentage, showSettings = false }) {



    let instruction = element.title
    let type = element.subtype || element.type || element.getType()// getType will be removed with surveyJS

    // Correct value
    let correctValue = element.correctAnswer

    // Settings
    let settings = { locked: element.locked ?? false }
    // math-editor is no longer used - just to support older contents
    if (['text', 'editor', 'math-editor', 'dictation', 'blanks'].includes(type)) {
        settings.diacriticSensitive = element.diacriticSensitive ?? false
        settings.caseSensitive = element.caseSensitive ?? false
    }

    // Points
    let pointsForCorrectAnswer;
    if (showPointsForCorrectAnswer) {
        pointsForCorrectAnswer = element.pointsForCorrectAnswer
    }



    let properties = { instruction, showInstruction, settings, showSettings, value, setValue, readOnly, showAnswer, showCorrectAnswer, correctValue, pointsForCorrectAnswer, showPointsForCorrectAnswer, elementPassPercentage }

    if (type == 'expression') {// Editor
        return <ExpressionElement {...properties}></ExpressionElement>
    } else if (type == 'file') { // Help material
        return <FileElement {...properties} fileId={element.file} inline={inline} ></FileElement>
    } else if (type == 'boolean') { // True/False
        return <BooleanElement {...properties}></BooleanElement>
    } else if (type == 'radiogroup') {// Single select
        return <RadiogroupElement {...properties} choices={element.choices}   ></RadiogroupElement>
    } else if (type == 'checkbox') {// Multiselect
        return <CheckboxElement {...properties} choices={element.choices}   ></CheckboxElement>
    } else if (type == 'text') {// Single line answer
        return <TextElement {...properties} ></TextElement>
    } else if (type == 'editor' || type == 'math-editor') {// Multiline answer
        // math-editor is no longer used - just to support older contents
        return <EditorElement {...properties} ></EditorElement>

    } else if (type == 'dictation') {// Multiline answer
        return <DictationElement {...properties} fileId={element.file}   ></DictationElement>
    } else if (type == 'blanks') {// Blanks
        //Extract correct values from instructions - by default intructions is having correct answers inside
        correctValue = []

        var htmlObject = document.createElement('div');
        htmlObject.innerHTML = instruction;
        let blanks = htmlObject.getElementsByTagName("blank");// Find blank elements
        for (var i = 0; i < blanks.length; i++) {
            // Save correct answer - `name` -id of the blank /// title - correct answer
            correctValue.push({ name: blanks[i].id, title: blanks[i].innerHTML })
            // Remove correct value from instruction
            blanks[i].innerHTML = "";
        }

        return <BlanksElement {...properties}></BlanksElement>
    } else if (type == 'sortablelist') {
        return <SortablelistElement {...properties} choices={element.choices}   ></SortablelistElement>
    } else if (type == 'barrating') {
        return <BarratingElement {...properties} choices={element.choices}   ></BarratingElement>
    } else if (type == 'nouislider') {
        return <SliderElement {...properties} rangeMin={element.rangeMin} rangeMax={element.rangeMax}   ></SliderElement>
    } else if (type == 'datepicker') {
        return <DatepickerElement {...properties} ></DatepickerElement>
    } else if (type == 'attachment') {
        return <AttachmentElement {...properties} inline={inline}></AttachmentElement>
    } return <></>
}


// Universal label - used for each element
// - text - text for the label
function ElementLabel({ text }) {
    const { t } = useTranslation();
    return (<Typography sx={{ ...theme.typography.p, mt: '24px', mb: '8px', fontSize: '16px', color: new_theme.palette.neutrals.darkGrey }}>{text}</Typography>);
};

// Universal instructions - used for each element
// - instruction - html instruction
function ElementInstructions({ instruction }) {
    const { t } = useTranslation();

    return (
        <Box sx={{ pointerEvents: "none", mb: '24px' }} dangerouslySetInnerHTML={{ __html: `<div style='overflow: auto;'>${instruction}</div>` }}></Box>
    );
};


// Universal points for elements
// - ointsForCorrectAnswer - max points for correct answer
// - elementPassPercentage - when provided it will display additional info about pass
function ElementPointsForCorrectAnswer({ pointsForCorrectAnswer, elementPassPercentage }) {
    const { t } = useTranslation();

    const getPoints = () => {
        let p = pointsForCorrectAnswer == undefined ? 1 : pointsForCorrectAnswer
        if (p == 1) return `${p} ${t("point")}`
        else return `${p} ${t("points")}`
    }

    const getPassThresholdPoints = () => {
        let p = pointsForCorrectAnswer == undefined ? 1 : pointsForCorrectAnswer
        let threshold = p * parseFloat(elementPassPercentage) / 100
        if (threshold == 1) return `${p} ${t("point")}`
        else return `${threshold} ${t("points")}`
    }
    return (
        <Box>
            <ElementLabel text={t("Points")}></ElementLabel>
            <Typography sx={{ ...theme.typography.p, fontSize: '16px', color: theme.palette.neutrals.darkestGrey }}>
                {`${t('Maxiumum points for correct answer')}: ${getPoints()}`}
            </Typography>
            {elementPassPercentage !== undefined && <>
                <Typography sx={{ ...theme.typography.p, mt: '16px', mb: '4px', fontSize: '14px', color: theme.palette.neutrals.darkestGrey }}>{t('Info') + ":"}</Typography>
                <Typography sx={{ ...theme.typography.p, fontWeight: '300', fontSize: '14px', color: theme.palette.neutrals.darkestGrey }}>{t('The pass threshold for this question is') + ` ${getPassThresholdPoints()} ` + t(' and was calculated based on the assigned grading scale') + ` (${elementPassPercentage}%)`}</Typography>
            </>}
        </Box>
    );
};

function RateAnswer(){
    const { t } = useTranslation();
    const [defaultSet, setDefaultSet] = useState("")
    const handlechange = (event) =>{
        setDefaultSet(event.target.value);
    }
    return (
        <Box sx={{maxWidth: '200px', mb: 1}}>
            <FormControl margin="dense" fullWidth={true} variant="filled" className="formcontrol_element">
                <InputLabel id="demo-simple-select-label">{t("Rate answer")}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={defaultSet}
                    label={t("Rate answer")}
                    onChange={handlechange}
                >
                    <MenuItem value="pass">Passed</MenuItem>
                    <MenuItem value="fail">Fail</MenuItem>
                </Select>
            </FormControl>
        </Box>
    )
}


// Universal settings - used for text elements
// - settings - settings
function ElementSettings({ settings }) {
    const { t } = useTranslation();

    return (
        <Box sx={{ '& .MuiBox-root': { fontSize: '16px' }, boxShadow: 'none' }}>
            <Accordion>
                <AccordionSummary
                    expandIcon={<StyledEIconButton color="primary" size="medium"><ExpandMoreIcon /></StyledEIconButton>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant="body1" component="p" sx={{fontWeight: '700', color: new_theme.palette.newSupplementary.NSupText}}>{t("Options")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {settings.caseSensitive !== undefined && <ESwitchWithTooltip name={t("Case sensitive")} description={t("Defines whether uppercase(eg. A,B,C) and lowercase(a,b,c) letters are treated as distinct when comparing to correct answer.  For instance, when this is enabled words `dog` and `Dog` are treated as distinct, so using one instead of another will be treated as a mistake.")} checked={settings.caseSensitive} onChange={() => { }} disabled={true}></ESwitchWithTooltip>}
                    {settings.diacriticSensitive !== undefined && <ESwitchWithTooltip name={t("Diacritic sensitive")} description={t("Defines whether letters with diacritical marks(eg. ç,é,â) and without them(eg. c,e,a) are treated as distinct when comparing to correct answer. For instance, when this is enabled words `après` and `apres` are treated as distinct, so using one instead of another will be treated as a mistake.")} checked={settings.diacriticSensitive} onChange={() => { }} disabled={true}></ESwitchWithTooltip>}
                    {settings.locked !== undefined && <ESwitchWithTooltip name={t("Hide/Lock element")} description={t("Locked elements will be hidden from the students during display. This function is used to control the visibility of elements and reveal elements one by one.")} checked={settings.locked} onChange={() => { }} disabled={true}></ESwitchWithTooltip>}
                </AccordionDetails>
            </Accordion>
            {/* <ElementLabel text={t("Settings")}></ElementLabel>
            {settings.caseSensitive !== undefined && <ESwitchWithTooltip name={t("Case sensitive")} description={t("Defines whether uppercase(eg. A,B,C) and lowercase(a,b,c) letters are treated as distinct when comparing to correct answer.  For instance, when this is enabled words `dog` and `Dog` are treated as distinct, so using one instead of another will be treated as a mistake.")} checked={settings.caseSensitive} onChange={() => { }} disabled={true}></ESwitchWithTooltip>}
            {settings.diacriticSensitive !== undefined && <ESwitchWithTooltip name={t("Diacritic sensitive")} description={t("Defines whether letters with diacritical marks(eg. ç,é,â) and without them(eg. c,e,a) are treated as distinct when comparing to correct answer. For instance, when this is enabled words `après` and `apres` are treated as distinct, so using one instead of another will be treated as a mistake.")} checked={settings.diacriticSensitive} onChange={() => { }} disabled={true}></ESwitchWithTooltip>}
            {settings.locked !== undefined && <ESwitchWithTooltip name={t("Hide/Lock element")} description={t("Locked elements will be hidden from the students during display. This function is used to control the visibility of elements and reveal elements one by one.")} checked={settings.locked} onChange={() => { }} disabled={true}></ESwitchWithTooltip>} */}
        </Box>
    );
};




// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// Full Editor element
// - instruction - html do display
export function ExpressionElement({ instruction, showInstruction, settings, showSettings }) {
    return (<>
        {showInstruction && <ElementInstructions instruction={instruction}></ElementInstructions>}
        {showSettings && <ElementSettings settings={settings}></ElementSettings>}
    </>)
};

// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// Full File element
// - instruction - html do display
export function FileElement({ instruction, showInstruction, settings, showSettings, fileId, readOnly, inline = false }) {
    const { t } = useTranslation();
    const [fileComponent, setFileComponent] = useState()
    const [fileDetails, setFileDetails] = useState()
    const [fileUrl, setFileUrl] = useState()

    const loadFile = async (fileId) => {
        try {
            let response = await ContentService.getFileDetails(fileId)
            setFileDetails(response.data)
            setFileUrl(`${baseURL}contents/files/download/${fileId}`)

            let mimeType = response.data.mimeType
            let name = response.data.fileOriginalName
            let url = `${baseURL}contents/files/download/${fileId}`

            let component = await ContentService.getFileElement(name, url, mimeType, inline)
            setFileComponent(component)

        } catch (error) {
            console.log('Could not fetch the file', error)
            setFileDetails(undefined)
            setFileUrl(undefined)
            setFileComponent(undefined)
        }
    }

    useEffect(() => {
        loadFile(fileId)
    }, [fileId])

    return (<>
        {showInstruction && <>
            {/* {instruction && <>
                <ElementLabel text={t("Instructions")}></ElementLabel>
                <ElementInstructions instruction={instruction}></ElementInstructions>
            </>} */}
            {fileComponent && <ElementLabel text={t("File")}></ElementLabel>}
            {fileComponent ?? <></>}
        </>}
        {showSettings && <ElementSettings settings={settings}></ElementSettings>}
    </>);
};



// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// Boolean answer
export function BooleanAnswer({ value, setValue = () => { }, readOnly = false, showCorrectAnswer = false, correctValue = undefined }) {
    const { t } = useTranslation();
    return (<>
        <Box sx={readOnly ? { pointerEvents: "none" } : {}}>


            <RadioGroup sx={{ '& .MuiFormControlLabel-root': { mb: 0, ml: '-9px' }, '& .MuiButtonBase-root rect': { fill: 'transparent' } }}>
                <FormControlLabel value={true} label={<>
                    <Box sx={{ display: 'inline-block', ...theme.typography.p, fontSize: '1rem' }}>{t("True")}</Box>
                    {showCorrectAnswer && correctValue === true && <ElementCorrectAnswerLabel>{t("Correct")}</ElementCorrectAnswerLabel>}
                </>}
                    control={
                        <ERadioButton
                            sx={{width: '40px', height: '40px'}}
                            checked={value === true}
                            onChange={() => {
                                if (value === true) setValue(undefined)
                                else setValue(true)
                            }}
                            icon={<RadioBorderIcon />}
                            checkedIcon={<RadioIcon />}
                        ></ERadioButton>
                    }
                />

                <FormControlLabel value={false} label={<>
                    <Box sx={{ display: 'inline-block', ...theme.typography.p, fontSize: '1rem' }}>{t("False")}</Box>
                    {showCorrectAnswer && correctValue === false && <ElementCorrectAnswerLabel>{t("Correct")}</ElementCorrectAnswerLabel>}
                </>}
                    control={
                        <ERadioButton
                        sx={{width: '40px', height: '40px'}}
                            checked={value === false}
                            onChange={() => {
                                if (value === false) setValue(undefined)
                                else setValue(false)
                            }}
                            icon={<RadioBorderIcon />}
                            checkedIcon={<RadioIcon />}
                        ></ERadioButton>}
                />

            </RadioGroup>
        </Box>

    </>
    );
};
// Full Boolean element
export function BooleanElement({ instruction, showInstruction, settings, showSettings, value, setValue = () => { }, readOnly = false, showAnswer = true, showCorrectAnswer = false, correctValue = undefined, pointsForCorrectAnswer, showPointsForCorrectAnswer, elementPassPercentage }) {
    const { t } = useTranslation();
    return (<>
        {showInstruction && <>
            <ElementLabel text={t("Instructions")}></ElementLabel>
            <ElementInstructions instruction={instruction}></ElementInstructions>
        </>}
        {showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <BooleanAnswer value={correctValue} correctValue={correctValue} showCorrectAnswer={true} readOnly={true}></BooleanAnswer>
            {/* {showPointsForCorrectAnswer && <ElementPointsForCorrectAnswer pointsForCorrectAnswer={pointsForCorrectAnswer} elementPassPercentage={elementPassPercentage} />} */}
            {showSettings && <ElementSettings settings={settings}></ElementSettings>}
        </>}
        {!showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <Box sx={{backgroundColor: new_theme.palette.primary.PLGrey, padding: '8px', mb: 2, mt: 2}}>
                <Typography variant="body4" component="span">{t("Correct Answer wasn’t preselected. To add a correct")}</Typography> <Typography variant="body4" component="span" sx={{fontWeight: '700', color: new_theme.palette.primary.MedPurple}}>{t("edit the question inside Content Factory ")}</Typography>
            </Box>
        </>}
        {showAnswer && <>
            <ElementLabel text={t("User's Answer")}></ElementLabel>
            <RateAnswer />
            <BooleanAnswer value={value} setValue={setValue} readOnly={readOnly}></BooleanAnswer>
        </>}
    </>
    );
};


// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// Radiogroup answer
// ---------- -----
// choice - the name of choice
export function RadiogroupAnswer({ choices, value, setValue = () => { }, readOnly = false, showAnswer = true, showCorrectAnswer = false, correctValue = undefined, pointsForCorrectAnswer, showPointsForCorrectAnswer, elementPassPercentage }) {
    const { t } = useTranslation();

    // Choices migh be strings or objects
    choices = choices.map(ch=>{
        if (ch?.value) return ch.value
        else return ch
    })

    return (<>
        {choices.map((choice, index) =>
            <Box key={choice} sx={readOnly ? { pointerEvents: "none" } : {}}>
                <FormControlLabel
                    label={<>
                        <Box sx={{ display: 'inline-block', ...theme.typography.p, fontSize: '18px' }}>{choice}</Box>
                        {showCorrectAnswer && correctValue === choice && <ElementCorrectAnswerLabel>{t("Correct")}</ElementCorrectAnswerLabel>}
                    </>}
                    control={
                        <ERadioButton
                            sx={{width: '40px', height: '40px'}}
                            checked={value == choice}
                            onChange={() => {
                                if (value == choice) setValue(undefined)
                                else setValue(choice)
                            }}
                            icon={<RadioBorderIcon />}
                            checkedIcon={<RadioIcon />}
                        ></ERadioButton>}>

                </FormControlLabel>
            </Box>
        )}
    </>

    );
};
// Radiogroup Element
// -----
// choices - the choices to select
export function RadiogroupElement({ instruction, showInstruction, settings, showSettings, choices, value, setValue = () => { }, readOnly = false, showAnswer = true, showCorrectAnswer = false, correctValue = undefined, pointsForCorrectAnswer, showPointsForCorrectAnswer, elementPassPercentage }) {
    const { t } = useTranslation();
    return (<Box sx={{ '& .MuiFormControlLabel-root': { mb: 0, ml: '-9px' }, '& .MuiButtonBase-root rect': { fill: 'transparent' } }}>
        {showInstruction && <>
            <ElementLabel text={t("Instructions")}></ElementLabel>
            <ElementInstructions instruction={instruction}></ElementInstructions>
        </>}
        {showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <RadiogroupAnswer choices={choices} value={correctValue} setValue={setValue} correctValue={correctValue} showCorrectAnswer={true} readOnly={true}></RadiogroupAnswer>
            {/* {showPointsForCorrectAnswer && <ElementPointsForCorrectAnswer pointsForCorrectAnswer={pointsForCorrectAnswer} elementPassPercentage={elementPassPercentage} />} */}
            {showSettings && <ElementSettings settings={settings}></ElementSettings>}
        </>}
        {!showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <Box sx={{backgroundColor: new_theme.palette.primary.PLGrey, padding: '8px', mb: 2, mt: 2}}>
                <Typography variant="body4" component="span">{t("Correct Answer wasn’t preselected. To add a correct")}</Typography> <Typography variant="body4" component="span" sx={{fontWeight: '700', color: new_theme.palette.primary.MedPurple}}>{t("edit the question inside Content Factory ")}</Typography>
            </Box>
        </>}
        {showAnswer && <>
            <ElementLabel text={t("User’s Answer")}></ElementLabel>
            <RateAnswer />
            <RadiogroupAnswer choices={choices} value={value} setValue={setValue} readOnly={readOnly}></RadiogroupAnswer>
        </>}
    </Box>
    );
};




// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// Checkbox  answer
export function CheckboxAnswer({ choices, value = [], setValue = () => { }, readOnly = false, showCorrectAnswer, correctValue = [] }) {
    const { t } = useTranslation();

    // Choices migh be strings or objects
    choices = choices.map(ch=>{
        if (ch?.value) return ch.value
        else return ch
    })

    return (
        <>
            {choices.map((choice, index) =>
                <Box key={index} sx={readOnly ? { pointerEvents: "none" } : {}}>
                    <FormControlLabel
                        label={<>
                            <Box sx={{ display: 'inline-block', ...theme.typography.p, fontSize: '18px' }}>{choice}</Box>
                            {showCorrectAnswer && correctValue.includes(choice) && <ElementCorrectAnswerLabel>{t("Correct")}</ElementCorrectAnswerLabel>}
                        </>}
                        control={
                            <ECheckbox sx={{ '&.Mui-checked': { "&:after": { background: "transparent" } }, width: '40px' }}
                                checked={value?.includes(choice)}
                                onChange={() => {
                                    if (value?.includes(choice)) setValue(value?.filter(v => v != choice))//unselect
                                    else setValue([...value, choice])//select
                                }}
                                icon={<CheckBorderIcon />}
                                checkedIcon={<CheckIcon />}
                            ></ECheckbox>}>
                    </FormControlLabel>
                </Box>
            )}
        </>
    );
};
// Full Checkbox element
export function CheckboxElement({ instruction, showInstruction, settings, showSettings, choices, value, setValue = () => { }, readOnly = false, showAnswer = true, showCorrectAnswer = false, correctValue = undefined, pointsForCorrectAnswer, showPointsForCorrectAnswer, elementPassPercentage }) {
    const { t } = useTranslation();
    return (<Box sx={{ '& .MuiFormControlLabel-root': { mb: 0, ml: '-9px' }, '& .MuiButtonBase-root rect': { fill: 'transparent' } }}>
        {showInstruction && <>
            <ElementLabel text={t("Instructions")}></ElementLabel>
            <ElementInstructions instruction={instruction}></ElementInstructions>
        </>}
        {showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <CheckboxAnswer choices={choices} value={correctValue} setValue={setValue} correctValue={correctValue} showCorrectAnswer={true} readOnly={true}></CheckboxAnswer>
            {/* {showPointsForCorrectAnswer && <ElementPointsForCorrectAnswer pointsForCorrectAnswer={pointsForCorrectAnswer} elementPassPercentage={elementPassPercentage} />} */}
            {showSettings && <ElementSettings settings={settings}></ElementSettings>}
        </>}
        {!showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <Box sx={{backgroundColor: new_theme.palette.primary.PLGrey, padding: '8px', mb: 2, mt: 2}}>
                <Typography variant="body4" component="span">{t("Correct Answer wasn’t preselected. To add a correct")}</Typography> <Typography variant="body4" component="span" sx={{fontWeight: '700', color: new_theme.palette.primary.MedPurple}}>{t("edit the question inside Content Factory ")}</Typography>
            </Box>
        </>}
        {showAnswer && <>
            <ElementLabel text={t("User's Answer")}></ElementLabel>
            <RateAnswer />
            <CheckboxAnswer choices={choices} value={value} setValue={setValue} readOnly={readOnly}></CheckboxAnswer>
        </>}
        

    </Box>
    );
};


// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// Text answer - single line 
export function TextAnswer({ value = '', setValue = () => { }, readOnly = false }) {
    const { t } = useTranslation();
    return (
        <Box sx={readOnly ? { pointerEvents: "none" } : {}}>
            <ETextField label={t("Answer")} value={value} onChange={(event) => { setValue(event.target.value) }} />
        </Box>

    );
};


// Full Text element
export function TextElement({ instruction, showInstruction, settings, showSettings, value, setValue = () => { }, readOnly = false, showAnswer = true, showCorrectAnswer = false, correctValue = undefined, pointsForCorrectAnswer, showPointsForCorrectAnswer, elementPassPercentage }) {
    const { t } = useTranslation();
    return (<>
        {showInstruction && <>
            <ElementLabel text={t("Instructions")}></ElementLabel>
            <ElementInstructions instruction={instruction}></ElementInstructions>
        </>}
        {showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <TextAnswer value={correctValue} setValue={setValue} readOnly={true}></TextAnswer>
            {/* {showPointsForCorrectAnswer && <ElementPointsForCorrectAnswer pointsForCorrectAnswer={pointsForCorrectAnswer} elementPassPercentage={elementPassPercentage} />} */}
            {showSettings && <ElementSettings settings={settings}></ElementSettings>}
        </>}
        {!showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <Box sx={{backgroundColor: new_theme.palette.primary.PLGrey, padding: '8px', mb: 2, mt: 2}}>
                <Typography variant="body4" component="span">{t("Correct Answer wasn’t preselected. To add a correct")}</Typography> <Typography variant="body4" component="span" sx={{fontWeight: '700', color: new_theme.palette.primary.MedPurple}}>{t("edit the question inside Content Factory ")}</Typography>
            </Box>
        </>}
        {showAnswer && <>
            <ElementLabel text={t("User's Answer")}></ElementLabel>
            <RateAnswer />
            <TextAnswer value={value} setValue={setValue} readOnly={readOnly}></TextAnswer>
        </>}
        
    </>
    );
};


// SETTING NEW VALUE IS NOT IMPLEMENTED FOR THIS ELEMENT _ TODO
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// Editor answer
export function EditorAnswer({ value = '', setValue = () => { }, readOnly = false }) {
    const { t } = useTranslation();
    const [editorId, setEditorId] = useState()

    useEffect(() => {
        var id = "id" + Math.random().toString(16).slice(2)
        setEditorId(id)
    }, [])

    useEffect(() => {
        let instance = window.CKEDITOR.instances[editorId]
        if (instance) instance.setData(value)
    }, [value])

    useEffect(() => {
        if (editorId) {
            const CKEDITOR = window.CKEDITOR

            let configuration = {
                height: 100,
                toolbar: "Basic",
                readOnly: readOnly ? 'true' : 'false'
            };
            CKEDITOR.replace(editorId, configuration);
            CKEDITOR.instances[editorId].on('change', function () {
                let data = CKEDITOR.instances[editorId].getData();
                if (data !== value) setValue(data)
            });
        }
        return () => {
            if (window.CKEDITOR.instances[editorId]) window.CKEDITOR.instances[editorId].destroy();
        }

    }, [editorId])

    return (
        <textarea id={editorId} name={editorId} style={{ width: "100%" }} rows="6" defaultValue={value} ></textarea>
    );
};


// Full Editor element
export function EditorElement({ instruction, showInstruction, settings, showSettings, value, setValue = () => { }, readOnly = false, showAnswer = true, showCorrectAnswer = false, correctValue = undefined, pointsForCorrectAnswer, showPointsForCorrectAnswer, elementPassPercentage }) {
    const { t } = useTranslation();
    return (<>
        {showInstruction && <>
            <ElementLabel text={t("Instructions")}></ElementLabel>
            <ElementInstructions instruction={instruction}></ElementInstructions>
        </>}
        {showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <EditorAnswer value={correctValue} setValue={setValue} readOnly={true}></EditorAnswer>
            {/* {showPointsForCorrectAnswer && <ElementPointsForCorrectAnswer pointsForCorrectAnswer={pointsForCorrectAnswer} elementPassPercentage={elementPassPercentage} />} */}
            {showSettings && <ElementSettings settings={settings}></ElementSettings>}
        </>}
        {!showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <Box sx={{backgroundColor: new_theme.palette.primary.PLGrey, padding: '8px', mb: 2, mt: 2}}>
                <Typography variant="body4" component="span">{t("Correct Answer wasn’t preselected. To add a correct")}</Typography> <Typography variant="body4" component="span" sx={{fontWeight: '700', color: new_theme.palette.primary.MedPurple}}>{t("edit the question inside Content Factory ")}</Typography>
            </Box>
        </>}
        {showAnswer && <>
            <ElementLabel text={t("User's Answer")}></ElementLabel>
            <RateAnswer />
            <EditorAnswer value={value} setValue={setValue} readOnly={readOnly}></EditorAnswer>
        </>}
    </>
    );
};

// SETTING NEW VALUE IS NOT IMPLEMENTED FOR THIS ELEMENT _ TODO
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// Dictation answer
export function DictationAnswer({ value = '', setValue = () => { }, readOnly = false }) {
    const { t } = useTranslation();

    return (
        <div style={readOnly ? { pointerEvents: "none" } : {}}>
            <textarea id={'dictation'} style={{ width: "100%" }} value={value} onChange={(event) => setValue(event.target.value)} rows="6" ></textarea>
        </div>
    );
}

// Full Dictation element
export function DictationElement({ instruction, showInstruction, settings, showSettings, value, fileId, setValue = () => { }, readOnly = false, showAnswer = true, showCorrectAnswer = false, correctValue = undefined, pointsForCorrectAnswer, showPointsForCorrectAnswer, elementPassPercentage }) {
    const { t } = useTranslation()

    const getTextDifferences = () => {
        if (!value) return correctValue
        else return ContentService.getTextDifferences(value, correctValue)
    }

    return (<>
        {showInstruction && <>
            <ElementLabel text={t("Instructions")}></ElementLabel>
            <ElementInstructions instruction={instruction}></ElementInstructions>
        </>}
        {fileId && <>
            <ElementLabel text={t("Audio file")}></ElementLabel>
            <audio controls style={{ maxWidth: '100%' }}>
                <source src={`${baseURL}contents/files/download/${fileId}`} />
                <p><a href={`${baseURL}contents/files/download/${fileId}`}>{t("Download the audio file")}</a></p>
            </audio>
        </>}
        {showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            {/* <DictationAnswer value={correctValue} setValue={setValue} readOnly={true}></DictationAnswer> */}
            <Box sx={{ border: '1px solid black', background: 'white', padding: '15px', minHeight: '150px' }} dangerouslySetInnerHTML={{ __html: getTextDifferences() }}></Box>
            {/* {showPointsForCorrectAnswer && <ElementPointsForCorrectAnswer pointsForCorrectAnswer={pointsForCorrectAnswer} elementPassPercentage={elementPassPercentage} />} */}
            {showSettings && <ElementSettings settings={settings}></ElementSettings>}
        </>}
        {!showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <Box sx={{backgroundColor: new_theme.palette.primary.PLGrey, padding: '8px', mb: 2, mt: 2}}>
                <Typography variant="body4" component="span">{t("Correct Answer wasn’t preselected. To add a correct")}</Typography> <Typography variant="body4" component="span" sx={{fontWeight: '700', color: new_theme.palette.primary.MedPurple}}>{t("edit the question inside Content Factory ")}</Typography>
            </Box>
        </>}

        {showAnswer && <>
            <ElementLabel text={t("User's Answer")}></ElementLabel>
            <RateAnswer />
            <DictationAnswer value={value} setValue={setValue} readOnly={readOnly}></DictationAnswer>
        </>}



    </>
    );
};

// SETTING NEW VALUE IS NOT IMPLEMENTED FOR THIS ELEMENT _ TODO
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########

const BlanksStyles = {

    '& blank': {
        textAlign: 'center',
        caretColor: 'black !important',
        verticalAlign: 'middle',
        minWidth: '70px !important',
        height: '20px',
        lineHeight: '20px',
    },
    '& blank:focus': {
        backgroundColor: theme.palette.secondary.ui
    },
    '& .blanks .sv-question__content': {
        display: 'none !important'
    },

}


// Blanks answer
export function BlanksAnswer({ instruction, showInstruction, value = [], setValue = () => { }, settings, readOnly = false, correctValue, showCorrectAnswer, showColors }) {
    const { t } = useTranslation();
    const [editorValue, setEditorValue] = useState()

    useEffect(() => {

        if (showCorrectAnswer || showColors) {
            var htmlObject = document.createElement('div');
            htmlObject.innerHTML = instruction;
            let blanks = htmlObject.getElementsByTagName("blank");
            for (var i = 0; i < blanks.length; i++) {
                let correctAnswer;

                // For results - correctValue is array of vaulues
                if (Array.isArray(correctValue)) correctAnswer = correctValue.find(v => v.name == blanks[i].id)?.title ?? ""
                else correctAnswer = correctValue[blanks[i].id] ?? ""
                if (showCorrectAnswer) {
                    blanks[i].innerHTML = correctAnswer
                } else if (showColors) { // show colors for answers
                    let userAnswer = value.find(v => v.name == blanks[i].id)?.title ?? ""
                    blanks[i].innerHTML = userAnswer
                    if (userAnswer) {
                        let isCorrect = ContentService.isTextAnswerCorrect(settings, userAnswer, correctAnswer)

                        if (isCorrect) blanks[i].style.background = '#0080004a'
                        else blanks[i].style.background = '#ff3333'
                    }
                }
            }
            setEditorValue(htmlObject.innerHTML)

        } else setEditorValue(instruction)
    }, [value, correctValue])

    return (
        <Box sx={BlanksStyles}>
            <Box sx={{ pointerEvents: readOnly ? "none" : "" }} dangerouslySetInnerHTML={{ __html: `<div style='overflow: auto;'>${editorValue}</div>` }}></Box>
        </Box>
    );
};


// Full Blanks element
export function BlanksElement({ instruction, showInstruction, value, setValue = () => { }, settings, showSettings, readOnly = false, showAnswer = true, showCorrectAnswer = false, correctValue = undefined, pointsForCorrectAnswer, showPointsForCorrectAnswer, elementPassPercentage }) {
    const { t } = useTranslation();



    return (<>
        {showInstruction && <>
            <ElementLabel text={t("Instructions")}></ElementLabel>
            <ElementInstructions instruction={t("Fill the blanks")}></ElementInstructions>
        </>}
        {showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <BlanksAnswer instruction={instruction} setValue={setValue} settings={settings} readOnly={readOnly} correctValue={correctValue} showCorrectAnswer={true}></BlanksAnswer>
            {/* {showPointsForCorrectAnswer && <ElementPointsForCorrectAnswer pointsForCorrectAnswer={pointsForCorrectAnswer} elementPassPercentage={elementPassPercentage} />} */}
            {showSettings && <ElementSettings settings={settings}></ElementSettings>}

        </>}
        {!showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <Box sx={{backgroundColor: new_theme.palette.primary.PLGrey, padding: '8px', mb: 2, mt: 2}}>
                <Typography variant="body4" component="span">{t("Correct Answer wasn’t preselected. To add a correct")}</Typography> <Typography variant="body4" component="span" sx={{fontWeight: '700', color: new_theme.palette.primary.MedPurple}}>{t("edit the question inside Content Factory ")}</Typography>
            </Box>
        </>}
        {showAnswer && <>
            <ElementLabel text={t("User's Answer")}></ElementLabel>
            <RateAnswer />
            <BlanksAnswer instruction={instruction} value={value} setValue={setValue} settings={settings} readOnly={readOnly} correctValue={correctValue} showCorrectAnswer={false} showColors={true}></BlanksAnswer>
        </>}
        
    </>
    );
};

// SETTING NEW VALUE IS NOT IMPLEMENTED FOR THIS ELEMENT _ TODO
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// Sortablelist answer
export function SortablelistAnswer({ choices, value = [], setValue = () => { }, readOnly = false, showCorrectAnswer = false }) {
    const { t } = useTranslation();
    
    // Choices migh be strings or objects
    choices = choices.map(ch=>{
        if (ch?.value) return ch.value
        else return ch
    })

    return (<Box sx={readOnly ? { pointerEvents: "none" } : {}}>
        {showCorrectAnswer && !choices?.length && <Typography sx={{ ...theme.typography.p, fontSize: '16px' }}>{"Not provided"}</Typography>}
        {choices.map(choice =>
            <Grid key={choice} container sx={{ cursor: "grab", pl: '32px', mb: '8px', height: '48px', width: '100%', maxWidth: '320px', alignItems: 'center', borderRadius: '8px', background: theme.palette.neutrals.white, border: `1px solid ${theme.palette.neutrals.fadeViolet}`, boxShadow: `1px 0px 2px ${new_theme.palette.shades.box_shadow}` }}>
                <ESvgIcon viewBox="2 2 28 28" component={MoveVerticallyIcon} />
                <Typography sx={{ ...theme.typography.p, fontSize: '16px', pl: '8px' }}>{choice}</Typography>
            </Grid>
        )}
    </Box>
    );
};

// Full Sortablelist element
export function SortablelistElement({ instruction, showInstruction, settings, showSettings, choices, value, setValue = () => { }, readOnly = false, showAnswer = true, showCorrectAnswer = false, correctValue = [], pointsForCorrectAnswer, showPointsForCorrectAnswer, elementPassPercentage }) {
    const { t } = useTranslation();
    return (<Box>
        {showInstruction && <>
            <ElementLabel text={t("Instructions")}></ElementLabel>
            <ElementInstructions instruction={instruction}></ElementInstructions>
        </>}
        {showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <SortablelistAnswer choices={correctValue} value={value} setValue={setValue} readOnly={readOnly} showCorrectAnswer={true}></SortablelistAnswer>
            {/* {showPointsForCorrectAnswer && <ElementPointsForCorrectAnswer pointsForCorrectAnswer={pointsForCorrectAnswer} elementPassPercentage={elementPassPercentage} />} */}
            {showSettings && <ElementSettings settings={settings}></ElementSettings>}
        </>}
        {!showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <Box sx={{backgroundColor: new_theme.palette.primary.PLGrey, padding: '8px', mb: 2, mt: 2}}>
                <Typography variant="body4" component="span">{t("Correct Answer wasn’t preselected. To add a correct")}</Typography> <Typography variant="body4" component="span" sx={{fontWeight: '700', color: new_theme.palette.primary.MedPurple}}>{t("edit the question inside Content Factory ")}</Typography>
            </Box>
        </>}
        {showAnswer && <>
            <ElementLabel text={t("User's Answer")}></ElementLabel>
            <RateAnswer />
            <SortablelistAnswer choices={choices} value={value} setValue={setValue} readOnly={readOnly}></SortablelistAnswer>
        </>}
        
    </Box>
    );
};

// SETTING NEW VALUE IS NOT IMPLEMENTED FOR THIS ELEMENT _ TODO
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// Barrating answer
export function BarratingAnswer({ choices = [], value = [], setValue = () => { }, readOnly = false }) {
    const { t } = useTranslation();

    // Choices migh be strings or objects
    choices = choices.map(ch=>{
        if (ch?.value) return ch.value
        else return ch
    })

    return (
        <Box sx={readOnly ? { pointerEvents: "none", overflow: 'auto' } : { overflow: 'auto', }}>
            <Rating sx={{ background: theme.palette.neutrals.fadeViolet, pt: 1, borderRadius: "8px" }}
                icon={<RatingIcon fontSize="inherit" style={{ margin: "12px", height: '25px' }} />}
                emptyIcon={<RatingBorderIcon fontSize="inherit" style={{ margin: "12px", height: '25px' }} />}
                max={choices.length}
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            />
        </Box>
    );
};

// Full Barrating element
export function BarratingElement({ instruction, showInstruction, settings, showSettings, choices, value, setValue = () => { }, readOnly = false, showAnswer = true, showCorrectAnswer = false, correctValue = undefined, pointsForCorrectAnswer, showPointsForCorrectAnswer, elementPassPercentage }) {
    const { t } = useTranslation();
    return (<Box>
        {showInstruction && <>
            <ElementLabel text={t("Instructions")}></ElementLabel>
            <ElementInstructions instruction={instruction}></ElementInstructions>
        </>}
        {showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <BarratingAnswer choices={choices} value={correctValue} readOnly={true}></BarratingAnswer>
            {/* {showPointsForCorrectAnswer && <ElementPointsForCorrectAnswer pointsForCorrectAnswer={pointsForCorrectAnswer} elementPassPercentage={elementPassPercentage} />} */}
            {showSettings && <ElementSettings settings={settings}></ElementSettings>}
        </>}
        {!showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <Box sx={{backgroundColor: new_theme.palette.primary.PLGrey, padding: '8px', mb: 2, mt: 2}}>
                <Typography variant="body4" component="span">{t("Correct Answer wasn’t preselected. To add a correct")}</Typography> <Typography variant="body4" component="span" sx={{fontWeight: '700', color: new_theme.palette.primary.MedPurple}}>{t("edit the question inside Content Factory ")}</Typography>
            </Box>
        </>}
        {showAnswer && <>
            <ElementLabel text={t("User's Answer")}></ElementLabel>
            <RateAnswer />
            <BarratingAnswer choices={choices} value={value} setValue={setValue} readOnly={readOnly}></BarratingAnswer>
        </>}
        



    </Box>
    );
};


// SETTING NEW VALUE IS NOT IMPLEMENTED FOR THIS ELEMENT _ TODO
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// Slider answer

export function SliderAnswer({ rangeMin = 0, rangeMax = 100, value = 0, setValue = () => { }, readOnly = false, showAnswer = true, showCorrectAnswer = false, correctValue = undefined }) {
    const [marks, setMarks] = useState([])
    const [valueToDisplay, setValueToDisplay] = useState(0)

    useEffect(() => {
        if (!showCorrectAnswer) setValueToDisplay(value)
        else setValueToDisplay(correctValue)


        let mark1 = rangeMin + ((rangeMax - rangeMin) / 2)
        let mark2 = rangeMin + ((rangeMax - rangeMin) / 4)
        let mark3 = mark1 + ((rangeMax - rangeMin) / 4)


        setMarks([
            { value: rangeMin, label: rangeMin },
            { value: rangeMax, label: rangeMax },
            { value: mark1, label: mark1 },
            { value: mark2, label: mark2 },
            { value: mark3, label: mark3 }

        ])
    }, [value, correctValue])


    const { t } = useTranslation();
    if (!marks) return <></>
    return (<>
        <Box sx={{ px: 2, pointerEvents: readOnly ? "none" : "" }}>


            <ESlider
                sx={showCorrectAnswer && correctValue == undefined ? {'& .MuiSlider-thumb': {display: 'none'}} : {}}
                min={rangeMin}
                max={rangeMax}
                value={valueToDisplay}
                marks={marks}
                valueLabelDisplay={valueToDisplay!=undefined ? "on" : "off"} />
        </Box>
    </>
    );
};

// Full Slider element
export function SliderElement({ instruction, showInstruction, settings, showSettings, rangeMin, rangeMax, value, setValue = () => { }, readOnly = false, showAnswer = true, showCorrectAnswer = false, correctValue = undefined, pointsForCorrectAnswer, showPointsForCorrectAnswer, elementPassPercentage }) {
    const { t } = useTranslation();
    return (<>
        {showInstruction && <>
            <ElementLabel text={t("Instructions")}></ElementLabel>
            <ElementInstructions instruction={instruction}></ElementInstructions>
        </>}
        {showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <SliderAnswer rangeMin={rangeMin} rangeMax={rangeMax} value={value} readOnly={true} showCorrectAnswer={true} correctValue={correctValue}></SliderAnswer>
            {/* {showPointsForCorrectAnswer && <ElementPointsForCorrectAnswer pointsForCorrectAnswer={pointsForCorrectAnswer} elementPassPercentage={elementPassPercentage} />} */}
            {showSettings && <ElementSettings settings={settings}></ElementSettings>}
        </>}
        {!showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <Box sx={{backgroundColor: new_theme.palette.primary.PLGrey, padding: '8px', mb: 2, mt: 2}}>
                <Typography variant="body4" component="span">{t("Correct Answer wasn’t preselected. To add a correct")}</Typography> <Typography variant="body4" component="span" sx={{fontWeight: '700', color: new_theme.palette.primary.MedPurple}}>{t("edit the question inside Content Factory ")}</Typography>
            </Box>
        </>}
        {showAnswer && <>
            <ElementLabel text={t("User's Answer")}></ElementLabel>
            <RateAnswer />
            <SliderAnswer rangeMin={rangeMin} rangeMax={rangeMax} value={value} setValue={setValue} readOnly={readOnly}></SliderAnswer>
        </>}
        
    </>
    );
};

// SETTING NEW VALUE IS NOT IMPLEMENTED FOR THIS ELEMENT _ TODO
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// Datepicker answer
export function DatepickerAnswer({ value = '', setValue = () => { }, readOnly = false }) {
    const { t } = useTranslation();
    // Value to keep date in corrected format
    const [correctedValue, setCorrectedValue] = useState()


    // By deafult date is in format DD/MM/YYYY
    // For display I transform this value into DD/MM/YYYY
    useEffect(() => {
        let elements = value.split('/');
        if (elements.length == 3) {
            setCorrectedValue(elements[1] + '/' + elements[0] + '/' + elements[2])
        } else setCorrectedValue(value)
    }, [value])

    return (
        <Box sx={readOnly ? { pointerEvents: "none" } : {}}>
            <ESelect sx={{ width: "150px", display: 'inline' }}
                label={correctedValue ? correctedValue : t("Select date")}
                type="round"
                onClick={() => { console.log("OPEN CALENDAR - NOT IMPLEMENTED - TODO") }}
            >

            </ESelect>
        </Box>

    );
};


// Full Datepicker element
export function DatepickerElement({ instruction, showInstruction, settings, showSettings, value, setValue = () => { }, readOnly = false, showAnswer = true, showCorrectAnswer = false, correctValue = undefined, pointsForCorrectAnswer, showPointsForCorrectAnswer, elementPassPercentage }) {
    const { t } = useTranslation();
    return (<>
        {showInstruction && <>
            <ElementLabel text={t("Instructions")}></ElementLabel>
            <ElementInstructions instruction={instruction}></ElementInstructions>
        </>}
        {showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <DatepickerAnswer value={correctValue} setValue={setValue} readOnly={true} showAnswer={showAnswer} showCorrectAnswer={showCorrectAnswer} correctValue={correctValue}></DatepickerAnswer>
            {/* {showPointsForCorrectAnswer && <ElementPointsForCorrectAnswer pointsForCorrectAnswer={pointsForCorrectAnswer} elementPassPercentage={elementPassPercentage} />} */}
            {showSettings && <ElementSettings settings={settings}></ElementSettings>}
        </>}
        {!showCorrectAnswer && <>
            <ElementLabel text={t("Correct answer")}></ElementLabel>
            <Box sx={{backgroundColor: new_theme.palette.primary.PLGrey, padding: '8px', mb: 2, mt: 2}}>
                <Typography variant="body4" component="span">{t("Correct Answer wasn’t preselected. To add a correct")}</Typography> <Typography variant="body4" component="span" sx={{fontWeight: '700', color: new_theme.palette.primary.MedPurple}}>{t("edit the question inside Content Factory ")}</Typography>
            </Box>
        </>}
        {showAnswer && <>
            <ElementLabel text={t("User's Answer")}></ElementLabel>
            <RateAnswer />
            <DatepickerAnswer value={value} setValue={setValue} readOnly={readOnly}></DatepickerAnswer>
        </>}
        
    </>
    );
};


// SETTING NEW VALUE IS NOT IMPLEMENTED FOR THIS ELEMENT _ TODO
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// ########## ########## ########## ########## ##########
// Full Attachemt element

export function AttachmentElement({ instruction, showInstruction, settings, showSettings, value, setValue, showAnswer, readOnly, inline, pointsForCorrectAnswer, showPointsForCorrectAnswer, elementPassPercentage }) {
    const { t } = useTranslation();
    const [fileComponent, setFileComponent] = useState()
    const [fileDetails, setFileDetails] = useState()
    const [fileUrl, setFileUrl] = useState()

    const loadFile = async (fileId) => {
        try {
            let response = await ResultService.getFileDetails(fileId)
            setFileDetails(response.data)

            let mimeType = response.data.mimeType
            let name = response.data.fileOriginalName
            let url = `${baseURL}result/files/download/${fileId}`

            let component = await ContentService.getFileElement(name, url, mimeType, inline)
            setFileComponent(component)
        } catch (error) {
            setFileComponent(undefined)
            setFileDetails(undefined)
        }
    }

    useEffect(() => {
        if (value) loadFile(value)
    }, [value])

    return (<>
        {showInstruction && <>
            <ElementLabel text={t("Instructions")}></ElementLabel>
            <ElementInstructions instruction={instruction}></ElementInstructions>
        </>}
        {showAnswer && <>
            <ElementLabel text={t("Answer as file")}></ElementLabel>
            {/* FILE WAS UPLOADED AND SOMEONE IS DISPLAYING THE RESULTS */}
            {fileDetails && <>
                {fileComponent}
            </>}
            {!readOnly || !fileDetails && <Box sx={{ pointerEvents: readOnly ? "none" : "" }}>
                <FileUpload name={t("Uploaded file")} CustomIcon={<ESvgIcon viewBox="0 0 32 32" component={FileUploadIcon} />}
                    isPreview={readOnly}
                    value={value}
                    setValue={(file) => {
                        setValue(file._id)
                    }}
                    removeFunction={ResultService.removeFile}
                    uploadFunction={ResultService.uploadFile}
                    getFileDetailsFunction={ResultService.getFileDetails}
                />
            </Box>}
        </>}
        {/* {showPointsForCorrectAnswer && <ElementPointsForCorrectAnswer pointsForCorrectAnswer={pointsForCorrectAnswer} elementPassPercentage={elementPassPercentage} />} */}
        {showSettings && <ElementSettings settings={settings}></ElementSettings>}


    </>);
};
