import React, { useEffect, useState } from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import { Checkbox, FormControlLabel, FormGroup, ListSubheader, Paper } from "@mui/material";
import { Box, Container, Divider, Input } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';

import { useTranslation } from "react-i18next";
import { useSessionContext } from "components/_ContextProviders/SessionProvider/SessionProvider";
import TeamService from "services/team.service"
import { FormControl, Radio, RadioGroup } from "@mui/material";
import PlayCircleOutlineSharpIcon from '@mui/icons-material/PlayCircleOutlineSharp';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import StyledButton from "new_styled_components/Button/Button.styled";
import SearchIcon from '@mui/icons-material/Search';
import { new_theme } from "NewMuiTheme";
import "./authorizations.scss";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import moduleCoreService from "../../../../services/module-core.service"

export default function AddTeamDrawer({ isOpenDrawer, setIsOpenDrawer, selectedUser }) {
    const { t } = useTranslation(['translation', 'sentinel-MyTeams-Results']);
    const [teamsValue, setTeamsValue] = React.useState('');
    const [searchingText, setSearchingText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [unassignedTrainees, setUnassignedTrainees] = useState([]);
    const [sessionTeams, setSessionTeams] = useState([]);
    const [isOpenUserListDrawer, setIsOpenUserListDrawer] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState([])
    const [showTeam, setShowTeam] = useState([])

    const [userSearch, setUserSearch] = useState("");
    const [userSearchEnable, setUserSearchEnable] = useState(false);
    // const [searchResult, setSearchResult] = useState(teams)
    const [allNewTeams, setAllNewTeams] = useState([]);
    const { F_getHelper, F_handleSetShowLoader, F_showToastMessage, F_t } = useMainContext();
    const { manageScopeIds } = F_getHelper();
    const [isAllSelected, setIsAllSelected] = useState(false)

    useEffect(() => {
        F_handleSetShowLoader(true)
        TeamService.readAllTeam(manageScopeIds.moduleId).then(res => {
            setSelectedTeam([])
            setUserSearch('')
            F_handleSetShowLoader(false)
            const updatedteams = res?.data?.data.map((item) =>{
                return({...item, isChecked: false})
            })
            selectedUser?.enabledTeams.map((team) => {
                updatedteams.map((item) =>{
                    if(team?._id == item?._id){  
                        item.isChecked = true
                        setSelectedTeam((prevState) => {
                            return([...prevState, {_id: item?._id, name: item?.name}])
                        })
                    }
                })
            })
            const allChecked = updatedteams.every(team => team.isChecked)
            if(allChecked){
                setIsAllSelected(true)
            }else setIsAllSelected(false)
            setShowTeam(updatedteams)
            setAllNewTeams(updatedteams)
        }).catch(error => {
            F_handleSetShowLoader(false)
            console.error(error)
        })
    }, [selectedUser])

    // const handleUserSearch = (e) => {
    //     setUserSearch(e.target.value);
    //     if (e.target.value.length >= 3) {
    //         const results = teams.filter((team) => team.name.toLowerCase().includes(e.target.value.toLowerCase()))
    //         setSearchResult(results);
    //     } else {
    //         setSearchResult(teams);
    //     }
    // }

    // function selectTeamHandler(isSelected, teamId) {
    //     setCheckAll(false)

    //     const team = teams.find(team => team._id === teamId);
    //     selectedteamname = team.name;
    //     // console.log(team)
    //     if (!team) return;
    //     if (isSelected) {
    //         let selectedUsersFromTeams = [];
    //     // console.log("trainees", allTeams)
    //     teams.forEach((t) => {
    //         if (teamId.includes(t._id)) {
    //             selectedUsersFromTeams = [...t.trainee];
    //         }
    //     })
    //     if (users) {
    //         selectedUsersFromTeams.push(...users)
    //     }
        
    //     // console.log("users", users)
    //     const userId = selectedUsersFromTeams.map((user) => user._id);
    //     setUsers(selectedUsersFromTeams);
    //     setUserIds(userId)
    //         setTeamName(prevState => [...prevState, team.name])
    //         if (!selectedTeamsId.includes(teamId)) {
    //             // setUserIds(prevState => [...prevState, id]);

    //             setSelectedTeamsId(prevState => [...prevState, teamId])
    //         }
    //     } else {
    //         setTeamName(prevState => prevState.filter(item => item !== team.name))
    //         setSelectedTeamsId(prevState => prevState.filter(item => item !== teamId));
    //         if (userIds.length > 0) {
    //             const traineesToRemove = team.trainee.map(trainee => trainee);
    //             setUserIds(prevState => prevState.filter(userId => !traineesToRemove.some(trainee => trainee._id === userId)))
    //             setUserName(prevState => prevState.filter(username => !traineesToRemove.some(trainee => trainee.username === username)))
    //         }
    //     }
    // }

    // useEffect(() => {
    //     if(teams) {
    //         for(const team of teams) {
    //             for(const traine of team.trainee) {
    //                 if(userIds.includes(traine._id)) {
    //                     if(team.trainee.length === userIds.length) {
    //                         setSelectedTeamsId(prevState => [...prevState , team._id])
    //                         break;
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }, [userIds])

    const handleClose  = () => {
        setIsOpenDrawer({ isOpen: false});
    }

    const handleTeamSelect = (e, team) => {
        const checkedTeam = showTeam.map((item) => {
            if(team?._id == item?._id){
                if(e.target.checked){
                    setSelectedTeam((prevState) => {
                        return([...prevState, {_id: team?._id, name: team?.name}])
                    })
                }else{
                    const newTeam = selectedTeam.filter(item => item?._id !== team?._id)
                    setSelectedTeam(newTeam)
                }
                return({...item, isChecked: !item?.isChecked})
            }
            return item
        })
        const allChecked = checkedTeam.every(team => team.isChecked)
        if(allChecked) setIsAllSelected(true)
        else setIsAllSelected(false)
        setShowTeam(checkedTeam)
        if(userSearch?.length < 3){
            setAllNewTeams(checkedTeam)
        }
    }

    const handleConfirm = () =>{
        F_handleSetShowLoader(true)
        selectedUser.enabledTeams = selectedTeam
        moduleCoreService.updateModuleUser(selectedUser).then((res) => {
            F_handleSetShowLoader(false)
            setIsOpenDrawer({ isOpen: false});
            F_showToastMessage(t("common:SAVED SUCCESFULLY"), 'success');
        }).catch((err) => {
            F_handleSetShowLoader(false)
            F_showToastMessage("FAILED TO SAVE", 'error');
            console.error(err)
        })
    }

    const handleUserSearch = (e) => {
        setUserSearch(e.target.value);
        if (e.target.value.length >= 3) {
            const results = showTeam.filter((team) => team?.name.toLowerCase().includes(e.target.value.toLowerCase()))
            setShowTeam(results);
        } 
        else{
            allNewTeams.map((team) =>{
                showTeam.map((item) =>{
                    if(item?._id == team?._id){
                        team.isChecked = item.isChecked
                        return team
                    }
                    return team
                })
            })
            setShowTeam(allNewTeams)
        }
    }

    const selectAllTeams = (e) =>{
        setIsAllSelected(e.target.checked)
        if(e.target.checked){
            const allCheckedTeams = showTeam.map((team) => {
                {selectedTeam?.length > 0 ? selectedTeam.map((item) => {
                    if(item?._id !== team?._id){
                        setSelectedTeam((prevState) => {
                            return([...prevState, {_id: team?._id, name: team?.name}])
                        })
                    }
                }):
                setSelectedTeam((prevState) => {
                    return([...prevState, {_id: team?._id, name: team?.name}])
                })
            }
                return({...team, isChecked: true})
            })
            setShowTeam(allCheckedTeams)
            if(userSearch?.length < 3){
                setAllNewTeams(allCheckedTeams)
            }   
        }else{
            setSelectedTeam([])
            const unCheckedTeams =  showTeam.map((item) =>{ 
                return({...item, isChecked: false})
            })
            setShowTeam(unCheckedTeams)
            if(userSearch?.length < 3){
                setAllNewTeams(unCheckedTeams)
            }
        }
    }

    
    return (
        <>
            <SwipeableDrawer
                PaperProps={{
                    className:"side_drawer"
                }}
                anchor="right"
                open={isOpenDrawer.isOpen}
                onClose={() => {
                    setIsOpenDrawer({ isOpen: false});
                }}
                
            >
                
                <div className="dialog_header">
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Typography variant="h3" component="h3" sx={{ color: new_theme.palette.primary.MedPurple }} hidden={userSearchEnable}>{F_t("sentinel-MyTeams-Results:SELECT TEAMS")}</Typography>
                    </div>
                    <Input placeholder={`${F_t("sentinel-MyTeams-Results:SEARCH TEAM")}`} value={userSearch} 
                        onChange={handleUserSearch} 
                        hidden={!userSearchEnable} 
                    />
                    <div className="dialog_filters">
                        <SearchIcon sx={{ mr: 2, border: `1px solid ${new_theme.palette.primary.PBorder}`, borderRadius: '50%', padding: '9px', height: '40px', width: '40px' }} onClick={() => setUserSearchEnable(!userSearchEnable)} />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: '100vh' }}>
                    <div className="dialog_content">
                        {showTeam?.length > 0 && <div className="radio_group" style={{ marginTop: '16px', backgroundColor: new_theme.palette.newSupplementary.SupCloudy }}>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox checked={isAllSelected}
                                    onClick={(e) => selectAllTeams(e)}
                                />} label={F_t("sentinel-MyTeams-Results:SELECT ALL TEAMS")} sx={{ margin: 0 }} />
                            </FormGroup>
                        </div>}
                        {/* {!searchResult && teams && teams.map((team, index) => getTeamCheckboxGroup(team, index))} */}
                        {showTeam?.length && showTeam.map((team) => {
                            return(
                                <div key={team?._id}>
                                <FormControlLabel style={{marginLeft:0}} control={<Checkbox className="custom-radio" checked={team?.isChecked}
                                onClick={(e) => handleTeamSelect(e, team)}
                                />} 
                                label={<><Typography variant="body4" component="h6">{team?.name}</Typography></>} />
                                </div>
                            )
                        })}
                    </div>
                    <div className="dialog_button" style={{ marginTop: '12px' }}>
                        <StyledButton eVariant="secondary" eSize="medium" 
                            onClick={handleClose}
                        >{t("common:CANCEL")}</StyledButton>
                        <StyledButton eVariant="primary" eSize="medium" 
                            onClick={handleConfirm}
                        >{t("common:CONFIRM")}</StyledButton>
                    </div>
                </div>
                
            </SwipeableDrawer>


        </>
    )
}