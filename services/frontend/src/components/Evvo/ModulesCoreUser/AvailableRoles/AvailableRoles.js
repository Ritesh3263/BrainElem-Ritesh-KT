import React, {useEffect, useState} from "react";
import Grid from "@mui/material/Grid";
import {Checkbox, Divider, FormControlLabel, FormGroup, ListSubheader} from "@material-ui/core";
import {useTranslation} from "react-i18next";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import SearchField from "components/common/Search/SearchField";
import TableSearch from "components/common/Table/TableSearch";
import Chip from "@mui/material/Chip";
import CommonDataService from "services/commonData.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { theme } from "MuiTheme";
import {EButton} from "styled_components";

export default function AvailableRoles({editFormHelper, setEditFormHelper, currentUser, setCurrentUser}){
    const { t } = useTranslation();

    const {F_getHelper, F_hasPermissionTo} = useMainContext();
    const {manageScopeIds, user} = F_getHelper();
    const [searchingText, setSearchingText] = useState('');
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);
    const [filteredData,setFilteredData] = useState([]);
    const [currentDefaultRole, setCurrentDefaultRole] = useState('');
    const [availableRoles, setAvailableRoles] = useState([]);

    useEffect(() => {
        if(currentUser){
            setCurrentDefaultRole(currentUser.settings.role);
        }
    }, []);

    useEffect(()=>{
        CommonDataService.readAvailableRoles(manageScopeIds?.isTrainingCenter).then(res=>{
            if(res?.status === 200 && res?.data){
                updateSelected(res.data)
            }
        }).catch(err=>console.log(err));
    },[currentUser]);

    useEffect(()=>{
        setFilteredData(availableRoles);
        if (currentUser.settings.availableRoles.length===0 ) {
            if (currentUser.settings.role){
                setCurrentDefaultRole('');
                setCurrentUser(p=>({...p, settings: {...p.settings, role: '', defaultRole: ''}}));
            }
        } else if (!currentUser.settings.availableRoles.includes(currentUser.settings.role)) {
            setCurrentDefaultRole(currentUser.settings.availableRoles[0])
            setCurrentUser(p=>({...p, settings: {...p.settings, role: currentUser.settings.availableRoles[0], defaultRole: currentUser.settings.availableRoles[0]}}));
        }
    },[availableRoles]);

    const updateSelected=(mainItems=[])=>{
        let selectedList = mainItems?.map(co=>{
            currentUser?.settings?.availableRoles?.map(chC=>{
                if(co.roleName === chC){
                    co.isSelected = true;
                }
            })
            return co;
        });
        setAvailableRoles(selectedList);
    };

    const disableSelection = (item) => {
        // if (item?.roleName === 'TrainingManager' && !F_hasPermissionTo('assign-training-manager')) return true;
        if (item?.roleName === 'TrainingManager' && !F_hasPermissionTo('manage-session')) return true;
        if (item?.roleName === 'Trainer' && !F_hasPermissionTo('assign-trainer')) return true;
        // add more roles when needed
        if (currentUser.settings.availableRoles.length === 1 && item?.isSelected) return true;
        if (item?.roleName === "Assistant" && user.role === "Assistant") return true;
        return false;
    }

    const allRolesList = filteredData.map((item,index)=>(
        <FormControlLabel
            label={item?.roleName}
            control={
                <Checkbox style={{color:`rgba(82, 57, 112, 1)`}}
                          checked={!!item?.isSelected}
                          disabled={disableSelection(item)}
                          name={item?.name}
                          value={index}
                          onChange={(e,isS)=>{
                              if(isS){
                                roleAction({type: 'ADD', value: item?.roleName})
                              }else{
                                  roleAction({type: 'REMOVE', value: item?.roleName})
                              }
                          }}
                />
            }
        />
    ));

    const roleAction=(action)=>{
        if(action.type === 'ADD'){
            let availableRoles = [...currentUser?.settings?.availableRoles,action.value];
            setCurrentUser(p=>({...p, settings: {...p.settings, availableRoles}}));
            setEditFormHelper(p=>({...p, isBlocking: true}))
        }else if(action.type === 'REMOVE'){
            let availableRoles = currentUser?.settings?.availableRoles?.filter(r=> r !== action.value);
            setCurrentUser(p=>({...p, settings: {...p.settings, availableRoles, role: availableRoles.includes(currentUser.settings.role)? currentUser.settings.role : availableRoles[0]}}))
            if (!availableRoles.includes(currentUser.settings.role)) setCurrentDefaultRole(availableRoles[0]);
            setEditFormHelper(p=>({...p, isBlocking: true}))
        }
    };

    const rolesList = currentUser?.settings?.availableRoles?.length>0 ? currentUser?.settings?.availableRoles?.map((role,index)=><MenuItem key={index} value={role}>{role}</MenuItem>):[]

    return(
        <Grid container>
            <Grid item xs={12} className='mt-1'>
                <small style={{color: `rgba(82, 57, 112, 1)`}} className='mt-3'>{t("Manage available roles")}</small>
                <Divider variant="insert" />
            </Grid>
            <Grid item xs={12} className='mt-4'>
                <Grid container>
                    <Grid item xs={12} md={6}>
                        {currentUser?.settings?.availableRoles?.length>0 ? (
                            <>
                                {currentUser?.settings?.availableRoles.map(ar=>(
                                    <Chip label={ar} className='m-1'
                                          style={{backgroundColor:'rgba(82, 57, 112, 1)', color: 'rgba(255,255,255,0.9)'}}
                                          disabled={editFormHelper.openType === 'PREVIEW'}
                                          onDelete={()=>{if(currentUser.settings.availableRoles.length!==1 && !['ModuleManager','Assistant'].includes(ar) && !(ar==="Assistant" && currentUser.settings.role==="Assistant")) roleAction({type:'REMOVE', value: ar})}}
                                    />
                                ))}
                            </>
                        ): (
                            <>
                            <p>{t("Assign avaliables roles to user")}</p>
                            <p>{t("Then You can select default role")}</p>
                            </>
                        )}
                    </Grid>
                    <Grid item xs={12} md={6} className="d-flex align-items-start justify-content-end">
                    {['ModuleManager','Assistant'].includes(user?.role) && !['ModuleManager','Assistant'].includes(currentUser?.settings.role) && ( 
                        <EButton eVariant="contained" eSize="small"
                                disabled={editFormHelper.openType === 'PREVIEW'}
                                onClick={()=>{setIsOpenDrawer(true)}}
                                >{t("Select available roles")}</EButton>
                    )}
                    </Grid>
                    <Grid item xs={12} md={6} className="d-flex align-items-start mt-4">
                        {currentUser?.settings?.availableRoles?.length>0 && (
                            <FormControl style={{maxWidth:'400px'}} fullWidth={true}
                                         variant={editFormHelper.openType === 'PREVIEW' ? 'standard':"filled"}
                            >
                                <InputLabel id="demo-simple-select-label">{t("Select user's default role")}</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={currentDefaultRole}
                                    readOnly={editFormHelper.openType === 'PREVIEW'}
                                    disableUnderline={editFormHelper.openType === 'PREVIEW'}
                                    onChange={({target:{value}}) => {
                                        setCurrentDefaultRole(value);
                                        setCurrentUser(p=>({...p, settings: {...p.settings, role: value, defaultRole: value}}));
                                        setEditFormHelper(p=>({...p, isBlocking: true}));
                                    }}
                                >
                                    {rolesList}
                                </Select>
                            </FormControl>
                        )}
                    </Grid>
                </Grid>
            </Grid>
            <SwipeableDrawer
                PaperProps={{
                    style:{
                        backgroundColor: theme.palette.neutrals.white,
                        maxWidth:"450px"
                }}}
                anchor="right"
                onOpen=""
                open={isOpenDrawer}
                onClose={()=>{
                    setIsOpenDrawer(false);
                    setSearchingText('');
                }}
            >
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    subheader={
                        <ListSubheader disableSticky= "true" component="div" id="nested-list-subheader">
                            <Grid container  className="py-2">
                                <Grid item xs={12}>
                                <Typography variant="h3" component="h2" className="mt-2 text-center text-justify" style={{fontSize:"32px"}}>
                                    {t("Manage available roles")}
                                </Typography>    
                                </Grid>
                                <Grid item xs={12} className='px-3 mb-2'>
                                        <SearchField
                                            className="text-primary"
                                            value={searchingText}
                                            onChange={({target:{value}})=>{TableSearch(value, availableRoles, setSearchingText, setFilteredData)}}
                                            clearSearch={()=>TableSearch('', availableRoles, setSearchingText, setFilteredData)}
                                        />
                                </Grid>
                            </Grid>
                        </ListSubheader>}
                >
                    <FormGroup className="pl-3">
                        {(allRolesList?.length>0) ? allRolesList : <span>{t("No data")}</span>}
                    </FormGroup>
                </List>
            </SwipeableDrawer>
        </Grid>
    )
}