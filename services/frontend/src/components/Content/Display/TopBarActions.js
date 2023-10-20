import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { io } from 'socket.io-client';

//Contexts
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


// Styled components
import { NewEIconButton } from "new_styled_components";
import { EButton } from "styled_components";

import ETextField from "styled_components/TextField";
import EUserAvatar from "styled_components/atoms/UserAvatar";
import ESvgIcon from "new_styled_components/SvgIcon";
import OptionsButton from "components/common/OptionsButton";

// Other components
import FileDrawer from "./FileDrawer"
import AttendeesDrawer from "./AttendeesDrawer"
import ListItemOptionsButton from "components/Item/ListItemOptionsButton"

// Services
import ContentService from "services/content.service";
import EventService from "services/event.service";
import LogService from "services/log.service";
import GroupService from "services/group.service";

// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';


// Icons
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as BoardIcon } from 'icons/icons_32/Board_32.svg';
import { ReactComponent as EditIcon } from 'icons/icons_32/Edit_32.svg';
import { ReactComponent as CalendarIcon } from 'icons/icons_32/Calendar_32.svg';
import { ReactComponent as ResultsIcon } from 'icons/icons_32/Menu statiscts_32.svg';
import { ReactComponent as FullscreenIcon } from 'icons/icons_32/Fullscreen_32.svg';
import { ReactComponent as LockIcon } from 'icons/icons_32/Lock_32.svg';
import { ReactComponent as UnlockIcon } from 'icons/icons_32/Unlock_32.svg';
import { ReactComponent as AttachmentIcon } from 'icons/icons_32/Attachment_32.svg';


import { ReactComponent as AddIcon } from 'icons/icons_32/Add_32.svg';
import { ReactComponent as RemoveIcon } from 'icons/icons_32/Remove _32.svg';
import { ReactComponent as CopyIcon } from 'icons/icons_32/Copy_32.svg';

// MUI v5
import { Box, Grid, Typography, Menu } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";

const palette = new_theme.palette

function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}



