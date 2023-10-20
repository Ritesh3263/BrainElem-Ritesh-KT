import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import CertificateService from "../../../../services/certificate.service";
import CertificationTable from "./CertificationTable";
import CertificationForm from "./CertificationForm";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function CertificationList(){
    const classes = useStyles();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [certificates, setCertificates] = useState([]);
    const [formIsOpen, setFormIsOpen] = useState({isOpen: false, isNew: true, certificateId: ""});
    // setCurrentRoute
    const {setMyCurrentRoute} = useMainContext();

    useEffect(()=>{
        setMyCurrentRoute("Certification")
    },[])

    useEffect(()=>{
        CertificateService.readAllExaminerCertifications().then(res=>{
            setCertificates(res.data);
        })
    },[formIsOpen.isOpen])

    return(
        <>
            <Grid container spacing={1}>
                {!formIsOpen.isOpen ? (
                    <Grid item xs={12}>
                        <Paper elevation={10} className="p-2">
                            <div className="d-flex pt-2 px-2 justify-content-between">
                                <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                    {t("Certification")}
                                </Typography>
                            </div>
                            <hr className="mt-2"/>
                            <CertificationTable certificates={certificates}  setFormIsOpen={setFormIsOpen}/>
                        </Paper>
                    </Grid>
                ):(
                    <Grid item xs={12}>
                    <Paper elevation={10} className="p-0">
                    <CertificationForm formIsOpen={formIsOpen} setFormIsOpen={setFormIsOpen}/>
                    </Paper>
                    </Grid>
                    )}
            </Grid>
        </>
    )
}