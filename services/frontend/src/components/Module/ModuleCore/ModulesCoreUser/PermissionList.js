import { useEffect, useState } from 'react'
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider'
import { useTranslation } from 'react-i18next'
import { Divider, Grid, List, ListItem, ListItemSecondaryAction, ListItemText, Paper, Switch, ThemeProvider } from '@mui/material'
import ESwitchWithTooltip from "styled_components/SwitchWithTooltip";
import { Box } from '@mui/system';
import { new_theme } from 'NewMuiTheme';

export default function PermissionList ({
  editFormHelper,
  setEditFormHelper,
  currentUser,
  setCurrentUser,
}) {
  const { t } = useTranslation()
  const { F_getHelper, F_handleSetShowLoader, F_getErrorMessage, F_showToastMessage } = useMainContext()
  const { user:{moduleId} } = F_getHelper()
  const [disabledPermissions, setDisabledPermissions] = useState(() => (
    currentUser.settings.permissions?.assistant?.find((assistant) => assistant.module === moduleId)?.disallowed || []
  ))
  const [allPermissions, setAllPermissions] = useState([ // tto be loaded from model list
    // 'create-user',
    // 'update-user',
    // 'remove-user',
    // 'assign-role',
    'manage-user',
    'create-company',
    'create-subjects-and-chapters',
    // 'create-chapters',
    'answer-to-inquiry',
    'create-competences',
    'create-course',
    'create-course-path',
    'create-internship',  
    'manage-session', 
    // 'create-class', // shall be used in session, was in SCHOOL
    // 'remove-class', // shall be used in session, was in SCHOOL
    // 'assign-training-manager',
    // 'assign-price',
    // 'assign-course',
  ])

  useEffect(() => {
    setCurrentUser((prev) => {
      const assistant = prev.settings.permissions?.assistant?.find((assistant) => assistant.module === moduleId)
      if (assistant) {
        assistant.disallowed = disabledPermissions
      } else if (prev.settings.permissions) {
        prev.settings.permissions.assistant.push({
          module: moduleId,
          disallowed: disabledPermissions,
        })
      } else {
        prev.settings.permissions = {
          assistant: [{
            module: moduleId,
            disallowed: disabledPermissions,
          }],
        }
      }
      return prev
    })
  }, [])

  const permissionList = allPermissions.map((permission, index) => (
    <Box className={index%2?'alternatingColor':''}>
      <ESwitchWithTooltip 
        name={t(permission.charAt(0).toUpperCase()+permission.replace(/-/g," ").slice(1))} 
        // description={t("")} 
        checked={!disabledPermissions.includes(permission)} 
        onChange={()=>{
          const newPermissions = [...disabledPermissions]
              if (newPermissions.includes(permission)) {
                newPermissions.splice(newPermissions.indexOf(permission), 1)
              } else {
                newPermissions.push(permission)
              }
              setCurrentUser(prev => {
                const newCurrentUser = {...prev}
                if(newCurrentUser.settings.permissions?.assistant){
                  newCurrentUser.settings.permissions.assistant.find((assistant) => assistant.module === moduleId).disallowed = newPermissions
                } else {
                  newCurrentUser.settings.permissions.assistant = [{
                    module: moduleId,
                    disallowed: newPermissions,
                  }]
                }
                return newCurrentUser
              })
              setEditFormHelper(p=>({...p, isBlocking: true}));
              setDisabledPermissions(newPermissions)
        }} 
        // disabled={} 
      />
    </Box>
  ))

  return (
    <ThemeProvider theme={new_theme}>
      <Grid container direction="row">
          <Grid item xs={12} className='mt-1'>
              <small style={{color: new_theme.palette.secondary.DarkPurple}} className='mt-3'>{t("Manage Permissions")}</small>
              <Divider variant="insert" />
          </Grid>
          <Grid item xs={12} className='mt-1'>
            <Paper elevation={4} className='px-2'>
              <List dense sx={{
                '&& .alternatingColor': { bgcolor: new_theme.palette.newSupplementary.SupCloudy },
                '& .MuiListItem-container': {
                  border: `2px solid ${new_theme.palette.newSupplementary.NSupText}`,
                  borderRadius: '4px',
                  transition: 'border-color 0.4s',
                },
                '& .MuiListItem-container:hover': { border: `2px solid ${new_theme.palette.neutrals.grey50}` },
              }}>
                {permissionList}
                  {/* {permissionList.slice(0, Math.ceil(permissionList.length / 2))} // split into half */}
              </List>
            </Paper>
          </Grid>
      </Grid>
    </ThemeProvider>
  )
}