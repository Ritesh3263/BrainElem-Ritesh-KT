import { useEffect, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import ModuleCoreService from "services/module-core.service"
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import RoleTable from "./RoleTable"
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import NewRoleForm from "./NewRoleForm";
import NewPermissionForm from "./NewPermissionForm"
import Confirm from "components/common/Hooks/Confirm";
import { ETab, ETabBar } from "styled_components";
import './authorizations.scss'
import { Divider } from "@mui/material";
import { Typography, ThemeProvider } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
import PermissionTable from "./PermissionTable";

const ModuleList = lazy(() => import("../ModuleList"));
const AwaitingApprovalList = lazy(() => import("../AwaitingApprovalList"));


export default function MSAuthorizationsList() {
    const { t } = useTranslation(['sentinel-MyTeams-Teams', 'common', 'sentinel-Admin-Auth']);
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
    const [permissions, setPermission] = useState([]);

    // open types: ['IMPORT','PREVIEW', 'ADD','EDIT'];
    const [editFormHelper, setEditFormHelper] = useState({ isOpen: false, openType: 'PREVIEW', userId: 'NEW', isBlocking: false })
    useEffect(() => {
        F_handleSetShowLoader(true)
        ModuleCoreService.readAllRoles().then(res => {
            console.log(res.data);
            setMSRoles(res.data.data)
            F_handleSetShowLoader(false);
        }).catch(error => console.error(error))
        setMyCurrentRoute("Module Authorizations")
        ModuleCoreService.readAllPermision().then(res => {
            console.log(res.data);
            setPermission(res.data.data)
            F_handleSetShowLoader(false);
        }).catch(error => console.error(error))

    }, [editFormHelper.isOpen])

    useEffect(() => {
        if (openModuleList) return;
        F_handleSetShowLoader(true)
        ModuleCoreService.readAllRoles().then(res => {
            setMSRoles(res.data.data)

        }).catch(error => console.error(error))
    }, [openModuleList])

    async function switchTabHandler(i) {
        if (editFormHelper.isBlocking) {
            let confirm = await isConfirmed(t("common:ARE_YOU_SURE_TO_LEAVE"));
            if (!confirm) return;
        }
        setEditFormHelper(prev => ({ ...prev, isBlocking: false }))
        setCurrentTab(i)
    }



    return (
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv Auth_Module">
                <div className="admin_content">
                    {(!editFormHelper.isOpen) && (
                        <Grid item xs={12}>
                            <div className="admin_heading">
                                <Grid>
                                    <Typography variant="h1" className="typo_h5">{t("sentinel-Admin-Auth:AUHTORIZATION")}</Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </Grid>
                                <div className="heading_buttons">
                                    <div className="pri-btn-wrap">
                                        <label className="uploadCSVbtn w-100-mb" htmlFor="usersCsvInput">
                                            <input
                                                style={{ display: "none" }}
                                                accept="text/csv"
                                                multiple
                                                type="file"
                                            />
                                            <StyledButton className="w-100-mb" eVariant="primary" eSize="large" component="span"
                                                disabled={editFormHelper.isOpen}
                                                onClick={() => { setEditFormHelper({ isOpen: true, openType: 'ADD', userId: 'NEW', isBlocking: false }) }}>
                                                {t("sentinel-Admin-Auth:CREATE_ROLES")}
                                            </StyledButton>
                                        </label>
                                        <StyledButton className="w-100-mb" eVariant="secondary" eSize="large" component="span"
                                            disabled={editFormHelper.isOpen}
                                            onClick={() => { setEditFormHelper({ isOpen: true, openType: 'CreatePermission', userId: 'NEW1', isBlocking: false }) }}>
                                            {t("sentinel-Admin-Auth:CREATE_PERMISSION")}
                                        </StyledButton>
                                    </div>
                                </div>
                            </div>
                            <Grid item xs={12} className="displayFlex content_tabing">
                                <ETabBar
                                    style={{ minWidth: "280px" }}
                                    value={currentTab}
                                    textColor="primary"
                                    variant="fullWidth"
                                    onChange={(e, i) => { switchTabHandler(i) }}
                                    aria-label="tabs example"
                                    className="tab_style"
                                >
                                    <ETab label={t("sentinel-Admin-Auth:ROLE_LIST")} eSize='small' />
                                    <ETab label={t("sentinel-Admin-Auth:PERMISSON_LIST")} eSize='small' />
                                </ETabBar>

                            </Grid>
                            {currentTab == 0 && <RoleTable className="tableIn1" MSRoles={MSRoles} editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />}

                            {currentTab == 1 && <PermissionTable MSPermissions={permissions} editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />}
                        </Grid>
                    )}



                    {(editFormHelper.isOpen && (editFormHelper.openType == 'ADD' || editFormHelper.openType == 'EDIT')) && (
                        <Grid item xs={12} >
                            <NewRoleForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                        </Grid>
                    )}

                    {(editFormHelper.isOpen && (editFormHelper.openType == 'CreatePermission' || editFormHelper.openType == 'EditPermission')) && (
                        <Grid item xs={12} >
                            <NewPermissionForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} currentTab={currentTab} setCurrentTab={setCurrentTab} />
                        </Grid>
                    )}
                </div>
            </Container>
        </ThemeProvider>
    )
}