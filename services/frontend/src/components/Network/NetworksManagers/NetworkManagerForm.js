import React, {useEffect, useState} from "react"
import TextField from "@material-ui/core/TextField"
import {useNavigate, useParams} from "react-router-dom";
import SubscriptionService from "services/subscription.service"
import userService from "services/user.service";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {useTranslation} from "react-i18next";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import {KeyboardDatePicker} from "@material-ui/pickers";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles(theme=>({}))

export default function NetworkManagerForm({visiblePassword, setVisiblePassword}){
    const { t } = useTranslation();
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const { F_showToastMessage, F_getErrorMessage, F_getHelper, F_handleSetShowLoader } = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const { uId } = useParams();
    const [subscriptionUser, setSubscriptionUser] =useState({});
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});

    const [validators, setValidators] = useState({email: false, username: false, name: false, surname: false, });

    useEffect(()=>{
        if(actionModal.returnedValue){
            removeUser(uId);
        }
    },[actionModal.returnedValue])

    useEffect(()=>{
        F_handleSetShowLoader(true)
        if(uId === "new"){
            setSubscriptionUser({
                name: "",
                surname: "",
                password: "",
                isActive: true,
                email: "",
                username: "",
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
            userService.read(uId).then(res=>{
                console.log(res.data)
                let usr = res.data;
                    F_handleSetShowLoader(false)
                return setSubscriptionUser({
                    _id: usr._id,
                    isActive: usr.isActive,
                    password: "",
                    username: usr.username,
                    email: usr.email,
                    name: usr.name,
                    surname: usr.surname,
                    phone: usr.details.phone,
                    street: usr.details.street,
                    buildNr: usr.details.buildNr,
                    postcode: usr.details.postcode,
                    city: usr.details.city,
                    country: usr.details.country,
                    dateOfBirth: usr.details.dateOfBirth,
                    description: usr.details.description,
                    createdAt: usr.details.createdAt,
                })
            }
            ).catch(error=>console.error(error))
        }
            },[])

    function saveChanges(){
        if(validateFields()){
            if(uId === "new"){
                SubscriptionService.addSubscriptionsOwner(subscriptionUser, manageScopeIds.ecosystemId).then(res=>{
                    if(res.status === 201){
                        F_showToastMessage(t("Data was created"),"success");
                        navigate("/networks/owners")
                    }

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
                SubscriptionService.updateSubscriptionsOwner(uId, subscriptionUser).then(res=>{
                    //display res.message in toast
                    F_showToastMessage(t("Data was updated"),"success");
                    navigate("/networks/owners")
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
            F_showToastMessage(t("Correct wrong fields then save"),"warning");
        }
    }

    function removeUser(uuId){
        SubscriptionService.removeSubscriptionsOwner(uuId).then(res=>{
            //display res in toast
            console.log(res);
                F_showToastMessage(t("Data was removed"),"success")
            navigate("/networks/owners")
        }
        ).catch(error=>console.error(error))
    }

    function validateFields(){
        let isValidate = true;

        // if(subscriptionUser.email.length < 3 || subscriptionUser.email.length > 20){
        //     setValidators(p=>({...p,email: true}));
        //     isValidate = false;
        // }else{
        //     setValidators(p=>({...p,email: false}));
        //     //isValidate = true;
        // }

        if(subscriptionUser.username.length < 3 || subscriptionUser.username.length > 20){
            setValidators(p=>({...p,username: true}));
            isValidate = false;
        }else{
            setValidators(p=>({...p,username: false}));
            //isValidate = true;
        }

        if(subscriptionUser.name.length < 3 || subscriptionUser.name.length > 20){
            setValidators(p=>({...p,name: true}));
            isValidate = false;
        }else{
            setValidators(p=>({...p,name: false}));
            //isValidate = true;
        }

        if(subscriptionUser.surname.length < 3 || subscriptionUser.surname.length > 20){
            setValidators(p=>({...p,surname: true}));
            isValidate = false;
        }else{
            setValidators(p=>({...p,surname: false}));
            //isValidate = true;
        }

        if(uId ==="new"){
            if(subscriptionUser.password.length < 3 || subscriptionUser.password.length > 20){
                setValidators(p=>({...p,password: true}));
                isValidate = false;
            }else{
                setValidators(p=>({...p,password: false}));
                //isValidate = true;
            }
        }
        return isValidate;
    }

    return(
        <Card elevation={17} className="d-flex flex-column m-0 p-2">
            {/*<CardHeader title={` ${uId === "new" ? `${t("Add new")}: ` : `${t("Edit")}: `} ${subscriptionUser.username || subscriptionUser.name || "-"}`}/>*/}
            <CardHeader title={(
                <Typography variant="h3" component="h3" className="text-left" style={{fontSize:"32px" }}>
                    { subscriptionUser?.name ? `${subscriptionUser?.name} ${subscriptionUser?.surname} `: t("Network Manager")}
                </Typography>
            )} 
            />
            <CardContent >
                <Grid container >
                    <Grid item xs={6} className="d-flex flex-column">
                        <TextField label={t("Name")} style={{ width:"50%"}} margin="dense"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={subscriptionUser.name}
                                   helperText={validators.name ? t("Incorrect name [3-20 characters]") : null}
                                   error={validators.name}
                                   required={true}
                                   onInput={(e) => {
                                       setSubscriptionUser(p=>{
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
                                   value={subscriptionUser.surname}
                                   helperText={validators.surname ? t("Incorrect surname [3-20 characters]") : null}
                                   error={validators.surname}
                                   required={true}
                                   onInput={(e) => {
                                       setSubscriptionUser(p=>{
                                           let val = Object.assign({},p);
                                           val.surname = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("E-mail")} style={{ width:"50%"}} margin="dense"
                                   variant="filled"
                            //    required={true}
                                   helperText={validators.email ? t("Incorrect email") : null}
                                   error={validators.email}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={subscriptionUser.email}
                                   onInput={(e) => {
                                       setSubscriptionUser(p=>{
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
                                   value={subscriptionUser.street}
                                   onInput={(e) => {
                                       setSubscriptionUser(p=>{
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
                                   value={subscriptionUser.postcode}
                                   onInput={(e) => {
                                       setSubscriptionUser(p=>{
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
                                   value={subscriptionUser.country}
                                   onInput={(e) => {
                                       setSubscriptionUser(p=>{
                                           let val = Object.assign({},p);
                                           val.country = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Description (max 100 words)")}  margin="dense"
                                   variant="filled"
                                   style={{width:"70%"}}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   multiline
                                   value={subscriptionUser.description}
                                   onInput={(e) => {
                                       setSubscriptionUser(p=>{
                                           let val = Object.assign({},p);
                                           val.description = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                    </Grid>
                    <Grid item xs={6} className="d-flex flex-column">
                        { uId === "new" ?

                            <TextField label={t("Password")} style={{ width:"50%"}} margin="dense"
                                       variant="filled"
                                       autoComplete="new-password"
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       helperText={validators.password ? "Incorrect password [3-20 characters]" : null}
                                       error={validators.password}
                                       type={isPasswordVisible ? 'text' : 'password'}
                                       required={true}
                                       value={subscriptionUser.password}
                                       onInput={(e) => {
                                           setSubscriptionUser(p=>{
                                               let val = Object.assign({},p);
                                               val.password = e.target.value;
                                               return val;
                                           })
                                       }}

                                       InputProps={{
                                        endAdornment:
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={()=>{setIsPasswordVisible(p=>!p)}}
                                                edge="end"
                                            >
                                                {isPasswordVisible ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>,
                                    }}
                            /> : null}
                        <TextField label={t("Username")} style={{ width:"50%"}} margin="dense"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   required={true}
                                   helperText={validators.username ? t("Incorrect username") : null}
                                   error={validators.username}
                                   value={subscriptionUser.username}
                                   onInput={(e) => {
                                       setSubscriptionUser(p=>{
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
                                   value={subscriptionUser.phone}
                                   onInput={(e) => {
                                       setSubscriptionUser(p=>{
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
                                   value={subscriptionUser.buildNr}
                                   onInput={(e) => {
                                       setSubscriptionUser(p=>{
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
                                   value={subscriptionUser.city}
                                   onInput={(e) => {
                                       setSubscriptionUser(p=>{
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
                        {/*           value={subscriptionUser.dateOfBirth}*/}
                        {/*           onChange={(e) => {*/}
                        {/*               setSubscriptionUser(p=>{*/}
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
                            value={subscriptionUser.dateOfBirth}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            onChange={(date) => {
                                if(date && date._isValid){
                                    setSubscriptionUser(p=>({...p,dateOfBirth: new Date(date).toISOString()}))
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
            <CardActions className="d-flex justify-content-between align-items-center " >
                <Grid container className="d-flex justify-content-between align-items-center ">
                        <Button  classes={{root: classes.root}} variant="contained" size="small" color="secondary" onClick={() => {
                            F_showToastMessage(t("No change"),)
                            navigate("/networks/owners")
                        }}>
                            {t("Back")}
                        </Button>
                        {uId !== "new" ?
                            <Button classes={{root: classes.root}} variant="contained" size="small" color="inherit"
                                    onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                                {t("Remove")}
                            </Button> : null}
                        <Button onClick={saveChanges} size="small" variant="contained" color="primary" className="ml-5">
                            {t("Save")}
                        </Button>
                </Grid>
            </CardActions>
            </CardActionArea>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing Network Manager")}
                                actionModalMessage={t("Are you sure you want to remove your Network Manager? The action is not reversible!")}
            />
        </Card>
    )
}