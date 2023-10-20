import { useEffect, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import {
    Divider,
    Typography,
} from "@mui/material";
import ModuleCoreService from "services/module-core.service"
import Grid from "@mui/material/Grid";
import TeamTable from "./TeamTable"
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Confirm from "components/common/Hooks/Confirm";
import { ETab, ETabBar } from "styled_components";
import "./BCTestRegistration.scss"
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";

export default function MSAuthorizationsList() {
    const { t } = useTranslation(['translation', 'sentinel-MyUsers-BCTestRegistration']);
    const { isConfirmed } = Confirm();
    // const classes = useStyles();
    const [currentTab, setCurrentTab] = useState(1);
    const [openModuleList, setOpenModuleList] = useState(false);
    const navigate = useNavigate();
    const [MSRoles, setMSRoles] = useState([]);
    // const [module, setModule] = useState(null);
    const [remainingUserLimit, setRemainingUserLimit] = useState(0);
    // setCurrentRoute
    const { setMyCurrentRoute, F_showToastMessage, F_getHelper, F_handleSetShowLoader, F_t } = useMainContext();
    const { manageScopeIds, user } = F_getHelper();

    // open types: ['IMPORT','PREVIEW', 'ADD','EDIT'];
    const [editFormHelper, setEditFormHelper] = useState({ isOpen: false, openType: 'PREVIEW', userId: 'NEW', isBlocking: false })

    useEffect(() => {
        F_handleSetShowLoader(true)
        ModuleCoreService.readModuleCore(manageScopeIds.moduleId).then(res => {
            setMSRoles(res.data.rolePermissions)

            F_handleSetShowLoader(false);
        }).catch(error => console.error(error))
        setMyCurrentRoute("Module Authorizations")
    }, [editFormHelper.isOpen])

    useEffect(() => {
        if (openModuleList) return;
        F_handleSetShowLoader(true)
        ModuleCoreService.readModuleCore(manageScopeIds.moduleId).then(res => {
            setMSRoles(res.data.rolePermissions)

        }).catch(error => console.error(error))
    }, [openModuleList])

    async function switchTabHandler(i) {
        if (editFormHelper.isBlocking) {
            let confirm = await isConfirmed("Are you sure you want to leave this tab without saving?");
            if (!confirm) return;
        }
        setEditFormHelper(prev => ({ ...prev, isBlocking: false }))
        setCurrentTab(i)
    }

    useEffect(() => {
        switch (currentTab) {
            case 0:
                navigate("/sentinel/myteams/BC-test-registrations/users")
                break;

            case 1:
                
                break;
            default:
                break;
        }
    }, [currentTab])

    return (
        <ThemeProvider theme={new_theme}>
        <Grid container spacing={1} className="mainChildDiv">
            {(!editFormHelper.isOpen) && (
                <Grid item xs={12}>
                    <div className="admin_content" style={{paddingTop:"0"}}>
                        <div className="admin_heading" style={{marginBottom:"0"}}>
                        <Grid>
                            <Typography variant="h1" component="h1">{t("sentinel-MyUsers-BCTestRegistration:BRAINCORE_TEST_REGISTRATION")}</Typography>
                            <Divider variant="insert" className='heading_divider' />
                         </Grid>
                            {/* <div className="heading_buttons">
                                <div className="pri-btn-wrap" style={{ display:"flex" }}>
                                    <label className="uploadCSVbtn" htmlFor="usersCsvInput">
                                        <input
                                            style={{ display: "none" }}
                                            accept="text/csv"
                                            multiple
                                            type="file"
                                        />
                                        <StyledButton className="btn_primary" component="span"
                                            disabled={editFormHelper.isOpen}
                                            onClick={() => { setEditFormHelper({ isOpen: true, openType: 'ADD', userId: 'NEW', isBlocking: false }) }}>
                                            {t("Create Roles")}
                                        </StyledButton>
                                    </label>
                                    <StyledButton className="btn_secondary" component="span"
                                        disabled={editFormHelper.isOpen}
                                        onClick={() => { setEditFormHelper({ isOpen: true, openType: 'CreatePermission', userId: 'NEW1', isBlocking: false }) }}>
                                        {t("Create Permission")}
                                    </StyledButton>
                                </div>
                            </div> */}

                        </div>

                    </div>
                    <Grid item xs={12} className="content_tabing" style={{ display:"flex", marginTop:".5rem" }}>
                        <ETabBar
                            style={{ minWidth: "280px" }}
                            value={currentTab}
                            textColor="primary"
                            variant="fullWidth"
                            onChange={(e, i) => { switchTabHandler(i) }}
                            aria-label="tabs example"
                            className="tab_style"
                        >
                            <ETab label={F_t("Users")} eSize='small' />
                            <ETab label={F_t("Teams")} eSize='small' />
                        </ETabBar>

                    </Grid>


                    <TeamTable className="tableIn1" MSRoles={MSRoles} editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                </Grid>
            )}

            {/* {(editFormHelper.isOpen && editFormHelper.openType == 'ADD') && (
                <Grid item xs={12} >
                    <NewRoleForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                </Grid>
            )} */}

            {/* {(editFormHelper.isOpen && editFormHelper.openType == 'CreatePermission') && (
                <Grid item xs={12} >
                    <NewPermissionForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                </Grid>
            )} */}

        </Grid>
        </ThemeProvider>
    )
}
