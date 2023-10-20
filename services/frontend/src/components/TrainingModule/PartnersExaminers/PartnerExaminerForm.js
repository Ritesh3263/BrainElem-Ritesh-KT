import React, {useEffect, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";
import TextField from "@material-ui/core/TextField"
import {useNavigate, useParams} from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import {CardHeader} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Chip from "@material-ui/core/Chip";
import CompanyService from "services/company.service"
import {useTranslation} from "react-i18next";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import {KeyboardDatePicker} from "@material-ui/pickers";
import {now} from "moment";
import Typography from "@material-ui/core/Typography";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles(theme=>({}));


/** OLd Component to remove => has been replaced with a modal **/

export default function PartnerExaminerForm({currentTab, setCurrentTab, partnerId}){
    const { t } = useTranslation();
    const {F_showToastMessage} = useMainContext();
    const classes = useStyles();
    const navigate = useNavigate();
    const { userId } = useParams();
    // next to know the way to access schema variable/ schema virtual variable
    const [roles, setRoles] = useState(['Examiner']);
    const [openSidebarDrawer, setOpenSidebarDrawer] = useState(false);
    const [validators, setValidators] = useState({email: false, username: false, name: false, surname: false, });
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
    const [students, setStudents] = useState([]);
    const [MSUser, setMSUser] = useState({
        settings:{
            isActive:"",
            role:"",
        },
        details:{},
    });

    useEffect(()=>{
        if(actionModal.returnedValue){
            removeUser();
        }
    },[actionModal.returnedValue]);

    useEffect(()=>{
        if(currentTab.type === "new"){
            setMSUser({
                name: "",
                surname: "",
                username: "",
                email: "",
                password: "",
                settings:{
                    isActive: true,
                    role: "Trainer",//"Examiner",
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
                    dateOfBirth:new Date(now()).toISOString(),
                    description: ""
                }
            })
        }else{
            CompanyService.readPartnerExaminer(currentTab.type).then(res=>{
                if(res.data){
                    setMSUser(res.data)
                    //setRoles(res.data.settings.roles);
                }
            })
        }
    },[]);

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

        if(currentTab.type === "new"){
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


    function saveChanges(){
        if(validateFields()){
            if(currentTab.type === "new"){
                CompanyService.addPartnerExaminer({examiner: MSUser, companyId: partnerId}).then(res=>{
                    F_showToastMessage(t(res.data.message), res.status===200? "success":"warning");
                    setCurrentTab({openTab:0, type:""})
                }).catch(error=>console.error(error))
            }else{
                CompanyService.updatePartnerExaminer(MSUser, partnerId).then(res=>{
                    //display res.message in toast
                    console.log(res)
                    F_showToastMessage(t(res.data.message), res.status===200? "success":"warning");
                    setCurrentTab({openTab:0, type:""})
                }).catch(error=>console.error(error));
            }
        }else{
            F_showToastMessage("Correct wrong fields then save","warning");
        }
    }

    function removeUser(){
        CompanyService.removePartnerExaminer(MSUser._id, partnerId).then(res=>{
                //display res in toast
                console.log(res);
                setCurrentTab({openTab:0, type:""})
            F_showToastMessage(t("Data was removed"),"success")

            }
        ).catch(error=>console.error(error))
    }


    const rolesList = roles.map((role,index)=><MenuItem key={index} value={role}>{"Examiner"??role}</MenuItem>)

    return(
        <Card className="p-0 d-flex flex-column m-0">
            {/*<CardHeader title={` ${currentTab.type === "new" ? t("Add new user:") : t("Edit user:")} ${currentTab.type !== "new" ? MSUser.username: ""} `}/>*/}
            <CardHeader title={(
                <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                    {` ${MSUser?.username || t("Username")}`}
                </Typography>
            )} avatar={<Chip label={currentTab.type==="new" ? t("Add"):t("Edit")} color="primary" />}
            />
            <CardContent>
                <Form as={Row}>
                    <Col md={6} className="d-flex flex-column">

                    </Col>
                </Form>
                <Form as={Row}>
                    <Col md={6} className="d-flex flex-column">
                        <FormControl style={{width:"50%"}} margin="normal" variant="filled">
                            <InputLabel id="demo-simple-select-label">{t("Select user role")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={MSUser.settings.role}
                                renderValue={()=>("Examiner")}
                                //input={<Input/>}
                                onChange={(e) => {
                                    setMSUser(p=>{
                                        let val = Object.assign({},p);
                                        val.settings.role = e.target.value;
                                        return val;
                                    })
                                }}
                            >
                                {rolesList}
                            </Select>
                        </FormControl>
                        <TextField label={t("Name of user")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.name}
                                   required={true}
                                   helperText={validators.name ? "Incorrect name [3-20 characters]" : null}
                                   error={validators.name}
                                   onInput={(e) => {
                                       setMSUser(p=>{
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
                                   value={MSUser.surname}
                                   required={true}
                                   helperText={validators.surname ? "Incorrect surname [3-20 characters]" : null}
                                   error={validators.surname}
                                   onInput={(e) => {
                                       setMSUser(p=>{
                                           let val = Object.assign({},p);
                                           val.surname = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("E-mail")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.email}
                            //    required={true}
                                   helperText={validators.email ? "Incorrect email" : null}
                                   error={validators.email}
                                   onInput={(e) => {
                                       setMSUser(p=>{
                                           let val = Object.assign({},p);
                                           val.email = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Street")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.details.street}
                                   onInput={(e) => {
                                       setMSUser(p=>{
                                           let val = Object.assign({},p);
                                           val.details.street = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Postcode")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.details.postcode}
                                   onInput={(e) => {
                                       setMSUser(p=>{
                                           let val = Object.assign({},p);
                                           val.details.postcode = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Country")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.details.country}
                                   onInput={(e) => {
                                       setMSUser(p=>{
                                           let val = Object.assign({},p);
                                           val.details.country = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Description (max 100 words)")}  margin="normal"
                                   variant="filled"
                                   style={{ width:"80%"}}
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.details.description}
                                   onInput={(e) => {
                                       setMSUser(p=>{
                                           let val = Object.assign({},p);
                                           val.details.description = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                    </Col>
                    <Col md={6} className="d-flex flex-column">
                        <TextField label={t("Username")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.username}
                                   required={true}
                                   helperText={validators.username ? "Incorrect username" : null}
                                   error={validators.username}
                                   onInput={(e) => {
                                       setMSUser(p=>{
                                           let val = Object.assign({},p);
                                           val.username = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        { currentTab.type === "new" ?
                            <TextField label={t("Password")} style={{ width:"50%"}} margin="normal"
                                       variant="filled"
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       type="password"
                                       required={true}
                                       helperText={validators.password ? "Incorrect password [3-20 characters]" : null}
                                       error={validators.password}
                                       value={MSUser.password}
                                       onInput={(e) => {
                                           setMSUser(p=>{
                                               let val = Object.assign({},p);
                                               val.password = e.target.value;
                                               return val;
                                           })
                                       }}
                            /> : null}
                        <FormControl style={{width:"50%"}} as={Row} margin="normal" variant="filled">
                            <InputLabel id="demo-simple-select-label" margin="normal">{t("Status")}</InputLabel>
                            <Select
                                margin="normal"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={MSUser.settings.isActive ? 1 : 0}
                                //input={<Input className={MSUser.settings.isActive ? "text-success" : "text-danger"}/>}
                                onChange={(e) => {
                                    setMSUser(p=>{
                                        let val = Object.assign({},p);
                                        val.settings.isActive = !!(e.target.value);
                                        return val;
                                    })
                                }}
                            >
                                <MenuItem value={1} className="text-success">{t("Active")}</MenuItem>
                                <MenuItem value={0} className="text-danger">{t("inActive")}</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField label={t("Display name")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.details.displayName}
                                   onInput={(e) => {
                                       setMSUser(p=>{
                                           let val = Object.assign({},p);
                                           val.details.displayName = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Phone")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.details.phone}
                                   onInput={(e) => {
                                       setMSUser(p=>{
                                           let val = Object.assign({},p);
                                           val.details.phone = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("Build nr / flat")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.details.buildNr}
                                   onInput={(e) => {
                                       setMSUser(p=>{
                                           let val = Object.assign({},p);
                                           val.details.buildNr = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        <TextField label={t("City")} style={{ width:"50%"}} margin="normal"
                                   variant="filled"
                                   InputLabelProps={{
                                       shrink: true,
                                   }}
                                   value={MSUser.details.city}
                                   onInput={(e) => {
                                       setMSUser(p=>{
                                           let val = Object.assign({},p);
                                           val.details.city = e.target.value;
                                           return val;
                                       })
                                   }}
                        />
                        {/*<TextField label={t("Date of birth")} style={{width:"50%"}} margin="normal"*/}
                        {/*           type="date"*/}
                        {/*           InputLabelProps={{*/}
                        {/*               shrink: true,*/}
                        {/*           }}*/}
                        {/*           value={ MSUser.details.dateOfBirth ? new Date(MSUser.details.dateOfBirth).toISOString().split('T')[0] : ""}*/}
                        {/*           onChange={(e) => {*/}
                        {/*               setMSUser(p=>{*/}
                        {/*                   let val = Object.assign({},p);*/}
                        {/*                   val.details.dateOfBirth = e.target.value;*/}
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
                            value={ MSUser.details.dateOfBirth ? new Date(MSUser.details.dateOfBirth).toISOString().split('T')[0] : ""}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                            onChange={(date) => {
                                if(date && date._isValid){
                                    setMSUser(p=>({...p,details: {...p.details, dateOfBirth: new Date(date).toISOString()}}))
                                }
                            }}
                        />
                    </Col>
                </Form>
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={6}>
                            <Button variant="contained" size="small" color="secondary" onClick={() => {
                                F_showToastMessage(t("No change"),)
                                setCurrentTab({openTab:0, type:""})
                            }}>
                                {t("Back to users list")}
                            </Button>
                        </Grid>
                        <Grid item xs={6} className="p-0 d-flex justify-content-end">
                            {currentTab.type !== "new" ?
                                <Button variant="contained" size="small" color="inherit"
                                        onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                                    {t("Remove user from this company")}
                                </Button> : null}
                            <Button onClick={saveChanges} variant="contained" color="primary" className="ml-5">
                                {t("Save user")}
                            </Button>
                        </Grid>
                    </Grid>
                </CardActions>
            </CardActionArea>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing user")}
                                actionModalMessage={t("Are you sure you want to remove user? The action is not reversible!")}
            />
        </Card>
    )
}