import { useEffect, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import ModuleCoreService from "services/module-core.service"
import Grid from "@mui/material/Grid";
import UserTable from "./UserTable"
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Confirm from "components/common/Hooks/Confirm";
import { ETab, ETabBar } from "styled_components";
import { Divider } from "@mui/material";
import { Typography } from "@mui/material";
import "./BCTestRegistration.scss"
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";

export default function MSAuthorizationsList() {
    const { t } = useTranslation(['translation', 'sentinel-MyUsers-BCTestRegistration']);
    const { isConfirmed } = Confirm();
    // const classes = useStyles();
    const [currentTab, setCurrentTab] = useState(0);
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
            <Grid container spacing={1} className="mainChildDiv">
                {(!editFormHelper.isOpen) && (
                    <Grid item xs={12}>
                        <div className="admin_content">
                            <div className="admin_heading">
                                <Grid>
                                    <Typography variant="h1" component="h1">{t("sentinel-MyUsers-BCTestRegistration:BRAINCORE_TEST_REGISTRATION")}</Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </Grid>
                            </div>
                        </div>
                        <Grid item xs={12} className="content_tabing" style={{ display: "flex", marginTop: ".5rem" }}>
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


                        <UserTable className="tableIn1" MSRoles={MSRoles} editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                    </Grid>
                )}

            </Grid>
        </ThemeProvider>
    )
}