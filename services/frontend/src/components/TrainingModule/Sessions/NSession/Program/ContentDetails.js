import React, {useEffect, useState} from "react";
import {Card, CircularProgress, Paper} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {useTranslation} from "react-i18next";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CertificationSessionService from "services/certification_session.service";
import ContentService from "services/content.service";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import Box from "@material-ui/core/Box";
import { useNavigate } from "react-router-dom";


export default function ContentDetails({contentDetailsHelper, setContentDetailsHelper, groupId}){
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [currentContent, setCurrentContent] = useState({});
    const [contentImageLink, setContentImageLink] = useState(undefined);
    const [isImageLoading, setIsImageLoading] = useState(true);

    useEffect(()=>{
        if(contentDetailsHelper.isOpen && contentDetailsHelper.contentId){
            CertificationSessionService.newGetContent(contentDetailsHelper.contentId).then(res => {
                if(res.status === 200 && res?.data){
                    setCurrentContent(res.data);
                    let imgLink =  ContentService.getImageUrl(res.data);
                    if(imgLink){
                        setContentImageLink(imgLink);
                        setIsImageLoading(false);
                    }
                                    }
                                }).catch(err => console.log(err))
                            }
                        },[contentDetailsHelper]);
                                                
    return(
        <Paper elevation={10} className="p-2">
            <Grid container>
                <Grid item xs={12} style={{maxHeight: '250px'}}>
                    <Card sx={{maxHeight: '250px'}}>
                        {isImageLoading ? (
                            <Box className="p-4 d-flex justify-content-center">
                                <CircularProgress style={{color: `rgba(82, 57, 112, 1)`}}/>
                            </Box>
                        ) : (
                            <CardMedia
                                component="img"
                                height="200px"
                                image={contentImageLink}
                                alt={currentContent?.title}
                            />
                        )}
                    </Card>
                </Grid>
                <Grid item xs={12} className="p-2 d-flex align-items-center justify-content-between">
                    <Typography variant="h5" component="h5" className="text-left" style={{color: `rgba(82, 57, 112, 1)`}}>
                        <strong>{currentContent?.title}</strong>
                    </Typography>
                    <Chip label={currentContent?.contentType?.toLowerCase() || "-"}
                          size="medium" variant="outlined"
                          style={{color: `rgba(82, 57, 112, 1)`, backgroundColor:'rgba(255,255,255,0.9)'}}
                    />
                </Grid>
                <Grid item xs={12} className="p-2">
                    <Paper elevation={10} className="p-2">
                    <Grid container>
                        <Grid item xs={6}>
                            <p>{t("Path of program")}:</p>
                            <p>{t("Used times")}: </p>
                            <p>{t("Pages")}: </p>
                            <p>{t("Updated at")}: </p>
                            <p>{t("Status")}: </p>
                        </Grid>
                        <Grid item xs={6}>
                            <p>{currentContent?.pathOfProgram || "-"}</p>
                            <p>{currentContent?.usedTimes || 0}</p>
                            <p>{currentContent?.pages?.length || "-"}</p>
                            <p>{currentContent?.updatedAt ? (new Date(currentContent?.updatedAt).toLocaleDateString()) : "-"}</p>
                            <p className={`text-${(currentContent?.isActive) ? 'success' : 'danger'}`}>{currentContent?.isActive ? 'Active' : 'InActive'}</p>
                        </Grid>
                    </Grid>
                    </Paper>
                </Grid>
                <Grid item xs={12} className="p-1 pt-2">
                    <Grid container>
                        <Grid item xs={6} className="d-flex justify-content-center">
                            <Button variant="contained" size="small" color="secondary" onClick={()=>setContentDetailsHelper({isOpen: false, contentId: undefined})}>
                                {t("Dismiss")}
                            </Button>
                        </Grid>
                        <Grid item xs={6} className="d-flex justify-content-center">
                            <Button variant="contained" size="small" color="primary" onClick={()=>{navigate(`/my-courses/preview/?tmId=${currentContent.trainingModule}&groupId=${groupId}&chId=${currentContent.chapter}&cId=${contentDetailsHelper.contentId}`)}}>
                               <VisibilityIcon/>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
}