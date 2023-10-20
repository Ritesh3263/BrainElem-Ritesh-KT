import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import moduleCoreService from "services/module-core.service"
import Button from '@material-ui/core/Button';
import { makeStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import GradingScaleTable from "./GradingScaleTable";
import {useTranslation} from "react-i18next";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import { ETab, ETabBar } from "styled_components";
import { Divider } from "@mui/material";
import { Typography, ThemeProvider } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import StyledButton from "new_styled_components/Button/Button.styled";
import Container from "@mui/material/Container";
import "./gradingscale.scss"
const useStyles = makeStyles(theme=>({}))

export default function MSGradingScalesList(){
    const { t } = useTranslation();
    const classes = useStyles();
    const navigate = useNavigate();
    const [MSScale, setMSScale] =useState([])
    const [currentModuleId, setCurrentModuleId] = useState("");
    // setCurrentRoute
    const {setMyCurrentRoute, F_showToastMessage, F_getHelper, F_handleSetShowLoader} = useMainContext();
    const {manageScopeIds} = F_getHelper();

    useEffect(()=>{
        F_handleSetShowLoader(true)
        setCurrentModuleId(manageScopeIds.moduleId)
        moduleCoreService.readModuleCore(manageScopeIds.moduleId).then(res=>{
            
            if(res.data.gradingScales){
                let filteredScale = res.data.gradingScales.map(x=>{
                    if(x._id == res.data.defaultGradingScale._id)
                    {
                        x.isDefault = "X";
                    }
                    return x;
                });
                setMSScale(filteredScale);
                F_handleSetShowLoader(false)
            }
        }).catch(error=>console.error(error))
        setMyCurrentRoute("Grading scale")
    },[])
    return(
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv Grading_Module">
                <div className="admin_content">
                    <Grid item xs={12}>
                        <div className="admin_heading">
                            <Grid>
                                <Typography variant="h1" className="typo_h5">{t("Grading Scale")}</Typography>
                                <Divider variant="insert" className='heading_divider' />
                            </Grid>
                            <StyledButton className="w-100-mb" eVariant="primary" eSize="large" component="span"
                                // startIcon={<AddCircleOutlineIcon/>}
                                onClick={()=>{navigate("/modules-core/grading-scales/new")}}
                            >{t("Add grading scale")}
                            </StyledButton>
                        </div>
                        
                    </Grid>
                    <Grid item xs={12}>
                        <GradingScaleTable MSScale={MSScale}/>
                    </Grid>

                    {/* <Grid container spacing={3}>
                        <Grid item xs={12}>
                                <div className="d-flex pt-2 px-2 mb-3 justify-content-between">
                                    <Button classes={{root: classes.root}} size="small" variant="contained" color="primary"
                                            startIcon={<AddCircleOutlineIcon/>}
                                            onClick={()=>{navigate("/modules-core/grading-scales/new")}}
                                    >{t("Add grading scale")}</Button>
                                </div>
                                <GradingScaleTable MSScale={MSScale}/>
                            
                        </Grid>
                    </Grid> */}
                </div>
            </Container>
        </ThemeProvider>
    )
}