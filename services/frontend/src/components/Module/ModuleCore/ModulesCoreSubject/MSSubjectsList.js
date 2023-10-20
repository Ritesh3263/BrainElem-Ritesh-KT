import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import moduleCoreService from "services/module-core.service"
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import SubjectsTable from "./SubjectsTable"
import {useTranslation} from "react-i18next";
import {ETabBar, ETab, EButton} from "new_styled_components";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import MSSubjectsForm from "./MSSubjectsForm";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";
import { Typography } from "@mui/material";
import { Divider } from "@mui/material";
import Container from '@mui/material/Container';
import "./subject.scss"




export default function MSSubjectsList() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [MSSubjects, setMSSubjects] = useState([]);
    const [currentTab, setCurrentTab] = useState(0);
    const { setMyCurrentRoute, F_showToastMessage, F_getHelper, F_handleSetShowLoader, F_hasPermissionTo } = useMainContext();
    const { manageScopeIds } = F_getHelper();
    const [editFormHelper, setEditFormHelper] = useState({ isOpen: false, openType: null, subjectId: null });

    useEffect(() => {
        F_handleSetShowLoader(true)
        // setEditFormHelper({isOpen: false, openType: undefined, subjectId: undefined});
        setCurrentTab(0);

        moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res => {
            if (res.data.trainingModules) {
                setMSSubjects(res.data.trainingModules);
                F_handleSetShowLoader(false)
            }
        }).catch(error => console.error(error))
        setMyCurrentRoute("Subject")
    }, [editFormHelper.isOpen])

    return(
        <ThemeProvider theme={new_theme}>
        <Container maxWidth="xl" className="mainContainerDiv mainSubjectDiv">
            {!editFormHelper.isOpen ?
                <>
                    <Grid item xs={12} >
                        <div className="admin_content">
                            <div className="admin_heading">

                                <Grid>
                                    <Typography variant="h1" component="h1">{t("Subjects")}</Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </Grid>

                                <div className="heading_buttons">
                                    <StyledButton eVariant="primary" eSize="large" disabled={editFormHelper.isOpen}
                                            onClick={()=>{F_hasPermissionTo('create-subjects')?setEditFormHelper({isOpen: true, openType: 'ADD', subjectId: 'new'}):F_showToastMessage(t("You don't have permission to do this action"))}}
                                    >{t("Add subject")}
                                    </StyledButton>
                                </div>
                            </div>
                            <div className="content_tabing">
                                <ETabBar
                                    style={{ minWidth: "280px" }}
                                    value={currentTab}
                                    textColor="primary"
                                    variant="fullWidth"
                                    aria-label="tabs example"
                                    eSize="small"
                                    className="tab_style"
                                >
                                    <ETab
                                        label={t("Subjects")}
                                        eSize="small"
                                        classes="tab_style"
                                    />
                                    <ETab
                                        label={t("Catagories")}
                                        eSize="small"
                                        classes="tab_style"
                                        onClick={()=>{navigate("/modules-core/subjects-categories")}}
                                    />
                                    
                                </ETabBar>
                            </div>
                            <div className="tabing_table">
                                <Grid container spacing={1}>
                                    <Grid item xs={12} >
                                        <SubjectsTable MSSubjects={MSSubjects} setEditFormHelper={setEditFormHelper}/>
                                    </Grid>
                                </Grid>
                            </div>
                        </div>
                    </Grid>

                </>
                :
                <>
                    <Grid item xs={12}>
                        <MSSubjectsForm
                            editFormHelper={editFormHelper}
                            setEditFormHelper={setEditFormHelper}
                        />
                    </Grid>
                </>
            }

        </Container>
    </ThemeProvider>

            // <Grid container spacing={1}>
            //     <Grid item xs={12} className="mt-2 d-flex justify-content-center">
            //         <div style={{width: "500px"}} >
            //             <ETabBar
            //                 value={currentTab}
            //                 textColor="primary"
            //                 variant="fullWidth"
            //                 onChange={(e,i)=>setCurrentTab(i)}
            //                 aria-label="tabs example"
            //                 eSize='small'
            //             >
            //                 <ETab label={t("Subjects")} eSize='small'/>
            //                 <ETab label={t("Categories")} eSize='small' onClick={()=>{navigate("/modules-core/subjects-categories")}}/>
            //             </ETabBar>
            //         </div>
            //     </Grid>
            //     <Grid item xs={12}>
            //             <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
            //                 <EButton eSize="small" variant="contained" eVariant='primary'

            //                         disabled={editFormHelper.isOpen}
            //                         onClick={()=>{F_hasPermissionTo('create-subjects')?setEditFormHelper({isOpen: true, openType: 'ADD', subjectId: 'new'}):F_showToastMessage(t("You don't have permission to do this action"))}}
            //                 >{t("Add subject")}</EButton>
            //             </div>
                    
            //             <Grid container spacing={1}>
            //                 <Grid item xs={12} lg={editFormHelper.isOpen ? 6 : 12}>
            //                 <SubjectsTable MSSubjects={MSSubjects} setEditFormHelper={setEditFormHelper}/>
            //                 </Grid>
            //                 <Grid item xs={12} lg={6}  hidden={!editFormHelper.isOpen}>
            //                     <MSSubjectsForm 
            //                         editFormHelper={editFormHelper}
            //                         setEditFormHelper={setEditFormHelper}
            //                     />
            //                 </Grid>
            //             </Grid>
                    
            //     </Grid>
            // </Grid>
    )   
}