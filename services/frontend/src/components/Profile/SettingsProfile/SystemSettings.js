import React, {lazy, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import {EAccordion, EButton} from "styled_components";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import { ESelect} from "new_styled_components";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import AuthService from "services/auth.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import ConfirmActionModal from "components/common/ConfirmActionModal";
import {Checkbox, Divider, FormControlLabel, Box} from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
import ModuleCoreService from "services/module-core.service";
const UserAssignedRoles = lazy(() => import("./AssignedRoles/UserAssignedRoles"));

export default function AccountSettings(props){
    const{
        currentUser,
        setUser,
    }=props;
    const {t} = useTranslation(['common']);
    const {F_showToastMessage, F_getErrorMessage, F_getHelper} = useMainContext();
    // const {user} = F_getHelper();
    const {user:u,manageScopeIds} = F_getHelper();
    const [showPass1, setShowPass1] = useState(false);
    const [showPass2, setShowPass2] = useState(false);
    const [showPass3, setShowPass3] = useState(false);
    const [showPass4, setShowPass4] = useState(false);
    const [visiblePassword, setVisiblePassword] = useState(false);
    const [password, setPassword] = useState(null);
    const [newPassword, setNewPassword] = useState(null);
    const [waitTime, setWaitTime] = useState(0);
    const [confirmNewPassword, setConfirmNewPassword] = useState(null);
    const [disableClick, setDisableClick] = useState(false);
    const [error, setError] = useState(false);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});

    const [moduleType, setModuleType] = useState(null);
    const [MSAcademicYears, setMSAcademicYears] = useState([]);
    const [currentYear, setCurrentYear] = useState(null);
    const [showRoleDialog, setShowRoleDialog] = useState(false)
    const [showPeriodDialog, setShowPeriodDialog] = useState(false);

    const handleSubmit = () => {
        if (newPassword!==confirmNewPassword){
             setError(true);
             F_showToastMessage(t("common:PASSWORD AND CONFIRM PASSWORD ARE DIFFERENT"), 'error');
             return
        }
        AuthService.changePassword({password,newPassword}).then(res=>{
            setError(false);
            let msg = t("common:PASSWORD HAS BEEN UPDATED SUCCESSFULLY");
            F_showToastMessage(msg);
            
        }, err=>{
            setError(true);
            F_showToastMessage(t("common:COULD NOT UPDATE PASSWORD"), 'error');

        })

    };


    const wait = (t) => {
        setTimeout(() => {
            setDisableClick(false)
        }, t*1000);

        for (let i = t; i > 0; i--) {
            setTimeout(() => {
                setWaitTime(i)
            }, (t-i)*1000);

        }
    };

    useEffect(() => {
        if(!manageScopeIds.isTrainingCenter){
            ModuleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
                if(res.data.academicYears){
                    setMSAcademicYears(res.data.academicYears)
                    setCurrentYear(res.data?.academicYears[0]?._id)
                }
            }).catch(error=>console.error(error))
        }
        setModuleType(()=>{
            let module = u.modules.find(m=>m._id === u.moduleId)
            return module?.moduleType
        })
    }, []);

    return(
        <Grid container>
            {/* <Grid item xs={12}>
                <Typography variant="h2" component="h3" className="text-left text-justify intrest-heading" style={{color:new_theme.palette.newSupplementary.NSupText}} >
                    {t("common:ACCOUNT SETTINGS")}
                </Typography>
                <hr/>
            </Grid> */}
            <Grid item xs={12}>
                <Box sx={{maxWidth: '250px'}}>
                    <Typography variant="body2" component="h6" sx={{mb:1}}>{t("common:SELECT LANGUAGE")}</Typography>
                    <ESelect
                        type="round"
                        size="medium"
                        labelId="demo-simple-select-label"
                        label="select"
                        id="demo-simple-select"
                        value={currentUser.settings.language}
                        onChange={({ target: { value } }) => {
                            let selectedLanguage = "en_EN"
                            switch (value) {
                                case "en":
                                    selectedLanguage = "en_GB"; break;
                                case "fr":
                                    selectedLanguage = "fr_FR"; break;
                                case "pl":
                                    selectedLanguage = "pl_PL"; break;
                                default: selectedLanguage = "en_GB"; break;
                            }
                            setUser(p => ({ ...p, settings: { ...p.settings, language: value, origin: selectedLanguage } }))
                        }}
                    >
                            <MenuItem value={"en"}>English (Great Britain)</MenuItem>
                            <MenuItem value={"fr"}>Français (France)</MenuItem>
                            <MenuItem value={"pl"}>Polski (Polska)</MenuItem>
                    </ESelect>
                </Box>
            </Grid>
            {/* <Grid container md={12} sx={{mt:3, gap:'20px'}}>
                <Grid item xs={12}>
                    <Typography variant="body2" component="h6">{t("common:ASSIGNED ROLE")}</Typography>
                </Grid>
                <Grid item xs={12} md={3} className="acc-box">
                    <img className="acc-box-img" src="/img/icons/username-main-role1.svg" alt="username"></img>
                    <TextField label={t("common:USERNAME")}  margin="dense"
                        fullWidth={true}
                        variant="standard"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: true,
                            disableUnderline: true
                        }}
                        disabled={false}
                        value={currentUser?.username??'-'}
                    />
                </Grid>
                <Grid item xs={12} md={3} className="acc-box">
                    <img className="acc-box-img" src="/img/icons/username-main-role2.svg" alt="username"></img>
                    <TextField label={t("common:MAIN ROLE")}  margin="dense"
                        fullWidth={true}
                        variant="standard"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: true,
                            disableUnderline: true
                        }}
                        disabled={false}
                        value={currentUser?.settings?.role??'-'}
                    />
                </Grid>
                <Grid item xs={12} md={3} className="acc-box">
                    <img className="acc-box-img" src="/img/icons/username-main-role3.svg" alt="username"></img>
                    <TextField label={t("common:E-MAIL")}  margin="dense"
                        fullWidth={true}
                        variant="standard"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        InputProps={{
                            readOnly: true,
                            disableUnderline: true
                        }}
                        disabled={false}
                        value={currentUser?.email??'-'}
                    />
                </Grid>
            </Grid> */}
            <Grid container spacing={2}>
                {/* <Grid item xs={12} md={6}>
                    <UserAssignedRoles user={currentUser} showRoleDialog={showRoleDialog} setShowRoleDialog={setShowRoleDialog} />
                </Grid> */}
                {/* <Grid item xs={12} md={3} alignSelf='center'> */}

                    {/* <StyledButton eSize='large' eVariant='primary'
                        onClick={() => { setShowRoleDialog(true) }}
                    >{t('Switch role')}</StyledButton> */}


                    {/* <FormControl margin="dense" variant="filled" fullWidth={true}>
                        <InputLabel id="demo-simple-select-label">{t("Switch Role")}</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            defaultValue={1}
                        >

                            <MenuItem value={1}>Training Manager</MenuItem>
                            <MenuItem>Module Manager</MenuItem>
                            <MenuItem>Trainee</MenuItem>
                        </Select>
                    </FormControl> */}
                {/* </Grid> */}
            </Grid>
            {/* <Grid item xs={12} className='mt-4'>
                <EAccordion
                    className='colapsible-head'
                    headerName={t("common:CHANGE PASSWORD")}
                    //headerBackground
                    defaultExpanded={true}
                    typoVariant='body2'
                >
                    <Grid container spacing={2} alignItems='center'>
                        
                        <Grid item xs={12} md={3}>
                            <TextField label={t("common:CURRENT PASSWORD")}  margin="dense"
                                       fullWidth={true}
                                       variant="filled"
                                       type={showPass1 ? 'text' : 'password'}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       InputProps={{
                                           endAdornment: (
                                               <InputAdornment position="end">
                                                   <IconButton
                                                       aria-label="toggle password visibility"
                                                       onClick={()=>setShowPass1(p=>!p)}
                                                   >
                                                       {showPass1 ? <Visibility /> : <VisibilityOff />}
                                                   </IconButton>
                                               </InputAdornment>
                                           ),
                                       }}
                                       error={error?true:false}
                                       disabled={false}
                                       value={password}
                                       onChange={({target:{value}})=> setPassword(value)}
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                            <TextField label={t("common:NEW PASSWORD")}  margin="dense"
                                       fullWidth={true}
                                       variant="filled"
                                       type={showPass2 ? 'text' : 'password'}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       InputProps={{
                                           endAdornment: (
                                               <InputAdornment position="end">
                                                   <IconButton
                                                       aria-label="toggle password visibility"
                                                       onClick={()=>setShowPass2(p=>!p)}
                                                   >
                                                       {showPass2 ? <Visibility /> : <VisibilityOff />}
                                                   </IconButton>
                                               </InputAdornment>
                                           ),
                                       }}
                                       error={error?true:false}
                                       disabled={false}
                                       onBlur={()=>{
                                           if (confirmNewPassword) setError(newPassword!==confirmNewPassword)
                                       }}
                                       value={newPassword}
                                       onChange={({target:{value}})=> setNewPassword(value)}
                            />
                        </Grid>
                        
                        <Grid item xs={12} md={3}>
                            <TextField label={t("common:CONFIRM NEW PASSWORD")}  margin="dense"
                                       fullWidth={true}
                                       variant="filled"
                                       type={showPass3 ? 'text' : 'password'}
                                       InputLabelProps={{
                                           shrink: true,
                                       }}
                                       InputProps={{
                                           endAdornment: (
                                               <InputAdornment position="end">
                                                   <IconButton
                                                       aria-label="toggle password visibility"
                                                       onClick={()=>setShowPass3(p=>!p)}
                                                   >
                                                       {showPass3 ? <Visibility /> : <VisibilityOff />}
                                                   </IconButton>
                                               </InputAdornment>
                                           ),
                                       }}
                                       error={error?true:false}
                                       disabled={false}
                                       value={confirmNewPassword}
                                       onChange={({target:{value}})=> setConfirmNewPassword(value)}
                            />
                        </Grid>

                        <Grid item xs={12} md={3} justifyContent='flex-end'>
                            
                            <StyledButton
                                eSize='large'
                                eVariant='primary'
                                disabled={(!password||!newPassword||!confirmNewPassword)}
                                onClick={handleSubmit}
                            >{t("common:CONFIRM")}</StyledButton>
                        </Grid>
                    </Grid>
                </EAccordion>
            </Grid>
            
            {/* <ConfirmActionModal
                btnText={"Yes"}
                actionModal={true}
                setActionModal={true}
                actionModalTitle={t("common:RESET PASSWORD")}
                actionModalMessage={t("common:ARE YOU SURE YOU WANT TO RESET PASSWORD? THE ACTION IS NOT REVERSIBLE!")}
            /> */}
        </Grid>
    )
}