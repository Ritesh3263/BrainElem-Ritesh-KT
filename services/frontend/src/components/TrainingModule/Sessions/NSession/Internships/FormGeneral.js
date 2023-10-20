import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSessionContext} from "../../../../_ContextProviders/SessionProvider/SessionProvider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import {Input} from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import {KeyboardDatePicker, KeyboardTimePicker} from "@material-ui/pickers";
import {now} from "moment";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TodayIcon from "@mui/icons-material/Today";
import CertificationSessionService from "../../../../../services/certification_session.service";
import {useMainContext} from "../../../../_ContextProviders/MainDataContextProvider/MainDataProvider";

export default function FormGeneral({currentInternship={}, isOpenInternshipHelper}){
    const { t } = useTranslation();
    const {
        currentSession,
        sessionDispatch,
        sessionReducerActionsType,
    } = useSessionContext();
    const {F_getHelper} = useMainContext();
    const {userPermissions} = F_getHelper();
    const [coordinators, setCoordinators] = useState([]);

    useEffect(()=>{
        CertificationSessionService.readAllCoordinators(currentSession._id).then(res=>{
            if(res?.status===200 && res?.data.length>0){
                setCoordinators(res.data);
            }
        }).catch(err=>console.log(err));
    },[currentSession]);

    const updateInternship=(fieldName, value)=>{
        sessionDispatch({type: sessionReducerActionsType.UPDATE_INTERNSHIP_GENERAL,
            payload:{ internshipId: currentInternship._id, fieldName, value}});
    }

    const coordinatorsList = coordinators?.length>0 ? coordinators?.map((cor, index)=><MenuItem key={index} value={cor._id}>{`${cor?.name} ${cor?.surname}`}</MenuItem>) :[];

    return(
        <Grid container>
            <Grid item xs={8}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="body1"
                                    component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`}}>
                            {t("Information")}
                        </Typography>
                        <hr className="my-1 mr-4"/>
                    </Grid>
                    <Grid item xs={6} className='pl-2'>
                        <TextField label={t("Description")} margin="normal"
                                   InputProps={{
                                       readOnly: true,
                                       disableUnderline: true,
                                   }}
                                   multiline={true}
                                   name={['description']}
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant='standard'
                                   required={false}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={currentInternship?.description || '-'}
                                   onInput={(e) => {}}
                        />
                        <TextField label={t("Location")} margin="normal"
                                   InputProps={{
                                       readOnly: true,
                                       disableUnderline: true,
                                   }}
                                   multiline={true}
                                   name={['internshipLocation']}
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant='standard'
                                   required={false}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={currentInternship?.internshipLocation || '-'}
                                   onInput={(e) => {}}
                        />
                        <TextField label={t("Guidelines")} margin="normal"
                                   InputProps={{
                                       readOnly: true,
                                       disableUnderline: true,
                                   }}
                                   multiline={true}
                                   name={['guidelines']}
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant='standard'
                                   required={false}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={currentInternship?.guidelines || '-'}
                                   onInput={(e) => {}}
                        />
                    </Grid>
                    <Grid item xs={6} className='pl-1'>
                        <TextField label={t("Duration")} margin="normal"
                                   InputProps={{
                                       readOnly: true,
                                       disableUnderline: true,
                                   }}
                                   multiline={true}
                                   name={['duration']}
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant='standard'
                                   required={false}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={currentInternship?.duration || '-'}
                                   onInput={(e) => {}}
                        />
                        <FormControl fullWidth margin="normal" required={false} style={{maxWidth: "400px"}}
                                     error={false}
                                     variant='standard'>
                            <InputLabel id="status-select-label">{t("Status")}</InputLabel>
                            <Select
                                name={['status']}
                                labelId="status-select-label"
                                id="status-select"
                                value={Boolean(currentInternship?.isActive)}
                                input={<Input className={currentInternship?.isActive ? "text-success" : "text-danger"}/>}
                                readOnly={true}
                                disableUnderline={true}
                                IconComponent={()=>null}
                                onChange={(e) => {}}
                            >
                                <MenuItem key={1} value={true} className='text-success'>{t('Active')}</MenuItem>
                                <MenuItem key={2} value={false} className='text-danger'>{t('inActive')}</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField label={t("Attached guidelines")} margin="normal"
                                   InputProps={{
                                       readOnly: true,
                                       disableUnderline: true,
                                       startAdornment:(
                                           <VisibilityIcon className='mr-3'
                                                           style={{color: `rgba(82, 57, 112, 1)`}}
                                           />),
                                   }}
                                   multiline={true}
                                   name={['attachedGuidelines']}
                                   fullWidth
                                   style={{maxWidth: "400px"}}
                                   variant='standard'
                                   required={false}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={currentInternship?.attachedGuidelines || '-'}
                                   onInput={(e) => {}}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={4}>
                <Grid container>
                    <Grid item xs={12}>
                        <Typography variant="body1"
                                    component="h6" className="text-left"
                                    style={{color: `rgba(82, 57, 112, 1)`}}>
                            {t("Management")}
                        </Typography>
                        <hr className="my-1 mr-4"/>
                    </Grid>
                    <Grid item xs={12} >
                        <KeyboardDatePicker
                            style={{maxWidth: "400px"}}
                            InputProps={{
                                readOnly: (isOpenInternshipHelper.type === 'PREVIEW'),
                                disableUnderline: (isOpenInternshipHelper.type === 'PREVIEW'),
                            }}
                            readOnly={(isOpenInternshipHelper.type === 'PREVIEW')}
                            keyboardIcon={(isOpenInternshipHelper.type === 'PREVIEW') ? null : <TodayIcon/>}
                            disabled={userPermissions.isCoordinator}
                            fullWidth
                            name='date'
                            margin="normal"
                            id="date-picker-dialog"
                            label={t("Event date")}
                            format="DD.MM.yyyy"
                            minDate={new Date(now()).toISOString().split("T")[0]}
                            minDateMessage={"It is a past date"}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputVariant={(isOpenInternshipHelper.type === 'PREVIEW') ? 'standard' : 'filled'}
                            value={currentInternship?.startTime}
                            KeyboardButtonProps={{
                                "aria-label": "change date",
                            }}
                            onChange={(date) => {
                                if (date && date._isValid) {
                                    updateInternship('startTime',new Date(date).toISOString());
                                }
                            }}
                        />

                        <KeyboardTimePicker
                            style={{maxWidth: "300px"}}
                            fullWidth
                            ampm={false}
                            disabled={userPermissions.isCoordinator}
                            InputProps={{
                                readOnly: (isOpenInternshipHelper.type === 'PREVIEW'),
                                disableUnderline: (isOpenInternshipHelper.type === 'PREVIEW'),
                            }}
                            inputVariant={(isOpenInternshipHelper.type === 'PREVIEW') ? 'standard' : 'filled'}
                            readOnly={(isOpenInternshipHelper.type === 'PREVIEW')}
                            name='date-time'
                            margin="normal"
                            id="time-picker"
                            label={t("Start time")}
                            //disabled={currentEvent.allDay}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={currentInternship?.startTime}
                            KeyboardButtonProps={{
                                "aria-label": "change time",
                            }}
                            keyboardIcon={(isOpenInternshipHelper.type === 'PREVIEW') ? null : <AccessTimeIcon/>}
                            onChange={(date) => {
                                if (date && date._isValid) {
                                    updateInternship('startTime',new Date(date).toISOString())
                                }
                            }}
                        />
                        {(userPermissions.isTrainingManager) && (
                        <FormControl fullWidth margin="normal" required={false} style={{maxWidth: "400px"}}
                                     error={false}
                                     variant={(isOpenInternshipHelper.type === 'PREVIEW') ? 'standard' : 'filled'}>
                            <InputLabel id="assignedCoordinator-select-label">{t("Assign coordinator")}</InputLabel>
                            <Select
                                name='coordinator'
                                labelId="assignedCoordinator-select-label"
                                id="assignedCoordinator-select"
                                value={currentSession?.coordinator}
                                //renderValue={p=>`${p?.name} ${p?.surname}`}
                                readOnly={(isOpenInternshipHelper.type === 'PREVIEW')}
                                disableUnderline={(isOpenInternshipHelper.type === 'PREVIEW')}
                                onChange={({target:{name,value}}) => {
                                    sessionDispatch({type: sessionReducerActionsType.BASIC_UPDATE,
                                        payload:{field: name, value}});
                                }}
                            >
                                {coordinatorsList}
                            </Select>
                        </FormControl>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}