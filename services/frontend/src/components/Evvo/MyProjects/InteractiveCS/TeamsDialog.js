import { Box, Checkbox, Collapse, Dialog, FormControlLabel, FormGroup, Input, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next';
import ProjectService from "services/project.service";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";
import SearchIcon from '@mui/icons-material/Search';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';

export default function TeamsDialog(props) {
    const { onClose, setUserNames, open, teams, allUsers, setUsers, userIds, setUserIds, setTeamName,selectedTeams,setSelectedTeams, setCurrentProject, fromProject=false } = props;
    const { F_showToastMessage, F_hasPermissionTo, F_getHelper, F_handleSetShowLoader, F_t} = useMainContext();
    const { t } = useTranslation(['translation', 'sentinel-MyTeams-Results']);
    const [openerIndex, setOpenerIndex] = useState([]);
    const [checkAll,setCheckAll] = useState(false);
    const [newUserIds,setNewUserIds] = useState(userIds);
    const [userSearch,setUserSearch] = useState("");
    const [userSearchEnable,setUserSearchEnable] = useState(false);
    const [searchResult,setSearchResult] = useState(teams)

    const handleClose = () => {
        onClose();
        setUserIds(null);
    };

    const handleConfirm=()=>{
        onClose();
        F_handleSetShowLoader(true)
        let users2=[];

        teams.forEach((t)=>{
            if(selectedTeams.includes(t._id)){
                users2=[...users2,...t.trainee];
            }
        })
        console.log("users",users2)
        const userId=users2.map((user)=>user._id);
        setUserIds(newUserIds);
        setUserNames(allUsers.map((user)=>user.username).filter((user)=>!userIds?.includes(user._id)));
        setUsers(users2); // when we care about only teams

        ProjectService.getOpportunitiesForUsers(newUserIds).then((res)=>{
            console.log(res.data)
            console.log("opportunities fetching")
            setCurrentProject(p=>({...p,cognitiveBlockCollection:res.data}))
            F_handleSetShowLoader(false)
        }).catch((err)=>{
            console.log(err)
            F_handleSetShowLoader(false)
        })
        // setUsers(allUsers.filter((user)=>newUserIds.includes(user._id))); // when we care about selection of each users

    }
    const handleUserSearch=(e)=>{
        setUserSearch(e.target.value);
        if(e.target.value.length>=3){
            const results=teams.filter((team)=>team.name.toLowerCase().includes(e.target.value.toLowerCase()))
            setSearchResult(results);
        }else{
            setSearchResult(teams);
        }
    }

    const handleRadioChange = (event) => {
        if (event.target.checked) {
            const team = teams;
            let ids=[];
            let name=[];
            team.forEach((t)=>{
              ids=[...ids,t._id];
              name=[...name,t.name]
            })
            setSelectedTeams(ids);
            setTeamName(name);
            setNewUserIds(team.flatMap(t=>t.trainee.map(trainee=>trainee._id)))
           
            setCheckAll(true)
        }else{
            setSelectedTeams([]);
            setTeamName([]);
            setNewUserIds([])

            setCheckAll(false)
        }

    };

    function selectTeamHandler(isSelected, teamId) {
        setCheckAll(false)

        const team = teams.find(team => team._id === teamId);
        console.log(team)
        if (!team) return;

        //// for multi team selection
        // if (isSelected) {
        //     setTeamName(prevState => [...prevState, team.name])
        //     if (!allTeams.includes(teamId)) {
        //         // setUserIds(prevState => [...prevState, id]);
        //         setAllTeams(prevState => [...prevState, teamId])
        //         setNewUserIds(prevState => [...prevState, ...team.trainee.map(trainee => trainee._id)])
        //     }
        // } else {
        //     setTeamName(prevState => prevState.filter(item => item !== team.name))
        //     setAllTeams(prevState => prevState.filter(item => item !== teamId));
        //     setNewUserIds(prevState => prevState.filter(item => !team.trainee.some(trainee => trainee._id === item)));
        //     // if(userIds.length > 0) {
        //     //     const traineesToRemove = team.trainee.map(trainee => trainee);
        //     //     setUserIds(prevState => prevState.filter(userId => !traineesToRemove.some(trainee => trainee._id === userId)))
        //     //     setUserNames(prevState => prevState.filter(username => !traineesToRemove.some(trainee => trainee.username === username)))
        //     // }
        // }  
        
        
        //// for single team selection
        if (isSelected) {
            setTeamName([team.name])
            setSelectedTeams([teamId])
            setCurrentProject(p=>({...p,team:teamId}))
            setNewUserIds(team?.trainee.map(trainee => trainee._id)||[])
        } else {
            setTeamName("")
            setSelectedTeams([]);
            setNewUserIds([])
        }
    }

    function selectTeamArrowHandler(index) {
        if(openerIndex.includes(index)){
            setOpenerIndex(prevState=>prevState.filter(item=>item!==index))
        }else{
            setOpenerIndex(prevState=>[...prevState,index])
        } 
    }

    function selectUserHandler(isSelected, userId, teamId) {
        const team = teams.find(team => team._id === teamId);
        if (!team) return;
        setCheckAll(false)
        setSelectedTeams(prevState => prevState.filter(item => item !== teamId));
        const selectedUser = allUsers.find(user => user._id === userId);
        if (!selectedUser) return;
        if (isSelected) {
            console.log("inside selectUserHandler if")
            if (!newUserIds.includes(userId)) {
                setNewUserIds(prevState => [...prevState, userId])
                // setUserNames(prevState => [...prevState, selectedUser.username])
            } else {
                // setUserNames(prevState => [...prevState, selectedUser.username])
            }

        } else {
            console.log("inside selectUserHandler else")
            setNewUserIds(prevState => prevState.filter(item => item !== userId));
            // setUserNames(prevState => prevState.filter(item => item !== selectedUser.username));
        }
    }

    const getUserCheckboxGroup = group => group.map((team, index) => (
        <Box key={index} sx={{ mt: 1.5, ml:0.5 }}>
            <Box className="checkbox_item" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <FormControlLabel
                control={
                    <Checkbox
                    onClick={(e) => selectTeamHandler(e.target.checked, team._id)}
                    checked={selectedTeams?.includes(team._id)}
                    />
                }
                label={
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pl: 1 }}>
                    <Typography variant="body1" sx={{ color: 'black' }}>
                        {team.name}
                    </Typography>
                    {/* <Typography variant="caption" sx={{ color: new_theme.palette.newSupplementary.NSupText }}>
                        {team.trainee.length} {t("Employees")}
                    </Typography> */}
                    {team?.brainCoreTest?.completed == 0 && <Typography variant="subtitle2" component="span">{t("sentinel-MyTeams-Results:THERE ARE NO RESULTS")}</Typography>}
                    {team?.brainCoreTest?.completed > 0 && team?.brainCoreTest?.completed == team?.trainee.length && <Typography variant="subtitle2" component="span">{t("sentinel-MyTeams-Results:RESULTS AVAILABLE FOR ALL {{all}} EMPLOYEES", {all: team?.trainee.length })}</Typography>}
                    {team?.brainCoreTest?.completed > 0 && team?.brainCoreTest?.completed < team?.trainee.length && <Typography variant="subtitle2" component="span">{t("sentinel-MyTeams-Results:RESULTS AVAILABLE FOR  {{number}} OUT OF {{all}} EMPLOYEES", {number: team?.brainCoreTest?.completed, all: team?.trainee.length})}</Typography>}
                    </Box>
                }
                sx={{ marginLeft: '-15px' }}
                />
                {/* <ArrowForwardIosIcon onClick={e => selectTeamArrowHandler(index)} sx={{ fontSize: '20px', cursor: 'pointer', border: `1px solid ${new_theme.palette.primary.PBorder}`, borderRadius: '50%', p: '4px', height: '24px', width: '24px', transform: openerIndex.includes(index) ? 'rotate(-90deg)' : 'rotate(90deg)', transition: 'transform 0.4s ease-in-out' }} /> */}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Collapse in={openerIndex.includes(index)}>
                    <Box sx={{ ml: 2 }}>
                        {team.trainee.map((user, index) => {
                            return <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <FormGroup>
                                        <FormControlLabel control={<Checkbox onClick={e => selectUserHandler(e.target.checked, user._id, team._id)} checked={newUserIds?.includes(user._id)} />} label={<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pl: 1 }}>
                                            <Typography variant="body2" sx={{ color: new_theme.palette.primary.MedPurple }}>{user.username}</Typography>
                                            <Typography variant="caption" sx={{ color: new_theme.palette.newSupplementary.NSupText }}>{user.email||"email@example.com"}</Typography>
                                        </Box>} sx={{ margin: 0 }} />
                                    </FormGroup>
                                </Box>
                            </Box>
                        })}
                    </Box>
                </Collapse>
            </Box>
        </Box>
    ))



    return (
        // <Box className={`${fromProject?"ProjectsContainer":""}`}>
        <Dialog onClose={handleClose} open={open} className={`${fromProject?"ProjectsContainer":"resultsTeams_popup"} `}
            PaperProps={{
                sx: {
                    minWidth: { xs: '90%', sm: '500px' },
                    borderRadius: '12px',
                    maxHeight: '100%',
                    padding: '26px',
                    overflow: 'hidden'
                }
            }}>
            <div className="dialog_header">
                <Typography variant="h3" component="h3" sx={{ color: new_theme.palette.primary.MedPurple }} hidden={userSearchEnable}>{F_t("sentinel-MyTeams-Results:SELECT TEAMS")}</Typography>
                <Input placeholder={`${F_t("sentinel-MyTeams-Results:SEARCH TEAM")}`} value={userSearch} onChange={handleUserSearch} hidden={!userSearchEnable}/>
                <div className="dialog_filters">
                    <StyledEIconButton color="primary" size="medium">
                        <SearchIcon sx={{ mr: 2 }} onClick={()=>setUserSearchEnable(!userSearchEnable)}/>
                    </StyledEIconButton>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: '100vh' }}>
                <div className="dialog_content">
                    {/* <div className="radio_group" style={{ marginTop: '16px', backgroundColor: new_theme.palette.newSupplementary.SupCloudy }}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox onClick={handleRadioChange} checked={checkAll} />} label={<Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', pl: 1 }}>
                                <Typography variant="body2" sx={{ color: 'black' }}>{t("All Teams")}</Typography>
                                <Typography variant="caption" sx={{ color: new_theme.palette.newSupplementary.NSupText }}>{teams.length} {t("Teams")},  {teams.reduce((acc, t) => acc + t.trainee.length, 0)} {t("Trainees")}</Typography>
                            </Box>} sx={{ m: 0 }} />
                        </FormGroup>
                    </div> */}
                    {userSearch? getUserCheckboxGroup(searchResult): getUserCheckboxGroup(teams)}
                </div>
                <div className="dialog_button" style={{ marginTop: '12px' }}>
                    <StyledButton eVariant="secondary" eSize="medium" onClick={handleClose}>{t("Cancel")}</StyledButton>
                    <StyledButton eVariant="primary" eSize="medium" onClick={handleConfirm}>{t("Confirm")}</StyledButton>
                </div>
            </div>
        </Dialog>
        // </Box>
    );
}