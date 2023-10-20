import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {Paper} from "@material-ui/core";
import {Link} from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import {useTranslation} from "react-i18next";
import { theme } from "MuiTheme";
import {useNavigate} from "react-router-dom";
import CardMedia from "@mui/material/CardMedia";
import newDashboardService from "services/new_dashboard.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

function Assistance(props) {
    const {
        size=3,
        beginning=0,
    } = props;
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [assistance, setAssistance]= useState([])
    const {F_handleSetShowLoader,F_showToastMessage,F_getErrorMessage,F_getHelper} = useMainContext();

    useEffect(() => {
        F_handleSetShowLoader(true)
        newDashboardService.readAssistance('query?').then(res=>{
            if(res.status === 200 && res.data.length>0){
                setAssistance(res.data.splice(beginning,size,size));
                F_handleSetShowLoader(false);
            }
        }).catch(err=>{
            console.log(err);
            F_handleSetShowLoader(false);
            F_showToastMessage(F_getErrorMessage(err), 'error');
        });
    }, []);


    const assistanceList = (assistance.length >0) ? assistance.map(({_id, title, url, description})=>(
        <Grid item xs={12} sm={12} md={4} onClick={()=>navigate(url, {replace: true})} key={_id}>
            <Paper style={{borderRadius:"16px", background: theme.palette.primary.creme, cursor: "pointer" }} className='p-4'>
                <Grid container>
                    <Grid item xs={8}>
                        <Typography variant="body1"
                                    component="h6" className="text-left"
                                    style={{color: theme.palette.neutrals.darkestGrey, fontSize:"18px"}}>
                            {t(title)||'-'}
                        </Typography>
                        <Typography variant="h6"
                                    component="h6" className="text-left mt-2"
                                    style={{ fontWeight: "bold", color: theme.palette.primary.lightViolet}}>
                            {t(description)||'-'}
                        </Typography>
                    </Grid>
                    <Grid item xs={4} className="d-flex justify-content-center align-items-center">
                    <CardMedia style={{maxWidth:'100px'}}
                            component="img"
                            alt="Contemplative Reptile"
                            image="/img/icons/Vector.png"
                            title="Contemplative Reptile"
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
    )) :[]
    return (
        <>
        {assistanceList}
        </>
    );
}

export default Assistance;