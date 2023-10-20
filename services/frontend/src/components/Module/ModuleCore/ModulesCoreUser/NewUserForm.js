import React, {useEffect, useState} from "react";
import {
    Card,
    CardHeader,
    Divider,
    IconButton, ListSubheader,
} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import ConfirmActionModal from "../../../common/ConfirmActionModal";
import {useTranslation} from "react-i18next";
import {useMainContext} from "../../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import userService from "../../../../services/user.service";
import moduleCoreService from "../../../../services/module-core.service";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import CertificationList from "./AvailableRoles/Certifications";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import Checkbox from "@material-ui/core/Checkbox";
import {KeyboardDatePicker} from "@material-ui/pickers";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import SearchField from "../../../common/Search/SearchField";
import TableSearch from "../../../common/Table/TableSearch";
import AvailableRoles from "./AvailableRoles/AvailableRoles";
import PermissionList from "./PermissionList";
import InternshipService from "../../../../services/internship.service";
import {EUserRoleChip} from "../../../../styled_components";
import Avatar from "@material-ui/core/Avatar";
import {isWidthUp} from "@material-ui/core/withWidth";
import {ETabBar, ETab} from "../../../../styled_components";
import { makeStyles} from "@material-ui/core/styles";
import { theme } from "../../../../MuiTheme";
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import VerifiedIcon from '@mui/icons-material/Verified';
import AuthService from "services/auth.service";
import Confirm from "components/common/Hooks/Confirm";
import { usePrompt } from "components/common/Hooks/usePrompt";

const useStyles = makeStyles(theme=>({
    CardContentRoot: {
        overflow: "hidden"
    }
}));

