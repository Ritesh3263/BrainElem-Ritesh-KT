// Single list element
// Contents and Courses are supported
// Events have seperated component inside ./Event/ListItem

import React, { lazy, useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Confirm from "components/common/Hooks/Confirm";

//Context
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

// Styled components
import OptionsButton from "components/common/OptionsButton";
import EBadge from 'styled_components/Badge';

//Services
import ContentService from 'services/content.service'

// MUIv5
import SvgIcon from "@material-ui/core/SvgIcon";
import { styled } from "@mui/system";
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';


// MUI v4
import { theme } from "MuiTheme";

import ListItemOptionsButton from "./ListItemOptionsButton";

const NoWrapTypography = styled(Typography)({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
})

// ########### ########### ########### ###########
// ########### ########### ########### ###########
// Single element on the list
// `element` - element to display
// `deleteElementCallback` - function to run after deleting element in the list - can be used to reload list or update the state
// `editElementCallback` - function to run after editing element in the list - can be used to reload list or update the state
const ListItem = ({ element, deleteElementCallback, editElementCallback }) => {
    const { t } = useTranslation();
    const { isConfirmed } = Confirm();
    const navigate = useNavigate();
    const { F_getLocalTime, F_getHelper, F_showToastMessage } = useMainContext();
    const { user, userPermissions } = F_getHelper()


    function getType() {
        if (element.contentType) return 'content'
        else return 'course'
    }

    function getName() {
        if (element.name) return element.name
        else if (getType() === "content") return element.title
    }


    function getPerson() {
        if (getType()=='content' && element.owner?.name){
            let author = t("Author") +": "+ element.owner.name + " " +  element.owner.surname
            
            if (element.cocreators.includes(user.id)){
                author += ', '+t("You")
                if (element.cocreators?.length > 1) author += " + " + t("others")
            }
            else if (element.cocreators?.length) author += " + " + t("others")
            return author
        }
        else if (getType()=='course' && element.trainingManager?.name) return t("Trainer")+": " + element.trainingManager?.name + " " + element.trainingManager?.surname

    }

    const getLocation = () => {
        // Course
        if (getType() === "course"){
            if (element.category?.name) return t("Catalogue") + " > " + element.category?.name
        }

        let location = t("Private library")
        if (element.sendToCloud) location = t("Cloud")
        else if (element.sendToLibrary) location = t("Public library")

        if (element.trainingModule) return `${location} > ${element.trainingModule.name}`
        else return location
    }


    const getStatusColor = () => {
        // Course
        if (getType() === "course") return theme.palette.semantic.success

        // Content
        if (!element.sendToLibrary) return theme.palette.semantic.info
        else if (element.libraryStatus === "AWAITING") return theme.palette.semantic.warning
        else if (element.libraryStatus === "ACCEPTED") return theme.palette.semantic.success
        else if (element.libraryStatus === "REJECTED") return theme.palette.semantic.error
        return theme.palette.semantic.warning
    }

    const getStatusName = () => {
        // Course
        if (getType() === "course") return t("Verified")

        // Content
        if (element.libraryStatus === "PRIVATE" || !element.sendToLibrary) return t("Private")
        else if (element.libraryStatus === "AWAITING") return t("Awaiting")
        else if (element.libraryStatus === "ACCEPTED") return t("Verified")
        else if (element.libraryStatus === "REJECTED") return t("Rejected")

    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    function isUpperCase(str){
        return str === str.toUpperCase() && str !== str.toLowerCase();
    }


    function getFormat() {
        if (element.format?.name && isUpperCase(element.format?.name)) return capitalizeFirstLetter(t(element.format?.name))+' / '
        else return ''
    }

    function getDateComponent() {
        if (element.lastActive) return <NoWrapTypography sx={{ ...theme.typography.p, color: theme.palette.neutrals.darkestGrey, fontSize: 12 }}>
            {t("Last activity") + ": " + F_getLocalTime(element.lastActive)}
        </NoWrapTypography>
        if (element.canEdit && element.updatedAt) return <NoWrapTypography sx={{ ...theme.typography.p, color: theme.palette.neutrals.darkestGrey, fontSize: 12 }}>
            {t("Edited on") + ": " + F_getLocalTime(element.updatedAt)}
        </NoWrapTypography>
        else if (getType() === 'course') return <NoWrapTypography sx={{ ...theme.typography.p, color: theme.palette.neutrals.darkestGrey, fontSize: 12 }}>
            {getFormat() + F_getLocalTime(element.startDate, true).replaceAll('/','.') + " - " + F_getLocalTime(element.endDate, true).replaceAll('/','.')}
        </NoWrapTypography>

        else if (!element.canEdit && element.createdAt) return <NoWrapTypography sx={{ ...theme.typography.p, color: theme.palette.neutrals.darkestGrey, fontSize: 12 }}>
            {t("Created on") + ": " + F_getLocalTime(element.createdAt)}
        </NoWrapTypography>

    }

return (
    <Grid item container sx={{ borderRadius: '0px 0px 8px 8px', p: '8px', alignItems: 'center', minHeight: '121px', background: theme.palette.shades.whiteStroke }}>
        <Grid container item xs={10}>
            <Grid item xs={12}>
                <NoWrapTypography sx={{ ...theme.typography.p, color: theme.palette.neutrals.darkestGrey, fontSize: 12 }}>{getLocation()}</NoWrapTypography>
            </Grid>
            <Grid item xs={12}>
                <NoWrapTypography sx={{ ...theme.typography.p, fontSize: 16 }}>{getName()}</NoWrapTypography>
            </Grid>
            <Grid item container sx={{ alignItems: 'center', flexWrap: 'nowrap' }}>
                <NoWrapTypography sx={{ ...theme.typography.p, fontSize: 14, color: theme.palette.neutrals.darkestGrey }}>{t("Status") + " "}</NoWrapTypography>
                <EBadge sx={{ ml: 2, mr: 1 }} ecolor={getStatusColor()} variant="dot" />
                <NoWrapTypography sx={{ ...theme.typography.p, fontSize: 16, color: theme.palette.neutrals.almostBlack, lineHeight: '24px' }}>{getStatusName()}</NoWrapTypography>
            </Grid>
            <Grid item xs={12}>
                <NoWrapTypography sx={{ ...theme.typography.p, fontSize: 14, color: theme.palette.neutrals.darkestGrey }}>{getPerson()}</NoWrapTypography>
            </Grid>
            <Grid item xs={12}>
                {getDateComponent()}
            </Grid>

        </Grid>
        <Grid container item xs={2} sx={{ alignItems: 'center', justifyContent: 'flex-end' }}>
            <ListItemOptionsButton element={element} deleteElementCallback={deleteElementCallback} editElementCallback={editElementCallback} size="medium" />
        </Grid>
    </Grid >
)
}

export default ListItem;