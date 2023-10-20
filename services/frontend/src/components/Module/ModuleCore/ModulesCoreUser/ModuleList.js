import { useEffect, useState } from 'react'
import { Dialog, ListItem, ListItemText, DialogContent, DialogActions, Button, DialogTitle, Typography, List, ListItemButton, Grid } from '@mui/material'
import ModuleService from "services/module.service"
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { ECheckbox, EButton } from "styled_components";

const ModuleList = ({open, setOpen, user}) => {
    const { t } = useTranslation();
    const { F_showToastMessage, F_getHelper, F_handleSetShowLoader, F_showToastMessageMui } = useMainContext();
    const [selectedModules, setSelectedModules] = useState([])
    const [selectedRoles, setSelectedRoles] = useState([])
    useEffect(()=>{
        if(user){
            setSelectedModules(()=>user.modules.map(m=>{
                m.isSelected = false
                return m
            }))
        }
    },[open])

    let moduleIds = user.scopes.filter(x=>x.startsWith("modules:all:")).map(x=>x.substring(12))
    const moduleList = selectedModules.filter(x=>moduleIds.includes(x._id)).map(x=>{
        const labelId = `checkbox-list-secondary-label-${x._id}`;
        return (
          <ListItem
            key={x._id}
            disabled={x._id===user.moduleId}
            secondaryAction={
              <ECheckbox
                edge="end"
                disabled={x._id===user.moduleId}
                onChange={(e)=>{
                    setSelectedModules(selectedModules.map(m=>{
                        if(m._id === x._id){
                            m.isSelected = e.target.checked
                        }
                        return m
                    }))
                }}
                checked={x.isSelected||x._id===user.moduleId}
                inputProps={{ 'aria-labelledby': labelId }}
              />
            }
            disablePadding
          >
            <ListItemButton>
              {/* <ListItemAvatar>
                <Avatar
                  alt={`Avatar n°${value + 1}`}
                  src={`/static/images/avatar/${value + 1}.jpg`}
                />
              </ListItemAvatar> */}
              <ListItemText id={labelId} primary={`${x.name}${x._id===user.moduleId?" (Current module)":""}`} />
            </ListItemButton>
          </ListItem>
        );
      })
    const importModule = () => {
        ModuleService.importUsersFromModules(selectedModules.filter(x=>x.isSelected).map(x=>x._id), selectedRoles).then((res)=>{
            setOpen(false)
            F_showToastMessage(res.data.message, "success")
        })
    }
  return (
    <Dialog open={open} onClose={()=>setOpen(false)} fullWidth maxWidth={false}>
        <DialogTitle id="alert-dialog-title" className="text-center">
            <Typography variant="h5" component="h2" className="text-center text-justify" style={{color: `rgba(82, 57, 112, 1)`}}>
                {t("Select module to import all users")}
            </Typography>
        </DialogTitle>
        <DialogContent>
            <Grid xs={12} xm={7} xl={8} className="p-2">
                <Typography variant="h6" component="h2" className="text-center text-justify" style={{color: `rgba(82, 57, 112, 1)`}}>
                    {t("Selected Modules")}
                </Typography>
                <List dense sx={{ width: '100%', minWidth: 120, bgcolor: 'background.paper' }}>
                    {moduleList}
                </List>
            </Grid>
            <Grid xs={12} xm={5} xl={4} className="p-2">
                <Typography variant="h6" component="h2" className="text-center text-justify" style={{color: `rgba(82, 57, 112, 1)`}}>
                    {t("Selected Roles")}
                </Typography>
                <List dense sx={{ width: '100%', minWidth: 120, bgcolor: 'background.paper' }}>
                    {['Partner','Architect','TrainingManager', 'Librarian', 'Trainer', 'Parent', 'Inspector', 'Trainee','Coordinator'].map(x=>{
                        const labelId = `checkbox-list-secondary-label-${x}`;
                        return (
                          <ListItem
                            key={x}
                            secondaryAction={
                              <ECheckbox
                                edge="end"
                                onChange={(e)=>{
                                    setSelectedRoles(prev=>{
                                        if(e.target.checked){
                                            return [...prev, x]
                                        }
                                        return prev.filter(y=>y!==x)
                                    })
                                }}
                                checked={selectedRoles.includes(x)}
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            }
                            disablePadding
                          >
                            <ListItemButton>
                              <ListItemText id={labelId} primary={x} />
                            </ListItemButton>
                          </ListItem>
                        );
                    })}
                </List>
            </Grid> 
        </DialogContent>
        <DialogActions className="d-flex justify-content-end ml-3 mr-3">
                <EButton eVariant="secondary" eSize="small" onClick={()=>setOpen(false)}>
                    {t("Cancel")}
                </EButton>
                <EButton eVariant="primary" eSize="small" onClick={importModule}>
                    {t("Import")}
                </EButton>
            </DialogActions>
    </Dialog>
  )
}

export default ModuleList