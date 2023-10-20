import React, {lazy} from "react";
import Grid from "@material-ui/core/Grid";
import {useTranslation} from "react-i18next";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({}));

const Chapters = lazy(() => import("../Tabs/Program/Chapters"));

const SidebarDrawer=(props)=>{
    const{}=props;
    const classes = useStyles();
    const {t} = useTranslation();

    return(
        <Grid container >
            <Grid item xs={12} className='px-2'>
                <Chapters/>
            </Grid>
        </Grid>
    )
}

export default SidebarDrawer;