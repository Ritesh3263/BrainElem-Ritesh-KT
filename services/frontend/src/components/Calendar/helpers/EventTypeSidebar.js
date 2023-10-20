import React from "react";
import {useState} from "react";
import { Box, Typography, ThemeProvider } from '@mui/material';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import {Badge} from "@material-ui/core";
import styles from '../styles.module.scss';
import {useTranslation} from "react-i18next";
import { ReactComponent as BluePolygon } from "../../../icons/other/blue_polygon.svg";
import { ReactComponent as RedPolygon } from "../../../icons/other/red_polygon.svg";
import { ReactComponent as GreenPolygon } from "../../../icons/other/green_polygon.svg";
import { new_theme } from "NewMuiTheme";

export default function EventTypeSidebar({eventDivs}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);

    let eventList1Arr =[];
    let eventList2Arr =[];
    let eventList3Arr =[];
    let eventList4Arr =[];


    eventDivs.map(ev=>  {
        if(ev.props.sortKey === "Exam"){
            eventList1Arr.push(<div className={styles.events} >{ev}</div>)
        }else if(ev.props.sortKey === "Quiz"){
            eventList2Arr.push(<div className={styles.events}>{ev}</div>)
        }else if(ev.props.sortKey === "Homework"){
            eventList3Arr.push(<div className={styles.events}>{ev}</div>)
        }else if(ev.props.sortKey === "Online Class"){
            eventList4Arr.push(<ListItem className={styles.events} >{ev}</ListItem>)
        }
        return null;
    } );


    return(
        <ThemeProvider theme={new_theme}>
            <div className="d-flex flex-fill mx-2" >
                <List
                    className="d-flex flex-fill flex-column p-2"
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    style={{borderRadius:"5px", maxHeight:"485px", gap:"24px", paddingTop: '32px !important'}}
                >
                    <ListItem onClick={()=>setOpen4(p=>!p)} className="mt-0" style={{justifyContent: 'space-between', cursor: 'pointer'}}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            {/* <Badge color="secondary" className="pb-0" badgeContent={(eventList4Arr.length >0 )}/> */}
                            <BluePolygon />
                            <ListItemText primary={<Typography variant="subtitle1" component="span" sx={{fontSize: '18px', marginLeft: '12px !important'}}>{t("Online Class")}</Typography>} />
                            <Typography variant="subtitle1" component="span" sx={{fontSize: '18px', marginLeft: '6px !important'}}>{(eventList4Arr.length >0 ) ? "( " + eventList4Arr.length + " )" : "( 0 )"}</Typography>
                        </Box>
                        {open4 ? <ExpandLess style={{color: new_theme.palette.secondary.DarkPurple}} /> : <ExpandMore style={{color: new_theme.palette.secondary.DarkPurple}} />}
                    </ListItem>
                    <Collapse className={styles.parentBox} in={open4} timeout="auto" unmountOnExit style={{overflow: "auto", maxHeight:"485px"}}>
                        <List component="div">
                            {eventList4Arr.length >0 ? eventList4Arr : <p>{t("There is nothing yet")}</p>}
                        </List>
                    </Collapse>
                    <ListItem onClick={()=>setOpen1(p=>!p)} className="mt-0" style={{justifyContent: 'space-between', cursor: 'pointer'}}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <GreenPolygon />
                                {/* <Badge color="error" className="pb-0"  badgeContent={(eventList1Arr.length >0 )}/> */}
                            <ListItemText primary={<Typography variant="subtitle1" component="span" sx={{fontSize: '18px', marginLeft: '12px !important'}}>{t("Exams")}</Typography>} />
                            <Typography variant="subtitle1" component="span" sx={{fontSize: '18px', marginLeft: '6px !important'}}>{(eventList1Arr.length >0 ) ? "( " + eventList1Arr.length + " )" : "( 0 )"}</Typography>
                        </Box>
                        {open1 ? <ExpandLess style={{color: new_theme.palette.secondary.DarkPurple}} /> : <ExpandMore style={{color: new_theme.palette.secondary.DarkPurple}} />}
                    </ListItem>
                    <Collapse className={styles.parentBox} in={open1} timeout="auto" unmountOnExit style={{overflow: "auto", maxHeight:"485px"}}>
                        <List component="div" disablePadding>
                                {eventList1Arr.length >0 ? eventList1Arr : <p>{t("There is nothing yet")}</p>}
                        </List>
                    </Collapse>
                    {/*<ListItem button onClick={()=>setOpen2(p=>!p)} className="mt-0">*/}
                    {/*    <Badge color="primary" className="pb-0" badgeContent={(eventList2Arr.length >0 ) ? eventList2Arr.length : "0"}/>*/}
                    {/*    <ListItemText primary="Quiz" className="ml-4" />*/}
                    {/*    {open2 ? <ExpandLess /> : <ExpandMore />}*/}
                    {/*</ListItem>*/}
                    {/*<Collapse in={open2} timeout="auto" unmountOnExit style={{overflow: "auto", maxHeight:"485px"}}>*/}
                    {/*    <List component="div" disablePadding>*/}
                    {/*            {eventList2Arr.length >0 ? eventList2Arr : <p>There is nothing yet</p>}*/}
                    {/*    </List>*/}
                    {/*</Collapse>*/}
                    <ListItem onClick={()=>setOpen3(p=>!p)} className="mt-0" style={{justifyContent: 'space-between', cursor: 'pointer'}}>
                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                            <RedPolygon  />
                            {/* <Badge color="primary" className="pb-0" badgeContent={(eventList3Arr.length >0 )}/> */}
                            <ListItemText primary={<Typography variant="subtitle1" component="span" sx={{fontSize: '18px', marginLeft: '12px !important'}}>{t("Homework")}</Typography>} />
                            <Typography variant="subtitle1" component="span" sx={{fontSize: '18px', marginLeft: '6px !important'}}>{(eventList3Arr.length >0 ) ? "( " + eventList3Arr.length + " )" : "( 0 )"}</Typography>
                        </Box>
                        {open3 ? <ExpandLess style={{color: new_theme.palette.secondary.DarkPurple}} /> : <ExpandMore style={{color: new_theme.palette.secondary.DarkPurple}} />}
                    </ListItem>
                    <Collapse className={styles.parentBox} in={open3} timeout="auto" unmountOnExit style={{overflow: "auto", maxHeight:"485px"}}>
                        <List component="div" disablePadding>
                                {eventList3Arr.length >0 ? eventList3Arr : <p>{t("There is nothing yet")}</p>}
                        </List>
                    </Collapse>

                </List>
            </div>
        </ThemeProvider>
    )
}