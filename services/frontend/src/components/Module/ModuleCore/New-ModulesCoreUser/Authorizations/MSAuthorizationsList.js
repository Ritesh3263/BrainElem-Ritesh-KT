import { useEffect, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import ModuleCoreService from "services/module-core.service"
import Button from '@mui/material/Button';
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@mui/material/Grid";
import RoleTable from "./RoleTable"
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import NewRoleForm from "./NewRoleForm";
import Confirm from "components/common/Hooks/Confirm";
import { ETab, ETabBar } from "styled_components";

const ModuleList = lazy(() => import("../ModuleList"));
const AwaitingApprovalList = lazy(() => import("../AwaitingApprovalList"));
const useStyles = makeStyles(theme => ({

    buttonRoot: {
        minWidth: "98px",
        margin: "0",
        padding: "0",
        overflowY: "none",
    }
}))

export default function MSAuthorizationsList() {
    const { t } = useTranslation();
    const { isConfirmed } = Confirm();
    const classes = useStyles();
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
            setMSRoles(res.data)
            F_handleSetShowLoader(false);
        }).catch(error => console.error(error))
        setMyCurrentRoute("Module Authorizations")
    }, [editFormHelper.isOpen])

    useEffect(() => {
        if (openModuleList) return;
        F_handleSetShowLoader(true)
        ModuleCoreService.readAllRoles().then(res => {
            setMSRoles(res.data)

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
        <Grid container spacing={1}>
            <Grid item xs={12} className="d-flex justify-content-center mt-2">
                <ETabBar
                    style={{ minWidth: "280px" }}
                    value={currentTab}
                    textColor="primary"
                    variant="fullWidth"
                    onChange={(e, i) => { switchTabHandler(i) }}
                    aria-label="tabs example"
                    eSize='small'
                >
                    <ETab label={t("Role Lists")} eSize='small' classes={{ root: classes.buttonRoot }} />
                    <ETab label={t("Permission")} eSize='small' classes={{ root: classes.buttonRoot }} />
                </ETabBar>

            </Grid>
            <Grid item xs={12} lg={editFormHelper.isOpen ? 6 : 12}>
                <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                    <Button classes={{ root: classes.root }} size="small" variant="contained" color="primary"
                        disabled={editFormHelper.isOpen}
                        onClick={() => { setEditFormHelper({ isOpen: true, openType: 'ADD', userId: 'NEW', isBlocking: false }) }}
                    >{t("Create new role")}</Button>
                </div>
                <RoleTable MSRoles={MSRoles} editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
            </Grid>
            {(editFormHelper.isOpen && editFormHelper.openType !== 'IMPORT') && (
                <Grid item xs={12} lg={editFormHelper.isOpen ? 6 : 12}>
                    <NewRoleForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                </Grid>
            )}

        </Grid>
    )
}