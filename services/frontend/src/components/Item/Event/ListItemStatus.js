import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { styled } from "@mui/system";

import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";


// MUIv5
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import EBadge from 'styled_components/Badge';

// MUI v4
import { theme } from "MuiTheme";



const NoWrapTypography = styled(Typography)({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
})

Date.prototype.addHours = function (h) {
    this.setHours(this.getHours() + h);
    return this;
}


// Status of single event
//
// `event` - event for which status is created
const ListItemStatus = ({ event }) => {
    const { t } = useTranslation();
    const { F_getHelper } = useMainContext();
    const { user, userPermissions } = F_getHelper()

    const [statusLabel, setStatusLabel] = useState("")
    const [statusColor, setStatusColor] = useState()

    useEffect(() => {
        var status, label, color;
        status = event.status

        if (status == "UPCOMING") { // Upcoming event
            color = theme.palette.neutrals.grey50
            label = t("Upcoming event")
        } else if (status == "CURRENT") {// Curent event
            color = theme.palette.semantic.warning
            label = t("Current")
        } else if (status == "FINISHED") {
            color = theme.palette.primary.violet
            label = t("Finished")
        }



        if (status == "RETAKE") {
            color = theme.palette.semantic.warning
            label = t("Retake")
        } else if (status == "PUBLISHED") {// Result verified and published
            color = theme.palette.semantic.info
            label = t("Published")
        } else if (status == "VERIFIED") {// Result verified
            color = theme.palette.semantic.success
            label = t("Verified")
        }

        setStatusLabel(label)
        setStatusColor(color)
    }, [event])

    return (<Grid item container sx={{ alignItems: 'center', flexWrap: 'nowrap' }}>
        <NoWrapTypography sx={{ ...theme.typography.p, fontSize: 14, color: theme.palette.neutrals.darkestGrey }}>{t("Status") + " "}</NoWrapTypography>
        <EBadge sx={{ ml: 2, mr: 1 }} ecolor={statusColor} variant="dot" />
        <NoWrapTypography sx={{ ...theme.typography.p, fontSize: 16, color: theme.palette.neutrals.almostBlack, lineHeight: '24px' }}>{statusLabel}</NoWrapTypography>
    </Grid>)




}

export default ListItemStatus;