const initialUserState={
    name: "",
    surname: "",
    username: "",
    email: "",
    password: "",
    otherPassword: "",
    settings:{
        isActive: true,
        role: "", // default new user is trainee
        defaultRole: "", // default new user is trainee
        availableRoles: [], // default new user is trainee
        emailConfirmed:false,
        level:'1',
        assignedCompany: '',
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
};

const levels =['1','2','3','4','5','6','7','8','9A','9B','10A','10B','11A','11B','12','13','14'];

export default function NewUserForm({editFormHelper, setEditFormHelper}){
    const { t } = useTranslation();
    const { isConfirmed } = Confirm();
    const {F_showToastMessage, F_hasPermissionTo, F_getHelper, F_handleSetShowLoader} = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});
    const [activeTab, setActiveTab] = useState('INFORMATION');
    const {userPermissions, user} = F_getHelper();
    const [currentUser, setCurrentUser]=useState(initialUserState);
    const [students, setStudents] = useState([]);
    const [visiblePassword,setVisiblePassword] = useState(false);
    const [assignChildrenDrawer, setAssignChildrenDrawer] = useState(false);
    const [searchingText, setSearchingText] = useState('');
    const [filteredData,setFilteredData] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [validators, setValidators] = useState({email: false, username: false, usernameAvailable:false, name: false, surname: false, password: false, passwordConfirm: false});
    const {currentScreenSize} = useMainContext();
    const [currentTab, setCurrentTab] = useState(0);
    const classes = useStyles();
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);


    useEffect(()=>{
        // to avoid the empty tab when changing users from assistant to non-assistant
        setActiveTab('INFORMATION');
        setCurrentTab(0);

        if (manageScopeIds.isTrainingCenter){
            InternshipService.readAllCompanies().then(res=>{
                if(res.status === 200 && res.data){
                    setCompanies(res.data);
                }
            }).catch(error=>console.log(error));
        }

        if(editFormHelper.isOpen && editFormHelper.userId !== 'NEW'){
            userService.read(editFormHelper.userId).then(res=>{
                if(res.status === 200 && res.data){
                    setCurrentUser(res.data);
                    if(res.data.settings.availableRoles.includes("Parent")){
                        moduleCoreService.readAllTrainees(manageScopeIds.moduleId).then(res2=>{
                            if(res2.data){
                                let newData = [];
                                newData = res2.data.map(trainee=>{
                                    res.data.details.children.map(child=>{
                                        if(trainee._id === child._id){
                                            trainee.isSelected = true;
                                        }
                                    });
                                    return trainee;
                                })
                                setStudents(newData);
                            }
                        });
                    }
                    F_handleSetShowLoader(false)
                }
            }).catch(err=>console.log(err));
        }else if(editFormHelper.isOpen && editFormHelper.openType === 'ADD'){
            setCurrentUser(initialUserState);
            moduleCoreService.readAllTrainees(manageScopeIds.moduleId).then(res2=>{
                if(res2.data.length > 0){
                    setStudents(res2.data);
                }
            });
        }
    },[editFormHelper.isOpen, editFormHelper.userId]);


    useEffect(()=>{
        if(actionModal.returnedValue){
            remove();
        }
    },[actionModal.returnedValue]);

    useEffect(()=>{
        setFilteredData(students);
    },[students]);


    const remove=()=>{
        moduleCoreService.removeModuleUser(manageScopeIds.moduleId, editFormHelper.userId).then(res=>{
                F_showToastMessage("User was removed","success")
            setEditFormHelper({isOpen: false, openType:'PREVIEW', userId: undefined, isBlocking: false})
            }
        ).catch(error=>console.error(error))
    }

    const save= async ()=>{
        if(manageScopeIds.isTrainingCenter){
            setCurrentUser(p=>({...p,settings: {...p.settings, selfRegistered : true, emailConfirmed : true}}))
        }
        if(await validateFields()){

            if(editFormHelper.userId === "NEW"){
                moduleCoreService.addModuleUser(manageScopeIds.moduleId, currentUser).then(res=>{
                    F_showToastMessage(res.data.message, res.status===200? "success":"warning");
                    setEditFormHelper({isOpen: false, openType:'PREVIEW', userId: undefined, isBlocking: false})
                }).catch(error=>{
                    const re1 = /username/i;
                    const re2 = /e-mail/i;
                    if(error?.response?.data?.message?.keyValue?.username || re1.test(error?.response?.data?.message)){
                        F_showToastMessage(`${t('Username is already taken, please choose another one or write correct characters')}`,"error");
                        setCurrentUser(p=>({...p, username: ''}));
                    }
                    if(error?.response?.data?.message?.keyValue?.email || re2.test(error?.response?.data?.message)){
                        F_showToastMessage(`${t('E-mail is already taken, please choose another one')}`,"error");
                        setCurrentUser(p=>({...p, email: ''}));
                    }
                })
            }else{
                moduleCoreService.updateModuleUser(currentUser).then(res=>{
                    //display res.message in toast
                    F_showToastMessage(res.data.message, res.status===200? "success":"warning");
                    setEditFormHelper({isOpen: false, openType:'PREVIEW', userId: undefined, isBlocking: false})
                }).catch(error=>{
                    if(error?.response?.data?.message?.keyValue?.email){
                        F_showToastMessage(`${t('E-mail is already taken, please choose another one')}`,"error");
                        setCurrentUser(p=>({...p, email: ''}));
                    }
                });
            }
        }else{
            F_showToastMessage("Correct wrong fields then save","warning");
        }

    }

    // const getFormType=(type)=>{
    //     switch(type){
    //         case 'ADD': return t('Add');
    //         case 'EDIT': return t('Edit');
    //         default: return t('Preview');
    //     }
    // };

    async function checkUsername(){
        let {data:{exists}} = await AuthService.isUsernameTaken(currentUser.username, currentUser._id);
        setIsUsernameAvailable(()=>!exists)
        setValidators(p=>({...p, usernameAvailable: exists}))
        return !exists;
    }

    async function validateFields(){
        let isValidate = true;
        // if(MSUser.email.length < 3 || MSUser.email.length > 20){
        //     setValidators(p=>({...p,email: true}));
        //     isValidate = false;
        // }else{
        //     setValidators(p=>({...p,email: false}));
        // }

        if(currentUser.username.length < 3 || currentUser.username.length > 20){
            setValidators(p=>({...p,username: true}));
            isValidate = false;
        }else{
            let available = await checkUsername();
            if(!available){
                setValidators(p=>({...p,usernameAvailable: true, username: false}));
                isValidate = false;
            }else{
                setValidators(p=>({...p,usernameAvailable: false, username: false}));
            }
        }

        if(currentUser.name.length < 3 || currentUser.name.length > 20){
            setValidators(p=>({...p,name: true}));
            isValidate = false;
        }else{
            setValidators(p=>({...p,name: false}));
        }

        if(currentUser.surname.length < 3 || currentUser.surname.length > 20){
            setValidators(p=>({...p,surname: true}));
            isValidate = false;
        }else{
            setValidators(p=>({...p,surname: false}));
        }
        

        if(editFormHelper.userId === "NEW"){
            if(currentUser?.password?.length >= 8 &&
                currentUser.password.match(/[a-z]/i) &&
                currentUser.password.match(/[A-Z]/i) &&
                currentUser.password.match(/[0-9]/) &&
                currentUser.password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)){
                setValidators(p=>({...p,password: false}));
            }else{
                setValidators(p=>({...p,password: true}));
                isValidate = false;
            }
        }
        if(editFormHelper.userId === "NEW"){
             if(currentUser.confirmPassword !== currentUser.password){
                setValidators(p=>({...p,passwordConfirm: true}));
                isValidate = false;
            }else{
                setValidators(p=>({...p,passwordConfirm: false}));
            }
        }

        if(editFormHelper.userId === "EDIT"){
            if(currentUser?.otherPassword?.password?.length >= 8 &&
                currentUser.otherPassword.password.match(/[a-z]/i) &&
                currentUser.otherPassword.password.match(/[A-Z]/i) &&
                currentUser.otherPassword.password.match(/[0-9]/) &&
                currentUser.otherPassword.password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)){
                setValidators(p=>({...p,otherPassword: false}));
            }else{
                setValidators(p=>({...p,otherPassword: true}));
                isValidate = false;
            }
        }

        return isValidate;
    };

    const levelList = levels?.length>0 ? levels.map((level,index)=><MenuItem key={index} value={level}>{level}</MenuItem>):[];
    const companiesList = companies.length>0 ? companies.map((item) => (<MenuItem key={item._id} value={item._id}>{item.name}</MenuItem>)):[];

    const assignedStudentsList =currentUser?.details?.children?.map((item,index)=>
        <Chip
            className="m-1"
            key={item._id}
            label={`${item.name} ${item.surname}`}
        />
    );

    const renderUserAvatar=()=>{
        switch (currentUser?.settings?.role){
          case "Root": return "Root";
          case "EcoManager": return "EcoMan";
          case "NetworkManager": return "NetworkMan";
          case "ModuleManager": return "ModuleMan";
          case "Assistant": return "ModuleMan";
          case "Architect": return "Architect";
          case "Librarian": return "Librarian";
          case "Trainee": return "Student";
          case "Parent": return "Parent";
          case "Trainer": {
            if(userPermissions.isClassManager){
              return "ClassMan";
            }else{
              return "Teacher"
            }
          }
          default:  return "Student";
        }
      }

    return(
        <Card className="p-2 d-flex flex-column m-0">
            <CardHeader className='pb-0'
            // avatar={<Chip label={getFormType(editFormHelper.openType)} color="primary" />}
            />
            <CardContent  classes={{ root: classes.CardContentRoot }} >

            <ETabBar className="mb-2" style={{maxWidth:'400px'}} 
                            value={currentTab}
                            textColor="primary"
                            variant="fullWidth"
                            onChange={(e,i)=>setCurrentTab(i)}
                            aria-label="tabs example"
                            eSize='small'
                        >
                            <ETab label={t("Information")}  style={{minWidth:'100px'}}  color={activeTab === 'INFORMATION' ? "primary" : "secondary"} eSize='small'onClick={()=>{setActiveTab('INFORMATION')}}/>
                            <ETab label={t("Contact")}  style={{minWidth:'50px'}} color={activeTab === 'CONTACT' ? "primary" : "secondary"} eSize='small' onClick={()=>{setActiveTab('CONTACT');}}/>
                            { F_hasPermissionTo('assign-role') && <ETab label={t("Available roles")}  style={{minWidth:'50px'}}  eSize='small' color={activeTab === 'ROLES' ? "primary" : "secondary"} onClick={()=>{setActiveTab('ROLES');}} />}
                            { manageScopeIds.isTrainingCenter && editFormHelper.userId !== "NEW" && user.role === "Trainee" && <ETab label={t("Certification")}  style={{minWidth:'50px'}}  eSize='small' color={activeTab === 'CERTIFICATION' ? "primary" : "secondary"} onClick={()=>{setActiveTab('CERTIFICATION');}} />}
                            { user.role!=="Assistant" && currentUser.settings.availableRoles.includes("Assistant") && <ETab label={t("Permissions")}  style={{minWidth:'50px'}}  eSize='small' color={activeTab === 'PERMISSIONS' ? "primary" : "secondary"} onClick={()=>{setActiveTab('PERMISSIONS');}} />}
                        </ETabBar>
                <Grid container>
                    <Grid item xs={12} className='mt-1'>
                        {activeTab === 'INFORMATION' && (
                            <>
                                    <Grid container className="mt-3">
                                      <Avatar src={`/img/user_icons_by_roles/${renderUserAvatar()}.png`} style={{width:'90px', height: '90px', margin:isWidthUp('md',currentScreenSize) ? "" : "auto"}} alt="user-icon-avatar"/>
                                        <div className="ml-3">
                                            <Typography style={{textAlign: isWidthUp('sm',currentScreenSize) ? "" : "auto"}}  className={currentUser.settings?.isActive ? 'text-success' : 'text-danger'}>{currentUser.settings?.isActive ? ' Active ' : 'InActive'} </Typography>
                                            <Typography className="mt-2" variant="h5" component="h5"  
                                                style={{ maxWidth:"380px",color: `rgba(82, 57, 112, 1)`, fontSize :isWidthUp('sm',currentScreenSize) ? "26px" : "18px" }}>
                                                { currentUser?.name ? `${currentUser?.name} ${currentUser?.surname}`: t("Enter user name")}
                                            </Typography>
                                        </div> 
                                        <div style={{width:"100%"}}></div>                
                                      <Grid item xs={9}  className=" mt-3 ">        
                                        {currentUser?.settings?.role?.length>0 ? (
                                            <>             
                                            <EUserRoleChip className="mr-1" label={t(currentUser?.settings?.role
                                            ||'-')} role={currentUser?.settings?.role||'-'}
                                            disabled={editFormHelper.openType === 'PREVIEW'} 
                                            />         
                                                    </>
                                                ): (
                                                    <>
                                                    <p>{t('Select "Available roles", then assign "Default role"')}</p>
                                                    <p>{t('This user doesn\'t have any role yet')}</p>
                                                    </>
                                                )}
                                      </Grid>
                                        <Grid item xs={12} className='mt-3'>
                                          <Typography variant="h5" component="h5" style={{textAlign:"left"}}>{t("Account information")}</Typography>   
                                        </Grid>
                                         {/* show company select only for trainee amd trainer */}
                                        {manageScopeIds.isTrainingCenter && (currentUser?.settings?.availableRoles.includes("Trainee") || currentUser?.settings?.availableRoles.includes("Trainer")) && (
                                            <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                                <FormControl style={{maxWidth:'400px'}} margin="dense" fullWidth={true}
                                                             variant={editFormHelper.openType === 'PREVIEW' ? 'standard':"filled"}
                                                >
                                                    <InputLabel id="demo-simple-select-label">{t("Assign company")}</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={currentUser.settings.assignedCompany}
                                                        // renderValue={v=> (v?v:t("Without company"))}
                                                        readOnly={editFormHelper.openType === 'PREVIEW'}
                                                        disableUnderline={editFormHelper.openType === 'PREVIEW'}
                                                        onChange={({target:{value}}) => {
                                                            setCurrentUser(p=>({...p, settings: {...p.settings, assignedCompany: value}}));
                                                        }}
                                                    >
                                                        <MenuItem key={"demo"} value={""}>{t('Without company')}</MenuItem>
                                                        {companiesList}
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                        )}
                                        <Grid item xs={12} md={6} className="d-flex flex-column px-1">

                                            <TextField label={t("Username")} style={{maxWidth:'400px'}} margin="dense"
                                                       fullWidth={true}
                                                       name='username'
                                                       variant={((editFormHelper.openType === 'ADD')||(editFormHelper.openType === 'EDIT')) ? 'filled' : 'standard'}
                                                       //variant='filled'
                                                       InputProps={{
                                                           readOnly: editFormHelper.openType === 'PREVIEW',
                                                           disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                           endAdornment: <IconButton
                                                                            aria-label="check username availability"
                                                                            onClick={()=>{checkUsername()}}
                                                                            edge="end"
                                                                        >
                                                                            {isUsernameAvailable ? <VerifiedIcon /> : <SyncProblemIcon />}
                                                                        </IconButton>,
                                                       }}
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       onBlur={()=>{checkUsername()}}
                                                       value={currentUser.username}
                                                       required={true}
                                                       helperText={validators.username ? "Incorrect username" : validators.usernameAvailable ? "Username is not available": null}
                                                       error={validators.username||validators.usernameAvailable}
                                                       onInput={({target})=>{
                                                        setEditFormHelper(p=>({...p, isBlocking: true}))
                                                        setCurrentUser(p=>({...p, [target.name]:target.value}))
                                                    }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                            <TextField label={t("Name of user")} style={{maxWidth:'400px'}} margin="dense"
                                                       fullWidth={true}
                                                       variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                                       name='name'
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       InputProps={{
                                                           readOnly: editFormHelper.openType === 'PREVIEW',
                                                           disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                       }}
                                                       value={currentUser.name}
                                                       required={true}
                                                       helperText={validators.name ? "Incorrect name [3-20 characters]" : null}
                                                       error={validators.name}
                                                      onInput={({target})=>{
                                                        setEditFormHelper(p=>({...p, isBlocking: true}))
                                                        setCurrentUser(p=>({...p, [target.name]:target.value}))
                                                    }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                            <TextField label={t("Surname")} style={{ maxWidth:'400px'}} margin="dense"
                                                       fullWidth={true}
                                                       name='surname'
                                                       variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       InputProps={{
                                                           readOnly: editFormHelper.openType === 'PREVIEW',
                                                           disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                       }}
                                                       value={currentUser.surname}
                                                       required={true}
                                                       helperText={validators.surname ? "Incorrect surname [3-20 characters]" : null}
                                                       error={validators.surname}
                                                       onInput={({target})=>{
                                                        setEditFormHelper(p=>({...p, isBlocking: true}))
                                                        setCurrentUser(p=>({...p, [target.name]:target.value}))
                                                    }}
                                            />
                                        </Grid>
                                        {!manageScopeIds.isTrainingCenter && (
                                        <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                            <TextField label={t("E-mail")} style={{maxWidth:'400px'}} margin="dense"
                                                       fullWidth={true}
                                                       variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                                       name='email'
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       InputProps={{
                                                           readOnly: editFormHelper.openType === 'PREVIEW',
                                                           disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                       }}
                                                       value={currentUser.email}
                                                       //helperText={validators.email ? "Incorrect email" : null}
                                                       error={validators.email}
                                                       onInput={({target})=>{
                                                        setEditFormHelper(p=>({...p, isBlocking: true}))
                                                        setCurrentUser(p=>({...p, [target.name]:target.value}))
                                                       }}
                                                    //    helperText={
                                                    //        (editFormHelper.openType === 'ADD' || editFormHelper.openType === 'EDIT')  && (
                                                    //                <FormControlLabel
                                                    //                    style={{transform: "scale(.75)", transformOrigin: "top left", marginLeft: "-20px", marginBottom: "-20px", marginTop: "-8px", width:"150%"}}
                                                    //                    control={
                                                    //                        <Checkbox
                                                    //                            checked={!currentUser?.settings?.emailConfirmed}
                                                    //                            onChange={()=>{
                                                    //                                setCurrentUser(p=>({...p, settings: ({...p.settings, emailConfirmed: !p.settings.emailConfirmed})}))
                                                    //                            }}
                                                    //                            name="confirmEmail"
                                                    //                            color="primary"
                                                    //                        />
                                                    //                    }
                                                    //                    label={<Typography sx={{ fontWeight: "bold", color: `rgba(255, 255, 255, 0.9)` }}>{t('User requires to confirm the email')}!</Typography>}
                                                    //                />)}
                                            />
                                        </Grid>
                                        )}
                                        {editFormHelper.openType === 'ADD' && (
                                        <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                                <TextField label={t("Password")} margin="dense"
                                                           style={{maxWidth:'400px'}}
                                                           type={visiblePassword ? 'text' : 'password'}
                                                           fullWidth={true}
                                                           autoComplete="new-password"
                                                           name='password'
                                                           required={true}
                                                           variant="filled"
                                                           value={currentUser.password ?? ""}
                                                           error={validators.password}
                                                           helperText={validators.password && <Typography><small>{t("Password must contain at least 8 characters, including 1 upper-case, 1 lower-case, 1 digit and 1 special character!")}`</small></Typography>}
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
                                                           onBlur={({target}) => {
                                                               if(currentUser?.password?.length >= 8 &&
                                                                   currentUser.password.match(/[a-z]/i) &&
                                                                   currentUser.password.match(/[A-Z]/i) &&
                                                                   currentUser.password.match(/[0-9]/) &&
                                                                   currentUser.password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)){
                                                                   setValidators(p=>({...p,[target.name]: false}));
                                                               } else{
                                                                   setValidators(p=>({...p,[target.name]: true}));
                                                               }
                                                           }}
                                                           onInput={({target})=>{
                                                            setEditFormHelper(p=>({...p, isBlocking: true}))
                                                            setCurrentUser(p=>({...p, [target.name]:target.value}))
                                                           }}
                                                />
                                        </Grid>
                                        )}
                                        {editFormHelper.openType === 'ADD' && (
                                            <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                                    <TextField label={t("Confirm password")} margin="dense" style={{maxWidth:'400px'}}
                                                               type={visiblePassword ? 'text' : 'password'}
                                                               fullWidth={true}
                                                               required={true}
                                                               name='confirmPassword'
                                                               variant="filled"
                                                               value={currentUser.confirmPassword}
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
                                                               helperText={validators.passwordConfirm && <Typography>{t("Password did not match!")}</Typography>}
                                                               onInput={({target}) => {
                                                                setEditFormHelper(p=>({...p, isBlocking: true}));
                                                                setCurrentUser(p=>({...p, [target.name]: target.value}))
                                                            }}
                                                               onBlur={({target}) => {
                                                                   if(target.value === currentUser.password){
                                                                       setValidators(p=>({...p, passwordConfirm: false}))
                                                                   }
                                                                   else{
                                                                       setValidators(p=>({...p, passwordConfirm: true}))
                                                                   }
                                                               }}
                                                    />
                                            </Grid>
                                        )}
                                        {user.id !== editFormHelper.userId && editFormHelper.openType === 'EDIT' && (
                                            <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                                    <TextField label={t("Set password")} margin="dense" style={{maxWidth:'400px'}}
                                                                type={visiblePassword ? 'text' : 'password'}
                                                                fullWidth={true}
                                                                autoComplete="new-password"
                                                                placeholder="Optional password"
                                                                name='password'
                                                                variant="filled"
                                                                value={currentUser.otherPassword?.password ?? ""}
                                                                error={validators.otherPassword}
                                                                helperText={validators.otherPassword && <Typography><small>{t("Password must contain at least 8 characters, including 1 upper-case, 1 lower-case, 1 digit and 1 special character!")}`</small></Typography>}
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
                                                                onBlur={({target}) => {
                                                                    if(currentUser?.otherPassword?.password?.length === 0 ||
                                                                        currentUser?.otherPassword?.password?.length >= 8 &&
                                                                        currentUser.otherPassword.password.match(/[a-z]/i) &&
                                                                        currentUser.otherPassword.password.match(/[A-Z]/i) &&
                                                                        currentUser.otherPassword.password.match(/[0-9]/) &&
                                                                        currentUser.otherPassword.password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)){
                                                                        setValidators(p=>({...p, otherPassword: false}));
                                                                    } else{
                                                                        setValidators(p=>({...p, otherPassword: true}))
                                                                    }
                                                                }}
                                                                onInput={({target})=>{
                                                                    setEditFormHelper(p=>({...p, isBlocking: true}));
                                                                    setCurrentUser(p=>({...p, otherPassword: {...currentUser.otherPassword, password: target.value}}))
                                                                }}
                                                    />
                                            </Grid>
                                        )}
                                        {manageScopeIds.isTrainingCenter && (
                                        <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                            <TextField label={t("E-mail")} style={{maxWidth:'400px'}} margin="dense"
                                                       fullWidth={true}
                                                       variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                                       name='email'
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       InputProps={{
                                                           readOnly: editFormHelper.openType === 'PREVIEW',
                                                           disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                       }}
                                                       value={currentUser.email}
                                                       //helperText={validators.email ? "Incorrect email" : null}
                                                       error={validators.email}
                                                       onInput={({target})=>{
                                                        setEditFormHelper(p=>({...p, isBlocking: true}))
                                                        setCurrentUser(p=>({...p, [target.name]:target.value}))
                                                    }}
                                                    //    helperText={
                                                    //        (editFormHelper.openType === 'ADD' || editFormHelper.openType === 'EDIT')  && (
                                                    //                <FormControlLabel
                                                    //                    style={{transform: "scale(.75)", transformOrigin: "top left", marginLeft: "-20px", marginBottom: "-20px", marginTop: "-8px", width:"150%"}}
                                                    //                    control={
                                                    //                        <Checkbox
                                                    //                            checked={!currentUser?.settings?.emailConfirmed}
                                                    //                            onChange={()=>{
                                                    //                                setCurrentUser(p=>({...p, settings: ({...p.settings, emailConfirmed: !p.settings.emailConfirmed})}))
                                                    //                            }}
                                                    //                            name="confirmEmail"
                                                    //                            color="primary"
                                                    //                        />
                                                    //                    }
                                                    //                    label={<Typography sx={{ fontWeight: "bold", color: `rgba(255, 255, 255, 0.9)` }}>{t('User requires to confirm the email')}!</Typography>}
                                                    //                />)}
                                            />
                                        </Grid>
                                        )}
                                        {/*<Grid item xs={6} className="d-flex flex-column px-1">*/}
                                        {/*    <TextField label={t("Surname")} style={{ maxWidth:'400px'}} margin="normal"*/}
                                        {/*               fullWidth={true}*/}
                                        {/*               name='surname'*/}
                                        {/*               variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}*/}
                                        {/*               InputLabelProps={{*/}
                                        {/*                   shrink: true,*/}
                                        {/*               }}*/}
                                        {/*               InputProps={{*/}
                                        {/*                   readOnly: editFormHelper.openType === 'PREVIEW',*/}
                                        {/*                   disableUnderline: editFormHelper.openType === 'PREVIEW',*/}
                                        {/*               }}*/}
                                        {/*               value={currentUser.surname}*/}
                                        {/*               required={true}*/}
                                        {/*               helperText={validators.surname ? "Incorrect surname [3-20 characters]" : null}*/}
                                        {/*               error={validators.surname}*/}
                                        {/*               onInput={({target})=>{setCurrentUser(p=>({...p, [target.name]:target.value}))}}*/}
                                        {/*    />*/}
                                        {/*</Grid>*/}
                                        {/* <Grid item xs={6} className="d-flex flex-column px-1">
                                            <TextField label={t("Display name")} style={{ maxWidth:'400px'}} margin="normal"
                                                       fullWidth={true}
                                                       name={['details','displayName']}
                                                       variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       InputProps={{
                                                           readOnly: editFormHelper.openType === 'PREVIEW',
                                                           disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                       }}
                                                       value={currentUser?.details?.displayName}
                                                       onInput={({target}) => {
                                                           let args = target.name.split(',');
                                                           setCurrentUser(p=>({...p, [args?.[0]]: {...p[args[0]], [args?.[1]]: target.value}}));
                                                       }}
                                            />
                                        </Grid> */}
                                        <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                            <KeyboardDatePicker
                                                inputVariant={editFormHelper.openType === 'PREVIEW' ? 'standard':"filled"}
                                                style={{maxWidth:'400px'}}
                                                InputProps={{
                                                    readOnly: editFormHelper.openType === 'PREVIEW',
                                                    disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                }}
                                                margin="dense"
                                                id="date-picker-dialog"
                                                label={t("Date of birth")}
                                                format="DD.MM.yyyy"
                                                disableFuture={true}
                                                InputLabelProps={{
                                                    shrink: true,
                                                }}
                                                value={ currentUser.details?.dateOfBirth ? new Date(currentUser.details.dateOfBirth).toISOString() : null}
                                                KeyboardButtonProps={{
                                                    'aria-label': 'change date',
                                                    disabled: editFormHelper.openType === 'PREVIEW'
                                                }}
                                                onChange={(date) => {
                                                    if(date && date._isValid){
                                                        setEditFormHelper(p=>({...p, isBlocking: true}));
                                                        setCurrentUser(p=>({...p,details: {...p.details, dateOfBirth: new Date(date).toISOString()}}))
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        {/* {currentUser.settings.availableRoles.includes("Partner") &&(
                                            <Grid item xs={6} className="d-flex flex-column px-1">
                                                <TextField label={t("Company name")} style={{ maxWidth:'400px'}} margin="normal"
                                                           fullWidth={true}
                                                           name='companyName'
                                                           variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                                           InputLabelProps={{
                                                               shrink: true,
                                                           }}
                                                           InputProps={{
                                                               readOnly: editFormHelper.openType === 'PREVIEW',
                                                               disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                           }}
                                                           value={currentUser?.companyName}
                                                           onInput={({target}) => {
                                                               setEditFormHelper(p=>({...p, isBlocking: true}));
                                                               setCurrentUser(p=>({...p, [target.name]: target.value}));
                                                           }}
                                                />
                                            </Grid>
                                        )} */}
                                        <Grid item xs={12} className="d-flex flex-column">
                                            <Divider variant="insert" className='my-2'/>
                                        </Grid>
                                        <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                            <FormControl style={{maxWidth:'400px'}} margin="dense" fullWidth={true}
                                                         variant={editFormHelper.openType === 'PREVIEW' ? 'standard':"filled"}
                                            >
                                                <InputLabel id="demo-simple-select-label">{t("Status")}</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    name={['settings','isActive']}
                                                    readOnly={editFormHelper.openType === 'PREVIEW'}
                                                    disableUnderline={editFormHelper.openType === 'PREVIEW'}
                                                    value={currentUser.settings.isActive ? 1 : 0}
                                                    onChange={({target}) => {
                                                        setEditFormHelper(p=>({...p, isBlocking: true}));
                                                        setCurrentUser(p=>({...p, [target.name?.[0]]: {...p[target.name[0]], [target.name?.[1]]: !!(target.value)}}));
                                                    }}
                                                >
                                                    <MenuItem value={1} className="text-success">{t("Active")}</MenuItem>
                                                    <MenuItem value={0} className="text-danger">{t("inActive")}</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                            {currentUser?.settings?.availableRoles.includes("Trainee") && (
                                                <FormControl style={{maxWidth: '400px'}} fullWidth={true} margin="dense"
                                                             variant={editFormHelper.openType === 'PREVIEW' ? 'standard':"filled"}
                                                >
                                                    <InputLabel id="select-student-label">{t("Trainee level")}</InputLabel>
                                                    <Select
                                                        labelId="select-student-label"
                                                        id="select-student"
                                                        name={['settings','level']}
                                                        value={currentUser.settings.level}
                                                        readOnly={editFormHelper.openType === 'PREVIEW'}
                                                        disableUnderline={editFormHelper.openType === 'PREVIEW'}
                                                        onChange={({target}) => {
                                                            setEditFormHelper(p=>({...p, isBlocking: true}));
                                                            setCurrentUser(p=>({...p, [target.name?.[0]]: {...p[target.name[0]], [target.name?.[1]]: target.value}}));
                                                        }}
                                                    >
                                                        {levelList}
                                                    </Select>
                                                </FormControl>)}
                                        </Grid>
                                        {currentUser?.settings?.availableRoles.includes("Parent") && (
                                            <>
                                                <Grid item xs={12} className='mt-2'>
                                                    <small style={{color: `rgba(82, 57, 112, 1)`}}>{t("Assign children to parent")}</small>
                                                    <Divider variant="insert" />
                                                </Grid>
                                                <Grid item xs={6} className="d-flex flex-column pr-1 pt-2">
                                                    <div className="flex-fill">
                                                    {(assignedStudentsList?.length >0) ? assignedStudentsList : <p>{t("You don't have any assigned children yet")}</p>}
                                                    </div>
                                                </Grid>
                                                <Grid item xs={6} className="d-flex flex-column pl-1 pt-3 align-items-end">
                                                    {editFormHelper.openType !== 'PREVIEW' && (
                                                        <Button size="small" variant="contained" color="primary"
                                                                style={{maxWidth:'200px'}}
                                                                onClick={()=>setAssignChildrenDrawer(true)}>{t("Assign children")}</Button>
                                                    )}
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                            </>
                        )}
                        {activeTab === 'CONTACT' && (
                            <>
                                <small style={{color: `rgba(82, 57, 112, 1)`}} className='mt-3'>{t("Contact")} / {t("Address")}</small>
                                <Divider variant="insert" />
                                <div className="d-flex justify-content-between">
                                    <Grid container>
                                        <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                            <TextField label={t("City")} style={{maxWidth:'400px'}} margin="dense"
                                                       fullWidth={true}
                                                       variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                                       name={['details','city']}
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       InputProps={{
                                                           readOnly: editFormHelper.openType === 'PREVIEW',
                                                           disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                       }}
                                                       value={currentUser.details.city}
                                                       onInput={({target}) => {
                                                            setEditFormHelper(p=>({...p, isBlocking: true}));
                                                           let args = target.name.split(',');
                                                           setCurrentUser(p=>({...p, [args?.[0]]: {...p[args[0]], [args?.[1]]: target.value}}));
                                                       }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                            <TextField label={t("Street")} style={{maxWidth:'400px'}} margin="dense"
                                                       fullWidth={true}
                                                       variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                                       name={['details','street']}
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       InputProps={{
                                                           readOnly: editFormHelper.openType === 'PREVIEW',
                                                           disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                       }}
                                                       value={currentUser.details.street}
                                                       onInput={({target}) => {
                                                        setEditFormHelper(p=>({...p, isBlocking: true}));
                                                           let args = target.name.split(',');
                                                           setCurrentUser(p=>({...p, [args?.[0]]: {...p[args[0]], [args?.[1]]: target.value}}));
                                                       }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                            <TextField label={t("Postcode")} style={{maxWidth:'400px'}} margin="dense"
                                                       fullWidth={true}
                                                       variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                                       name={['details','postcode']}
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       InputProps={{
                                                           readOnly: editFormHelper.openType === 'PREVIEW',
                                                           disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                       }}
                                                       value={currentUser.details.postcode}
                                                       onInput={({target}) => {
                                                        setEditFormHelper(p=>({...p, isBlocking: true}));
                                                           let args = target.name.split(',');
                                                           setCurrentUser(p=>({...p, [args?.[0]]: {...p[args[0]], [args?.[1]]: target.value}}));
                                                       }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                            <TextField label={t("Build nr / flat")} style={{maxWidth:'400px'}} margin="dense"
                                                       fullWidth={true}
                                                       variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                                       name={['details','buildNr']}
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       InputProps={{
                                                           readOnly: editFormHelper.openType === 'PREVIEW',
                                                           disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                       }}
                                                       value={currentUser.details.buildNr}
                                                       onInput={({target}) => {
                                                        setEditFormHelper(p=>({...p, isBlocking: true}));
                                                           let args = target.name.split(',');
                                                           setCurrentUser(p=>({...p, [args?.[0]]: {...p[args[0]], [args?.[1]]: target.value}}));
                                                       }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                            <TextField label={t("Country")} style={{maxWidth:'400px'}} margin="dense"
                                                       fullWidth={true}
                                                       variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                                       name={['details','country']}
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       InputProps={{
                                                           readOnly: editFormHelper.openType === 'PREVIEW',
                                                           disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                       }}
                                                       value={currentUser.details.country}
                                                       onInput={({target}) => {
                                                        setEditFormHelper(p=>({...p, isBlocking: true}));
                                                           let args = target.name.split(',');
                                                           setCurrentUser(p=>({...p, [args?.[0]]: {...p[args[0]], [args?.[1]]: target.value}}));
                                                       }}
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                            <FormControl style={{maxWidth:'400px'}} margin="dense" fullWidth={true}
                                                         variant={editFormHelper.openType === 'PREVIEW' ? 'standard':"filled"}
                                            >
                                                <InputLabel id="demo-simple-select-label">{t("Select language")}</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    name={['settings','language']}
                                                    readOnly={editFormHelper.openType === 'PREVIEW'}
                                                    disableUnderline={editFormHelper.openType === 'PREVIEW'}
                                                    value={currentUser.settings.language}
                                                    onChange={({target}) => {
                                                        setEditFormHelper(p=>({...p, isBlocking: true}));
                                                        setCurrentUser(p=>({...p, [target.name?.[0]]: {...p[target.name[0]], [target.name?.[1]]: target.value}}));
                                                    }}
                                                >
                                                    <MenuItem value={"en"}>English (Great Britain)</MenuItem>
                                                    <MenuItem value={"fr"}>Français (France)</MenuItem>
                                                    <MenuItem value={"pl"}>Polski (Polska)</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12} className="d-flex flex-column">
                                            <Divider variant="insert" className='my-2'/>
                                        </Grid>
                                        <Grid item xs={12} md={6} className="d-flex flex-column px-1">
                                            <TextField label={t("Phone")} style={{maxWidth:'400px'}} margin="dense"
                                                       fullWidth={true}
                                                       variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                                       name={['details','phone']}
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       InputProps={{
                                                           readOnly: editFormHelper.openType === 'PREVIEW',
                                                           disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                       }}
                                                       value={currentUser.details.phone}
                                                       onInput={({target}) => {
                                                        setEditFormHelper(p=>({...p, isBlocking: true}));
                                                           let args = target.name.split(',');
                                                           setCurrentUser(p=>({...p, [args?.[0]]: {...p[args[0]], [args?.[1]]: target.value}}));
                                                       }}
                                            />
                                        </Grid>
                                        {/* <Grid item xs={12} className="d-flex flex-column">
                                            <Divider variant="insert" className='my-2'/>
                                        </Grid>
                                        <Grid item xs={12} className="d-flex flex-column px-1">
                                            <TextField label={t("Description (max 100 words)")}style={{ maxWidth:'900px'}} margin="dense"
                                                       fullWidth={true}
                                                       multiline={true}
                                                       rowsMax={2}
                                                       name={['details','description']}
                                                       variant={editFormHelper.openType === 'PREVIEW' ? 'standard' : 'filled'}
                                                       InputLabelProps={{
                                                           shrink: true,
                                                       }}
                                                       InputProps={{
                                                           readOnly: editFormHelper.openType === 'PREVIEW',
                                                           disableUnderline: editFormHelper.openType === 'PREVIEW',
                                                       }}
                                                       value={currentUser?.details?.description}
                                                       onInput={({target}) => {
                                                           let args = target.name.split(',');
                                                           setCurrentUser(p=>({...p, [args?.[0]]: {...p[args[0]], [args?.[1]]: target.value}}));
                                                       }}
                                            />
                                        </Grid> */}
                                    </Grid>
                                </div>
                            </>
                        )}
                        {activeTab === 'ROLES' && (
                            <AvailableRoles editFormHelper={editFormHelper}
                                            setEditFormHelper={setEditFormHelper}
                                            currentUser={currentUser}
                                            setCurrentUser={setCurrentUser}/>
                        )}
                        {activeTab === 'PERMISSIONS' && (
                            <PermissionList editFormHelper={editFormHelper}
                                            setEditFormHelper={setEditFormHelper}
                                            currentUser={currentUser}
                                            setCurrentUser={setCurrentUser}/>
                        )}
                        {activeTab === 'CERTIFICATION' && (
                            <CertificationList editFormHelper={editFormHelper}
                                            setEditFormHelper={setEditFormHelper}
                                            currentUser={currentUser}
                                            setCurrentUser={setCurrentUser}/>
                        )}
                    </Grid>
                </Grid>
                <SwipeableDrawer
                    PaperProps={{
                        style:{
                            backgroundColor: theme.palette.neutrals.white,
                            maxWidth:"450px"
                    }}}
                    onOpen=''
                    anchor="right"
                    open={assignChildrenDrawer}
                    onClose={()=>{
                        setAssignChildrenDrawer(false);
                        setSearchingText('');
                        //pushAssignedStudents();
                    }}
                >
                    <List z
                          component="nav"
                          aria-labelledby="nested-list-subheader"
                          subheader={
                              <ListSubheader  disableSticky= "true" component="div" id="nested-list-subheader">
                                  <Grid container className="py-2">
                                    <Grid item xs={12}>
                                        <Typography variant="h3" component="h2" className="mt-2 text-center text-justify mb-2" style={{fontSize:"32px"}}>   
                                            {t("Select students")}
                                        </Typography>  
                                    </Grid>
                                      <Grid item xs={12} className='px-3 mb-2'>
                                              <SearchField
                                                  className="text-primary"
                                                  value={searchingText}
                                                  onChange={({target})=>{TableSearch(target.value, students, setSearchingText, setFilteredData)}}
                                                  clearSearch={()=>TableSearch('', students, setSearchingText, setFilteredData)}
                                              />
                                      </Grid>
                                  </Grid>
                              </ListSubheader>}
                    >
                        {filteredData?.length>0 ? filteredData.map((item, index)=>(
                            <ListItem className="pl-3" key={item._id}>
                                <ListItemIcon >
                                    <Checkbox
                                        edge="start"
                                        checked={item.isSelected}
                                        tabIndex={index}
                                        size="small"
                                        color="primary"
                                        inputProps={{ 'aria-labelledby': index }}
                                        onChange={(e,isS)=>{
                                            setStudents(p=>{
                                              let val = Object.assign([],p);
                                              val[index].isSelected = isS;
                                              return val;
                                            });
                                            if(isS){
                                                setCurrentUser(p=>({...p,
                                                    details: {...p.details,
                                                        children: [...p.details.children||[],{_id: item._id, name: item?.name, surname: item?.surname}]
                                                }}));
                                            }else{
                                                setCurrentUser(p=>{
                                                    let val = Object.assign({},p);
                                                    val.details.children = val.details.children.filter(ch=> ch._id !== item._id);
                                                    return val;
                                                });
                                            }
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${item?.name} ${item?.surname}`}
                                    secondary={`${item?.username}`}
                                />
                            </ListItem>
                        )): <p className="pl-3" >{t('No data')}</p>}
                    </List>
                </SwipeableDrawer>
            </CardContent>
            <CardActionArea>
                <CardActions className="d-flex justify-content-between align-items-center" >
                    <Grid container>
                        <Grid item xs={4}>
                            <Button variant="contained" size="small" color="secondary"
                                    onClick={async ()=>{
                                        if(editFormHelper.isBlocking) {
                                            let confirm = await isConfirmed(t("Are you sure you want to discard changes?"));
                                            if(!confirm) return;
                                        }
                                        F_showToastMessage("No change",);
                                        setEditFormHelper({isOpen: false, openType:'PREVIEW', userId: 'NEW', isBlocking: false});
                                    }}>{t("Dismiss")}</Button>
                        </Grid>
                        <Grid item xs={8} className="p-0 d-flex justify-content-between align-items-center">
                            {editFormHelper.openType === 'EDIT' && !['ModuleManager','Assistant'].includes(currentUser?.settings?.role) && (
                                <Button variant="contained" size="small" color="inherit"
                                        onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                                    {t("Remove user")}
                                </Button>
                            )}
                            {editFormHelper.openType !== 'PREVIEW' && currentUser?.settings?.role?.length>0 && (
                                <Button size="small" variant="contained" color="primary" style={{marginLeft:"auto"}}
                                        onClick={save} disabled={!editFormHelper.isBlocking || validators.otherPassword}
                                >{t("Save")}</Button>
                            )}
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