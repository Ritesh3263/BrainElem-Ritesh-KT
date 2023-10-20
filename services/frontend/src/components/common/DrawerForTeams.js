// Universal component for selecting teams/users with table
// It alows to select specific users or whole teams

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

import STATUSES from 'enums/statusEnum';

// Styled components
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";
import StyledButton from "new_styled_components/Button/Button.styled";
import UsersDialog from "components/common/DrawerForUsers"
import StyledDialog from 'new_styled_components/Dialog/Dialog.styled';

// MUI ICONS
import SearchIcon from '@mui/icons-material/Search';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

// MUI ELEMENTS
import Input from "@mui/material/Input";
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';





// Css
import { new_theme } from "NewMuiTheme";


// Universal component for selecting teams/users
// #######################################
// Parameters:
// teams - list of teams to displayed
// open - when true the dialog is open
// setOpen - control opening the dialog
// onlyTeamsSelection - allow only selection of full teams( no user selection)
// onlySingleTeamSelection - allow selecting only single team
// onlyWithAvailableResult - when set to false it will allow selection of all users, othewise only those with BrainCore test results
// onConfirm - callback called on Confirm button it returns selectedUsers, selectedTeams and label
// onClose - callback called on closing dialog, takes selectedUsers as argument
export default function TeamsDialog(props) {
    const { teams, open, setOpen, onlyTeamsSelection=false, onlySingleTeamSelection=false, onlyWithAvailableResult = true, onConfirm, onClose } = props;
    const { t } = useTranslation(['common', 'traits', 'sentinel-MyTeams-Results', 'sentinel-MyTeams-Statistics']);

    // Control users dialog
    const [openUsersDialog, setOpenUsersDialog] = useState(false);
    const [usersInOpenedTeam, setUsersInOpenedTeam] = useState([])

    // Hide/show search bar
    const [teamSearchEnable, setTeamSearchEnable] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([])

    // Selected teams - used only when `onlyTeamsSelection` is set to true
    // otherwise only selectedUsers is used to control the state
    const [ selectedTeams, setSelectedTeams ] = useState([])

    const { F_t } = useMainContext();

    // When closing searchbar remove the query
    useEffect(() => {
        if (!teamSearchEnable) setSearchQuery('')
    }, [teamSearchEnable])

    // Function
    const isResultAvailable = (user) => {
        if (!onlyWithAvailableResult) return true
        return user?.brainCoreTest?.status == STATUSES.COMPLETED && !user?.blockedByCredits
    }

    // Get label with selected teams/users
    // This can be shown in the parent view
    const getLabel = () => {
        // Only team selection
        if (onlyTeamsSelection){
            if (!selectedTeams.length) return F_t("sentinel-MyTeams-Results:TEAMS")
            if (onlySingleTeamSelection) return selectedTeams[0].name
            else selectedTeams.map(t=>t.name).join(', ')
        }else {
            // For user selection
            if (!selectedUsers.length) return F_t("sentinel-MyTeams-Results:TEAMS")
            if (selectedUsers.length==1){
                let u = selectedUsers[0]
                if (u.name=="_") return u.email
                else return u.name+" "+u.surname
            }

            let teamNames = []
            let selectedIds = selectedUsers.map(u=>u._id)
            for (let team of teams){
                let ids = team.trainee.map(u=>u._id)
                let count = ids.filter(id=>selectedIds.includes(id)).length
                if (count>0) teamNames.push(`${team.name} (${count})`) 

            }

            return teamNames.join(', ')
        }
    }


    // When clicked on select all teams
    const handleSelectAllTeams = (event) => {
        let allUsers = teams?.reduce((users, currentValue) => users.concat(currentValue.trainee ?? []), []);
        let allUsersFiltered = allUsers.filter(u => isResultAvailable(u))
        // Select all
        if (event.target.checked) setSelectedUsers([...allUsersFiltered])
        // Unselect all 
        else setSelectedUsers([])
    };

    // Check if all teams are selected
    const areAllTeamsSelected = () => {
        let allUsers = teams?.reduce((users, currentValue) => users.concat(currentValue.trainee ?? []), []);
        let allUsersFilteredIds = allUsers.filter(u => isResultAvailable(u)).map(u => u._id)
        let selectedIds = selectedUsers.map(u => u._id)
        return allUsersFilteredIds.length > 0 && allUsersFilteredIds.every(id => selectedIds.includes(id))
    }

    // When selecting or unselecting a team
    function handleSelectTeam(event, team) {
        if (event.target.checked) {// SELECTED
            if (onlyTeamsSelection){// Selecting whole teams
                console.log("Selecting a team", team._id)
                let newTeams = [...selectedTeams, team]
                if (onlySingleTeamSelection) newTeams = [team]
                setSelectedTeams(newTeams)
                setSelectedUsers(newTeams.flatMap(t=>t.trainee))
            }else {// Selecting users
                let alreadySelectedIds = selectedUsers.map(u => u._id)
                let usersFiltered = team.trainee.filter(u => isResultAvailable(u)).filter(u => !alreadySelectedIds.includes(u._id))
                setSelectedUsers([...selectedUsers, ...usersFiltered])
            }
        }
        // Unselect the team
        else {// UNSELECTED
            if (onlyTeamsSelection){
                let newTeams = selectedTeams.filter(t=>t._id!=team._id)
                if (onlySingleTeamSelection)  newTeams = []
                setSelectedTeams(newTeams)
                setSelectedUsers(newTeams.flatMap(t=>t.trainee))
            }else {
                let toRemove = team.trainee.map(u => u._id)
                setSelectedUsers(selectedUsers.filter(t => !toRemove.includes(t._id)))
            }
        }
    }

    // Count users in team that are available
    function countAvailableUsers(team) {
        let usersFilteredIds = team.trainee.filter(u => isResultAvailable(u)).map(u => u._id)
        return usersFilteredIds.length
    }

    // Count users in team that are selected
    function countUsersInTeamSelected(team) {
        let selectedIds = selectedUsers.map(u => u._id)
        let usersFilteredIds = team.trainee.filter(u => isResultAvailable(u)).map(u => u._id)
        return usersFilteredIds.filter(id => selectedIds.includes(id)).length
    }

    // Check if team is selected
    function isTeamSelected(team) {
        if (onlyTeamsSelection){
            if (selectedTeams?.length<1) return false
            else if (onlySingleTeamSelection) return team._id == selectedTeams[0]._id
            else return selectedTeams.map(t=>t._id).includes(team._id)
        }
        let usersFilteredIds = team.trainee.filter(u => isResultAvailable(u)).map(u => u._id)
        let count = countUsersInTeamSelected(team)
        return count > 0 && count == usersFilteredIds.length
    }

    // Function to call when team is opened
    function onTeamOpen(team) {
        setUsersInOpenedTeam(team.trainee)
        setOpen(false)
        setOpenUsersDialog(true)
    }


    // Component for single team checkbox
    const getTeamCheckboxGroup = (team, index) => {
        let selected = countUsersInTeamSelected(team)
        let available = countAvailableUsers(team)
        return <div className="checkbox_group" key={index} style={{ marginTop: '18px' }}>
            <div className="checkbox_item">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    {/* <DragIndicatorIcon /> */}
                    <FormGroup>
                        <FormControlLabel control={<Checkbox
                            disabled={available == 0}
                            onClick={e =>handleSelectTeam(e, team)}
                            checked={isTeamSelected(team)} />}
                            label={<div className="teams_checkbox_label">
                                <Typography sx={{ fontWeight: selected ? "bold" : "normal" }} variant="body1" component="span">{team?.name}</Typography>
                                <Typography sx={{ fontWeight: selected ? "bold" : "normal" }} variant="subtitle2" component="span">
                                    {!onlyTeamsSelection && (selected ? false : true) && t("sentinel-MyTeams-Results:NO USERS SELECTED")}
                                    {!onlyTeamsSelection && (selected > 0 ? true : false) && t("sentinel-MyTeams-Results:{{selected}} OUT OF {{available}} USERS SELECTED", { selected: countUsersInTeamSelected(team) ?? 0, available: team?.brainCoreTest?.completed })}
                                </Typography>
                            </div>}
                            sx={{ margin: 0 }} />
                    </FormGroup>
                </div>


                {!onlyTeamsSelection && <StyledEIconButton color="primary" size="medium" disabled={available == 0}>
                    <ChevronRightIcon onClick={e => onTeamOpen(team)} />
                </StyledEIconButton>}

            </div>
        </div>

    }



    return (<>
        <StyledDialog onClose={() => onClose(selectedUsers)} open={open} className="resultsTeams_popup"
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="h3" component="h3" sx={{ color: new_theme.palette.primary.MedPurple }} hidden={teamSearchEnable}>{F_t("sentinel-MyTeams-Results:SELECT TEAMS")}</Typography>
                </div>
                <Input placeholder={`${F_t("sentinel-MyTeams-Results:SEARCH TEAM")}`} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} hidden={!teamSearchEnable} />
                <div className="dialog_filters">
                    <StyledEIconButton color="primary" size="large">
                        <SearchIcon onClick={() => setTeamSearchEnable(!teamSearchEnable)} />
                    </StyledEIconButton>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: '100vh' }}>
                <div className="dialog_content">
                    {!teamSearchEnable && !onlySingleTeamSelection && <div className="radio_group" style={{ marginTop: '16px', backgroundColor: new_theme.palette.newSupplementary.SupCloudy }}>
                        <FormGroup>
                            {teams && <FormControlLabel control={<Checkbox onClick={handleSelectAllTeams} checked={areAllTeamsSelected()} />} label={F_t("sentinel-MyTeams-Results:SELECT ALL TEAMS")} sx={{ margin: 0 }} />}
                        </FormGroup>
                    </div>}
                    {teams?.filter(t => {
                        if (searchQuery) {
                            return (t.name).toLowerCase().includes(searchQuery)
                        } else return true

                    })
                        .map((team, index) => getTeamCheckboxGroup(team, index))}
                </div>
                <div className="dialog_button" style={{ marginTop: '12px' }}>
                    <StyledButton eVariant="secondary" eSize="medium" onClick={() => onClose(selectedUsers)}>{t("common:CANCEL")}</StyledButton>
                    <StyledButton eVariant="primary" eSize="medium" onClick={() =>{
                        onConfirm(selectedUsers, selectedTeams, getLabel())
                    }}>{t("common:CONFIRM")}</StyledButton>
                </div>
            </div>
        </StyledDialog>

        {!onlyTeamsSelection && <UsersDialog
            open={openUsersDialog}
            users={usersInOpenedTeam}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            onlyWithAvailableResult={onlyWithAvailableResult}
            onConfirm={() => {
                setOpenUsersDialog(false)
                setSelectedUsers(selectedUsers)
                onConfirm(selectedUsers, selectedTeams, getLabel())
            }}

            onClose={() => {
                setOpen(true)
                setOpenUsersDialog(false)
            }}
        />}
    </>
    );
}