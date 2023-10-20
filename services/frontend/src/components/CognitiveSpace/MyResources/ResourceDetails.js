import React from 'react';
import { useState, useEffect } from 'react';
import { Box, Container, textFieldClasses } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';

import BookmarkIcon from '@mui/icons-material/Bookmark';
import ResourceImg from "../../../img/cognitive_space/resource_img.svg";
import { ReactComponent as IconActivity } from "../../../img/cognitive_space/icon_activity.svg";
import { ReactComponent as IconCourse } from "../../../img/cognitive_space/icon_course.svg";
import { ReactComponent as IconExternalCourse } from "../../../img/cognitive_space/icon_external_resources.svg";
import { ReactComponent as IconLearnMore } from "../../../img/cognitive_space/icon_learnmore.svg";
import { ReactComponent as IconMaterial } from "../../../img/cognitive_space/icon_material.svg";
import { ReactComponent as IconRobo } from "../../../img/cognitive_space/AvtarRobo.svg"
import { ReactComponent as PurpleBulb } from "../../../img/cognitive_space/purple_bulb.svg"
import FindSolution from "../../../img/cognitive_space/find-solution.svg"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { baseURL } from '../../../services/axiosSettings/axiosSettings'

// import { Link, NavLink } from "react-router-dom";

// MUI v5
import StyledButton from "new_styled_components/Button/Button.styled";
import { useMainContext } from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


import CognitiveSpace from "../../../services/cognative-space.service"
import ActivitiesImages from "../../../img/cognitive_space/res_img.svg";

import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { ArrowBackIos } from '@mui/icons-material';
import { new_theme } from "NewMuiTheme";
import { ThemeProvider, fontSize } from "@mui/system";
import "./MyResources.scss"
import moment from 'moment';

