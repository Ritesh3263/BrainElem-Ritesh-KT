import React, { useEffect, useState } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import { Checkbox, FormControlLabel, FormGroup, ListSubheader, Paper } from "@material-ui/core";
import { Box, Container, Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';

import SearchField from "../../../../common/Search/SearchField";
import TableSearch from "../../../../common/Table/TableSearch";
import { useTranslation } from "react-i18next";
import { useSessionContext } from "../../../../_ContextProviders/SessionProvider/SessionProvider";
import Button from "@material-ui/core/Button";

import { theme } from "../../../../../MuiTheme";
import TeamService from "services/team.service"
import { FormControl, Radio, RadioGroup } from "@mui/material";
import PlayCircleOutlineSharpIcon from '@mui/icons-material/PlayCircleOutlineSharp';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import StyledButton from "new_styled_components/Button/Button.styled";
import SearchIcon from '@mui/icons-material/Search';
import { new_theme } from "NewMuiTheme";
import "../SessionForm.scss";

export default function AssignTraineesDrawer({ isOpenDrawer, setIsOpenDrawer }) {
    const { t } = useTranslation();
    const [teamsValue, setTeamsValue] = React.useState('');
    const [searchingText, setSearchingText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [unassignedTrainees, setUnassignedTrainees] = useState([]);
    const [sessionTeams, setSessionTeams] = useState([]);
    const [isOpenUserListDrawer, setIsOpenUserListDrawer] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState({})
    const [showTeam, setShowTeam] = useState({})
    const {
        currentSession,
        sessionDispatch,
        sessionReducerActionsType
    } = useSessionContext();

    useEffect(() => {
        setUnassignedTrainees(currentSession?.unassignedTrainees ?? []);
    }, [currentSession?.unassignedTrainees]);

    useEffect(() => {
        setFilteredData(unassignedTrainees);
    }, [unassignedTrainees]);

    useEffect(() => {
        TeamService.readAllTeam().then(res => {
            // setTeams(res.data.data)
            setUnassignedTrainees(res.data.data.flatMap(d => d.trainee))
            setSessionTeams(res.data.data);
        }).catch(error => console.error(error))
    }, [])

    const isGroupChecked = (idToFind, data = currentSession) => {
        if (!data || !data.groups || !Array.isArray(data.groups)) {
            return false; // Invalid input data or missing groups array
        }

        let idsToCompare = sessionTeams.find((tr) => tr._id === idToFind)?.trainee?.map((tr) => tr._id);

        if (!idsToCompare || !Array.isArray(idsToCompare)) {
            return false; // Invalid input data or missing ids array
        }

        // Check if any of the idsToCompare is found in currentSession.groups[0].trainees
        if (data.groups[0].trainees.some((tr) => idsToCompare.includes(tr._id))) {
            return true;
        }

        // If no matching _id is found in trainees, return false
        return false;
    }

    const handleTraineeSelect = (trainee) => () => {
        sessionDispatch({
            type: sessionReducerActionsType.TRAINEES_IN_GROUP_ACTION,
            payload: { type: 'UPDATE_TRAINEE', traineeId: trainee._id, groupIndex: isOpenDrawer.groupIndex, groupId: isOpenDrawer.groupId }
        });
        setIsOpenDrawer({ isOpen: false, groupId: undefined, groupIndex: 0 });
    }
    const openUserList = () => {
        setSelectedTeam({})
        sessionDispatch({
            type: sessionReducerActionsType.TRAINEES_IN_GROUP_ACTION,
            payload: { type: 'SELECTED', selected:true, groupId: isOpenDrawer.groupId, groupIndex: isOpenDrawer.groupIndex }
        });
        setIsOpenDrawer({ isOpen: false, groupId: undefined, groupIndex: 0 });
        //todo - update the method or create a new one later
        // setIsOpenUserListDrawer(true);


    }

    const backUserList = () => {
        setIsOpenDrawer({ isOpen: true, groupId: undefined, groupIndex: 0 });
        setIsOpenUserListDrawer(false);
    }

    const CloseDrawer = () => {
        setIsOpenUserListDrawer(false);
    }

    // const teamshandleChange = (id) => {
    //     console.log(id);
    // }


    const handleTeamSelect = (tr) => {
        // console.log(event.target.value );
        setSelectedTeam(tr);
        if(isGroupChecked(tr._id)){
            sessionDispatch({
                type: sessionReducerActionsType.TRAINEES_IN_TEAM_ACTION,
                payload: { type: 'REMOVE', trainees: tr.trainee.map(t=>t._id), groupId: isOpenDrawer.groupId, groupIndex: isOpenDrawer.groupIndex }
            });
        } else {
            sessionDispatch({
                type: sessionReducerActionsType.TRAINEES_IN_TEAM_ACTION,
                payload: { type: 'ADD', trainees: tr.trainee, groupId: isOpenDrawer.groupId, groupIndex: isOpenDrawer.groupIndex }
            });
        }
            console.log(currentSession, 'full ass')
    };
    // const uTraineeList = sessionTeams.map((tr, index) => (
    //     // <FormControlLabel
    //     //     label={`${tr?.name} ${tr?.surname}`}
    //     //     control={
    //     //         <Button variant="contained" size="small" color="primary"
    //     //                 className='mr-4'
    //     //                 onClick={()=>{
    //     //                     sessionDispatch({type: sessionReducerActionsType.TRAINEES_IN_GROUP_ACTION,
    //     //                         payload: {type: 'ADD', trainee: tr, groupId: isOpenDrawer.groupId, groupIndex: isOpenDrawer.groupIndex}});
    //     //                 }}>
    //     //             <small>{t("Assign1")}</small>
    //     //         </Button>

    //     //     }
    //     // />
    //     // <FormControl>
    //     //     <div className="displayFlex" style={{ alignItems: 'baseline', justifyContent: 'space-between', paddingRight: '1rem' }}>
    //     //         <RadioGroup
    //     //             aria-labelledby="demo-radio-buttons-group-label"
    //     //             name="radio-buttons-group"
    //     //             onChange={() => {
    //     //                 sessionDispatch({
    //     //                     type: sessionReducerActionsType.TRAINEES_IN_GROUP_ACTION,
    //     //                     payload: { type: 'ADD', trainee: tr, groupId: isOpenDrawer.groupId, groupIndex: isOpenDrawer.groupIndex }
    //     //                 });
    //     //             }}
    //     //         >
    //     //             <FormControlLabel control={<Radio className="custom-radio" />} value="value" label={<><Typography variant="body4" component="h6">{`${tr?.name}`}</Typography><Typography variant="subtitle2" component="p">{t("Number of users")}: {tr?.trainee?.length > 0 ? tr?.trainee?.length : 0}</Typography></>} />

    //     //         </RadioGroup>
    //     //         <ArrowForwardIosIcon style={{ color: new_theme.palette.newSupplementary.NSupText }} onClick={openUserList} sx={{ color: new_theme.palette.newSupplementary.NSupText, height: '32px', width: '32px', border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, borderRadius: '50%', padding: '6px' }} />
    //     //     </div>
    //     // </FormControl>
    //     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    //         {/* <FormControlLabel value="INDIVIDUAL" control={<Radio />} label={t("login-welcome-registration:INDIVIDUAL")}  /> */}
    //         <FormControlLabel control={<Radio className="custom-radio" />} value={tr?.name} label={<><Typography variant="body4" component="h6">{`${tr?.name}`}</Typography><Typography variant="subtitle2" component="p">{t("Number of users")}: {tr?.trainee?.length > 0 ? tr?.trainee?.length : 0}</Typography></>} />
    //         <ArrowForwardIosIcon style={{ color: new_theme.palette.newSupplementary.NSupText }} onClick={openUserList} sx={{ color: new_theme.palette.newSupplementary.NSupText, height: '32px', width: '32px', border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, borderRadius: '50%', padding: '6px' }} />
    //     </div>
    // ));

    const handleShowTeam = (tr) => {
        setShowTeam(tr)
        setIsOpenUserListDrawer(true)
    }
    return (
        <>
            <SwipeableDrawer
                PaperProps={{
                    className:"side_drawer"
                }}
                anchor="right"
                onOpen=""
                open={isOpenDrawer.isOpen}
                onClose={() => {
                    setIsOpenDrawer({ isOpen: false, groupId: undefined, groupIndex: 0 });
                    setSearchingText('');
                }}
            >
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    style={{ maxHeight: 'calc(100% - 100px)', overflow: 'auto' }}
                    subheader={
                        <ListSubheader disableSticky="true" component="div" id="nested-list-subheader">
                            <Grid container style={{ backgroundColor: new_theme.palette.primary.PWhite }} className="py-2">
                                <Grid item xs={12}>
                                    <div className="top_heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, paddingBottom: '8px', marginBottom: '10px' }}>
                                        <Typography variant="h3" component="h2" sx={{ color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }} >
                                            
                                            {t("Add users")}
                                        </Typography>
                                        <SearchIcon sx={{ border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, height: '40px', width: '40px', borderRadius: '50%', padding: '7px', color: new_theme.palette.newSupplementary.NSupText }} />
                                        
                                    </div>
                                    <div className="selected_tms">
                                        <Typography variant="subtitle1" component="h6" sx={{}}>{t("Selected")}: {selectedTeam?.name ? t("1") : t("0")}</Typography>
                                        <ul>
                                            <li><Typography variant="subtitle2" component="h6">{(selectedTeam?.name ? selectedTeam?.name : t("Team-name"))} {"("}{(selectedTeam?.trainee?.length > 0 ? (selectedTeam?.trainee?.length) : 0)}{")"}</Typography></li>
                                        </ul>
                                    </div>
                                </Grid>
                            </Grid>
                        </ListSubheader>}
                >
                    <FormGroup className="pl-3">
                        <FormControl>
                            <div className="displayFlex" style={{ alignItems: 'baseline', justifyContent: 'space-between', paddingRight: '1rem', flexDirection:'column' }}>

                                
                                {
                                    sessionTeams.map((tr, index) => (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width:'100%' }}>
                                            <FormControlLabel control={<Radio className="custom-radio"  onChange={()=>handleTeamSelect(tr)} />} value={tr?.name} checked={isGroupChecked(tr._id)} label={<><Typography variant="body4" component="h6">{`${tr?.name}`}</Typography><Typography variant="subtitle2" component="p">{t("Number of users")}: {tr?.trainee?.length > 0 ? tr?.trainee?.length : 0}</Typography></>} />

                                            {/* <FormControlLabel control={<Radio className="custom-radio" />} onChange={handleTeamSelect(tr)} value={tr?.name} label={<><Typography variant="body4" component="h6">{`${tr?.name}`}</Typography><Typography variant="subtitle2" component="p">{t("Number of users")}: {tr?.trainee?.length > 0 ? tr?.trainee?.length : 0}</Typography></>} /> */}
                                            <ArrowForwardIosIcon style={{ color: new_theme.palette.newSupplementary.NSupText }} onClick={() => handleShowTeam(tr)} sx={{ color: new_theme.palette.newSupplementary.NSupText, height: '32px', width: '32px', border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, borderRadius: '50%', padding: '6px' }} />
                                        </div>
                                    ))
                                }

                               
                            </div>
                        </FormControl>
                    </FormGroup>
                </List>
                <div className="drawer_footer_btns">
                    <StyledButton eVariant="secondary" onClick={() => {setIsOpenDrawer({ isOpen: false, groupId: undefined, groupIndex: 0 });}} eSize="medium">{t("Cancel")}</StyledButton>
                    <StyledButton eVariant="primary" onClick={openUserList} eSize="medium" >{t("Confirm")}</StyledButton>
                </div>
            </SwipeableDrawer>


            <SwipeableDrawer
                PaperProps={{
                    className:"side_drawer"
                }}
                anchor="right"
                onOpen=""
                open={isOpenUserListDrawer}
                onClose={() => {
                    setIsOpenUserListDrawer(false);
                }}
            >
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    style={{ maxHeight: 'calc(100% - 100px)', overflow: 'auto' }}
                    subheader={
                        <ListSubheader disableSticky="true" component="div" id="nested-list-subheader">
                            <Grid container style={{ backgroundColor: new_theme.palette.primary.PWhite }} className="py-2">
                                <Grid item xs={12}>
                                    <div className="top_heading" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, paddingBottom: '8px', marginBottom: '10px' }}>
                                        <div className="head" style={{ display: 'flex', alignItems: 'center' }}>
                                            <ArrowBackIosIcon onClick={backUserList} sx={{ color: new_theme.palette.newSupplementary.NSupText, height: '32px', width: '32px', border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, borderRadius: '50%', padding: '6px 6px 6px 10px', marginRight: '6px' }} />
                                            <Typography variant="h3" component="h2" sx={{ color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }} >
                                                {showTeam?.name ? showTeam?.name : t("Selected-team-name")}
                                            </Typography>
                                        </div>
                                        <SearchIcon sx={{ border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, height: '40px', width: '40px', borderRadius: '50%', padding: '7px', color: new_theme.palette.newSupplementary.NSupText }} />
                                    </div>
                                    <div className="selected_tms">
                                        <Typography variant="subtitle1" component="h6" sx={{}}>{t("Selected")}: {showTeam?.trainee?.length ? showTeam?.trainee?.length : 0}</Typography>
                                    </div>
                                </Grid>
                            </Grid>
                        </ListSubheader>}
                >
                    <FormGroup className="pl-3">
                        <FormControl>
                            <div className="displayFlex" style={{ alignItems: 'baseline', justifyContent: 'space-between', paddingRight: '1rem', flexDirection:'column' }}>
                                <>
                                {/* todo - update the list to actually the full list which is who knows where */}
                                {/* {currentSession.groups[0].trainees.map((item) => {
                                        return (
                                            <FormGroup
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                name="radio-buttons-group"
                                            >
                                                <FormControlLabel control={<Checkbox className="custom-radio" checked={item.checked} 
                                                onClick={handleTraineeSelect({ ...item, checked: !item.checked })} 
                                                />} 
                                                value="value" label={<><Typography variant="body4" component="h6">{item.name}</Typography>
                                                <Typography variant="subtitle2" component="p">{t("Role-name")}</Typography>
                                                </>} />
                                            </FormGroup>
                                        )
                                    })
                                } */}
                                {showTeam?.trainee?.length && showTeam.trainee.map((item) => {
                                        return (
                                            <FormGroup
                                                aria-labelledby="demo-radio-buttons-group-label"
                                                name="radio-buttons-group"
                                            >
                                                <FormControlLabel control={<Checkbox className="custom-radio" checked={true} 
                                                // onClick={handleTraineeSelect({ ...item, checked: !item.checked })} 
                                                />} 
                                                value="value" label={<><Typography variant="body4" component="h6">{item.name} {item?.surname}</Typography>
                                                {/* <Typography variant="subtitle2" component="p">{t("Role-name")}</Typography> */}
                                                </>} />
                                            </FormGroup>
                                        )
                                    })
                                }
                                {/* <ArrowForwardIosIcon sx={{color: new_theme.palette.newSupplementary.NSupText, height: '32px', width: '32px', border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, borderRadius: '50%', padding: '6px'}} /> */}
                                </>
                            </div>
                        </FormControl>
                    </FormGroup>
                </List>

                <div className="drawer_footer_btns">
                    <StyledButton eVariant="secondary" eSize="medium" onClick={CloseDrawer}>{t("Back")}</StyledButton>
                    <StyledButton eVariant="primary" eSize="medium" onClick={handleTraineeSelect}>{t("Confirm")}</StyledButton>
                </div>
            </SwipeableDrawer>
        </>
    )
}