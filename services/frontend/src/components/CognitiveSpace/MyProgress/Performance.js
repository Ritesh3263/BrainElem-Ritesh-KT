import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";

// MUI v5
import { Box, Container, Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import Tabs from '@mui/material/Tabs';
import PropTypes from 'prop-types';
import Tab from '@mui/material/Tab';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from "swiper";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import StyledButton from "new_styled_components/Button/Button.styled";
import { ReactComponent as ResourcesAll } from "../../../img/cognitive_space/resources_all.svg";
import { ReactComponent as ResourcesFavourite } from "../../../img/cognitive_space/resources_favourite.svg";
import MissionImg from "../../../img/cognitive_space/mission_img.svg";
import TestNameImg from "../../../img/cognitive_space/test_name_thumbnail.png";
import BlueBoredImg from "../../../img/cognitive_space/Blue_LVL3_Bored.svg";

import { ReactComponent as IconStarSkills } from "../../../img/cognitive_space/icon_starskills.svg";
import { ReactComponent as IconSmiley } from "../../../img/cognitive_space/icon_smiley.svg";
import { ReactComponent as IconFire } from "../../../img/cognitive_space/icon_fire.svg";
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/system";
import { ArrowBackIos } from '@mui/icons-material';
import { ArrowForwardIos } from "@mui/icons-material";
import 'swiper/css';
import "swiper/css/navigation";
import "./MyProgress.scss"


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography variant="h3" component="h3" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText }}>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};


