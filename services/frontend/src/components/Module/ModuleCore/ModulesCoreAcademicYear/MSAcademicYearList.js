import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import moduleCoreService from "services/module-core.service"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import AcademicYearTable from "./AcademicYearTable"
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {EButton} from "../../../../styled_components";

const useStyles = makeStyles(theme=>({}))

export default function MSAcademicYearList(){
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const { F_showToastMessage, F_getErrorMessage, F_getHelper, F_handleSetShowLoader } = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const [MSAcademicYears, setMSAcademicYears] = useState([]);
    // const [currentModuleId, setCurrentModuleId] = useState("");
    // setCurrentRoute
    const {setMyCurrentRoute} = useMainContext();

    useEffect(()=>{
        F_handleSetShowLoader(true)
        // setCurrentModuleId(helper.moduleId)
        moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
            if(res.data.academicYears){
                setMSAcademicYears(res.data.academicYears)
                F_handleSetShowLoader(false);
            }
        }).catch(error=>console.error(error))
        setMyCurrentRoute("School year")
    },[])

    return(
            <Grid container spacing={3}>
                {/*<Grid item xs={12}>*/}
                {/*    <Paper elevation={10} className="p-2">*/}
                {/*        <Button classes={{root: classes.root}} size="large" variant="contained" color="primary"*/}
                {/*                startIcon={<AddCircleOutlineIcon/>}*/}
                {/*                onClick={()=>{navigate("/modules-core/academic-year/new")}}*/}
                {/*        >{t("Add school year")}</Button>*/}
                {/*    </Paper>*/}
                {/*</Grid>*/}
                <Grid item xs={12}>
                        <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                            <EButton eSize="small" eVariant="primary"
                                    onClick={()=>{navigate("/modules-core/academic-year/new")}}
                            >{t("Add school year")}</EButton>
                        </div>
                        <AcademicYearTable MSAcademicYears={MSAcademicYears}/>
                </Grid>
            </Grid>
    )
}