import { useEffect, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardHeader,
    Divider,
} from "@mui/material";
import ModuleCoreService from "services/module-core.service"
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
// import { makeStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import RoleTable from "./PermissionTable"
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import NewRoleForm from "./NewRoleForm";
import NewPermissionForm from "./NewPermissionForm"
import Confirm from "components/common/Hooks/Confirm";
import { ETab, ETabBar } from "new_styled_components";
import { Typography, ThemeProvider } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
import './authorizations.scss'

export default function MSAuthorizationsList() {
    const { t } = useTranslation();
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
            F_handleSetShowLoader(false);
        }).catch(error => console.error(error))
    }, [openModuleList])

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
                navigate("/new-modules-core/authorization/roles")
                break;
            default:
                break;
        }
    }, [currentTab])

    return (
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv Auth_Module">
                <div className="admin_content">
                    {(!editFormHelper.isOpen) && (
                        <Grid item xs={12}>
                            <div className="admin_heading">
                                <Grid>
                                    <Typography variant="h1" className="typo_h5">{t("Permissions")}</Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </Grid>
                                <div className="heading_buttons">
                                    <div className="d-flex pri-btn-wrap">
                                        <label className="uploadCSVbtn" htmlFor="usersCsvInput">
                                            <input
                                                style={{ display: "none" }}
                                                accept="text/csv"
                                                multiple
                                                type="file"
                                            />
                                            <StyledButton eVariant="primary" className="btn_primary"
                                                disabled={editFormHelper.isOpen}
                                                onClick={() => { setEditFormHelper({ isOpen: true, openType: 'ADD', userId: 'NEW', isBlocking: false }) }}>
                                                {t("Create Roles")}
                                            </StyledButton>
                                        </label>
                                        <StyledButton eVariant="secondary" className="btn_secondary"
                                            disabled={editFormHelper.isOpen}
                                            onClick={() => { setEditFormHelper({ isOpen: true, openType: 'CreatePermission', userId: 'NEW1', isBlocking: false }) }}>
                                            {t("Create Permission")}
                                        </StyledButton>
                                    </div>
                                </div>
                            </div>
                            <Grid item xs={12} className="content_tabing">
                                <ETabBar
                                    style={{ minWidth: "280px" }}
                                    value={currentTab}
                                    textColor="primary"
                                    variant="fullWidth"
                                    onChange={(e, i) => { switchTabHandler(i) }}
                                    aria-label="tabs example"
                                    className="tab_style"
                                >
                                    <ETab label={t("Role List")} eSize='small' />
                                    <ETab label={t("Permissions List")} eSize='small' />
                                </ETabBar>
                            </Grid>
                            <RoleTable className="tableIn1" MSRoles={MSRoles} editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                        </Grid>
                    )}

                    {(editFormHelper.isOpen && editFormHelper.openType == 'ADD') && (
                        <Grid item xs={12} >
                            <NewRoleForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                        </Grid>
                    )}

                    {(editFormHelper.isOpen && editFormHelper.openType == 'CreatePermission') && (
                        <Grid item xs={12} >
                            <NewPermissionForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                        </Grid>
                    )}

                    {(editFormHelper.isOpen && (editFormHelper.openType == 'ADD' || editFormHelper.openType == 'EDIT')) && (
                        <Grid item xs={12} >
                            <NewRoleForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                        </Grid>
                    )}

                    {(editFormHelper.isOpen && editFormHelper.openType == 'CreatePermission') && (
                        <Grid item xs={12} >
                            <NewPermissionForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                        </Grid>
                    )}
                </div>
            </Container>
        </ThemeProvider>
    )
}
