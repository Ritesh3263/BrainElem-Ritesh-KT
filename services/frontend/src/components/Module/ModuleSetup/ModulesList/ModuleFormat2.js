import React, {useEffect, useState} from "react";
import Typography from "@material-ui/core/Typography";
import {theme} from "MuiTheme";
import {
    Card,
    CardHeader,
    CardContent,
    Grid,
    MenuItem,
    CardActionArea,
    CardActions,
    FormHelperText
} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import ModuleService from "services/module.service";
import TextField from "@material-ui/core/TextField";
// import FormControl from "@material-ui/core/FormControl";
// import InputLabel from "@material-ui/core/InputLabel";
// import Select from "@material-ui/core/Select";
import {Chip, FormControl, InputLabel, Select} from "@material-ui/core";
import { Stack } from "@mui/material";
import {EButton} from "styled_components";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import {useNavigate} from "react-router-dom";
import { Box } from "@mui/system";
import ESvgIcon from "styled_components/SvgIcon";
import EIconButton from "styled_components/EIconButton";
import { ReactComponent as DeleteIcon } from 'icons/icons_32/Delete_32.svg';
import ConfirmActionModal from "../../../common/ConfirmActionModal";

const initialState={
    name:'',
    currentManagers:[],
    expires:'',
    usersLimit:100,
    moduleType:'TRAINING',
    status: true,
    language: 'en',
    description: '',
    isActive: true
}

