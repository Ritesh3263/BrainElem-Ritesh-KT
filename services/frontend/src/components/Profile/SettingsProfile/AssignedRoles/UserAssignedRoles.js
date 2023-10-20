import React, {lazy, useState} from "react";
import {List, ListItem, IconButton, ListItemAvatar, Avatar, ListItemText, ThemeProvider, Box, Grid} from '@mui/material';
import { Visibility } from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import {useTranslation} from "react-i18next";
import {renderUserAvatar} from 'components/common/UserAvatarHelper';
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { new_theme } from "NewMuiTheme";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import StyledButton from "new_styled_components/Button/Button.styled";
import ESwitchWithTooltip from "new_styled_components/SwitchWithTooltip/SwitchWithTooltip.styled";
const RoleSwitcher = lazy(() => import("../../RoleSwitcher"));
const RolePermissionsPreview = lazy(() => import("./RolePermissionsPreview"));

export default function UserAssignedRoles(props){
    const{
        user:{
            settings:{
                role = undefined,
                defaultRole=undefined,
                availableRoles=[],
            }
        },
        showRoleDialog=false,
        setShowRoleDialog=()=>{},
    }=props;
    const {F_getHelper} = useMainContext();
    const {userPermissions} = F_getHelper();
    const {t} = useTranslation();
    const [rolePermissionPreviewHelper,setRolePermissionPreviewHelper] = useState({isOpen: false, roleName: undefined});

    const renderUserAvatar=(role)=>{
        switch (role){
          case "Root": return "Root";
          case "EcoManager": return "EcoMan";
          case "Partner": return "Partner";
          case "Inspector": return "Inspector";
          case "TrainingManager": return "ClassMan";
          case "NetworkManager": return "NetworkMan";
          case "ModuleManager": return "ModuleMan";
          case "Assistant": return "ModuleMan";
          case "Coordinator": return "Architect";
          case "Architect": return "Coordinator";
          case "Librarian": return "Librarian";
          case "Trainee": return "Student";
          case "Parent": return "Parent";
          case "Trainer": return userPermissions.isClassManager? "ClassMan" : "Teacher";
          default:  return "Student";
        }
      }
   const availableRolesList = availableRoles.length>0 ? availableRoles.map((item,index)=> (
        <>
           <TableRow>
               <TableCell align="right">
                   <Typography variant="body4" component="h3" sx={{ textAlign: 'left' }}>
                       {item}
                   </Typography>
               </TableCell>
               <TableCell align="right">
                   <StyledButton eVariant="secondary" eSize="small" onClick={() => setRolePermissionPreviewHelper({ isOpen: true, roleName: item })}>
                       {t('Preview')}
                   </StyledButton>
               </TableCell>
               <TableCell align="right">
                   <ESwitchWithTooltip checked={item === role} />
               </TableCell>
           </TableRow>     


       {/* <ListItem key={index}
                 className='my-1'
                 secondaryAction={
                     <StyledButton variant="secondary" size="small" onClick={()=>setRolePermissionPreviewHelper({isOpen: true, roleName: item})}>
                            {t('Preview')}
                     </StyledButton>
                 }
       >
           <ListItemAvatar>
               <Avatar className="border-card-avtar" src={`/img/user_icons_by_roles/${renderUserAvatar(item, userPermissions)}.png`} alt="user-icon-avatar"/>
           </ListItemAvatar>
           <ListItemText
               primary={
                   <Typography variant="h3" component="h3" className="text-left text-justify role-text" style={{color:new_theme.palette.newSupplementary.NSupText}}>
                    {item}
                   </Typography>
               }
               secondary={item === role ? (
                   <Typography variant="body2" component="h2" className="text-left text-justify role-status" style={{color:new_theme.palette.primary.MedPurple}}>
                       {t("Currently active")}
                   </Typography>
               ) : null}
           />
           <ListItemText
               className='mr-5 mr-mb-0'
               primary={<>
                   {item === defaultRole ? (
                       <Typography variant="h3" component="h2" className="text-right text-justify main-role" style={{color: new_theme.palette.primary.MedPurple}}>
                           {t('Main role')}
                       </Typography>
                   ) : ("")}
                   </>}
           />
       </ListItem> */}
       </>
       )) : (<ListItem>{t("No data")}</ListItem>);

    return(
        <ThemeProvider theme={new_theme}>
            <Grid container>
                <Grid item={12} sx={{mt: 3}}>
                    <Box>
                        <Typography variant="body2" component="h6" sx={{mb:1}}>{t("common:ASSIGNED ROLE")}</Typography>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650, mt:1 }}>
                                <TableHead>
                                <TableRow>
                                    <TableCell>Role Name</TableCell>
                                    <TableCell align="right">Permission details</TableCell>
                                    <TableCell align="right">Set as default role</TableCell>
                                </TableRow>
                                </TableHead>
                                <TableBody>
                                    {availableRolesList}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        
                    </Box>
                </Grid>
            </Grid>
            {/* <List dense className='d-flex flex-fill flex-column border-card'>
                {availableRolesList}
            </List> */}
            <RoleSwitcher showRoleDialog={showRoleDialog} setShowRoleDialog={setShowRoleDialog}  currentUser={props.user}/>
            <RolePermissionsPreview rolePermissionPreviewHelper={rolePermissionPreviewHelper} setRolePermissionPreviewHelper={setRolePermissionPreviewHelper} userPermissions={userPermissions}/>
        </ThemeProvider>
    )
}
