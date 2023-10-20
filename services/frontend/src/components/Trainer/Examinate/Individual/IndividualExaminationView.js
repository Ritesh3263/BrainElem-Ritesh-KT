import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next";
import { useReactToPrint } from 'react-to-print';
import "./individual.scss"
// Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// Styled components
import ETooltip from 'styled_components/Tooltip';
import EBadge from 'styled_components/Badge';
import TextField from "styled_components/TextField";
import SwitchWithTooltip from "styled_components/SwitchWithTooltip";
import { EIconButton, ECard, ESelect, EChip } from "styled_components";
import EVerticalProperty from "styled_components/VerticalProperty";
import ESvgIcon from "styled_components/SvgIcon"
import OptionsButton from "components/common/OptionsButton";
import { Create, MoreVert } from "@mui/icons-material";


import ELinearProgress from 'styled_components/LinearProgress';

// Services
import ResultService from "services/result.service";
import ContentService from "services/content.service";
import EventService from "services/event.service"
import UserService from "services/user.service"

// Other components
import TopBar from 'components/Content/Display/TopBar'
import DisplayTestResults from "components/Content/Display/DisplayTestResults";

// MUI v5
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';


import { ReactComponent as Ellipse } from 'icons/icons_32/Points.svg';
import { ReactComponent as Grade } from 'icons/icons_32/Grade.svg';
import { ReactComponent as Comment } from 'icons/icons_32/Comment.svg';
import { ReactComponent as Notice } from 'icons/icons_32/Property 1=clock_notice.svg';
import { ReactComponent as Clock } from 'icons/icons_32/Clock.svg';

import { ReactComponent as EditIcon } from 'icons/icons_32/Edit_32.svg';
import { ReactComponent as EditAcceptIcon } from 'icons/icons_32/Accept_32.svg';
import { ReactComponent as EditCloseIcon } from 'icons/icons_32/Close_32.svg';

import { ReactComponent as InfoIcon } from 'icons/icons_32/Info_32.svg';


// MUI v4
import { theme } from "MuiTheme";
import { Container, Divider, FormControl, IconButton, Select, ThemeProvider } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import SegmentIcon from '@mui/icons-material/Segment';
import StyledButton from "new_styled_components/Button/Button.styled";
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";