function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}
const Performance = ({ setCurrentTab }) => {
    const { t } = useTranslation(['translation', 'tips', 'traits', 'profiles', 'issues', 'solutions', 'cognitiveSpace', 'cognitiveSpaceFAQ']);
    const [value, setValue] = React.useState(0);
    const navigationPrevRef = React.useRef(null)
    const navigationNextRef = React.useRef(null)
    const learningTipsPrevRef = React.useRef(null)
    const learningTipsNextRef = React.useRef(null)
    const [solutions, setSolutions] = useState([]);
    const [resourceId, setResourceId] = useState('0');
    const [resource, setResource] = useState(null);
    const [resourceType, setResourceType] = useState('opportunities');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
        height: 10,
        borderRadius: 5,
        [`&.${linearProgressClasses.colorPrimary}`]: {
            backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
        },
        [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            backgroundColor: theme.palette.mode === 'light' ? `${new_theme.palette.primary.MedPurple}` : `${new_theme.palette.primary.MedPurple}`,
        },
    }));

    return (
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv main_results">
                <Grid container>
                    <Grid item xs={12}>
                        <div className="admin_heading">
                            <Typography variant="h1" component="h1">{t("My Resources")}</Typography>
                            <Divider variant="insert" className='heading_divider' />
                        </div>
                    </Grid>

                    <Grid item xs={12} sx={{ pt: 0 }}>
                        <Box
                            sx={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy, padding: '16px', flexGrow: 1, display: 'flex' }}
                        >
                            <Tabs
                                orientation="vertical"
                                variant="scrollable"
                                value={value}
                                onChange={handleChange}
                                aria-label="Vertical tabs example"
                                className="verticle_tabs"
                                sx={{ borderColor: 'divider', flexDirection: 'row' }}
                            >
                                <Tab label={<Typography className="typo_h3" component="h3">{t('Performance')}</Typography>} {...a11yProps(0)} icon={<ResourcesAll />} />
                                <Tab label={<Typography className="typo_h3" component="h3">{t("More")}</Typography>} {...a11yProps(1)} icon={<ResourcesFavourite />} />
                            </Tabs>
                            <TabPanel className="tab_panel" value={value} index={0} sx={{ backgroundColor: new_theme.palette.primary.PWhite, width: '100%' }}>
                                <Grid item xs={12}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="result_title" component="h2" sx={{ mb: 2, textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText }}>{t("Overview")}</Typography>
                                            <div className="overview_container">
                                                <Box className="overview_item img_diamond" sx={{ backgroundColor: new_theme.palette.secondary.Turquoise }}>
                                                    <Typography variant="h1" component="h1" sx={{ color: new_theme.palette.primary.PWhite }}>{t("21")}</Typography>
                                                    <Typography variant="h3" component="h1" sx={{ color: new_theme.palette.primary.PWhite }}>{t("Points")}</Typography>
                                                </Box>
                                                <Box className="overview_item img_skills" sx={{ backgroundColor: new_theme.palette.primary.MedPurple }}>
                                                    <Typography variant="h1" component="h1" sx={{ color: new_theme.palette.primary.PWhite }}>{t("3")}</Typography>
                                                    <Typography variant="h3" component="h1" sx={{ color: new_theme.palette.primary.PWhite }}>{t("Skills")}</Typography>
                                                </Box>
                                                <Box className="overview_item img_badges" sx={{ backgroundColor: new_theme.palette.primary.PPurple }}>
                                                    <Typography variant="h1" component="h1" sx={{ color: new_theme.palette.primary.PWhite }}>{t("7")}</Typography>
                                                    <Typography variant="h3" component="h1" sx={{ color: new_theme.palette.primary.PWhite }}>{t("Badges")}</Typography>
                                                </Box>

                                            </div>

                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="result_title" component="h2" sx={{ mb: 2, textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText }}>{t("Streak")}</Typography>
                                            <Box sx={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy, padding: '12px', borderRadius: '10px', mb: 4 }}>
                                                <div className="steak_container" style={{ marginBottom: '20px' }}>
                                                    <div className="steak_item has_stickItem">
                                                        <IconFire />
                                                    </div>
                                                    <div className="steak_item has_stickItem">
                                                        <IconFire />
                                                    </div>
                                                    <div className="steak_item has_stickItem">
                                                        <IconFire />
                                                    </div>
                                                    <div className="steak_item">

                                                    </div>
                                                    <div className="steak_item">

                                                    </div>
                                                    <div className="steak_item">

                                                    </div>
                                                    <div className="steak_item">

                                                    </div>
                                                </div>
                                                <div className="steak_fotter">
                                                    <div>
                                                        <Typography variant="body3" component="h3" sx={{ fontWeight: 'bold', color: new_theme.palette.primary.MedPurple }}>{t("Current ")} <span style={{ color: new_theme.palette.newSupplementary.NSupText }}>: 3 Days</span></Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="body3" component="h3" sx={{ fontWeight: 'bold', color: new_theme.palette.primary.MedPurple }}>{t("Best ")} <span style={{ color: new_theme.palette.newSupplementary.NSupText }}>: 10 Days</span></Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: new_theme.palette.newSupplementary.SupCloudy, padding: '26px 20px', borderRadius: '10px', mb: 4 }}>
                                                <img src={MissionImg} />
                                                <div className="mission_skills">
                                                    <Typography variant="result_title" component="h2" sx={{ mb: 2, textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, mb: 2 }}>{t("Mission")} : {t("Earn Skill")}</Typography>
                                                    <Typography variant="body2" component="p" sx={{ mb: 2 }}>{t("Take our test and earn a badge! Demonstrate your knowledge and skills by completing our test, and receive a badge to showcase your achievement.")}</Typography>
                                                    <StyledButton eVariant="primary" eSize="medium">{t("Unclock")}</StyledButton>
                                                </div>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid item md={6} xs={12}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                <Typography variant="result_title" component="h6">{t("Badges")}</Typography>
                                                <Typography variant="h3" component="h6"><Link style={{ textDecoration: 'underline', color: new_theme.palette.primary.MedPurple }}>{t("View More")}</Link></Typography>
                                            </div>
                                            <Box sx={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy }}>
                                                <div className="sk_container">
                                                    <div className="sk_item">
                                                        <Box className="sk_icon">
                                                            <IconSmiley />
                                                        </Box>
                                                        <div className="sk_content">
                                                            <Typography variant="body2" component="h6" sx={{ mb: 1 }}>{t("#BadgeName")}</Typography>
                                                            <Typography variant="subtitle3" component="p" sx={{ mb: 1, fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                                                <BorderLinearProgress variant="determinate" value={50} sx={{ width: '95%', marginRight: '12px' }} />
                                                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                                                            </Box>
                                                        </div>
                                                    </div>
                                                    <div className="sk_item">
                                                        <Box className="sk_icon">
                                                            <IconSmiley />
                                                        </Box>
                                                        <div className="sk_content">
                                                            <Typography variant="body2" component="h6" sx={{ mb: 1 }}>{t("#BadgeName")}</Typography>
                                                            <Typography variant="subtitle3" component="p" sx={{ mb: 1, fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                                                <BorderLinearProgress variant="determinate" value={50} sx={{ width: '95%', marginRight: '12px' }} />
                                                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                                                            </Box>
                                                        </div>
                                                    </div>
                                                    <div className="sk_item">
                                                        <Box className="sk_icon">
                                                            <IconSmiley />
                                                        </Box>
                                                        <div className="sk_content">
                                                            <Typography variant="body2" component="h6" sx={{ mb: 1 }}>{t("#BadgeName")}</Typography>
                                                            <Typography variant="subtitle3" component="p" sx={{ mb: 1, fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                                                <BorderLinearProgress variant="determinate" value={50} sx={{ width: '95%', marginRight: '12px' }} />
                                                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                                                            </Box>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Box>
                                        </Grid>
                                        <Grid item md={6} xs={12} sx={{ paddingLeft: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingLeft: '16px' }}>
                                                <Typography variant="result_title" component="h6">{t("Skills")}</Typography>
                                                <Typography variant="h3" component="h6"><Link style={{ textDecoration: 'underline', color: new_theme.palette.primary.MedPurple }}>{t("View More")}</Link></Typography>
                                            </div>
                                            <Box sx={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy }}>
                                                <div className="sk_container">
                                                    <div className="sk_item skills_item">
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <IconStarSkills style={{ marginRight: '8px', height: '30px' }} />
                                                                <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                                            </div>
                                                            <div>
                                                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("Lavelname")}</Typography>
                                                            </div>
                                                        </div>
                                                        <div className="sk_content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <div>
                                                                <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500', paddingRight: '12px' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                                            </div>
                                                            <div style={{ height: '35px', width: '35px', border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                                                                <ArrowForwardIos style={{ height: '15px' }} />
                                                            </div>
                                                        </div>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                            <BorderLinearProgress variant="determinate" value={50} sx={{ width: '70%', marginRight: '12px' }} />
                                                            <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                                                        </Box>
                                                    </div>
                                                    <div className="sk_item skills_item">
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <IconStarSkills style={{ marginRight: '8px', height: '30px' }} />
                                                                <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                                            </div>
                                                            <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("Lavelname")}</Typography>
                                                        </div>
                                                        <div className="sk_content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <div>
                                                                <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500', paddingRight: '12px' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                                            </div>
                                                            <div style={{ height: '35px', width: '35px', border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                                                                <ArrowForwardIos style={{ height: '15px' }} />
                                                            </div>
                                                        </div>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                            <BorderLinearProgress variant="determinate" value={50} sx={{ width: '70%', marginRight: '12px' }} />
                                                            <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                                                        </Box>
                                                    </div>
                                                    <div className="sk_item skills_item">
                                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                <IconStarSkills style={{ marginRight: '8px', height: '30px' }} />
                                                                <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                                            </div>
                                                            <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("Lavelname")}</Typography>
                                                        </div>
                                                        <div className="sk_content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                            <div>
                                                                <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500', paddingRight: '12px' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                                            </div>
                                                            <div style={{ height: '35px', width: '35px', border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                                                                <ArrowForwardIos style={{ height: '15px' }} />
                                                            </div>
                                                        </div>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                            <BorderLinearProgress variant="determinate" value={50} sx={{ width: '70%', marginRight: '12px' }} />
                                                            <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                                                        </Box>
                                                    </div>
                                                </div>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </TabPanel>
                            <TabPanel className="tab_panel" value={value} index={1} sx={{ backgroundColor: new_theme.palette.primary.PWhite, width: '100%' }}>
                                <Grid item xs={12} className="performance_swiper">
                                    <Typography variant="result_title" component="h4" sx={{ color: new_theme.palette.newSupplementary.NSupText, mb: 2 }}>{t("Recent Activity")}</Typography>
                                    <Swiper
                                        breakpoints={{
                                            640: {
                                                slidesPerView: 1,
                                            },
                                            768: {
                                                slidesPerView: 2,
                                            },
                                            1024: {
                                                slidesPerView: 3,
                                            },
                                        }}
                                        spaceBetween={16}
                                        autoplay={{
                                            delay: 2500000,
                                            disableOnInteraction: false,
                                        }}
                                        pagination={{
                                            clickable: true,
                                        }}
                                        navigation={{
                                            prevEl: navigationPrevRef.current,
                                            nextEl: navigationNextRef.current,
                                        }}
                                        onBeforeInit={(swiper) => {
                                            swiper.params.navigation.prevEl = navigationPrevRef.current;
                                            swiper.params.navigation.nextEl = navigationNextRef.current;
                                        }}
                                        modules={[Autoplay, Pagination, Navigation]}
                                        className="mySwiper"
                                    >
                                        <SwiperSlide>
                                            <div className="carousel_item">
                                                <img src={TestNameImg} alt="" />
                                                <div className="item_content">
                                                    <div className="item_cont">
                                                        <Typography variant="h3" component="h3" sx={{ p: 0, textAlign: 'left', mb: 1, color: new_theme.palette.secondary.DarkPurple }}>{t("How to solve")}</Typography>
                                                        <Typography variant="body2" className="carousel_para" component="p" sx={{ p: 0, mb: 2, }}>{t("I prefer to stay away from others and avoid conversations with people I don't know well.")}</Typography>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="carousel_item">
                                                <img src={TestNameImg} alt="" />
                                                <div className="item_content">
                                                    <div className="item_cont">
                                                        <Typography variant="h3" component="h3" sx={{ p: 0, textAlign: 'left', mb: 1, color: new_theme.palette.secondary.DarkPurple }}>{t("How to solve")}</Typography>
                                                        <Typography variant="body2" className="carousel_para" component="p" sx={{ p: 0, mb: 2, }}>{t("I prefer to stay away from others and avoid conversations with people I don't know well.")}</Typography>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="carousel_item">
                                                <img src={TestNameImg} alt="" />
                                                <div className="item_content">
                                                    <div className="item_cont">
                                                        <Typography variant="h3" component="h3" sx={{ p: 0, textAlign: 'left', mb: 1, color: new_theme.palette.secondary.DarkPurple }}>{t("How to solve")}</Typography>
                                                        <Typography variant="body2" className="carousel_para" component="p" sx={{ p: 0, mb: 2, }}>{t("I prefer to stay away from others and avoid conversations with people I don't know well.")}</Typography>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <div className="carousel_item">
                                                <img src={TestNameImg} alt="" />
                                                <div className="item_content">
                                                    <div className="item_cont">
                                                        <Typography variant="h3" component="h3" sx={{ p: 0, textAlign: 'left', mb: 1, color: new_theme.palette.secondary.DarkPurple }}>{t("How to solve")}</Typography>
                                                        <Typography variant="body2" className="carousel_para" component="p" sx={{ p: 0, mb: 2, }}>{t("I prefer to stay away from others and avoid conversations with people I don't know well.")}</Typography>
                                                    </div>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                        <ArrowBackIosNewIcon ref={navigationPrevRef} className="navigation_button next" />
                                        <ArrowForwardIosIcon ref={navigationNextRef} className="navigation_button prev" />
                                    </Swiper>
                                </Grid>
                                <Grid item xs={12} sx={{ mt: 4 }}>
                                    <Typography variant="result_title" component="h4" sx={{ color: new_theme.palette.newSupplementary.NSupText, mb: 2 }}>{t("Engagment")}</Typography>
                                    <Box sx={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy, padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: { xs: 'column', md: 'row' } }}>
                                        <div>
                                            <Typography variant="result_title" component="h2" sx={{ mb: 2 }}>{t("Activity Last Week")}</Typography>
                                            <Typography variant="h3" component="h3" sx={{ color: new_theme.palette.secondary.Turquoise }}>{t("1.01.2022 - 7.01.2022")}</Typography>
                                        </div>
                                        <div className="engagement_graph">

                                        </div>
                                        <div>
                                            <Typography variant="result_title" component="h2" sx={{ mb: 2 }}>{t("Average Visit Time")}</Typography>
                                            <Typography variant="h3" component="h3" sx={{ color: new_theme.palette.secondary.Turquoise }}>{t("40min")}</Typography>
                                        </div>
                                    </Box>
                                </Grid>
                            </TabPanel>
                        </Box>
                    </Grid>


                    {/* My Progress*/}
                    {/* <Grid item xs={12}>
                <div className="top_heading" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="arrow_icon">
                        <ArrowBackIos />
                    </div>
                    <div>
                        <Typography variant="h1" component="h1" sx={{ pb: 1 }}>{t("My progress")}</Typography>
                        <Divider className="heading_divider" />
                    </div>
                </div>
                <Box sx={{ mt: 4, display: 'flex', alignItems: 'center', backgroundColor: new_theme.palette.newSupplementary.SupCloudy, padding: '26px 20px', borderRadius: '10px', mb: 4, flexDirection: { xs: 'column', md: 'row' } }}>
                    <img src={MissionImg} className="mb_img" />
                    <div className="mission_skills">
                        <Typography variant="result_title" component="h2" sx={{ mb: 2, textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, mb: 2 }}>{t("Mission")} : {t("Earn Skill")}</Typography>
                        <Typography variant="h3" component="p" sx={{ fontWeight: '500', color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }}>{t("Take our test and earn a badge! Demonstrate your knowledge and skills by completing our test, and receive a badge to showcase your achievement.")}</Typography>
                    </div>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <div className="sk_item skills_item" style={{ border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '8px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ flex: 'none', height: '64px', width: '64px', marginRight: '10px', backgroundColor: new_theme.palette.primary.MedPurple, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconStarSkills className="w_white" style={{ color: new_theme.palette.primary.PWhite, height: '35px' }} />
                                </div>
                                <div style={{}}>
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <div className="sk_item skills_item" style={{ border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '8px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ flex: 'none', height: '64px', width: '64px', marginRight: '10px', backgroundColor: new_theme.palette.primary.MedPurple, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconStarSkills className="w_white" style={{ color: new_theme.palette.primary.PWhite, height: '35px' }} />
                                </div>
                                <div style={{}}>
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <div className="sk_item skills_item" style={{ border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '8px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ flex: 'none', height: '64px', width: '64px', marginRight: '10px', backgroundColor: new_theme.palette.primary.MedPurple, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconStarSkills className="w_white" style={{ color: new_theme.palette.primary.PWhite, height: '35px' }} />
                                </div>
                                <div style={{}}>
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <div className="sk_item skills_item" style={{ border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '8px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ flex: 'none', height: '64px', width: '64px', marginRight: '10px', backgroundColor: new_theme.palette.primary.MedPurple, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconStarSkills className="w_white" style={{ color: new_theme.palette.primary.PWhite, height: '35px' }} />
                                </div>
                                <div style={{}}>
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <div className="sk_item skills_item" style={{ border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '8px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ flex: 'none', height: '64px', width: '64px', marginRight: '10px', backgroundColor: new_theme.palette.primary.MedPurple, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconStarSkills className="w_white" style={{ color: new_theme.palette.primary.PWhite, height: '35px' }} />
                                </div>
                                <div style={{}}>
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                            </div>
                        </div>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={4}>
                        <div className="sk_item skills_item" style={{ border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '8px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div style={{ flex: 'none', height: '64px', width: '64px', marginRight: '10px', backgroundColor: new_theme.palette.primary.MedPurple, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <IconStarSkills className="w_white" style={{ color: new_theme.palette.primary.PWhite, height: '35px' }} />
                                </div>
                                <div style={{}}>
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </Grid> */}

                    {/* Test Name */}
                    {/* <Grid item xs={12}>
                <div className="top_heading" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="arrow_icon">
                        <ArrowBackIos />
                    </div>
                    <div>
                        <Typography variant="h1" component="h1" sx={{ pb: 1 }}>{t("Test_name")}</Typography>
                        <Divider className="heading_divider" />
                    </div>
                </div>
                <Box sx={{ flexDirection: { xs: 'column', md: 'row' }, mt: 4, display: 'flex', alignItems: 'center', backgroundColor: new_theme.palette.newSupplementary.SupCloudy, padding: '26px 35px', borderRadius: '10px', mb: 4 }}>
                    <div className="content" style={{ paddingRight: '15px' }}>
                        <Typography variant="result_title" component="h2" sx={{ mb: 2, textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, mb: 2 }}>{t("Mission")} : {t("Earn Skill")}</Typography>
                        <Typography variant="h3" component="p" sx={{ fontWeight: '500', color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }}>{t("Take our test and earn a badge! Demonstrate your knowledge and skills by completing our test, and receive a badge to showcase your achievement.")}</Typography>
                        <div className="test_skill_btns" style={{ marginTop: '16px' }}>
                            <StyledButton eVariant="primary" eSize="medium" sx={{ mr: 2 }}>{t("Start")}</StyledButton>
                            <StyledButton eVariant="secondary" eSize="medium">{t("Cancel")}</StyledButton>
                        </div>
                    </div>
                    <img src={TestNameImg} className="width_res" />
                </Box>
            </Grid> */}

                    {/* Test Done */}
                    {/* <Grid item xs={12}>
                <div className="top_heading" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="arrow_icon">
                        <ArrowBackIos />
                    </div>
                    <div>
                        <Typography variant="h1" component="h1" sx={{ pb: 1 }}>{t("Test_name")}</Typography>
                        <Divider className="heading_divider" />
                    </div>
                </div>
                <Box sx={{ flexDirection: { xs: 'column', md: 'row' }, mt: 4, display: 'flex', alignItems: 'center', backgroundColor: new_theme.palette.newSupplementary.SupCloudy, padding: '26px 35px', borderRadius: '10px', mb: 4 }}>
                    <div className="content" style={{ paddingRight: '15px' }}>
                        <Typography variant="result_title" component="h2" sx={{ mb: 2, textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, mb: 2 }}>{t("Well done! You’ve earned")}</Typography>
                        <Typography variant="h3" component="p" sx={{ mb: 2, fontWeight: '500', textAlign: 'left', color: new_theme.palette.secondary.Turquoise }}>{t("#Skill_name")}</Typography>
                        <Typography variant="h3" component="p" sx={{ fontWeight: '500', color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left' }}>{t("You have passed the knowledge test on basic level with 90 % result in this area. ")}</Typography>
                        <div className="test_skill_btns" style={{ marginTop: '16px' }}>
                            <StyledButton eVariant="primary" eSize="medium" sx={{ mr: 2 }}>{t("My Performance")}</StyledButton>
                            <StyledButton eVariant="secondary" eSize="medium">{t("Skip")}</StyledButton>
                        </div>
                    </div>
                    <img src={BlueBoredImg} className="width_res" />
                </Box>
            </Grid> */}

                    {/* Skills */}
                    {/* <Grid item xs={12}>
                <div className="top_heading" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="arrow_icon">
                        <ArrowBackIos />
                    </div>
                    <div>
                        <Typography variant="h1" component="h1" sx={{ pb: 1 }}>{t("Skills")}</Typography>
                        <Divider className="heading_divider" />
                    </div>
                </div>
                <Grid container spacing={4} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Box className="sk_item skills_item" sx={{ border: `1px solid ${new_theme.palette.secondary.SGrey}`, borderRadius: '10px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconStarSkills style={{ marginRight: '8px', height: '30px' }} />
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                </div>
                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("Lavelname")}</Typography>
                            </div>
                            <div className="sk_content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500', paddingRight: '12px' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                                <div style={{ height: '35px', width: '35px', border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                                    <ArrowForwardIos style={{ height: '15px', cursor: 'pointer' }} />
                                </div>
                            </div>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <BorderLinearProgress variant="determinate" value={50} sx={{ width: '70%', marginRight: '12px' }} />
                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box className="sk_item skills_item" sx={{ border: `1px solid ${new_theme.palette.secondary.SGrey}`, borderRadius: '10px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconStarSkills style={{ marginRight: '8px', height: '30px' }} />
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                </div>
                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("Lavelname")}</Typography>
                            </div>
                            <div className="sk_content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500', paddingRight: '12px' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                                <div style={{ height: '35px', width: '35px', border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                                    <ArrowForwardIos style={{ height: '15px', cursor: 'pointer' }} />
                                </div>
                            </div>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <BorderLinearProgress variant="determinate" value={50} sx={{ width: '70%', marginRight: '12px' }} />
                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box className="sk_item skills_item" sx={{ border: `1px solid ${new_theme.palette.secondary.SGrey}`, borderRadius: '10px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconStarSkills style={{ marginRight: '8px', height: '30px' }} />
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                </div>
                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("Lavelname")}</Typography>
                            </div>
                            <div className="sk_content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500', paddingRight: '12px' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                                <div style={{ height: '35px', width: '35px', border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                                    <ArrowForwardIos style={{ height: '15px', cursor: 'pointer' }} />
                                </div>
                            </div>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <BorderLinearProgress variant="determinate" value={50} sx={{ width: '70%', marginRight: '12px' }} />
                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box className="sk_item skills_item" sx={{ border: `1px solid ${new_theme.palette.secondary.SGrey}`, borderRadius: '10px', padding: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <IconStarSkills style={{ marginRight: '8px', height: '30px' }} />
                                    <Typography variant="body2" component="h6" sx={{ mb: 0 }}>{t("#SkillName")}</Typography>
                                </div>
                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("Lavelname")}</Typography>
                            </div>
                            <div className="sk_content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500', paddingRight: '12px' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                                <div style={{ height: '35px', width: '35px', border: `1px solid ${new_theme.palette.primary.PBorderColor}`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
                                    <ArrowForwardIos style={{ height: '15px', cursor: 'pointer' }} />
                                </div>
                            </div>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <BorderLinearProgress variant="determinate" value={50} sx={{ width: '70%', marginRight: '12px' }} />
                                <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>
            </Grid> */}

                    {/* Badges */}
                    {/* <Grid item xs={12}>
                <div className="top_heading" style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="arrow_icon">
                        <ArrowBackIos />
                    </div>
                    <div>
                        <Typography variant="h1" component="h1" sx={{ pb: 1 }}>{t("Badges")}</Typography>
                        <Divider className="heading_divider" />
                    </div>
                </div>
                <Grid container spacing={4} sx={{ mt: 2 }}>
                    <Grid item xs={12} md={6}>
                        <Box className="sk_item skills_item" sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${new_theme.palette.secondary.SGrey}`, borderRadius: '10px', padding: '12px' }}>
                            <Box sx={{ height: '75px', width: '75px', borderRadius: '50%', backgroundColor: new_theme.palette.secondary.Turquoise, marginRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', padding: '10px' }}>
                                <IconSmiley />
                            </Box>
                            <div>
                                <div className="sk_content">
                                    <Typography variant="body2" component="h6" sx={{ mb: 1 }}>{t("#BadgeName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ mb: 1, fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                    <BorderLinearProgress variant="determinate" value={50} sx={{ width: '95%', marginRight: '12px' }} />
                                    <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                                </Box>
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box className="sk_item skills_item" sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${new_theme.palette.secondary.SGrey}`, borderRadius: '10px', padding: '12px' }}>
                            <Box sx={{ height: '75px', width: '75px', borderRadius: '50%', backgroundColor: new_theme.palette.secondary.Turquoise, marginRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', padding: '10px' }}>
                                <IconSmiley />
                            </Box>
                            <div>
                                <div className="sk_content">
                                    <Typography variant="body2" component="h6" sx={{ mb: 1 }}>{t("#BadgeName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ mb: 1, fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                    <BorderLinearProgress variant="determinate" value={50} sx={{ width: '95%', marginRight: '12px' }} />
                                    <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                                </Box>
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box className="sk_item skills_item" sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${new_theme.palette.secondary.SGrey}`, borderRadius: '10px', padding: '12px' }}>
                            <Box sx={{ height: '75px', width: '75px', borderRadius: '50%', backgroundColor: new_theme.palette.secondary.Turquoise, marginRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', padding: '10px' }}>
                                <IconSmiley />
                            </Box>
                            <div>
                                <div className="sk_content">
                                    <Typography variant="body2" component="h6" sx={{ mb: 1 }}>{t("#BadgeName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ mb: 1, fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                    <BorderLinearProgress variant="determinate" value={50} sx={{ width: '95%', marginRight: '12px' }} />
                                    <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                                </Box>
                            </div>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Box className="sk_item skills_item" sx={{ display: 'flex', alignItems: 'center', border: `1px solid ${new_theme.palette.secondary.SGrey}`, borderRadius: '10px', padding: '12px' }}>
                            <Box sx={{ height: '75px', width: '75px', borderRadius: '50%', backgroundColor: new_theme.palette.secondary.Turquoise, marginRight: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none', padding: '10px' }}>
                                <IconSmiley />
                            </Box>
                            <div>
                                <div className="sk_content">
                                    <Typography variant="body2" component="h6" sx={{ mb: 1 }}>{t("#BadgeName")}</Typography>
                                    <Typography variant="subtitle3" component="p" sx={{ mb: 1, fontWeight: '500' }}>{t("Very short description for one line maximum two lines ")}</Typography>
                                </div>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                    <BorderLinearProgress variant="determinate" value={50} sx={{ width: '95%', marginRight: '12px' }} />
                                    <Typography variant="body2" component="h6" sx={{ fontWeight: '500' }}>{t("30/30")}</Typography>
                                </Box>
                            </div>
                        </Box>
                    </Grid>
                </Grid>
            </Grid> */}
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default Performance;