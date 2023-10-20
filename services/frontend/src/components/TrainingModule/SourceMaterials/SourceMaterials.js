import React, {useEffect, useState, useRef,forwardRef} from "react";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";
import SourceMaterialsTable from "./SourceMaterialsTable";
import SourceMaterialsForm from "./SourceMaterialsForm";
import SourceMaterialService from "services/source_material.service";

export default function SourceMaterials(props){
    const{
        tooltip7,
        tooltip8,
        tooltip9,
        tooltip10,
        tooltip11,
        tooltip12,
        tooltip13,
    }=props;
    const {t} = useTranslation();
    const {
           F_getHelper,
           F_handleSetShowLoader,
           F_showToastMessage,
           F_getErrorMessage
    } = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const [sourceMaterials, setSourceMaterials] = useState([]);
    const [editFormHelper, setEditFormHelper] = useState({isOpen: false, openType: undefined, sourceMaterialId: undefined});

    useEffect(()=>{
        F_handleSetShowLoader(true);
        if(manageScopeIds?.moduleId){
            SourceMaterialService.readAll(manageScopeIds?.moduleId).then(res=>{
                if(res.status === 200 && res?.data?.length>0){
                    setSourceMaterials(res.data);
                    F_handleSetShowLoader(false);
                }
            }).catch(err=>{
                F_showToastMessage(F_getErrorMessage({response:{status: 500}}),"error");
                console.log(err)
            });
        }
    },[editFormHelper.sourceMaterialId]);


    return(
        <Grid container spacing={1}>
            <Grid item xs={12} lg={editFormHelper.isOpen ? 5 : 12}>
                    <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                        <Button size="small" variant="contained" color="primary"
                                ref={tooltip7}
                                disabled={editFormHelper.isOpen}
                                onClick={()=>{setEditFormHelper({isOpen: true, openType: 'ADD', sourceMaterialId: 'NEW'});}}
                        >{t('Add new book')}</Button>
                    </div>
                    <SourceMaterialsTable
                        sourceMaterials={sourceMaterials}
                        setEditFormHelper={setEditFormHelper} tooltip13={tooltip13}/>
            </Grid>
            <Grid item xs={12} lg={7} hidden={!editFormHelper.isOpen}>
                <Paper elevation={10} className="p-0">
                    <SourceMaterialsForm editFormHelper={editFormHelper} setEditFormHelper={setEditFormHelper} tooltip8={tooltip8}
                                         tooltip9={tooltip9} tooltip10={tooltip10} tooltip11={tooltip11} tooltip12={tooltip12}
                    />
                </Paper>
            </Grid>
        </Grid>
    )
}