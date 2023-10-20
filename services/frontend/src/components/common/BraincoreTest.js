import React from "react";
import SwipeableDrawer from "@material-ui/core/SwipeableDrawer";
import {Avatar, Button, Container} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {useTranslation} from "react-i18next";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import {isWidthUp} from "@material-ui/core/withWidth";
import {useMainContext} from "../_ContextProviders/MainDataContextProvider/MainDataProvider";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(theme => ({}));

export default function BraincoreTest({isOpenDrawer, setIsOpenDrawer}){
    const classes = useStyles();
    const { currentScreenSize} = useMainContext();
    const {t} = useTranslation();
    const navigate = useNavigate();
    return(
        <SwipeableDrawer
            PaperProps={{
                style:{
                    backgroundColor:'rgba(255,255,255,0.75)'
            }}}
            anchor="right"
            onOpen=''
            open={isOpenDrawer.isOpen}
            onClose={()=>{
                setIsOpenDrawer({isOpen: false, cognitiveTestId: undefined});
            }}
        >
        <Container style={{width:isWidthUp('sm',currentScreenSize) ? "500px" : "100%"}} className='py-3'>
            <Grid container>
                <Grid item xs={12} className="d-flex flex-column justify-content-center align-items-center mt-5">
                    <Avatar src="/img/explore/braincore-icon2.png" variant="square" style={{width:'100px', height: '100px'}}/>
                    <Typography variant="h2" component="h2" className="text-justify text-center" style={{color: `rgba(168, 92, 255, 1)`}}>
                        {t("Braincore test")}
                    </Typography>
                    <Typography variant="h5" component="h2" className="text-justify text-center my-4" style={{color: `rgba(82, 57, 112, 1)`}}>
                        {t("Increase your brain capacity with BrainCore and achieve your goals faster and easier")}
                    </Typography>
                    <img alt="braincore-test" src='api/v1/contents/60db1aef2b4c80000732fdf5/image/download'
                         style={{width:'100%', borderRadius:'8px'}}/>
                    <Typography variant="body2" component="h2" className="text-justify text-center my-3" style={{color: `rgba(82, 57, 112, 1)`}}>
                        {`${t("BrainCore delivers results immediately, including")} : `}
                    </Typography>
                    <Typography variant="body2" component="h2" className="text-justify text-center mt-4" style={{color: `rgba(82, 57, 112, 1)`}}>
                        {t("    Unique 5 NAD ® values, individual for everyone, explaining how user transfers and adapts the knowledge\n" +
                            "    Strong and weak points\n" +
                            "    Emotional indicators\n" +
                            "    Psychometric dimensions\n")}
                    </Typography>
                    <Button variant="contained" size="small" color="primary" className='mt-5' onClick={()=>{
                        navigate(`/content/display/${isOpenDrawer.cognitiveTestId}`, '_blank');
                        //setIsOpenDrawer({isOpen: false, cognitiveTestId:undefined});
                    }}>{t("Take test")}</Button>
                </Grid>
            </Grid>
        </Container>
        </SwipeableDrawer>
    )
}