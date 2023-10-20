// Universal component for selecting users
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
import STATUSES from 'enums/statusEnum';

// Styled components
import WarningCredits from "components/Credits/WarningCredits";
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";
import StyledButton from "new_styled_components/Button/Button.styled";


// MUI ICONS
import SearchIcon from '@mui/icons-material/Search';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

// MUI ELEMENTS
import Input from "@mui/material/Input";
import FormGroup from '@mui/material/FormGroup';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import StyledDialog from 'new_styled_components/Dialog/Dialog.styled';



// Css
import { new_theme } from "NewMuiTheme";




// Universal component for selecting users
// #######################################
// Parameters:
// users - list of users to displayed
// selectedUsers - list of selected users
// setSelectedUsers - control selected users
// open - when true the dialog is open
// onlyWithAvailableResult
// onConfirm - callback called on Confirm button, takes selectedUsers as argument
// onClose - callback called on closing dialog, takes selectedUsers as argument
export default function UsersDialog({ users, selectedUsers, setSelectedUsers, open, onlyWithAvailableResult=true, onConfirm, onClose }) {
    const { t } = useTranslation(['common', 'sentinel-MyTeams-Results', 'sentinel-Admin-Credits']);
   
    const { F_getHelper } = useMainContext();

    // Hide/show search bar
    const [userSearchEnable, setUserSearchEnable] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    
    // When closing searchbar remove the query
    useEffect(() => {
        if (!userSearchEnable) setSearchQuery('')
    }, [userSearchEnable])

    // Function
    const isResultAvailable = (user) => {
        if (!onlyWithAvailableResult) return true
        return user?.brainCoreTest?.status == STATUSES.COMPLETED && !user?.blockedByCredits
    }

    // Name to display on the list - if name is missing it will return email address
    const getUserName = (user) => {
        if (user?.name == "_" && user?.surname == "_") return user.email
        return user?.name + " " + user?.surname
    }
    // When clicked on select all users
    const handleSelectAll = (event) => {
        let usersFiltered = users.filter(u => isResultAvailable(u))
        let usersFilteredIds = usersFiltered.map(u => u._id)
        // Select all
        if (event.target.checked) setSelectedUsers([...selectedUsers, ...usersFiltered])
        // Unselect all 
        else setSelectedUsers(selectedUsers.filter(u => !usersFilteredIds.includes(u._id)))
    };
    // Check if all users are selected
    const isAllSelected = () => {
        let usersFilteredIds = users.filter(u => isResultAvailable(u)).map(u => u._id)
        let selectedIds = selectedUsers.map(u => u._id)
        return usersFilteredIds.every(id => selectedIds.includes(id))
    }
    // When selecting or unselecting a user
    function handleSelect(event, user) {
        // Add to the list
        if (event.target.checked) setSelectedUsers([...selectedUsers, user])
        // Remove from the list
        else setSelectedUsers(selectedUsers.filter(u => u._id != user._id))
    }
    // Get component with single checkbox
    const getUserCheckboxGroup = (user, index) => {
        return <div className="checkbox_group" key={index} style={{ marginTop: '18px' }}>
            <div className="checkbox_item">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FormGroup>
                        <FormControlLabel control={<Checkbox
                            disabled={!isResultAvailable(user)}
                            onClick={e => handleSelect(e, user)}
                            checked={selectedUsers.find(u => u._id == user._id) ? true : false} />}
                            label={<div className="teams_checkbox_label">
                                <Typography variant="body1" component="span">
                                    {getUserName(user)}
                                    {onlyWithAvailableResult && user?.blockedByCredits && <WarningCredits  enableRequest={F_getHelper().user.id==user._id} viewBox="0 2 24 24"></WarningCredits>}
                                </Typography>
                                {onlyWithAvailableResult && user?.brainCoreTest?.status != "Completed" && <Typography variant="subtitle2" component="span">{t("sentinel-MyTeams-Results:THERE ARE NO RESULTS")}</Typography>}
                                {onlyWithAvailableResult && user?.blockedByCredits && <>
                                    <Typography variant="subtitle2" component="span">{t("sentinel-Admin-Credits:RESULTS BLOCKED BY CREDITS")}</Typography></>}
                            </div>}
                            sx={{ margin: 0 }} />
                    </FormGroup>
                </div>
            </div>
        </div>
    }

    return (
        <StyledDialog onClose={() => onClose(selectedUsers)} open={open} className="resultsTeams_popup"
            PaperProps={{
                sx: {
                    minWidth: { xs: '90%', sm: '500px' },
                    padding: '0',
                    borderRadius: '12px',
                    maxHeight: '100%',
                    padding: '26px',
                    overflow: 'hidden'
                }
            }}>
            <div className="dialog_header">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <StyledEIconButton color="primary" size="medium">
                        <ChevronLeftIcon onClick={() => onClose(selectedUsers)} />
                    </StyledEIconButton>
                    <Typography variant="h3" component="h3" sx={{ ml: 1, color: new_theme.palette.primary.MedPurple }} hidden={userSearchEnable}>{t("sentinel-MyTeams-Results:SELECT USERS")}</Typography>
                </div>
                <Input placeholder={`${t("sentinel-MyTeams-Results:SEARCH USER")}`} value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value.toLocaleLowerCase()) }} hidden={!userSearchEnable} />
                <div className="dialog_filters">
                    <StyledEIconButton color="primary" size="medium">
                        <SearchIcon onClick={() => setUserSearchEnable(!userSearchEnable)} />
                    </StyledEIconButton>
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', height: '100vh' }}>
                <div className="dialog_content">
                    {users && <Typography variant="subtitle1" component="p" sx={{ mt: 2 }}>{t("sentinel-MyTeams-Results:RESULTS AVAILABLE FOR  {{number}} OUT OF {{all}} EMPLOYEES", { number: users?.filter(u => isResultAvailable(u)).length, all: users?.length != undefined ? users.length : 0 })}</Typography>}
                    {!userSearchEnable && <div className="radio_group" style={{ marginTop: '16px', backgroundColor: new_theme.palette.newSupplementary.SupCloudy }}>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox onClick={handleSelectAll} checked={isAllSelected()} />} label={t("sentinel-MyTeams-Results:SELECT ALL USERS")} sx={{ margin: 0 }} />
                        </FormGroup>
                    </div>}
                    {users && users?.
                        filter(u => {
                            if (searchQuery) {
                                return (u.name + u.surname + u.email).toLowerCase().includes(searchQuery)
                            } else return true

                        }).
                        map((user, index) => getUserCheckboxGroup(user, index))}
                </div>
                <div className="dialog_button" style={{ marginTop: '12px' }}>
                    <StyledButton eVariant="secondary" eSize="medium" onClick={() => onClose(selectedUsers)}>{t("common:BACK")}</StyledButton>
                    <StyledButton eVariant="primary" eSize="medium" onClick={() => onConfirm(selectedUsers)}>{t("common:CONFIRM")}</StyledButton>
                </div>
            </div>
        </StyledDialog>
    );
}
