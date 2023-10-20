import React, {useEffect, useState} from "react";
import {Col, Form, Row} from "react-bootstrap";
import TextField from "@material-ui/core/TextField"
import {useNavigate, useParams} from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem"
import moduleCoreService from "../../../../services/module-core.service";
import userService from "../../../../services/user.service";
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import {Box, CardHeader, Divider, FormControlLabel, IconButton, ListSubheader, OutlinedInput} from '@material-ui/core';
import { FilledInput } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Chip from "@material-ui/core/Chip";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import {useTranslation} from "react-i18next";
import ConfirmActionModal from "../../../common/ConfirmActionModal";
import {KeyboardDatePicker} from "@material-ui/pickers";
import Typography from "@material-ui/core/Typography";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import {now} from "moment";

const useStyles = makeStyles(theme=>({}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

export default function MSUserForm(){
    const { t, i18n, translationsLoaded } = useTranslation();
    const {F_showToastMessage, F_getHelper, F_handleSetShowLoader} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const classes = useStyles();
    const navigate = useNavigate();
    const { userId } = useParams();
    // next to know the way to access schema variable/ schema virtual variable
    const [openSidebarDrawer, setOpenSidebarDrawer] = useState(false);
    const [roles, setRoles] = useState([]);
    const [levels, setLevels] = useState(['1','2','3','4','5','6','7','8','9A','9B','10A','10B','11A','11B','12','13','14']);
    const [validators, setValidators] = useState({email: false, username: false, name: false, surname: false, password: false, passwordConfirm: false});
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
    const [visiblePassword,setVisiblePassword] = useState(false);
    const [students, setStudents] = useState([]);
    const [MSUser, setMSUser] = useState({
        settings:{
            isActive:"",
            role:"",
            defaultRole: "",
            availableRoles: [],
            emailConfirmed: false,
        },
        details:{},
    });

    useEffect(()=>{
        if(actionModal.returnedValue){
            removeUser();
        }
        F_handleSetShowLoader(false);
    },[actionModal.returnedValue])

    useEffect(()=>{
        if (manageScopeIds.isTrainingCenter) setRoles(['Librarian','Architect','Trainer','Trainee','Parent','Inspector','Coordinator','TrainingManager','Partner']);
        else setRoles(['Librarian','Architect','Trainer','Trainee','Parent','Inspector']);
        F_handleSetShowLoader(true)
        if(userId === "new"){
            setMSUser({
                name: "",
                surname: "",
                username: "",
                email: "",
                password: "",
                settings:{
                    isActive: true,
                    role: "Trainee", // default new user is trainee
                    defaultRole: "Trainee", // default new user is trainee
                    availableRoles: ["Trainee"], // default new user is trainee
                    emailConfirmed:false,
                    level:'1',
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
                    dateOfBirth: "",
                    description: ""
                }
            })
            moduleCoreService.readAllTrainees(manageScopeIds.moduleId).then(res2=>{
                setStudents(res2.data);
            });
            F_handleSetShowLoader(false)
        }else{
            userService.read(userId).then(res=>{
               if(res.data){
                   setMSUser(res.data)
                   if(res.data.settings.availableRoles.includes("Parent")){
                       moduleCoreService.readAllTrainees(manageScopeIds.moduleId).then(res2=>{
                           if(res2.data){
                               let newData = [];
                               newData = res2.data.map(trainee=>{
                                   res.data.details.children.map(child=>{
                                       if(trainee._id === child._id){
                                           trainee.isSelected = true;
                                       }
                                   })
                                   return trainee;
                               })
                               setStudents(newData);
                               //setStudents(res2.data);
                           }

                       });
                   }
                   F_handleSetShowLoader(false)
               }
            });
        }
    },[]);

    function pushAssignedStudents(){

        let studentsToPush = [];
        students.map(item=>{
            if(item.isSelected){
                studentsToPush.push({_id: item._id, username: item.username, name: item.name, surname: item.surname, email: item.email})
            }
        });

        setMSUser(p=>{
            let val = Object.assign({},p);
            val.details.children = studentsToPush;
            return val;
        })
    }

    function validateFields(){
        let isValidate = true;
        // email
        // username
        // password
        // name
        // surname

        // if(MSUser.email.length < 3 || MSUser.email.length > 20){
        //     setValidators(p=>({...p,email: true}));
        //     isValidate = false;
        // }else{
        //     setValidators(p=>({...p,email: false}));
        //     //isValidate = true;
        // }

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

        if(userId === "new"){
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

    const assignedStudentsList =MSUser?.details?.children?.map((item,index)=>
        <Chip
            className="m-1"
            key={item._id}
            label={`${item.name} ${item.surname}`}
        />
    );

    function saveChanges(){
        // if(helper.user.modules.find(x=>x._id===helper.moduleId)?.moduleType==="TRAINING"){
        if(manageScopeIds.isTrainingCenter){
            MSUser.settings.selfRegistered = true;
            MSUser.settings.emailConfirmed = true;
        }
        if(validateFields()){
            if(userId === "new"){
                moduleCoreService.addModuleUser(manageScopeIds.moduleId, MSUser).then(res=>{
                    F_showToastMessage(res.data.message, res.status===200? "success":"warning");
                    navigate("/modules-core/users");
                }).catch(error=>{
                    console.log("err",error?.response);
                    if(error?.response?.data?.message?.keyValue?.username){
                        F_showToastMessage(`${t('Username is already taken, please choose another one')}`,"error");
                        setMSUser(p=>({...p, username: ''}));
                    }
                    if(error?.response?.data?.message?.keyValue?.email){
                        F_showToastMessage(`${t('E-mail is already taken, please choose another one')}`,"error");
                        setMSUser(p=>({...p, email: ''}));
                    }
                })
            }else{
                moduleCoreService.updateModuleUser(MSUser).then(res=>{
                    //display res.message in toast
                    F_showToastMessage(res.data.message, res.status===200? "success":"warning");
                    navigate("/modules-core/users")
                }).catch(error=>{
                    // console.log("err",error?.response);
                    if(error?.response?.data?.message?.keyValue?.email){
                        F_showToastMessage(`${t('E-mail is already taken, please choose another one')}`,"error");
                        setMSUser(p=>({...p, email: ''}));
                    }
                });
            }
        }else{
            F_showToastMessage("Correct wrong fields then save","warning");
        }

    }

    function removeUser(){
        moduleCoreService.removeModuleUser(userId).then(res=>{
                //display res in toast
                F_showToastMessage("User was removed","success")
                navigate("/modules-core/users")
            }
        ).catch(error=>console.error(error))
    }


    const rolesList = roles.map((role,index)=><MenuItem key={index} value={role}>{role}</MenuItem>)
    const levelList = levels.map((level,index)=><MenuItem key={index} value={level}>{level}</MenuItem>)

    return(
        <Card className="p-0 d-flex flex-column m-0">
            {/*<CardHeader title={` ${userId === "new" ? t("Add new user:") : t("Edit user:")} ${userId !== "new" ? MSUser.username: ""} `}/>*/}
            <CardHeader title={(
                <Typography variant="h5" component="h2" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                    {` ${MSUser?.username || t("Username")}`}
                </Typography>
            )} avatar={<Chip label={userId==="new" ? t("Add"):t("Edit")} color="primary" />}
            />
            <CardContent>
                <Form as={Row}>
                    <Col md={6} className="d-flex flex-column">
                        <FormControl style={{width:"50%"}} variant="filled">
                            <InputLabel id="demo-simple-select-label">{t("Select user's default role")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={MSUser.settings.role}
                                //input={<Input/>}
                                onChange={(e) => {
                                    setMSUser(p=>{
                                        let val = Object.assign({},p);
                                        val.settings.role = e.target.value;
                                        if (!val.settings.availableRoles.includes(e.target.value)) val.settings.availableRoles.push(e.target.value)
                                        return val;
                                    })
                                }}S
                            >
                                {rolesList}
                            </Select>
                        </FormControl>
                        {/* {["Trainer","Trainee"].includes(MSUser.settings.role) && (helper.user.modules.find(x=>x._id===helper.moduleId)?.moduleType==="TRAINING") && 
                            <ListItem key={"email-confirmed"} style={{width:"50%"}} className="pl-0">
                                <ListItemIcon style={{minWidth:"2rem"}}>
                                    <Checkbox
                                        edge="start"
                                        checked={MSUser.settings.emailConfirmed}
                                        tabIndex={"email-confirmed"}
                                        size="small"
                                        color="primary"
                                        inputProps={{ 'aria-labelledby': "email-confirmed" }}
                                        onChange={(e)=>{
                                            setMSUser(p=>{
                                                let val = Object.assign({},p);
                                                val.settings.emailConfirmed = !val.settings.emailConfirmed;
                                                return val;
                                            })  
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText primary={`Training Center`}/>
                            </ListItem>
                        } */}
                    </Col>
                    <Col md={6} className="d-flex flex-column">
                        <FormControl
                            style={{width:"50%"}}
                            variant="filled">
                            <InputLabel id="demo-multiple-chip-label">{t("Select other available roles")}</InputLabel>
                            <Select
                            labelId="demo-multiple-chip-label"
                            id="demo-multiple-chip"
                            multiple
                            value={MSUser.settings.availableRoles}
                            onChange={(event) => {
                                const { target: { value }, } = event;
                                setMSUser(p=>{
                                    let val = Object.assign({},p);
                                    val.settings.availableRoles = typeof value === 'string' ? value.split(',') : value
                                    return val
                                });
                              }}
                            input={<FilledInput id="select-multiple-chip" label="Chip" />}
                            renderValue={(selected) => (
                                <Box className="d-flex flex-wrap">
                                {selected.map((value) => (
                                    <Chip key={value} label={value} className="m-1" style={{backgroundColor:'rgba(82, 57, 112, 1)', color: 'rgba(255,255,255,0.9)'}}/>
                                ))}
                                </Box>
                            )}
                            MenuProps={MenuProps}
                            >
                            {roles.filter(x=>x!==MSUser.settings.role).map((name) => (
                                <MenuItem
                                key={name}
                                value={name}
                                >
                                {name}
                                </MenuItem>
                            ))}
                            </Select>
                        </FormControl>


                    </Col>
                </Form>
                <hr/>
                {(MSUser.settings.role === "Partner"|| MSUser.settings.availableRoles.includes("Partner")) && userId === "new" &&(<>
                <Row>
                <Col md={6} className="d-flex flex-column">

                <TextField label={t("Company name")} margin="normal" style={{ width:"50%"}} 
                           fullWidth={true}
                           variant="filled"
                           InputLabelProps={{
                               shrink: true,
                           }}
                           InputProps={{
                               readOnly: false,
                           }}
                           value={MSUser.companyName?? ""}
                           onChange={(e=>{setMSUser(p=>({...p,companyName: e.target.value}))})}
                />
                </Col>
                    <Col md={6} className="d-flex flex-column">

                <TextField label={t("Position in the company")} margin="normal" style={{ width:"50%"}} 
                           disabled={true}
                           fullWidth={true}
                           variant="filled"
                           InputLabelProps={{
                               shrink: true,
                           }}
                           InputProps={{
                               readOnly: false,
                           }}
                           value={MSUser.ownerPosition?? ""}
                           onChange={(e=>{setMSUser(p=>({...p,ownerPosition: e.target.value}))})}
                />
                </Col>
                </Row>
                <hr />
                </>)}
                <Form as={Row}>
                    <Col md={6} className="d-flex flex-column">
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
                                //    helperText={validators.email ? "Incorrect email" : null}
                                   error={validators.email}
                                   onInput={(e) => {
                                       setMSUser(p=>{
                                           let val = Object.assign({},p);
                                           val.email = e.target.value;
                                           return val;
                                       })
                                   }}
                                helperText={<FormControlLabel
                                    style={{transform: "scale(.75)", transformOrigin: "top left", marginLeft: "-20px", marginBottom: "-20px", marginTop: "-8px", width:"150%"}}
                                    control={
                                    <Checkbox
                                        checked={!MSUser.settings.emailConfirmed}
                                        onChange={()=>{
                                            setMSUser(p=>{
                                                let val = Object.assign({},p);
                                                val.settings.emailConfirmed = !p.settings.emailConfirmed;
                                                return val;
                                            })
                                        }}
                                        name="confirmEmail"
                                        color="primary"
                                    />
                                    }
                                    label={<Typography sx={{ fontWeight: "bold", color: `rgba(255, 255, 255, 0.9)` }}>User requires to confirm the email!</Typography>}
                                />}

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
                        <FormControl style={{width:"50%"}} as={Row} variant="filled">
                            <InputLabel id="demo-simple-select-label">{t("Status")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={MSUser.settings.isActive ? 1 : 0}
                                //input={<Input className={MSUser.settings.isActive ? "text-success" : "text-danger"}/>}
                                onChange={(e) => {
                                    setMSUser(p=>{
                                        let val = Object.assign({},p);
                                        val.settings.isActive = (e.target.value) ? true : false;
                                        return val;
                                    })
                                }}
                            >
                                <MenuItem value={1} className="text-success">{t("Active")}</MenuItem>
                                <MenuItem value={0} className="text-danger">{t("inActive")}</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField label={t("Description (max 100 words)")}  margin="normal"
                                   variant="filled"
                                   rowsMax={2}
                                   multiline
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
                        {(MSUser.settings.role==="Trainee" || MSUser.settings.availableRoles.includes("Trainee")) && 
                        <FormControl style={{width:"50%"}} as={Row} variant="filled">
                            <InputLabel id="select-student-label">{t("Trainee Level")}</InputLabel>
                            <Select
                                labelId="select-student-label"
                                id="select-student"
                                value={MSUser.settings.level}
                                onChange={(e) => {
                                    setMSUser(p=>{
                                        let val = Object.assign({},p);
                                        val.settings.level = e.target.value;
                                        return val;
                                    })
                                }}
                            >
                            {levelList}
                            </Select>
                        </FormControl>}
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
                        <TextField label={t("Password")} margin="normal" style={{ width:"50%"}}
                                type={visiblePassword ? 'text' : 'password'}
                                fullWidth={true}
                                required={true}
                                variant="filled"
                                value={MSUser.password ?? ""}
                                error={validators.password}
                                InputLabelProps={{
                                    shrink: true,
                                }}
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
                                helperText={validators.password && <Typography><small>{t("Password must contain at least 8 characters, including 1 upper-case, 1 lower-case, 1 digit and 1 special character!")}`</small></Typography>}
                                onBlur={(e) => {
                                    if(MSUser.password.length >= 8 &&
                                        MSUser.password.match(/[a-z]/i) &&
                                        MSUser.password.match(/[A-Z]/i) &&
                                        MSUser.password.match(/[0-9]/) &&
                                        MSUser.password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)){
                                        setValidators(p=>{
                                            let val = Object.assign({},p);
                                            val.password = false;
                                            return val;
                                        })
                                    } else setValidators(p=>{
                                        let val = Object.assign({},p);
                                        val.password = true;
                                        return val;
                                    })
                                }}
                                onInput={(e) => {setMSUser(p=>({...p, password: e.target.value}))}}
                        />
                        <TextField label={t("Confirm password")} margin="normal" style={{ width:"50%"}}
                                type={visiblePassword ? 'text' : 'password'}
                                fullWidth={true}
                                required={true}
                                variant="filled"
                                value={MSUser.confirmPassword ?? ""}
                                error={validators.passwordConfirm}
                                InputLabelProps={{
                                    shrink: true,
                                }}
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
                                helperText={validators.passwordConfirm && <Typography>`${t("Password did not match!")}`</Typography>}                        
                                onInput={(e) => {setMSUser(p=>({...p, confirmPassword: e.target.value}))}}
                                onBlur={(e) => {
                                    if(e.target.value === MSUser.password)
                                        setValidators(p=>({...p, passwordConfirm: false}))
                                    else
                                        setValidators(p=>({...p, passwordConfirm: true}))
                                }}
                        />
                        {/* <TextField label={t("Display name")} style={{ width:"50%"}} margin="normal"
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
                        /> */}
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
                            disableFuture={true}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={ MSUser.details?.dateOfBirth ? new Date(MSUser.details.dateOfBirth).toISOString().split('T')[0] : null}
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
                {
                    (MSUser.settings.role === "Parent"|| MSUser.settings.availableRoles.includes("Parent")) &&(
                        <>
                        <div className="mt-3">
                            <small>{t("Assign children to parent")}</small>
                            <Divider variant="insert" />
                            <Form as={Row}>
                                <Col md={6} className="d-flex flex-column mt-2">
                                    <span>{t("Assigned children")}:</span>
                                    <div className="flex-fill p-3">
                                        {(assignedStudentsList?.length >0) ? assignedStudentsList : <p>{t("You don't have any assigned children yet")}</p>}
                                    </div>
                                </Col>
                                <Col md={6} className="d-flex flex-column mt-2">
                                    <FormControl style={{width:"50%"}} >
                                        <Button classes={{root: classes.root}} size="small" variant="contained" color="primary" onClick={()=>setOpenSidebarDrawer(true)}>{t("Assign children")}</Button>
                                    </FormControl>
                                </Col>
                            </Form>
                        </div>
                            <SwipeableDrawer
                                PaperProps={{
                                    style:{
                                        backgroundColor:'rgba(255,255,255,0.75)'
                                    }}}
                                anchor="right"
                                open={openSidebarDrawer}
                                onClose={()=>{
                                    setOpenSidebarDrawer(false);
                                    pushAssignedStudents();
                                }}
                            >
                                <List style={{width:"450px"}}>
                                                {students.map((item, index)=>(
                                                    <ListItem key={item._id}>
                                                        <ListItemIcon>
                                                            <Checkbox
                                                                edge="start"
                                                                checked={item.isSelected}
                                                                tabIndex={index}
                                                                size="small"
                                                                color="primary"
                                                                inputProps={{ 'aria-labelledby': index }}
                                                                onChange={()=>{
                                                                    setStudents(p=>{
                                                                        let val = Object.assign([],p);
                                                                        val[index].isSelected = !val[index].isSelected;
                                                                        return val;
                                                                    });
                                                                }}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText
                                                            primary={`${item.name} ${item.surname}`}
                                                            secondary={`${item.username}`}
                                                        />
                                                    </ListItem>
                                                ))}
                                </List>
                            </SwipeableDrawer>
                        </>
                    )
                }
            </CardContent>
            <CardActionArea>
            <CardActions className="d-flex justify-content-between align-items-center" >
                <Grid container>
                    <Grid item xs={6}>
                        <Button variant="contained" size="small" color="secondary" onClick={() => {
                            F_showToastMessage(t("No change"),)
                            navigate("/modules-core/users")
                        }}>
                            {t("Back")}
                        </Button>
                    </Grid>
                    <Grid item xs={6} className="p-0 d-flex justify-content-end">
                        {userId !== "new" ?
                            <Button variant="contained" size="small" color="inherit"
                                    onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                                {t("Remove")}
                            </Button> : null}
                        <Button onClick={saveChanges} variant="contained" color="primary" className="ml-5">
                            {t("Save")}
                        </Button>
                    </Grid>
                </Grid>
            </CardActions>
            </CardActionArea>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing user")}
                                actionModalMessage={t("Are you sure you want to remove your user? The action is not reversible!")}
            />
        </Card>
    )
}