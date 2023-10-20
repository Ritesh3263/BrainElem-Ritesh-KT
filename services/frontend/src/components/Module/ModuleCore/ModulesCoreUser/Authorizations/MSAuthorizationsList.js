import { useEffect, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import ModuleCoreService from "services/module-core.service"
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
import {Divider} from "@mui/material";
import { Typography } from "@mui/material";

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
        ModuleCoreService.readAllRoles().then(res => {
            console.log(res.data);
            setMSRoles(res.data.data)
            F_handleSetShowLoader(false);
        }).catch(error => console.error(error))
        setMyCurrentRoute("Module Authorizations")
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
                navigate("/new-modules-core/authorizations/roles")
                break;
            default:
                break;
        }
    }, [currentTab])

    return (
        <Grid container spacing={1} className="mainChildDiv">
            {(!editFormHelper.isOpen) && (
                <Grid item xs={12}>
                    <div className="admin_content">

                        <div className="admin_heading">
                            <Grid>
                                <Typography className="typo_h5">Authorizations</Typography>
                                <Divider variant="insert" className='heading-divider' />
                            </Grid>
                            {/* <h5 className="typo_h5">Authorizations</h5>
                            <Divider variant="insert" className='heading-divider' /> */}
                            <div className="heading_buttons">
                                <div className="d-flex pri-btn-wrap">
                                    <label className="uploadCSVbtn" htmlFor="usersCsvInput">
                                        <input
                                            style={{ display: "none" }}
                                            accept="text/csv"
                                            multiple
                                            type="file"
                                        />
                                        <Button className="btn_primary" component="span"
                                            disabled={editFormHelper.isOpen}
                                            onClick={() => { setEditFormHelper({ isOpen: true, openType: 'ADD', userId: 'NEW', isBlocking: false }) }}>
                                            {t("Create Roles")}
                                        </Button>
                                    </label>
                                    <Button className="btn_secondary" component="span"
                                        disabled={editFormHelper.isOpen}
                                        onClick={() => { setEditFormHelper({ isOpen: true, openType: 'CreatePermission', userId: 'NEW1', isBlocking: false }) }}>
                                        {t("Create Permission")}
                                    </Button>
                                </div>
                            </div>

                        </div>

                    </div>
                    <Grid item xs={12} className="d-flex mt-2 content_tabing">
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
                            <ETab label={t("Permission List")} eSize='small' />
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

        </Grid>
    )
}