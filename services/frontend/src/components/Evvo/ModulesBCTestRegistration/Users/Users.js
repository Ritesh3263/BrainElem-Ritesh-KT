import React from "react";
import { useTranslation } from "react-i18next";

// MUI v5
import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { ThemeProvider } from "@mui/system";
import { new_theme } from "NewMuiTheme";


import { useEffect, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import ModuleCoreService from "services/module-core.service"
import BCTestService from "services/bcTestRegistration.service"
import UserTable from "../UserTable"
import NewUserForm from "components/Evvo/ModulesCoreUser/NewUserForm.js";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Confirm from "components/common/Hooks/Confirm";
import { ETab, ETabBar } from "styled_components";
import { Divider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";
import { BsFillCircleFill } from 'react-icons/bs';
import "../BCTestRegistration.scss";


export default function BCTestUsers(){
    const { t } = useTranslation(['translation', , 'common', 'sentinel-MyUsers-BCTestRegistration']);
    const { isConfirmed } = Confirm();
    // const classes = useStyles();
    const [currentTab, setCurrentTab] = useState(0);
    const [openModuleList, setOpenModuleList] = useState(false);
    const navigate = useNavigate();
    const [MSRoles, setMSRoles] = useState([]);
    // const [module, setModule] = useState(null);
    const [remainingUserLimit, setRemainingUserLimit] = useState(0);
    // setCurrentRoute
    const { setMyCurrentRoute, F_showToastMessage, F_getHelper, F_handleSetShowLoader } = useMainContext();
    const { manageScopeIds, user } = F_getHelper();

    // open types: ['IMPORT','PREVIEW', 'ADD','EDIT'];
    const [editFormHelper, setEditFormHelper] = useState({ isOpen: false, openType: 'PREVIEW', userId: 'NEW', isBlocking: false })
    
    async function switchTabHandler(i) {
        if (editFormHelper.isBlocking) {
            let confirm = await isConfirmed(t("Are you sure you want to leave this tab without saving?"));
            if (!confirm) return;
        }
        setEditFormHelper(prev => ({ ...prev, isBlocking: false }))
        setCurrentTab(i)
    }

    useEffect(() => {
        switch (currentTab) {
            case 0:
                break;
            case 1:
                navigate("/sentinel/myteams/BC-test-registrations/teams")
                break;
            default:
                break;
        }
    }, [currentTab])


    return (
        <ThemeProvider theme={new_theme}>
                        <Container maxWidth="xl" className="mainContainerDiv mainBcDiv">
                <Grid container spacing={1}>
                {editFormHelper.isOpen && editFormHelper.openType == "ADD" && <NewUserForm
                    editFormHelper={editFormHelper}
                    setEditFormHelper={setEditFormHelper}
                />}



                    {(!editFormHelper.isOpen) && (
                        <Grid item xs={12}>
                            <div className="admin_content">
                                <div className="admin_heading">
                                    <div className="teams_header">
                                        <Grid className="admin_heading w-100-mb" container sx={{ alignItems: 'center' }}>
                                            <Grid sx={{mr: '2rem'}}>
                                                <Typography variant="h1" component="h1">{t("sentinel-MyUsers-BCTestRegistration:BRAINCORE_TEST_REGISTRATION")}</Typography>
                                                <Divider variant="insert" className='heading_divider' />
                                            </Grid>
                                            <Grid item className="w-100-mb">
                                                <StyledButton eVariant="primary" eSize="large" className="w-100-mb"
                                                    sx={{whiteSpace: 'nowrap'}}
                                                    onClick={() => {
                                                        setEditFormHelper({
                                                            isOpen: true,
                                                            openType: "ADD",
                                                            userId: "NEW",
                                                            isBlocking: false,
                                                            isMinimal: true
                                                        });
                                                    }}>
                                                    {t("sentinel-MyUsers-BCTestRegistration:REGISTER")}
                                                </StyledButton>
                                            </Grid>
                                        </Grid>
                                        <div className="statuses" style={{ width: '100%', display: "flex", gap: '20px', alignItems: "center", justifyContent: "flex-end" }}>
                                            <div>
                                                <StyledButton eVariant='secondary' eSize='xsmall' className='btnStatus btnStatusNoTest'><BsFillCircleFill />&nbsp;{t("sentinel-MyUsers-BCTestRegistration:STATUS_NOT_INVITED")}</StyledButton><Typography variant="subtitle1" component="span" sx={{ fontWeight: "600" }}>
                                                    {/* {row?.brainCoreTest?.noTestTaken || 0} */}
                                                </Typography>
                                            </div>
                                            <div>
                                                <StyledButton eVariant='secondary' eSize='xsmall' className='btnStatus btnStatusSent'><BsFillCircleFill />&nbsp;{t("sentinel-MyUsers-BCTestRegistration:STATUS_REQUEST_SENT")}</StyledButton><Typography variant="subtitle1" component="span" sx={{ fontWeight: "600" }}>
                                                    {/* {row?.brainCoreTest?.requestSent || 0} */}
                                                </Typography>
                                            </div>
                                            <div>
                                                <StyledButton eVariant='secondary' eSize='xsmall' className='btnStatus btnStatusCompleted'><BsFillCircleFill />&nbsp;{t("sentinel-MyUsers-BCTestRegistration:STATUS_COMPLETED")}</StyledButton><Typography variant="subtitle1" component="span" sx={{ fontWeight: "600" }}>
                                                    {/* {row?.brainCoreTest?.completed || 0} */}
                                                </Typography>
                                            </div>
                                            <div>
                                                <StyledButton eVariant='secondary' eSize='xsmall' className='btnStatus btnStatusNotCompleted'><BsFillCircleFill />&nbsp;{t("sentinel-MyUsers-BCTestRegistration:STATUS_NOT_COMPLETED")}</StyledButton><Typography variant="subtitle1" component="span" sx={{ fontWeight: "600" }}>
                                                    {/* {row?.brainCoreTest?.notCompleted || 0} */}
                                                </Typography>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Grid item xs={12} className="content_tabing" style={{ display: "flex"}}>
                                <ETabBar
                                    style={{ minWidth: "280px" }}
                                    value={currentTab}
                                    textColor="primary"
                                    variant="fullWidth"
                                    onChange={(e, i) => { switchTabHandler(i) }}
                                    aria-label="tabs example"
                                    className="tab_style"
                                >
                                    <ETab label={t("Users")} eSize='small' />
                                    {/* <ETab label={t("Teams")} eSize='small' /> */}
                                </ETabBar>
                            </Grid>


                            <UserTable className="tableIn1" MSRoles={MSRoles} editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                        </Grid>
                    )}
                </Grid>
            </Container>

        </ThemeProvider>
    )
}

