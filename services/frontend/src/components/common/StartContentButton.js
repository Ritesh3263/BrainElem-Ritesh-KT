import React, { useEffect, useState } from "react";
import { Button, SvgIcon, InputAdornment } from '@material-ui/core';
import { useMainContext } from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useTranslation } from "react-i18next";
import { makeStyles } from "@material-ui/core/styles";

import { ReactComponent as PlayIcon } from '../../icons/icons_48/Play.svg';

import ContentService from "../../services/content.service";



const useStyles = makeStyles(theme => ({

    buttonRoot: {
        borderRadius: 8,
        textAlign: 'left',
        background: theme.palette.secondary.violetSelect
    },
    buttonLabel: {
        justifyContent: 'flex-start',
    },
    icon: {
        "& path": {
            stroke: theme.palette.neutrals.white,
        }
    }
}))
export default function StartContentButton({ contentId }) {
    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const [contentTitle, setContentTitle] = useState('...')
    const { F_getErrorMessage, F_showToastMessage } = useMainContext();

    useEffect(() => {
        ContentService.getContentOverview(contentId).then(
            (response) => {
                setContentTitle(response.data.title)
            },
            (error) => {
                let errorMessage = F_getErrorMessage(error)
                F_showToastMessage(errorMessage, 'error')
            }
        )
    }, [contentId]);


    return (
        <Button
            classes={{ root: classes.buttonRoot, label: classes.buttonLabel }}
            fullWidth
            onClick={() => { }}
            variant="contained"
            color="primary"
            startIcon={<SvgIcon className={classes.icon} viewBox="8 8 32 32" component={PlayIcon} />}
        >
            {contentTitle}
        </Button>
    );
}