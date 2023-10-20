// Component for displaying elements inside content
// It will replace the old surveyJS component(<Survey.Survey>) in DisplayContent and DisplayTestResults

import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";


// Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

//Services
import ContentService from "services/content.service";

//MUI v5
import { styled } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';
import Divider from "@mui/material/Divider"

// Universal element
import { Element } from "components/Content/Element"

// MUI v4
import { theme } from "MuiTheme";



const StyledContainer = styled(Grid)({
    padding: '16px 24px 16px 24px',
    borderRadius: '8px',
    background: theme.palette.neutrals.white
})

const StyledDivider = styled(Divider)(() => {
    return {

        marginBottom: '24px',
        background: theme.palette.neutrals.white,
        borderColor: theme.palette.neutrals.fadeViolet,
    }
})
// content - JSON object with the content
// result - optional - result of the user - to show answers
// showAnswer - to show answer
// showCorrectAnswer - to show correct values
// showSettings - to show settings for elements
// showPointsForCorrectAnswer - to show points for element
// singlePage - display elements from all pages on one page
// readOnly - can not interact with elements at all
// preview - preview mode means that result will not be saved
export default function Elements({ content, result, showAnswer=true, showCorrectAnswer, showSettings, showPointsForCorrectAnswer, singlePage = false, readOnly = false, preview = false, ...props }) {


    const [TMP, setTMP] = useState()
    const [currentPageNumber, setCurrentPageNumber] = useState(1)
    const { t } = useTranslation();
    const { F_handleSetShowLoader } = useMainContext();

    useEffect(() => {
        if (window.MathJax) window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub])
    }, [content])

    // Get header for the element
    const getElementHeader = (element) => {
        let name = t("Element")
        if (ContentService.canBeAnswered(element)) name = t("Question")

        return <>
            <Grid container alignItems='flex-end'>
                <Grid item xs={8}>
                    <Typography sx={{...theme.typography.p, fontSize: '18px',color: theme.palette.primary.darkViolet}}>{name+ " " +element.number}</Typography>
                </Grid>
                {/* <Grid xs={4} item>
                    {!props.isContentFactory && content.canExamine && <ESwitchWithTooltip name={t("Show to students")} fontSize="16px" checked={!question.locked} onChange={() => { question.locked ? unlockElement(content, question.name) : lockElement(content, question.name) }} />}
                </Grid> */}
            </Grid>
            <StyledDivider></StyledDivider>
        </>
    }

    // Get components for the elements 
    const getElementsComponents = () => {

        let elements = ContentService.getElements(content, singlePage, currentPageNumber)
        return <>{elements.map(element => {
            let value = TMP//null//result?.data <----------------------- TODO
            let setValue = setTMP
            return <Grid item xs={12} sx={{pb: '16px', height: '100%'}}>
                {getElementHeader(element)}
                <Element element={element} value={value} setValue={setValue} showCorrectAnswer={showCorrectAnswer} showSettings={showSettings} showPointsForCorrectAnswer={showPointsForCorrectAnswer} readOnly={readOnly}></Element>
            </Grid>


        })}</>
    }

    if (!content) return <></>
    return (
        <StyledContainer container {...props}>
            {getElementsComponents()}
        </StyledContainer>
    )
}