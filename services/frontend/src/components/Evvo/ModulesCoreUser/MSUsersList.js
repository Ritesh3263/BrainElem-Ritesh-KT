import { useEffect, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import ModuleCoreService from "services/module-core.service";
import { Divider } from "@mui/material";
import ModuleService from "services/module.service";
import Grid from "@mui/material/Grid";
import UsersTable from "./UsersTable";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import NewUserForm from "./NewUserForm";
import Confirm from "components/common/Hooks/Confirm";
import { ETab, ETabBar } from "styled_components";
import Container from '@mui/material/Container';
import "./UserList.scss"
import StyledButton from "new_styled_components/Button/Button.styled";
import { Typography } from "@mui/material";

import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import StaticRoles from "./StaticRoles";
// import ModuleList from "./ModuleList";
const ModuleList = lazy(() => import("./ModuleList"));
const AwaitingApprovalList = lazy(() => import("./AwaitingApprovalList"));




export default function MSUsersList() {
    const { t } = useTranslation(['common', 'sentinel-MyUsers-Users']);
    const { isConfirmed } = Confirm();
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
        if (localStorage.getItem('isForm') == 'false') {
            setEditFormHelper({
                isOpen: false,
                openType: "PREVIEW",
                userId: "NEW",
                isBlocking: false,
            })
        }
        localStorage.removeItem('isForm')
    }, [localStorage.getItem('isForm')]);

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
            .catch((error) => {
                F_handleSetShowLoader(false);
                console.error(error)});
        setMyCurrentRoute("Module users");
    }, [editFormHelper.isOpen]);

    // useEffect(() => {
    //     if (openModuleList) return;
    //     F_handleSetShowLoader(true);
    //     ModuleCoreService.readAllModuleUsers(manageScopeIds.moduleId)
    //         .then((res) => {
    //             setMSUsers(res.data);
    //             ModuleService.read(manageScopeIds.moduleId)
    //                 .then((res2) => {
    //                     setRemainingUserLimit(res2.data.usersLimit - res.data.length);
    //                 })
    //                 .catch((error) => console.error(error));
    //             F_handleSetShowLoader(false);
    //         })
    //         .catch((error) => console.error(error));
    // }, [openModuleList]);

    async function switchTabHandler(i) {
        if (editFormHelper.isBlocking) {
            let confirm = await isConfirmed(
                t("common:ARE_YOU_SURE_TO_LEAVE")
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
                if(user?.isInTrainingCenter){
                    navigate("/users/roles")
                }else{
                    navigate("/sentinel/admin/authorizations");
                }
                break;
            default:
                break;
        }
    }, [currentTab]);

    return (
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv mainUserDiv">
                <Grid item xs={12} className={editFormHelper.isOpen ? 'hideUserList' : 'showUserList'}>
                    <div className="admin_content">
                        <div className="admin_heading">

                            <Grid>
                                <Typography variant="h1" component="h1">{t("common:USERS")}</Typography>
                                <Divider variant="insert" className='heading_divider' />
                            </Grid>

                            <div className="heading_buttons">
                                <StyledButton eVariant="primary" eSize="large" onClick={() => {
                                    setEditFormHelper({
                                        isOpen: true,
                                        openType: "ADD",
                                        userId: "NEW",
                                        isBlocking: false,
                                    });
                                }}>
                                    {t("sentinel-MyUsers-Users:CREATE_USER")}
                                </StyledButton>

                                {/* <StyledButton eVariant="secondary" eSize="large" onClick={() => {
                                        setOpenModuleList(true);
                                    }}>
                                    {t("Import Users")}
                                    </StyledButton> */}

                            </div>
                        </div>
                        <div className="content_tabing">
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
                                className="tab_style"
                            >
                                <ETab
                                    label={t("common:USERS_LIST")}
                                    eSize="small"
                                    classes="tab_style"
                                />
                                <ETab
                                    label={t("common:IMPORT_CSV")}
                                    eSize="small"
                                    classes="tab_style"
                                />
                                <ETab
                                    label={t("common:USERS_ROLES")}
                                    eSize="small"
                                    classes="tab_style"
                                />
                            </ETabBar>
                        </div>
                        {currentTab==0 && <div className="tabing_table">
                             <UsersTable
                                MSUsers={MSUsers}
                                editFormHelper={editFormHelper}
                                setEditFormHelper={setEditFormHelper}
                            />
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
                        </div>}
                        {currentTab==2 && <StaticRoles/>}
                    </div>
                </Grid>
                <Grid item xs={12} className={editFormHelper.isOpen ? 'showUserList' : 'hideUserList'}>
                    <div>
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
                </Grid>

            </Container>
        </ThemeProvider>
    );
}
