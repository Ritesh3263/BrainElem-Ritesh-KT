import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import { now } from "moment";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import { FormGroup, ListSubheader, Paper } from "@material-ui/core";
import TextField from "@mui/material/TextField";
import { ETextField } from "new_styled_components";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from "styled_components/Switch";
import Chip from "@material-ui/core/Chip";
import InfoIcon from '@material-ui/icons/Info';
import { Radio, RadioGroup, Tooltip } from "@mui/material";
import { useSessionContext } from "components/_ContextProviders/SessionProvider/SessionProvider";
import MenuItem from "@material-ui/core/MenuItem";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useShoppingCartContext } from "components/_ContextProviders/ShoppingCartProvider/ShoppingCartProvider";
import TodayIcon from '@mui/icons-material/Today';
import Button from "@material-ui/core/Button";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import { InputAdornment } from "@mui/material";
import { KeyboardDatePicker } from "@material-ui/pickers";
import SearchField from "components/common/Search/SearchField";
import TableSearch from "components/common/Table/TableSearch";
import ESwitchWithTooltip from "styled_components/SwitchWithTooltip";
import CommonExpandBar from 'components/common/ExpandBar'
import CoursePathService from "services/course_path.service";
import CourseService from "services/course.service";
import CertificationSessionService from "services/certification_session.service";
// import { theme } from "MuiTheme";
import FormatService from "services/format.service";
import { ThemeProvider, Divider } from '@mui/material';
import { new_theme } from 'NewMuiTheme';
import "../SessionForm.scss";

