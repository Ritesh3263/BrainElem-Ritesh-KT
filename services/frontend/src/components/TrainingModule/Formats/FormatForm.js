import React, {useEffect, useState} from "react";
import {Card, CardHeader, Checkbox, FormControlLabel} from "@material-ui/core";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { makeStyles} from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import FormatService from "services/format.service";
import {now} from "moment";
import { KeyboardTimePicker } from '@material-ui/pickers'
import ConfirmActionModal from "components/common/ConfirmActionModal";
import { withStyles } from "@material-ui/core/styles";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import Switch from "styled_components/Switch";
import { theme } from "MuiTheme";

const CheckboxWithWhiteCheck = withStyles({
    root: {
      "&$checked": {
        "& .MuiIconButton-label": {
          position: "relative",
          zIndex: 0,
        },
        "& .MuiIconButton-label:after": {
          content: '""',
          left: 4,
          top: 4,
          height: 15,
          width: 15,
          position: "absolute",
          backgroundColor: theme.palette.neutrals.white,
          zIndex: -1,
          borderColor: "transparent"
        }
      },
    },
    checked: {}
  })(Checkbox);

const useStyles = makeStyles(theme=>({

    CardContentRoot: {
        overflow: "hidden"
    }
}));

const internshipInitialState={
    name:'',
    startDate: new Date(now()).toISOString(),
    endDate: new Date(now()).toISOString(),
    startsAtTheSameTime: true,
    daysOfWeek:[],
};

