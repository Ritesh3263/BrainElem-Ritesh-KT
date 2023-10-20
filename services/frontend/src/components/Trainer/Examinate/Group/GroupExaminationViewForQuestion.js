import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next";

// Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


//Service
import EventService from "services/event.service"
import ContentService from "services/content.service";

// Universal element
import { Element } from "components/Content/Element"

// Styled components
import EIconButton from "styled_components/EIconButton";

import CommonExpandBar from 'components/common/ExpandBar'
import { ESelect } from "styled_components"
import EBadge from 'styled_components/Badge';
import ETable from 'styled_components/Table';

// MUI v5
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem';

// Icons
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as BackIcon } from 'icons/icons_48/Arrow small L.svg';


//MUI v4
import { theme } from "MuiTheme";

// Display questions results for group of users 
// Cases supported:
// 1. eventId - all results for content associated with the event - usefull in the program for the trainer
// 2. contentId - all results for content with provided contentId - usefull for the owner of the contnt to see all the people  who used his content  
// 3. contentId + groupId - results of the users in specific group for with provided contentId - usefull in the program for the trainer
export default function GroupExaminationViewForQuestion(props) {
    const { t } = useTranslation();
    const { eventId, contentId, groupId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    // Used to switch between table and element view
    const [isTableView, setIsTableView] = useState(false);


    // List of all elements within content
    const [elements, setElements] = useState(0);
    // Currently active element for preview
    const [activeElementIndex, setActiveElementIndex] = useState(0);
    // To control accordion with element
    const [showElement, setShowElement] = useState(true);
    // To control accordion for answers
    const [showAnswers, setShowAnswers] = useState({});


    const [tableData, setTableData] = useState({});

    const [activeTab, setActiveTab] = useState(0);
    const optionsBtn = [
        { id: 1, name: t("Download selected results") },
        { id: 2, name: t("Print selected results") },
        { id: 3, name: t("View the exam") }]
    const [event, setEvent] = useState();
    const [content, setContent] = useState();
    const [stats, setStats] = useState();

    const { F_getLocalTime, F_showToastMessage, F_formatSeconds, F_handleSetShowLoader } = useMainContext();

    function loadData() {
        F_handleSetShowLoader(true)
        if (eventId || props.eventId) {
            EventService.readForExamination(eventId ? eventId : props.eventId).then(res => {
                if (res.data) {
                    let data = res.data;
                    let stats = data.stats
                    let event = data.event
                    let content = event.assignedContent
                    setEvent(event)
                    setContent(content)
                    setStats(stats)
                    F_handleSetShowLoader(false)

                } else {
                    F_showToastMessage("Data is missing", 'error')
                    F_handleSetShowLoader(false)
                }
            }).catch(e => {
                console.log(e)
                F_showToastMessage("Could not load data", 'error')
                F_handleSetShowLoader(false)
            })
        }
        if (contentId || props.contentId) {

            ContentService.readForExamination(contentId ? contentId : props.contentId, groupId).then(res => {
                if (res.data) {
                    let data = res.data;
                    let stats = data.stats
                    let content = data.content
                    setContent(content)
                    setStats(stats)
                    F_handleSetShowLoader(false)

                } else {
                    F_showToastMessage("Data is missing", 'error')
                    F_handleSetShowLoader(false)
                }
            }).catch(e => {
                console.log(e)
                F_showToastMessage("Could not load data", 'error')
                F_handleSetShowLoader(false)
            })
        }
    }


    // Get points element from table data with status badge
    // This is stored in table data in oreder to avoid additional processing
    const getPointsElementForAttendee = (attendee) => {
        // Find it in the table data
        if (tableData?.rows) {
            let index = stats.attendees.findIndex(a => a._id == attendee._id)
            let row = tableData?.rows[index]
            let active = row.find(el => el.key == activeElementIndex)

            return active?.special
        }
    }

    // Prepare data for table
    const prepareTableData = () => {
        let header = [
            { key: 'first' },
            { key: 'all', verticalValue: t("All") }
        ];
        let totalMaxPoints = 0
        elements.forEach((element, index) => {
            // Name of element
            let name = t("Element")
            if (ContentService.canBeAnswered(element)) name = t("Question")
            name += ` ${index + 1}`
            name = <Box
                onClick={() => {
                    setActiveElementIndex(index)
                    setShowElement(true)
                    setIsTableView(false)
                }}
                sx={{ cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</Box>

            let pointsForCorrectAnswer = element.pointsForCorrectAnswer
            // By default pointsForCorrectAnswer is set to 1
            if (pointsForCorrectAnswer == undefined) pointsForCorrectAnswer = 1
            if (!ContentService.canBeAnswered(element)) pointsForCorrectAnswer = '-'
            else totalMaxPoints += pointsForCorrectAnswer
            if (pointsForCorrectAnswer != '-') pointsForCorrectAnswer += t('pkt')
            header.push({ key: index, verticalValue: name, value: pointsForCorrectAnswer })
        })

        let element = header.find(e => e.key == 'all')
        element.value = totalMaxPoints + t("pkt")



        var rows = []
        stats.attendees.forEach(attendee => {
            var row = [{ key: 'first', value: attendee.name + ' ' + attendee.surname }, { key: 'all' }]
            var totalScored = 0
            elements.forEach((element, index) => {

                // Latest result
                let result = attendee.results[0]
                // Data with all the users answers
                let data = result?.data
                let pointsForCorrectAnswer = element.pointsForCorrectAnswer
                // By default pointsForCorrectAnswer is set to 1
                if (pointsForCorrectAnswer == undefined) pointsForCorrectAnswer = 1

                if (!result) {
                    row.push({
                        key: index,
                        value: undefined,
                        // Used only for the main question view - this way I dont have to duplicate all the processing
                        special: <><EBadge ecolor={badgeColor} variant="dot" /><Typography sx={{ ...theme.typography.p, fontSize: '14px', px: '12px' }}>{t('No results')}</Typography></>,
                    })
                    return
                }
                else {
                    // Calculate how many points were scored by the user
                    var scored = ContentService.getScoredPointsForQuestion(element, data, result?.assignedPoints)

                    // badge has 3 colors:
                    // green - when points scored by the user are equal or above than ontent.gradingScale.passPercentage
                    // red - when points scored by the user are below content.gradingScale.passPercentage
                    // yellow - when a question does not have a correct answer provided and points were not assigned manually by the teacher 
                    var badgeColor;
                    if (!ContentService.canBeAnswered(element)) {
                        pointsForCorrectAnswer = '-'
                        scored = '-'
                    }
                    else if (scored == null) {
                        scored = '-'
                        badgeColor = 'warning'
                    } else {
                        // Total for all elements
                        totalScored += scored

                        // Get grading scale to check if question is passed
                        let gradingScale = event ? event.gradingScale : content.gradingScale
                        if (gradingScale) {
                            let passed = ContentService.isQuestionPassed(scored, pointsForCorrectAnswer, gradingScale)
                            if (passed) badgeColor = 'success'
                            else badgeColor = 'error'
                        } else badgeColor = 'warning'

                    }
                }

                row.push({
                    key: index,
                    value: <Grid container sx={{ alignItems: 'center', justifyContent: 'center' }}>
                        {badgeColor && <EBadge esize='small' ecolor={badgeColor} variant="dot" />}
                        <Typography sx={{ ...theme.typography.p, fontSize: '10px', pl: '5px' }}>{`${scored}`}</Typography>
                    </Grid>,
                    // Used only for the main question view - this way I dont have to duplicate all the processing
                    special: <>
                        {badgeColor && <EBadge ecolor={badgeColor} variant="dot" />}
                        <Typography sx={{ ...theme.typography.p, fontSize: '14px', px: '12px' }}>{`${scored}/${pointsForCorrectAnswer} ${t('points')}`}</Typography>
                    </>
                })

            })

            let allElement = row.find(e => e.key == "all")
            allElement.value = totalScored + t('pkt')
            allElement.forSorting = totalScored

            rows.push(row)

        })


        return { header: header, rows: rows }

    }


    useEffect(() => {
        loadData()
    }, [eventId, props.eventId, contentId, props.contentId])


    useEffect(() => {
        setElements(ContentService.getElements(content))
    }, [content])

    useEffect(() => {
        if (elements && stats) {
            let data = prepareTableData()
            setTableData(data)
        }

    }, [elements, stats])


    // Check if element is just an editor - editors do not have headers
    function isElementEditor(element) {
        let el = elements[activeElementIndex]
        return !el.subtype && el?.type == 'expression'
    }


    return (
        <Grid container sx={{ p: { xs: '8px', md: '24px' }, background: theme.palette.glass.opaque, borderRadius: '8px' }}>
            <Grid item xs={12} >
                {/* ################ */}
                {/* TOP BAR */}
                {/* ################ */}
                <Grid container sx={{ mb: '12px', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Grid item xs={12} sm={6} container sx={{ alignItems: 'center', flexWrap: 'nowrap' }}>
                        {(location.key) &&
                            <EIconButton sx={{ mr: '8px' }} onClick={() => {
                                if (location.key) navigate(-1)
                            }}
                                variant="contained" color="secondary">
                                <SvgIcon viewBox={"15 15 18 18"} component={BackIcon} />
                            </EIconButton>
                        }
                        <Grid item>
                            <Typography sx={{ ...theme.typography.h, fontSize: '24px', color: theme.palette.primary.lightViolet }} >
                                {t("Grouped results")}
                            </Typography>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} container sx={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                        <Typography sx={{ ...theme.typography.p, pr: '8px', fontSize: '16px', color: theme.palette.neutrals.darkestGrey }} >
                            {t("Display view") + ":"}
                        </Typography>
                        <Typography
                            onClick={() => { setIsTableView(true) }}
                            sx={{ ...theme.typography.p, cursor: 'pointer', fontSize: '16px', textDecoration: isTableView ? 'underline' : 'none', color: isTableView ? theme.palette.primary.violet : theme.palette.neutrals.almostBlack }} >
                            {t("Table view")}
                        </Typography>
                        <Typography sx={{ ...theme.typography.p, fontSize: '16px', px: '8px' }}>{"|"}</Typography>

                        <Typography
                            onClick={() => { setIsTableView(false) }}
                            sx={{ ...theme.typography.p, cursor: 'pointer', fontSize: '16px', textDecoration: isTableView ? 'none' : 'underline', color: isTableView ? theme.palette.neutrals.almostBlack : theme.palette.primary.violet }} >
                            {t("Questions")}
                        </Typography>

                    </Grid>
                </Grid>
                {/* ################ */}
                {/* ELEMENT+ANSWERS VIEW     */}
                {/* ################ */}
                {!isTableView && <Grid container spacing={'24px'}>
                    <Grid item xs={12} lg={6}>
                        {/* ELEMENT */}
                        {elements.length > 0 && <CommonExpandBar
                            value={showElement} setValue={() => { setShowElement(!showElement) }}
                            text={

                                <ESelect sx={{ width: "200px"}}
                                    onClick={(e) => { e.stopPropagation() }}
                                    type="round"
                                    value={activeElementIndex}
                                    onChange={(e) => { setActiveElementIndex(e.target.value) }}
                                >
                                    {elements.map(function (element, i) {
                                        let name = t("Element")
                                        if (ContentService.canBeAnswered(element)) name = t("Question")
                                        return <MenuItem value={i} key={i}>{`${name} ${i + 1}`}</MenuItem>
                                    })}
                                </ESelect>

                            }>
                            {/* By default the header has paddint-top=24px */}
                            <Box sx={{ position: 'relative', top: (isElementEditor() ? '' : '-24px') }}>
                                <Element element={elements[activeElementIndex]} elementPassPercentage={content?.gradingScale?.passPercentage} showAnswer={false} showSettings={true} showCorrectAnswer={true} showPointsForCorrectAnswer={true} readOnly={true} inline={false}></Element>
                            </Box>
                        </CommonExpandBar>}
                    </Grid>
                    {/* ANSWERS */}
                    <Grid item xs={12} lg={6}>
                        <Grid container sx={{ py: '32px', px: '16px', borderRadius: '8px', background: theme.palette.shades.white30 }}>
                            <Grid container item xs={12}>
                                <Typography sx={{ ...theme.typography.h, fontSize: '21px', pb: '32px' }}>{t("List of the users")}</Typography>
                            </Grid>
                            {stats?.attendees?.length > 0 && <Grid item xs={12}>
                                {stats.attendees.map(attendee => {
                                    return <Box key={attendee._id} sx={{ mb: '8px' }}>
                                        <CommonExpandBar

                                            value={showAnswers[attendee._id] ?? false} setValue={() => {
                                                let copy = { ...showAnswers }
                                                copy[attendee._id] = !showAnswers[attendee._id]
                                                setShowAnswers(copy)
                                            }}
                                            text={<Grid container sx={{ justifyContent: 'space-between', alignItems: 'center', flexWrap: 'nowrap' }}
                                            >
                                                <Typography sx={{ ...theme.typography.p, fontSize: '16px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{attendee.name + " " + attendee.surname}</Typography>
                                                <Grid item><Grid container sx={{ alignItems: 'center' }}>{getPointsElementForAttendee(attendee)}</Grid></Grid>
                                            </Grid>}>
                                            {/* By default the header has paddint-top=24px */}
                                            <Box sx={{ position: 'relative', top: '-24px' }}>
                                                <Element element={elements[activeElementIndex]} value={attendee.results[0]?.data[elements[activeElementIndex].name]} showInstruction={false} showAnswer={true} showCorrectAnswer={false} showSettings={false} showPointsForCorrectAnswer={false} readOnly={true} inline={elements[activeElementIndex].subtype == 'attachment' ? true : false}></Element>
                                            </Box>
                                        </CommonExpandBar>
                                    </Box>
                                }

                                )}

                            </Grid>}
                        </Grid>
                    </Grid>
                </Grid>}
                {/* ########## */}
                {/* TABLE VIEW */}
                {/* ########## */}
                {isTableView && <Grid container>
                    <ETable data={tableData}></ETable>
                </Grid>}
            </Grid>
        </Grid>
    )
}