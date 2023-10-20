// ##################################################
// Calendar for inviting users for BrainCore Test ###
// ##################################################


import React, { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';
import dayjs from 'dayjs';

// MUIv5
import { Typography, DialogActions, Button, ThemeProvider, Box } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

//Components
import TestSelection from "components/common/BrainCoreTestSelectionModal"
import StyledButton from 'new_styled_components/Button/Button.styled';

// Serives
import BCTestService from 'services/bcTestRegistration.service';

// Others
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Stack from '@mui/material/Stack';
import { new_theme } from 'NewMuiTheme';

//CSS
import './BrainCoreTestInvitationCalendar.scss'

// Calendar for inviting users for BrainCore Test 
// 
// calendarOpen    - if true then calendar is visible
// setCalendarOpen - used to control visibility of the calendar
// usersIds        - list of ids of user who will be invited
// testType        - type of the test, for which user will be invited can be [`pedagogy`, `adult`]
//                   when not provided user will have to manually select 
//                   type of test before selecting date
// callback        - function to be called after succesfull invitation
export default function BrainCoreTestInvitationCalendar({ calendarOpen, setCalendarOpen, usersIds, testType, callback=()=>{} }) {
    const { t, i18n } = useTranslation(['sentinel-MyUsers-BCTestRegistration', 'common']);
    const { F_showToastMessage, F_handleSetShowLoader } = useMainContext();
    const [selectedDate, setSelectedDate] = React.useState();

    //Type of the test for which user will be invited: ['pedagogy', 'adult']
    const [selectedTestType, setSelectedTestType] = useState()


    // Function called whenever date is accepted
    const acceptDate = (selectedDate) => {
        console.log('Inviting ', usersIds, ' for test ', selectedTestType, ' with due date ', selectedDate.toString())
        F_handleSetShowLoader(true)
        const payLoad = {
            userId: usersIds,
            testType: selectedTestType,
            registerDate: selectedDate.endOf('day')
        }
        BCTestService.bcTestRegister(payLoad).then((res) => {
            callback()
            setCalendarOpen(false)
            F_showToastMessage(t('sentinel-MyUsers-BCTestRegistration:REQUEST_SENT'), 'success');
            setTimeout(() => F_handleSetShowLoader(false), 500)
        }).catch((err) => {
            F_showToastMessage(err.message, 'error');
            setCalendarOpen(false)
            F_handleSetShowLoader(false)
        });
    };

    // When opening calendar set default data
    // Set date to end of current day - fix for COG-693   
    // "Can't send request for current date"
    useEffect(() => {
        if (calendarOpen) {
            setSelectedTestType(testType)
            setSelectedDate(undefined);
            setTimeout(() => { setSelectedDate(dayjs().add(7, 'day').endOf('day')) }, 500)
        }
    }, [calendarOpen]);

    const getMyActionsBar = () => {
        return ({onAccept,onCancel,onClear,onSetToday,}) => {
            return (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '16px'}}>
                    <StyledButton eVariant="secondary" eSize="small" onClick={onCancel}>{t("common:CLOSE")} </StyledButton>
                    <StyledButton eVariant="primary" eSize="small" onClick={()=>{acceptDate(selectedDate); setSelectedDate(undefined)}}>{t("common:INVITE")}</StyledButton>
                </Box>
            );
        };
    }

    return <>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={3}>
                <MobileDatePicker
                    open={calendarOpen && (selectedTestType ? true : false)}
                    onClose={() => setCalendarOpen(false)}
                    className="btnSaveSmall"
                    label={<>
                        <Typography variant="h3" component="h3" sx={{textAlign: 'left'}}>{t("sentinel-MyUsers-BCTestRegistration:SELECT_DATE")}</Typography>
                        <Typography variant="subtitle1" component="p">{t("sentinel-MyUsers-BCTestRegistration:INVITE_{{users}}_USERS_FOR_{{type}}_TEST", {users: usersIds?.length, type: selectedTestType=="adult" ? "PRO" : "EDU"})}</Typography>
                    </>}
                    inputFormat="DD/MM/YYYY"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    minDate={dayjs().startOf('day')}
                    renderInput={(params) => <></>}
                    components={{
                        ActionBar: getMyActionsBar(),
                        SwitchViewIcon: KeyboardArrowDownIcon
                      }}
                />
            </Stack>
        </LocalizationProvider>

        <TestSelection
            openChoice={calendarOpen && (selectedTestType ? false : true)}
            setOpenChoice={()=>{}}
            onClose={()=>setCalendarOpen(false)}
            forMe={false}
            callback={(type) => { setSelectedTestType(type); }}>
        </TestSelection>
    </>
}