const ResourceDetails = ({ id, resource, resourceType, setResourceId, setResourceType, setSolutions, setFavs, setCompanyMaterial }) => {
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const { t } = useTranslation(['mySpace-myResources']);
    const { F_showToastMessage, F_handleSetShowLoader } = useMainContext();
    const [singleResource, setSingleResource] = useState(resource);
    useEffect(() => {
        console.log(resourceType);
        if(resourceType=="material"){
            CognitiveSpace.getProjectDetails(id).then((resp) => {
                console.log("---Details", resp.data)
                setData(resp.data);
            })
        }else{
            CognitiveSpace.getSolutionDetail(id, resourceType).then((resp) => {
                console.log("---Details", resp.data)
                setData(resp.data);
            })
        }
        


    }, [resourceType])
    const storeFeedback = (type, data) => {
        F_handleSetShowLoader(true);
        CognitiveSpace.storeFeedBack(type, data).then((resp) => {
            F_showToastMessage(t("mySpace-myResources:FEEDBACK ADDED"), "success");
            if(type=="material"){
                CognitiveSpace.getProjectDetails(id).then((resp) => {
                    setData(resp.data);
                })
            }else{
                CognitiveSpace.getSolutionDetail(id, resourceType).then((resp) => {
                    setData(resp.data);
                });
            }
            CognitiveSpace.getAllCompanyMaterials().then((resp)=>{
                setCompanyMaterial(resp.data);
            });
            CognitiveSpace.getAllSoltions().then((resp) => {
                setSolutions(resp.data);
            });
            CognitiveSpace.getAllFavs().then((resp) => {
                setFavs(resp.data)
            });
        });

        F_handleSetShowLoader(false)
    }

    const changeStatus= (blockId,data)=>{
        F_handleSetShowLoader(true);
        CognitiveSpace.changeStatus(blockId, data).then((resp) => {
            F_showToastMessage("Feedback Added.", "success");
            CognitiveSpace.getProjectDetails(id).then((resp) => {
                setData(resp.data);
            })
            CognitiveSpace.getAllCompanyMaterials().then((resp)=>{
                setCompanyMaterial(resp.data);
            });
            
        });

        F_handleSetShowLoader(false)
    }

    const [age, setAge] = React.useState('');

    const handleChange = (event) => {
        setAge(event.target.value);
    };
    
    return (
        <ThemeProvider theme={new_theme}>
           {(()=>{
switch(resourceType){
    case 'opportunities':
        return (
            <Grid item xs={12}>
            <Grid container spacing={4}>
                <Grid item md={8} xs={12}>
                    <div className="top_heading">

                        <div onClick={() => setResourceId(0)} className='arrow_icon'>
                            <ArrowBackIos />
                        </div>
                        <div>
                            <Typography variant="body2" component="h6" sx={{ textAlign: 'left', mb: 2 }}>{t("mySpace-myResources:HOW TO SOLVE")}</Typography>
                            <Typography variant="h3" component="h3" sx={{ textAlign: 'left', marginBottom: '10px' }}>{data?.text}</Typography>
                            <Typography variant="body2" component="p" sx={{ textAlign: 'left', color: new_theme.palette.secondary.Turquoise, mb: 2, cursor: 'pointer' }} onClick={() => {
                                const req = {
                                    '_id': data?._id,

                                    'favourite': !(data?.favourite == undefined ? false : data?.favourite),
                                }
                                storeFeedback('opportunities', req)
                            }}><BookmarkIcon sx={{ color: new_theme.palette.secondary.Turquoise }} /> {data?.favourite ? t("mySpace-myResources:REMOVE FROM MY RESOURCES") : t("mySpace-myResources:ADD TO MY RESOURCES")}</Typography>
                            <div className="label" style={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '16px', display: 'inline-block', padding: '6px 18px', color: new_theme.palette.newSupplementary.SupCloudy }}>
                                <Typography variant="body2" component="span" sx={{ textAlign: 'left' }}>{t('mySpace-myResources:TYPE-'+data?.type.toUpperCase())}</Typography>
                            </div>
                        </div>

                    </div>
                    <div className="img_resource" style={{ marginTop: '24px' }}>
                        <img src={`${baseURL}${data?.imageUrl}`} alt="" style={{ width: '100%', borderRadius: '8px', height: '350px', objectFit: 'cover' }} />
                    </div>
                    <div className="content" style={{ marginTop: '24px' }}>
                        {data?.solutions.map((solution) =>
                            <Typography variant="body2" component="p" sx={{ mb: 3, fontWeight: '500' }}>{solution.text}</Typography>
                        )}
                    </div>

                </Grid>
                <Grid item md={4} xs={12}>
                    <Box sx={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '8px', padding: '16px' }}>
                        {(data?.activity != null || data?.area?.externalResource != null || data?.area?.course != null || data?.area?.material != null) && <Typography variant="body1" component="h3" sx={{ mb: 4, p: 0, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left', fontWeight: '700' }}>{t("mySpace-myResources:EXPLORE THE CURATED LIST TEXT")}</Typography>}
                        {data?.activity != null && <Box sx={{ mb: 4, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div className="header" style={{ display: 'flex' }}>
                                <IconActivity />
                                <div style={{ marginLeft: '15px', flex: '1' }}>
                                    <Typography variant="subtitle3" component="h5" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, fontWeight: '400' }}>{t("mySpace-myResources:OPPORTUNITY ACTIVITY")}</Typography>
                                    <Typography variant="body2" component="h5" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, fontWeight: '700' }}>{data?.activity?.title}</Typography>
                                </div>
                            </div>
                            <StyledButton eVariant="secondary" eSize="xsmall" onClick={() => { navigate(data?.activity?.url) }}>{t("mySpace-myResources:CHECK")}</StyledButton>
                        </Box>}

                        {data?.area?.externalResource != null && <Box sx={{ mb: 4, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div className="header" style={{ display: 'flex' }}>
                                <IconExternalCourse />
                                <div style={{ marginLeft: '15px', flex: '1' }}>
                                    <Typography variant="subtitle3" component="h5" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, fontWeight: '400' }}>{t("mySpace-myResources:OPPORTUNITY EXTERNAL RESOURCES")}</Typography>
                                    <Typography variant="body2" component="h5" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, fontWeight: '700' }}>{data?.area?.externalResource.title}</Typography>
                                </div>
                            </div>
                            <StyledButton eVariant="secondary" eSize="xsmall" onClick={() => { window.open(data?.area?.externalResource.url, '_blank').focus(); }}>{t("mySpace-myResources:CHECK")}</StyledButton>
                        </Box>}

                        {data?.area?.material != null && <Box sx={{ mb: 4, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div className="header" style={{ display: 'flex' }}>
                                <IconMaterial />
                                <div style={{ marginLeft: '15px', flex: '1' }}>
                                    <Typography variant="subtitle3" component="h5" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, fontWeight: '400' }}>{t("mySpace-myResources:OPPORTUNITY MATERIAL")}</Typography>
                                    <Typography variant="body2" component="h5" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, fontWeight: '700' }}>{data?.area?.material?.title}</Typography>
                                </div>
                            </div>
                            <StyledButton eVariant="secondary" eSize="xsmall" onClick={() => { navigate(data?.area?.material?.url, { id: data?._id }) }} >{t("mySpace-myResources:CHECK")}</StyledButton>
                        </Box>}


                        {
                            data?.area != null && <Box sx={{ mb: 4, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div className="header" style={{ display: 'flex' }}>
                                    <IconLearnMore />
                                    <div style={{ marginLeft: '15px', flex: '1' }}>
                                        <Typography variant="subtitle3" component="h5" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, fontWeight: '400' }}>{t("mySpace-myResources:OPPORTUNITY LEARN MORE")}</Typography>
                                        <Typography variant="body2" component="h5" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, fontWeight: '700' }}>{data?.area?.name}</Typography>
                                    </div>
                                </div>
                                <StyledButton eVariant="secondary" eSize="xsmall" onClick={
                                    () => {
                                        setResourceId(data?.area?.key)
                                        setResourceType('areas')
                                    }
                                }>{t("mySpace-myResources:CHECK")}</StyledButton>
                            </Box>
                        }
                    </Box>
                    {data != null && <Grid container spacing={2}>
                        {(!("useful" in data)) ? <Grid item xs={12}>
                            <Box className="helpSec" sx={{ mt: 3, borderRadius: '8px' }}>
                                <div className="right_sec">
                                    <Typography variant="subtitle3" component="h4" sx={{ fontWeight: '500', marginBottom: '15px', display: { xs: 'none', sm: 'none', md: 'block' } }}>{t("mySpace-myResources:WAS HELPFUL")}</Typography>
                                    <div className="btns" style={{ display: 'flex' }}>
                                        <StyledButton onClick={() => {
                                            const req = {
                                                '_id': data?._id,
                                                'useful': false
                                            }
                                            storeFeedback('opportunities', req)
                                        }} className="btnprim" eVariant="primary" eSize="medium" sx={{ minWidth: '125px !important' }}>{t("mySpace-myResources:NOT REALLY")}</StyledButton>
                                        <StyledButton onClick={() => {
                                            const req = {
                                                '_id': data?._id,
                                                'useful': true
                                            }
                                            storeFeedback('opportunities', req)
                                        }} eVariant="secondary" eSize="medium" sx={{ minWidth: '125px !important' }}>{t("mySpace-myResources:YES")}</StyledButton>
                                    </div>
                                </div>
                            </Box>
                        </Grid> : data.useful == 0 ? <Grid item xs={12}>
                            <Box className="helpSec" sx={{ mt: 3, borderRadius: '8px' }}>
                                <div className="right_sec">
                                    <Typography variant="subtitle3" component="h4" sx={{ fontWeight: '500', marginBottom: '15px', display: { xs: 'none', sm: 'none', md: 'block' } }}>{t("mySpace-myResources:WAS HELPFUL")}</Typography>
                                    <div className="btns" style={{ display: 'flex' }}>
                                        <StyledButton onClick={() => {
                                            const req = {
                                                '_id': data?._id,

                                                'useful': false
                                            }
                                            storeFeedback('opportunities', req)
                                        }} className="btnprim" eVariant="primary" eSize="medium" sx={{ minWidth: '125px !important' }}>{t("mySpace-myResources:NOT REALLY")}</StyledButton>
                                        <StyledButton onClick={() => {
                                            const req = {
                                                '_id': data?._id,

                                                'useful': true
                                            }
                                            storeFeedback('opportunities', req)
                                        }} eVariant="secondary" eSize="medium" sx={{ minWidth: '125px !important' }}>{t("mySpace-myResources:YES")}</StyledButton>
                                    </div>
                                </div>
                            </Box>
                        </Grid> : null}
                        {/* <Grid item md={5} xs={12}>
                            <Box sx={{ boxShadow: 'none', padding: '12px 16px', backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Typography variant="h3" component="h3" sx={{ textAlign: 'left', padding: '0', color: new_theme.palette.newSupplementary.NSupText }}>{t("mySpace-myResources:NEXT STEPS")}</Typography>
                                    <Typography variant="h4" component="h4" sx={{ textAlign: 'left', padding: '0', color: new_theme.palette.newSupplementary.NSupText }}>{t("mySpace-myResources:FIND SOLUTION")}</Typography>
                                </div>
                                <img src={FindSolution} style={{ height: '170px' }} />
                            </Box>
                        </Grid> */}
                    </Grid>}
                </Grid>
            </Grid>
        </Grid>

        );
    case 'areas' :
        return (
            <Grid item xs={12}>
            <Grid container spacing={4}>
                <Grid item md={8} xs={12}>
                    <div className="top_heading">
                        <div onClick={() => setResourceId(0)} className='arrow_icon'>
                            <ArrowBackIos />
                        </div>

                        <div>
                            <Typography variant="body2" component="h6" sx={{ textAlign: 'left', mb: 2 }}>{t("mySpace-myResources:HOW TO SOLVE")}</Typography>
                            <Typography variant="h3" component="h3" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, marginBottom: '10px' }}>{data?.name}</Typography>
                            <Typography variant="body2" component="p" sx={{ textAlign: 'left', color: new_theme.palette.secondary.Turquoise, mb: 2, cursor: 'pointer' }} onClick={() => {
                                const req = {
                                    '_id': data?._id,

                                    'favourite': !(data?.favourite == undefined ? false : data?.favourite),
                                }
                                storeFeedback('areas', req)
                            }}><BookmarkBorderIcon sx={{ color: new_theme.palette.secondary.Turquoise }} />{data?.favourite ? t("mySpace-myResources:REMOVE FROM MY RESOURCES") : t("mySpace-myResources:ADD TO MY RESOURCES")}</Typography>
                            <div className="label" style={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '16px', display: 'inline-block', padding: '8px 40px', color: new_theme.palette.newSupplementary.SupCloudy }}>
                                <Typography variant="body2" component="span" sx={{ textAlign: 'left', fontWeight: 'normal' }}>{t('mySpace-myResources:TYPE-'+data?.type.toUpperCase())}</Typography>
                            </div>
                        </div>

                    </div>
                    <div className="img_resource" style={{ marginTop: '20px', marginBottom: '16px' }}>
                        <img src={`${baseURL}${data?.imageUrl}`} alt="" style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '8px', border: `1px solid ${new_theme.palette.newSupplementary.SupCloudy}` }} />
                    </div>
                    <div className="content">
                        <Typography variant="body2" component="p" sx={{ mb: 3, fontWeight: '500' }}>
                            {data?.description}
                        </Typography>
                    </div>
                    <Grid container spacing={4} sx={{ mt: 3 }}>
                        <Grid item md={6} sm={12}>
                            <Box>
                                <Typography variant="h4" component="h4" sx={{ p: 0, mb: 2, textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, borderBottom: `1px solid ${new_theme.palette.primary.PBorderColor}` }}>{t("mySpace-myResources:BENEFITS")}</Typography>
                                <Typography variant="body2" component="p" sx={{ textAlign: 'left', fontWeight: 'normal' }}>{data?.benefits}</Typography>
                            </Box>
                        </Grid>
                        <Grid item md={6} sm={12}>
                            <Box>
                                <Typography variant="h4" component="h4" sx={{ p: 0, mb: 2, textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, borderBottom: `1px solid ${new_theme.palette.primary.PBorderColor}` }}>{t("mySpace-myResources:IMPACT")}</Typography>
                                <Typography variant="body2" component="p" sx={{ textAlign: 'left', fontWeight: 'normal' }}>{data?.impact}</Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={4} xs={12}>
                    <Box sx={{ padding: '30px 20px', backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: "16px" }}>
                        <div style={{ textAlign: 'center' }}>
                            <PurpleBulb style={{ marginBottom: '16px', padding: '30px', borderRadius: '50%', backgroundColor: new_theme.palette.primary.PWhite, height: '105px', width: '105px' }} />
                            <div className="">
                                <Typography variant="h3" component="h3" sx={{ color: new_theme.palette.newSupplementary.NSupText, mb: 2 }}>{t("mySpace-myResources:WAS IDENTIFIED")}</Typography>
                                <div>
                                    <StyledButton onClick={() => {
                                            const req = {
                                                '_id': data?._id,
                                                'confirmed': false
                                            }
                                            storeFeedback('areas', req)
                                        }} eVariant="secondary" eSize="medium" sx={{ mb: 2, width: '100%' }}>{t("mySpace-myResources:NOT REALLY")}</StyledButton>
                                    <StyledButton onClick={() => {
                                            const req = {
                                                '_id': data?._id,
                                                'confirmed': true
                                            }
                                            storeFeedback('areas', req)
                                        }} eVariant="primary" eSize="medium" sx={{ width: '100%' }}>{t("mySpace-myResources:YES")}</StyledButton>

                                </div>
                            </div>
                        </div>
                    </Box>
                    {data != null ? (!("useful" in data) || (data.useful == 0)) &&
                        <Box className="helpSec" sx={{ mt: 3, borderRadius: '8px' }}>
                            {/* <Typography variant="h4" component="h4" sx={{ marginBottom: '15px', color: new_theme.palette.newSupplementary.NSupText, textAlign: 'center', display: { xs: 'block', sm: 'block', md: 'none' } }}>{t("mySpace-myResources:WHAT IT HELPFUL?")}</Typography>
                            <IconRobo className="imagerobo" sx={{ borderRadius: '50%', marginRight: '30px', backgroundColor: new_theme.palette.primary.PWhite }} /> */}
                            <div className="right_sec">
                                <Typography variant="subtitle3" component="h4" sx={{ fontWeight: '500', marginBottom: '15px', display: { xs: 'none', sm: 'none', md: 'block' } }}>{t("mySpace-myResources:WAS HELPFUL")}</Typography>
                                <div className="btns" style={{ display: 'flex' }}>
                                    <StyledButton className="btnprim" eVariant="secondary" onClick={() => {
                                        const req = {
                                            '_id': data?._id,
                                            'useful': false
                                        }
                                        storeFeedback('areas', req)
                                    }} eSize="medium">{t("mySpace-myResources:NOT REALLY")}</StyledButton>
                                    <StyledButton eVariant="primary" eSize="medium" onClick={() => {
                                        const req = {
                                            '_id': data?._id,
                                            'useful': true
                                        }
                                        storeFeedback('areas', req)
                                    }}>{t("mySpace-myResources:YES")}</StyledButton>
                                </div>
                            </div>
                        </Box>
                        : null}
                </Grid>
            </Grid>
        </Grid>
        );
    case 'material':
        return (
            <Grid item xs={12} >
                        <Grid container spacing={4}>
                            <Grid item lg={8} md={12}>
                                <div className="top_heading">
                                    <div className='arrow_icon' onClick={() => setResourceId(0)}>
                                        <ArrowBackIos  />
                                    </div>
                                    <div>
                                        <Typography variant="body2" component="h6" sx={{ textAlign: 'left', mb: 2 }}>{t("mySpace-myResources:HOW TO SOLVE")}</Typography>
                                        <Typography variant="h3" component="h3" sx={{ textAlign: 'left', mb: 2 }}>{data?.opportunity.text}</Typography>
                                        <Typography variant="body2" component="p" sx={{ textAlign: 'left', color: new_theme.palette.secondary.Turquoise, mb: 2, cursor: 'pointer' }} onClick={() => {
                                const req = {
                                    '_id': data?._id,

                                    'favourite': !(data?.favourite == undefined ? false : data?.favourite),
                                }
                                storeFeedback('material', req)
                            }}>
                                            <BookmarkIcon sx={{ color: new_theme.palette.secondary.Turquoise, }} />{data?.favourite ? t("mySpace-myResources:REMOVE FROM MY RESOURCES") : t("mySpace-myResources:ADD TO MY RESOURCES")}
                                        </Typography>
                                        <div className="label" style={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '16px', display: 'inline-block', padding: '6px 18px', color: new_theme.palette.newSupplementary.SupCloudy }}>
                                            <Typography variant="body2" component="span" sx={{ textAlign: 'left' }}>{t('mySpace-myResources:TYPE-'+data?.opportunity.type.toUpperCase())}</Typography>

                                            {/* <Typography variant="body2" component="span" sx={{ textAlign: 'left', mr: 1 }}>{t("mySpace-myResources:PROGRESS IN LIFE")}</Typography> */}
                                        </div>
                                        <div className="label" style={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '16px', display: 'inline-block', padding: '6px 18px', color: new_theme.palette.newSupplementary.SupCloudy }}>

                                        <Typography variant="body2" component="span" sx={{ textAlign: 'left' }}> {moment(data?.deadline).format("DD.MM.YYYY")}</Typography>
                                        </div>

                                    </div>
    
                                </div>
                                <div className="img_resource" style={{ marginTop: '24px' }}>
                                    <img src={`${baseURL}${data?.opportunity.imageUrl}`} alt="" style={{ width: '100%', borderRadius: '8px', height: '350px', objectFit: 'cover' }} />
                                </div>
                                <div className="content" style={{ marginTop: '24px' }}>
                                    {data?.opportunity?.solutions?.map((solution)=><Typography variant="body2" component="p" sx={{ mb: 3, fontWeight: '500' }}>{solution?.text}</Typography>)}
                                </div>
    
                            </Grid>
                            <Grid item lg={4} md={12}>
                                <Box  sx={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '8px', padding: '16px' }}>
                                    <Typography variant="body1" component="h3" sx={{ mb: 4, p: 0, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left', fontWeight: '700' }}>{t("mySpace-myResources:EXPLORE THE CURATED LIST TEXT")}</Typography>
                                    {data?.cognitiveBlocks.map((block)=>
                                    <Box className='box-resource' sx={{ mb: 4, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div className="header" style={{ display: 'flex' }}>
                                        <IconActivity />
                                        <div style={{ marginLeft: '15px', flex: '1' }}>
                                            {/* <Typography variant="subtitle1" component="h6" sx={{ fontWeight: '500' }}>{t("mySpace-myResources:BLOCK 1")}</Typography> */}
                                            <Typography variant="body2" component="h3" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, fontWeight: '700' }}>{block?.content?.title}</Typography>
                                            <Typography variant="subtitle1" component="h6" sx={{ color: new_theme.palette.newSupplementary.NSupText, fontWeight: '500' }}>{t("mySpace-myResources:DEADLINE")}: {moment(block?.deadline).format("DD.MM.YYYY")}</Typography>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <Typography variant="subtitle3" component="h6" sx={{ fontWeight: '500' }}>{t("mySpace-myResources:STATUS")}</Typography>
                                                <FormControl className='status-dd' sx={{ m: 1, minWidth: 120, }} size="small">
                                                    <Select
                                                        id="demo-select-small"
                                                        defaultValue={block?.status}
                                                        onChange={(e)=>{
                                                            changeStatus(block?._id,{
                                                                'status':e.target.value
                                                            })
                                                        }}
                                                    >
                                                        <MenuItem value={"todo"} selected={block?.status==="todo"?true:false}>{t("mySpace-myResources:TO DO")}</MenuItem>
                                                        <MenuItem value={"in_progress"} selected={block?.status==="in_progress"?true:false}>{t("mySpace-myResources:IN PROGRESS")}</MenuItem>
                                                        <MenuItem value={"done"} selected={block?.status==="done"?true:false}>{t("mySpace-myResources:DONE")}</MenuItem>

                                                    </Select>
                                                </FormControl>
                                            </div>
                                        </div>
                                    </div>
                                    <StyledButton eVariant="primary" eSize="xsmall" onClick={()=>{
                                        navigate(`/content/display/${block?.content._id}?blockId=${block?._id}`)
                                    }} >{t("mySpace-myResources:START")}</StyledButton>
                                    
                                </Box>
                                    )}
                                    
                                </Box>
                                {data != null && <Grid container spacing={2}>
                                    {(!("useful" in data)) ? <Grid item xs={12}>
                                        <Box className="helpSec" sx={{ mt: 3, borderRadius: '8px' }}>
                                            <div className="right_sec">
                                                <Typography variant="subtitle3" component="h4" sx={{ fontWeight: '500', marginBottom: '15px', display: { xs: 'none', sm: 'none', md: 'block' } }}>{t("mySpace-myResources:WAS HELPFUL")}</Typography>
                                                <div className="btns" style={{ display: 'flex' }}>
                                                    <StyledButton onClick={() => {
                                                        const req = {
                                                            '_id': data?._id,
                                                            'useful': false
                                                        }
                                                        storeFeedback('material', req)
                                                    }} className="btnprim" eVariant="primary" eSize="medium" sx={{ minWidth: '125px !important' }}>{t("mySpace-myResources:NOT REALLY")}</StyledButton>
                                                    <StyledButton onClick={() => {
                                                        const req = {
                                                            '_id': data?._id,
                                                            'useful': true
                                                        }
                                                        storeFeedback('material', req)
                                                    }} eVariant="secondary" eSize="medium" sx={{ minWidth: '125px !important' }}>{t("mySpace-myResources:YES")}</StyledButton>
                                                </div>
                                            </div>
                                        </Box>
                                    </Grid> : data.useful == 0 ? <Grid item xs={12}>
                                        <Box className="helpSec" sx={{ mt: 3, borderRadius: '8px' }}>
                                            <div className="right_sec">
                                                <Typography variant="subtitle3" component="h4" sx={{ fontWeight: '500', marginBottom: '15px', display: { xs: 'none', sm: 'none', md: 'block' } }}>{t("mySpace-myResources:WAS HELPFUL")}</Typography>
                                                <div className="btns" style={{ display: 'flex' }}>
                                                    <StyledButton onClick={() => {
                                                        const req = {
                                                            '_id': data?._id,
    
                                                            'useful': false
                                                        }
                                                        storeFeedback('material', req)
                                                    }} className="btnprim" eVariant="primary" eSize="medium" sx={{ minWidth: '125px !important' }}>{t("mySpace-myResources:NOT REALLY")}</StyledButton>
                                                    <StyledButton onClick={() => {
                                                        const req = {
                                                            '_id': data?._id,
    
                                                            'useful': true
                                                        }
                                                        storeFeedback('material', req)
                                                    }} eVariant="secondary" eSize="medium" sx={{ minWidth: '125px !important' }}>{t("mySpace-myResources:YES")}</StyledButton>
                                                </div>
                                            </div>
                                        </Box>
                                    </Grid> : null}
                                </Grid>}


                            </Grid>
                        </Grid>
                    </Grid>
    
        );
    }

           })()
           }
        </ThemeProvider>
    );
};

export default ResourceDetails;