export default function TopBarActions({ content, event, isStartingPage, currentPageNumber, reloadEvent = () => { }, reloadContent = () => { }, isContentFactory }) {
    const { F_getErrorMessage, F_showToastMessage, F_handleSetShowLoader, F_getHelper } = useMainContext();
    const { user, userPermissions, manageScopeIds } = F_getHelper();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const isSmUp = useIsWidthUp("sm");
    const isMdUp = useIsWidthUp("md");
    const [openFileDrawer, setOpenFileDrawer] = useState(false)

    const [attendees, setAttendees] = useState([])
    const [attendeesActivity, setAttendeesActivity] = useState([])
    const [openAttendeesDrawer, setOpenAttendeesDrawer] = useState(false)
    // Files attached in the content
    const [files, setFiles] = useState([])

    // Video/audio meeting online
    const [isMeetingStarted, setIsMeetingStarted] = useState(false)
    const [isCustomMeetingUrl, setIsCustomMeetingUrl] = useState(false);
    const [customMeetingUrlError, setCustomMeetingUrlError] = useState('');

    const [meetingUrl, setMeetingUrl] = useState();
    const [meetingDetails, setMeetingDetails] = useState();
    const [meetingAttendeesCount, setMeetingAttendeesCount] = useState(0)

    const [meetingMenuElement, setMeetingMenuElement] = useState(null);
    const openMeetingMenu = Boolean(meetingMenuElement);

    const currentPageNumberRef = useRef(0);
    const socket = useRef();
    const stopTrackRef = useRef(() => { });

    // Properties passed in program preview
    const params = new URLSearchParams(window.location.search)
    const tmId = params.get('tmId');
    const chId = params.get('chId');
    const groupId = params.get('groupId');
    const [group, setGroup] = useState()

    // Modal window with event
    const [eventForDialog, setEventForDialog] = useState(false)
    const [openEventDialog, setOpenEventDialog] = useState(false)


    // Meeting buttons
    const buttonsBeforeStarting = []
    const buttonsAfterStarting = []
    if (userPermissions.isTrainer && !isCustomMeetingUrl) buttonsBeforeStarting.push({ id: 1, icon: <SvgIcon viewBox="5 5 22 22" component={AddIcon} />, name: t("Add external link to the meeting"), disabled: 0, action: () => { setIsCustomMeetingUrl(true) } })
    if (userPermissions.isTrainer && isCustomMeetingUrl) buttonsBeforeStarting.push({
        id: 2, icon: <SvgIcon viewBox="5 5 22 22" component={RemoveIcon} />, name: t("Remove external link to the meeting"), disabled: 0, action: () => {

            // Remove the link from database
            // Set meeting status to false
            setIsMeetingStarted(false)
            setIsCustomMeetingUrl(false)
            setMeetingUrl(undefined)
            setMeetingDetails(undefined)
        }
    })
    if (isMeetingStarted) {


        buttonsAfterStarting.push({
            id: 3, icon: <SvgIcon viewBox="0 0 32 32" component={CopyIcon} />, name: t("Copy link to the meeting"), disabled: 0, action: () => {
                if (!navigator.clipboard) {
                    F_showToastMessage(t("You must use HTTPS connection to copy the link"))
                } else {
                    navigator.clipboard.writeText(meetingUrl)
                    F_showToastMessage(t("Link was copied to clipboard"))
                }
            }
        })

        if (userPermissions.isTrainer) buttonsAfterStarting.push({ id: 2, icon: <SvgIcon viewBox="5 5 22 22" component={RemoveIcon} />, name: t("Close the meeting"), disabled: !userPermissions.isTrainer, action: () => endMeeting() })
    }

    // Check if string is a valid http URL
    function isValidHttpUrl(string) {
        let url;
        try {
            url = new URL(string);
        } catch (_) {
            return false;
        }
        return url.protocol === "http:" || url.protocol === "https:";
    }

    async function loadFilesDetails() {
        var files = []
        for (let page of content.pages) {
            if (page.elements) {
                for (let element of page.elements) {
                    if (element.subtype == 'file') {
                        let response = await ContentService.getFileDetails(element.file).catch(err => {
                            F_showToastMessage("Could not load one of the files.", 'error')
                        })

                        files.push(response.data)
                    }
                }
            }
        }
        setFiles(files)
    }


    // Socket
    useEffect(() => {
        // Only for event or content opened in program preview(groupId)
        if (user && !isContentFactory && (event || content)) {
            let listenAction, emitAction, object, initAttendees;
            if (event) { // Event - list of user from assignedGroup
                listenAction = "eventActivityUpdated"
                emitAction = "updateEventActivity"
                object = event
                initAttendees = [...object.assignedGroup.trainees]
            } else {// Content in program - list of user from groupId->group
                listenAction = "contentActivityUpdated"
                emitAction = "updateContentActivity"
                object = content
                initAttendees = group ?? []
            }

            // Initialize socket connection
            socket.current = io('', {
                reconnectionDelayMax: 10000,
                auth: { token: "123" },
                query: { "my-key": "my-value" }
            });

            // Whenever object was updated
            socket.current.on(`${listenAction}_${object._id}`, (data) => {
                if (object.canExamine) {
                    // Update attendees activity
                    let updatedAttendees = initAttendees
                    let updatedAttendeesIds = updatedAttendees.map(a => a._id)
                    data.attendees.forEach(attendee => {
                        let index = updatedAttendeesIds.indexOf(attendee._id)
                        if (index > -1) {
                            // Get seconds since the last activity
                            let isActive = false
                            let lastActiveInSeconds = undefined
                            if (attendee.lastActive) {
                                lastActiveInSeconds = (new Date().getTime() - new Date(attendee.lastActive).getTime()) / 1000
                                isActive = lastActiveInSeconds < 10;
                            }
                            updatedAttendees[index] = { ...updatedAttendees[index], ...attendee, lastActiveInSeconds: lastActiveInSeconds, isActive: isActive }
                        }
                    })

                    // Sort users - first active, then connected then never connected
                    let active = updatedAttendees.filter(a => a.isActive)
                    let connected = updatedAttendees.filter(a => !a.isActive && a.time)
                    let notConnected = updatedAttendees.filter(a => !a.isActive && !a.time)
                    setAttendees(active.concat(connected).concat(notConnected))
                }

                // Only for custom meeting urls from database
                if (data.meetingUrl) {
                    setIsCustomMeetingUrl(true)
                    setIsMeetingStarted(true)
                    setMeetingDetails(data.meetingDetails)
                    setMeetingUrl(data.meetingUrl)
                    setMeetingAttendeesCount(0)
                } else { // For default BBB
                    // Do not do it for trainer - as he might have opened a tab with custom url
                    if (!userPermissions.isTrainer) setIsCustomMeetingUrl(false)
                    setMeetingAttendeesCount(data.meetingAttendeesCount)
                    setIsMeetingStarted(data.isMeetingStarted)
                }

            });

            // Tracking activity of each user inside this object and emit this activity via socket
            // it returns stopTrack function
            socket.current.emit(emitAction, object._id, user.id, { time: 0, awayTime: 0, inactiveTime: 0, awayCount: 0, inactiveCount: 0 });
            stopTrackRef.current = LogService.trackUser(
                function (time, awayTime, inactiveTime, awayCount, inactiveCount) {
                    // As callback - emit change via socket for other users
                    socket.current.emit(emitAction, object._id, user.id, { time: time, awayTime: awayTime, inactiveTime: inactiveTime, awayCount: awayCount, inactiveCount: inactiveCount, currentPageNumber: currentPageNumberRef.current },);
                }
                , 10, // interval
                false // logging
            );


            return () => {// Stop tracking
                console.log("Removing activity interval", listenAction)
                stopTrackRef.current()
                socket.current.off(`${listenAction}_${object._id}`)
            }
        }
    }, [event, content, group]);


    useEffect(() => {
        if (!group && content.canExamine && groupId) {
            GroupService.getGroup(groupId).then(res => {
                setGroup(res.data.trainees)
            }).catch(error => {
                console.error(error)
            })
        }
    }, [content, groupId])


    useEffect(() => {// Update reference for currentPageNumber
        currentPageNumberRef.current = currentPageNumber
    }, [currentPageNumber])

    useEffect(() => {
        if (content?.pages) {
            loadFilesDetails()
        }
    }, [content])


    useEffect(() => {
        if (event && !isCustomMeetingUrl) {
            updateMeetingStatus()
        }
    }, [isCustomMeetingUrl])

    // Check if meeting is running and set url if it is
    // Used only for default tool - BigBlueButton
    const updateMeetingStatus = (callback) => {
        if (isCustomMeetingUrl) return
        EventService.getMeetingDetails(event._id).then(res => {
            // Meeting is running
            if (res.data) {
                setMeetingDetails(res.data)
                // Generate new link
                EventService.getMeetingUrl(event._id).then(res => {
                    setMeetingUrl(res.data)
                    setIsMeetingStarted(true)
                    if (callback) callback(res.data)
                    //window.open(res.data, "_blank")
                }, err => {
                    F_showToastMessage(t("Could not generate link for the meeting"), 'error')
                    setMeetingUrl(undefined)
                    setIsMeetingStarted(false)
                })
            } else {
                setMeetingUrl(undefined)
                setMeetingDetails(undefined)
                setIsMeetingStarted(false)
            }
        }, err => {
            setMeetingUrl(undefined)
            setMeetingDetails(undefined)
            setIsMeetingStarted(false)
        })
    }

    // Join meeting
    const joinMeeting = () => {
        if (isCustomMeetingUrl) {
            window.open(meetingUrl, "_blank");
        } else {
            updateMeetingStatus(
                // Open in new tab
                (url) => {
                    window.open(url, "_blank");
                })
        }
        setMeetingMenuElement(null)
    }

    // Start a new meeting
    const startMeeting = () => {
        if (isCustomMeetingUrl) {
            if (!isValidHttpUrl(meetingUrl)) {
                setCustomMeetingUrlError(t("Invalid address for the meeting"))
                return
            }
            setCustomMeetingUrlError(undefined)
            EventService.startMeeting(event._id, meetingUrl, meetingDetails).then(
                res => {
                    setIsMeetingStarted(true)
                    joinMeeting()
                },
                err => {
                    F_showToastMessage(t("Could not start the meeting"), 'error')
                }
            )
        } else { // Default BBB meeeting 
            EventService.startMeeting(event._id).then(res => {
                joinMeeting()
            },
                err => {
                    F_showToastMessage(t("Could not start the meeting"), 'error')
                })
        }
    }

    // End an meeting
    const endMeeting = () => {
        EventService.endMeeting(event._id).then(res => {
            setMeetingAttendeesCount(0)
            setIsMeetingStarted(false)
            setIsCustomMeetingUrl(false)
            setMeetingUrl(undefined)
            setMeetingDetails(undefined)
        },
            err => {
                F_showToastMessage(t("Could not end the meeting"), 'error')
            })
    }

    const editContent = () => {
        try {
            window.localStorage.setItem(content.contentType, JSON.stringify(content));
        } catch (error) {
            console.log(error)
        }

        navigate(`/edit-` + content.contentType.toLowerCase() + "/" + content._id)

    }

    // Check if content contains any `locked` element
    let anyLockedElement = (content) => {
        return content?.pages?.some(page => {
            return page.elements.some(element => {
                return element.locked;
            })
        })
    }

    const lockElements = (content) => {
        F_handleSetShowLoader(true)

        ContentService.lockAllElements(content._id).then(
            (response) => {
                reloadContent(content._id)
                F_showToastMessage(t("Locked all elements"), 'success')
            },
            (error) => {
                let errorMessage = F_getErrorMessage(error)
                F_showToastMessage(errorMessage, 'error')
            }
        )
    }

    const unlockElements = (content) => {
        F_handleSetShowLoader(true)
        ContentService.unlockAllElements(content._id).then(
            (response) => {
                reloadContent(content._id)
                F_showToastMessage(t("Unlocked all elements"), 'success')
            },
            (error) => {
                let errorMessage = F_getErrorMessage(error)
                F_showToastMessage(errorMessage, 'error')
            }
        )
    }
    const getAttendeesButton = () => {
        // Width of single avatar
        let avatarWidth = 24
        //Paddings
        let paddingLeft = 8
        let paddingRight = 8

        // How many user avatars should be visible on the top bar
        let maxToShow = isMdUp ? 5 : 3
        // Number of trainees for which we don't show avatars
        let aboveMax = 0
        if (attendees.length > maxToShow) aboveMax = attendees.length - maxToShow
        // Number of trainees for which we show avatars
        let toShow = aboveMax ? maxToShow : attendees.length

        // Width for place to display this number
        let aboveMaxNumberWidth = (aboveMax >= 10 ? 29 : 19)

        // Avatar on the right overflowes the avatar on the left
        let avatarOverflowWidth = 8
        let avatarVisibleWidth = avatarWidth - avatarOverflowWidth//16

        // Calculate widht of the whole button - start with single avatar
        let width = paddingLeft + avatarWidth + paddingRight;


        if (toShow > 1) {
            width += (toShow - 1) * avatarVisibleWidth
        }

        if (aboveMax) width += aboveMaxNumberWidth
        return <>

            <NewEIconButton size="medium" color="secondary"
                sx={{ ml: 1, backgroundColor: palette.shades.white70, width: `${width}px !important`, height: '100%', padding: 0, boxSizing: 'content-box', borderRadius: '16px' }}
                onClick={() => setOpenAttendeesDrawer(true)}
            >
                {attendees.slice(0, maxToShow).map((u, index) => {
                    let avatarColor = undefined;// Red by default
                    if (u.lastActive) avatarColor = new_theme.palette.primary.yellow
                    if (u.lastActive && u.isActive) avatarColor = new_theme.palette.primary.green
                    return <EUserAvatar key={index} color={avatarColor} name={u.name} surname={u.surname} sx={{ position: 'absolute', left: `${paddingLeft + avatarVisibleWidth * index}px` }}></EUserAvatar>
                })}
                {aboveMax > 0 &&
                    <Typography sx={{ ...new_theme.typography.p, fontSize: '14px', pl: '2px', color: palette.primary.darkViolet, position: 'absolute', right: `${paddingLeft}px` }}>
                        {`+${aboveMax}`}
                    </Typography>
                }
            </NewEIconButton>
            {
                isSmUp && (
                    <Typography variant="h2" component="h2" sx={{ ml: 1, mr: 2, fontSize: "12px", marginTop: "auto", marginBottom: "auto", color: new_theme.palette.neutrals.white }}>
                        {manageScopeIds.isTrainingCenter ? t("Attendees") : t("Students")}
                    </Typography>
                )
            }
        </>
    }

    // const navigate = useNavigate()
    const textcopied = (content) => {
        var link = `${window.location.protocol}//${window.location.host}/content/display/${content._id}`
        if (!navigator.clipboard) {
            F_showToastMessage(t("You must use HTTPS connection to copy the link"))
            console.log(link)
        } else {
            navigator.clipboard.writeText(link)
            F_showToastMessage(t("Link was copied to clipboard"))
        }
    }

    return (
        <>
            {/* <ECard sx={{ background: palette.gradients.violet, borderRadius: 0 }}> */}
            <div>
                {event && <>
                    <NewEIconButton size="medium" color="secondary" className="button_1"
                        sx={{
                            border: isMeetingStarted ? `2px solid ${new_theme.palette.primary.green}` : 'none',
                            width: meetingAttendeesCount ? '56px !important' : '',
                            borderRadius: meetingAttendeesCount ? '16px !important' : '',
                            my: '2px', ml: 1, backgroundColor: palette.shades.white70, float: 'right'
                        }}
                        onClick={(event) => {
                            setMeetingMenuElement(event.currentTarget);
                        }}
                    >
                        <ESvgIcon viewBox="0 0 32 32" component={BoardIcon} />
                        {meetingAttendeesCount > 0 && <Typography sx={{ ...new_theme.typography.p, fontSize: '14px', pl: '2px', color: palette.primary.darkViolet }}>
                            {meetingAttendeesCount}
                        </Typography>}
                    </NewEIconButton>
                    {isSmUp && (
                        <Typography variant="h2" component="h2" sx={{ ml: 1, mr: 2, fontSize: "12px", marginTop: "auto", marginBottom: "auto", color: new_theme.palette.neutrals.white }}>
                            {t("Video call")}
                        </Typography>
                    )}

                    <Menu
                        sx={{ mt: '15px', '& .MuiList-root': { p: 0 } }}
                        anchorEl={meetingMenuElement}
                        open={openMeetingMenu}
                        onClose={() => setMeetingMenuElement(null)}>

                        <Grid item xs={12} sx={{ pb: '16px' }}>
                            <Typography sx={{ ...new_theme.typography.p, fontSize: '14px' }}>

                                {t("Video conference")}
                                {isMeetingStarted && <>
                                    <span>{' ' + t("is")}</span>
                                    <span style={{ color: new_theme.palette.primary.green }}>{' ' + t("ON")}</span>
                                </>}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sx={{ pb: '16px' }}>
                            <Typography sx={new_theme.typography.contextualItalic}>
                                {isMeetingStarted ? t("Join the video conference") : t("Video conference was not yet started")}
                            </Typography>
                        </Grid>
                        {isCustomMeetingUrl && <>
                            {userPermissions.isTrainer && <ETextField onKeyDown={(e) => e.stopPropagation()} error={customMeetingUrlError ? true : false} helperText={customMeetingUrlError} disabled={isMeetingStarted} label={t("Meeting URL")} value={meetingUrl} onChange={(event) => setMeetingUrl(event.target.value)} />}
                            {(meetingDetails || userPermissions.isTrainer) && <ETextField onKeyDown={(e) => e.stopPropagation()} disabled={isMeetingStarted || !userPermissions.isTrainer} label={t("Meeting details")} value={meetingDetails} onChange={(event) => setMeetingDetails(event.target.value)} />}
                        </>}
                        <Grid item xs={12} container sx={{ justifyContent: 'flex-end', alignItems: 'center' }}>
                            {isMeetingStarted && <>
                                <EButton onClick={joinMeeting}>{t("Join")}</EButton>
                                {buttonsAfterStarting.length > 0 && <Box sx={{ paddingLeft: '8px' }}><OptionsButton iconButton={true} btns={buttonsAfterStarting} /></Box>}
                            </>}
                            {!isMeetingStarted && <>
                                <EButton disabled={!userPermissions.isTrainer} onClick={startMeeting}>{userPermissions.isTrainer ? t("Start now") : t("Join")}</EButton>
                                {buttonsBeforeStarting.length > 0 && <Box sx={{ paddingLeft: '8px' }}><OptionsButton iconButton={true} btns={buttonsBeforeStarting} /></Box>}
                            </>}

                        </Grid>
                    </Menu>
                </>}
                {/* {content && content.canEdit && !isContentFactory && <>
                    <EIconButton size="medium" color="secondary"
                        sx={{ my: '2px', ml: 1, backgroundColor: palette.shades.white70, float: 'right' }}
                        onClick={editContent}
                    >
                        <ESvgIcon viewBox="5 5 22 22" component={EditIcon}/>
                    </EIconButton>
                    {isSmUp && (
                        <Typography variant="h2" component="h2" sx={{ ml: 1, mr: 2, fontSize: "12px", marginTop: "auto", marginBottom: "auto", color: theme.palette.neutrals.white }}>
                            {t("Edit content")}
                        </Typography>
                    )}
                </>
                } */}
                {content && content.canExamine && !isContentFactory && <>
                    <NewEIconButton size="medium" color="secondary" className="button_2"
                        sx={{ my: '2px', ml: 1, backgroundColor: palette.shades.white70, float: 'right' }}
                        onClick={() => { anyLockedElement(content) ? unlockElements(content) : lockElements(content) }}
                    >
                        {anyLockedElement(content) && <ESvgIcon viewBox="0 0 32 32" component={UnlockIcon} />}
                        {!anyLockedElement(content) && <ESvgIcon viewBox="0 0 32 32" component={LockIcon} />}
                    </NewEIconButton>
                    {isSmUp && (
                        <Typography variant="h2" component="h2" sx={{ ml: 1, mr: 2, fontSize: "12px", marginTop: "auto", marginBottom: "auto", color: new_theme.palette.neutrals.white }}>
                            {anyLockedElement(content) ? t("Unlock materials") : t("Lock materials")}
                        </Typography>
                    )}
                </>}


                {!isStartingPage && files.length > 0 && <>
                    <NewEIconButton size="medium" color="secondary" className="button_4"
                        sx={{ my: '2px', ml: 1, backgroundColor: palette.shades.white70, float: 'right' }}
                        onClick={() => setOpenFileDrawer(true)}
                    >
                        <ESvgIcon viewBox="-2 -2 14 26" component={AttachmentIcon} />
                    </NewEIconButton>
                    {isSmUp && (
                        <Typography variant="h2" component="h2" sx={{ ml: 1, mr: 2, fontSize: "12px", marginTop: "auto", marginBottom: "auto", color: new_theme.palette.neutrals.white }}>
                            {t("Help materials")}
                        </Typography>
                    )}
                    <FileDrawer open={openFileDrawer} setOpen={setOpenFileDrawer} files={files}></FileDrawer>
                </>}

                {(event?.canExamine || content.canExamine) && attendees.length > 0 && <>
                    {getAttendeesButton()}
                    <AttendeesDrawer open={openAttendeesDrawer} setOpen={setOpenAttendeesDrawer} attendees={attendees}></AttendeesDrawer>
                </>}

                {!isContentFactory && <>

                    {
                        <>
                            {/* <ListItemOptionsButton className="button_5" sx={{ my: '2px', ml: 1 }} isInProgram={content.origin ? true : false}
                                element={event ? event : content}
                                deleteElementCallback={() => { navigate() }}
                                editElementCallback={() => {
                                    if (event) reloadEvent(event._id)
                                    else reloadContent(content._id)
                                }}
                                size="medium" iconButton={true} /> */}

                            {/* <StyledButton eVariant="secondary" eSize="large" onClick={() => textcopied(content)} sx={{mt: {sm: 0, xs: 3}, minWidth:'155px'}}>
                                <ESvgIcon viewBox="0 0 32 32" component={CopyIcon} style={{ fontSize: '25px'}} color={new_theme.palette.secondary.Turquoise} /> &nbsp;{t("Copy Link")}
                            </StyledButton> */}
                        </>
                    }
                    {/* {isSmUp && (
                        <Typography variant="h2" component="h2" sx={{ ml: 1, mr: 2, fontSize: "12px", marginTop: "auto", marginBottom: "auto", color: new_theme.palette.neutrals.white }}>
                            {t("More")}
                        </Typography>
                    )} */}
                </>}
            </div>
            {/* </ECard> */}
        </>
    )
}