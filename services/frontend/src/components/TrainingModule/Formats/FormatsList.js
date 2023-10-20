import React, {useEffect, useState} from "react";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { makeStyles} from "@material-ui/core/styles";
import FormatService from "services/format.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useTranslation} from "react-i18next";
import FormatsTable from "./FormatsTable";
import FormatForm from "./FormatForm";

const useStyles = makeStyles(theme=>({}))

export default function InternShipsList(){
    const {t} = useTranslation();
    const classes = useStyles();
    const {setMyCurrentRoute,
        F_handleSetShowLoader,
    } = useMainContext();

    const [formats, setFormats] = useState([]);
    const [editFormHelper, setEditFormHelper] = useState({isOpen: false, openType: undefined, formatId: undefined});

    useEffect(()=>{
        F_handleSetShowLoader(true);
        setMyCurrentRoute("Formats");
        FormatService.readAllExceptInit().then(res=>{
            if(res.status === 200 && res.data){
                setFormats(res.data);
                F_handleSetShowLoader(false);
            }
        }).catch(error=>console.log(error))
    }, [editFormHelper.isOpen]);

    return(
        <Grid container spacing={1}>
            <Grid item xs={12} lg={editFormHelper.isOpen ? 5 : 12}>
                    <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                        <Button size="small" variant="contained" color="primary"
                                disabled={editFormHelper.isOpen}
                                onClick={()=>{setEditFormHelper({isOpen: true, openType: 'ADD', formatId: 'NEW'});}}
                        >{t('Add new format')}</Button>
                    </div>
                    <FormatsTable setEditFormHelper={setEditFormHelper} formats={formats}/>
            </Grid>
            <Grid item xs={12} lg={7} hidden={!editFormHelper.isOpen}>
                <Paper elevation={10} className="p-0">
                    <FormatForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper}/>
                </Paper>
            </Grid>
        </Grid>
    )
}