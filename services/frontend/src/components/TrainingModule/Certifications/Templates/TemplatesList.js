import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import SubjectIcon from "@material-ui/icons/Subject";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import CertificateService from "../../../../services/certificate.service"
import TemplatesTable from "./TemplatesTable";
import TemplateFrom from "./TemplateFrom";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function TemplatesList(){
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();

    const [templates, setTemplates] = useState([]);
    const [formIsOpen, setFormIsOpen] = useState({isOpen: false, isNew: true, templateId: ""});
    // setCurrentRoute
    const {setMyCurrentRoute} = useMainContext();

    useEffect(()=>{
        setMyCurrentRoute("Certificate")
    },[])

    useEffect(()=>{
        CertificateService.readAllTemplates().then(res=>{
            setTemplates(res.data);
        })
    },[])

    return(
        <>
            <Grid container spacing={1}>
                <Grid item xs={12}>
                    <Paper elevation={12} className="p-2 text-center">
                        <ButtonGroup size="small" color="primary" aria-label="large outlined primary button group" className="d-flex flex-fill justify-content-center">
                            <Button size="small" variant="contained" color="primary"
                                    className='Nav-btn'
                                    style={{width: "33%"}}
                                    startIcon={<SubjectIcon/>}
                                    onClick={()=>{navigate("/certifications/templates")}}
                            >{t("Templates")}</Button>
                            <Button size="small" variant="contained" color="secondary"
                                    className='Nav-btn'
                                    style={{width: "33%"}}
                                    startIcon={<SubjectIcon/>}
                                    onClick={()=>{navigate("/certifications/competenceBlocks")}}
                            >{t("Competence blocks")}</Button>
                            <Button size="small" variant="contained" color="secondary"
                                    className='Nav-btn'
                                    style={{width: "33%"}}
                                    startIcon={<SubjectIcon/>}
                                    onClick={()=>{navigate("/certifications/certificates")}}
                            >{t("Certificates")}</Button>
                        </ButtonGroup>
                    </Paper>
                    {/*<Paper elevation={10} className="p-2 mt-3">*/}
                    {/*    <Button classes={{root: classes.root}} size="large" variant="contained" color="primary"*/}
                    {/*            startIcon={<AddCircleOutlineIcon/>}*/}
                    {/*            disabled={true}*/}
                    {/*            onClick={()=>{*/}
                    {/*                //navigate("/certifications/template/new")*/}
                    {/*                setFormIsOpen({isOpen: true, isNew: true, templateId: ""});*/}
                    {/*            }}*/}
                    {/*    >{t("Add template")}</Button>*/}
                    {/*</Paper>*/}
                </Grid>
                <Grid item md={12} lg={formIsOpen.isOpen ? 6 : 12}>
                    <Paper elevation={10} className="p-0">
                        <div className="d-flex pt-2 px-2 justify-content-between">
                            <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("Templetes")}
                            </Typography>
                            <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                    startIcon={<AddCircleOutlineIcon/>}
                                    disabled={true}
                                    //disabled={formIsOpen.isOpen}
                                    onClick={()=>{
                                        //navigate("/certifications/template/new")
                                        setFormIsOpen({isOpen: true, isNew: true, templateId: ""});
                                    }}
                            >{t("Add template")}</Button>
                        </div>
                        <hr className="mt-2"/>
                        <TemplatesTable templates={templates} setFormIsOpen={setFormIsOpen}/>
                    </Paper>
                </Grid>
                <Grid item md={12} lg={6} hidden={!formIsOpen.isOpen}>
                    <Paper elevation={10} className="p-0">
                        <TemplateFrom formIsOpen={formIsOpen} setFormIsOpen={setFormIsOpen}/>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}