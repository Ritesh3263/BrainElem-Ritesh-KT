import React, {useEffect, useState} from "react";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {useTranslation} from "react-i18next";
import SourceMaterialService from "services/source_material.service";
import AuthorsTable from "./AuthorsTable";
import AuthorForm from "./AuthorForm";


export default function AuthorsList(props){
    const{
        tooltip2,
        tooltip3,
        tooltip4,
        tooltip5,
    }=props;
    const {t} = useTranslation();
    const {
        F_handleSetShowLoader,
        F_showToastMessage,
        F_getErrorMessage
    } = useMainContext();
    const [authors, setAuthors] = useState([]);
    const [editFormHelper, setEditFormHelper] = useState({isOpen: false, openType: undefined, authorId: undefined});

    useEffect(()=>{
        F_handleSetShowLoader(true);
            SourceMaterialService.readAllBookAuthors().then(res=>{
                setAuthors(res.data);
                F_handleSetShowLoader(false);
            }).catch(err=>{
                F_showToastMessage(F_getErrorMessage({response:{status: 500}}),"error");
                console.log(err)
            });
    },[editFormHelper.authorId]);


    return(
        <Grid container spacing={1}>
            <Grid item xs={12} lg={editFormHelper.isOpen ? 5 : 12}>
                
                    <div className="d-flex pt-2 px-2 mb-3 justify-content-between">

                        <Button size="small" variant="contained" color="primary"
                                disabled={editFormHelper.isOpen}
                                startIcon={<AddCircleOutlineIcon/>}
                                ref={tooltip2}
                                onClick={()=>{setEditFormHelper({isOpen: true, openType: 'ADD', authorId: 'NEW'});}}
                        >{t('Add author')}</Button>
                    </div>
                    <AuthorsTable
                        tooltip5={tooltip5}
                        authors={authors}
                        setEditFormHelper={setEditFormHelper}/>
               
            </Grid>
            <Grid item xs={12} lg={7} hidden={!editFormHelper.isOpen}>
                <Paper elevation={10} className="p-0">
                    <AuthorForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} tooltip3={tooltip3} tooltip4={tooltip4}/>
                </Paper>
            </Grid>
        </Grid>
    )
}