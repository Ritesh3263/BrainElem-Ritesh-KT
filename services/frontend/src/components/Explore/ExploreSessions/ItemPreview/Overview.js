import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {KeyboardDatePicker} from "@material-ui/pickers";
import TodayIcon from "@mui/icons-material/Today";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import moduleCoreService from "../../../../services/module-core.service";
import {useSessionContext} from "../../../_ContextProviders/SessionProvider/SessionProvider";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const isOpenSessionForm ={
    type: 'PREVIEW'
}
const formatsEvents = [
    'WEEKENDS',
    'EVERY DAY',
    'ONCE A MONTH',
    'IRREGULARLY'
];


export default function Overview({currentItemDetails}){
    const {t} = useTranslation();
    const [trainers, setTrainers] = useState([]);
    const {F_getHelper} = useMainContext();
    const {manageScopeIds} = F_getHelper();

    useEffect(()=>{
        // moduleCoreService.readAllModuleTrainers(manageScopeIds.moduleId).then(res=>{
        //     if(res?.status === 200 && res?.data?.length>0){
        //         setTrainers(res.data);
        //     }
        // }).catch(err=>console.log(err));
    },[]);


    const formatsList = formatsEvents.map((format, index)=><MenuItem key={index} value={format}>{format.toLowerCase()}</MenuItem>);
    const managersList = trainers?.length>0 ? trainers.map((tr, index)=><MenuItem key={tr._id} value={tr._id}>{`${tr?.name??'-'} ${tr?.surname}`}</MenuItem>):[];

    return(
        <Grid container className='mb-2 mx-2'>
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} className="mt-4">
                            <Typography variant="body1"
                                        component="h6" className="text-left"
                                        style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("Enrollments")}
                            </Typography>
                            <hr className="my-1 mr-4"/>
                        </Grid>
                        <Grid item xs={6} className="pr-5">
                            <KeyboardDatePicker
                                InputProps={{
                                    readOnly: (isOpenSessionForm.type === 'PREVIEW'),
                                    disableUnderline: (isOpenSessionForm.type === 'PREVIEW'),
                                }}
                                keyboardIcon={(isOpenSessionForm.type === 'PREVIEW') ? null : <TodayIcon/>}
                                rightArrowIcon={null}
                                readOnly={(isOpenSessionForm.type === 'PREVIEW')}
                                margin="normal"
                                name={['enrollments','startDate']}
                                fullWidth
                                id="date-picker-dialog"
                                label={t("Start date")}
                                format="DD.MM.yyyy"
                                //minDate={new Date(now()).toISOString().split("T")[0]}
                                minDateMessage={"It is a past date"}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputVariant={(isOpenSessionForm.type === 'PREVIEW') ? 'standard' : 'filled'}
                                value={currentItemDetails?.enrollmentStartDate}
                                KeyboardButtonProps={{
                                    "aria-label": "change date",
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} className="pr-5">
                            <KeyboardDatePicker
                                InputProps={{
                                    readOnly: (isOpenSessionForm.type === 'PREVIEW'),
                                    disableUnderline: (isOpenSessionForm.type === 'PREVIEW'),
                                }}
                                keyboardIcon={(isOpenSessionForm.type === 'PREVIEW') ? null : <TodayIcon/>}
                                name={['enrollments','endDate']}
                                readOnly={(isOpenSessionForm.type === 'PREVIEW')}
                                margin="normal"
                                fullWidth
                                id="date-picker-dialog"
                                label={t("End date")}
                                format="DD.MM.yyyy"
                                //minDate={new Date(now()).toISOString().split("T")[0]}
                                minDateMessage={"It is a past date"}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputVariant={(isOpenSessionForm.type === 'PREVIEW') ? 'standard' : 'filled'}
                                value={currentItemDetails?.enrollmentEndDate}
                                KeyboardButtonProps={{
                                    "aria-label": "change date",
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} className="mt-4">
                            <Typography variant="body1" component="h6" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("Session")}
                            </Typography>
                            <hr className="my-1 mr-4"/>
                        </Grid>
                        <Grid item xs={6} className="pr-5">
                            <TextField label={t("Session name")} margin="normal"
                                       InputProps={{
                                           readOnly: (isOpenSessionForm.type === 'PREVIEW'),
                                           disableUnderline: (isOpenSessionForm.type === 'PREVIEW'),
                                       }}
                                       name='name'
                                       fullWidth
                                       style={{maxWidth: "400px"}}
                                       variant={(isOpenSessionForm.type === 'PREVIEW') ? 'standard' : 'filled'}
                                       //required={true}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       value={currentItemDetails?.name}
                            />
                        </Grid>
                        <Grid item xs={6} className="pr-5">
                            <KeyboardDatePicker
                                InputProps={{
                                    readOnly: (isOpenSessionForm.type === 'PREVIEW'),
                                    disableUnderline: (isOpenSessionForm.type === 'PREVIEW'),
                                }}
                                keyboardIcon={(isOpenSessionForm.type === 'PREVIEW') ? null : <TodayIcon/>}
                                readOnly={(isOpenSessionForm.type === 'PREVIEW')}
                                name={['session','startDate']}
                                margin="normal"
                                fullWidth
                                id="date-picker-dialog"
                                label={t("Start date")}
                                format="DD.MM.yyyy"
                                //minDate={new Date(now()).toISOString().split("T")[0]}
                                minDateMessage={"It is a past date"}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputVariant={(isOpenSessionForm.type === 'PREVIEW') ? 'standard' : 'filled'}
                                value={currentItemDetails?.startDate}
                                KeyboardButtonProps={{
                                    "aria-label": "change date",
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} className="pr-5">
                            <TextField label={t("Digital code")} margin="normal"
                                       InputProps={{
                                           readOnly: (isOpenSessionForm.type === 'PREVIEW'),
                                           disableUnderline: (isOpenSessionForm.type === 'PREVIEW'),
                                       }}
                                       name={['session','digitalCode']}
                                       fullWidth
                                       style={{maxWidth: "400px"}}
                                       variant={(isOpenSessionForm.type === 'PREVIEW') ? 'standard' : 'filled'}
                                       //required={true}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       value={currentItemDetails?.digitalCode}
                            />
                        </Grid>
                        <Grid item xs={6} className="pr-5">
                            <KeyboardDatePicker
                                InputProps={{
                                    readOnly: (isOpenSessionForm.type === 'PREVIEW'),
                                    disableUnderline: (isOpenSessionForm.type === 'PREVIEW'),
                                }}
                                readOnly={(isOpenSessionForm.type === 'PREVIEW')}
                                keyboardIcon={(isOpenSessionForm.type === 'PREVIEW') ? null : <TodayIcon/>}
                                fullWidth
                                name={['session','endDate']}
                                margin="normal"
                                id="date-picker-dialog"
                                label={t("End date")}
                                format="DD.MM.yyyy"
                                //minDate={new Date(now()).toISOString().split("T")[0]}
                                minDateMessage={"It is a past date"}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                inputVariant={(isOpenSessionForm.type === 'PREVIEW') ? 'standard' : 'filled'}
                                value={currentItemDetails?.endDate}
                                KeyboardButtonProps={{
                                    "aria-label": "change date",
                                }}
                            />
                        </Grid>
                        <Grid item xs={6} className="pr-5">
                            <TextField label={t("Trainees limit")} style={{ maxWidth:"400px"}} margin="normal"
                                       InputProps={{
                                           readOnly: (isOpenSessionForm.type === 'PREVIEW'),
                                           disableUnderline: (isOpenSessionForm.type === 'PREVIEW'),
                                       }}
                                       name={['session','traineesLimit']}
                                       fullWidth
                                       variant={(isOpenSessionForm.type === 'PREVIEW') ? 'standard' : 'filled'}
                                       //type="number"
                                       disabled={false}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       value={currentItemDetails?.traineesLimit}
                            />
                        </Grid>
                        <Grid item xs={6} className="pr-5">
                            <TextField label={t("Format")} margin="normal"
                                       InputProps={{
                                           readOnly: (isOpenSessionForm.type === 'PREVIEW'),
                                           disableUnderline: (isOpenSessionForm.type === 'PREVIEW'),
                                       }}
                                       name='name'
                                       fullWidth
                                       style={{maxWidth: "400px"}}
                                       variant={(isOpenSessionForm.type === 'PREVIEW') ? 'standard' : 'filled'}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       value={currentItemDetails?.format?.toLowerCase()}
                            />
                        </Grid>
                        <Grid item xs={6} className="pr-5">
                            <TextField label={t("Trainer manager")} margin="normal"
                                       InputProps={{
                                           readOnly: (isOpenSessionForm.type === 'PREVIEW'),
                                           disableUnderline: (isOpenSessionForm.type === 'PREVIEW'),
                                       }}
                                       name='name'
                                       fullWidth
                                       style={{maxWidth: "400px"}}
                                       variant={(isOpenSessionForm.type === 'PREVIEW') ? 'standard' : 'filled'}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       value={currentItemDetails?.trainingManager ? (`${currentItemDetails?.trainingManager?.name} ${currentItemDetails?.trainingManager?.surname}`) : null}
                            />
                        </Grid>
                    </Grid>
                </Grid>
        </Grid>
    )
}