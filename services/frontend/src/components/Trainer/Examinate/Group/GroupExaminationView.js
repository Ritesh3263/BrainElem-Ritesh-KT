import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next";

// Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


//Service
import EventService from "services/event.service"
import ContentService from "services/content.service";

// Other compoentns
import GroupExaminationTableWithActions from "./GroupExaminationTableWithActions";
import GroupExaminationTableWithGrades from "./GroupExaminationTableWithGrades";



// Styled components
import { ECard, ETab, ETabBar, EButton } from "new_styled_components";
import EVerticalProperty from "styled_components/VerticalProperty";
import EIconButton from "styled_components/EIconButton";

import ContentChips from "components/Content/Display/ContentChips";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Dialog from '@mui/material/Dialog';
import './Group.scss'





// Icons
import SvgIcon from "@mui/material/SvgIcon";
import { ReactComponent as BackIcon } from 'icons/icons_48/Arrow small L.svg';
import { ReactComponent as Light } from 'icons/icons_32/Lighbulb.svg';
import { ReactComponent as Grades } from 'icons/icons_32/Star.svg';
import { ReactComponent as Tube } from 'icons/icons_32/Tube.svg';
import { ReactComponent as Clock } from 'icons/icons_32/Clock.svg';
import { ReactComponent as Users } from 'icons/icons_32/Users.svg';
import { ReactComponent as MenuClasses } from 'icons/icons_48/Menu classes.svg';
import CloseIcon from '@mui/icons-material/Close';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';

// MUI v5
import Typography from '@mui/material/Typography';
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid'
import { Paper, CardMedia, ThemeProvider, Container, Divider, IconButton} from '@mui/material';

//MUI v4
import { theme } from "MuiTheme";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";





