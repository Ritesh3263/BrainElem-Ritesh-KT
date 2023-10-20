import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import BCTestService from "services/bcTestRegistration.service"
import { Box, Container } from "@mui/material";
import Grid from "@mui/material/Grid";
import BrainCoreTable from "./BrainCoreTable"
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Confirm from "components/common/Hooks/Confirm";
import { ETab, ETabBar } from "styled_components";
import { Divider } from "@mui/material";
import { Typography } from "@mui/material";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import StyledButton from "new_styled_components/Button/Button.styled";
import { BsFillCircleFill } from 'react-icons/bs';
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import "./teams.scss"
import { useToasts } from 'react-toast-notifications'
import TeamService from "services/team.service"

export default function BrainCoreTest(props) {
    const { addToast } = useToasts();
    const { t } = useTranslation(['translation', 'sentinel-MyUsers-BCTestRegistration', 'sentinel-MyTeams-Teams', 'common']);
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
    const [rows, setRows] = useState();

    // open types: ['IMPORT','PREVIEW', 'ADD','EDIT'];
    const [editFormHelper, setEditFormHelper] = useState({ isOpen: false, openType: 'PREVIEW', userId: 'NEW', isBlocking: false })
    useEffect(() => {
        F_handleSetShowLoader(true)

        BCTestService.getBCTestUsersByModuleId().then(res => {

            const temp = res.data.data.map((dat) => {
                return { 'id': dat._id, 'user': dat.username, 'team': dat.team?.name, 'registartion_date': dat.brainCoreTest?.registerDate, 'completion_date': dat.brainCoreTest?.completionDate, 'status': dat.brainCoreTest?.status }
            })
            setMSRoles(temp)

            F_handleSetShowLoader(false);
        }).catch(error => console.error(error))
        setMyCurrentRoute("Module Authorizations")
    }, [editFormHelper.isOpen])

    useEffect(() => {
        if (openModuleList) return;
        F_handleSetShowLoader(true)
        BCTestService.getBCTestUsersByModuleId().then(res => {
            const temp = res.data.data.map((dat) => {
                return { 'id': dat._id, 'user': dat.username, 'team': dat.team?.name, 'registartion_date': dat.brainCoreTest?.registerDate, 'completion_date': dat.brainCoreTest?.completionDate, 'status': dat.brainCoreTest?.status }
            })
            setMSRoles(temp)

            F_handleSetShowLoader(false);
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

    useEffect(() => {
        fetchUserData();
    }, []);

    function fetchUserData() {
        TeamService.readTeam(props.teamId).then((res) => {
            setRows(res.data.data);
            addToast(F_t("sentinel-MyTeams-Teams:USERS_FETCHED_SUCCESSFULLY"), { appearance: 'success', autoDismiss: true });
        }).catch((err) => {
            addToast(err.message, { appearance: 'error', autoDismiss: true });
        });
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

    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? `${new_theme.palette.primary.MedPurple}` : `${new_theme.palette.primary.MedPurple}`,
        },
    }));

    return (
        <ThemeProvider theme={new_theme}>
            <Grid item xs={12}>
                <div className="edit_teams">
                    <div className="admin_heading" style={{ marginBottom: '16px' }}>
                        {
                            rows && <Fragment><div className="teams_header">
                                <div className="test_status">
                                    <Typography variant="" component="">{F_t("sentinel-MyTeams-Teams:TOTAL_USERS")} &nbsp;<span>{rows.trainee.length}</span></Typography>
                                    <div className="btnStatus btnStatusNoTest">
                                        <BsFillCircleFill />&nbsp; <Typography variant="subtitle1" component="span">{t("sentinel-MyUsers-BCTestRegistration:STATUS_NOT_INVITED")} &nbsp;<span>{rows.brainCoreTest.noTestTaken}</span></Typography>
                                    </div>
                                    <div className="btnStatus btnStatusCompleted">
                                        <BsFillCircleFill />&nbsp; <Typography variant="subtitle1" component="span">{t("sentinel-MyUsers-BCTestRegistration:STATUS_COMPLETED")} &nbsp;<span>{rows.brainCoreTest.completed}</span></Typography>
                                    </div>
                                    <div className="btnStatus btnStatusSent">
                                        <BsFillCircleFill />&nbsp; <Typography variant="subtitle1" component="span">{t("sentinel-MyUsers-BCTestRegistration:STATUS_REQUEST_SENT")} &nbsp;<span>{rows.brainCoreTest.requestSent}</span></Typography>

                                    </div>
                                    <div className="btnStatus btnStatusNotCompleted">
                                        <BsFillCircleFill />&nbsp; <Typography variant="subtitle1" component="span">{t("sentinel-MyUsers-BCTestRegistration:STATUS_NOT_COMPLETED")} &nbsp;<span>{rows.brainCoreTest.notCompleted}</span></Typography>
                                    </div>
                                </div>

                            </div><Box sx={{ display: 'flex', alignItems: 'center', ml: { md: 0, lg: 3 } }}>
                                    <BorderLinearProgress className="progress_bar" variant="determinate" value={((rows.brainCoreTest.completed/rows.trainee.length) * 100)} sx={{ marginRight: '16px' }} />
                                    <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t(`${rows.brainCoreTest.completed}/${rows.trainee.length}`)}</Typography>
                                </Box></Fragment>
                        }
                    </div>
                </div>
                {/* <Grid item xs={12} className="content_tabing" style={{ display: "flex", marginTop: ".5rem" }}>
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
                    </ETabBar>

                </Grid> */}


                {rows && <BrainCoreTable className="tableIn1" MSRoles={MSRoles} teamId={props.teamId} editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} fetchUserData={fetchUserData} trainee={rows.trainee} />}
            </Grid>
        </ThemeProvider>
    )
}