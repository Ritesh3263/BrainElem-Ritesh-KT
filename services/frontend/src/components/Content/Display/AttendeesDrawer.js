import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { Box, Grid, Drawer, ListItem, Typography } from '@mui/material';

import EUserAvatar from "styled_components/atoms/UserAvatar";
import EVerticalProperty from "styled_components/VerticalProperty";
import CommonExpandBar from 'components/common/ExpandBar'

//Contexts
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// Icons
import { ReactComponent as Activity } from 'icons/icons_48/Menu users activity.svg';
import { ReactComponent as Notice } from 'icons/icons_32/Property 1=clock_notice.svg';
import { ReactComponent as Clock } from 'icons/icons_32/Clock.svg';

// MUI v4
import { theme } from "MuiTheme";

// Detect size of the screen
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

function useIsWidthUp(breakpoint) {
    const theme = useTheme();
    return useMediaQuery(theme.breakpoints.up(breakpoint));
}

export default function AttendeesDrawer({ open, setOpen, attendees }) {
    const { F_formatSeconds } = useMainContext();
    const { t } = useTranslation();
    const [attendeesStatus, setAttendeesStatus] = useState([])
    const isSmUp = useIsWidthUp("sm");
    const isMdUp = useIsWidthUp("md");

    useEffect(() => {

    }, [attendees])

    return (
        <Drawer
            sx={{ '& .MuiBackdrop-root': { background: 'transparent' }, '& .MuiPaper-root': { background: `${theme.palette.glass.opaque} !important`, backdropFilter: 'blur(10px)' } }}
            anchor={'right'}
            open={open}
            onClose={() => setOpen(false)}
        >
            <Box sx={{ width: { xs: '300px', md: '520px', lg: '643px' }, minHeight: '100%' }}>
                <Grid container sx={{ px: '40px', py: '32px', height: '100%', alignContent: 'flex-start' }}>
                    <Grid sx={{ pb: '18px' }} container item xs={12}>
                        <Typography sx={{ ...theme.typography.h, fontSize: '24px', color: theme.palette.primary.violet }} >
                            {t("List of users")}
                        </Typography>
                    </Grid>
                    {attendees.map((attendee, i) => {
                        
                        let time = attendee.time??0
                        let activeTime = time - (attendee.inactiveTime??0) - (attendee.awayTime??0)

                        activeTime = F_formatSeconds(activeTime>0?activeTime:0);

                        let inactiveCount = attendee.inactiveCount??0;
                        let inactiveTime = F_formatSeconds(attendee.inactiveTime??0)

                        let awayCount = attendee.awayCount??0;
                        let awayTime = F_formatSeconds(attendee.awayTime??0)
                    
                        let avatarColor = undefined;// Red by default
                        if (attendee.lastActive) avatarColor = theme.palette.primary.yellow
                        if (attendee.lastActive && attendee.isActive) avatarColor  = theme.palette.primary.green


                        // Activity message
                        let activity = t("Never")
                        if (attendee.lastActive && attendee.isActive) activity = t("Now")
                        else if (attendee.lastActive){
                            if (isMdUp) activity = F_formatSeconds(attendee.lastActiveInSeconds) + ' ' + t("ago")
                            else activity = F_formatSeconds(attendee.lastActiveInSeconds) + ' ' + t("ago")
                        }
                        
                        return <Box key={i} sx={{ width: '100%', pb: '8px' }}>
                            <CommonExpandBar
                                text={<Box sx={{display: 'inline-flex'}}>
                                    <EUserAvatar color={avatarColor} name={attendee.name} surname={attendee.surname} sx={{mr: '8px'}}></EUserAvatar>
                                    {attendee.name + " " + attendee.surname}
                                    </Box>} 
                                value={attendeesStatus.includes(i)}
                                textColor={theme.palette.neutrals.almostBlack}
                                barColor={theme.palette.neutrals.white}
                                childColor={theme.palette.shades.white70}
                                setValue={() => {
                                    let statusIndex = attendeesStatus.indexOf(i)
                                    let attendeesStatusCopy = attendeesStatus.slice()
                                    if (statusIndex > -1) attendeesStatusCopy.splice(statusIndex, 1)
                                    else attendeesStatusCopy.push(i)

                                    setAttendeesStatus(attendeesStatusCopy)
                                }
                                }>
                                <Grid container item xs={12} sx={{overflow: 'hidden'}} >
                                    <ListItem><EVerticalProperty Icon={Activity} name={t('Last seen')} value={activity} description={<>{t("When was the user active for the last time inside this event")}</>} fontSize='16px'></EVerticalProperty></ListItem>
                                    <ListItem><EVerticalProperty Icon={Clock} name={t('Active time')} value={activeTime} description={<>{t("Active time which user spend on this event.")}</>} fontSize='16px'></EVerticalProperty></ListItem>
                                    <ListItem><EVerticalProperty Icon={Notice} name={t('Inactive time')} value={inactiveCount + " " + t('times') + "/" + inactiveTime} description={<> {t("How many times and for how long user was inactive. Inactive means that there was no mouse or keyboard activity for more than 30 second.")}</>} fontSize='16px'></EVerticalProperty></ListItem>
                                    <ListItem><EVerticalProperty Icon={Notice} name={t('Out of focus')} value={awayCount + " " + t('times') + "/" + awayTime} description={<>{t("How many times and for how long user was away. This means that user left to other browser tab or other program on his computer.")}</>} fontSize='16px'></EVerticalProperty></ListItem>


                                </Grid>
                            </CommonExpandBar>
                        </Box>
                    }
                    )}
                </Grid>

            </Box>
        </Drawer>
    );
}