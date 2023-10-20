import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import moduleCoreService from "services/module-core.service"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import ClassesTable from "./ClassesTable";
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles(theme=>({}))

export default function MSClassesList(){
    const { t } = useTranslation();
    const {F_showToastMessage, F_getHelper, F_handleSetShowLoader, F_hasPermissionTo} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const [classCounter, setClassCounter] = useState(1);

    const classes = useStyles();
    const navigate = useNavigate();
    const [currentModuleId, setCurrentModuleId] = useState("");
    const [MSClasses, setMSClasses] =useState([]);
    const {setMyCurrentRoute} = useMainContext();
    
    useEffect(()=>{
        loadData();
    },[]);

    const loadData=()=>{
        F_handleSetShowLoader(true)
        setCurrentModuleId(manageScopeIds.moduleId)
        moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
            if(res.data.groups){
                setMSClasses(res.data.groups)
                F_handleSetShowLoader(false)
            }
        }).catch(error=>console.error(error))
        setMyCurrentRoute("Class")
    }

    function saveChanges(){
        if(classCounter){
            moduleCoreService.addMSClasses(classCounter).then(res=>{
                //console.log(res)
                F_showToastMessage("New class(es) has been added","success");
                navigate("/modules-core/classes");
                loadData();
            }).catch(error=>console.error(error));
        } else {
            F_showToastMessage("No class has been added","info");
            navigate("/modules-core/classes")
        }
    }

    const removeClass=(subjectId)=>{
        if(subjectId){
            moduleCoreService.removeMSClass(subjectId).then(res=>{
                if(res.status === 200){
                    loadData();
                   F_showToastMessage("Class was removed","info");
                }
            }).catch(err=>console.log(err))
        }
    }

    return(
            <Grid container spacing={3}>
                {/*<Grid item xs={12}>*/}
                {/*    <Paper elevation={10} className="p-2">*/}
                {/*        <Button classes={{root: classes.root}} size="large" variant="contained" color="primary"*/}
                {/*                startIcon={<AddCircleOutlineIcon/>}*/}
                {/*                onClick={()=>{navigate("/modules-core/classes/new")}}*/}
                {/*        >{t("Add class")}</Button>*/}
                {/*    </Paper>*/}
                {/*</Grid>*/}
                
                <Grid item xs={12}>
                        <Grid container>
                            <Grid>
                                <Typography variant="h5" component="h2" className="text-left ml-2 mt-4 mr-3" style={{color: `rgba(82, 57, 112, 1)`}}>
                                    {` Add ${classCounter || t("0")} new class`}
                                </Typography>
                            </Grid>
                            <Grid item >
                                <TextField  style={{ maxWidth:"70px"}} margin="dense"   
                                    fullWidth={true}
                                    variant="filled"
                                    type="number"
                                    disabled={false}
                                    inputProps={{readOnly: false}}
                                    InputLabelProps={{shrink: true}}
                                    value={classCounter}
                                    onChange={({target:{value}})=>{
                                        console.log(value)
                                        if(value !== "") setClassCounter(Math.min(100, Math.max(0, value)))
                                        else setClassCounter(value)
                                    }}
                                />
                            </Grid>
                            <Grid item className="mt-3 ml-2 ">
                                {/* <Button onClick={()=>{return F_hasPermissionTo('create-class')?saveChanges:F_showToastMessage('You do not have permission to add a class, please ask your manager.')}} size="small" variant="contained" color="primary" className="ml-1"> */}
                                <Button onClick={saveChanges} size="small" variant="contained" color="primary" className="ml-1">
                                    {t("Add Class")}
                                </Button>
                            </Grid>
                        </Grid>

                       <ClassesTable MSClasses={MSClasses} removeClass={removeClass}/>
                </Grid>
            </Grid>
    )       
}