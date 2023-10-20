import { Typography, ThemeProvider } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useEffect, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";

// Services
import TeamService from "services/team.service"
import CommonService from "services/common.service"


import Container from '@mui/material/Container';
import Grid from "@mui/material/Grid";
import TeamTable from "./TeamTable"
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import CreateTeam from "./CreateTeam";
import Confirm from "components/common/Hooks/Confirm";
import "./teams.scss"
import { new_theme } from "NewMuiTheme";
// Components
import StyledButton from "new_styled_components/Button/Button.styled";
import ETooltip from 'styled_components/Tooltip'

export default function MSAuthorizationsList() {
    const { t } = useTranslation(['sentinel-MyTeams-Teams', 'common']);
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
    const { manageScopeIds, user, isEdu } = F_getHelper();

    // open types: ['IMPORT','PREVIEW', 'ADD','EDIT'];
    const [editFormHelper, setEditFormHelper] = useState({ isOpen: false, openType: 'PREVIEW', userId: 'NEW', isBlocking: false })

    const loadTeams = () => {
        F_handleSetShowLoader(true)
        TeamService.readAllTeam(manageScopeIds.moduleId).then(res => {
            console.log(res.data);
            setMSRoles(res.data.data)

            F_handleSetShowLoader(false);
        }).catch(error => console.error(error))

    }

    useEffect(() => {
        loadTeams()
        setMyCurrentRoute("Module Authorizations")
    }, [editFormHelper.isOpen])

    useEffect(() => {
        if (openModuleList) return;
        F_handleSetShowLoader(true)
        TeamService.readAllTeam(manageScopeIds.moduleId).then(res => {
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


    // Create demo team
    const generateDemoTeam = (range) => {
        F_handleSetShowLoader(true)
        F_showToastMessage(t('sentinel-MyTeams-Teams:GENERATE_TEAM_WITH_{{range}}_VALUES', {range: range}))
        TeamService.generateDemoTeam(range, 15, isEdu).then(res => {
            F_showToastMessage(t('sentinel-MyTeams-Teams:DEMO_GENERATED'), 'success')
            loadTeams()
        }).catch(error =>{
            F_showToastMessage(t('sentinel-MyTeams-Teams:DEMO_GENERATED_FAILED'), 'error')
            F_handleSetShowLoader(false)
        })

    }

    return (
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv team_list">
                <Grid container spacing={1}>
                    {(!editFormHelper.isOpen) && (
                        <Grid item xs={12} className="minHeight-60vh">
                            <div className="admin_content">
                                <div className="admin_heading">
                                    <Grid>
                                        <Typography variant="h1" component="h1" >
                                            {F_t("sentinel-MyTeams-Teams:MY_TEAMS")}
                                        </Typography>
                                        <Divider variant="insert" className='heading_divider' />
                                    </Grid>
                                    {/* <h5 className="typo_h5">Authorizations</h5>
                            <Divider variant="insert" className='heading-divider' /> */}
                                    <div className="heading_buttons w-100-mb">
                                        <div className="displayFlex pri-btn-wrap w-100-mb">
                                            <label className="uploadCSVbtn w-100-mb" htmlFor="usersCsvInput">
                                                <input
                                                    style={{ display: "none" }}
                                                    accept="text/csv"
                                                    multiple
                                                    type="file"
                                                />
                                                {<ETooltip title={(CommonService.isDevelopment() || CommonService.isMarketingModule(user)) && <>
                                                    {F_t("sentinel-MyTeams-Teams:DEMO_TEAM")}<br /><br />
                                                    <>{F_t("sentinel-MyTeams-Teams:DEMO_TEAM_EXPLANATION")}</><br /><br />
                                                    {t("sentinel-MyTeams-Teams:DEMO_TEAM_BUTTONS_EXPLANATION")}<br />
                                                    <button style={{ margin: '5px' }} onClick={() => {  generateDemoTeam('random') }}>{t("sentinel-MyTeams-Teams:DEMO_TEAM_BUTTON_RANDOM")}</button>
                                                    <button style={{ margin: '5px' }} onClick={() => {  generateDemoTeam('low') }}>{t("sentinel-MyTeams-Teams:DEMO_TEAM_BUTTON_LOW")}</button><br/>
                                                    <button style={{ margin: '5px' }} onClick={() => {  generateDemoTeam('medium') }}>{t("sentinel-MyTeams-Teams:DEMO_TEAM_BUTTON_MEDIUM")}</button>
                                                    <button style={{ margin: '5px' }} onClick={() => {  generateDemoTeam('high') }}>{t("sentinel-MyTeams-Teams:DEMO_TEAM_BUTTON_HIGH")}</button>
                                                </>
                                                }>

                                                    <StyledButton eVariant="primary" eSize="large" className="btn_primary w-100-mb" component="span"
                                                        disabled={editFormHelper.isOpen}
                                                        onClick={() => { setEditFormHelper({ isOpen: true, openType: 'ADDTEAM', userId: 'NEW', isBlocking: false }) }}>
                                                        {F_t("sentinel-MyTeams-Teams:CREATE_TEAM")}
                                                    </StyledButton>
                                                </ETooltip>}
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

                                    <TeamTable MSRoles={MSRoles} editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} /> : <span  >{t("common:DOWNLOAD_EXAMPLE")}</span>}

                                {!MSRoles.length > 0 ?
                                    <img className="modelUserPic" src="/img/brand/model-userlist.png"></img> : ""
                                }
                            </div>
                        </Grid>
                    )}
                    {(editFormHelper.isOpen && (editFormHelper.openType == 'ADDTEAM' || editFormHelper.openType == 'EDIT')) && (
                        <Grid item xs={12}>
                            <CreateTeam editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                        </Grid>
                    )}

                </Grid>
            </Container>
        </ThemeProvider>
    )
}