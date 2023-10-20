import React, { useState, useEffect } from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Avatar from "@material-ui/core/Avatar";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import ListItemText from "@material-ui/core/ListItemText";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import Paper from "@material-ui/core/Paper";
import { useTranslation } from "react-i18next";
import IconButton from "@material-ui/core/IconButton";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Chip from "@material-ui/core/Chip";
import { useSessionContext } from "components/_ContextProviders/SessionProvider/SessionProvider";
import CertificationSessionService from "services/certification_session.service";
import ContentService from "services/content.service";
import ManageContents from "./Manage/ManageContents";
import { Button } from "@mui/material";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { ThemeProvider, Typography, Box } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { new_theme } from 'NewMuiTheme';
import "../SessionForm.scss";
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { BiCalendarEvent } from "react-icons/bi";
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";
import "./program.scss";

// import CalendarTodayIcon from "@material-ui/icons/CalendarToday";

export default function ContentItem({ chapter, index, setCurrentCourseObject, setContentDetailsHelper, manageContentHelper, setManageContentHelper, contentDetailsHelper, groupId, setEventHelper }) {
    const { F_getHelper, F_getLocalTime, F_showToastMessage } = useMainContext();
    const { user, userPermissions } = F_getHelper();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentContent, setCurrentContent] = useState({});
    const [contentImageLink, setContentImageLink] = useState(undefined);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const {
        currentSession,
        isOpenSessionForm,
    } = useSessionContext();
    function handleOnDragEndContent(result) {
        setContentDetailsHelper({ isOpen: false, contentId: undefined });
        if (result.destination !== null) {
            const items = Array.from(chapter?.chosenContents);
            const [reorderedItem] = items.splice(result.source.index, 1);
            items.splice(result.destination.index, 0, reorderedItem);
            setCurrentCourseObject(p => {
                let val = Object.assign({}, p);
                val.chosenChapters[index].chosenContents = items;
                return val;
            });
        }
    }

    const updateChapter = (type, payload) => {
        switch (type) {
            case 'ADD': {
                setCurrentCourseObject(p => {
                    let val = Object.assign({}, p);
                    val.chosenChapters[index].chosenContents = [...val.chosenChapters[index].chosenContents, payload];
                    return val;
                });
                break;
            }
            case 'REMOVE': {
                setCurrentCourseObject(p => {
                    let val = { ...p };
                    val.chosenChapters[index].chosenContents = val.chosenChapters[index].chosenContents.filter(({ content: { _id, origin } }) => {
                        if (origin) {
                            return origin !== payload
                        } else {
                            return _id !== payload
                        }
                    });
                    return val;
                });
                break;
            }
            default: break;
        }
    }

    const NavigateRoute = (cont, e) => {
        e.stopPropagation();
        // If event exits - see https://gitlab.elia.academy/root/elia/-/commit/95276bf43ca9b874b5f9a99d485b268e092ca9c3#note_26779 
        if (cont.eventId) navigate(`/event/${cont.eventId}/content/display`);
        else {// Event does not yet exists
            // setContentDetailsHelper({ isOpen: true, contentId: cont._id })
            CertificationSessionService.newGetContent(cont._id).then(res => {
                if (res.status === 200 && res?.data) {
                    setCurrentContent(res.data);
                    let imgLink = ContentService.getImageUrl(res.data);
                    if (imgLink) {
                        setContentImageLink(imgLink);
                        setIsImageLoading(false);
                    }
                    navigate(`/my-courses/preview/?tmId=${res.data.trainingModule}&groupId=${groupId?._id}&chId=${res.data.chapter}&cId=${cont._id}`)
                }
            }).catch(err => console.log(err))
        }
    }

    const contentsList = chapter?.chosenContents?.length > 0 ? chapter?.chosenContents.map((cont, ind) => (
        <Draggable draggableId={cont.content._id} index={ind} key={cont.content._id} isDragDisabled={true}>
            {(provided) => (
                <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <ListItem
                        className="my-3 inside_card"
                        style={{ backgroundColor: new_theme.palette.primary.PWhite, borderRadius: '8px', overflowX:'auto', justifyContent: 'space-between' }}>
                        {/* <ListItemIcon>
                            <SettingsEthernetIcon sx={{ transform: "rotate(90deg)"}} />
                            <Avatar className="ml-2 mr-3" style={{width: "25px", height: "25px", }}>
                                <Typography variant="body2" component="span" className="text-left">
                                    <small>{`${index+1}.${ind+1}`}</small>
                                </Typography>
                            </Avatar>
                        </ListItemIcon> */}
                        <div className="inner_box_pri mb-title" >
                            <ListItemText primary={<Typography variant="body2" component="h6" sx={{ fontWeight: '700', color: new_theme.palette.secondary.Turquoise, cursor: 'pointer', minWidth:'200px' }} onClick={(e)=>NavigateRoute(cont.content, e)}>{cont?.content.title || "-"}</Typography>} />
                        </div>
                        <div className="inner_box_item">
                            <Box className="box_flex mb_1" sx={{textWrap:'nowrap'}}>
                                <ListItemText className='text-right pr_2 event-type' primary={<Chip style={{ fontSize: '14px', backgroundColor: new_theme.palette.newSupplementary.SupCloudy }} label={cont?.content?.eventType || "-"} />} />
                                <ListItemText className='text-right pr_5 content-type' primary={<Chip style={{ fontSize: '14px', backgroundColor: new_theme.palette.newSupplementary.SupCloudy }} label={cont?.content.contentType || "-"} />} />
                            </Box>
                            {(cont.content.date || userPermissions.bcTrainer.access) && <Box className="box_flex mb_2" sx={{textWrap:'nowrap'}}>
                                {userPermissions?.bcTrainer?.access && (currentSession?.examiners?.find(e=>e._id===user?.id)) &&  <ListItemText className='text-right pr_3 p_0' primary={<Typography className="mb-flex" variant="subtitle1" component="span" sx={{ fontWeight: '600' }}>{t("Schedule event")} 
                                    <ListItemText className='event-type-mb' primary={<Chip style={{ fontSize: '14px', backgroundColor: new_theme.palette.newSupplementary.SupCloudy }} label={cont?.content?.eventType || "-"} />} />
                                </Typography>} />}
                                {userPermissions?.bcCoach?.access && !(currentSession?.examiners?.find(e=>e._id===user?.id)) && <ListItemText className='text-right pr_3 p_0' primary={<Typography className="mb-flex" variant="subtitle1" component="span" sx={{ fontWeight: '600' }}>{t("Scheduled at")}
                                    <ListItemText className='event-type-mb' primary={<Chip style={{ fontSize: '14px', backgroundColor: new_theme.palette.newSupplementary.SupCloudy }} label={cont?.content?.eventType || "-"} />} />
                                </Typography>} />}
                                
                                <ListItemText  
                                className='text-right pr_5 p_0 calender-label' primary={
                                        <Typography variant="body4" component="span" sx={{ border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, borderRadius: '8px', padding: '5px 10px', cursor: 'pointer' }}
                                            onClick={() => {
                                                if (userPermissions.bcTrainer.access) {
                                                    let event = {
                                                        eventType: "Exam",
                                                        assignedContent: cont?.content._id,
                                                        assignedChapter: chapter.chapter._id,
                                                        assignedTrainer: F_getHelper().user.id

                                                    }
                                                    console.log('XXXXXXXXXXXXXX====', cont)
                                                    if (cont?.content?.events?.length) {
                                                        event = cont?.content.events[0]// the leatest
                                                    }
                                                    setEventHelper(p => {
                                                        return ({
                                                            ...p, event: { ...p.event, ...event }, isOpen: true
                                                        })
                                                    });
                                                }
                                            }}

                                        >
                                            
                                            {cont.content.date ? F_getLocalTime(cont?.content?.date, true) : "Click to add event"}
                                            <BiCalendarEvent style={{ marginLeft: '10px', width: '20px', height: '20px', verticalAlign: 'text-top', color: new_theme.palette.newSupplementary.NSupText }} />
                                        </Typography>} />
                            </Box>}
                            {
                                !userPermissions.bcTrainer.access &&  
                                <Box className="box_flex" sx={{mr: 2}}>
                                    <ListItemText className='text-right pr_3' primary={<Typography variant="body4" component="span" sx={{ fontWeight: '600' }}>{t("Status")}</Typography>} />
                                    {cont?.content?.status ? cont?.content?.status : "TO DO"}
                                </Box>
                            }
                                <StyledEIconButton className="mb_3" color="primary" size="medium"
                                    onClick={(e)=>NavigateRoute(cont.content, e)}
                                >
                                    {!(userPermissions.isTrainee && cont.content.hideFromTrainees === true) && (
                                        <KeyboardArrowRightIcon />
                                    )}
                                </StyledEIconButton>
                            {/* <KeyboardArrowRightIcon onClick={(e) => {
                                if(cont.content.eventId) NavigateRoute(cont, e)
                                // else if(userPermissions.bcTrainer.access) navigate(`/my-courses/preview/?tmId=${currentContent.trainingModule}&groupId=${groupId}&chId=${currentContent.chapter}&cId=${cont.content._id}`) //TODOJULY
                                else F_showToastMessage("Event is not available yet")}} sx={{height: '32px', width: '32px', padding: '3px', border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, borderRadius:'50%'}} />
                            {/* <IconButton style={{ height: "15px", width: "15px", color: new_theme.palette.newSupplementary.NSupText }} onClick={() => setContentDetailsHelper({ isOpen: true, contentId: cont.content._id })}> */}
                            {/* <IconButton style={{ height: "15px", width: "15px", color: new_theme.palette.newSupplementary.NSupText }}> */}
                                {/* {!(userPermissions.isTrainee && cont.content.hideFromTrainees === true) && (<ArrowForwardIosIcon onClick={(e) => {NavigateRoute(cont, e)}} />)} */}
                                
                            {/* </IconButton> */}
                        </div>
                        {/* <ListItemText className='text-right pr-5' primary={<Typography variant="" component="">{`${cont?.content.durationTime || 0} h`}</Typography>}/> */}

                    </ListItem>
                </div>)}
        </Draggable>   
    )) : (
        <Paper elevation={10}
            className="d-flex flex-grow-1 align-items-center justify-content-center">
            {t("No data")}
        </Paper>);

    return (
        <ThemeProvider theme={new_theme}>
            <DragDropContext onDragEnd={handleOnDragEndContent}>
                <Droppable droppableId={`droppableContent-1`}>
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {contentsList}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <ManageContents
                manageContentHelper={manageContentHelper}
                setManageContentHelper={setManageContentHelper}
                chosenContents={chapter.chosenContents}
                updateChapter={updateChapter}
            />
        </ThemeProvider>
    )
}