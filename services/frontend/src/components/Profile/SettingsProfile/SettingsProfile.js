import React, { useState } from "react";
import { Container, Stack, Box, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
// import {EButton, ETab, ETabBar} from "styled_components";
import { useTranslation } from "react-i18next";
import PersonalInformation from "./PersonalInformation";
import AccountSettings from "./AccountSettings";
import SystemSettings from "./SystemSettings";
import { Card, CardActionArea, CardActions, CardContent, Paper } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { ETab, ETabBar } from "new_styled_components";
import StyledButton from "new_styled_components/Button/Button.styled";
import { Divider } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import AuthService from "services/auth.service";
import { useEffect } from "react";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}



export default function SettingsProfile(props) {
    const {
        user,
        setUser,
        setOpenSidebarDrawer,
        userInterest,
        saveData = () => { },
    } = props;
    const {F_showToastMessage, F_reloadUser} = useMainContext();
    const navigate = useNavigate();
    const { t } = useTranslation(['common']);
    const [currentTab, setCurrentTab] = useState(0);
    const [changePassword, setChangePassword] = useState({password: '', newPassword: '', confirmNewPassword: ''});
    const [errorValidator, setErrorValidator] = useState({})

    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // function to save new password
    const handlePassword = () => {
        let error = validatePassword(changePassword);
        if (Object.keys(error).length===0){
            if(changePassword?.newPassword !== changePassword?.confirmNewPassword){
                F_showToastMessage(t("common:PASSWORD AND CONFIRM PASSWORD ARE DIFFERENT"), 'error');
            }else{
                let payload = {
                    'password': changePassword?.password,
                    'newPassword':changePassword?.newPassword
                }
                AuthService.changePassword(payload).then(res=>{
                    let msg = t("common:PASSWORD HAS BEEN UPDATED SUCCESSFULLY");
                    F_showToastMessage(msg, 'success');
                    F_reloadUser(true)
                }, err=>{
                    F_showToastMessage(t("common:COULD NOT UPDATE PASSWORD"), 'error');
                })
            }
        }
    };


    // validate password feilds when user enters data
    useEffect(() => {
        if(Object.keys(errorValidator).length > 0){
            validatePassword(changePassword);
        }
    },[changePassword] )

    // validate password fields
    const validatePassword=(changePassword)=>{
        let error = {};
        if(!changePassword?.password){
            error.password = t('password is required');
        }
        if(!changePassword?.newPassword){
            error.newPassword = t('new password is required');
        }
        if(!changePassword?.confirmNewPassword){
            error.confirmNewPassword = t('confirm password is required');
        }
        setErrorValidator(error);
        return error;
    }
    return (
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv mainProfileSettingsDiv">
                <Grid item xs={12} sx={{marginBottom: '24px'}}>
                    <Typography variant="h1" className="typo_h5">{t("common:SETTINGS")}</Typography>
                    <Divider variant="insert" className='heading_divider' />
                </Grid>
                <Grid item xs={12} className="content_tabing">
                    <Box className="tb-colum" sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%'}}>
                        <Tabs
                            orientation="vertical"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            sx={{ borderRight: 1, borderColor: 'divider' }}
                            className="settingsProfile_verticaltabs"
                        >
                            <Tab label={<><Typography variant="body2" component="span" sx={{ fontWeight: '700', my: 2 }}>{t("common:SYSTEM SETTINGS")} </Typography></>} {...a11yProps(0)} />
                            <Tab label={<><Typography variant="body2" component="span" sx={{ fontWeight: '700', my: 2 }}>{t("common:ACCOUNT SETTINGS")} </Typography></>} {...a11yProps(1)} />
                            <Tab label={<><Typography variant="body2" component="span" sx={{ fontWeight: '700', my: 2 }}>{t("common:PERSONAL INFORMATION")} </Typography></>} {...a11yProps(2)} />
                        </Tabs>
                        <TabPanel className="settings_tabpanel pb-24" value={value} index={0}>
                            <SystemSettings currentUser={user} setUser={setUser} />
                        </TabPanel>
                        <TabPanel className="settings_tabpanel" value={value} index={1}>
                            <AccountSettings currentUser={user} userInterest={userInterest} setOpenSidebarDrawer={setOpenSidebarDrawer} changePassword={changePassword} setChangePassword={setChangePassword} errorValidator={errorValidator}/>
                        </TabPanel>
                        <TabPanel className="settings_tabpanel" value={value} index={2}>
                            <PersonalInformation user={user} setUser={setUser} />
                        </TabPanel>
                    </Box>
                    <Divider sx={{my:2}}/>
                    <Box className="mb-btn-colum" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'right', gap: '16px' }}>
                        
                        <StyledButton eSize='small' eVariant='secondary'
                            onClick={() => { navigate(-1) }}
                        >{t("common:CANCEL")}</StyledButton>
                        {currentTab !== 3 && (
                            <StyledButton eSize='small' eVariant='primary'
                                onClick={value === 1 ? handlePassword : saveData}
                            >{t("common:CONFIRM")}</StyledButton>
                        )}
                    </Box>
                </Grid>
            </Container>
        </ThemeProvider>
    )
}