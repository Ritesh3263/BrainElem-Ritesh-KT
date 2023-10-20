import React, {useEffect, useState} from "react";
import {Dialog, DialogTitle, DialogContent, DialogActions, Divider, ThemeProvider } from "@mui/material";
import {useTranslation} from "react-i18next";
import {Avatar, ListItem, ListItemAvatar, ListItemText, Stack, Tooltip} from "@mui/material";
import {EButton} from "styled_components";
import {Typography, Box} from "@mui/material";
import NewDataGrid from "new_styled_components/NewDataGrid";
import { EDataGrid } from "styled_components";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import {renderUserAvatar} from "components/common/UserAvatarHelper";
import moduleCoreService from "services/module-core.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Chip from "@material-ui/core/Chip";
import "../profile.scss";
// import InfoIcon from "@material-ui/icons/Info";
import { Info } from "@mui/icons-material";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";


export default function RolePermissionsPreview(props){
    const{
        rolePermissionPreviewHelper={isOpen:false,roleName:undefined},
        setRolePermissionPreviewHelper=()=>{},
        userPermissions,
    }=props;
    const {t} = useTranslation();
    const {F_getHelper, F_handleSetShowLoader, F_showToastMessage } = useMainContext();
    const {manageScopeIds} = F_getHelper();
    const [rolePermissionsForCurrentRole,setRolePermissionsForCurrentRole] =useState({name:'',permissions:[]});
    
    useEffect(()=>{
        if(rolePermissionPreviewHelper.isOpen && manageScopeIds.moduleId){
            F_handleSetShowLoader(true);
            moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
                if(res.data?.rolePermissions?.length>0){
                    let found = res.data.rolePermissions.find(r=> r.name === rolePermissionPreviewHelper.roleName);
                    if(found){
                        setRolePermissionsForCurrentRole(found)
                        F_handleSetShowLoader(false);
                    }else{
                        setRolePermissionsForCurrentRole({name:'',permissions:[]});
                        F_handleSetShowLoader(false);
                        console.log("==>",res.data.rolePermissions)
                        F_showToastMessage(`${t('Can\'t find role permissions for')}: ${rolePermissionPreviewHelper.roleName}`, "error");
                    }
                }
            }).catch(error=>{
                console.error(error)
                F_handleSetShowLoader(false);
            });
        }
    },[rolePermissionPreviewHelper]);

    // const renderUserAvatar=(role)=>{
    //     switch (role){
    //       case "Root": return "Root";
    //       case "EcoManager": return "EcoMan";
    //       case "Partner": return "Partner";
    //       case "Inspector": return "Inspector";
    //       case "TrainingManager": return "ClassMan";
    //       case "NetworkManager": return "NetworkMan";
    //       case "ModuleManager": return "ModuleMan";
    //       case "Assistant": return "ModuleMan"; 
    //       case "Coordinator": return "Architect";
    //       case "Architect": return "Coordinator";
    //       case "Librarian": return "Librarian";
    //       case "Trainee": return "Student";
    //       case "Parent": return "Parent";
    //       case "Trainer": return userPermissions.isClassManager? "ClassMan" : "Teacher";
    //       default:  return "Student";
    //     }
    //   }



    // const permissionsList = rolePermissionsForCurrentRole.permissions?.length>0 && rolePermissionsForCurrentRole.permissions.map(p=>(
    //     <Grid item xs={12} key={p} className='my-2'>
    //         <Grid container className='d-flex justify-content-center align-items-center'>
    //             <Grid item xs={4} md={3} className='d-flex flex-row' alignItems='center'>
    //                 <Typography variant="subtitle3" component="h2" className="text-left text-justify" style={{color: new_theme.palette.newSupplementary.NSupText}}>
    //                     {p?.name??'-'}
    //                 </Typography>
    //                 <Tooltip title={t(`${p?.descriptions??'-'}`)}>
    //                     <Chip color="" size="small" className="ml-1" 
    //                           icon={<Info style={{fill:new_theme.palette.primary.PBorder}}/>}
    //                     />
    //                 </Tooltip>
    //             </Grid>
    //             <Grid item xs={4} md={3} >
    //                 <Typography variant="body1" component="h2" className="text-center text-justify" style={{color: new_theme.palette.newSupplementary.NSupText}}>
    //                     {p?.access ? <CheckIcon/> : <CloseIcon/>}
    //                 </Typography>
    //             </Grid>
    //             <Grid item xs={4} md={3} >
    //                 <Typography variant="body1" component="h2" className="text-center text-justify" style={{color: new_theme.palette.newSupplementary.NSupText}}>
    //                     {p?.edit ? <CheckIcon/> : <CloseIcon/>}
    //                 </Typography>
    //             </Grid>
    //         </Grid>
    //     </Grid>
    //     ));


    const [rows, setRows] = useState([]);
    const RolePermisionList = rolePermissionsForCurrentRole.permissions?.length>0 ? rolePermissionsForCurrentRole.permissions.map((item, index) =>
    ({
        id: index + 1,
        name: item.name,
        description: item.descriptions,
        access: item.access,
        edit: item.edit
    })) : [];

    const columns = [
        { field: 'name', headerName: t('Resource'), flex: 1, maxWidth: 250, sortable: true, disableColumnMenu: true,
            renderCell: (params) => (
                <>
                    {params.row.name}
                </>
            )
        },
        { field: 'description', headerName: t('Description'), cellClassName:'permission_description', flex: 1, sortable: false, disableColumnMenu: true,
            renderCell: (params) => (
                <>
                    {params.row.description}
                </>
            )
        },
        { 
            field: 'access', headerName: t('View'), maxWidth: 130, flex: 1,
            renderCell: (params) => (
                <>
                    {params.row.access ? "Yes" : "No"}
                </>
            )
        },

        
        {
            field: 'edit', headerName: t('Edit'), maxWidth: 100, flex: 1,
            renderCell: (params) => (
                <>
                     {params.row.edit ? "Yes" : "No"}
                     
                </>
            )
        },
    ];

    useEffect(() => {
        setRows(RolePermisionList);
    }, [rolePermissionsForCurrentRole]);

    return(
        <ThemeProvider theme={new_theme}>
            <Dialog
                PaperProps={{
                        style:{borderRadius: "16px", padding: '24px'}
                }} 
                open={rolePermissionPreviewHelper.isOpen}
                onClose={()=>setRolePermissionPreviewHelper({isOpen:false,roleName:undefined})}
                maxWidth={'md'}
                fullWidth={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2}}>
                    <Typography variant="h3" component="h3" className="text-left" sx={{color: new_theme.palette.newSupplementary.NSupText}}>
                        {t("Preview")} {rolePermissionPreviewHelper.roleName}
                    </Typography>
                    <StyledEIconButton color="primary" size="medium" onClick={()=>{setRolePermissionPreviewHelper({isOpen: false, roleName: undefined})}}>
                        <CloseIcon />
                    </StyledEIconButton>
                    {/* <Divider variant="insert" className='heading_divider' /> */}
                </Box>
                <Box>
                    <NewDataGrid
                        rows={rows}
                        columns={columns}
                        setRows={setRows}
                        originalData={RolePermisionList}
                        isVisibleToolbar={true}
                    />
                </Box>
                {/* <DialogContent>
                    <Grid container >
                        <Grid item xs={12}>
                            <List dense className='d-flex flex-fill flex-column'>
                                <ListItem className='pl-0 pt-0'>
                                    <ListItemAvatar>
                                        <Avatar style={{width:"40px", height:"40px"}} src={`/img/user_icons_by_roles/${renderUserAvatar(rolePermissionPreviewHelper.roleName, userPermissions)}.png`} alt="user-icon-avatar"/>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle3" component="h2" className="text-left text-justify" style={{color: new_theme.palette.newSupplementary.NSupText, fontSize:'22px'}}>
                                                {rolePermissionPreviewHelper.roleName}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={12} className='mt-3 prof-setting-tbl-scroll'>
                            <Grid container className="prof-setting-tbl">
                                <Grid item xs={12} style={{backgroundColor:new_theme.palette.newSupplementary.SupCloudy}}>
                                    <Grid container className='d-flex justify-content-center align-items-center'>
                                        <Grid item xs={4} md={3}>
                                            <Typography variant="subtitle3" component="h2" className="text-left text-justify" style={{color: new_theme.palette.primary.MedPurple, fontSize:'20px'}}>
                                                {t("Resource")}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <Typography variant="subtitle3" component="h2" className="text-center text-justify" style={{color: new_theme.palette.primary.MedPurple, fontSize:'20px'}}>
                                                {t("Access")}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={4} md={3}>
                                            <Typography variant="subtitle3" component="h2" className="text-center text-justify" style={{color: new_theme.palette.primary.MedPurple, fontSize:'20px'}}>
                                                {t("Edit")}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    
                                </Grid>
                                {permissionsList}
                            </Grid>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{p:3}}>
                    <Stack direction='row' alignItems="center" justifyContent="flex-end" spacing={0} className="d-flex flex-fill">
                        <StyledButton eSize='small' eVariant='primary'
                                onClick={()=>{setRolePermissionPreviewHelper({isOpen: false, roleName: undefined})}}
                        >{t('Back')}</StyledButton>
                    </Stack>
                </DialogActions> */}
            </Dialog>
        </ThemeProvider>
    )
}