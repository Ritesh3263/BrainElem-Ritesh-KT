import { Typography, ThemeProvider } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useEffect, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import ModuleCoreService from "services/module-core.service"
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import TeamTable from "./TeamTable"
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import CreateTeam from "./CreateTeam";
import Confirm from "components/common/Hooks/Confirm";
import "./teams.scss"
import { spacing } from '@mui/system';
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
const ModuleList = lazy(() => import("../ModuleList"));
const AwaitingApprovalList = lazy(() => import("../AwaitingApprovalList"));
// const useStyles = makeStyles(theme => ({

//     buttonRoot: {
//         minWidth: "98px",
//         margin: "0",
//         padding: "0",
//         overflowY: "none",
//     }
// }))

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
                navigate("/modules-core/authorizations/roles")
                break;
            default:
                break;
        }
    }, [currentTab])

    return (
        <ThemeProvider theme={new_theme}>
            <Grid container spacing={1} className="mainChildDiv">
                {(!editFormHelper.isOpen) && (
                    <Grid item xs={12} className="minHeight-60vh">
                        {/* <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                        <Button classes={{ root: classes.root }} size="small" variant="contained" color="primary"
                            disabled={editFormHelper.isOpen}
                            onClick={() => { setEditFormHelper({ isOpen: true, openType: 'ADD', userId: 'NEW', isBlocking: false }) }}
                        >{t("Create new role")}</Button>
                    </div> */}
                        <div className="admin_content">
                            <div className="admin_heading">
                                <Grid>
                                    <Typography variant="h1" component="h1">
                                       {t("Teams Creation & Assignments")}
                                    </Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </Grid>
                                {/* <h5 className="typo_h5">Authorizations</h5>
                            <Divider variant="insert" className='heading-divider' /> */}
                                <div className="heading_buttons">
                                    <div className="display-flex pri-btn-wrap">
                                        <label className="uploadCSVbtn" htmlFor="usersCsvInput">
                                            <input
                                                style={{ display: "none" }}
                                                accept="text/csv"
                                                multiple
                                                type="file"
                                            />
                                            <StyledButton eVariant='primary' component="span"
                                                disabled={editFormHelper.isOpen}
                                                onClick={() => { setEditFormHelper({ isOpen: true, openType: 'ADDTEAM', userId: 'NEW', isBlocking: false }) }}>
                                                {t("Create Teams")}
                                            </StyledButton>
                                        </label>
                                        {/* <Button className="btn_secondary" component="span"
                                        disabled={editFormHelper.isOpen}
                                        onClick={() => { setEditFormHelper({ isOpen: true, openType: 'CreatePermission', userId: 'NEW1', isBlocking: false }) }}>
                                        {t("Create Permission")}
                                    </Button> */}
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="temaList_table">
                            {MSRoles.length > 0 ?

                                <TeamTable MSRoles={MSRoles} editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} /> : <span  >{t("Download example, then upload correct file (remember to follow the data structure)")}</span>}

                            {!MSRoles.length > 0 ?
                                <img className="modelUserPic" src="/img/brand/model-userlist.png"></img> : ""
                            }
                        </div>
                    </Grid>
                )}
                {(editFormHelper.isOpen && editFormHelper.openType == 'ADDTEAM') && (
                    <Grid item xs={12}>
                        <CreateTeam editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                    </Grid>
                )}

            </Grid>
        </ThemeProvider>
    )
}