// Display result for group of users 
// Cases supported:
// 1. eventId - all results for content associated with the event - usefull in the program for the trainer
// 2. contentId - all results for content with provided contentId - usefull for the owner of the contnt to see all the people  who used his content  
// 3. contentId + groupId - results of the users in specific group for with provided contentId - usefull in the program for the trainer
export default function GroupExaminationView(props) {
    const { t } = useTranslation();
    const { eventId, contentId, groupId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(0);
    const optionsBtn = [
        { id: 1, name: t("Download selected results") },
        { id: 2, name: t("Print selected results") },
        { id: 3, name: t("View the exam") }]
    const [event, setEvent] = useState();
    const [content, setContent] = useState();
    const [stats, setStats] = useState();

    const { setMyCurrentRoute, F_showToastMessage, F_formatSeconds, F_getHelper, F_handleSetShowLoader } = useMainContext();
    const isInTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;
    
    const getHeader = () => {
        return t("Results")
    }
    
    useEffect(() => {
        setMyCurrentRoute(getHeader())
    }, []);

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
                    stats = extendStats(content, stats)
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
                    stats = extendStats(content, stats)
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


    // Extend stats from backend by lodaing them in SurveyJS
    function extendStats(content, stats) {
        var questions = ContentService.getElements(content)

        var correctAnswers = [];
        for (let [i, trainee] of stats.attendees.entries()) {
            if (trainee.results.length) {
                let result = trainee.results[0];
                stats.attendees[i].results[0].status = 1;// Exists
                if (result.grade) stats.attendees[i].results[0].status = 2; // Verified
                if (result.published) stats.attendees[i].results[0].status = 3;// Verified and published

                // Find best/worst questions #########################
                for (let [questionIndex, question] of questions.entries()) {
                    if (ContentService.canBeAnswered(question) && ContentService.isQuestionChecked(question, result.assignedPoints)) {
                        // Get scored points for question
                        let points = ContentService.getScoredPointsForQuestion(question, result.data, result.assignedPoints)
                        var index = correctAnswers?.findIndex(q => q.name == question.name)
                        if (index == -1) {

                            let answersObject = { name: question.name, number: questionIndex + 1, count: 0 }
                            index = correctAnswers.push(answersObject) - 1
                        }
                        // If maximum points
                        let pointsForCorrectAnswer = question.pointsForCorrectAnswer
                        // By default pointsForCorrectAnswer is set to 1
                        if (pointsForCorrectAnswer == undefined) pointsForCorrectAnswer = 1
                        if (pointsForCorrectAnswer == points) correctAnswers[index].count += 1

                    }
                }

            }
            else {
                // If is in-class, set status to TODO
                if (!(content)) stats.attendees[i].results[0] = { status: 1, user: { _id: trainee._id } }
                else stats.attendees[i].results[0] = { status: 0, user: { _id: trainee._id } }// Missing
            }

        }

        console.log('correctAnswers',correctAnswers)
        var bestQuestion = correctAnswers?.reduce(function (prev, current) {
            return (prev?.count >= current?.count) ? prev : current
        }, undefined)
        var worstQuestion = correctAnswers?.reduce(function (prev, current) {
            return (prev?.count < current?.count) ? prev : current
        }, undefined)
        // Find maximal number of points for this test
        let maxPoints = ContentService.getTotalPointsForContent(content)
        // Extend stats
        return { ...stats, maxPoints: maxPoints, bestQuestion: bestQuestion, worstQuestion: worstQuestion }

    }


    useEffect(() => {
        loadData()
    }, [eventId, props.eventId, contentId, props.contentId])

    // Process percentage and return formated string
    function formatPercentage(percentage) {
        return (Math.round(percentage * 100) / 100)
    }

    function getName() {
        if (event?.name) return event.name
        else if (content?.title) return content.title
        else return ''
     }

     const [overviewOpen, setOverviewOpen] = React.useState(false);
     const OverviewDialog = () => {
        setOverviewOpen(true);
      };
      const handleClose = () => {
        setOverviewOpen(false);
      };
    return (

        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv mainUserDiv">
                <Grid item xs={12}>
                    <div className="admin_content">
                            <Grid item xs={12} >
                                <Grid container sx={{alignItems: 'center', flexWrap: 'nowrap'}}>
                                    {(!props.hideBackIcon && location.key) &&
                                        <StyledEIconButton size="medium" color="primary" sx={{ marginRight: '16px'}} onClick={() => {
                                            if (props.backIconAction) props.backIconAction()
                                            else if (location.key) navigate(-1)
                                            }}>
                                            <ChevronLeftIcon />
                                        </StyledEIconButton>
                                    }
                                    <Grid item xs={12} className="exam_head">
                                        <div>
                                            <Typography sx={{ ...theme.typography.h, fontSize: '16px', color: new_theme.palette.newSupplementary.NSupText , fontWeight: '400' }} >
                                                {t(getHeader())}
                                            </Typography>

                                            <Typography sx={{ ...theme.typography.h, fontSize: '30px', color: new_theme.palette.primary.MedPurple }} >
                                                {getName()}
                                            </Typography>
                                        </div>
                                        <div>
                                            <StyledButton eVariant="secondary" eSize="small" style={{marginRight:'10px'}} >{t("Publish results")}</StyledButton>
                                            <StyledButton eVariant="secondary" eSize="small" onClick={OverviewDialog}>{t("Overview")}</StyledButton>
                                        </div>
                                    </Grid>
                                </Grid>
                                
                                {/* {<Grid style={{ paddingTop: '8px' }} container><ContentChips content={content} event={event} /></Grid>} 
                        
                                <Grid item xs={12} >
                                    <ETabBar sx={{ mt: 3, width: "300px" }}
                                        value={activeTab}
                                        onChange={(e, i) => setActiveTab(i)}
                                        eSize='small'
                                    >
                                        <ETab label={t("Overview")} style={{ minWidth: "150px" }} eSize='small' />
                                        <ETab label={t("Student's list")} style={{ minWidth: "150px" }} eSize='small' />
                                    </ETabBar>
                                </Grid>
                                {activeTab == 0 && <>
                                    <Grid container >
                                        <Grid item xs={12} md={5} >
                                            <Box sx={{ pb: '8px' }}>
                                                <Typography variant="h3" sx={{ pt: 3, textAlign: 'left', fontSize: "14px", fontFamily: "Nunito" }} >
                                                    {("General information:")}
                                                </Typography>
                                            </Box>

                                            {(!content || content.contentType != "PRESENTATION") && <Box sx={{ p: '8px', px: '5px' }}><EVerticalProperty Icon={Grades} name={t("Average grade") + ":"} value={stats?.averageGrade != undefined ? stats?.averageGrade : "-"} fontSize='16px'></EVerticalProperty></Box>}
                                            {(content && content.contentType != "PRESENTATION") && <Box sx={{ p: '8px', px: '5px' }}><EVerticalProperty Icon={Tube} name={t("Average score") + ":"} value={stats?.averagePoints != undefined ? `${stats?.averagePoints} / ${stats?.maxPoints}` : "-"} fontSize='16px'></EVerticalProperty></Box>}
                                            {(content) && <Box sx={{ p: '8px', px: '5px' }}><EVerticalProperty Icon={Clock} name={t("Average time") + ":"} value={stats?.averageTimeSpent != undefined ? F_formatSeconds(stats?.averageTimeSpent) : "-"} fontSize='16px'></EVerticalProperty></Box>}

                                        </Grid>
                                        <Grid item xs={0} md={2} ></Grid>
                                        <Grid item xs={12} md={5} sx={{ mb: 5 }} >
                                            <Box sx={{ pb: '8px' }}>
                                                <Typography variant="h3" sx={{ pt: 3, textAlign: 'left', fontSize: "14px", fontFamily: "Nunito" }} >
                                                    {("Number of the students that:")}
                                                </Typography>
                                            </Box>

                                            <Box sx={{ p: '8px', px: '5px' }}>
                                                <EVerticalProperty badgeColor={'info'} Icon={Users} name={t("have taken")}
                                                    value={stats?.took + "/" + stats?.attendees.length}
                                                    fontSize='16px'>
                                                </EVerticalProperty>
                                            </Box>
                                            {(content && content.contentType != "PRESENTATION") && <>
                                                <Box sx={{ p: '8px', px: '5px' }}>
                                                    <EVerticalProperty badgeColor={'success'} Icon={Users} name={t("have passed")}
                                                        value={stats?.passed + "/" + stats?.attendees.length} fontSize='16px'>
                                                    </EVerticalProperty>
                                                </Box>

                                                <Box sx={{ p: '8px', px: '5px' }}>
                                                    <EVerticalProperty badgeColor={'error'} Icon={Users} name={t("haven't pass")}
                                                        value={stats?.failed + "/" + stats?.attendees.length} fontSize='16px'>
                                                    </EVerticalProperty>
                                                </Box>
                                            </>}
                                        </Grid>
                                        {stats?.bestQuestion && <Grid container item xs={12} md={5} >
                                            <Box sx={{ p: '16px', pb: '8px' }}>
                                                <EVerticalProperty Icon={Light} name={formatPercentage(100 * stats?.bestQuestion?.count / stats?.took) + t("% of students answered correctly on question no. ") + stats?.bestQuestion?.number}
                                                    fontSize='16px' multiline={true} >
                                                </EVerticalProperty>
                                            </Box>
                                        </Grid>}
                                        <Grid item xs={0} md={2}></Grid>
                                        {stats?.worstQuestion && stats?.worstQuestion != stats?.bestQuestion && <Grid container item xs={12} md={5} >
                                            <Box sx={{ p: '16px', pb: '8px' }}>
                                                <EVerticalProperty Icon={Light} name={formatPercentage(100 * stats?.worstQuestion?.count / stats?.took) + t("% of students answered correctly on question no. ") + stats?.worstQuestion?.number}
                                                    fontSize='16px' multiline={true} >
                                                </EVerticalProperty>
                                            </Box>
                                        </Grid>}
                                    </Grid>

                                    {content && <Grid container sx={{ mt: '32px', p: '16px', background: theme.palette.primary.creme, borderRadius: '8px', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                                        <Grid item container sx={{ alignItems: 'center', flexWrap: 'nowrap' }}>
                                            <Grid item sx={{ mr: '16px' }}>
                                                <SvgIcon sx={{ width: '48px', height: '48px' }} viewBox={"0 0 48 48"} component={MenuClasses} />
                                            </Grid>
                                            <Grid item>
                                                <Typography sx={{ ...theme.typography.p, color: theme.palette.neutrals.darkestGrey, fontSize: "14px" }}>
                                                    {t("Find more")}
                                                </Typography>
                                                <Typography sx={{ ...theme.typography.p, fontWeight: "600", color: theme.palette.primary.lightViolet, fontSize: "18px" }}>
                                                    {t("Grouped Results")}
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <EButton eVariant='primary' onClick={() => {
                                                if (event) navigate(`/examinate/event/${event._id}/questions`)
                                                else if (!groupId) navigate(`/examinate/content/${content._id}/all/questions`)
                                                else if (groupId) navigate(`/examinate/content/${content._id}/group/${groupId}/questions`)
                                            }}>
                                                {t("Check")}
                                            </EButton>
                                            <IconButton size="small" color="secondary"
                                                className="btn" onClick={() => { navigate(`/examinate/event/${event._id}/questions`) }}>
                                                    <ChevronLeftIcon style={{height: '30px', width: '30px', border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, borderRadius: '50%', padding: '3px'}} /> 
                                            </IconButton>

                                        </Grid>
                                    </Grid>}

                                    {stats?.attendees.length > 0 && (!content || content.contentType != "PRESENTATION")  && <GroupExaminationTableWithGrades
                                        examinedAttendeesResultsPreview={stats?.attendees.map(t => {
                                            if (t.results.length) return { ...t.results[0], user: t }
                                            else return { user: t }
                                        })}
                                        content={content} event={event} />}
                                </>} */}

                            <Grid item xs={12}>
                                {stats?.attendees.length > 0 && <GroupExaminationTableWithActions
                                    examinedAttendeesResultsPreview={stats?.attendees.map(t => {
                                        if (t.results.length) return { ...t.results[0], user: t }
                                        else return { user: t }
                                    })}
                                    content={content} event={event} reloadData={loadData} />}
                            </Grid>
                        </Grid>
                                    
                        
                    </div>
                </Grid>
                <Dialog
                    open={overviewOpen}
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    className="overview_popup"
                >
                    <Box className="displayFlex justifySpaceBetween" sx={{alignItems:'flex-end', minWidth:{xs:'100%', md:'650px'}}} >
                        <Typography variant="h3" component="h3" align="left" style={{ color: new_theme.palette.newSupplementary.NSupText }}>{t("Overview")}</Typography>
                        <IconButton size="small" onClick={handleClose}  >
                            <CloseIcon style={{height: '30px', width: '30px', border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, borderRadius: '50%', padding: '3px', fill:new_theme.palette.newSupplementary.NSupText}} />
                        </IconButton>
                    </Box>
                    <Divider variant="insert" sx={{ mb: 4, my: 2 }} />
                    <Grid container gap='40px'>
                        <Grid item md={4}>
                            <Typography variant="h4" component="h4" align="left" style={{ color: new_theme.palette.newSupplementary.NSupText, fontSize:'18px' }}>{t("Learners that")}</Typography>
                            <ul>
                                <li>
                                    <Box>
                                        <ArrowRightAltIcon style={{color:new_theme.palette.newSupplementary.surfaceInfoSecondary, marginRight:'8px'}}/>
                                        <Typography variant="body4" component="h6" align="left" style={{ color: new_theme.palette.newSupplementary.NSupText, fontSize:'18px' }}>{t("Took exam")}</Typography>
                                    </Box>
                                    <Typography variant="body4" component="h6" align="right" style={{ color: new_theme.palette.newSupplementary.NSupText, fontSize:'18px' }}>{stats?.took + "/" + stats?.attendees.length}</Typography>
                                </li>
                                <li>
                                    <Box>
                                        <ArrowRightAltIcon style={{color:new_theme.palette.newSupplementary.surfaceInfoSecondary, marginRight:'8px'}}/>
                                        <Typography variant="body4" component="h6" align="left" style={{ color: new_theme.palette.newSupplementary.NSupText, fontSize:'18px' }}>{t("Passed exam")}</Typography>
                                    </Box>
                                    <Typography variant="body4" component="h6" align="right" style={{ color: new_theme.palette.newSupplementary.NSupText, fontSize:'18px' }}>{stats?.passed + "/" + stats?.attendees.length}</Typography>
                                </li>
                                <li>
                                    <Box>
                                        <ArrowRightAltIcon style={{color:new_theme.palette.newSupplementary.surfaceInfoSecondary, marginRight:'8px'}}/>
                                        <Typography variant="body4" component="h6" align="left" style={{ color: new_theme.palette.newSupplementary.NSupText, fontSize:'18px' }}>{t("Didn't passed exam")}</Typography>
                                    </Box>
                                    <Typography variant="body4" component="h6" align="right" style={{ color: new_theme.palette.newSupplementary.NSupText, fontSize:'18px' }}>{stats?.failed + "/" + stats?.attendees.length}</Typography>
                                </li>
                            </ul>
                        </Grid>     
                        <Grid item md={4}>
                            <Typography variant="h4" component="h4" align="left" style={{ color: new_theme.palette.newSupplementary.NSupText, fontSize:'18px' }}>{t("Average")}</Typography>
                            <ul>
                                <li>
                                    <Box>
                                        <ArrowRightAltIcon style={{color:new_theme.palette.newSupplementary.surfaceInfoSecondary, marginRight:'8px'}}/>
                                        <Typography variant="body4" component="h6" align="left" style={{ color: new_theme.palette.newSupplementary.NSupText, fontSize:'18px' }}>{t("Grade")}</Typography>
                                    </Box>
                                    <Typography variant="body4" component="h6" align="right" style={{ color: new_theme.palette.newSupplementary.NSupText, fontSize:'18px' }}>{stats?.averageGrade != undefined ? stats?.averageGrade : "-"}</Typography>
                                </li>
                                <li>
                                    <Box>
                                        <ArrowRightAltIcon style={{color:new_theme.palette.newSupplementary.surfaceInfoSecondary, marginRight:'8px'}}/>
                                        <Typography variant="body4" component="h6" align="left" style={{ color: new_theme.palette.newSupplementary.NSupText, fontSize:'18px' }}>{t("Time")}</Typography>
                                    </Box>
                                    <Typography variant="body4" component="h6" align="right" style={{ color: new_theme.palette.newSupplementary.NSupText, fontSize:'18px' }}>{stats?.averageTimeSpent != undefined ? F_formatSeconds(stats?.averageTimeSpent) : "-"}</Typography>
                                </li>
                                <li>
                                    <Box>
                                        <ArrowRightAltIcon style={{color:new_theme.palette.newSupplementary.surfaceInfoSecondary, marginRight:'8px'}}/>
                                        <Typography variant="body4" component="h6" align="left" style={{ color: new_theme.palette.newSupplementary.NSupText, fontSize:'18px' }}>{t("Score")}</Typography>
                                    </Box>
                                    <Typography variant="body4" component="h6" align="right" style={{ color: new_theme.palette.newSupplementary.NSupText, fontSize:'18px' }}>{stats?.averagePoints != undefined ? `${stats?.averagePoints} / ${stats?.maxPoints}` : "-"}</Typography>
                                </li>
                            </ul>
                        </Grid>
                    </Grid>
                    <ETabBar
                        className="newTabBar"
                        value={activeTab}
                        onChange={(e, i) => setActiveTab(i)}
                        eSize='xsmall'
                    >
                        <ETab label='Top grade learners' style={{ minWidth: "150px", fontSize:'13px' }} eSize='xsmall' />
                        <ETab label='Low grade learners' style={{ minWidth: "150px", fontSize:'13px' }} eSize='xsmall' />
                    </ETabBar>
                    {activeTab == 0 && 
                        
                        <GroupExaminationTableWithGrades
                            examinedAttendeesResultsPreview={stats?.attendees.map(t => {
                                if (t.results.length) return { ...t.results[0], user: t }
                                else return { user: t }
                            })}
                            content={content} event={event} 
                        />
                       
                    }
                    {activeTab == 1 && 
                        <>
                            qwerty
                        </>
                    }
                </Dialog>
            </Container>
        </ThemeProvider>

    )
}