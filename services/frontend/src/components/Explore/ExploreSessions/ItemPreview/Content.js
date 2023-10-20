import React, {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Button from '@material-ui/core/Button';
import Typography from '@mui/material/Typography';
import CoursePathService from "services/course_path.service";
import {useMainContext} from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Content({currentItemDetails}){
    const {t} = useTranslation();
    const [currentCoursePath, setCurrentCoursePath]=useState({});
    const {F_handleSetShowLoader} = useMainContext();
    const {
        F_getHelper
    } = useMainContext();
    const {user} = F_getHelper();

    useEffect(()=>{
        F_handleSetShowLoader(true);
        // =>
        if(user){
            if(currentItemDetails?.coursePath?._id){
                CoursePathService.readWithDetails(currentItemDetails?.coursePath?._id).then((res) => {
                    if(res?.status ===200){
                        setCurrentCoursePath(res.data);
                        F_handleSetShowLoader(false);
                    }
                }).catch(err=>console.log(err));
            }
        }else{
            if(currentItemDetails?.coursePath){
                CoursePathService.readWithDetails(currentItemDetails?.coursePath).then((res) => {
                    if(res?.status ===200){
                        setCurrentCoursePath(res.data);
                        F_handleSetShowLoader(false);
                    }
                }).catch(err=>console.log(err));
            }
        }

    },[currentItemDetails?._id]);


    const coursesList = currentCoursePath?.courses?.length>0 ? currentCoursePath?.courses.map(cur=>(
        <Accordion key={cur?._id} style={{backgroundColor: 'rgba(255,255,255,0)', borderRadius: '8px', boxShadow: 'none'}} className='mb-2'>
            <AccordionSummary
                style={{backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: '8px'}}
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography style={{color: `rgba(82, 57, 112, 1)`}}>{`${t('Course')}: `}</Typography>
                <Typography className='ml-3'>{cur?.name}</Typography>
            </AccordionSummary>
            <AccordionDetails className='pr-0'>
                {cur?.chosenChapters?.length>0 ? cur?.chosenChapters?.map(ch=>(
                    <Accordion key={ch?._id} style={{backgroundColor: 'rgba(255,255,255,0)', borderRadius: '8px', boxShadow: 'none'}} className='ml-5 mb-2'>
                        <AccordionSummary
                            style={{backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: '8px'}}
                            expandIcon={<ExpandMoreIcon />}
                        >
                            <Typography style={{color: `rgba(82, 57, 112, 1)`}}>{`${t('Chapter')}: `}</Typography>
                            <Typography className='ml-3'>{ch?.chapter?.name}</Typography>
                        </AccordionSummary>
                        <AccordionDetails className='pr-0'>
                            {ch?.chosenContents?.length>0 ? ch?.chosenContents?.map(chc=>(
                                <Accordion key={chc?._id} style={{backgroundColor: 'rgba(255,255,255,0)', borderRadius: '8px', boxShadow: 'none'}} className='ml-5 mb-2'>
                                    <AccordionSummary
                                        style={{backgroundColor: 'rgba(255,255,255,0.35)', borderRadius: '8px'}}
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Typography style={{color: `rgba(82, 57, 112, 1)`}}>{`${t('Content')}: `}</Typography>
                                        <Typography className='ml-3'>{chc?.content?.title}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails className="d-flex flex-column">
                                        <span>{`${t('Content type')} : ${chc?.content?.contentType}`}</span>
                                        <span>{`${t('Duration time')} : ${chc?.content?.durationTime??'-'}h`}</span>
                                    </AccordionDetails>
                                </Accordion>
                            )):[]}
                        </AccordionDetails>
                    </Accordion>
                )) : []}
            </AccordionDetails>
        </Accordion>
    )):[];

    return(
        <Grid container>
            {user ? (
                <>
                    {currentItemDetails?.coursePath?._id ? (
                        <Grid item xs={12} className="my-3">
                            <Typography variant="body1"
                                        component="h6" className="text-left"
                                        style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("Course path details")}
                            </Typography>
                            <hr className="my-1 mr-4"/>
                            <Grid container>
                                <Grid item xs={12}>
                                    {coursesList}
                                </Grid>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid item xs={12} className='my-5'>
                            <span>{t('No data')}</span>
                        </Grid>
                    )}
                </>
            ):(
                <>
                    {currentItemDetails?.coursePath ? (
                        <Grid item xs={12} className="my-3">
                            <Typography variant="body1"
                                        component="h6" className="text-left"
                                        style={{color: `rgba(82, 57, 112, 1)`}}>
                                {t("Course path details")}
                            </Typography>
                            <hr className="my-1 mr-4"/>
                            <Grid container>
                                <Grid item xs={12}>
                                    {coursesList}
                                </Grid>
                            </Grid>
                        </Grid>
                    ) : (
                        <Grid item xs={12} className='my-5'>
                            <span>{t('No data')}</span>
                        </Grid>
                    )}
                </>
            )}

        </Grid>
    )
}