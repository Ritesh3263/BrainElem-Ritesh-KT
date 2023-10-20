import Dialog from "@material-ui/core/Dialog";
import {Button, DialogActions, DialogContent, DialogTitle, Divider} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import {now} from "moment";
import CompanyService from "services/company.service";
import MenuItem from "@material-ui/core/MenuItem";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import {KeyboardDatePicker} from "@material-ui/pickers";
import { theme } from "../../../MuiTheme";

const useStyles = makeStyles((theme) => ({}));


export default function ExaminersModal(props){
    const{
        examinersModalHelper,
        setExaminersModalHelper,
        partnerId
    }=props;
    const {t} = useTranslation();
    const classes = useStyles();
    const {F_showToastMessage, F_getHelper} = useMainContext();
    const {user:{role:myRole}} = F_getHelper();
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
    const [MSUser, setMSUser] = useState({settings:{isActive:"", role:"",},details:{},});
    const [validators, setValidators] = useState({email: false, username: false, name: false, surname: false, });


    useEffect(()=>{
        if(examinersModalHelper.examinerId === "NEW" && examinersModalHelper.openType === 'ADD'){
            setMSUser({
                name: "",
                surname: "",
                username: "",
                email: "",
                password: "",
                settings:{
                    isActive: true,
                    role: myRole==="Partner"? "Trainee":"Trainer",//"Examiner",
                },
                details:{
                    fullName: "",
                    displayName: "",
                    phone: "",
                    street: "",
                    buildNr: "",
                    postcode: "",
                    city: "",
                    country: "",
                    dateOfBirth:'',
                    description: ""
                }
            })
        }else if(examinersModalHelper.examinerId){
            CompanyService.readPartnerExaminer(examinersModalHelper.examinerId).then(res=>{
                if(res.status === 200 && res.data){
                    setMSUser(res.data)
                }
            }).catch(err=>console.log(err));
        }
    },[examinersModalHelper.isOpen]);

    function validateFields(){
        let isValidate = true;

        if(MSUser.username.length < 3 || MSUser.username.length > 20){
            setValidators(p=>({...p,username: true}));
            isValidate = false;
        }else{
            setValidators(p=>({...p,username: false}));
            //isValidate = true;
        }

        if(MSUser.name.length < 3 || MSUser.name.length > 20){
            setValidators(p=>({...p,name: true}));
            isValidate = false;
        }else{
            setValidators(p=>({...p,name: false}));
            //isValidate = true;
        }

        if(MSUser.surname.length < 3 || MSUser.surname.length > 20){
            setValidators(p=>({...p,surname: true}));
            isValidate = false;
        }else{
            setValidators(p=>({...p,surname: false}));
            //isValidate = true;
        }

        if(examinersModalHelper.openType === "ADD"){
            if(MSUser.password.length < 3 || MSUser.password.length > 20){
                setValidators(p=>({...p,password: true}));
                isValidate = false;
            }else{
                setValidators(p=>({...p,password: false}));
                //isValidate = true;
            }
        }

        return isValidate;
    };

    const saveChanges=()=>{
        if(validateFields()){
            if(examinersModalHelper.openType === "ADD"){
                CompanyService.addPartnerExaminer({examiner: MSUser, companyId: partnerId}).then(res=>{
                    F_showToastMessage(t(res.data.message), res.status===200? "success":"warning");
                    setExaminersModalHelper({isOpen: false, examinerId: undefined, openType: 'ADD'});
                }).catch(error=>console.error(error))
            }else{
                // CompanyService.updatePartnerExaminer(MSUser, partnerId).then(res=>{
                //     console.log(res)
                //     F_showToastMessage(t(res.data.message), res.status===200? "success":"warning");
                //     setCurrentTab({openTab:0, type:""})
                // }).catch(error=>console.error(error));
            }
        }else{
            F_showToastMessage("Correct wrong fields then save","warning");
        }
    }

    const rolesList = [
        {name: 'Examiner/Trainer', role: 'Trainer'}, 
        {name: 'Trainee', role: 'Trainee'},
    ].map((role,index)=><MenuItem key={index} disabled={myRole==="Partner" && role.role==='Trainer'} value={role.role}>{role.name}</MenuItem>);

    return (
        <Dialog 
                PaperProps={{
                    style:{borderRadius: "16px", background: theme.palette.glass.medium, backdropFilter: "blur(20px)"}
                }}    
                open={examinersModalHelper.isOpen}
                onClose={()=>setExaminersModalHelper({isOpen: false, examinerId: undefined, openType: 'ADD'})}
                maxWidth={"md"}
                fullWidth={true} aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title" className="px-3 pt-2 pb-1">
                <div className="d-flex align-items-center">
                    <div className="ml-2">
                        <Typography variant="h3" component="h3" className="text-left pt-2" style={{color:theme.palette.primary.lightViolet}}>
                            {` ${MSUser?.name ? (MSUser?.name +" "+ MSUser?.surname) : t("Create new user")}`}
                        </Typography>
                    </div>
                </div>
            </DialogTitle>
            <DialogContent className="pl-4">
                <Grid container>
                    <Grid item xs={12} className="d-flex flex-column">
                        <small style={{color:theme.palette.primary.darkViolet}}>{t("Assign the role")}</small>
                        <FormControl style={{maxWidth:'400px'}} margin="dense" variant="filled" fullWidth={true}>
                            <InputLabel id="role-simple-select-label">{t("Select user role")}</InputLabel>
                            <Select
                                labelId="role-simple-select-label"
                                id="role-simple-select"
                                value={MSUser?.settings?.role}
                                // open={!examinersModalHelper?.openType === 'PREVIEW'}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                InputProps={{
                                    readOnly: examinersModalHelper?.openType === 'PREVIEW',
                                }}
                                // disabled={examinersModalHelper?.openType === 'PREVIEW'}
                                fullWidth={true}
                                // renderValue={p=>p.name}
                                //input={<Input/>}
                                onChange={({target}) => {
                                    setMSUser(p=>({...p, settings: {...p.settings, role: target.value}}))
                                }}
                            >
                                {rolesList}
                            </Select>
                        </FormControl>
                        <small  style={{color:theme.palette.primary.darkViolet}} className="mt-3">{t("General information")}</small>
                    </Grid>
                    <Grid item xs={12} md={6} className="d-flex flex-column">
                        <TextField label={t("Name of user")} style={{ maxWidth:"400px"}} margin="dense"
                                   variant="filled"
                                   fullWidth={true}
                                   name='name'
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   InputProps={{
                                       readOnly: examinersModalHelper?.openType === 'PREVIEW',
                                   }}
                                   value={MSUser.name}
                                   required={true}
                                   helperText={validators.name ? "Incorrect name [3-20 characters]" : null}
                                    error={validators.name}
                                   onInput={({target}) => {
                                       setMSUser(p=>({...p, [target.name]: target.value}));
                                   }}
                        />
                        <TextField label={t("Surname")} style={{ maxWidth:"400px"}} margin="dense"
                                   variant="filled"
                                   fullWidth={true}
                                   name='surname'
                                   InputProps={{
                                       readOnly: examinersModalHelper?.openType === 'PREVIEW',
                                   }}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.surname}
                                   required={true}
                                   helperText={validators.surname ? "Incorrect surname [3-20 characters]" : null}
                                   error={validators.surname}
                                   onInput={({target}) => {
                                       setMSUser(p=>({...p, [target.name]: target.value}));
                                   }}
                        />
                        <TextField label={t("E-mail")} style={{ maxWidth:"400px"}} margin="dense"
                                   variant="filled"
                                   fullWidth={true}
                                   name='email'
                                   InputProps={{
                                       readOnly: examinersModalHelper?.openType === 'PREVIEW',
                                   }}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.email}
                                   helperText={validators.email ? "Incorrect email" : null}
                                   error={validators.email}
                                   onInput={({target}) => {
                                       setMSUser(p=>({...p, [target.name]: target.value}));
                                   }}
                        />
                        <TextField label={t("Street")} style={{ maxWidth:"400px"}} margin="dense"
                                   variant="filled"
                                   fullWidth={true}
                                   InputProps={{
                                       readOnly: examinersModalHelper?.openType === 'PREVIEW',
                                   }}
                                   name={['details','street']}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser?.details?.street}
                                   onInput={({target}) => {
                                       let opt = target.name.split(',');
                                       setMSUser(p=>({...p, [opt?.[0]]: {...p[opt[0]], [opt?.[1]]: target.value}}));
                                   }}
                        />
                        <TextField label={t("Postcode")} style={{ maxWidth:"400px"}} margin="dense"
                                   variant="filled"
                                   fullWidth={true}
                                   InputProps={{
                                       readOnly: examinersModalHelper?.openType === 'PREVIEW',
                                   }}
                                   name={['details','postcode']}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.details.postcode}
                                   onInput={({target}) => {
                                       let opt = target.name.split(',');
                                       setMSUser(p=>({...p, [opt?.[0]]: {...p[opt[0]], [opt?.[1]]: target.value}}));
                                   }}
                        />
                        <TextField label={t("Country")} style={{ maxWidth:"400px"}} margin="dense"
                                   variant="filled"
                                   fullWidth={true}
                                   InputProps={{
                                       readOnly: examinersModalHelper?.openType === 'PREVIEW',
                                   }}
                                   name={['details','country']}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.details.country}
                                   onInput={({target}) => {
                                       let opt = target.name.split(',');
                                       setMSUser(p=>({...p, [opt?.[0]]: {...p[opt[0]], [opt?.[1]]: target.value}}));
                                   }}
                        />
                        <TextField label={t("City")} style={{maxWidth:'400px'}} margin="dense"
                                   variant="filled"
                                   fullWidth={true}
                                   InputProps={{
                                       readOnly: examinersModalHelper?.openType === 'PREVIEW',
                                   }}
                                   name={['details','city']}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.details.city}
                                   onInput={({target}) => {
                                       let opt = target.name.split(',');
                                       setMSUser(p=>({...p, [opt?.[0]]: {...p[opt[0]], [opt?.[1]]: target.value}}));
                                   }}
                        />
                        <TextField label={t("Description (max 100 words)")} style={{ maxWidth:"400px"}}  margin="dense"
                                   variant="filled"
                                   fullWidth={true}
                                   multiline={true}
                                   InputProps={{
                                       readOnly: examinersModalHelper?.openType === 'PREVIEW',
                                   }}
                                   maxRows={4}
                                   name={['details','description']}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.details.description}
                                   onInput={({target}) => {
                                       let opt = target.name.split(',');
                                       setMSUser(p=>({...p, [opt?.[0]]: {...p[opt[0]], [opt?.[1]]: target.value}}));
                                   }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6} className="d-flex flex-column">
                        <TextField label={t("Username")} style={{ maxWidth:"400px"}} margin="dense"
                                   variant="filled"
                                   fullWidth={true}
                                   name='username'
                                   InputProps={{
                                       readOnly: examinersModalHelper?.openType === 'PREVIEW',
                                   }}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.username}
                                   required={true}
                                   helperText={validators.username ? "Incorrect username" : null}
                                   error={validators.username}
                                   onInput={({target}) => {
                                       setMSUser(p=>({...p, [target.name]: target.value}));
                                   }}
                        />
                        { examinersModalHelper.openType === "ADD" ?
                            <TextField label={t("Password")} style={{ maxWidth:"400px"}} margin="dense"
                                       variant="filled"
                                       fullWidth={true}
                                       InputProps={{
                                           readOnly: examinersModalHelper?.openType === 'PREVIEW',
                                       }}
                                       name='password'
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       type="password"
                                       required={true}
                                       helperText={validators.password ? "Incorrect password [3-20 characters]" : null}
                                       error={validators.password}
                                       value={MSUser.password}
                                       onInput={({target}) => {
                                           setMSUser(p=>({...p, [target.name]: target.value}));
                                       }}
                            /> : null}
                        <FormControl style={{maxWidth:"400px"}} margin="dense" variant="filled">
                            <InputLabel id="demo-simple-select-label" margin="dense">{t("Status")}</InputLabel>
                            <Select
                                margin="dense"
                                name={['settings','isActive']}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                open={!examinersModalHelper?.openType === 'PREVIEW'}
                                value={MSUser.settings.isActive ? 1 : 0}
                                //input={<Input className={MSUser.settings.isActive ? "text-success" : "text-danger"}/>}
                                onChange={({target}) => {
                                    let opt = target.name;
                                    setMSUser(p=>({...p, [opt?.[0]]: {...p[opt[0]], [opt?.[1]]: !!(target.value)}}));
                                }}
                            >
                                <MenuItem value={1} className="text-success">{t("Active")}</MenuItem>
                                <MenuItem value={0} className="text-danger">{t("inActive")}</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField label={t("Display name")} style={{ maxWidth:"400px"}} margin="dense"
                                   variant="filled"
                                   fullWidth={true}
                                   name={['details','displayName']}
                                   InputProps={{
                                       readOnly: examinersModalHelper?.openType === 'PREVIEW',
                                   }}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.details.displayName}
                                   onInput={({target}) => {
                                       let opt = target.name.split(',');
                                       setMSUser(p=>({...p, [opt?.[0]]: {...p[opt[0]], [opt?.[1]]: target.value}}));
                                   }}
                        />
                        <TextField label={t("Phone")} style={{maxWidth:"400px"}} margin="dense"
                                   variant="filled"
                                   fullWidth={true}
                                   InputProps={{
                                       readOnly: examinersModalHelper?.openType === 'PREVIEW',
                                   }}
                                   name={['details','phone']}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.details.phone}
                                   onInput={({target}) => {
                                       let opt = target.name.split(',');
                                       setMSUser(p=>({...p, [opt?.[0]]: {...p[opt[0]], [opt?.[1]]: target.value}}));
                                   }}
                        />
                        <TextField label={t("Build nr / flat")} style={{maxWidth: '400px'}} margin="dense"
                                   variant="filled"
                                   fullWidth={true}
                                   InputProps={{
                                       readOnly: examinersModalHelper?.openType === 'PREVIEW',
                                   }}
                                   name={['details','buildNr']}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.details.buildNr}
                                   onInput={({target}) => {
                                       let opt = target.name.split(',');
                                       setMSUser(p=>({...p, [opt?.[0]]: {...p[opt[0]], [opt?.[1]]: target.value}}));
                                   }}
                        />
                        <KeyboardDatePicker
                            inputVariant="filled"
                            style={{maxWidth:'400px'}}
                            margin="dense"
                            id="date-picker-dialog"
                            label={t("Date of birth")}
                            name={['details','dateOfBirth']}
                            format="DD.MM.yyyy"
                            maxDate={(examinersModalHelper?.openType === 'ADD') && new Date(now()).toISOString().split("T")[0]}
                            maxDateMessage={"this date is past"}
                            InputProps={{
                                readOnly: examinersModalHelper?.openType === 'PREVIEW',
                            }}
                            disabled={examinersModalHelper?.openType === 'PREVIEW'}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={ MSUser.details?.dateOfBirth ? new Date(MSUser.details.dateOfBirth).toISOString() : null}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            onChange={(date) => {
                                if(date && date._isValid){
                                    let opt = ['details','dateOfBirth'];
                                    setMSUser(p=>({...p, [opt?.[0]]: {...p[opt[0]], [opt?.[1]]: new Date(date).toISOString()}}));
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions className="d-flex justify-content-end ml-3 mt-3 mr-3">
                <Grid container>
                    <Grid item xs={6}>
                        <Button variant="contained" size="small" color="secondary" onClick={() => {
                            F_showToastMessage(t("No change"),);
                            setExaminersModalHelper({isOpen: false, examinerId: undefined, openType: 'ADD'});
                        }}>
                            {t("Dismiss")}
                        </Button>
                    </Grid>
                    <Grid item xs={6} className="d-flex justify-content-end">
                        {(examinersModalHelper.openType !== "ADD") && (examinersModalHelper.openType !== "PREVIEW")   ?
                            <Button variant="contained" size="small" color="secondary"
                                    onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                                <small>{t("Remove user from this company")}</small>
                            </Button> : null}
                        {(examinersModalHelper.openType !== 'PREVIEW') && (
                            <Button onClick={saveChanges} variant="contained" color="primary" className="ml-5">
                                <small>{t("Create")}</small>
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </DialogActions>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing user")}
                                actionModalMessage={t("Are you sure you want to remove user? The action is not reversible!")}
            />
        </Dialog>
    );
};