export default function ModuleFormat2(props){
    const {t} = useTranslation();
    const{
        editFormHelper={},
        setEditFormHelper= isOpen=>{},
    }=props;
    const navigate = useNavigate();
    const { F_showToastMessage, F_getErrorMessage, F_handleSetShowLoader, F_getHelper } = useMainContext();
    const {manageScopeIds:{subscriptionId}} = F_getHelper();
    const [currentModule, setCurrentModule] = useState(initialState);
    const [currentManagers, setCurrentManagers] =useState([]);
    const [allManagers, setAllManagers] =useState([]);
    const [errors, setErrors] = useState({});
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false});

    useEffect(()=>{
        if(actionModal.returnedValue){
            remove();
        }
    },[actionModal.returnedValue]);

    useEffect(()=>{
        setAllManagers([]);
        F_handleSetShowLoader(true);
        setErrors({});
        if(editFormHelper.isOpen && editFormHelper.moduleId !== 'NEW'){
            ModuleService.read(editFormHelper.moduleId).then(res => {
                if(res.status === 200 && res.data){
                    setCurrentModule(res.data);
                }
            }).catch((errors) => console.error(errors));

            
            ModuleService.getListOfFreeAllModuleManagers(editFormHelper.moduleId).then(res => {
                if(res.status === 200 && res.data?.length>0){
                    setAllManagers(res.data)
                    ModuleService.getManagersInModule(editFormHelper.moduleId).then(res2=> {
                        if(res2.status === 200 && res2.data?.length>0){
                            let managerIds = res2.data.map(m=>m._id);
                            setCurrentManagers(res.data.filter(m=>managerIds.includes(m._id)));
                        }
                    }).catch(err=>{console.log(err)});
                }
            }).catch(err=>{console.log(err)});

        }else{
            ModuleService.getListOfFreeAllModuleManagers("new").then(res => {
                if(res.status === 200 && res.data?.length>0){
                    setAllManagers(res.data)
                }
            }).catch(err=>{console.log(err)});
            setCurrentModule(initialState);
            setCurrentManagers([]);
        }
        F_handleSetShowLoader(false);
    },[editFormHelper]);

    const handleChange = (event) => {
        const {
          target: { value },
        } = event;
        setCurrentManagers(
          // On autofill we get a stringified value.
          typeof value === 'string' ? value.split(',') : value,
        );
      };
    function remove(){
        ModuleService.remove(editFormHelper.moduleId).then(res=>{
            F_showToastMessage(t(res.data.message),"success");
            setEditFormHelper({isOpen: false, openType: undefined, moduleId: undefined});
        }).catch(err=>console.log(err))
    }
    const save=()=>{
        currentModule.currentManagers = currentManagers;
        if(editFormHelper.moduleId === 'NEW'){
            ModuleService.add(currentModule, subscriptionId).then((res) => {
                setErrors({});
                setEditFormHelper({isOpen: false, moduleId: undefined});
                F_showToastMessage(t("Data was created"), "success");
            }).catch(err => {
                setErrors(err.response.data.message.errors);
                console.error(err)
            });
        }else{
            ModuleService.update(currentModule).then((res) => {
                setErrors({});
                setEditFormHelper({isOpen: false, moduleId: undefined});
                F_showToastMessage(t("Data was updated"), "success");
            }).catch(err => {
                setErrors(err.response.data.message.errors);
                console.error(err)
            })
        }
    };

    const checkErrors = () => {
      if(currentModule.name?.length<3){
          setErrors(p=>({name:{message: 'Field error'}}))
      }else if(currentManagers?.length<1){
          setErrors(p=>({currentManagers:{message: 'Field error'}}))
      }else {
          save();
      }
    }

    const allManagersList = allManagers?.length>0 ? allManagers.map(i=><MenuItem key={i._id} value={i}>{`${i?.name??'-'} ${i?.surname??'-'}`}</MenuItem>) : [];

    return(
        <Card  className="pt-2 pl-2 d-flex flex-column m-0 ">
            <CardHeader className='pb-0 pt-0' title={(
                <Typography variant="h3" component="h5" className="text-left" style={{fontSize:"32px"}}>
                    { currentModule.name || t("Add new module")}
                </Typography>
            )}
            />
            <CardContent>
                <Grid container spacing={2}>
                    <Grid item xs={12} className='d-flex justify-content-end'>
                        <EButton eSize='small' eVariant='secondary'
                                 onClick={()=>{navigate("/modules/managers/form/new");}}
                                 startIcon={<AddCircleOutlineIcon/>}
                        >{t("Create manager")}</EButton>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField  style={{maxWidth:'400px'}}
                                    fullWidth={true}
                                    label={t("Module name")}
                                    error={'name' in errors}
                                    margin="normal"
                                    name='name'
                                    variant="filled"
                                    helperText={'name' in errors && 'required'}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    value={currentModule?.name}
                                    onChange={({target:{name,value}})=>{
                                        setCurrentModule(p=>({...p,name: value}))
                                    }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl style={{maxWidth:"400px"}} margin="normal" variant="filled" fullWidth={true}>
                            <InputLabel id="demo-simple-select-label">{t("Assign manager")}</InputLabel>
                            <Select
                                multiple={true}
                                error={'currentManagers' in errors}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currentManagers}
                                // renderValue={p=> `${p?.name??'-'} ${p?.surname??'-'}`}
                                renderValue={(selected) => {
                                    return (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                      {selected.map((value) => (
                                        <Chip key={value._id} label={value.name} />
                                      ))}
                                    </Box>
                                  )}}
                                // onChange={({target:{value}}) => {
                                //     setCurrentManagers(value);
                                // }}
                                onChange={handleChange}
                            >
                                {allManagersList}
                            </Select>
                            {'currentManager' in errors ? (<FormHelperText className="text-danger">{t("required")}</FormHelperText>) : null}
                        </FormControl>
                    </Grid>
                    {/* <Grid item xs={6}>
                        <TextField
                            fullWidth={true}
                            variant="filled"
                            label={t("Expires")}
                            style={{ maxWidth: "400px" }}
                            margin="normal"
                            type="date"
                            helperText={t("no selected = NEVER")}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            value={currentModule.expires}
                            onChange={({target:{value}}) => {
                                setCurrentModule(p=>({...p,expires: value}))
                            }}
                        />
                    </Grid> */}
                    <Grid item xs={6}>
                        <TextField
                            fullWidth={true}
                            variant="filled"
                            label={t("Users limit")}
                            style={{ maxWidth: "400px" }}
                            margin="normal"
                            InputLabelProps={{
                                shrink: true,
                            }}
                            type="number"
                            InputProps={{ inputProps: { min: 0, max: 1000 } }}
                            value={currentModule.usersLimit}
                            onChange={({target:{value}}) => {
                                setCurrentModule((p=>({...p,usersLimit: value})));
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl
                            fullWidth={true}
                            style={{ maxWidth:'400px'}}
                            disabled={editFormHelper.moduleId !== 'NEW'}
                            variant="filled" margin="normal"
                        >
                            <InputLabel id="demo-simple-select-label" >{t("Module type")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currentModule.moduleType === "SCHOOL" ? "SCHOOL" : currentModule.moduleType === "TRAINING" ? "TRAINING" : "Cognitive(+Training)"}
                                onChange={({target:{value}}) => {
                                    setCurrentModule(p=>({...p,moduleType: value}));
                                }}
                            >
                                <MenuItem value={"SCHOOL"}>{t("SCHOOL")}</MenuItem>
                                <MenuItem value={"TRAINING"}>{t("TRAINING")}</MenuItem>
                                <MenuItem value={"Cognitive(+Training)"}>{t("COGNITIVE(+TRAINING)")}</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl
                            style={{ maxWidth: "400px"}}
                            fullWidth={true}
                            margin="normal"
                            variant="filled"
                        >
                            <InputLabel id="demo-simple-select-label" margin="normal">{t("Status")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currentModule.isActive ? 1 : 0}
                                onChange={({target:{value}}) => {
                                    setCurrentModule(p=>({...p,isActive: value}))
                                }}
                            >
                                <MenuItem value={1} className="text-success">
                                    {t("Active")}
                                </MenuItem>
                                <MenuItem value={0} className="text-danger">
                                    {t("inActive")}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl
                            fullWidth={true}
                            style={{ maxWidth:'400px'}}
                            variant="filled" margin="normal"
                        >
                            <InputLabel id="demo-simple-select-label">{t("Language")}</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={currentModule.language === "en" ? "en" : "fr"}
                                onChange={({target:{value}}) => {
                                    setCurrentModule(p=>({...p,language: value}))
                                }}
                            >
                                <MenuItem value={"en"}>EN</MenuItem>
                                <MenuItem value={"fr"}>FR</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth={true}
                            margin="normal"
                            variant="filled"
                            style={{maxWidth: "400px"}}
                            id="outlined-multiline-static"
                            multiline
                            rowsMax={4}
                            label={t("Description")}
                            value={currentModule.description}
                            onChange={({target:{value}}) =>{
                                setCurrentModule(p=>({...p,description: value}));
                            }}
                        />
                    </Grid>
                </Grid>
            </CardContent>
            <CardActionArea>
                <CardActions>
                    <Stack direction='row' alignItems="center" justifyContent="space-between" spacing={0} className="d-flex flex-fill">
                        <EButton eSize='small' eVariant='secondary'
                                 onClick={()=>{setEditFormHelper({isOpen: false, moduleId: undefined})}}
                        >{t('Back')}</EButton>
                        {editFormHelper.moduleId !== "NEW" ? (
                        <EIconButton size="small" variant="contained" color="secondary" onClick={()=>setActionModal({isOpen: true, returnedValue: false})}>
                            <ESvgIcon viewBox="0 0 32 32" component={DeleteIcon} />
                        </EIconButton>
                        ) : null}
                        <EButton eSize='small' eVariant='primary'
                                 onClick={checkErrors}
                        >{t('Save')}</EButton>
                    </Stack>
                </CardActions>
            </CardActionArea>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing module")}
                                actionModalMessage={t("Are you sure you want to remove module? The action is not reversible!")}
            />
        </Card>
    )
}