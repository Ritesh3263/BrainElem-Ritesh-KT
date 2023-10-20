import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles} from "@material-ui/core/styles";
import {useNavigate} from "react-router-dom";
import CompanyService from "services/company.service"
import PartnersTable from "./PartnersTable";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import PartnerForm from "./PartnerForm";

const useStyles = makeStyles(theme=>({}))

export default function PartnersList(){
    const {t} = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();

    const [partners, setPartners] = useState([]);
    const [formIsOpen, setFormIsOpen] = useState({isOpen: false, isNew: true, partnerId: ""});
    // setCurrentRoute
    const {setMyCurrentRoute, F_handleSetShowLoader, F_getHelper} = useMainContext();
    const {user:{role}} = F_getHelper();

    useEffect(()=>{
        F_handleSetShowLoader(true)
        CompanyService.readAll().then(res=>{
            if(res.status === 200 && res.data){
                setPartners(res.data);
            }
            F_handleSetShowLoader(false)
        }).catch(error=>console.log(error))
        setMyCurrentRoute("Companies")
    },[formIsOpen.partnerId])

    return(
            <Grid container spacing={1}>
                    <Grid item xs={12} md={formIsOpen.isOpen ? 6 : 12}>
                        <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                            <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                    disabled={formIsOpen.isOpen||role==="Partner"}
                                    onClick={()=>{
                                        setFormIsOpen({isOpen: true, isNew: true, partnerId: "new"})
                                    }}
                            >{t("Add new partner")}</Button>
                        </div>
                    <PartnersTable partners={partners} setFormIsOpen={setFormIsOpen}/>
                    
                    </Grid>
                {formIsOpen.isOpen && (
                    <Grid item xs={12} md={6} hidden={!formIsOpen.isOpen}>
                        <Paper elevation={10} className="p-0">
                            <PartnerForm formIsOpen={formIsOpen} setFormIsOpen={setFormIsOpen}/>
                        </Paper>
                    </Grid>
                    )}
            </Grid>
    )
}