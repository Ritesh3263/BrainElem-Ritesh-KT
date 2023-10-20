import React, {useEffect, useState} from "react";
import TextField from "@material-ui/core/TextField";
import {useNavigate, useParams} from "react-router-dom";
import moduleCoreService from "services/module-core.service";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function MSCLassesForm(){
    const { t } = useTranslation();
    const {F_showToastMessage, F_getHelper, F_handleSetShowLoader} = useMainContext();
    const navigate = useNavigate();
    const [classCounter, setClassCounter] = useState(1);

    function saveChanges(){
        if(classCounter){
            moduleCoreService.addMSClasses(classCounter).then(res=>{
                console.log(res)
                F_showToastMessage("School year and periods was updated","success");
                navigate("/modules-core/classes")
            }).catch(error=>console.error(error));
        } else {
            F_showToastMessage("No class has been added","info");
            navigate("/modules-core/classes")
        }
    }

    return(
        <>
            <Card className="p-0 d-flex flex-column m-0">
            {/*<CardHeader title={` ${t("Adding new classes")}: ${classCounter}`}/>*/}
                <CardHeader title={(
                    <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                        {` Add ${classCounter || t("0")} new class`}
                    </Typography>
                )} 
                // avatar={<Chip label={classId==="new" ? t("Add"):t("Edit")} color="primary" />}
                />
            <CardContent>
                <Grid container>
                    <Grid item className="d-flex flex-row align-items-center" xs={12} md={6}>
                        <TextField label={t("Number of classes")} style={{ maxWidth:"400px"}} margin="dense"
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
                        {/*<Button style={{ width:"50%"}} className="mt-0 ml-3"*/}
                        {/*        size="small" variant="contained" color="primary"*/}
                        {/*        startIcon={<AddCircleOutlineIcon/>}*/}
                        {/*        onClick={()=>{*/}
                        {/*            setClassCounter(p=>p+1)*/}
                        {/*            setMSClass(p=>{*/}
                        {/*                let val = Object.assign([],p);*/}
                        {/*                val.push(                    {*/}
                        {/*                    className: "New empty class",*/}
                        {/*                    level: "",*/}
                        {/*                    year: "",*/}
                        {/*                    classManager: "",*/}
                        {/*                    name: "",*/}
                        {/*                    trainees:[],*/}
                        {/*                });*/}
                        {/*                return val;*/}
                        {/*            })*/}
                        {/*        }}*/}
                        {/*>{t("Add")}</Button>*/}
                        {/*<Button style={{ width:"50%"}} className="mt-0"*/}
                        {/*        size="small" variant="contained" color="primary"*/}
                        {/*        startIcon={<RemoveIcon/>}*/}
                        {/*        onClick={()=>{*/}
                        {/*            if(classCounter <= 1){*/}
                        {/*                setClassCounter(1)*/}
                        {/*            }else{*/}
                        {/*                setClassCounter(p=>p-1)*/}
                        {/*                setMSClass(p=>{*/}
                        {/*                    let val = Object.assign([],p);*/}
                        {/*                    val.splice(1,1);*/}
                        {/*                    return val;*/}
                        {/*                })*/}
                        {/*            }*/}
                        {/*        }}*/}
                        {/*>{t("Remove")}</Button>*/}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
            <CardActions className="d-flex justify-content-between align-items-center" >
                <Grid container>
                    <Grid item xs={6}>
                        <Button variant="contained" size="small" color="secondary" onClick={() =>  {
                            F_showToastMessage("No change",)
                            navigate("/modules-core/classes")
                        }}>
                            {t("Back")}
                        </Button>
                    </Grid>
                    <Grid item xs={6} className="p-0 d-flex justify-content-end">
                        <Button onClick={saveChanges} size="small" variant="contained" color="primary" className="ml-5">
                            {t("Save")}
                        </Button>
                    </Grid>
                </Grid>
            </CardActions>
            </CardActionArea>
        </Card>
        </>
    )
}