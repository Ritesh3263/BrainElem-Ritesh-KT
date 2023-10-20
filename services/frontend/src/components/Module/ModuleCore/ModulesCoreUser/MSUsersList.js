import { useEffect, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import ModuleCoreService from "services/module-core.service";
import ModuleService from "services/module.service";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Paper } from "@material-ui/core";
import UsersTable from "./UsersTable";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import NewUserForm from "./NewUserForm";
import Confirm from "components/common/Hooks/Confirm";
import { ETab, ETabBar } from "styled_components";
import "./UserList.scss"
// import ModuleList from "./ModuleList";
const ModuleList = lazy(() => import("./ModuleList"));
const AwaitingApprovalList = lazy(() => import("./AwaitingApprovalList"));
const useStyles = makeStyles((theme) => ({
    buttonRoot: {
        minWidth: "98px",
        margin: "0",
        padding: "0",
        overflowY: "none",
    },
}));

export default function MSUsersList() {
    const { t } = useTranslation();
    const { isConfirmed } = Confirm();
    const classes = useStyles();
    const [currentTab, setCurrentTab] = useState(0);
    const [openModuleList, setOpenModuleList] = useState(false);
    const navigate = useNavigate();
    const [MSUsers, setMSUsers] = useState([]);
    // const [module, setModule] = useState(null);
    const [remainingUserLimit, setRemainingUserLimit] = useState(0);
    // setCurrentRoute
    const {
        setMyCurrentRoute,
        F_showToastMessage,
        F_getHelper,
        F_handleSetShowLoader,
    } = useMainContext();
    const { manageScopeIds, user } = F_getHelper();

    // open types: ['IMPORT','PREVIEW', 'ADD','EDIT'];
    const [editFormHelper, setEditFormHelper] = useState({
        isOpen: false,
        openType: "PREVIEW",
        userId: "NEW",
        isBlocking: false,
    });

    useEffect(() => {
        F_handleSetShowLoader(true);
        ModuleCoreService.readAllModuleUsers(manageScopeIds.moduleId)
            .then((res) => {
                setMSUsers(res.data);
                ModuleService.read(manageScopeIds.moduleId)
                    .then((res2) => {
                        // setModule(res2.data)
                        setRemainingUserLimit(res2.data.usersLimit - res.data.length);
                    })
                    .catch((error) => console.error(error));
                F_handleSetShowLoader(false);
            })
            .catch((error) => console.error(error));
        setMyCurrentRoute("Module users");
    }, [editFormHelper.isOpen]);

    useEffect(() => {
        if (openModuleList) return;
        F_handleSetShowLoader(true);
        ModuleCoreService.readAllModuleUsers(manageScopeIds.moduleId)
            .then((res) => {
                setMSUsers(res.data);
                ModuleService.read(manageScopeIds.moduleId)
                    .then((res2) => {
                        setRemainingUserLimit(res2.data.usersLimit - res.data.length);
                    })
                    .catch((error) => console.error(error));
                F_handleSetShowLoader(false);
            })
            .catch((error) => console.error(error));
    }, [openModuleList]);

    async function switchTabHandler(i) {
        if (editFormHelper.isBlocking) {
            let confirm = await isConfirmed(
                "Are you sure you want to leave this tab without saving?"
            );
            if (!confirm) return;
        }

        setEditFormHelper((prev) => ({ ...prev, isBlocking: false }));
        setCurrentTab(i);
    }

    useEffect(() => {
        switch (currentTab) {
            case 0:
                break;
            case 1:
                navigate("/sentinel/myusers/users/import-export");
                break;
            case 2:
                navigate("/modules-core/users/roles");
                break;
            default:
                break;
        }
    }, [currentTab]);

    return (
        <>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <div className={editFormHelper.isOpen ? 'hideUserList' : 'showUserList'}>
                            <ETabBar
                                style={{ minWidth: "280px" }}
                                value={currentTab}
                                textColor="primary"
                                variant="fullWidth"
                                onChange={(e, i) => {
                                    switchTabHandler(i);
                                }}
                                aria-label="tabs example"
                                eSize="small"
                            >
                                <ETab
                                    label={t("Users List")}
                                    eSize="small"
                                    classes={{ root: classes.buttonRoot }}
                                />
                                <ETab
                                    label={t("Import from (CSV)")}
                                    eSize="small"
                                    classes={{ root: classes.buttonRoot }}
                                />
                                <ETab
                                    label={t("Users Roles")}
                                    eSize="small"
                                    classes={{ root: classes.buttonRoot }}
                                />
                            </ETabBar>
                            <div className="">
                                <Button
                                    classes={{ root: classes.root }}
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    disabled={editFormHelper.isOpen}
                                    onClick={() => {
                                        setEditFormHelper({
                                            isOpen: true,
                                            openType: "ADD",
                                            userId: "NEW",
                                            isBlocking: false,
                                        });
                                    }}
                                >
                                    {t("Create new user")}
                                </Button>
                                <Button
                                    classes={{ root: classes.root }}
                                    size="small"
                                    variant="contained"
                                    color="primary"
                                    disabled={openModuleList}
                                    onClick={() => {
                                        setOpenModuleList(true);
                                    }}
                                >
                                    {t("Import users from other modules")}
                                </Button>
                            </div>
                            <UsersTable
                                MSUsers={MSUsers}
                                editFormHelper={editFormHelper}
                                setEditFormHelper={setEditFormHelper}
                            />
                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className={editFormHelper.isOpen ? 'showUserList' : 'hideUserList'}>
                            {editFormHelper.isOpen && editFormHelper.openType !== "IMPORT" && (
                                <NewUserForm
                                    editFormHelper={editFormHelper}
                                    setEditFormHelper={setEditFormHelper}
                                />
                            )}
                            <ModuleList
                                open={openModuleList}
                                setOpen={setOpenModuleList}
                                user={user}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
