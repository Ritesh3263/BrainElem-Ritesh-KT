import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import {FormGroup, Radio} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from '@mui/material/Switch';
import {EAccordion, EButton} from "styled_components";
import DeleteIcon from '@mui/icons-material/Delete';
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import {useDispatch, useSelector} from "react-redux";
import {userSettingsActions} from "app/features/UserSettings/data";
import ConfirmActionModal from "../../common/ConfirmActionModal";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
import { styled } from '@mui/material/styles';


export default function Notifications(props){
    const{
        currentUser,
        setCurrentUser,
    }=props;
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {connectedDevices} = useSelector(s=>s.userSettings);
    const [actionModal, setActionModal] = useState({isOpen: false, returnedValue: false, removeIndex: undefined});

    useEffect(()=>{
        dispatch(userSettingsActions.fetchConnectedDevices());
    },[]);

    useEffect(()=>{
        if(actionModal.returnedValue){
            deviceActionHandler({type:'REMOVE',item: actionModal.removeIndex})
        }
    },[actionModal.returnedValue]);

    const deviceActionHandler=({type,item, newValue})=>{
        if(type === 'REMOVE'){
            dispatch(userSettingsActions.removeDevice(item));
        }
        if(type === 'UPDATE'){
            let _item = {...item, isNotificationOn: newValue}
            dispatch(userSettingsActions.updateDevice(_item));
        }
    }

    const IOSSwitch = styled((props) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
      ))(({ theme }) => ({
        width: 41,
        height: 20,
        padding: 0,
        '& .MuiSwitch-switchBase': {
          padding: 0,
          margin: 2,
          transitionDuration: '300ms',
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: new_theme.palette.primary.PWhite,
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette.mode === 'dark' ? new_theme.palette.primary.MedPurple : new_theme.palette.primary.MedPurple,
              opacity: 1,
              border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: new_theme.palette.neutrals.lightgreen,
            border: `6px solid ${new_theme.palette.primary.PWhite}`,
          },
          '&.Mui-disabled .MuiSwitch-thumb': {
            color:
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[600],
          },
          '&.Mui-disabled + .MuiSwitch-track': {
            opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
          },
        },
        '& .MuiSwitch-thumb': {
          boxSizing: 'border-box',
          width: 16,
          height: 16,
        },
        '& .MuiSwitch-track': {
          borderRadius: 26 / 2,
          backgroundColor: theme.palette.mode === 'light' ? new_theme.palette.newSupplementary.NSupLightGrey : new_theme.palette.neutrals.almostBlack,
          opacity: 1,
          transition: theme.transitions.create(['background-color'], {
            duration: 500,
          }),
        },
      }));

    const connectedDevicesList = connectedDevices?.map(item=>(
        <Grid item xs={4} key={item._id}>
            <Paper sx={{flexGrow:1, pt:.5}} key={item._id}>
                <Grid container>
                    <Grid item xs={8} sx={{pl:1}}>
                        <Typography variant="body1" component="span" className="text-left font-weight-bold" style={{color: new_theme.palette.secondary.DarkPurple}}>
                            {item?.name || '-'}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{justifyContent:'end', pr:1}}>
                        <IconButton color="secondary" size="small"
                                    onClick={()=>{
                                        setActionModal({isOpen: true, returnedValue: false, removeIndex: item});
                                    }}><DeleteIcon sx={{fontSize:20}}/>
                        </IconButton >
                    </Grid>
                    <Grid item xs={12} sx={{mt:.5, paddingX:1.5, mb: 2}}>
                        <Grid container>

                            <Grid item xs={12} sx={{pt:.5, pb:.5}}>
                                <Typography variant="body2" component="span" className="text-left font-weight-bold" style={{color: new_theme.palette.secondary.DarkPurple}}>
                                    {t("Device token")}:
                                </Typography>
                                <Typography variant="body2" component="span" className="text-left font-weight-bold" style={{paddingLeft:15}}>
                                    {item?.deviceToken || '-'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" component="span" className="text-left" style={{color: new_theme.palette.secondary.DarkPurple}}>
                                    {t("Brand")}:
                                </Typography>
                                <Typography variant="body2" component="span" className="text-left" style={{paddingLeft:15}}>
                                    {item?.brand || '-'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" component="span" className="text-left" style={{color: new_theme.palette.secondary.DarkPurple}}>
                                    {t("Device os")}:
                                </Typography>
                                <Typography variant="body2" component="span" className="text-left" style={{paddingLeft:15}}>
                                    {item?.os || '-'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" component="span" className="text-left" style={{color: new_theme.palette.secondary.DarkPurple}}>
                                    {t("Os version")}:
                                </Typography>
                                <Typography variant="body2" component="span" className="text-left" style={{paddingLeft:15}}>
                                    {item?.osVersion || '-'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" component="span" className="text-left" style={{color: new_theme.palette.secondary.DarkPurple}}>
                                    {t("Model name")}:
                                </Typography>
                                <Typography variant="body2" component="span" className="text-left" style={{paddingLeft:15}}>
                                    {item?.modelName || '-'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" component="span" className="text-left" style={{color: new_theme.palette.secondary.DarkPurple}}>
                                    {t("Product name")}:
                                </Typography>
                                <Typography variant="body2" component="span" className="text-left" style={{paddingLeft:15}}>
                                    {item?.productName || '-'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" component="span" className="text-left" style={{color: new_theme.palette.secondary.DarkPurple}}>
                                    {t("Platform api level")}:
                                </Typography>
                                <Typography variant="body2" component="span" className="text-left" style={{paddingLeft:15}}>
                                    {item?.platformApiLevel || '-'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" component="span" className="text-left" style={{color: new_theme.palette.secondary.DarkPurple}}>
                                    {t("Os build id")}:
                                </Typography>
                                <Typography variant="body2" component="span" className="text-left" style={{paddingLeft:15}}>
                                    {item?.osBuildId || '-'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" component="span" className="text-left" style={{color: new_theme.palette.secondary.DarkPurple}}>
                                    {t("Model id")}:
                                </Typography>
                                <Typography variant="body2" component="span" className="text-left" style={{paddingLeft:15}}>
                                    {item?.modelId || '-'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sx={{mt:2}}>
                                <Typography variant="body2" component="span" className="text-left" style={{color: new_theme.palette.secondary.DarkPurple}}>
                                    {t("Send notification")}:
                                </Typography>
                                        <Switch
                                            sx={{marginLeft:3}}
                                            size='small'
                                            checked={item.isNotificationOn}
                                            onChange={(e,v)=>deviceActionHandler({type:'UPDATE',item, newValue: v})}
                                            name="sendNotifications"
                                            color="primary"
                                        />
                            </Grid>

                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    ));

    return(
        <Grid container>
            <Grid item xs={12}>
                <Typography variant="h2" component="h3" className="text-left text-justify intrest-heading" style={{color:new_theme.palette.newSupplementary.NSupText}} >
                    {t("Notifications")}
                </Typography>
                <hr></hr>
            </Grid>
            <Grid item xs={12} className='mt-4'>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <FormControl margin="dense" className="switch-box">
                            <FormLabel component="span"><small>{t("Remainders about classes and deadlines")}</small></FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    className="switch-m-0"
                                    control={
                                        // <Switch
                                        //     inputProps={{
                                        //         readOnly: true
                                        //     }}
                                        //     checked={!currentUser.details.notifications && currentUser.details.notifications.classes}
                                        //     onChange={(e)=>{
                                        //         setCurrentUser(p=>({...p,details: {...p.details, notifications:{...p.details.notifications, classes: !p.details.notifications.classes}}}))
                                        //     }}
                                        //     name="checkedB"
                                        //     color="primary"
                                        //     disabled="true"
                                        // />
                                        <IOSSwitch sx={{ m: 1 }} defaultChecked 
                                            inputProps={{
                                                readOnly: true
                                            }} 
                                            //  checked={!currentUser.details.notifications && currentUser.details.notifications.classes}
                                            //  onChange={(e)=>{
                                            //      setCurrentUser(p=>({...p,details: {...p.details, notifications:{...p.details.notifications, classes: !p.details.notifications.classes}}}))
                                            //  }}
                                            name="checkedB"
                                            // disabled="true"
                                        />
                                    }
                                    label={!currentUser.details.notifications.classes ? t("On") : t("Off")}
                                />
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl margin="dense" className="switch-box">
                            <FormLabel component="span"><small>{t("System notifications")}</small></FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    className="switch-m-0"
                                    control={
                                        // <Switch
                                        //     inputProps={{
                                        //         readOnly: true
                                        //     }}
                                        //     checked={!currentUser.details.notifications && currentUser.details.notifications.systemNotifications}
                                        //     onChange={(e)=>{
                                        //         setCurrentUser(p=>({...p,details: {...p.details, notifications:{...p.details.notifications, systemNotifications: !p.details.notifications.systemNotifications}}}))
                                        //     }}
                                        //     name="checkedB"
                                        //     color="primary"
                                        //     disabled="true"
                                        // />
                                        <IOSSwitch sx={{ m: 1 }} 
                                            inputProps={{
                                                readOnly: true
                                            }} 
                                            //  checked={!currentUser.details.notifications && currentUser.details.notifications.systemNotifications}
                                            // onChange={(e)=>{
                                            //     setCurrentUser(p=>({...p,details: {...p.details, notifications:{...p.details.notifications, systemNotifications: !p.details.notifications.systemNotifications}}}))
                                            // }}
                                            name="checkedB"
                                            // disabled="true"
                                        />
                                    }
                                    label={!currentUser.details.notifications.systemNotifications ? t("On") : t("Off")}
                                />
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl margin="dense" className="switch-box">
                            <FormLabel component="span"><small>{t("Tips & tricks")}</small></FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    className="switch-m-0"
                                    control={
                                        // <Switch
                                        //     inputProps={{
                                        //         readOnly: true
                                        //     }}
                                        //     checked={!currentUser.details.notifications && currentUser.details.notifications.tricks}
                                        //     onChange={(e)=>{
                                        //         setCurrentUser(p=>({...p,details: {...p.details, notifications:{...p.details.notifications, tricks: !p.details.notifications.tricks}}}))
                                        //     }}
                                        //     name="checkedB"
                                        //     color="primary"
                                        //     disabled="true"
                                        // />
                                        <IOSSwitch sx={{ m: 1 }}  
                                            inputProps={{
                                                readOnly: true
                                            }} 
                                            //  checked={!currentUser.details.notifications && currentUser.details.notifications.tricks}
                                            // onChange={(e)=>{
                                            //     setCurrentUser(p=>({...p,details: {...p.details, notifications:{...p.details.notifications, tricks: !p.details.notifications.tricks}}}))
                                            // }}
                                            name="checkedB"
                                            // disabled="true"
                                        />

                                    }
                                    label={!currentUser.details.notifications.tricks ? t("On") : t("Off")}
                                />
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl margin="dense" className="switch-box">
                            <FormLabel component="span"><small>{t("New courses")}</small></FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    className="switch-m-0"
                                    control={
                                        // <Switch
                                        //     inputProps={{
                                        //         readOnly: true
                                        //     }}
                                        //     checked={!currentUser.details.notifications && currentUser.details.notifications.newCourses}
                                        //     onChange={(e)=>{
                                        //         setCurrentUser(p=>({...p,details: {...p.details, notifications:{...p.details.notifications, newCourses: !p.details.notifications.newCourses}}}))
                                        //     }}
                                        //     name="checkedB"
                                        //     color="primary"
                                        //     disabled="true"
                                        // />
                                        <IOSSwitch sx={{ m: 1 }}  
                                            inputProps={{
                                                readOnly: true
                                            }} 
                                            // checked={!currentUser.details.notifications && currentUser.details.notifications.newCourses}
                                            // onChange={(e)=>{
                                            //     setCurrentUser(p=>({...p,details: {...p.details, notifications:{...p.details.notifications, newCourses: !p.details.notifications.newCourses}}}))
                                            // }}
                                            name="checkedB"
                                            color="primary"
                                            // disabled="true"
                                        />
                                    }
                                    label={!currentUser.details.notifications.newCourses ? t("On") : t("Off")}
                                />
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControl margin="dense" className="switch-box">
                            <FormLabel component="span" ><small>{t("Newsletter")}</small></FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    className="switch-m-0"
                                    control={
                                        // <Switch
                                        //     inputProps={{
                                        //         readOnly: true
                                        //     }}
                                        //     checked={!currentUser.details.notifications && currentUser.details.notifications.newsletter}
                                        //     onChange={(e)=>{
                                        //         setCurrentUser(p=>({...p,details: {...p.details, notifications:{...p.details.notifications, newsletter: !p.details.notifications.newsletter}}}))
                                        //     }}
                                        //     name="checkedB"
                                        //     color="primary"
                                        //     disabled="true"
                                        // />
                                        <IOSSwitch  
                                            sx={{ m: 1 }}
                                            
                                            inputProps={{
                                                readOnly: true
                                            }}
                                            // checked={!currentUser.details.notifications && currentUser.details.notifications.newsletter}
                                            // onChange={(e)=>{
                                            //     setCurrentUser(p=>({...p,details: {...p.details, notifications:{...p.details.notifications, newsletter: !p.details.notifications.newsletter}}}))
                                            // }}
                                            name="checkedB"
                                        />

                                    }
                                    label={!currentUser.details.notifications.newsletter ? t("On") : t("Off")}
                                />
                            </FormGroup>
                        </FormControl>
                    </Grid>
                    {(connectedDevices?.length>0) && (
                        <Grid item xs={12}>
                            <EAccordion
                                headerName={t("Connected devices")}
                                defaultExpanded={false}
                                typoVariant='body2'
                            >
                                <Grid container spacing={1}>
                                    {connectedDevicesList}
                                </Grid>
                            </EAccordion>
                        </Grid>
                    )}
                </Grid>
            </Grid>
            <ConfirmActionModal actionModal={actionModal}
                                setActionModal={setActionModal}
                                actionModalTitle={t("Removing connected mobile device")}
                                actionModalMessage={t("Are you sure you want to remove connected device?")}
            />
        </Grid>
    )
}