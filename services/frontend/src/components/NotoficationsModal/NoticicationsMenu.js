import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import { Typography, Badge, ListItem, ThemeProvider, Box } from '@mui/material';
import Menu from "@material-ui/core/Menu";
import List from "@mui/material/List";
import ListItemText from "@material-ui/core/ListItemText";
import {useTranslation} from "react-i18next";
import NotificationService from "services/notification.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import {makeStyles} from "@material-ui/core/styles";
import ListItemButton from "@mui/material/ListItemButton";
import StyledButton from "new_styled_components/Button/Button.styled";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { new_theme } from "NewMuiTheme";

const useStyles = makeStyles((theme) => ({
    listItem:{
        borderRadius: '8px',
        ':hover': {
            backgroundColor:'pink',
        },
    }
}));

export default function NotificationsMenu(props){
    const navigate = useNavigate();
    const classes = useStyles();
    const { t } = useTranslation();
    const {F_getHelper,
        setUserNotifications,
        F_getLocalTime
    } = useMainContext();
    const {user} = F_getHelper();
    const [allUserNotifications,setAllUserNotifications] = useState([]);
    const{
        notificationsMenuAnchorEl=null,
        isNotificationMenuOpen=false,
        setNotificationsMenuAnchorEl=(el)=>{},
        setNotificationModalHelper=({isOpen})=>{},
    }=props;


    // Load and sort all notification for the user
    const loadAllNotifications = () => {
        NotificationService.readUnReadUserNotifications(user.id).then(res=>{
            console.log("hieeeeeee",res);
            if(res.status === 200 && res.data){
                let all = res.data
                let read = all.filter(n=>n.isRead)
                let unread = all.filter(n=>!n.isRead)
                setAllUserNotifications(unread.concat(read))
                setUserNotifications(unread)
            }
        }).catch(err=>console.log(err));
    }

    useEffect(()=>{
        if((notificationsMenuAnchorEl !== null) && user !== null && user !== undefined){
            loadAllNotifications()
        }
    },[notificationsMenuAnchorEl]);

    const goToResultHandler = () => {
        navigate('/myspace')
        setNotificationsMenuAnchorEl(false)
    }

    const readNotification=(notificationId,action)=>{
        NotificationService.updateUserNotifications(user.id,notificationId).then(res=>{
                if(res.data){
                    let copy = [...allUserNotifications]
                    let index = copy.map(n=>n._id).indexOf(notificationId)
                    copy[index].isRead = true;

                    let read = copy.filter(n=>n.isRead)
                    let unread = copy.filter(n=>!n.isRead)

                    setAllUserNotifications(unread.concat(read))
                    setUserNotifications(unread)
                    if(action) action()
                }
                window.location.reload();
        }).catch(err=>console.log(err));
    };

    const formatDate = (date) => {
        let d = new Date(date);
        d = d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
        return d;
    }

    // Display only 10
    const notificationsList = allUserNotifications.length>0 ? allUserNotifications.map(({_id, isRead, notification})=>
        { 
        let action = undefined;
        let name = notification?.name??'-'
        let content = notification?.content??'-'
        let date = notification?.createdAt ? formatDate(notification.createdAt) : '-'
        
        if (notification?.type == 'MEETING_STARTED'){
            action = ()=>{navigate(`/event/${notification.details.eventId}/content/display`)}
            name = t("New meeting started")
            content = t("Click here to open the event")
        }
        if(notification?.type == 'PUSH'){
            action = ()=>{navigate(`${notification.details.webUrl}`,{state:{tabIndex:0}})}
        }

        return (
            <ThemeProvider theme={new_theme}>
        <ListItemButton key={_id} alignItems='center' className='mb-2' classes={classes}
                  button={true}
                  style={{borderBottom: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`}}
                onClick={()=>{
                    if(!isRead){
                        setAllUserNotifications(p=>{
                            let newObj = Object.assign([],p);
                            let foundedIndex = p.findIndex(i=> i._id === _id);
                            if(foundedIndex !== -1){
                                newObj[foundedIndex].isRead = true;
                                return newObj;
                            }else{
                                return p;
                            }
                        });
                        readNotification(_id,action);
                    }
                }}
        >
                <ListItemText
                    style={{width: '0px', display: 'contents', marginRight: '14px'}}
                    primary={ !isRead &&(
                        <Box sx={{height: '10px', width: '10px', borderRadius: '50%', backgroundColor: new_theme.palette.primary.MedPurple}}></Box>
                        // <Badge overlap="circular"
                        //        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                        //        variant='dot'
                        //        className='mr-2'
                        //        sx={{
                        //         "& .MuiBadge-badge": {
                        //           color: new_theme.palette.secondary.DarkPurple,
                        //           backgroundColor: new_theme.palette.secondary.DarkPurple
                        //         }
                        //       }}
                        // />
                    )}
                />
            <ListItemText
                style={{color: new_theme.palette.newSupplementary.NSupText, fontWeight: 'bold', marginLeft: '8px', minWidth: 'auto'}}
                primary={<Typography variant="subtitle3" component="h6">{name}</Typography>}
                secondary={<Typography variant="subtitle1" component="p" sx={{color: new_theme.palette.shades.black40, lineHeight: '1.35'}}>{content}</Typography>}
                sx={{ml: 3}}
            />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'end' }}>
                        <ListItemText
                            className='ml-5'
                            //primary={type}
                            secondary={date}
                            style={{ minWidth: 'auto' }}
                        />
                        <StyledEIconButton color="primary" size="small" >
                            <ChevronRightIcon onClick={goToResultHandler} />
                        </StyledEIconButton>
                    </div>
        </ListItemButton></ThemeProvider>)
    }
    ) : <ListItem><ListItemText primary={(
        <Typography variant="body1"
                    component="h6" className="text-left"
                    style={{color: new_theme.palette.primary.MedPurple}}>
            {t("Notification list is empty")}
            <ArrowForwardIosIcon sx={{color: new_theme.palette.neutrals.almostBlack, fontSize: '20px'}} onClick={goToResultHandler} />
        </Typography>
    )}/></ListItem>;


    return(
        <ThemeProvider theme={new_theme}>
            <Menu dense
                PaperProps={{
                    style:{
                        backgroundColor: new_theme.palette.primary.PWhite
                    }}}
                anchorEl={notificationsMenuAnchorEl}
                style={{top:'55px', right:'55px'}}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                id='notifications-menu'
                keepMounted
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isNotificationMenuOpen}
                onClose={()=>setNotificationsMenuAnchorEl(null)}
            >
                <List className="p-0" style={{width:'450px', margin: '0 12px'}}>
                    {notificationsList}
                    {/* {allUserNotifications?.length>0 && (
                        <ListItem className='p-0 d-flex justify-content-center align-items-center' sx={{marginTop: '18px'}}>
                            <StyledButton
                                eSize='small'
                                eVariant='secondary'
                            >{t('View more')}</StyledButton>
                        </ListItem>
                    )} */}
                </List>
            </Menu>
        </ThemeProvider>
    )
}