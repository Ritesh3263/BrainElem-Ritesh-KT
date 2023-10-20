import React, { useEffect, useState } from "react";
import { Typography, Divider, ListItem, ListItemAvatar, ListItemText, ThemeProvider } from "@mui/material";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import StyledButton from "new_styled_components/Button/Button.styled";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import { useTranslation } from "react-i18next";
import NotificationService from "../../services/notification.service";
import List from '@mui/material/List';
import { useMainContext } from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import Avatar from "@material-ui/core/Avatar";
import NotificationsIcon from "@mui/icons-material/Notifications";
import IconButton from "@mui/material/IconButton";
import CheckIcon from '@mui/icons-material/Check';
import { new_theme } from "NewMuiTheme";

export default function NotificationsModal({ notificationModalHelper, setNotificationModalHelper }) {
    const { t } = useTranslation();
    const { F_getHelper,
        setUserNotifications,
        F_getLocalTime
    } = useMainContext();
    const { user } = F_getHelper();
    const [allUserNotifications, setAllUserNotifications] = useState([]);

    // Load and sort all notification for the user
    const loadAllNotifications = () => {
        NotificationService.readUnReadUserNotifications(user.id).then(res => {
            if (res.status === 200 && res.data) {
                let all = res.data
                let read = all.filter(n => n.isRead)
                let unread = all.filter(n => !n.isRead)
                setAllUserNotifications(unread.concat(read))
                setUserNotifications(unread)
            }
        }).catch(err => console.log(err));
    }

    useEffect(() => {
        if (notificationModalHelper.isOpen && user !== null && user !== undefined) {
            loadAllNotifications()
        }
    }, [notificationModalHelper.isOpen]);

    const readNotification = (notificationId) => {
        NotificationService.updateUserNotifications(user.id, notificationId).then(res => {
            if (res.status === 200 && res.data) {
                let copy = [...allUserNotifications]
                let index = copy.map(n => n._id).indexOf(notificationId)
                copy[index].isRead = true;
                let unread = copy.filter(n => !n.isRead)
                setAllUserNotifications(copy)
                setUserNotifications(unread)
            }
        }).catch(err => console.log(err));
    }

    const listAllNotifications = allUserNotifications.length > 0 ? allUserNotifications.map(({ _id, isRead, notification }) => {
        let action = undefined;
        let name = notification?.name ?? '-'
        let content = notification?.content ?? '-'
        let date = notification?.createdAt ? F_getLocalTime(notification.createdAt) : '-'

        if (notification?.type == 'MEETING_STARTED') {
            //action = ()=>{navigate(`/event/${notification.details.eventId}/content/display`)}
            name = t("New meeting started")
            content = t("New meeting started for this event")
        }
        { console.log(notification) }
        return <ListItem key={_id} className='my-2'
            style={{ alignItems: 'flex-start', backgroundColor: isRead ? new_theme.palette.shades.back001 : new_theme.palette.newSupplementary.SupCloudy, borderRadius: '8px', padding: '10px' }}
            secondaryAction={
                <>
                    {!isRead && (
                        <IconButton edge="end" aria-label="read"
                            onClick={() => {
                                setAllUserNotifications(p => {
                                    let newObj = Object.assign([], p);
                                    let foundedIndex = p.findIndex(i => i._id === _id);
                                    if (foundedIndex !== -1) {
                                        newObj[foundedIndex].isRead = true;
                                        return newObj;
                                    } else {
                                        return p;
                                    }
                                });
                                readNotification(_id);
                            }}
                            style={{ backgroundColor: new_theme.palette.shades.white40 }}
                        >
                            <CheckIcon style={{ fill: 'green' }} />
                        </IconButton>
                    )}
                </>
            }
        >
            <ListItemAvatar>
                <Avatar alt="notification" style={{ backgroundColor: isRead ? new_theme.palette.neutrals.grey50 : new_theme.palette.neutrals.grey50 }}>
                    <NotificationsIcon />
                </Avatar>
            </ListItemAvatar>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <ListItemText
                    primary={<Typography variant="h3" component="h3" sx={{color: new_theme.palette.newSupplementary.NSupText, fontWeight: '400', textAlign: 'left'}}>{name}</Typography>}
                    // secondary={content}
                    style={{ margin: '0' }}
                />
                <ListItemText
                    secondary={<Typography variant="subtitle3" component="p" sx={{color: new_theme.palette.shades.black40, fontWeight: '400'}}>{date}</Typography>}
                    style={{margin: '0'}}
                />
            </div>
        </ListItem>
    }) : <span>{t("Notification list is empty")}</span>;

    return (
        <ThemeProvider theme={new_theme}>
            <Dialog
                open={notificationModalHelper.isOpen}
                onClose={() => {
                    setNotificationModalHelper({ isOpen: false });
                }}
                maxWidth={'sm'}
                fullWidth={true}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" className="text-center">
                    <Typography variant="h3" component="h3" sx={{ textAlign: 'left', color: new_theme.palette.primary.MedPurple, paddingBottom: '2px' }}>
                        {t("Notifications")}
                    </Typography>
                    <Divider variant="insert" className='heading_divider' />
                </DialogTitle>
                <DialogContent>
                    <List style={{ width: '100%', }}>
                        {listAllNotifications}
                    </List>
                </DialogContent>

                <DialogActions className="d-flex justify-content-center" >
                    <StyledButton eVariant="primary" size="small" onClick={() => { setNotificationModalHelper({ isOpen: false }); }}>
                        {t("Back")}
                    </StyledButton>
                </DialogActions>
            </Dialog>
        </ThemeProvider>
    )
}