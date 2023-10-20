import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import { makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useEnquiryContext} from "components/_ContextProviders/EnquiryProvider/EnquiryProvider";
import EnquiryService from "services/enquiry.service";
import EnquiresTable from "./EnquiresTable";
import EnquiryForm from "./EnquiryForm";

const useStyles = makeStyles(theme=>({
    paper:{
        [theme.breakpoints.down('sm')]:{
            padding: 0,
        }
    }
}));

export default function EnquiresList(){
    const {t} = useTranslation();
    const classes = useStyles();
    const { F_getHelper } = useMainContext();
    const { userPermissions, user } = F_getHelper();
    const {
        setMyCurrentRoute,
        F_handleSetShowLoader,
        F_getErrorMessage,
        F_showToastMessage,
    } = useMainContext();

    const {
        editFormHelper,
        setEditFormHelper,
    } = useEnquiryContext();
    const [enquires, setEnquires] = useState([]);

    useEffect(()=>{
        setMyCurrentRoute("Enquires");
        F_handleSetShowLoader(true);

        if (userPermissions.isModuleManager||userPermissions.isAssistant){
            EnquiryService.readAll().then(res=>{
                if(res.status === 200){
                    if(res.data){
                        setEnquires(res.data)
                        F_handleSetShowLoader(false);
                    }
                }else{
                    F_showToastMessage(F_getErrorMessage({response:res}));
                }
            }).catch(error=>{
                console.error(error);
                F_showToastMessage(F_getErrorMessage({response:{status: 500}}),"error");
                F_handleSetShowLoader(false);
            })
        }
        else {
            EnquiryService.readAllMyEnquiries().then(res=>{
            if(res.status === 200){
                if(res.data){
                    setEnquires(res.data)
                    F_handleSetShowLoader(false);
                }
            }else{
                F_showToastMessage(F_getErrorMessage({response:res}));
            }
        }).catch(error=>{
            console.error(error);
            F_showToastMessage(F_getErrorMessage({response:{status: 500}}),"error");
            F_handleSetShowLoader(false);
        })
    }
    },[editFormHelper.isOpen, editFormHelper.enquiryId]);

    return(
        <Grid container spacing={2} className='mt-3'>
            <Grid item xs={12}>
                {/* Hide "Add new enquiry" as enquiry is created from explore. */}
                {/* {userPermissions.isModuleManager && ( 
                    <Button size="small" variant="contained" color="primary"
                            disabled={editFormHelper.isOpen}
                            onClick={()=>{setEditFormHelper({isOpen: true, openType:'GENERAL' , enquiryId: 'NEW'})}}
                    >{t("Add new enquiry")}</Button>
                )} */}
            </Grid>
                <Grid item xs={12} md={12} lg={editFormHelper.isOpen ? 6 : 12}>
                        <EnquiresTable enquires={enquires}/>
                </Grid>
            <Grid item xs={12} md={12} lg={(editFormHelper.openType === 'GENERAL' || 'MESSAGES' || 'STUDENTS') ? 6 : 12} hidden={!editFormHelper.isOpen}>
                <Paper elevation={10} className="p-0">
                    <EnquiryForm />
                </Paper>
            </Grid>
        </Grid>
    )
}