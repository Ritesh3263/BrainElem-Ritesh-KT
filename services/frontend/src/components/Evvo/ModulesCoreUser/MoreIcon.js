// Button with additional actions related to BrainCore Test result
// It inludes:
// - Downloading and sending PDF report to the user
// - Sending access to the platform via email 

import React from 'react';
import { useTranslation } from "react-i18next";
import { useMainContext } from 'components/_ContextProviders/MainDataContextProvider/MainDataProvider';


// Serives
import userService from "services/user.service";
import ContentService from "services/content.service";
import ResultService from "services/result.service"
// MUI v5
import { Typography, Divider, MenuItem, SvgIcon, Box } from '@mui/material';


// Components
import ETooltip from "new_styled_components/Tooltip";
import StyledEIconButton from 'new_styled_components/IconButton.js/IconButton.styled';
import StyledMenu from 'new_styled_components/Menu/Menu.styled'
import BrainCoreTestInvitationCalendar from "components/common/BrainCoreTestInvitationCalendar"


// Icons
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ReactComponent as InfoIcon } from 'icons/icons_32/Info_32.svg';


// userId - id of user
// result - users' BrainCore test result
// callback - function to be called after actions
export default function MoreIcon({ userId, result, callback, ...params }) {
    const { t, i18n } = useTranslation(['sentinel-MyUsers-BCTestRegistration', 'sentinel-Admin-Credits', 'common']);
    const { F_showToastMessage, F_handleSetShowLoader, F_getHelper } = useMainContext();
    const { userPermissions } = F_getHelper()
    const [anchorEl, setAnchorEl] = React.useState(null);
    const openMoreMenu = Boolean(anchorEl);
    const [calendarOpen, setCalendarOpen] = React.useState(false)


    const handleOpenMoreMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMoreMenu = (path) => {
        setAnchorEl(null);
    };
    const testType = ContentService.getBraincoreTestTypeForInvitation(result?.content)

    // template - template - 'long', 'short', 'lpdfv2'
    const downloadReportFromOldBrainCoreServer = (template = 'short') => {
        
        setAnchorEl(null);
        F_handleSetShowLoader(true)
        userService.downloadOldCognitiveReport(userId, result?._id, template, 'teacher',
            () => {
                F_handleSetShowLoader(false)
            },
            (error) => {
                F_handleSetShowLoader(false)
                if (error?.message == "NO_RESULTS") F_showToastMessage(t("sentinel-MyUsers-BCTestRegistration:NO RESULTS"), 'error')
                if (error?.message == "BLOCKED_BY_CREDITS") F_showToastMessage(t("sentinel-Admin-Credits:RESULTS BLOCKED BY CREDITS"), 'error')
                else if (error) F_showToastMessage(t("sentinel-MyUsers-BCTestRegistration:COULD NOT DOWNLAD RESULTS"), 'error')
        })
    }

    return <> <StyledEIconButton
        {...params}
        key={userId}
        color="primary"
        size="medium"
        aria-controls={openMoreMenu ? `demo-customized-menu` : undefined}
        aria-haspopup="true"
        aria-expanded={openMoreMenu ? 'true' : undefined}
        disableElevation
        onClick={handleOpenMoreMenu}>
        <MoreVertIcon />

    </StyledEIconButton>
        <StyledMenu
            className="teams_togglemenu"
            id={`demo-customized-menu`}
            MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
            }}
            anchorEl={anchorEl}
            open={openMoreMenu}
            onClose={handleCloseMoreMenu}
        >
            {result &&<Typography variant="subtitle2" component="h6" sx={{ padding: '0 8px' }}>{t("sentinel-MyUsers-BCTestRegistration:BRAINCORE_TEST_REGISTRATION")}</Typography>}
            {result &&<Divider sx={{ my: 0.5 }} />}
            {result && <MenuItem
                onClick={e => {
                    setAnchorEl(null);
                    setCalendarOpen(true)
                }} disableRipple>
                <Typography variant="subtitle3" component="h6" sx={{ fontWeight: 'normal' }}>{t("sentinel-MyUsers-BCTestRegistration:SEND AGAIN")}</Typography>
                <Typography component="span" sx={{ fontSize: '8px' }}>{' ( BrainCore ' +(testType=="adult"?"PRO":"EDU")+" )"}</Typography>
            </MenuItem>}
            <Typography variant="subtitle2" component="h6" sx={{ padding: '0 8px', display: 'inline-block'}}>
                {t("common:DOWNLOAD")+" (PDF)"}
                
                </Typography>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem disabled={!result?._id || result?.blockedByCredits}
                onClick={e => {
                    setAnchorEl(null);
                    F_handleSetShowLoader(true)
                    userService.openCognitiveReport(userId, result?._id, 
                        ()=>{
                            F_handleSetShowLoader(false)
                        },
                        (error) => {
                            console.log('EERRR', error)
                        F_handleSetShowLoader(false)
                        if (error?.message == "NO_RESULTS") F_showToastMessage(t("sentinel-MyUsers-BCTestRegistration:NO RESULTS"), 'error')
                        if (error?.message == "BLOCKED_BY_CREDITS") F_showToastMessage(t("sentinel-Admin-Credits:RESULTS BLOCKED BY CREDITS"), 'error')
                        else if (error) F_showToastMessage(t("sentinel-MyUsers-BCTestRegistration:COULD NOT DOWNLAD RESULTS"), 'error')
                        else{
                            if (callback) callback()
                        }
                    }
                    )
                }} disableRipple>
                <Typography variant="subtitle3" component="h6" sx={{ fontWeight: 'normal' }}>{t("common:DOWNLOAD")+" (2022)"}</Typography>
                <ETooltip placement="bottom" title={t("sentinel-MyUsers-BCTestRegistration:2022 LONG REPORT DESCRIPTION")}>
                        <SvgIcon viewBox="0 0 32 32" component={InfoIcon} />
                </ETooltip>
                {/* {result && <Typography sx={{ fontSize: 8, display: 'inline-block' }}>{`(${F_getLocalTime(result.createdAt, true)})`}</Typography>} */}
            </MenuItem>
            {testType=='pedagogy' && <div>
                <MenuItem disabled={!result?._id || result?.blockedByCredits} onClick={()=>{downloadReportFromOldBrainCoreServer('lpdfv2')}}>
                    <Typography variant="subtitle3" component="h6" sx={{ fontWeight: 'normal' }}>{t("common:DOWNLOAD") + " (2020)"}</Typography>
                    <ETooltip placement="bottom" title={t("sentinel-MyUsers-BCTestRegistration:2020 LONG REPORT DESCRIPTION")}>
                        <SvgIcon viewBox="0 0 32 32" component={InfoIcon} />
                    </ETooltip>
                </MenuItem>
                <MenuItem disabled={!result?._id || result?.blockedByCredits} onClick={()=>{downloadReportFromOldBrainCoreServer('long')}}>
                    <Typography variant="subtitle3" component="h6" sx={{ fontWeight: 'normal' }}>{t("common:DOWNLOAD") + " (2019)"}</Typography>
                    <ETooltip placement="bottom" title={t("sentinel-MyUsers-BCTestRegistration:2019 LONG REPORT DESCRIPTION")}>
                        <SvgIcon viewBox="0 0 32 32" component={InfoIcon} />
                    </ETooltip>
                </MenuItem>
                <MenuItem disabled={!result?._id || result?.blockedByCredits} onClick={()=>{downloadReportFromOldBrainCoreServer('short')}}>
                    <Typography variant="subtitle3" component="h6" sx={{ fontWeight: 'normal' }}>{t("common:DOWNLOAD") + " (2019S)"}</Typography>
                    <ETooltip placement="bottom" title={t("sentinel-MyUsers-BCTestRegistration:2019 SHORT REPORT DESCRIPTION")}>
                        <SvgIcon viewBox="0 0 32 32" component={InfoIcon} />
                    </ETooltip>
                </MenuItem>

            </div>}
            <Typography variant="subtitle2" component="h6" sx={{ padding: '0 8px', display: 'inline-block'}}>
                {t("common:SEND VIA EMAIL")+" (PDF)"}
                
                </Typography>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem disabled={!result?._id || result?.blockedByCredits}
                onClick={e => {
                    F_handleSetShowLoader(true)
                    setAnchorEl(null);
                    userService.sendCognitiveReport(userId, result?._id).then(res => {
                        F_handleSetShowLoader(false)
                        F_showToastMessage(t("common:THE EMAIL WAS SENT SUCCESSFULLY"), "success")
                        if (callback) callback()
                    }
                    ).catch(error => {
                        F_handleSetShowLoader(false)
                        F_showToastMessage(t("common:COULD NOT SEND THE EMAIL"), "error")
                    })
                }} disableRipple>
                <Typography variant="subtitle3" component="h6" sx={{ fontWeight: 'normal' }}>{t("common:SEND VIA EMAIL")+(" (2022)")}</Typography>
                <ETooltip placement="bottom" title={t("sentinel-MyUsers-BCTestRegistration:2022 LONG REPORT DESCRIPTION")}>
                        <SvgIcon viewBox="0 0 32 32" component={InfoIcon} />
                </ETooltip>
            </MenuItem>

            {userPermissions.admin_teams?.access && <div>
            <Typography variant="subtitle2" component="h6" sx={{ padding: '0 8px' }}>{t("common:ACCESS TO PLATFORM")}</Typography>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={e => {
                F_handleSetShowLoader(true)
                setAnchorEl(null);
                userService.sendAccessToPlatform(userId).then(res => {
                    F_handleSetShowLoader(false)
                    F_showToastMessage(t("common:THE EMAIL WAS SENT SUCCESSFULLY"), "success")
                    if (callback) callback()
                }
                ).catch(error => {
                    F_handleSetShowLoader(false)
                    F_showToastMessage(t("common:COULD NOT SEND THE EMAIL"), "error")
                })
            }} disableRipple>
                <Typography variant="subtitle3" component="h6" sx={{ fontWeight: 'normal' }}>{t("common:SEND VIA EMAIL")}</Typography>
            </MenuItem>
            </div>}
        </StyledMenu>
        

        <BrainCoreTestInvitationCalendar
            calendarOpen={calendarOpen}
            setCalendarOpen={setCalendarOpen}
            usersIds={[userId]}
            callback={callback}
            testType={testType}
        >
        </BrainCoreTestInvitationCalendar>
    </>
}