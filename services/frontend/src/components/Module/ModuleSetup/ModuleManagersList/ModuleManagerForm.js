import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import ModuleService from "services/module.service"
import userService from "services/user.service";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import {CardHeader, IconButton} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {useTranslation} from "react-i18next";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import {KeyboardDatePicker} from "@material-ui/pickers";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Typography from "@material-ui/core/Typography";
import AuthService from "services/auth.service";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";


const useStyles = makeStyles(theme=>({}))

export default function ModuleManagerForm(){
    const { t } = useTranslation();
    const {F_showToastMessage, F_getHelper, F_handleSetShowLoader} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const { uId } = useParams();
    const [moduleManager, setModuleManager] =useState({});
    const [visiblePassword,setVisiblePassword] = useState(false);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
    const [validators, setValidators] = useState({email: false, confirmPassword: false, username: false, name: false, surname: false, emailTaken: false, usernameTaken: false});

    useEffect(()=>{
        if(actionModal.returnedValue){
            removeUser();
        }
    },[actionModal.returnedValue])

    useEffect(()=>{
        setValidators(()=>({email: false, confirmPassword: false, username: false, name: false, surname: false, emailTaken: false, usernameTaken: false}));
        F_handleSetShowLoader(true)
        if(uId === "new"){
            setModuleManager({
                password: "",
                confirmPassword: "",
                isActive: true,
                username: "",
                email: "",
                name: "",
                surname: "",
                displayName: "",
                phone: "",
                street: "",
                buildNr: "",
                postcode: "",
                city: "",
                country: "",
                dateOfBirth: null,
                description: "",
            })
            F_handleSetShowLoader(false)
        }else{
            userService.read(uId).then(u=>{
                let usr = u.data;
                console.log(usr)
                F_handleSetShowLoader(false)
                return setModuleManager({
                    _id: usr._id,
                    password: "",
                    username: usr.username,
                    email: usr.email,
                    isActive: usr.settings.isActive,
                    name: usr.name,
                    surname: usr.surname,
                    displayName: usr.details.displayName,
                    phone: usr.details.phone,
                    street: usr.details.street,
                    buildNr: usr.details.buildNr,
                    postcode: usr.details.postcode,
                    city: usr.details.city,
                    country: usr.details.country,
                    subinterests: usr.details.subinterests,
                    dateOfBirth: usr.details.dateOfBirth?new Date(usr.details.dateOfBirth).toISOString(): null,
                    description: usr.details.description,
                })
            }).catch(error=>console.error(error))
        }
    },[])

    async function saveChanges(){
        ///console.log("ddd",validators);
        await setValidators(()=>({email: false, confirmPassword: false, username: false, name: false, surname: false, emailTaken: false, usernameTaken: false}));
        if(await validateFields()){
            if(uId === "new"){
                ModuleService.addNewModuleManger(moduleManager, manageScopeIds.subscriptionId).then(res=>{
                    //display res.message in toast
                    console.log(res);
                    F_showToastMessage(t("Data was created"),"success");
                    navigate("/modules/managers")
                }).catch(error=>{
                    const re1 = /username/i;
                    const re2 = /e-mail/i;
                    if(re1.test(error?.response?.data?.message)){
                        F_showToastMessage(`${t('Username is already taken, please choose another one or write correct characters')}`,"error");
                        setValidators(p=>({...p, username: true}))
                    }
                    if(re2.test(error?.response?.data?.message)){
                        F_showToastMessage(`${t('E-mail is already taken, please choose another one')}`,"error");
                        setValidators(p=>({...p, email: true}))
                    }
                })
            }else{
                ModuleService.updateModuleManger(moduleManager).then(res=>{
                    console.log(res)
                    F_showToastMessage(t("Data was updated"),"success");
                    navigate("/modules/managers")
                }).catch(error=>{
                    const re1 = /username/i;
                    const re2 = /e-mail/i;
                    if(re1.test(error?.response?.data?.message)){
                        F_showToastMessage(`${t('Username is already taken, please choose another one or write correct characters')}`,"error");
                        setValidators(p=>({...p, username: true}))
                    }
                    if(re2.test(error?.response?.data?.message)){
                        F_showToastMessage(`${t('E-mail is already taken, please choose another one')}`,"error");
                        setValidators(p=>({...p, email: true}))
                    }
                })
            }
        }else{
            F_showToastMessage("Correct wrong fields then save","warning");
        }
    }

    async function validateFields(){
        let isValidate = true;
        // email
        // username
        // password
        // name
        // surname




        let {data:{exists}} = await AuthService.isEmailTaken(moduleManager.email)
        if(uId === "new" && exists){
            setValidators(p=>({...p,emailTaken: true, email: false}));
            isValidate = false;
        } else {
            setValidators(p=>({...p,email: false, emailTaken: false}));
        }


        if(moduleManager.username.length < 3 || moduleManager.username.length > 20){
            setValidators(p=>({...p,username: true}));
            isValidate = false;
        }else{
            let {data:{exists}} = await AuthService.isUsernameTaken(moduleManager.username)
            if(uId === "new" && exists){
                setValidators(p=>({...p,usernameTaken: true, username: false}));
                isValidate = false;
            } else {
                setValidators(p=>({...p,username: false, usernameTaken: false}));
            }
            //isValidate = true;
        }

        if(moduleManager.name.length < 3 || moduleManager.name.length > 20){
            setValidators(p=>({...p,name: true}));
            isValidate = false;
        }else{
            setValidators(p=>({...p,name: false}));
            //isValidate = true;
        }

        if(moduleManager.surname.length < 3 || moduleManager.surname.length > 20){
            setValidators(p=>({...p,surname: true}));
            isValidate = false;
        }else{
            setValidators(p=>({...p,surname: false}));
            //isValidate = true;
        }

        if(moduleManager.email.length < 3 || moduleManager.email.length > 50){
            setValidators(p=>({...p,email: true}));
            isValidate = false;
        }else{
            setValidators(p=>({...p,email: false}));
            //isValidate = true;
        }

        if(uId === "new"){
            if(moduleManager.password.length < 3 || moduleManager.password.length > 20){
                setValidators(p=>({...p,password: true}));
                isValidate = false;
            }else{
                setValidators(p=>({...p,password: false}));
                //isValidate = true;
            }

            if(moduleManager.password !== moduleManager.confirmPassword){
                setValidators(p=>({...p,confirmPassword: true}));
                isValidate = false;
            }else{
                setValidators(p=>({...p,confirmPassword: false}));
                //isValidate = true;
            }
        }

        return isValidate;
    }

    function removeUser(){
        ModuleService.removeModuleManger(moduleManager._id).then(res=>{
                console.log(res);
            F_showToastMessage(t("Data was removed"),"success")
                navigate("/modules/managers")
            }
        ).catch(error=>console.error(error))
    }

    return(
        <Card style={{borderRadius:"0px"}} className="p-2 d-flex flex-column ">
            {/*<CardHeader title={` ${uId === "new" ? `${t("Add new")} :` : `${t("Edit")} :`} ${moduleManager.username || moduleManager.name || "-"}`}/>*/}
            <CardHeader title={(
                <Typography variant="h3" component="h3" className="text-left" >
                    { moduleManager?.name ? `${moduleManager?.name} ${moduleManager?.surname} `: t("Module Manager")}

                </Typography>
            )}  />

            <CardContent  >
                <Grid container>
                    <Grid item xs={6} className="d-flex flex-column">
                        <TextField label={t("Name")} style={{ width:"50%"}} margin="dense"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   helperText={validators.name ? t("Incorrect name [3-20 characters]") : null}
                                   error={validators.name}
                                   required={true}
                                   value={moduleManager.name}
                                   onInput={(e) => {
                                       setModuleManager(p=>{
                                           let val = Object.assign({},p);
                                           val.name = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Surname")} style={{ width:"50%"}} margin="dense"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   required={true}
                                   helperText={validators.surname ? t("Incorrect surname [3-20 characters]") : null}
                                   error={validators.surname}
                                   value={moduleManager.surname}
                                   onInput={(e) => {
                                       setModuleManager(p=>{
                                           let val = Object.assign({},p);
                                           val.surname = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("E-mail")} style={{ width:"50%"}} margin="dense"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   required={true}
                                   helperText={validators.email ? "Incorrect email" : validators.emailTaken? t("Email is already taken") : null}
                                   error={validators.email||validators.emailTaken}
                                   value={moduleManager.email}
                                   onInput={(e) => {
                                       setModuleManager(p=>{
                                           let val = Object.assign({},p);
                                           val.email = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Street")} style={{ width:"50%"}} margin="dense"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={moduleManager.street}
                                   onInput={(e) => {
                                       setModuleManager(p=>{
                                           let val = Object.assign({},p);
                                           val.street = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Postcode")} style={{ width:"50%"}} margin="dense"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={moduleManager.postcode}
                                   onInput={(e) => {
                                       setModuleManager(p=>{
                                           let val = Object.assign({},p);
                                           val.postcode = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Country")} style={{ width:"50%"}} margin="dense"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={moduleManager.country}
                                   onInput={(e) => {
                                       setModuleManager(p=>{
                                           let val = Object.assign({},p);
                                           val.country = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <FormControl style={{width:"50%"}} margin="dense" variant="filled">
                            <InputLabel id="demo-simple-select-label">{t("Status")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={moduleManager.isActive ? 1 : 0}
                                // input={<Input className={moduleManager.isActive ? "text-success" : "text-danger"}/>}
                                onChange={(e) => {
                                    setModuleManager(p=>{
                                        let val = Object.assign({},p);
                                        val.isActive = (e.target.value) ? true : false;
                                        return val;
                                    })
                                }}
                            >
                                <MenuItem value={1} className="text-success">{t("Active")}</MenuItem>
                                <MenuItem value={0} className="text-danger">{t("inActive")}</MenuItem>
                            </Select>
                        </FormControl>
                        {/* <TextField label={t("Description (max 100 words)")}
                                   variant="filled"
                                   style={{width:"75%"}}
                                   id="outlined-multiline-static"
                                   multiline
                                   margin="dense"
                                   rowsMax={2}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={moduleManager.description}
                                   onInput={(e) => {
                                       setModuleManager(p=>{
                                           let val = Object.assign({},p);
                                           val.description = e.target.value;
                                           return val;
                                       })
                                   }}
                        /> */}
                    </Grid>
                    <Grid item xs={6} className="d-flex flex-column">
                        { uId === "new" ?
                            (
                                <>
                                <TextField label={t("Password")} style={{ width:"50%"}} margin="dense"
                                           variant="filled"
                                           InputLabelProps={{
                                               shrink: true,
                                           }}
                                           type={visiblePassword ? 'text' : 'password'}
                                           value={moduleManager.password}
                                           required={true}
                                           helperText={validators.password ? "Incorrect password [3-20 characters]" : null}
                                           error={validators.password}
                                           InputProps={{
                                               endAdornment:
                                                   <IconButton
                                                       aria-label="toggle password visibility"
                                                       onClick={()=>{setVisiblePassword(p=>!p)}}
                                                       edge="end"
                                                   >
                                                       {visiblePassword ? <Visibility /> : <VisibilityOff />}
                                                   </IconButton>,
                                           }}
                                           onBlur={(e) => {
                                               if(moduleManager.password.length >= 8 &&
                                                   moduleManager.password.match(/[a-z]/i) &&
                                                   moduleManager.password.match(/[A-Z]/i) &&
                                                   moduleManager.password.match(/[0-9]/) &&
                                                   moduleManager.password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)){
                                                   setValidators(p=>({...p, password: false}))
                                               } else setValidators(p=>({...p, password: true}))
                                           }}
                                           onInput={({target:{value}}) => {
                                               setModuleManager(p=>({...p, password: value}))
                                           }}
                                />
                                    <TextField label={t("Confirm password")} style={{ width:"50%"}} margin="dense"
                                               variant="filled"
                                               InputLabelProps={{
                                                   shrink: true,
                                               }}
                                               type={visiblePassword ? 'text' : 'password'}
                                               value={moduleManager.confirmPassword}
                                               required={true}
                                               helperText={validators.confirmPassword ? "Passwords are different" : null}
                                               error={validators.confirmPassword}
                                               InputProps={{
                                                   endAdornment:
                                                       <IconButton
                                                           aria-label="toggle password visibility"
                                                           onClick={()=>{setVisiblePassword(p=>!p)}}
                                                           edge="end"
                                                       >
                                                           {visiblePassword ? <Visibility /> : <VisibilityOff />}
                                                       </IconButton>,
                                               }}
                                               onInput={({target:{value}}) => {
                                                   setModuleManager(p=>({...p, confirmPassword: value}))
                                               }}
                                    />
                                </>
                            )
                             : null}
                        <TextField label={t("Username")} style={{ width:"50%"}} margin="dense"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   required={true}
                                   helperText={validators.username ? "Incorrect username" : validators.usernameTaken? t("Username is already taken") : null}
                                   error={validators.username||validators.usernameTaken}
                                   value={moduleManager.username}
                                   onInput={(e) => {
                                       setModuleManager(p=>{
                                           let val = Object.assign({},p);
                                           val.username = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Phone")} style={{ width:"50%"}} margin="dense"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={moduleManager.phone}
                                   onInput={(e) => {
                                       setModuleManager(p=>{
                                           let val = Object.assign({},p);
                                           val.phone = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Build nr / flat")} style={{ width:"50%"}} margin="dense"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={moduleManager.buildNr}
                                   onInput={(e) => {
                                       setModuleManager(p=>{
                                           let val = Object.assign({},p);
                                           val.buildNr = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("City")} style={{ width:"50%"}} margin="dense"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={moduleManager.city}
                                   onInput={(e) => {
                                       setModuleManager(p=>{
                                           let val = Object.assign({},p);
                                           val.city = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        {/*<TextField label={t("Date of birth")} style={{width:"50%"}} margin="dense"*/}
                        {/*           type="date"*/}
                        {/*           InputLabelProps={{*/}
                        {/*               shrink: true,*/}
                        {/*           }}*/}
                        {/*           value={moduleManager.dateOfBirth}*/}
                        {/*           onChange={(e) => {*/}
                        {/*               setModuleManager(p=>{*/}
                        {/*                   let val = Object.assign({},p);*/}
                        {/*                   val.dateOfBirth = e.target.value;*/}
                        {/*                   return val;*/}
                        {/*               })*/}
                        {/*           }}*/}
                        {/*/>*/}
                        <KeyboardDatePicker
                            inputVariant="filled"
                            style={{ width:"50%"}}
                            margin="dense"
                            id="date-picker-dialog"
                            label={t("Date of birth")}
                            format="DD.MM.yyyy"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={moduleManager.dateOfBirth}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            onChange={(date) => {
                                if(date && date._isValid){
                                    setModuleManager(p=>({...p,dateOfBirth: new Date(date).toISOString()}))
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea className=" mt-3 mb-3">
            <CardActions className="d-flex justify-content-between align-items-center" >
                <Grid container>
                    <Grid item xs={6}>
                        <Button classes={{root: classes.root}} variant="contained" size="small" color="secondary" onClick={() => {
                            F_showToastMessage(t("No change"),)
                            navigate("/modules/managers")
                        }}>
                            {t("Back")}
                        </Button>
                    </Grid>
                    <Grid item xs={6} className="p-0 d-flex justify-content-end">
                        {uId !== "new" ?
                            <Button classes={{root: classes.root}} variant="contained" size="small" color="inherit"
                                    onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                                {t("Remove")}
                            </Button> : null}
                        <Button onClick={saveChanges} classes={{root: classes.root}} size="small" variant="contained" color="primary" className="ml-5">
                            {t("Save")}
                        </Button>
                    </Grid>
                </Grid>
            </CardActions>
            </CardActionArea>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing Module Manager")}
                                actionModalMessage={t("Are you sure you want to remove your Module Manager? The action is not reversible!")}
            />
        </Card>
    )
}