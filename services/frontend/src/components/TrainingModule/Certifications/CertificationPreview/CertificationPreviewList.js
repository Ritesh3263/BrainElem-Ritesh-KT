import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import CertificateService from "./../../../../services/certificate.service"
import CertificationPreviewTable from "./CertificationPreviewTable";
import CertificationPreviewForm from "./CertificationPreviewForm";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function CertificationPreviewList(){
    const classes = useStyles();
    const navigate = useNavigate();
    // setCurrentRoute
    const {setMyCurrentRoute} = useMainContext();

    const [certificates, setCertificates] = useState([]);
    const [formIsOpen, setFormIsOpen] = useState({isOpen: false, isNew: true, userCertificateId: ""});

    useEffect(()=>{
        CertificateService.readAllUserCertifications().then(res=>{
            setCertificates(res.data);
        }).catch(error=>console.log(error))
        setMyCurrentRoute("Certification")
    },[])

    return(
        <>
            <Grid container spacing={1}>
                <Grid item xs={12} lg={formIsOpen.isOpen ? 6 : 12}>
                    <Paper elevation={10} className="p-2">
                        <CertificationPreviewTable certificates={certificates} setFormIsOpen={setFormIsOpen}/>
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={6} hidden={!formIsOpen.isOpen}>
                    <Paper elevation={10} className="p-0">
                        <CertificationPreviewForm formIsOpen={formIsOpen} setFormIsOpen={setFormIsOpen}/>
                    </Paper>
                </Grid>
            </Grid>
        </>
    )
}