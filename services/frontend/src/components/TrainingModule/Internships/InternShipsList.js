import React, {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import {Divider} from "@mui/material";
import {Container, Paper, Typography} from "@mui/material";
import Button from "@mui/material/Button";
import InternshipService from "services/internship.service";
import InternshipsTable from "./InternshipsTable";
import InternshipForm from "./InternshipForm";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useTranslation} from "react-i18next";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import StyledButton from "new_styled_components/Button/Button.styled";



export default function InternShipsList(){
    const {t} = useTranslation();
    const {setMyCurrentRoute,
        F_handleSetShowLoader,
        F_hasPermissionTo,
        F_showToastMessage,
    } = useMainContext();

    const [internships, setInternships] = useState([]);
    const [editFormHelper, setEditFormHelper] = useState({isOpen: false, openType: undefined, internshipId: undefined});

    useEffect(()=>{
        F_handleSetShowLoader(true);
        setMyCurrentRoute("Internships");
        InternshipService.readAll().then(res=>{
            if(res.status === 200 && res.data){
                setInternships(res.data);
                F_handleSetShowLoader(false);
            }
        }).catch(error=>console.log(error))
    }, [editFormHelper.isOpen]);

    return(
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv internshipModule">
                <div className="admin_content">

                {editFormHelper.openType == 'ADD' ?
                            
                        <InternshipForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper}/>  
                    
                    :

                    <>
                        <div className="admin_heading">
                            <Grid>
                                <Typography variant="h1" className="typo_h5">{t("Internships")}</Typography>
                                <Divider variant="insert" className='heading_divider' />
                            </Grid>
                            <div className="heading_buttons">
                                <div className="pri-btn-wrap">
                                    <StyledButton className="w-100-mb" eVariant="primary" eSize="large" component="span"
                                        disabled={editFormHelper.isOpen}
                                        onClick={()=>{
                                            if (F_hasPermissionTo('create-internship')) setEditFormHelper({isOpen: true, openType: 'ADD', internshipId: 'NEW'});
                                            else F_showToastMessage("You don't have permission to create new internship", "error")
                                        }}
                                    >{t('Add New Internship')}
                                    </StyledButton>
                                </div>
                            </div>
                        </div>
                        <InternshipsTable setEditFormHelper={setEditFormHelper} internships={internships}/>

                    





                        {/* <Grid container spacing={1}>
                        
                            <Grid item xs={12} lg={editFormHelper.isOpen ? 5 : 12}>
                                    <div className="d-flex pt-2 px-2 mb-2 justify-content-between">
                                
                                        <Button size="small" variant="contained" color="primary"
                                                disabled={editFormHelper.isOpen}
                                                onClick={()=>{
                                                    if (F_hasPermissionTo('create-internship')) setEditFormHelper({isOpen: true, openType: 'ADD', internshipId: 'NEW'});
                                                    else F_showToastMessage("You don't have permission to create new internship", "error")
                                                }}
                                        >{t('Add new internship')}</Button>
                                    </div>
                                    <InternshipsTable setEditFormHelper={setEditFormHelper} internships={internships}/>
                                </Grid>
                            
                            
                            <Grid item xs={12} lg={7} hidden={!editFormHelper.isOpen}>
                                <Paper elevation={10} className="p-0">
                                    <InternshipForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper}/>
                                </Paper>
                            </Grid> 
                        </Grid> */}


                    </>






                }
                </div>
            </Container>
        </ThemeProvider>
    )
}