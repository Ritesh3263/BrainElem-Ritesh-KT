import { useEffect, useState, lazy } from "react";
import { useNavigate } from "react-router-dom";
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import NewProjectForm from "./ProjectForm"
import './Project.scss'
import { Box, Divider } from "@mui/material";
import { Typography, ThemeProvider } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
import ProjectTable from "./ProjectTable";
import TeamsProjects from "./TeamsProjects";
import ProjectService from "services/project.service";


export default function ProjectList() {
    const { t } = useTranslation(['sentinel-MyProjects-AutomatedProjects']);
    const [project, setProject] = useState(null);
    const [projectN, setProjectN] = useState({name:"",description:""});
    const [currentTab, setCurrentTab] = useState(0);
    const { setMyCurrentRoute, F_showToastMessage, F_getHelper, F_handleSetShowLoader } = useMainContext();
    const [projects, setProjects] = useState([]);
    const [fromStats, setFromStats] = useState(false);
    
    // open types: ['IMPORT','PREVIEW', 'ADD','EDIT'];
    const [editFormHelper, setEditFormHelper] = useState({ isOpen: false, openType: 'PREVIEW', projectId: 'NEW', isBlocking: false, isOpen2: false})
    useEffect(() => {
        F_handleSetShowLoader(true)
        ProjectService.readAll().then(res => {
            console.log(res.data);
            setProjects(res.data);
            F_handleSetShowLoader(false);
        }).catch(error => console.error(error))
        setMyCurrentRoute("Module Authorizations")

    }, [editFormHelper.isOpen])

    useEffect(() => {
        console.log(editFormHelper);
        let tableData = JSON.parse(localStorage.getItem("project-data"));
        if (tableData) {
            setFromStats(true);
            localStorage.removeItem("project-data");
            setProject({name:"",description:"",deadline:null,cognitiveBlockCollection:tableData.opportunitiesData, team:tableData.selectedTeamsId[0]})
            setEditFormHelper({ isOpen: true, openType: 'ADD', projectId: 'NEW', team:{_id:tableData.selectedTeamsId[0]} , isBlocking: false, isOpen2: false })
        } else {
            fromStats && setFromStats(false);
            setProject({name:"",description:"",deadline:null,cognitiveBlockCollection:[]})
        }
    }, [editFormHelper.projectId])

    useEffect(() => {
        if (editFormHelper.clearCognitiveBlockCollection) {
            fromStats && setFromStats(false);
            setProject({name:"",description:"",deadline:null,cognitiveBlockCollection:[]})
        }
    }, [editFormHelper.clearCognitiveBlockCollection])


    return (<Box className="ProjectsContainer">
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv" sx={{p:"24px !important"}} >
                <div className="admin_content">
                    {(!editFormHelper.isOpen) && (
                        <Grid item xs={12}>
                            <Box className="admin_heading" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                            <Grid>
                                <Typography variant="h1" className="typo_h5" style={{ whiteSpace: 'nowrap' }}>{t("sentinel-MyProjects-AutomatedProjects:MY_PROJECTS")}</Typography>
                                <Divider variant="insert" className='heading-divider' />
                            </Grid>
                            <Box className="heading_buttons" sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                <div className="pri-btn-wrap mb-100" style={{ marginLeft: 'auto'}}>
                                <StyledButton className="w-100-mb" eVariant="primary" eSize="large" component="span"
                                    disabled={editFormHelper.isOpen}
                                    onClick={() => { setEditFormHelper({ isOpen: true, openType: 'ADD', projectId: 'NEW', isBlocking: false }) }}>
                                    {t("sentinel-MyProjects-AutomatedProjects:NEW_PROJECT")}
                                </StyledButton>
                                </div>
                            </Box>
                            </Box>

                            {/* <Grid item xs={12} className="displayFlex content_tabing">
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
                                    <ETab label={t("Project List")} eSize='small' />
                                </ETabBar>

                            </Grid> */}
                            {/* {currentTab === 0 && <RoleTable className="tableIn1" MSRoles={MSRoles} editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />} */}

                            {currentTab === 0 && <ProjectTable projects={projects} editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />}
                        </Grid>
                    )}



                    {/* {(editFormHelper.isOpen && (editFormHelper.openType === 'ADD' || editFormHelper.openType === 'EDIT')) && (
                        <Grid item xs={12} >
                            <NewRoleForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />
                        </Grid>
                    )} */}

                    {editFormHelper.isOpen && (
                        <Grid xs={12} >
                            {/* {(editFormHelper.openType === 'ADD' || editFormHelper.openType === 'EDIT') ? */}
                            { editFormHelper.isOpen2 ?
                                <TeamsProjects editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} />:
                                <NewProjectForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} currentProject={project} setCurrentProject={setProject} fromStats={fromStats} projectN={projectN} setProjectN={setProjectN} />
                            }
                        </Grid>
                    )}
                </div>
            </Container>
        </ThemeProvider>
    </Box >
    )
}