import React, {useEffect, useState} from "react";
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import {useNavigate, useParams} from "react-router-dom";
import EcosystemService from "../../../services/ecosystem.service";
import { makeStyles} from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import { CardHeader } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {useTranslation} from "react-i18next";
import ConfirmActionModal from "../../common/ConfirmActionModal";
import {KeyboardDatePicker} from "@material-ui/pickers";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import {useMainContext} from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}))

export default function EcosystemManagerForm(){
    const { t, i18n, translationsLoaded } = useTranslation();
    const { F_showToastMessage, F_getErrorMessage, F_handleSetShowLoader } = useMainContext();
    const classes = useStyles();
    const navigate = useNavigate();
    const { uId } = useParams();
    const [ecosystemManager, setEcosystemManager] =useState({});
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});

    useEffect(()=>{
        if(actionModal.returnedValue){
            removeManager();
        }
    },[actionModal.returnedValue]);

    useEffect(()=>{
         loadEcosystemManagerFromDatabase().then().catch();
    },[])

    async function loadEcosystemManagerFromDatabase(){
        F_handleSetShowLoader(true)
        if(uId !== "new"){
            EcosystemService.getManager(uId)
            .then(res=>{
                setEcosystemManager({
                    _id: res.data._id,
                    isActive: res.data.settings.isActive,
                    password: "",
                    username: res.data.username,
                    createdAt: res.data.createdAt,
                    name: res.data.name,
                    surname: res.data.surname,
                    email: res.data.email,
                    phone: res.data.details.phone,
                    street: res.data.details.street,
                    buildNr: res.data.details.buildNr,
                    postcode: res.data.details.postcode,
                    city: res.data.details.city,
                    country: res.data.details.country,
                    dateOfBirth: (new Date(res.data.details.dateOfBirth).toLocaleDateString('zh-Hans-CN', { day: '2-digit', month: '2-digit', year: 'numeric' })).replace(/\//g, "-"),
                    description: res.data.details.description,

                })
                F_handleSetShowLoader(false)
                })
            .catch(errors=>console.error(errors));
        }else{
            setEcosystemManager({
                name: "",
                surname: "",
                password: "Testing123!",
                isActive: true,
                email: "",
                username: "",
                phone: "",
                street: "",
                buildNr: "",
                postcode: "",
                city: "",
                country: "",
                dateOfBirth: "",
                description: "",
            })
            F_handleSetShowLoader(false);
        }
    }

    function removeManager(){
        EcosystemService.removeManager(ecosystemManager._id).then(res=>{
                //display res in toast
                console.log(res);
            F_showToastMessage(t("Ecosystem manager was removed"),"success")
                navigate("/ecosystems/managers")
            }
        ).catch(error=>console.error(error))
    }

    function saveChanges(){
        if(uId === "new"){
            EcosystemService.addManager(ecosystemManager).then(res=>{
                //display res.message in toast
                console.log(res);
                F_showToastMessage(t("Ecosystem manager was added successfully"),"success");
                navigate("/ecosystems/managers")
            }).catch(error=>console.error(error))
        }else{
            EcosystemService.updateManager(ecosystemManager).then(res=>{
                //display res.message in toast
                console.log(res)
                F_showToastMessage(t("Ecosystem manager was changed successfully"),"success");
                navigate("/ecosystems/managers")
            }).catch(error=>console.error(error));
        }
    }

    return(
        <Card className="p-0 d-flex flex-column m-0">
            {/*<CardHeader title={` ${uId === "new" ? `${t("Add new")}: ` : `${t("Edit")}: `} ${ecosystemManager.username || ecosystemManager.name || "-"}`}/>*/}
            <CardHeader title={(
                <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                    {` ${ecosystemManager?.username || t("Manager username")}`}
                </Typography>
            )} avatar={<Chip label={uId==="new" ? t("Add"):t("Edit")} color="primary" />}/>
            <CardContent>
                <Grid container>
                    <Grid item xs={6} className="d-flex flex-column">
                        <TextField label={t("Name")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   required={true}
                                   value={ecosystemManager.name}
                                   onInput={(e) => {
                                       setEcosystemManager(p=>{
                                           let val = Object.assign({},p);
                                           val.name = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Surname")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   required={true}
                                   value={ecosystemManager.surname}
                                   onInput={(e) => {
                                       setEcosystemManager(p=>{
                                           let val = Object.assign({},p);
                                           val.surname = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Street")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={ecosystemManager.street}
                                   onInput={(e) => {
                                       setEcosystemManager(p=>{
                                           let val = Object.assign({},p);
                                           val.street = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Postcode")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={ecosystemManager.postcode}
                                   onInput={(e) => {
                                       setEcosystemManager(p=>{
                                           let val = Object.assign({},p);
                                           val.postcode = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Country")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={ecosystemManager.country}
                                   onInput={(e) => {
                                       setEcosystemManager(p=>{
                                           let val = Object.assign({},p);
                                           val.country = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <FormControl style={{width:"50%"}} margin="normal" variant="filled">
                            <InputLabel id="demo-simple-select-label">{t("Status")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-filled-label"
                                id="demo-simple-select-filled"
                                value={ecosystemManager.isActive ? 1 : 0}
                                //input={<Input className={ecosystemManager.isActive ? "text-success" : "text-danger"}/>}
                                onChange={(e) => {
                                    setEcosystemManager(p=>{
                                        let val = Object.assign({},p);
                                        val.isActive = (e.target.value == 1) ? true : false;
                                        return val;
                                    })
                                }}
                            >
                                <MenuItem value={1} className="text-success">{t("Active")}</MenuItem>
                                <MenuItem value={0} className="text-danger">{t("inActive")}</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField label={t("Description (max 100 words)")}
                                   variant="filled"
                                   style={{width:"75%"}}
                                   id="outlined-multiline-static"
                                   multiline
                                   margin="normal"
                                   maxLength="5"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={ecosystemManager.description}
                                   onInput={(e) => {
                                       setEcosystemManager(p=>{
                                           let val = Object.assign({},p);
                                           val.description = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                    </Grid>
                    <Grid item xs={6} className="d-flex flex-column">
                        { uId === "new" ?
                            <TextField label={t("Password")} style={{ width:"50%"}} margin="normal"
                                       variant="filled"
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       type="password"
                                       value={ecosystemManager.password}
                                       onInput={(e) => {
                                           setEcosystemManager(p=>{
                                               let val = Object.assign({},p);
                                               val.password = e.target.value;
                                               return val;
                                           })
                                       }}
                            /> : null}
                        <TextField label={t("E-mail")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={ecosystemManager.email}
                                   onInput={(e) => {
                                       setEcosystemManager(p=>{
                                           let val = Object.assign({},p);
                                           val.email = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Username")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   required={true}
                                   value={ecosystemManager.username}
                                   onInput={(e) => {
                                       setEcosystemManager(p=>{
                                           let val = Object.assign({},p);
                                           val.username = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Phone")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={ecosystemManager.phone}
                                   onInput={(e) => {
                                       setEcosystemManager(p=>{
                                           let val = Object.assign({},p);
                                           val.phone = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Build nr / flat")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={ecosystemManager.buildNr}
                                   onInput={(e) => {
                                       setEcosystemManager(p=>{
                                           let val = Object.assign({},p);
                                           val.buildNr = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("City")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={ecosystemManager.city}
                                   onInput={(e) => {
                                       setEcosystemManager(p=>{
                                           let val = Object.assign({},p);
                                           val.city = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        {/*<TextField label={t("Date of birth")} style={{width:"50%"}} margin="normal"*/}
                        {/*           type="date"*/}
                        {/*           InputLabelProps={{*/}
                        {/*               shrink: true,*/}
                        {/*           }}*/}
                        {/*           value={ecosystemManager.dateOfBirth}*/}
                        {/*           onChange={(e) => {*/}
                        {/*               setEcosystemManager(p=>{*/}
                        {/*                   let val = Object.assign({},p);*/}
                        {/*                   val.dateOfBirth = e.target.value;*/}
                        {/*                   return val;*/}
                        {/*               })*/}
                        {/*           }}*/}
                        {/*/>*/}
                        <KeyboardDatePicker
                            inputVariant="filled"
                            style={{ width:"50%"}}
                            margin="normal"
                            id="date-picker-dialog"
                            label={t("Date of birth")}
                            format="DD.MM.yyyy"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={ecosystemManager.dateOfBirth}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            onChange={(date) => {
                                if(date && date._isValid){
                                    setEcosystemManager(p=>({...p,dateOfBirth: new Date(date).toISOString()}))
                                }
                            }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
            <CardActions className="d-flex justify-content-between align-items-center" >
                <Grid container>
                    <Grid item xs={6}>
                        <Button classes={{root: classes.root}} variant="contained" size="small" color="secondary" onClick={() => {
                            F_showToastMessage(t("No change"),)
                            navigate("/ecosystems/managers")
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
                                actionModalTitle={t("Removing Ecosystem Manger")}
                                actionModalMessage={t("Are you sure you want to remove your Ecosystem Manager? The action is not reversible!")}
            />
        </Card>
    )
}