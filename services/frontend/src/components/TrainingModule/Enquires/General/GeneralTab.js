import React, {useEffect, useState} from "react";
import {Divider} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import {KeyboardDatePicker} from "@material-ui/pickers";
import {now} from "moment";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";
import {useEnquiryContext} from "components/_ContextProviders/EnquiryProvider/EnquiryProvider";
import MenuItem from "@material-ui/core/MenuItem";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import EnquiryService from "services/enquiry.service";
import CompanyService from "services/company.service";
import ModuleService from "services/module.service";
import Grid from "@mui/material/Grid";

const useStyles = makeStyles((theme) => ({}));

export default function GeneralTab(){
    const { F_getHelper} = useMainContext();
    const {userPermissions, manageScopeIds} = F_getHelper();
    const classes = useStyles();
    const { t } = useTranslation();
    const {
        currentEnquiry,
        enquiryDispatch,
        enquiryReducerActionType,
        editFormHelper,
    } = useEnquiryContext();
    const [statuses, setStatuses] = useState([]);
    const [timeFormats, setTimeFormats] = useState([]);
    const [partners, setPartners] = useState([]);
    const [architects, setArchitects] = useState([]);
    const [sessionTemplates, setSessionTemplates] = useState([]);

    useEffect(() => {

            EnquiryService.readAllSessionTemplates(manageScopeIds.moduleId).then((res) => {
                if(res.status === 200 && res?.data?.length>0 ){
                    setSessionTemplates(res.data);
                }
            }).catch(err=>console.log(err));

        EnquiryService.readStatusList().then((res) => {
            if(res?.data && res.status ===200){
                setStatuses(res.data);
            }
        }).catch(err=>console.log(err));
        EnquiryService.readFormatsList().then((res) => {
            if(res?.data && res.status ===200){
                setTimeFormats(res.data);
            }
        });
        CompanyService.readAll().then(res=>{
            if(res?.data && res.status ===200){
                setPartners(res.data);
            }
        }).catch(error=>console.log(error));

        ModuleService.getArchitectsInModule(manageScopeIds.moduleId).then(res=>{
            if(res?.data && res.status ===200){
                setArchitects(res.data)
            }
        }).catch(error=>console.log(error))
    }, [editFormHelper.openType]);

    const statusesList = statuses.map((item, index) => (<MenuItem key={item} value={item}>{item}</MenuItem>));
    const timeFormatsList = timeFormats.map((item, index) => (<MenuItem key={item} value={item}>{item}</MenuItem>));
    const partnersList = partners.map((item, index) => (<MenuItem key={item._id} value={item._id}>{item?.name}</MenuItem>));
    const architectsList = architects.map((item, index) => (<MenuItem key={item._id} value={item._id}>{`${item?.name} ${item?.surname}`}</MenuItem>));
    const sessionTemplatesList = sessionTemplates?.length>0 ? sessionTemplates.map((item, index) => (<MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>)):[];

    return(
            <Grid container mt={2}>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                    {(userPermissions.isModuleManager||userPermissions.isAssistant) && ( <>
                        <Grid item xs={12} md={6}>
                        <FormControl fullWidth margin="dense" required={true}
                                     style={{maxWidth: "400px"}} variant="filled">
                            <InputLabel id="status-select-label">{t("Enquiry status")}</InputLabel>
                            <Select
                                readOnly={editFormHelper.enquiryId === 'NEW'}
                                name='status'
                                labelId="status-select-label"
                                id="status-select"
                                value={currentEnquiry?.status}
                                onChange={(e) => {
                                    enquiryDispatch({type: enquiryReducerActionType.BASIC_UPDATE, payload: {
                                            field: e.target.name, value: e.target.value
                                        }});
                                }}
                            >
                                {statusesList}
                            </Select>
                        </FormControl>
                        </Grid>
                        {(editFormHelper.enquiryId === 'NEW') || (!currentEnquiry?.company) ? (
                                <Grid item xs={12} md={6}>
                                    <FormControl fullWidth margin="normal" required={true}
                                                 style={{maxWidth: "400px"}} variant="filled">
                                        <InputLabel id="partner-select-label">{t("Assign session template")}</InputLabel>
                                        <Select
                                            readOnly={currentEnquiry?.certificationSession}
                                            name='certificationSession'
                                            labelId="partner-select-label"
                                            id="partner-select"
                                            value={currentEnquiry.certificationSession}
                                            onChange={({target:{name, value}}) => {
                                                enquiryDispatch({type: enquiryReducerActionType.BASIC_UPDATE, payload: {
                                                        field: name, value,
                                                    }});
                                            }}
                                        >
                                            {sessionTemplatesList}
                                        </Select>
                                    </FormControl>
                                </Grid>
                        ) : (
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="dense" required={true}
                                             style={{maxWidth: "400px"}} variant="filled">
                                    <InputLabel id="partner-select-label">{t("Assign business client")}</InputLabel>
                                    <Select
                                        readOnly={currentEnquiry?.company}
                                        name='company'
                                        labelId="partner-select-label"
                                        id="partner-select"
                                        value={currentEnquiry.company}
                                        onChange={(e) => {
                                            enquiryDispatch({type: enquiryReducerActionType.BASIC_UPDATE, payload: {
                                                    field: e.target.name, value: e.target.value
                                                }});
                                        }}
                                    >
                                        {partnersList}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                    </>)}
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                style={{maxWidth: '400px'}}
                                label="Enquiry name"
                                name='name'
                                fullWidth={true}
                                margin="dense"
                                variant="filled"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={currentEnquiry.name}
                                onChange={(e) =>{
                                    enquiryDispatch({type: enquiryReducerActionType.BASIC_UPDATE, payload: {
                                            field: e.target.name, value: e.target.value
                                        }});
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            {(editFormHelper.enquiryId !== 'NEW') && (
                                    <TextField
                                        InputProps={{
                                            readOnly: (!userPermissions.isPartner)
                                        }}
                                        style={{maxWidth: '400px'}}
                                        label="Additional question from partner"
                                        name='additionalQuestion'
                                        fullWidth={true}
                                        multiline
                                        margin="dense"
                                        variant="filled"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        value={currentEnquiry.additionalQuestion}
                                        onChange={({target:{name,value}}) =>{
                                            enquiryDispatch({type: enquiryReducerActionType.BASIC_UPDATE, payload: {
                                                    field: name, value,
                                                }});
                                        }}
                                    />
                            )}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className='mt-3'>
                    {(editFormHelper.enquiryId !== 'NEW') && ( <>
                            <small>{`${t("Contact details")} ${currentEnquiry?.contact ?  ( " - " + t('system contact')) : ''}`}</small>
                            <Divider variant="insert" />
                            {currentEnquiry?.contact ? (
                                <Grid container spacing={1}>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            style={{maxWidth: '400px'}}
                                            label="Contact name"
                                            name={['contact','name']}
                                            fullWidth={true}
                                            margin="dense"
                                            variant="filled"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={currentEnquiry?.contact?.name}
                                            onChange={(e) =>{
                                                enquiryDispatch({type: enquiryReducerActionType.BASIC_UPDATE, payload: {
                                                        fields: ['contact','name'], value: e.target.value
                                                    }});
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            style={{maxWidth: '400px'}}
                                            label="Contact surname"
                                            name={['contact','surname']}
                                            fullWidth={true}
                                            margin="dense"
                                            variant="filled"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={currentEnquiry?.contact?.surname}
                                            onChange={(e) =>{
                                                enquiryDispatch({type: enquiryReducerActionType.BASIC_UPDATE, payload: {
                                                        fields: ['contact','surname'], value: e.target.value
                                                    }});
                                            }}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            style={{maxWidth: '400px'}}
                                            variant="filled"
                                            label="Trainees Limit"
                                            name={'traineesLimit'}
                                            fullWidth={true}
                                            margin="dense"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={currentEnquiry?.traineesLimit}
                                            onChange={(e) =>{
                                                enquiryDispatch({type: enquiryReducerActionType.BASIC_UPDATE, payload: {
                                                        fields: 'traineesLimit', value: e.target.value
                                                    }});
                                            }}
                                        />
                                    </Grid>
                                                                        <Grid item xs={12} md={6}>
                                        <TextField
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            style={{maxWidth: '400px'}}
                                            variant="filled"
                                            label="Contact email"
                                            name={['contact','email']}
                                            fullWidth={true}
                                            margin="dense"
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                            value={currentEnquiry?.contact?.email}
                                            onChange={(e) =>{
                                                enquiryDispatch({type: enquiryReducerActionType.BASIC_UPDATE, payload: {
                                                        fields: ['contact','email'], value: e.target.value
                                                    }});
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            ):(
                                <Grid item xs={12}>
                                    <p>{t("External")}</p>
                                </Grid>
                            )}
                        </>
                    )}
                </Grid>
                <Grid item xs={12} className='mt-3'>
                    {(userPermissions.isModuleManager||userPermissions.isAssistant) && ( <>
                        <small>{t("Session details")}</small>
                        <Divider variant="insert" />

                        <Grid container spacing={1}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth margin="dense" required={true}
                                             style={{maxWidth: "400px"}} variant="filled">
                                    <InputLabel id="partner-select-label">{t("Select Module Manager")}</InputLabel>
                                    <Select
                                        name='architect'
                                        labelId="partner-select-label"
                                        id="partner-select"
                                        value={currentEnquiry?.architect}
                                        onChange={(e) => {
                                            enquiryDispatch({type: enquiryReducerActionType.BASIC_UPDATE, payload: {
                                                    field: e.target.name, value: e.target.value
                                                }});
                                        }}
                                    >
                                        {architectsList}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    style={{maxWidth: '400px'}}
                                    variant="filled"
                                    label="Digital code"
                                    name='digitalCode'
                                    fullWidth={true}
                                    margin="dense"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={currentEnquiry.digitalCode}
                                    onChange={(e) =>{
                                        enquiryDispatch({type: enquiryReducerActionType.BASIC_UPDATE, payload: {
                                                field: e.target.name, value: e.target.value
                                            }});
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <KeyboardDatePicker
                                    style={{maxWidth: '400px'}}
                                    InputProps={{
                                        readOnly: false,//(isOpenSessionForm.type === 'PREVIEW'),
                                        disableUnderline: false,//(isOpenSessionForm.type === 'PREVIEW'),
                                    }}
                                    //keyboardIcon={(isOpenSessionForm.type === 'PREVIEW') ? null : <TodayIcon/>}
                                    rightArrowIcon={null}
                                    //readOnly={(isOpenSessionForm.type === 'PREVIEW')}
                                    margin="dense"
                                    name='startDate'
                                    fullWidth
                                    id="date-picker-dialog"
                                    label={t("Start date")}
                                    format="DD.MM.yyyy"
                                    minDate={(editFormHelper.enquiryId === 'NEW') ? (new Date(now()).toISOString().split("T")[0]) : false}
                                    minDateMessage={"this date is past"}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    //inputVariant={(isOpenSessionForm.type === 'PREVIEW') ? 'standard' : 'filled'}
                                    inputVariant='filled'
                                    value={currentEnquiry.startDate}
                                    KeyboardButtonProps={{
                                        "aria-label": "change date",
                                    }}
                                    onChange={(date) => {
                                        if (date && date._isValid) {
                                            enquiryDispatch({type: enquiryReducerActionType.BASIC_UPDATE, payload: {
                                                    field: 'startDate', value: new Date(date).toISOString()
                                                }});
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <KeyboardDatePicker
                                    style={{maxWidth: '400px'}}
                                    InputProps={{
                                        readOnly: false,//(isOpenSessionForm.type === 'PREVIEW'),
                                        disableUnderline: false,//(isOpenSessionForm.type === 'PREVIEW'),
                                    }}
                                    //keyboardIcon={(isOpenSessionForm.type === 'PREVIEW') ? null : <TodayIcon/>}
                                    rightArrowIcon={null}
                                    //readOnly={(isOpenSessionForm.type === 'PREVIEW')}
                                    margin="dense"
                                    name='endDate'
                                    fullWidth
                                    id="date-picker-dialog"
                                    label={t("End date")}
                                    format="DD.MM.yyyy"
                                    minDate={(editFormHelper.enquiryId === 'NEW') ? (new Date(now()).toISOString().split("T")[0]) : false}
                                    minDateMessage={"this date is past"}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    //inputVariant={(isOpenSessionForm.type === 'PREVIEW') ? 'standard' : 'filled'}
                                    inputVariant='filled'
                                    value={currentEnquiry.endDate}
                                    KeyboardButtonProps={{
                                        "aria-label": "change date",
                                    }}
                                    onChange={(date) => {
                                        if (date && date._isValid) {
                                            enquiryDispatch({type: enquiryReducerActionType.BASIC_UPDATE, payload: {
                                                    field: 'endDate', value: new Date(date).toISOString()
                                                }});
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    style={{maxWidth: '400px'}}
                                    variant="filled"
                                    label="Students limit"
                                    type="number"
                                    name='traineesLimit'
                                    fullWidth={true}
                                    margin="dense"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={currentEnquiry?.traineesLimit}
                                    onChange={(e) =>{
                                        if(e.target.value !== ""){
                                            if(Number(e.target.value)>0 && Number(e.target.value)<1000){
                                                enquiryDispatch({type: enquiryReducerActionType.BASIC_UPDATE, payload: {
                                                        field: e.target.name, value: e.target.value
                                                    }});
                                            }
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                {/* for the moment hide "formats" as it's not really affecting how system works */}
                                {/* <FormControl fullWidth margin="dense"
                                     style={{maxWidth: "400px"}} variant="filled">
                                    <InputLabel id="format-select-label">{t("Format")}</InputLabel>
                                    <Select
                                        name='format'
                                        labelId="format-select-label"
                                        id="format-select"
                                        value={currentEnquiry?.timeFormat}
                                        onChange={(e) => {
                                        }}
                                    >
                                        {timeFormatsList}
                                    </Select>
                                </FormControl> */}
                            </Grid>
                        </Grid>
                    </>)}
                </Grid>
            </Grid>
    )
}