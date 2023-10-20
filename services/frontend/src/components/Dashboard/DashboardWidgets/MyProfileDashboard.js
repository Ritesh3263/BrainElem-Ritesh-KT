import React from "react";
import {Card, Col, Row} from "react-bootstrap";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import GradeIcon from "@material-ui/icons/Grade";
import CardActions from "@material-ui/core/CardActions";
import {EButton} from "../../../styled_components";
import PersonIcon from "@material-ui/icons/Person";

import {useNavigate} from "react-router-dom";
import { makeStyles} from "@material-ui/core/styles";
import {useTranslation} from "react-i18next";
import SettingsIcon from "@material-ui/icons/Settings";
import { theme } from "../../../MuiTheme";


const useStyles = makeStyles(theme=>({
    icon: {
        '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.54)',
        }
    },
    logo: {
        display:"flex",
        marginLeft:"auto",
        marginRight:"auto",
        width: '50px',
        height: "60px",
        paddingTop:"10px"
    },
    recommendationCard: {
        // backgroundColor: `rgba(255,255,255,0.3)`,
        // borderRadius: "8px",
        // cursor: 'pointer',
        transition: "all .25s linear",
        '&:hover': {
            padding: "5px !important",
            'box-shadow': "-1px 10px 29px 0px rgba(0,0,0,0.8)",

        },
    }
}))

export default function MyProfileDashboard({fromDashboard}){
    const { t, i18n, translationsLoaded } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    return(
        <Card className="m-0 py-0 px-0 "
         style={{background:theme.palette.glass.medium, borderRadius:"8px"}}>
            {/*<Typography variant="h6" component="h2" className="text-center">*/}
            {/*    {t("My Profile")}*/}
            {/*</Typography>*/}
            <Row className="d-flex justify-content-center align-items-center">
                <Col className="mt-4 d-flex flex-column align-items-center justify-content-center" xs={4}>
                
                <Avatar alt="Remy Sharp"  src="img/explore/avatar.png"  style={{ width: 95, height: 95 }}  />

                    {/*<p className=""><small>{t("Completed in")} 80%</small></p>*/}
                </Col>
                {/*<Col className="mt-3 d-flex flex-column align-items-center justify-content-center" xs={2}>*/}
                {/*    <GradeIcon fontSize="large"/>*/}
                {/*    <span className="text-center"><small>{t("Content browsing")}</small></span>*/}
                {/*</Col>*/}
                {/*<Col className="mt-3 d-flex flex-column align-items-center justify-content-center" xs={2}>*/}
                {/*    <GradeIcon fontSize="large"/>*/}
                {/*    <span className="text-center"><small>{t("Content creating")}</small></span>*/}
                {/*</Col>*/}
            </Row>

            <CardActions className="d-flex align-items-center justify-content-center mt-2 mb-2">
                <EButton classes={{root: classes.root}} size="small" eVariant='secondary'
                        onClick={()=>{navigate((fromDashboard ? `/profile-settings` : `/profile-settings`))}}
                ><small>{fromDashboard ?  t("Refine Recommendations") : t("Refine Recommendations")}</small></EButton>
            </CardActions>
        </Card>
    )
}