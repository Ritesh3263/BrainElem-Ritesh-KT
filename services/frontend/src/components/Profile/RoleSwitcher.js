import React, {useState, useEffect} from "react";
import {useMainContext} from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import qs from "qs";
import {useTranslation} from "react-i18next";
import { StarBorder } from "@mui/icons-material";
import { Star } from "@mui/icons-material";
import AuthService from "../../services/auth.service";
import Tooltip from '@material-ui/core/Tooltip';
import UserService from "../../services/user.service";
import {Typography, Box, Button, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Dialog, IconButton, ListItemSecondaryAction, Divider} from "@mui/material";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";


export default function RoleSwitcher({showRoleDialog, setShowRoleDialog, currentUser, setCurrentUser}){
    const { t } = useTranslation();
    const [fav, setFav] = useState("");
    const { F_selectRole, F_getHelper } = useMainContext();
    const isTrainingCenter = F_getHelper().manageScopeIds.isTrainingCenter;

    useEffect(()=>{
        setFav(currentUser.settings.defaultRole)
    },[currentUser.settings.defaultRole])

    const [currentSelectionAsDefault, setCurrentSelectionAsDefault] = useState(false);
    
    let [user] = useState(JSON.parse(localStorage.getItem("user")) ?? { modules: [] })

    const roleList = currentUser.settings.availableRoles?.filter(x=>x)
        .filter(item=>{
            if(isTrainingCenter){ // available roles in training center
            return ["Root","EcoManager","NetworkManager","ModuleManager","Trainer","Trainee","Librarian","Inspector",   "Assistant",'Coordinator','TrainingManager','Partner'].includes(item)
            } else { // available roles in school
            return ["Root","EcoManager","NetworkManager","ModuleManager","Trainer","Trainee","Librarian","Inspector",   "Architect","Parent"].includes(item)
            }
        })
        .map((item, index) => (
        <ListItem key={index+1} style={{cursor:"pointer", backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: "8px"}} button
            onClick={() => {setShowRoleDialog(false); F_selectRole(item, fav)}} 
            className="d-flex justify-content-start mb-2">
                <ListItemText primary={`${item}`} secondary={(
                    <Box className="d-flex flex-column">
                    <small>{`Role functions: ${item}`}</small>
                    <>
                        {currentUser.settings.defaultRole === item && <small className="text-danger">{`Main Role!`}</small>}
                        {currentUser.settings.role === item && <small className="text-primary">{`Currently Active!`}</small>}
                    </>
                    </Box>
                )}/>
                <ListItemSecondaryAction>
                    <Tooltip  title={t("Mark as main role!")}>
                        <IconButton edge="end" onClick={()=>setFav(v=>v=item)}>
                            {fav === item? <Star /> : <StarBorder />}
                        </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
        </ListItem>
    ));

    return(<>
        <Dialog open={showRoleDialog} onClose={()=>setShowRoleDialog(false)} maxWidth={"md"} fullWidth={true} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" >
            <DialogTitle id="alert-dialog-title" sx={{mt:1}}>
                
                <Typography variant="h2" component="h2" className="text-left text-justify" style={{color:new_theme.palette.primary.MedPurple}}>
                    {t("Switch My Role")}
                </Typography>
                <Divider variant="insert" className='heading_divider' />
            </DialogTitle>
            <DialogContent>
                <List component="nav" aria-labelledby="nested-list-subheader">
                    {roleList}
                </List>
            </DialogContent>
            <DialogActions  sx={{mb:1, mr:1}}>
                <StyledButton eVariant="primary" eSize="xsmall" onClick={()=>setShowRoleDialog(false)}>
                   {t('Back')}
                </StyledButton>
            </DialogActions>
        </Dialog>
    </>)
}