export default function General() {
    const { t } = useTranslation();
    const [trainers, setTrainers] = useState([]);
    const { F_getHelper } = useMainContext();
    const { userPermissions, manageScopeIds, user } = F_getHelper();
    const [isOpenSidebarContentPath, setIsOpenSidebarContentPath] = useState(false);
    // Payment #####
    const [showPaymentTab, setShowPaymentTab] = useState(true);
    // #############

    const [isEnrolled, setIsEnrolled] = useState(true);
    const [assignedGroup, setAssignedGroup] = useState();

    const [searchingText, setSearchingText] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [coursePaths, setCoursePaths] = useState([]);
    const [categories, setCategories] = useState([]);
    const [formats, setFormats] = useState([]);
    const { F_showToastMessage, F_getErrorMessage } = useMainContext();
    const {
        isOpenSessionForm,
        sessionReducerActionsType,
        currentSession,
        sessionDispatch,
    } = useSessionContext();

    const {
        getCurrency
    } = useShoppingCartContext();

    useEffect(() => {
        CertificationSessionService.getAllTrainingManagersByModule().then(res => {
            if (res?.status === 200 && res?.data?.length > 0) {
                setTrainers(res.data);
            }
        }).catch(err => console.log(err));

        FormatService.readAll().then(res => {
            if (res.status === 200 && res.data) {
                setFormats(res.data);
            }
        }).catch(error => console.log(error))
    }, []);

    useEffect(() => {
        CourseService.getCategoryRefsFromModule().then((res) => {
            if (res.status === 200 && res.data) {
                setCategories(res.data);
            }
        }).catch(err => console.log(err));
    }, []);

    useEffect(() => {
        CoursePathService.readAll().then(res => {
            if (res.status === 200) {
                if (res.data) {
                    setCoursePaths(res.data);
                }
            } else {
                F_showToastMessage(F_getErrorMessage({ response: res }));
            }
        }).catch(error => {
            console.error(error);
            F_showToastMessage(F_getErrorMessage({ response: { status: 500 } }), "error");
        });
    }, [isOpenSidebarContentPath]);

    useEffect(() => {
        setFilteredData(coursePaths);
    }, [coursePaths]);



    const formatsList = formats.map((format, index) => <MenuItem key={index} value={format._id}>{format.name}</MenuItem>);
    const categoriesList = categories?.length > 0 ? categories.map((cat, index) => <MenuItem key={cat._id} value={cat}>{`${cat?.name}`}</MenuItem>) : [];
    const managersList = trainers?.length > 0 ? trainers.map((tr, index) => <MenuItem key={tr._id} value={tr}>{`${tr?.name ?? '-'} ${tr?.surname}`}</MenuItem>) : [];

    const allCoursePathList = filteredData.map((cpth, index) => (
        <FormControlLabel
            key={index}
            label={<div><span>{cpth?.name}</span><span className="text-muted ml-4">{t("Level")} {`:  ${cpth?.level ?? "-"}`}</span></div>}
            value={cpth?._id}
            name="coursePath"
            control={<Radio style={{ color: new_theme.palette.secondary.DarkPurple }} />}
            onChange={({ target: { name } }) => {
                sessionDispatch({ type: sessionReducerActionsType.BASIC_UPDATE, payload: { field: name, value: cpth } });
            }}
        />
    ));
    return (
        <ThemeProvider theme={new_theme}>
            <Grid container>
                <Grid item xs={12}>
                    <Grid item xs={12} sx={{mb:2}}>
                        <Typography variant="h3" component="h4" sx={{ color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }}>
                            {t("General information")}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={2} className="mb-4">
                            <Grid item xs={12} sm={4} md={3}>
                                <ETextField
                                    
                                    fullWidth={true}
                                    // placeholder="Session name*"
                                    variant="filled"
                                    InputProps={{
                                        // readOnly: ((isOpenSessionForm.type === 'PREVIEW') || (!userPermissions.isArchitect && !userPermissions.isAssistant && !userPermissions.isModuleManager && !userPermissions.bcTrainer.edit)),
                                        // disableUnderline: (isOpenSessionForm.type === 'PREVIEW'),
                                    }}
                                    //disabled={!userPermissions.isArchitect}
                                    name='name'
                                    //variant={(isOpenSessionForm.type === 'PREVIEW') ? 'standard' : 'filled'}
                                    label="Session name"
                                    required={true}
                                    //error={basicValidators.curriculumName}
                                    //helperText={basicValidators.curriculumName ? t("required") : ""}
                                    
                                    value={currentSession?.name}
                                    onInput={({ target: { name, value } }) => {
                                        sessionDispatch({ type: sessionReducerActionsType.BASIC_UPDATE, payload: { field: name, value } });
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2} className="mb-4">
                            <Grid item xs={12} sm={4} md={3} >
                                <KeyboardDatePicker
                                    className="datePickerH"
                                    inputVariant="filled"
                                    fullWidth={true}
                                    variant="filled"
                                    
                                    label="Start date"
                                    
                                    InputProps={{
                                        readOnly: (isOpenSessionForm.type === 'PREVIEW' || (!userPermissions.isArchitect && !userPermissions.isAssistant && !userPermissions.isModuleManager)),
                                        disableUnderline: (isOpenSessionForm.type === 'PREVIEW' || (!userPermissions.isArchitect && !userPermissions.isAssistant && !userPermissions.isModuleManager)),
                                    }}
                                    keyboardIcon={(isOpenSessionForm.type === 'PREVIEW') ? null : <TodayIcon />}
                                    readOnly={(isOpenSessionForm.type === 'PREVIEW' || (!userPermissions.isArchitect && !userPermissions.isAssistant && !userPermissions.isModuleManager && !userPermissions.bcTrainer.edit))}
                                    name={['session', 'startDate']}
                                    id="date-picker-dialog"
                                    
                                    format="DD.MM.yyyy"
                                    // minDate={new Date(now()).toISOString().split("T")[0]}
                                    // minDateMessage={"It is a past date"}
                                    //inputVariant={(isOpenSessionForm.type === 'PREVIEW' || (!userPermissions.isArchitect && !userPermissions.isAssistant && !userPermissions.isModuleManager)) ? 'standard' : 'filled'}

                                    value={currentSession?.startDate}
                                    KeyboardButtonProps={{
                                        "aria-label": "change date",
                                    }}
                                    onChange={(date) => {
                                        if (date && date._isValid) {
                                            sessionDispatch({
                                                type: sessionReducerActionsType.BASIC_UPDATE,
                                                payload: { field: 'startDate', value: new Date(date).toISOString() }
                                            })
                                        }
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} md={3}>
                                <KeyboardDatePicker
                                    className="datePickerH"
                                    fullWidth={true}
                                    label="End date"
                                    InputProps={{
                                        readOnly: (isOpenSessionForm.type === 'PREVIEW' || (!userPermissions.isArchitect && !userPermissions.isAssistant && !userPermissions.isModuleManager)),
                                        disableUnderline: (isOpenSessionForm.type === 'PREVIEW' || (!userPermissions.isArchitect && !userPermissions.isAssistant && !userPermissions.isModuleManager)),
                                    }}
                                    readOnly={(isOpenSessionForm.type === 'PREVIEW' || (!userPermissions.isArchitect && !userPermissions.isAssistant && !userPermissions.isModuleManager && !userPermissions.bcTrainer.edit))}
                                    keyboardIcon={(isOpenSessionForm.type === 'PREVIEW') ? null : <TodayIcon />}
                                    name={['session', 'endDate']}
                                    id="date-picker-dialog"
                                    
                                    format="DD.MM.yyyy"
                                    // minDate={new Date(now()).toISOString().split("T")[0]}
                                    // minDateMessage={"It is a past date"}
                                    
                                    //inputVariant={(isOpenSessionForm.type === 'PREVIEW' || (!userPermissions.isArchitect && !userPermissions.isAssistant && !userPermissions.isModuleManager)) ? 'standard' : 'filled'}
                                    inputVariant="filled"
                                    value={currentSession?.endDate}
                                    KeyboardButtonProps={{
                                        "aria-label": "change date",
                                    }}
                                    onChange={(date) => {
                                        if (date && date._isValid) {
                                            sessionDispatch({
                                                type: sessionReducerActionsType.BASIC_UPDATE,
                                                payload: { field: 'endDate', value: new Date(date).toISOString() }
                                            })
                                        }
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            {userPermissions.isTrainee && ( 
                                <>
                                <Grid item xs={12} sm={4} md={3} >
                                    <ETextField
                                        fullWidth={true}
                                        variant="filled"
                                        label={`${t("Status of enrollment")}`}
                                        
                                        InputProps={{
                                            readOnly: false,
                                            // disableUnderline: true
                                        }}
                                        value={isEnrolled ? `${t('Enrolled')}` : `${t('Not Enrolled')}`}
                                    />
                                </Grid>
                                {/* <Grid item xs={12} sm={4} md={3} >
                                    <TextField 
                                        
                                        multiline={true}
                                        maxRows={2}
                                        
                                        fullWidth={true}
                                        variant="filled"
                                        label={`${t("Assigned Team")}`}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        InputProps={{
                                            readOnly: false,
                                        }}
                                        value={assignedGroup || '-'}
                                    />
                                </Grid> */}
                                </>
                            )}  
                        </Grid>
                    </Grid>
                    <Grid item xs={12} className="d-flex flex-column">
                        <Grid container className="flex-grow-1 d-flex flex-row align-content-between">
                            {/* <Grid item xs={12}>
                                <Grid container>
                                    {(userPermissions.isArchitect || userPermissions.isAssistant || userPermissions.isModuleManager) && (
                                        <Grid item xs={12}>
                                            <Typography variant="body1" component="h6" className=" pt-3 text-left" style={{ color: new_theme.palette.secondary.DarkPurple }}>
                                                {t("Assigned course path")}
                                            </Typography>
                                            <hr className="my-1 mr-4" />
                                            <Grid container>
                                                <Grid item xs={6} className="mt-2">
                                                    {currentSession?.coursePath && (
                                                        <>
                                                            {isOpenSessionForm.type !== 'PREVIEW' ? (
                                                                <Chip
                                                                    onDelete={() => {
                                                                        sessionDispatch({ type: sessionReducerActionsType.BASIC_UPDATE, payload: { field: 'coursePath', value: null } });
                                                                    }}
                                                                    style={{ backgroundColor: new_theme.palette.secondary.DarkPurple, color: `white` }} // TODO, `primary` color didn't work
                                                                    label={currentSession?.coursePath?.name} />
                                                            ) : (
                                                                <Chip
                                                                    style={{ backgroundColor: new_theme.palette.secondary.DarkPurple, color: `white` }} // TODO, `primary` color didn't work
                                                                    label={currentSession?.coursePath?.name} />
                                                            )}
                                                        </>
                                                    )}
                                                </Grid>
                                                {!currentSession?.groups[0]?.name && (
                                                    <Grid item xs={6} className="d-flex justify-content-end pb-2">
                                                        <Button onClick={() => { setIsOpenSidebarContentPath(true) }}
                                                            disabled={isOpenSessionForm.type === 'PREVIEW'}
                                                            size="small" variant="contained" color="secondary"
                                                            className="mt-2">
                                                            {t("Manage course path")}
                                                        </Button>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Grid>
                                    )}
                                </Grid>
                            </Grid> */}
                            {/* {!currentSession?.origin  && (<>
                    <Grid item xs={12} className="pt-2 d-flex flex-column">
                        <Typography variant="body1" component="h6" className="text-left" style={{color: new_theme.palette.secondary.DarkPurple}}>
                            {t("Visibility")}
                        </Typography>
                        <Divider/>
                        <hr className="my-1 mr-4"/>
                        <FormControl style={{ maxWidth:"400px"}}>

                            <FormLabel component="legend">
                                <small>{t("Send to cloud")}</small>
                                <Tooltip title={t("Send to network's cloud")}>
                                <Chip color="" size="small" className="ml-1" 
                                      icon={<InfoIcon style={{fill:"white"}}/>}
                                />
                                </Tooltip>
                            </FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            name='isSendToCloud'
                                            color="primary"
                                            disabled={(isOpenSessionForm.type === 'PREVIEW' || (!userPermissions.isArchitect && !userPermissions.isAssistant && !userPermissions.isModuleManager))}
                                            checked={currentSession?.isSendToCloud}
                                            onChange={({target:{value,name}})=>{
                                                sessionDispatch({type: sessionReducerActionsType.BASIC_UPDATE,
                                                    payload: {field: name, value: !currentSession?.isSendToCloud}})
                                            }}
                                        />
                                    }
                                    label={currentSession?.isSendToCloud ? t("Yes") : t("No")}
                                />
                            </FormGroup>
                        </FormControl>
                        <FormControl style={{ maxWidth:"400px"}}>
                            <FormLabel component="legend">
                                <small>{t("Make it public")}</small>
                                <Tooltip title={t("Visible for all users (wit and without account)")}>
                                <Chip color="" size="small" className="ml-1" 
                                      icon={<InfoIcon style={{fill:"white"}}/>}
                                />
                                </Tooltip>
                            </FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            disabled={(isOpenSessionForm.type === 'PREVIEW' || (!userPermissions.isArchitect && !userPermissions.isAssistant && !userPermissions.isModuleManager))}
                                            name='isPublic'
                                            color="primary"
                                            checked={currentSession?.isPublic}
                                            onChange={({target:{value, name}})=>{
                                                sessionDispatch({type: sessionReducerActionsType.BASIC_UPDATE,
                                                    payload: {field: name, value: !currentSession?.isPublic}})
                                            }}
                                        />
                                    }
                                    label={currentSession?.isPublic ? t("Yes") : t("No")}
                                />
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    </> )} */}
                        </Grid>
                    </Grid>
                    {/* ##### Payment tab ##### 
                Only for architect and only if it's not session for bussiness client(enquiry is false)
            */}
                    {/* {(userPermissions.isArchitect || userPermissions.isAssistant || userPermissions.isModuleManager) && currentSession && !currentSession.enquiry && (
                        <Grid item xs={12} lg={6} className="mt-4">
                            <CommonExpandBar text={t("Payment settings")} value={showPaymentTab} setValue={setShowPaymentTab}>
                                <Grid xs={12} >
                                    <ESwitchWithTooltip name={t("Free of charge")}
                                        description={"Make the session free of charge for all users"}
                                        checked={!currentSession.paymentEnabled}
                                        onChange={() => { sessionDispatch({ type: sessionReducerActionsType.BASIC_UPDATE, payload: { field: 'paymentEnabled', value: !currentSession.paymentEnabled } }) }}>
                                    </ESwitchWithTooltip>
                                    <ETextField sx={{ mt: 1 }} disabled={!currentSession.paymentEnabled} label={t("Price for the course")} type="number"
                                        value={currentSession.price}
                                        onChange={(event) => { sessionDispatch({ type: sessionReducerActionsType.BASIC_UPDATE, payload: { field: 'price', value: event.target.value } }) }}
                                        required={true}
                                        InputProps={
                                            {
                                                inputProps: { min: 1, max: 1000 },
                                                startAdornment:
                                                    <InputAdornment position="start">
                                                        <>{getCurrency()}</>
                                                    </InputAdornment>

                                            }
                                        }>
                                    </ETextField>
                                </Grid>
                            </CommonExpandBar>
                        </Grid>

                    )} */}
                    {/* ##### End of payment tab ##### */}
                    <SwipeableDrawer
                        PaperProps={{
                            style: {
                                backgroundColor: new_theme.palette.primary.PWhite,
                                maxWidth: "450px"
                            }
                        }}
                        anchor="right"
                        onOpen=""
                        open={isOpenSidebarContentPath}
                        onClose={() => {
                            setIsOpenSidebarContentPath(false);
                            setSearchingText('');
                        }}
                    >
                        <List
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                            subheader={
                                <ListSubheader disableSticky="true" component="div" id="nested-list-subheader">
                                    <Grid container className="py-2">
                                        <Grid item xs={12}>
                                            <Typography variant="h3" component="h2" className="text-center text-justify mt-2" style={{ fontSize: "32px" }}>
                                                {t("Manage course path")}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} className='px-3 mb-2' >
                                            <SearchField
                                                className="text-primary"
                                                value={searchingText}
                                                onChange={({ target: { value } }) => { TableSearch(value, coursePaths, setSearchingText, setFilteredData) }}
                                                clearSearch={() => TableSearch('', coursePaths, setSearchingText, setFilteredData)}
                                            />
                                        </Grid>
                                    </Grid>
                                </ListSubheader>}
                        >
                            <FormControl className="pl-3 d-flex">
                                <RadioGroup
                                    aria-labelledby="demo-radio-buttons-group-label"
                                    defaultValue=""
                                    value={currentSession?.coursePath?._id}
                                    name="radio-buttons-group"
                                >
                                    {(allCoursePathList?.length > 0) ? allCoursePathList : <span>{t("No data")}</span>}
                                </RadioGroup>
                            </FormControl>
                        </List>
                    </SwipeableDrawer>
                </Grid>
            </Grid>
        </ThemeProvider>
    )
}