const days =['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function FormatForm({editFormHelper, setEditFormHelper}){
    const {t} = useTranslation();
    const classes = useStyles();
    const {F_showToastMessage} = useMainContext();
    const [format, setFormat] = useState(internshipInitialState);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});

    useEffect(()=>{
        if(editFormHelper.isOpen && editFormHelper.formatId !== 'NEW'){
            FormatService.read(editFormHelper.formatId).then(res=>{
                if(res.status === 200 && res.data){
                    setFormat(res.data);
                }
            })
        } else {
            setFormat(internshipInitialState);
        }
    },[editFormHelper.formatId]);

    useEffect(()=>{
        if(actionModal.returnedValue){
            remove();
        }
    },[actionModal.returnedValue]);

    function save(){
        if(editFormHelper.openType === 'ADD' && editFormHelper.formatId === 'NEW'){
            FormatService.add(format).then(res=>{
                F_showToastMessage(t(res.data.message),"success");
                setEditFormHelper({isOpen: false, openType: undefined, formatId: undefined});
            }).catch(err=>console.log(err));
        }
        else{
            FormatService.update(format).then(res=>{
                F_showToastMessage(t(res.data.message),"success");
                setEditFormHelper({isOpen: false, openType: undefined, formatId: undefined});
            }).catch(err=>console.log(err));
        }
    }

    function remove(){
        FormatService.remove(editFormHelper.formatId).then(res=>{
            F_showToastMessage(t(res.data.message),"success");
            setEditFormHelper({isOpen: false, openType: undefined, formatId: undefined});
        }).catch(err=>console.log(err))
    }


    const getFormType=(type)=>{
        switch(type){
            case 'ADD': return t('Add');
            case 'EDIT': return t('Edit');
            default: return t('Preview');
        }
    };

    const handleSelectDay=(value, isS)=>{
        if(isS){
            setFormat(p=>{
                let val = Object.assign({}, p);
                val.daysOfWeek.push({day: value, start: new Date(now()).toISOString(), end: new Date(now()).toISOString()});
                return val;
            });
        } else {
            setFormat(p=>{
                let val = Object.assign({}, p);
                val.daysOfWeek = val.daysOfWeek.filter(d=>d.day !== value);
                return val;
            });
        }
    };

    const daysList = days.map(day=>(
        <Grid xs={12} className='d-flex flex-row justify-content-start px-1'>
            <Grid item xs={4} style={{alignSelf: 'center'}}>
                <FormControlLabel label={day.toLocaleLowerCase()}
                    control={
                    <CheckboxWithWhiteCheck style={{color:`#A85CFF`}}
                        checked={format.daysOfWeek.find(d=>d.day === day) ? true : false}
                        name={day}
                        value={day}
                        onChange={({target:{value}},isS)=>{handleSelectDay(value,isS)}}
                    />}
                />
            </Grid>
            {!format.startsAtTheSameTime && format.daysOfWeek.find(d=>d.day === day) && (<>
                <Grid item xs={4} className=' '>
                    <KeyboardTimePicker
                        fullWidth
                        style={{ maxWidth: "250px"}}
                        margin="normal"
                        inputVariant='filled'
                        keyboardIcon={<AccessTimeIcon />}
                        id="date-picker-dialog"
                        label={t("Start time")}
                        minDate={editFormHelper.openType === 'ADD' ? new Date(now()).toISOString().split("T")[0] : false}
                        minDateMessage={"this event has already taken place"}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={format.daysOfWeek.find(i=> i.day === day)?.start|| new Date(now()).toISOString()}
                        KeyboardButtonProps={{
                            "aria-label": "change date",
                        }}
                        onChange={(date) => {
                            if (date && date._isValid) {
                                setFormat(p=>{
                                    let val = Object.assign({}, p);
                                    let dayIndex = val.daysOfWeek.findIndex(i=> i.day === day);
                                    if(dayIndex !== -1){
                                        val.daysOfWeek[dayIndex].start = date.toISOString();
                                    } else {
                                        val.daysOfWeek.push({day: day, start: date.toISOString(), end: new Date(now()).toISOString()});
                                    }
                                    return val;
                                })
                            }
                        }}
                    />
                </Grid>
                <Grid item xs={4} className=' px-1'>
                    <KeyboardTimePicker
                        fullWidth
                        style={{ maxWidth: "250px"}}
                        margin="normal"
                        inputVariant='filled'
                        id="date-picker-dialog"
                        keyboardIcon={<AccessTimeIcon />}
                        label={t("End time")}
                        minDate={editFormHelper.openType === 'ADD' ? new Date(now()).toISOString().split("T")[0] : false}
                        minDateMessage={"this event has already taken place"}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={format.daysOfWeek.find(i=> i.day === day)?.end|| new Date(now()).toISOString()}
                        KeyboardButtonProps={{
                            "aria-label": "change date",
                        }}
                        onChange={(date) => {
                            if (date && date._isValid) {
                                setFormat(p=>{
                                    let val = Object.assign({}, p);
                                    let dayIndex = val.daysOfWeek.findIndex(i=> i.day === day);
                                    if(dayIndex !== -1){
                                        val.daysOfWeek[dayIndex].end = date.toISOString();
                                    } else {
                                        val.daysOfWeek.push({day: day, start: new Date(now()).toISOString(), end: date.toISOString()});
                                    }
                                    return val;
                                })
                            }
                        }}
                    />
                </Grid>
            </>)}
        </Grid>
    ));

    return(
        <Card  className="pt-2 pl-2 d-flex flex-column m-0 ">
            <CardHeader className='pb-0' title={(
                <Typography variant="h3" component="h5" className="text-left" style={{fontSize:"32px", color:theme.palette.primary.lightViolet}}>
                    { format?.name || t("Add new format")}
                </Typography>
            )} 
            />
            <CardContent  classes={{ root: classes.CardContentRoot }} >
                <Grid container>
                    <Grid item xs={12}>
                    </Grid>
                    <Grid item xs={12} className=' justify-content-center'>
                        <TextField  style={{maxWidth:'250px'}}
                                   fullWidth={true}
                                   margin="normal"
                                   placeholder="Name of the format"
                                   name='name'
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={format?.name}
                                   onChange={({target:{name,value}})=>{
                                       setFormat(p=>({...p,[name]: value}));
                                   }}
                        />
                    </Grid>
                    <Grid item xs={12} className='  px-1'>
                         <small  className="mr-3">{t("Classes start at the same time")}</small>               
                                    <FormControlLabel className="mt-2"
                                        control={
                                            <Switch
                                                checked={format.startsAtTheSameTime}
                                                name="checkedB"
                                                color="primary"
                                                onChange={() => setFormat(format => ({...format, "startsAtTheSameTime": !format.startsAtTheSameTime }))}
                                            />
                                        }
                                    />
                    </Grid>
                    {format.startsAtTheSameTime && (<>
                        <Grid item xs={6} className=' justify-content-center '>
                            <KeyboardTimePicker
                                fullWidth
                                style={{ maxWidth: "250px"}}
                                margin="normal"
                                inputVariant='filled'
                                keyboardIcon={<AccessTimeIcon />}
                                id="date-picker-dialog"
                                label={t("Start time")}
                                minDate={editFormHelper.openType === 'ADD' ? new Date(now()).toISOString().split("T")[0] : false}
                                minDateMessage={"this event has already taken place"}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={format.startDate}
                                KeyboardButtonProps={{
                                    "aria-label": "change date",
                                }}
                                onChange={(date) => {
                                    if (date && date._isValid) {
                                        setFormat(p=>({...p, startDate: new Date(date).toISOString()}));
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} className=' justify-content-center px-1'>
                            <KeyboardTimePicker
                                fullWidth
                                style={{ maxWidth: "250px"}}
                                margin="normal"
                                inputVariant='filled'
                                id="date-picker-dialog"
                                keyboardIcon={<AccessTimeIcon />}
                                label={t("End time")}
                                minDate={editFormHelper.openType === 'ADD' ? new Date(now()).toISOString().split("T")[0] : false}
                                minDateMessage={"this event has already taken place"}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={format.endDate}
                                KeyboardButtonProps={{
                                    "aria-label": "change date",
                                }}
                                onChange={(date) => {
                                    if (date && date._isValid) {
                                        setFormat(p=>({...p, endDate: new Date(date).toISOString()}));
                                    }
                                }}
                            />
                        </Grid>
                    </>)}
                    <Grid item xs={12} className="mt-3">
                        <small  className="mt-3">{t("Choose days for the format")}</small> 
                    </Grid>
                    <Grid item xs={12} className='d-flex flex-column justify-content-start px-1'>
                        {daysList}
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={6}>
                            <Button  variant="contained" size="small" color="secondary" onClick={() =>  {
                                F_showToastMessage("No change",)
                                setEditFormHelper({isOpen: false, openType: undefined, formatId: undefined});
                            }}>
                                {t("Dismiss")}
                            </Button>
                        </Grid>
                        <Grid item xs={6} className="p-0 d-flex justify-content-end align-items-center">
                            {editFormHelper.openType === 'EDIT' && (
                                <Button variant="contained" size="small" color="inherit" onClick={()=>{setActionModal({isOpen: true, returnedValue: undefined})}}>
                                    {t("Remove")}
                                </Button>
                            )
                            }
                            {editFormHelper.openType !== 'PREVIEW' &&(
                                <Button size="small" variant="contained" color="primary"
                                        onClick={save} className="ml-5"
                                >{t("Save")}</Button>
                            )}
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing format")}
                                actionModalMessage={t("Are you sure you want to remove format? The action is not reversible!")}
            />
        </Card>
    )
}