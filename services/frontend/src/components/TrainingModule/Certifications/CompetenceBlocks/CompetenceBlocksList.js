import React, {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import {Paper} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import {useNavigate} from "react-router-dom";
import CompetenceBlockService from "services/competence_block.service"
import CompetenceBlockTable from "./CompetenceBlockTable";
import CompetenceBlockForm from "./CompetenceBlockForm"
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Container from '@mui/material/Container';

import {ETabBar, ETab, EButton} from "new_styled_components";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";
import { Divider } from "@mui/material";


export default function CompetenceBlocksList(){
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentTab, setCurrentTab] = useState(0);

    const [competenceBlocks, setCompetenceBlocks] = useState([]);
    const [formIsOpen, setFormIsOpen] = useState({isOpen: false, isNew: true, competenceBlockId: ""});
    // setCurrentRoute
    const {setMyCurrentRoute, F_showToastMessage, F_hasPermissionTo} = useMainContext();

    useEffect(()=>{
        setMyCurrentRoute("Certificate")
    },[])

    useEffect(()=>{
        CompetenceBlockService.readAll().then(res=>{
            setCompetenceBlocks(res.data);
        })
    },[formIsOpen.isOpen]);

    return(
            <ThemeProvider theme={new_theme}>
                <Container maxWidth="xl" className="mainContainerDiv mainSubjectDiv">
                {!formIsOpen.isOpen ?
                    <>
                        
                        <Grid item xs={12}>
                            <div className="admin_content">
                                <div className="admin_heading">

                                    <Grid>
                                        <Typography variant="h1" component="h1">{t("Certificate Templates")}</Typography>
                                        <Divider variant="insert" className='heading_divider' />
                                    </Grid>

                                    <div className="heading_buttons">
                                        <StyledButton eVariant="primary" eSize="large" disabled={formIsOpen.isOpen}
                                               onClick={()=>{
                                                if (F_hasPermissionTo('create-competences')) setFormIsOpen({isOpen: true, isNew: true, competenceBlockId: ""})
                                                else F_showToastMessage(t("You don't have permission to create competence blocks"))
                                            }}
                                        >{t("Add competence block")}
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
                                            label={t("Competence blocks")}
                                            eSize="small"
                                            classes="tab_style"
                                            onClick={()=>{navigate("/certifications/competenceBlocks")}}
                                        />
                                        <ETab
                                            label={t("Certificates")}
                                            eSize="small"
                                            classes="tab_style"
                                            onClick={()=>{navigate("/certifications/certificates")}}
                                        />
                                        
                                    </ETabBar>
                                </div>
                                <div className="tabing_table">
                                    <Grid container spacing={1}>
                                        <Grid item xs={12} >
                                        <CompetenceBlockTable competenceBlocks={competenceBlocks} setFormIsOpen={setFormIsOpen}/>
                                        </Grid>
                                    </Grid>
                                </div>
                            </div>
                        </Grid>



                                {/* <Grid item xs={12} className="d-flex justify-content-center mb-2 mt-3" >
                                    <ETabBar
                                        style={{ minWidth:"300px" }}
                                        value={currentTab}
                                        eSize='small'
                                    >
                                        <ETab label={t("Competence blocks")} eSize='small' onClick={()=>{navigate("/certifications/competenceBlocks")}}/>
                                        <ETab label={t("Certificates")} eSize='small' onClick={()=>{navigate("/certifications/certificates")}} />
                                    </ETabBar>
                                </Grid> */}
                        {/* <Grid item xs={12} lg={formIsOpen.isOpen ? 6 : 12}>
                                <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                                    <Button size="small" variant="contained" color="primary"
                                            
                                            disabled={formIsOpen.isOpen}
                                            onClick={()=>{
                                                //navigate("/certifications/competenceBlock/new")
                                                if (F_hasPermissionTo('create-competences')) setFormIsOpen({isOpen: true, isNew: true, competenceBlockId: ""})
                                                else F_showToastMessage(t("You don't have permission to create competence blocks"))
                                            }}
                                    >{t("Add competence block")}</Button>
                                </div>
                                <CompetenceBlockTable competenceBlocks={competenceBlocks} setFormIsOpen={setFormIsOpen}/>
                        </Grid> */}
                            
                        

                    </>
                    :
                    <>
                        <Grid item xs={12} lg={6} hidden={!formIsOpen.isOpen}>
                            <Paper elevation={10} className="p-0" sx={{boxShadow:'none'}}>
                                <CompetenceBlockForm formIsOpen={formIsOpen} setFormIsOpen={setFormIsOpen} />
                            </Paper>
                        </Grid>
                    </>
                }
                </Container>
            </ThemeProvider>
    )
}