export default function IndividualExaminationView(props) {
    const { F_showToastMessage, F_handleSetShowLoader, F_getErrorMessage, F_getHelper, F_formatSeconds, F_getLocalTime } = useMainContext();
    const navigate = useNavigate()
    const componentRef = useRef();
    const { userPermissions } = F_getHelper();
    const { contentId, userId, eventId } = useParams();
    const { t, i18n, translationsLoaded } = useTranslation();

    const [user, setUser] = useState(null);
    const [activeTime, setActiveTime] = useState('');
    const [inactiveTime, setInactiveTime] = useState('');
    const [awayTime, setAwayTime] = useState('');

    const [content, setContent] = useState(null);

    const [modifiedResult, setModifiedResult] = useState();
    // Can be event or content
    const [modifiedObject, setModifiedObject] = useState();

    // Title to display
    const [title, setTitle] = useState(t("Verify the exam"));
    // Only for examination
    const [event, setEvent] = useState(null);
    const [testStatus, setTestStatus] = useState(undefined);// Status of a test
    const [contentModel, setContentModel] = useState(null);// ContentModel from child component
    const [result, setResult] = useState(null);
    const [allResults, setAllResults] = useState([]);
    const [loadingResult, setLoadingResult] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [printMode, setPrintMode] = useState(false);
    const [singleQuestionMode, setSingleQuestionMode] = useState(false);
    const [isSingleQuestionModeToggled, setIsSingleQuestionModeToggled] = useState(true)
    const [isSeperatedToggled, setIsSeperatedToggled] = useState(false)
    const [currentPageNo, setCurrentPageNo] = useState(0);// Keep track of current page opened



    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        removeAfterPrint: false,
        onBeforeGetContent: async () => {
            F_handleSetShowLoader(true)
            await setPrintMode(true);
            await new Promise(resolve => setTimeout(resolve, 500));
        },
        onAfterPrint: () => {
            // This is not working when using using custom `print` function
        },
        print: async (target) => {
            // `target` is an `iframe` exported object which is a copy of original content displayed to the user 
            // Find `Iframes` elements in `target`
            target.style.background = 'white'
            target.contentWindow.document.body.style.background = 'white'

            let questionTopBars = target.contentWindow.document.getElementsByClassName('questionTopBar')
            for (let i = 0; i < questionTopBars.length; i++) {
                let questionTopBar = questionTopBars[i]
            }
            let targetIframes = target.contentWindow.document.getElementsByTagName('iframe')
            for (let j = 0; j < targetIframes.length; j++) {
                let targetIframe = targetIframes[j]
                let parent = targetIframe.parentElement.parentElement;
                // Display just URL of embeded element
                if (parent.hasAttribute('data-oembed-url')) {
                    parent.innerHTML = `<p>${targetIframe.src}</p>`
                    j--
                }
            }
            if (target.contentWindow.print) {
                target.contentWindow.print();
            }
            setPrintMode(false)
            F_handleSetShowLoader(false)
        },
    });

    // ###############################################################################################
    const loadAllResultsForUser = (userId, contentId) => { //Loads all results of exam
        ResultService.getAllResultsForUser(userId, contentId).then(
            (response) => {
                let results = response.data
                // Show only results for selected event
                if (event) {
                    results = results.filter(r => r.event == event._id)
                    // Show all results unrelated to any event
                } else results = results.filter(r => !r.event)

                setAllResults(results)
            },
            (error) => {
                let errorMessage = F_getErrorMessage(error)
                setAllResults([])
            }
        )
    }
    const loadEvent = (eventId) => { //Loads event
        EventService.overview(eventId).then(res => {
            setEvent(res.data)
            setContent(res.data.assignedContent)
        }).catch(e => {
            console.log(e)
            F_showToastMessage("Could not load data", 'error')
        })

    }


    const canExamine = () => { 
        if (event) return event.canExamine
        else return content?.canExamine
    }


    // ###############################################################################################
    const loadContent = (contentId) => { //Loads content
        ContentService.getContentOverview(contentId).then(
            (response) => {
                let mode = singleQuestionMode ? "questionPerPage" : "singlePage"
                response.data.questionsOnPageMode = mode;
                setContent(response.data)
            },
            (error) => {
                let errorMessage = F_getErrorMessage(error)
            }
        )
    }



    // ###############################################################################################
    const getListItem = (badgeColor, Icon, name, value, TooltipElement) => { // Generate list item

        return (<ListItem><EVerticalProperty badgeColor={badgeColor} Icon={Icon} name={name} value={value} description={TooltipElement} fontSize='16px'></EVerticalProperty></ListItem>)
    }


    const isTestCheked = () => {
        return testStatus.numberOfCheckedQuesitons === testStatus.numberOfQuestions;
    }

    const getGrade = () => {
        if (!isTestCheked()) return <ETooltip title={t(`This test has some questions which has to checked manually. After all the questions will be checked, the grade will appear here.`)}>
            <div>
                <ESvgIcon viewBox="4 4 24 24" component={InfoIcon} />
            </div>
        </ETooltip>
        else if (editMode) return testStatus.gradeForTest
        else if (props.trainerMode && (result.points !== testStatus.scoredPointsForTest))
            return <ETooltip title={t(`This grade is outdated, please use 'edit' button to assign a new grade. 
            It happened because some changes has been made to this test, after the grade had been assigned.`)}>
                <div>
                    <span>{result.grade}</span><ESvgIcon viewBox="4 4 24 24" component={InfoIcon} />
                </div>
            </ETooltip>
        else return result.grade;
    }

    const buttons = [
        { id: 1, name: t("Display as single page"), action: () => { setSingleQuestionMode(false); setIsSeperatedToggled(false); setIsSingleQuestionModeToggled(true) }, isToggle: isSingleQuestionModeToggled },
        { id: 2, name: t("Display as separeted pages"), action: () => { setSingleQuestionMode(true); setIsSeperatedToggled(true); setIsSingleQuestionModeToggled(false)}, isToggle: isSeperatedToggled },
        { id: 3, name: t("Download results"), disabled: editMode, action: () => { handlePrint() } },
        { id: 4, name: t("Print results"), disabled: editMode, action: () => { handlePrint() } },

    ];
    // ###############################################################################################
    useEffect(() => { //Loads allResults when user is changed
        if (user && content) loadAllResultsForUser(user._id, content._id)
    }, [user, content]);

    // ###############################################################################################
    useEffect(() => { //Initalize `result` when `allResults` are loaded
        if (allResults.length) {
            // If already selected older result
            let selectedResult = allResults.find((r) => r._id === result?._id)
            // Otherwise the first on the list
            if (!selectedResult) selectedResult = allResults[0]
            setResult(selectedResult)

            setTitle(t("Verify the exam")+ " - " +selectedResult.user?.name + " " + selectedResult.user?.surname)
        }
        else {
            setResult(null)
            UserService.read(userId).then(res => {
                setTitle(t("Verify the exam") + " - " + res.data.name + " " + res.data.surname)
            }).catch(err => console.log(err));
        }
        setLoadingResult(false)
    }, [allResults]);

    // ###############################################################################################


    // Process percentage and return formated string
    // function formatPercentage(percentage) {
    //     return (Math.round(percentage * 100) / 100) + "%"
    // }

    function formatPercentage(percentage) {
        if(percentage){
            return (Math.round(percentage * 100) / 100) + "%"
        }
        else{
            return "-"
        }
    }


    // Process percentage and return formated string
    // function formatPoints(points) {
    //     return (Math.round(points * 100) / 100)
    // }

    function formatPoints(points) {
        if(points){
            return (Math.round(points * 100) / 100)
        }
        else{
            return "-"
        }
        
    }


    async function changeExtraAttemt(updatedAllowExtraAttemptFor, toastMessageDeley=0){
        try {
            let object = event ? event : content
            let service = event ? EventService : ContentService
            let hasExtraAttempt = updatedAllowExtraAttemptFor.includes(user._id)
            let hadExtraAttempt = object.allowExtraAttemptFor.includes(user._id);
            if (hasExtraAttempt != hadExtraAttempt) {
                if (hasExtraAttempt) {
                    await service.allowExtraAttempt(object._id, user._id);
                    setTimeout(() => F_showToastMessage(t('Allowed extra attempt'), 'success'), toastMessageDeley)
                } else {
                    await service.disallowExtraAttempt(object._id, user._id);
                    setTimeout(() => F_showToastMessage(t('Disallowed extra attempt'), 'success'), toastMessageDeley)
                }
                if (event) setEvent({ ...object, allowExtraAttemptFor: updatedAllowExtraAttemptFor })
                else setContent({ ...object, allowExtraAttemptFor: updatedAllowExtraAttemptFor })
            }
        } catch (error) {
            console.error(error)
            setTimeout(() => F_showToastMessage(t("Could not change access for extra attempt"), 'error'), toastMessageDeley)
        }

    }

    useEffect(() => { // Handle new result
        if (result) {
            let active = result.timeSpent - result.inactiveTime - result.awayTime
            if (t<0) t = 0
            setActiveTime(F_formatSeconds(active))
            setInactiveTime(F_formatSeconds(result.inactiveTime))
            setAwayTime(F_formatSeconds(result.awayTime))
            setLoadingResult(false)
        }

    }, [result]);

    // ###############################################################################################
    useEffect(() => { //Reload results when user is changed
        setCurrentPageNo(0);
        setLoadingResult(true)
        if (userId) setUser({ _id: userId })
    }, [userId]);


    // ###############################################################################################
    // Loading by eventId (examination)
    useEffect(() => {
        if (eventId) {
            loadEvent(eventId)
        }
    }, [eventId]);

    // ###############################################################################################
    // Loading by contentId (displaying results)
    useEffect(() => { //Reload conent when conentId is changed
        if (contentId) loadContent(contentId)
    }, [contentId]);


    useEffect(() => { //Set contentModel from child component
        if (contentModel) {
            let gradingScale = event ? event.gradingScale : content.gradingScale
            let status = {};
            let assignedPoints = editMode ? modifiedResult.assignedPoints : result.assignedPoints;
            status['scoredPointsForTest'] = ContentService.getScoredPointsForTest(contentModel, assignedPoints)
            status['totalPointsForTest'] = ContentService.getTotalPointsForContent(content)
            status['percentageOfScoredPoints'] = ContentService.getPercentageOfScoredPoints(contentModel, assignedPoints)
            status['numberOfQuestions'] = ContentService.countQuestions(contentModel);
            status['numberOfCheckedQuesitons'] = ContentService.countCheckedQuestions(contentModel, assignedPoints)
            status['percentageOfCheckedQuestions'] = ContentService.getPercentageOfCheckedQuestions(contentModel, assignedPoints)
            status['gradeForTest'] = ContentService.getGradeForTest(contentModel, gradingScale, assignedPoints)
            setTestStatus(status)
        }
    }, [contentModel, modifiedResult]);



    // ###############################################################################################
    useEffect(() => { // Handle change of display mode
        if (!result) return
        let mode = singleQuestionMode ? "questionPerPage" : "singlePage"
        if (mode !== "questionPerPage") setCurrentPageNo(0);
        setContent({ ...content, questionsOnPageMode: mode })
    }, [singleQuestionMode]);


    return (
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv mainUserDiv">
                <Grid item xs={12}>
                    <Grid container sx={{alignItems: 'center', flexWrap: 'nowrap'}}>
                        <StyledEIconButton color="primary" size="medium" sx={{ marginRight: '6px'}} onClick={()=>{navigate(-1)}}>
                            <ChevronLeftIcon /> 
                        </StyledEIconButton>
                        <Typography variant="h3" component="h3" sx={{color: new_theme.palette.newSupplementary.NSupText, textAlign:'left'}}>
                            {title}
                        </Typography>
                        <div style={{marginLeft:'auto', display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                            <p style={{marginBottom:0}}>{t("Date") + " : " + (event?.date ? F_getLocalTime(event?.date) : "-")}</p>
                            <Grid container item xs={1} justifyContent="end" alignItems="center" className="ml-4">
                                <OptionsButton iconButton={true} btns={buttons} style={{padding:0}} />
                            </Grid>
                        </div>
                    </Grid>
                    <Divider sx={{my:"8px"}}/>
                    <Grid ref={componentRef} container item xs={12} alignContent="flex-start">

                        {!printMode && <Box sx={{ mb: 2, width: '100%' }}>
                            <TopBar
                                title={title}
                                subtitle={(event?.name ? event.name : content?.title)} content={content} event={event}
                                isPreview={true}
                                hideTopBarActions={true}
                            >
                            </TopBar>
                        </Box>}
                        
                        {!loadingResult  && !result &&
                            <Typography>{t("There are no results yet")}</Typography>
                        }
                        {!loadingResult  && !result &&  canExamine() && <ListItem>
                                <SwitchWithTooltip
                                    className="examSwitch"
                                    name={t("Allow to take again")}
                                    description={t('User can take the same test again')}
                                    fontSize='16px'
                                    disabled={!canExamine()}
                                    onChange={async () => {
                                        let object = event ? event : content
                                        let array = object?.allowExtraAttemptFor.slice()
                                        let index = array.indexOf(user._id);
                                        if (index > -1) array.splice(index, 1); // 2nd parameter means remove one item only
                                        else array.push(user._id)
                                        await changeExtraAttemt(array)
                                    }}
                                    edge="end"
                                    checked={event ? event?.allowExtraAttemptFor.includes(user._id) : content?.allowExtraAttemptFor.includes(user._id)}
                                    color="primary"
                                />
                            </ListItem>
                        }
                        


                        {(loadingResult || result) && <>

                            <Grid item xs={12} lg={4} xl={3} sx={{ mb: 2, pl: { xs: 0, lg: 3 } }} order={{ lg: 2, xl: 2 }}>
                                <Grid className="questionCards" >
                                    {!loadingResult && result && testStatus && content &&
                                        <List>
                                            <Grid container sx={{ p: 2 }}>
                                                    <Grid item xs={11}  >
                                                        <Grid container sx={{alignItems:"center"}}>
                                                            <IconButton size="small" sx={{ marginRight: '6px'}}>
                                                                <SegmentIcon style={{height: '40px', width: '40px', border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, borderRadius: '50%', padding: '6px', fill:new_theme.palette.newSupplementary.NSupText}} /> 
                                                            </IconButton>
                                                            <Typography variant="h3" component="h3"
                                                                style={{ color:new_theme.palette.newSupplementary.NSupText }}>
                                                                {t("Summary")}
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                    
                                            </Grid>

                                            {!editMode &&
                                                <Grid container >

                                                    <Grid sx={{ p: 2 }} item xs={12}>
                                                        <FormControl className="summaryDatePicker" margin="dense" fullWidth={true} variant="filled">
                                                            <Select
                                                                type="round"
                                                                value={result._id}
                                                                onChange={(e) => setResult(allResults.find((r) => r._id === e.target.value))}
                                                            >
                                                                {allResults.map(function (result, i) {
                                                                    return <MenuItem value={result._id} key={result._id}>{F_getLocalTime(result.createdAt)}</MenuItem>
                                                                })}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                            }

                                            {!userPermissions.isTrainee && event &&
                                                <>
                                                    {getListItem(
                                                        ((!editMode && result.published) || (editMode && modifiedResult.published)) ? 'info' : "error",
                                                        undefined,
                                                        t('Status'),
                                                        ((!editMode && result.published) || (editMode && modifiedResult.published)) ? "Published" : "Unpublished")}
                                                </>
                                            }


                                            {props.trainerMode && result?.canEdit && !printMode && testStatus && <>
                                                <ListItem sx={{justifyContent:'center'}}>
                                                    <Typography style={{ color: new_theme.palette.newSupplementary.NSupText, fontSize:'12px', fontWeight:600}}>{t("Verified") + " " + testStatus.numberOfCheckedQuesitons + "/" + testStatus.numberOfQuestions} </Typography>
                                                </ListItem>
                                                <Grid xs={12} style={{ margin:'0 16px' }} >
                                                    <ELinearProgress style={{ borderRadius: "30px", height: "8px" }} variant="determinate" value={testStatus.percentageOfCheckedQuestions} />
                                                </Grid>
                                                

                                            </>}

                                            <Grid className="gradeBox">
                                                {content?.contentType != "PRESENTATION" && getListItem(undefined, undefined, t('Grade'), getGrade())}


                                                {content?.contentType != "PRESENTATION" && <>

                                                    {getListItem(undefined, undefined,
                                                        t('Total points'),
                                                        formatPoints(testStatus.scoredPointsForTest) + "/" + formatPoints(testStatus.totalPointsForTest),
                                                        <>
                                                            <ListItem className="pt-3" >
                                                                <p className="mr-4"><EBadge ecolor='success' variant="dot" /></p>
                                                                <p> {t("Correct answers")}</p>
                                                                <p className="ml-4">{formatPoints(testStatus.scoredPointsForTest)} </p>
                                                            </ListItem>
                                                            <ListItem >
                                                                <p className="mr-4"><EBadge ecolor='error' variant="dot" /></p>
                                                                <p> {t("Wrong answers")}</p>
                                                                <p className="ml-4">{formatPoints(testStatus.totalPointsForTest - testStatus.scoredPointsForTest)} </p>
                                                            </ListItem>
                                                        </>

                                                    )}

                                                    {getListItem(undefined, undefined,
                                                        t('Percentage'),
                                                        formatPercentage(testStatus.percentageOfScoredPoints),
                                                        <>
                                                            <ListItem className="pt-3" >
                                                                <p className="mr-3"><EBadge ecolor='success' variant="dot" /></p>
                                                                <p> {t("Correct answers")}</p>
                                                                <p className="ml-4"> {formatPercentage(testStatus.percentageOfScoredPoints)}</p>
                                                            </ListItem>
                                                            <ListItem >
                                                                <p className="mr-3"><EBadge ecolor='error' variant="dot" /></p>
                                                                <p> {t("Wrong answers")}</p>
                                                                <p className="ml-4"> {formatPercentage(100 - testStatus.percentageOfScoredPoints)}</p>
                                                            </ListItem>
                                                        </>

                                                    )}
                                                </>}


                                                {(!userPermissions.isTrainee || canExamine()) &&
                                                    getListItem(undefined, undefined, t('Active time'), activeTime, <>{t("Active time which user spend on this test.")}</>)}

                                                {!userPermissions.isTrainee &&
                                                    getListItem(undefined, undefined, t('Inactive'), result.inactiveCount + " " + t('times') + "/" + inactiveTime,
                                                        <> {t("How many times and for how long user was inactive. Inactive means that there was no mouse or keyboard activity for more than 30 second. It may indicate that user was using other devices.")}</>
                                                    )}

                                                {!userPermissions.isTrainee &&
                                                    getListItem(undefined, undefined, t('Out of focus'), result.awayCount + " " + t('times') + "/" + awayTime,
                                                        <>{t("How many times and for how long user was away. This means that user left to other browser tab or other program on his computer. It may indicate that user was looking for the answer on other websites.")}
                                                        </>
                                                    )}


                                            </Grid>

                                            {!printMode && <>

                                                {event && <>
                                                    
                                                    {getListItem(undefined, undefined, t('Comment for the user'))}
                                                   
                                                    <ListItem>
                                                        <TextField
                                                            disabled={!editMode}
                                                            sx={{ mx: 1, borderBottom:'2px' }}
                                                            fullWidth
                                                            hidden={!(props.trainerMode && result?.canEdit) && !result.comment.length}
                                                            inputProps={
                                                                { readOnly: !(props.trainerMode && result?.canEdit) }
                                                            }
                                                            placeholder={t('Good job!')}
                                                            label="Write here"
                                                            value={editMode ? modifiedResult.comment : result.comment}
                                                            onChange={(event) => setModifiedResult({ ...modifiedResult, comment: event.target.value })}
                                                        />
                                                    </ListItem>


                                                    <ListItem onClick={() => { if (!editMode) F_showToastMessage(t("You are not in the edit mode"), 'info') }}>
                                                        <SwitchWithTooltip

                                                            name={t("Publish results")}
                                                            description={t('Grade will be visible in gradebook')}
                                                            fontSize='16px'
                                                            disabled={!editMode || !isTestCheked()}
                                                            edge="end"
                                                            checked={editMode ? modifiedResult.published : result.published}
                                                            color="primary"
                                                            onChange={(event) => setModifiedResult({ ...modifiedResult, published: !modifiedResult.published, publishedAt: (modifiedResult.published ? undefined : (new Date()).toISOString()), sendMail: !modifiedResult.published })}
                                                        />
                                                    </ListItem>
                                                </>}

                                                {content?.contentType != "PRESENTATION" && <ListItem onClick={() => { if (!(props.trainerMode && result?.canEdit) || !editMode) F_showToastMessage(t("You are not in the edit mode"), 'info') }}>
                                                    <SwitchWithTooltip
                                                        name={t("Allow to take again")}
                                                        description={t('User can take the same test again')}
                                                        fontSize='16px'
                                                        disabled={!(props.trainerMode && result?.canEdit) || !editMode}
                                                        onChange={() => {
                                                            let array = modifiedObject?.allowExtraAttemptFor
                                                            let index = array.indexOf(user._id);
                                                            if (index > -1) array.splice(index, 1); // 2nd parameter means remove one item only
                                                            else array.push(user._id)
                                                            setModifiedObject({ ...modifiedObject, array })
                                                        }}
                                                        edge="end"
                                                        checked={editMode ? modifiedObject?.allowExtraAttemptFor.includes(user._id) : (event ? event?.allowExtraAttemptFor.includes(user._id) : content?.allowExtraAttemptFor.includes(user._id))}
                                                        color="primary"
                                                    />
                                                </ListItem>}



                                            </>}
                                            {!editMode &&
                                                    <ListItem className="my-2 d-flex justify-content-center">
                                                        <StyledButton eVariant="secondary" eSize="medium" fullWidth="true"
                                                            onClick={() => {
                                                                F_handleSetShowLoader(true);
                                                                setModifiedResult(structuredClone(result))
                                                                setModifiedObject(structuredClone(event ? event : content))
                                                                //if (props.setBlockNavigation) props.setBlockNavigation(true)
                                                                setEditMode(true)
                                                                }
                                                            }
                                                        >{t("Edit")}</StyledButton>
                                                    </ListItem>
                                                    
                                                }
                                                {editMode &&
                                                    <ListItem className="my-2 d-flex justify-content-center">
                                                        
                                                        <StyledButton eVariant="secondary" eSize="medium" fullWidth="true" 
                                                            onClick={() => {
                                                                F_handleSetShowLoader(true)
                                                                loadAllResultsForUser(user._id, content._id);
                                                                //if (props.setBlockNavigation) props.setBlockNavigation(false)
                                                                setEditMode(false)
                                                            }}
                                                        >{t("Cancel")}</StyledButton>


                                                        
                                                        <StyledButton eVariant="primary" eSize="medium" fullWidth="true"
                                                            onClick={async () => {
                                                                F_handleSetShowLoader(true)
                                                                // Save changes for result
                                                                let updatedResult = {
                                                                    _id: result._id,
                                                                    assignedPoints: modifiedResult.assignedPoints,
                                                                    assignedComments: modifiedResult.assignedComments,
                                                                    percentage: testStatus.percentageOfScoredPoints,
                                                                    points: testStatus.scoredPointsForTest,
                                                                    grade: testStatus.gradeForTest,
                                                                    comment: modifiedResult.comment,
                                                                    published: modifiedResult.published,
                                                                    publishedAt: modifiedResult.publishedAt,
                                                                    sendMail: modifiedResult.sendMail
                                                                }


                                                                // Deley showing toast messages
                                                                // As they will be removed in DisplayTestResult when result/evnent is updated
                                                                let toastMessageDeley = 1000;


                                                                try {
                                                                    await ResultService.update(updatedResult);
                                                                    setResult({ ...result, ...updatedResult })
                                                                    setTimeout(() => F_showToastMessage(t('Updated sucessfully!'), 'success'), toastMessageDeley)
                                                                } catch (error) {
                                                                    setTimeout(() => F_showToastMessage(t("Could not update the results"), 'error'), toastMessageDeley)
                                                                }

                                                                let updatedObject = modifiedObject;
                                                                await changeExtraAttemt(updatedObject.allowExtraAttemptFor, toastMessageDeley)



                                                                //if (props.setBlockNavigation) props.setBlockNavigation(false)
                                                                setEditMode(false)

                                                            }}
                                                        >{t("Confirm")}</StyledButton>
                                                    </ListItem>
                                                }
                                            
                                            

                                            {result.published && result.publishedAt &&
                                                <ListItem style={{ flexDirection: 'column', textAlign: 'center' }}>
                                                    <Typography variant="subtitle2" sx={{ justifyContent: "center" }} >
                                                        {t("Verified on") + ": " + (result?.publishedAt ? F_getLocalTime(result?.publishedAt) : '-') + t(" by user-name") }
                                                    </Typography>
                                                     
                                                </ListItem>
                                            }
                                        </List>

                                    }
                                </Grid>
                            </Grid>

                            {(!loadingResult && result) && <Grid item xs={12} lg={8} xl={9} order={{ lg: 1, xl: 1 }}>
                                <Grid className="questionCards" sx={{ p: { xs: 2, md: 3 } }} >
                                    {!loadingResult && result && content &&
                                        <DisplayTestResults
                                            result={result}
                                            modifiedResult={modifiedResult}
                                            setModifiedResult={setModifiedResult}
                                            event={event}
                                            content={content} setContentModel={setContentModel}
                                            trainerMode={props.trainerMode}
                                            editMode={editMode}
                                            currentPageNo={currentPageNo} setCurrentPageNo={setCurrentPageNo}
                                        />}
                                </Grid>
                            </Grid>}

                        </>}
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    )
}
