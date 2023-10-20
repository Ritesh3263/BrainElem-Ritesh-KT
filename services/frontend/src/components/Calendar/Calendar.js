import React, { useState, useEffect, useRef, Fragment, createElement } from 'react';
import styles from './styles.module.scss';
import helperFunctions from './helpers/functions';
import translations from './helpers/translations';
import { now } from "moment";
import EventTypeSidebar from "./helpers/EventTypeSidebar"
import SessionService from "../../services/certification_session.service";
import { useMainContext } from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';
import PlayLessonIcon from '@mui/icons-material/PlayLesson';
// import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StyledButton from 'new_styled_components/Button/Button.styled';
import { Typography, Box } from '@mui/material';
import { new_theme } from 'NewMuiTheme';
// -1 = ANIMATE CLOSING | 0 = NOTHING | 1 = ANIMATE OPENING.
let animatingSidebar = 0;
let animatingDetail = 0;

const RevoCalendar = ({ style = {}, className = '', events, highlightToday = true, lang = 'en', primaryColor = new_theme.palette.primary.MedPurple, secondaryColor = new_theme.palette.newSupplementary.NSupText, todayColor = new_theme.palette.secondary.DarkPurple, textColor = new_theme.palette.newSupplementary.NSupText, indicatorColor = 'orange', animationSpeed = 300, sidebarWidth = 227, detailWidth = 450, showDetailToggler = true, detailDefault = false, showSidebarToggler = true, sidebarDefault = false, onePanelAtATime = false, allowDeleteEvent = true, allowAddEvent = true, openDetailsOnDateSelection = true, timeFormat24 = true, showAllDayLabel = false, detailDateFormat = 'DD/MM/YYYY', languages = translations, date = new Date(), dateSelected = () => { }, eventSelected = () => { }, addEvent, updateEvent, addEventHelper, currentSession = {} }) => {

    const { t, i18n, translationsLoaded } = useTranslation();
    const navigate = useNavigate();
    // TRANSFORM ANY PASSED COLOR FORMAT INTO RGB.
    const primaryColorRGB = helperFunctions.getRGBColor(primaryColor);
    const secondaryColorRGB = helperFunctions.getRGBColor(secondaryColor);
    const todayColorRGB = helperFunctions.getRGBColor(todayColor);
    const indicatorColorRGB = helperFunctions.getRGBColor(indicatorColor);
    const textColorRGBA = helperFunctions.getRGBColor(textColor);
    const calendarRef = useRef(null);
    const { F_getHelper } = useMainContext();
    const { userPermissions, user } = F_getHelper();


    // GET CALENDAR SIZE HOOK.
    function useCalendarSize() {
        const [size, setSize] = useState([0, 0]);
        useEffect(() => {
            function updateSize() {
                if (calendarRef.current != null) {
                    setSize([
                        calendarRef.current.offsetWidth,
                        calendarRef.current.children[0].scrollHeight
                    ]);
                }
            }
            window.addEventListener('resize', updateSize);
            updateSize();
            return () => window.removeEventListener('resize', updateSize);
        }, [calendarRef.current]);
        return size;
    }
    const [calendarWidth, sidebarHeight] = useCalendarSize();
    // IF CALENDAR WIDTH CAN'T FIT BOTH PANELS, FORCE ONE PANEL AT A TIME.
    if (calendarWidth <= 470 + sidebarWidth + detailWidth) {
        // console.log("---------------------------")
        // console.log("calendarWidth",calendarWidth)
        // console.log("sidebarWidth",sidebarWidth)
        // console.log("detailWidth",detailWidth)
        onePanelAtATime = true;
        // IF BOTH SIDEBAR AND DETAIL PANELS ARE SET TO BE OPEN BY DEFAULT, SIDEBAR WILL HAVE PRIORITY.
        if (sidebarDefault && detailDefault) {
            detailDefault = false;
        }
    }
    // IN ORDER TO MAKE IT RESPONSIBLE, PANELS WILL FLOAT ON TOP OF CALENDAR ON LOW RES.
    const floatingPanels = calendarWidth <= 470 + sidebarWidth || calendarWidth <= 470 + detailWidth;
    // IF, WITH THE CURRENT SETTING, THE SIDEBAR OR DETAIL PANELS WON'T FIT THE SCREEN, MAKE THEM SMALLER.
    sidebarWidth =
        calendarWidth < sidebarWidth + 50 ? calendarWidth - 50 : sidebarWidth;
    detailWidth =
        calendarWidth < detailWidth + 50 ? calendarWidth - 50 : detailWidth;
    // USE TODAY AS DEFAULT SELECTED DATE IF PASSED DATE IS INVALID.
    if (!helperFunctions.isValidDate(date)) {
        console.log('The passed date prop is invalid');
        date = new Date();
    }
    // SET INITIAL STATE.
    const [currentDay, setDay] = useState();
    const [currentMonth, setMonth] = useState(date.getMonth());
    const [currentYear, setYear] = useState(date.getFullYear());
    const [sidebarOpen, setSidebarState] = useState(sidebarDefault);
    const [detailsOpen, setDetailsState] = useState(detailDefault);


    // GIVE PARENT COMPONENT THE CURRENT SELECTED CALENDAR DAY.
    useEffect(() => {
        dateSelected({
            day: currentDay,
            month: currentMonth,
            year: currentYear
        });
    }, [currentDay, currentMonth, currentYear]);
    // CLOSE DETAILS IF CAN'T FIT IT ANYMORE AFTER RESIZING.
    useEffect(() => {
        if (sidebarOpen &&
            detailsOpen &&
            calendarWidth <= 470 + sidebarWidth + detailWidth) {
            animatingDetail = -1;
            setDetailsState(false);
        }
    }, [calendarWidth]);

    /***********************
     * CALENDAR COMPONENTS *
     ***********************/
    function CalendarSidebar() {
        function prevYear() {
            setYear(currentYear - 1);
        }
        function nextYear() {
            setYear(currentYear + 1);
        }
        // MAKE SURE NO ANIMATION WILL RUN ON NEXT RE-RENDER.
        function animationEnd() {
            animatingSidebar = 0;
        }
        function toggleSidebar() {
            animatingSidebar = sidebarOpen ? -1 : 1;
            setSidebarState(!sidebarOpen);
            // FORCE DETAILS TO CLOSE IF onePanelAtATime IS true.
            if (animatingSidebar === 1 && onePanelAtATime && detailsOpen) {
                animatingDetail = -1;
                setDetailsState(false);
            }
        }
        function ChevronButton({ angle, color, action }) {
            return (createElement("button", { onClick: action },
                createElement("svg", { "aria-hidden": 'true', focusable: 'false', width: '1em', height: '1em', style: { transform: `rotate(${angle}deg)` }, preserveAspectRatio: 'xMidYMid meet', viewBox: '0 0 8 8' },
                    createElement("path", { d: 'M1.5 1L0 2.5l4 4l4-4L6.5 1L4 3.5L1.5 1z', fill: new_theme.palette.primary.PWhite }),
                    createElement("rect", { x: '0', y: '0', width: '5', height: '5', fill: new_theme.palette.primary.PBlack }))));
        }
        return (createElement(Fragment, null,
            createElement("div", { className: `${styles.sidebar}  ${animatingSidebar === 1 && styles.slideInLeft} ${animatingSidebar === -1 && styles.slideOutLeft} ${sidebarOpen ? styles.defaultOpen : styles.defaultClosed} ${floatingPanels ? styles.floating : ''}`, onAnimationEnd: animationEnd },
                createElement("div", { className: styles.yearSelectParent },
                createElement("div", { className: styles.yearSelect },
                    (createElement("button", { action: prevYear, className: `${styles.prevYear}` },
                        createElement("svg", { width: '32', height: '32', viewBox: '0 0 32 32' },
                            createElement("circle", { cx: "16", cy: "16", r: "15.5", fill: "white", stroke: new_theme.palette.newSecondary.NSIconBorder }),
                            createElement("path", {
                                fill: new_theme.palette.neutrals.blackgrey, d: 'M18.7501 18.9064L15.8401 15.9964L18.7501 13.0864C19.0426 12.7939 19.0426 12.3214 18.7501 12.0289C18.4576 11.7364 17.9851 11.7364 17.6926 12.0289L14.2501 15.4714C13.9576 15.7639 13.9576 16.2364 14.2501 16.5289L17.6926 19.9714C17.9851 20.2639 18.4576 20.2639 18.7501 19.9714C19.0351 19.6789 19.0426 19.1989 18.7501 18.9064Z'
                            })))),
                    createElement("span", null, currentYear),
                    (createElement("button", { action: prevYear, className: `${styles.prevYear}` },
                        createElement("svg", { width: '32', height: '32', viewBox: '0 0 32 32' },
                            createElement("circle", { cx: "16", cy: "16", r: "15.5", fill: "white", stroke: new_theme.palette.newSecondary.NSIconBorder }),
                            createElement("path", {
                                fill: new_theme.palette.neutrals.blackgrey, d: 'M14.2501 18.9064L17.1601 15.9964L14.2501 13.0864C13.9576 12.7939 13.9576 12.3214 14.2501 12.0289C14.5426 11.7364 15.0151 11.7364 15.3076 12.0289L18.7501 15.4714C19.0426 15.7639 19.0426 16.2364 18.7501 16.5289L15.3076 19.9714C15.0151 20.2639 14.5426 20.2639 14.2501 19.9714C13.9651 19.6789 13.9576 19.1989 14.2501 18.9064Z'
                            }))
                            ))),
                createElement("div", { className:`${styles.mb_scroll}`}, null,
                    createElement("ul", null, languages[i18n.language].months.map((month, i) => {
                        return (createElement("li", { key: i },
                            createElement("button", { className: i === currentMonth ? styles.currentMonth : '', onClick: () => setMonth(i) }, month)));
                    }))
                ),

                
                createElement("button", { onClick: toggleSidebar, className: `${styles.closeBtn}` }, languages[i18n.language].close),





                ),
                showSidebarToggler && 
                createElement("div", { className: styles.btnParent },
                    (createElement("button", { onClick: toggleSidebar, className: `${styles.closeSidebar}  ${animatingSidebar === 1 && styles.sidebarTogglerSlideIn} ${animatingSidebar === -1 && styles.sidebarTogglerSlideOut} ${sidebarOpen ? styles.defaultOpen : styles.defaultClosed}` },
                        createElement("svg", { width: '32', height: '32', viewBox: '0 0 32 32' },
                            createElement("circle", { cx: "16", cy: "16", r: "15.5", fill: "white", stroke: new_theme.palette.newSecondary.NSIconBorder }),
                                createElement("path", {
                                fill: new_theme.palette.neutrals.blackgrey, d: 'M19.75 8.5C19.3375 8.5 19 8.8375 19 9.25V10H13V9.25C13 8.8375 12.6625 8.5 12.25 8.5C11.8375 8.5 11.5 8.8375 11.5 9.25V10H10.75C9.9175 10 9.2575 10.675 9.2575 11.5L9.25 22C9.25 22.825 9.9175 23.5 10.75 23.5H21.25C22.075 23.5 22.75 22.825 22.75 22V11.5C22.75 10.675 22.075 10 21.25 10H20.5V9.25C20.5 8.8375 20.1625 8.5 19.75 8.5ZM21.25 22H10.75V14.5H21.25V22ZM15.25 16.75C15.25 16.3375 15.5875 16 16 16C16.4125 16 16.75 16.3375 16.75 16.75C16.75 17.1625 16.4125 17.5 16 17.5C15.5875 17.5 15.25 17.1625 15.25 16.75ZM12.25 16.75C12.25 16.3375 12.5875 16 13 16C13.4125 16 13.75 16.3375 13.75 16.75C13.75 17.1625 13.4125 17.5 13 17.5C12.5875 17.5 12.25 17.1625 12.25 16.75ZM18.25 16.75C18.25 16.3375 18.5875 16 19 16C19.4125 16 19.75 16.3375 19.75 16.75C19.75 17.1625 19.4125 17.5 19 17.5C18.5875 17.5 18.25 17.1625 18.25 16.75ZM15.25 19.75C15.25 19.3375 15.5875 19 16 19C16.4125 19 16.75 19.3375 16.75 19.75C16.75 20.1625 16.4125 20.5 16 20.5C15.5875 20.5 15.25 20.1625 15.25 19.75ZM12.25 19.75C12.25 19.3375 12.5875 19 13 19C13.4125 19 13.75 19.3375 13.75 19.75C13.75 20.1625 13.4125 20.5 13 20.5C12.5875 20.5 12.25 20.1625 12.25 19.75ZM18.25 19.75C18.25 19.3375 18.5875 19 19 19C19.4125 19 19.75 19.3375 19.75 19.75C19.75 20.1625 19.4125 20.5 19 20.5C18.5875 20.5 18.25 20.1625 18.25 19.75Z'
                    }   )   )
                )
            ))
            ),
            
        ));
    }
    function CalendarInner() {
        // GET LIST OF DAYS ON EACH MONTH ACCOUNTING FOR LEAP YEARS.
        const daysInMonths = helperFunctions.isLeapYear(currentMonth, currentYear);
        const days = [];
        for (let index = 1; index <= daysInMonths[currentMonth]; index++) {
            var isToday = helperFunctions.isToday(index, currentMonth, currentYear);
            var isSaturday = helperFunctions.isSaturday(index, currentMonth, currentYear);
            var isSunday = helperFunctions.isSunday(index, currentMonth, currentYear);
            var highlight = isToday && highlightToday;
            var hasEvent = false;
            for (let indexEvent = 0; indexEvent < events.length; indexEvent++) {
                const currentDate = new Date(currentYear, currentMonth, index);
                // TAKE OUT TIME FROM PASSED TIMESTAMP IN ORDER TO COMPARE ONLY DATE
                var tempDate = new Date(events[indexEvent].date);
                tempDate.setHours(0, 0, 0, 0);
                if (tempDate.getTime() === currentDate.getTime()) {
                    hasEvent = true;
                    break;
                }
            }
            // eslint-disable-next-line no-loop-func
            const day = (createElement("button", {
                className: `${highlight ? styles.today : ''} ${index === currentDay ? styles.currentDay : ''} ${isSaturday ? styles.saturday : ''} ${isSunday ? styles.sunday : ''}`, onClick: (e) => {
                    e.preventDefault();
                    setDay(index);
                    if (openDetailsOnDateSelection && !detailsOpen) {
                        animatingDetail = 1;
                        setDetailsState(true);
                        // FORCE SIDEBAR TO CLOSE IF onePanelAtATime IS true.
                        if (onePanelAtATime && sidebarOpen) {
                            animatingSidebar = -1;
                            setSidebarState(false);
                        }
                    }
                }
            },
                createElement("span", null, index),
                createElement("span", { className: hasEvent ? styles.indicator : null }, null)
            ));
            days.push(day);
        }
        return (createElement("div", {
            className: styles.inner, onClick: () => {
                if (floatingPanels) {
                    if (sidebarOpen) {
                        animatingSidebar = -1;
                        setSidebarState(false);
                    }
                    else if (detailsOpen) {
                        animatingDetail = -1;
                        setDetailsState(false);
                    }
                }
            }
        },
            createElement("h1", { className: styles.monthName }, languages[i18n.language].months[currentMonth]),
            createElement("div", { className: styles.scrollInner },
                createElement("div", { className: styles.dayNames }, languages[i18n.language].daysShort.map((weekDay) => {
                    return createElement("div", { key: weekDay }, weekDay.toUpperCase());
                })),
                createElement("div", { className: styles.days }, days.map((day, i) => {
                    return (createElement("div", {
                        key: i, className: styles.day, style: i === 0
                            ? {
                                gridColumnStart: helperFunctions.getFirstWeekDayOfMonth(currentMonth, currentYear) + 1
                            }
                            : {}
                    }, day));
                })))));
    }
    function CalendarDetails() {
        var _a, _b;
        var selectedDate = new Date(currentYear, currentMonth, currentDay == undefined ? new Date().getDate() : currentDay);
        // WILL SHOW DELETE EVENT BUTTON ON CURRENT showDelete INDEX. -1 WON'T SHOW ANYTHING
        const [showDelete, setDeleteState] = useState(-1);
        // MAKE SURE NO ANIMATION WILL RUN ON NEXT RE-RENDER.
        function animationEnd() {
            animatingDetail = 0;
        }
        function toggleDetails() {
            animatingDetail = detailsOpen ? -1 : 1;
            setDetailsState(!detailsOpen);
            // FORCE SIDEBAR TO CLOSE IF onePanelAtATime IS true.
            if (animatingDetail === 1 && onePanelAtATime && sidebarOpen) {
                animatingSidebar = -1;
                setSidebarState(false);
            }
        }

        // function returnEventColor(event) {
        //     switch (event) {
        //         case "Online Class": {
        //             return "#2DCB48";
        //         }
        //         case "Project": {
        //             return "#0065F2";
        //         }
        //         case "Homework": {
        //             return "#FFCC00";
        //         }
        //         case "Exam": {
        //             return "#F43319";
        //         }
        //         default: return "#16181E"
        //     }
        // }

        function toggleDeleteButton(i) {
            // GIVE PARENT COMPONENT THE CURRENT SELECTED EVENT.
            eventSelected(i);
            if (allowDeleteEvent) {
                showDelete === i ? setDeleteState(-1) : setDeleteState(i);
            }
        }

        function checkEventIsFinished(eventDate) {
            let newDate = new Date(eventDate)
            if (newDate.getTime() - now() < 0) {
                return false
            } else {
                return true
            }
        }

        function isTraineeCanTakeExam(event) {
            // handle real duration time , change to milliseconds
            let newDate = new Date(event.date)
            let durationTimeMs = event.durationTime * 60000;

            if (event.eventType === "TEST") {
                if ((now() - newDate.getTime()) > 0 && (now() - newDate.getTime()) < durationTimeMs) {
                    return true
                } else {
                    return false
                }
            } else {
                return true;
            }
        }

        function durationTimeHandler(durationTime) {
            if (durationTime) {
                let hours = Math.floor(durationTime / 60);
                let minutes = Math.round(durationTime % 60);
                if (hours < 9) {
                    hours = `0${hours}`
                }
                if (minutes < 9) {
                    minutes = `0${minutes}`
                }
                return `${hours}:${minutes}`
            } else {
                return `00:00`;
            }

        }
        const [openConfirmationDelete, setOpenConfirmationDelete] = React.useState(false);
        // const [dateEvent, setDateEvent] = React.useState([])
        const [anchorEl, setAnchorEl] = React.useState(null);
        const open = Boolean(anchorEl);
        const handleClick = (event) => {
            setAnchorEl(event.currentTarget);
        };
        const handleClose = () => {
            setAnchorEl(null);
        };

        const confirmationDeleteClose = () => {
            setOpenConfirmationDelete(false);
          };
        const deleteConfirmation = () => {
            setOpenConfirmationDelete(true)
        }




        const [anchorEL, setAnchorEL] = React.useState(null);
        const open2 = Boolean(anchorEL);
        const handleClickMore = (event) => {
            setAnchorEL(event.currentTarget);
        };
        const handleCloseMore = () => {
            setAnchorEL(null);
        };

        const formatDate = (date) => {
            let d = new Date(date);
            return d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes();
        }
        const eventDivs = [];
        for (let index = 0; index < events.length; index++) {
            var eventDate = new Date(events[index].date);
            // TAKE OUT TIME FROM PASSED TIMESTAMP IN ORDER TO COMPARE ONLY DATE
            var tempDate = new Date(events[index].date);
            tempDate.setHours(0, 0, 0, 0);
            if (helperFunctions.isValidDate(eventDate) &&
                tempDate.getTime() === selectedDate.getTime()) {
                const event = (createElement("div", { sortKey: events[index].eventType, key: index, className: styles.event, onClick: () => toggleDeleteButton(index) },
                    createElement("p", null, events[index].name),
                    createElement("div", null,
                        events[index].allDay ? (createElement(Fragment, null, showAllDayLabel ? (createElement("div", null,
                            createElement("svg", { width: '20', height: '20', viewBox: '0 0 24 24' },
                                createElement("path", { fill: new_theme.palette.primary.PBlack, d: 'M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 12v-6h-2v8h7v-2h-5z' })),
                            createElement("span", null, languages[i18n.language].allDay))) : (''))) :
                            (helperFunctions.getFormattedTime(eventDate, timeFormat24) === '00:00' ? createElement("div", null, null) :
                                (createElement("div", null,
                                    // createElement("svg", { width: '20', height: '20', viewBox: '0 0 24 24' },
                                    //     createElement("path", { fill: new_theme.palette.primary.PBlack, d: 'M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0-2c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm1 12v-6h-2v8h7v-2h-5z' })),
                                    // createElement("span", null, helperFunctions.getFormattedTime(eventDate, timeFormat24))
                                    createElement("span", { style: {color: new_theme.palette.newSupplementary.NSupText} }, `Start date: `, (createElement("span", { style: { color: new_theme.palette.secondary.SGrey } }, formatDate(events[index].date))))
                                    )))
                        ,
                        events[index].eventType && (createElement("div", null,
                            createElement("svg", { width: '20', height: '20', viewBox: '0 0 24 24' },
                                createElement("path", { fill: new_theme.palette.primary.PBlack, d: (_a = events[index].eventType) === null || _a === void 0 ? void 0 : _a.icon })),
                            // createElement("span", {className: "text-success"}, (_b = events[index].extra) === null || _b === void 0 ? void 0 : _b.text)))),
                            createElement("div", { className: "drpdwn-parent" },
                                createElement("IconButton", { className: "drpdwn-btn" },
                                    <>
                                        {/* {!userPermissions?.bcCoach?.access &&
                                            <>
                                                <MoreVertIcon id="demo-positioned-button"
                                                    aria-controls={open ? 'demo-positioned-menu' : undefined}
                                                    aria-haspopup="true"
                                                    aria-expanded={open ? 'true' : undefined}
                                                    onClick={handleClick} sx={{ border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, cursor: 'pointer', height: '32px', width: '32px', borderRadius: '50%', fontSize: '11px' }} style={{ padding: '3px' }} />
                                                <Menu
                                                    id="demo-positioned-menu"
                                                    aria-labelledby="demo-positioned-button"
                                                    anchorEl={anchorEl}
                                                    open={open}
                                                    onClose={handleClose}
                                                    anchorOrigin={{
                                                        vertical: 'bottom',
                                                        horizontal: 'left',
                                                    }}
                                                    PaperProps={{
                                                        style: {
                                                            width: '140px',
                                                        },
                                                    }}
                                                    className='training_update_del'
                                                >
                                                    <MenuItem sx={{borderBottom: `1px solid ${new_theme.palette.primary.PBorder}`}} onClick={() => addEvent(new Date(currentYear, currentMonth, currentDay),{type:"update", data:events[index]})}>{t("Update")}</MenuItem>
                                                    <MenuItem onClick={deleteConfirmation}>{t("Delete")}</MenuItem>
                                                </Menu>
                                            </>    
                                        } */}
                                        <Dialog
                                            open={openConfirmationDelete}
                                            onClose={confirmationDeleteClose}
                                            PaperProps={{
                                                sx: {
                                                    textAlign: 'center',
                                                    borderRadius: '12px',
                                                    padding: '30px',
                                                    overflow: 'hidden',
                                                    minWidth: {lg:'400px', xs:'80%'},
                                                    
                                                }
                                            }}

                                        >
                                            <Typography variant="h3" component="h4" sx={{color: new_theme.palette.newSupplementary, mb: 3}}>{t("Confirmation")}</Typography>
                                            <Typography variant="body4" component="p" sx={{mb: 5}}>{t("Do you want to delete this event?")}</Typography>
                                            <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                                                <StyledButton eVariant="secondary" eSize="medium" onClick={()=> setOpenConfirmationDelete(false)}>{t("Cancel")}</StyledButton>
                                                <StyledButton eVariant="primary" eSize="medium" onClick={() => updateEvent({ type: "remove", data: events[index]._id })}>{t("Confirm")}</StyledButton>
                                            </Box>
                                        </Dialog>
                                        {events[index]?.durationTime ? <>
                                            { (events[index].creator === user.id || userPermissions.isTrainingManager || userPermissions.bcTrainer.access || currentSession.examiners?.find(e=>e._id===user.id)) && 
                                                <StyledEIconButton color="primary" size="large">
                                                    <MoreVertIcon
                                                        id="demo-positioned-button"
                                                        aria-controls={open ? 'demo-positioned-menu' : undefined}
                                                        aria-haspopup="true"
                                                        aria-expanded={open ? 'true' : undefined}
                                                        onClick={handleClick}
                                                    />
                                                </StyledEIconButton>
                                            }
                                            
                                            <Menu
                                                id="demo-positioned-menu"
                                                aria-labelledby="demo-positioned-button"
                                                anchorEl={anchorEl}
                                                open={open}
                                                onClose={handleClose}
                                                anchorOrigin={{
                                                    vertical: 'bottom',
                                                    horizontal: 'right',
                                                  }}
                                                  transformOrigin={{
                                                    vertical: 'top',
                                                    horizontal: 'right',
                                                  }}
                                                sx={{padding: '0'}}
                                                PaperProps={{
                                                    style: {
                                                        width: '180px',
                                                        padding: '0',
                                                    },
                                                }}
                                            >
                                                {(events[index].creator === user.id || userPermissions.isTrainingManager || userPermissions.bcTrainer.access || currentSession.examiners?.find(e=>e._id===user.id)) && <MenuItem sx={{borderBottom: `1px solid ${new_theme.palette.primary.PBorder}`, color: new_theme.palette.newSupplementary.NSupText, fontSize: '18px'}} onClick={() => addEvent(new Date(currentYear, currentMonth, currentDay),{type:"update", data:events[index]})}>{languages[i18n.language].update}</MenuItem>}
                                                {(events[index].creator === user.id || userPermissions.isTrainingManager || userPermissions.bcTrainer.access || currentSession.examiners?.find(e=>e._id===user.id)) && <MenuItem sx={{fontSize: '18px', color: new_theme.palette.newSupplementary.NSupText,}} onClick={deleteConfirmation}>{languages[i18n.language].delete}</MenuItem>}
                                                 
                                                {/* {
                                    
                                                    (createElement(Fragment, null,
                                                        (events[index].creator === user.id || userPermissions.isTrainingManager || userPermissions.bcTrainer.access || currentSession.examiners?.find(e=>e._id===user.id)) && checkEventIsFinished(events[index].date) && (createElement("MenuItem", {style:{display:'block', paddingLeft:'1rem', fontSize:'1.3rem', cursor:'pointer'} , onClick: () => addEvent(new Date(currentYear, currentMonth, currentDay),{type:"update", data:events[index]}) }, languages[i18n.language].update, )),
                                                        (events[index].creator === user.id || userPermissions.isTrainingManager || userPermissions.bcTrainer.access || currentSession.examiners?.find(e=>e._id===user.id)) && checkEventIsFinished(events[index].date) && (createElement("MenuItem", {style:{display:'block',  paddingLeft:'1rem', fontSize:'1.3rem', cursor:'pointer'} , onClick: () => updateEvent({type:"remove", data:events[index]._id}) }, languages[i18n.language].delete)),                         
                                                    ))
                                                } */}
                                                
                                            </Menu>
                                        </>:null}
                                    </>
                                    // createElement("svg", { width: '32', height: '32', viewBox: '0 0 32 32' },
                                    //     createElement("circle", {cx:"16", cy:"16", r:"15.5", fill:"white", stroke:new_theme.palette.newSecondary.NSIconBorder}),
                                    //     createElement("path", { fill: new_theme.palette.neutrals.blackgrey, d: 'M16 13C16.825 13 17.5 12.325 17.5 11.5C17.5 10.675 16.825 10 16 10C15.175 10 14.5 10.675 14.5 11.5C14.5 12.325 15.175 13 16 13ZM16 14.5C15.175 14.5 14.5 15.175 14.5 16C14.5 16.825 15.175 17.5 16 17.5C16.825 17.5 17.5 16.825 17.5 16C17.5 15.175 16.825 14.5 16 14.5ZM16 19C15.175 19 14.5 19.675 14.5 20.5C14.5 21.325 15.175 22 16 22C16.825 22 17.5 21.325 17.5 20.5C17.5 19.675 16.825 19 16 19Z' })
                                    // )
                                ),
                                // createElement("Menu", {className: "drpdwn-menu"}, 
                                //     createElement("MenuItem", null, "update",
                                //     ),
                                //     createElement("MenuItem", null, "Delete",
                                //     )
                                // )
                            ),
                            //createElement("span", {style :{color: returnEventColor(events[index].eventType)}}, `${events[index].eventType}`)
                        ))),
                    
                    
                    (events[index]?.durationTime ? 
                        (createElement("div", null,
                        (createElement("span", { style: {color: new_theme.palette.newSupplementary.NSupText} }, `End date: `, (createElement("span", { style: { color: new_theme.palette.secondary.SGrey } }, formatDate(events[index].endDate))))),
                        // <>
                            
                        //     { (events[index].creator === user.id || userPermissions.isTrainingManager || userPermissions.bcTrainer.access || currentSession.examiners?.find(e=>e._id===user.id)) && checkEventIsFinished(events[index].date) && 
                        //         <StyledEIconButton color="primary" size="large">
                        //             <MoreVertIcon
                        //                 name="el1"
                        //                 aria-controls={open2 ? 'update_menu' : undefined}
                        //                 aria-haspopup="true"
                        //                 aria-expanded={open2 ? 'true' : undefined}
                        //                 onClick={handleClickMore}
                        //             />
                        //         </StyledEIconButton>
                        //     }
                            
                        //     <Menu
                        //         id="update_menu"
                        //         name="el1"
                        //         anchorEl={anchorEL}
                        //         keepMounted
                        //         open={open2}
                        //         onClose={handleCloseMore}
                        //         anchorOrigin={{
                        //             vertical: 'bottom',
                        //             horizontal: 'left',
                        //         }}
                        //         PaperProps={{
                        //             style: {
                        //                 width: '140px',
                        //             },
                        //         }}
                        //     >
                        //         {
                                    
                        //             (createElement(Fragment, null,
                        //                 (events[index].creator === user.id || userPermissions.isTrainingManager || userPermissions.bcTrainer.access || currentSession.examiners?.find(e=>e._id===user.id)) && checkEventIsFinished(events[index].date) && (createElement("MenuItem", {style:{display:'block', paddingLeft:'1rem', fontSize:'1.3rem', cursor:'pointer'} , onClick: () => addEvent(new Date(currentYear, currentMonth, currentDay),{type:"update", data:events[index]}) }, languages[i18n.language].update, )),
                        //                 (events[index].creator === user.id || userPermissions.isTrainingManager || userPermissions.bcTrainer.access || currentSession.examiners?.find(e=>e._id===user.id)) && checkEventIsFinished(events[index].date) && (createElement("MenuItem", {style:{display:'block',  paddingLeft:'1rem', fontSize:'1.3rem', cursor:'pointer'} , onClick: () => updateEvent({type:"remove", data:events[index]._id}) }, languages[i18n.language].delete)),                         
                        //             ))
                        //         }
                                
                        //     </Menu>
                        // </>
                        ))
                    : null),
                    // ( createElement("br", {className: "text-muted"}, null) ),
                    // ( createElement("span", {className: "text-muted"}, events[index].assignedGroup? `Class: `: `Session: `,(createElement("span", {style:{color:"black"}}, events[index].assignedGroup?.name||events[index].assignedSession?.name) )) ),
                    // ( createElement("br", {className: "text-muted"}, null) ),
                    // ( createElement("span", {className: "text-muted"}, events[index].assignedSubject? `Subject: `: `Course: `,(createElement("span", {style:{color:"black"}}, events[index].assignedSubject?.name||events[index].assignedCourse?.name) )) ),
                    // ( createElement("span", {className: "text-muted"}, `Content: ${events[index].assignedContent.title}`) ),
                    // ( createElement("br", {className: "text-muted"}, null) ),
                    events[index].urlToEvent && ( createElement("span", {className: "text-muted"}, `Meet URL: ${events[index].urlToEvent}`) ),
                    // ( createElement("br", {className: "text-muted"}, null) ),
                    
                    // (userPermissions.isTrainee || userPermissions.isTrainer || userPermissions.bcTrainer.access || userPermissions.bcCoach.access )
                    // && isTraineeCanTakeExam(events[index]) 
                    // && events[index].assignedContent
                    // && events[index].assignedContent?.title !== "Homework on paper"
                    // && events[index].assignedContent?.title !== "Exam in class"
                    // && events[index].assignedContent?.restricted !== true
                    // && (createElement("a", { className: "text-primary text-center", onClick: (e) => { return (navigate(`/event/${events[index].assignedContent ? events[index]._id + `/content/display` : "-"}`, '_blank')) }, style: { cursor: "pointer" } }, `Content: ${events[index].assignedContent ? events[index].assignedContent?.title : "-"}`)),
                    
                    // ( createElement("br", {className: "text-muted"}, null) ),
                    //  (events[index].creator === user.id || userPermissions.isTrainingManager || currentSession.examiners?.find(e=>e._id===user.id)) && checkEventIsFinished(events[index].date) && (createElement("button", { onClick: () => addEvent(new Date(currentYear, currentMonth, currentDay),{type:"update", data:events[index]}) }, languages[i18n.language].update)),
                    //  (events[index].creator === user.id || userPermissions.isTrainingManager || userPermissions.bcTrainer.access || currentSession.examiners?.find(e=>e._id===user.id)) && checkEventIsFinished(events[index].date) && (createElement("button", { onClick: () => addEvent(new Date(currentYear, currentMonth, currentDay),{type:"update", data:events[index]}) }, languages[i18n.language].update)),
                    //  (events[index].creator === user.id || userPermissions.isTrainingManager || userPermissions.bcTrainer.access || currentSession.examiners?.find(e=>e._id===user.id)) && checkEventIsFinished(events[index].date) && (createElement("button", { onClick: () => updateEvent({type:"remove", data:events[index]._id}) }, languages[i18n.language].delete)),
                    
                    <>
                    </>

                     ));
                eventDivs.push(event);
            }
        }

        // FOR NO-EVENT DAYS ADD NO EVENTS TEXT
        if (eventDivs.length === 0) {
            eventDivs.push(createElement("p", { key: -1 }, languages[i18n.language].noEventForThisDay));
        }
        return (createElement(Fragment, null,

            !addEventHelper?.isOpen &&  
            createElement("div", { className: `${styles.detail}  ${animatingDetail === 1 && styles.slideInRight} ${animatingDetail === -1 && styles.slideOutRight} ${detailsOpen ? styles.defaultOpen : styles.defaultClosed} ${floatingPanels ? styles.floating : ''}`, onAnimationEnd: animationEnd },
                showDetailToggler && 
                createElement("div", { className: styles.btnParent },
                (createElement("button", { onClick: toggleDetails, className: `${styles.closeDetail}  ${animatingDetail === 1 && styles.detailsTogglerSlideIn} ${animatingDetail === -1 && styles.detailsTogglerSlideOut} ${detailsOpen ? styles.defaultOpen : styles.defaultClosed}` },
                    createElement("svg", { width: '32', height: '32', viewBox: '0 0 32 32' },
                         createElement("circle", { cx: "16", cy: "16", r: "15.5", fill: "white", stroke: new_theme.palette.newSecondary.NSIconBorder }),
                             createElement("path", { fill: new_theme.palette.neutrals.blackgrey, d: 'M19.75 14.875C20.005 14.875 20.2525 14.8975 20.5 14.935V9.625C20.5 8.8 19.825 8.125 19 8.125H10C9.175 8.125 8.5 8.8 8.5 9.625V21.625C8.5 22.45 9.175 23.125 10 23.125H15.445C14.8525 22.2775 14.5 21.2425 14.5 20.125C14.5 17.2225 16.8475 14.875 19.75 14.875ZM12.07 14.5375C11.815 14.6875 11.5 14.5075 11.5 14.215V9.625H15.25V14.215C15.25 14.5075 14.935 14.6875 14.68 14.5375L13.375 13.75L12.07 14.5375Z' }),
                             createElement("path", { fill: new_theme.palette.neutrals.blackgrey, d: 'M19.75 16.375C17.68 16.375 16 18.055 16 20.125C16 22.195 17.68 23.875 19.75 23.875C21.82 23.875 23.5 22.195 23.5 20.125C23.5 18.055 21.82 16.375 19.75 16.375ZM18.8125 21.325V18.925C18.8125 18.6325 19.135 18.4525 19.3825 18.61L21.3025 19.81C21.535 19.96 21.535 20.2975 21.3025 20.4475L19.3825 21.6475C19.135 21.7975 18.8125 21.6175 18.8125 21.325Z' })

                )))),
                createElement("div", { className: styles.detailParent },
                createElement("div", { className: styles.dateTitle },
                    helperFunctions.getFormattedDate(selectedDate, detailDateFormat, i18n.language, languages),
                    allowAddEvent && (currentSession?.examiners?.find(e=>e._id===user?.id))
                && (createElement("button", { className: styles.addEvent, onClick: () => addEvent(new Date(currentYear, currentMonth, currentDay), { type: "addNew" }) }, languages[i18n.language].addEvent))),
                <EventTypeSidebar eventDivs={eventDivs} />,
                // <StyledButton eSize="medium" eVariant="secondary" onClick={()=> toggleDetails}>{t("Close")}</StyledButton>
                createElement("button", { onClick: toggleDetails, className: `${styles.closeBtn}` }, languages[i18n.language].close),
                )
            ),
            ));
    }
    /**************************
     * RENDER ACTUAL CALENDAR *
     **************************/
    return (createElement("div", { className: `${styles.revoCalendar} ${className}`, ref: calendarRef, style: style },
        createElement("style", null, `
        .${styles.revoCalendar} {
          --primaryColor: ${primaryColorRGB};
          --primaryColor50: ${helperFunctions.getRGBAColorWithAlpha(primaryColorRGB, 0.5)};
          --secondaryColor: ${secondaryColorRGB};
          --todayColor: ${todayColorRGB};
          --textColor: ${textColorRGBA};
          --indicatorColor: ${indicatorColorRGB};
          --animationSpeed: ${animationSpeed}ms;
          --sidebarWidth: ${sidebarWidth}px;
          --detailWidth: ${detailWidth}px;
          --minHeight: ${sidebarHeight}px;
        }
      `),
        createElement(CalendarSidebar, null),
        createElement(CalendarInner, null),
        createElement(CalendarDetails, null)));
};
export default RevoCalendar;