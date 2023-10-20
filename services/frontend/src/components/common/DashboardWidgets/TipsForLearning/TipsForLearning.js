import React, {useEffect, useState} from 'react';
import Grid from "@mui/material/Grid";
import {Paper} from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@mui/material/CardMedia";
import {EButton} from "styled_components";
import {useTranslation} from "react-i18next";
import newDashboardService from "services/new_dashboard.service";
import UserService from "services/user.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

function TipsForLearning(props) {
    // const {} = props;
    const { t } = useTranslation();
    const {F_handleSetShowLoader,F_showToastMessage,F_getErrorMessage, F_getHelper} = useMainContext();
    const {user} = F_getHelper();
    const [tip,setTip] = useState({});

    useEffect(()=>{
        UserService.getTip(user.id).then(res=>{
            if(res.status === 200 && res.data){
                setTip(res.data);
                F_handleSetShowLoader(false);
            }
        }).catch(err=>{
            console.log(err);
            F_handleSetShowLoader(false);
            F_showToastMessage(F_getErrorMessage(err), 'error');
        });
    },[]);

    return (
        <>
        {tip.text ? (
            <Grid item xs={12} sm={12} md={8}>
                <Paper className='p-3 ' style={{backgroundColor:'rgba(119, 246, 255, 1)',borderRadius:"16px"}}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h4"
                                        component="h6" className="text-center"
                                        style={{fontSize:35,color: `rgba(82, 57, 112, 1)`, zIndex:3}}>
                                {tip.introduction||'-'}
                            </Typography>
                        </Grid>
                        <Grid item xs={2} className='d-flex justify-content-center align-items-center pl-5' style={{maxHeight:'150px'}}>
                            <CardMedia
                                style={{width:'120px', transform: "rotate(-5deg)", zIndex:1, position:'relative', top:'30px'}}
                                component="img"
                                alt="Contemplative Reptile"
                                height="auto"
                                image="/img/popup/amelia_1.png"
                                title="Contemplative Reptile"
                            />
                        </Grid>
                        <Grid item xs={10} className="d-flex justify-content-center align-items-center">
                            <Paper className='p-3 mr-5 ml-3' elevation={11} style={{zIndex:2, borderRadius:"16px"}}>
                                <Typography variant="body1"
                                            component="h6" className="text-left"
                                >
                                    {tip.text+" "+tip.reasoning||'-'}
                                </Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} className='d-flex justify-content-center align-items-center mt-3 mb-4'>
                            <EButton
                                style={{minWidth:'200px'}}
                                eSize='small'
                                eVariant="primary"
                                onClick={()=>{}}
                            >{t("Add to my tasks list")}</EButton>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            ) : (<></>)}
        </>

    );
}

export default TipsForLearning;