import React, {useState, useEffect} from "react";
import {Typography, Box, Button, DialogActions, DialogContent, DialogTitle, List, ListItem, ListItemText, Dialog, IconButton, ListItemSecondaryAction, Badge, Divider} from "@mui/material";
import {useMainContext} from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import AuthService from "services/auth.service";
import CommonDataService from "services/commonData.service";
import SendIcon from '@material-ui/icons/Send';
import { TreeItem, TreeView, Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from '@mui/lab';
import {useTranslation} from "react-i18next";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";


const Periods = ({showPeriodDialog, setShowPeriodDialog}) => {
    const {t} = useTranslation();
    const { F_showToastMessage, F_getHelper } = useMainContext();
    const [allPeriods, setAllPeriods] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(()=>{
        CommonDataService.getAllPeriods().then(res => {
            setAllPeriods(res.data)
        }).catch(err => {
            console.log(err)
        })
    },[])

    useEffect(()=>{
        let User = JSON.parse(localStorage.getItem("user"))
        setUser(User);
    },[showPeriodDialog])

    const periodList = allPeriods?.map((item, index) => (<>
        <Timeline key={index+1}>
            <TimelineItem>
                <TimelineOppositeContent>
                    <Typography variant="h6" component="span">
                        {item.name}
                    </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                    <TimelineDot />
                    <TimelineConnector />
                </TimelineSeparator>
                <TimelineContent>
                    <Typography variant="h6" component="span">
                        {item.periods.map((period, index) => (
                            <Timeline key={index+1}>
                                <TimelineItem>
                                    <TimelineOppositeContent>
                                        <Typography variant="h6" component="span">
                                            {period.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                                        </Typography>
                                    </TimelineOppositeContent>
                                    <TimelineSeparator>
                                        <TimelineDot />
                                        <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <Typography variant="h6" component="span">
                                            {period._id.toString()===user.selectedPeriod ?
                                                <Badge badgeContent={'Selected'} color="primary" />:
                                                <IconButton edge="end" aria-label="selectPeriod" onClick={() =>selectPeriod(period) }>
                                                <SendIcon />
                                            </IconButton>
                                            }
                                        </Typography>
                                    </TimelineContent>
                                </TimelineItem>
                            </Timeline>
                        ))}
                    </Typography>
                </TimelineContent>
            </TimelineItem>
        </Timeline>
    </>))

    const selectPeriod = async (period) => {
        try{
            let res = await AuthService.refreshToken(user.access_token, user.moduleId, user.role, period._id)
        }catch (error) {
            // Resolve error promise from AuthService.refreshToken
        }
        F_showToastMessage(t("Period selected successfully", "success"))
        setShowPeriodDialog(false)
        setTimeout(() => {
            window.location.reload();
          }, 100);
    }

    const clearPeriod = async () => {
        try{
            let res = await AuthService.refreshToken(user.access_token, user.moduleId, user.role, null)
        }catch (error) {
            // Resolve error promise from AuthService.refreshToken
        }
        F_showToastMessage(t("Period cleared successfully", "success"))
        setShowPeriodDialog(false)
        setTimeout(() => {
            window.location.reload();
          }, 100);
    }

  return (<>
        <Dialog open={showPeriodDialog} onClose={() => setShowPeriodDialog(false)} aria-labelledby="form-dialog-title" 
            PaperProps={{
                sx: {
                width: "100%",
                maxWidth: "990px!important",
                },
            }}>
            <DialogTitle id="form-dialog-title">
                <Typography variant="h2" component="h2" className="text-left text-justify" style={{color:new_theme.palette.primary.MedPurple}}>
                    {t("Select Period")}
                </Typography>
                <Divider variant="insert" className='heading_divider' /></DialogTitle>
            <DialogContent>
                <List>
                    {periodList}
                </List>
            </DialogContent>
            {/* flex around button */}
            <DialogActions sx={{justifyContent: 'space-between', p:3}}>
                <StyledButton eSize="medium" eVariant="secondary" onClick={() => setShowPeriodDialog(false)} color="primary">
                    Cancel
                </StyledButton>
                <StyledButton eSize="medium" eVariant="primary" onClick={() => clearPeriod()} color="secondary">
                    Clear selection
                </StyledButton>

            </DialogActions>
        </Dialog>
    </>);
}

export default Periods