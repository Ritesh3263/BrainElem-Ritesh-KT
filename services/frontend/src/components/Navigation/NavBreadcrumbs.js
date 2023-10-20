import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Link from '@material-ui/core/Link';
import HomeIcon from '@material-ui/icons/Home';
import WhatshotIcon from '@material-ui/icons/Whatshot';
import GrainIcon from '@material-ui/icons/Grain';
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {useMainContext} from "../_ContextProviders/MainDataContextProvider/MainDataProvider";

const useStyles = makeStyles((theme) => ({
    link: {
        display: 'flex',
    },
    icon: {
        marginRight: theme.spacing(0.5),
        width: 20,
        height: 20,
    },
}));

export default function IconBreadcrumbs() {
    const navigate = useNavigate();
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();
    const {currentLocalization} = useMainContext();

    const [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(()=>{
       setBreadcrumbs(currentLocalization);
    },[currentLocalization])


    const bradeCrumbsList = breadcrumbs?.length>0 ? breadcrumbs.map(b=>(
        <Typography color="textPrimary" className={classes.link}>
            <WhatshotIcon className={classes.icon} />
            {t(b.name)}
        </Typography>)): [];

    return (
        <Breadcrumbs aria-label="breadcrumb" className="mb-3">
            <Link color="inherit" onClick={()=>{navigate("/")}} className={classes.link} style={{cursor:"pointer"}}>
                <HomeIcon className={classes.icon} />
                {t("Home")}
            </Link>
            {/*<Link*/}
            {/*    color="inherit"*/}
            {/*    href="/getting-started/installation/"*/}
            {/*    onClick={()=>{}}*/}
            {/*    className={classes.link}*/}
            {/*>*/}
            {/*    <WhatshotIcon className={classes.icon} />*/}
            {/*    Core*/}
            {/*</Link>*/}
            {/*<Typography color="textPrimary" className={classes.link}>*/}
            {/*    <GrainIcon className={classes.icon} />*/}
            {/*    Breadcrumb*/}
            {/*</Typography>*/}
            {bradeCrumbsList}
        </Breadcrumbs>
    );
}