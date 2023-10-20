import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink, useNavigate } from "react-router-dom";

// MUI v5
import { Box, Container, Divider } from "@mui/material";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { ThemeProvider } from "@mui/system";
import { new_theme } from "NewMuiTheme";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import StyledButton from "new_styled_components/Button/Button.styled";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from "swiper";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ResourceDetails from "./ResourceDetails";
import CognitiveSpace from "../../../services/cognative-space.service"
import { ReactComponent as ResourcesAll } from "../../../img/cognitive_space/resources_all.svg";
import { ReactComponent as ResourcesFavourite } from "../../../img/cognitive_space/resources_favourite.svg";
import AreaDevelopment from "../../../img/cognitive_space/area_development.svg";
import BookmarkIcon from '@mui/icons-material/Bookmark';
import 'swiper/css';
import "swiper/css/navigation";
import "./MyResources.scss"
import { useMainContext } from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import { baseURL } from '../../../services/axiosSettings/axiosSettings'
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
                <Box sx={{ px: 3 }}>
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
const MyResources = ({ setCurrentTab, setTabValue }) => {
    const { t } = useTranslation(['mySpace-myResources', 'mySpace-virtualCoach', 'common']);
    const navigationPrevRef = React.useRef(null)
    const navigationNextRef = React.useRef(null)
    const learningTipsPrevRef = React.useRef(null)
    const learningTipsNextRef = React.useRef(null)
    const [solutions, setSolutions] = useState([]);
    const [companyMaterial, setCompanyMaterial] = useState([]);
    const [favs, setFavs] = useState([]);
    const navigate = useNavigate();
    const [resourceId, setResourceId] = useState('0');
    const [resource, setResource] = useState(null);
    const [learningTips, setlearningTips] = useState();
    const [value, setValue] = React.useState(0);
    const { F_showToastMessage, F_handleSetShowLoader, F_t } = useMainContext();
    const [resourceType, setResourceType] = useState('opportunities');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    function FnlearningTips() {
        setlearningTips(!learningTips);
    }
    useEffect(() => {
        CognitiveSpace.getAllSoltions().then((resp) => {
            setSolutions(resp.data);
        });
        CognitiveSpace.getAllCompanyMaterials().then((resp) => {
            setCompanyMaterial(resp.data);
        });
        CognitiveSpace.getAllFavs().then((resp) => {
            setFavs(resp.data)
        });
    }, [])
    const storeFeedback = (type, data) => {
        F_handleSetShowLoader(true);
        CognitiveSpace.storeFeedBack(type, data).then((resp) => {
            F_showToastMessage("Feedback Added.", "success")
            CognitiveSpace.getAllSoltions().then((resp) => {
                setSolutions(resp.data)
            });
            CognitiveSpace.getAllFavs().then((resp) => {
                setFavs(resp.data)
            });
        });
        F_handleSetShowLoader(false);
    }

    const noFavouriteData = () => {
        if ((favs?.tips?.length == 0 || favs?.tips?.length == undefined) && (favs?.opportunities?.length == 0 || favs?.opportunities?.length == undefined)) {
            return <>
                <Box sx={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy, p: 2, textAlign: 'center', width: '100%', borderRadius: '10px' }}>
                    <Typography variant="body1" component="h6">{t("mySpace-myResources:YOU DON'T HAVE ANY FAVOURITE RESOURCES YET")}</Typography>
                </Box>
            </>
        }
    }


    return (
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv main_results">
                <Grid container>
                    <Grid item xs={12}>
                        <div className="admin_heading" style={{marginBottom: '40px'}}>
                            <Typography variant="h1" component="h1">{t("mySpace-myResources:MY RESOURCES")}</Typography>
                            <Divider variant="insert" className='heading_divider' />
                        </div>
                    </Grid>

                    {resourceId == '0' ?
                        <>
                            <Grid item xs={12} sx={{ pt: 0 }}>
                                <Box className="box-mb-col"
                                    sx={{ flexGrow: 1, display: 'flex' }}
                                >
                                    <Tabs
                                        orientation="vertical"
                                        variant="scrollable"
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="Vertical tabs example"
                                        className="myResources_verticleTabs"
                                        sx={{ borderColor: 'divider', flexDirection: 'row' }}
                                    >
                                        {companyMaterial?.length > 0 && <Tab label={<Typography variant="body2" component="h3" sx={{ textTransform: 'capitalize', fontWeight: '500', margin: 'auto' }}>{F_t("mySpace-myResources:COMPANY MATERIALS")}</Typography>} {...a11yProps(0)} />}
                                        <Tab label={<Typography variant="body2" component="h3" sx={{ textTransform: 'capitalize', fontWeight: '500', margin: 'auto' }}>{t("mySpace-myResources:ALL SOLUTIONS")}</Typography>} {...a11yProps(0)} />
                                        <Tab label={<Typography variant="body2" component="h3" sx={{ textTransform: 'capitalize', fontWeight: '500', margin: 'auto' }}>{t("mySpace-myResources:FAVOURITES")}</Typography>} {...a11yProps(1)} />
                                    </Tabs>
                                    {companyMaterial?.length > 0 && <TabPanel className="myResources_tabPanel" value={value} index={0} sx={{ backgroundColor: new_theme.palette.primary.PWhite, width: '100%' }}>
                                        <Grid item xs={12} >
                                             <Grid container spacing={3}>
                                                {
                                                    companyMaterial?.map((material) => <Grid item xs={12} md={6} lg={4} onClick={() => {
                                                        setResourceId(material._id)
                                                        setResource(material)
                                                        setResourceType('material')
                                                    }}>
                                                        <div className="carousel_item">
                                                            <img src={`${baseURL}${material.opportunity.imageUrl}`} alt="" />
                                                            <div className="item_content">
                                                                <div className="item_cont">
                                                                    <Box sx={{ mb: 1, backgroundColor: new_theme.palette.primary.PLinkBlue, padding: '5px 5px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                        <Typography variant="subtitle1" component="p" sx={{ fontWeight: '500', p: 0, textAlign: 'left', mb: 0, display: 'inline-block', color: new_theme.palette.primary.PWhite }}>{F_t("mySpace-myResources:COMPANY MATERIALS")}</Typography>
                                                                    </Box>
                                                                    <Typography variant="subtitle1" component="p" sx={{ p: 0, textAlign: 'left', mb: 1 }}>{t("mySpace-myResources:TYPE-"+material.opportunity.type.toUpperCase())}</Typography>
                                                                    <Typography variant="body2" className="carousel_para three-line-only" component="p" sx={{ p: 0, m: 0 }}>{material.opportunity.text}</Typography>
                                                                    <Box sx={{ display: 'flex', gap: '5px 20px', flexWrap: 'wrap', my: 1 }}>
                                                                        {material?.opportunity?.area?.trait?.shortName && <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                            <span className="badge-dia badge-dia1" ></span><Typography variant="subtitle1" component='span'>{material?.opportunity?.area?.trait?.shortName}</Typography>
                                                                        </Box>}
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                            <span className="badge-dia badge-dia2" ></span><Typography variant="subtitle1" component='span'>{t("mySpace-myResources:TYPE-"+material.opportunity.type.toUpperCase())}</Typography>
                                                                        </Box>
                                                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                            <span className="badge-dia badge-dia3" ></span><Typography variant="subtitle1" component='span'>{F_t("mySpace-myResources:COMPANY MATERIAL")}</Typography>
                                                                        </Box>
                                                                    </Box>
                                                                </div>
                                                                {/* <Link style={{ textAlign: 'left', display: 'block', color: new_theme.palette.primary.MedPurple, fontWeight: 'bold', fontSize: '17px' }}><ArrowForwardIosIcon sx={{ fontSize: '17px', color: new_theme.palette.newSupplementary.NSupText }} /> {t("mySpace-myResources:TYPE-"+solution.type.toUpperCase())}</Link> */}
                                                            </div>
                                                        </div>
                                                    </Grid>)
                                                }
                                            </Grid>
                                        </Grid>
                                    </TabPanel>}
                                    <TabPanel className="myResources_tabPanel" value={value} index={companyMaterial?.length > 0 ? 1 : 0} sx={{ backgroundColor: new_theme.palette.primary.PWhite, width: '100%' }}>
                                        <Grid item xs={12}>
                                            <Box sx={{ padding: { xs: '15px', md: '20px 0 20px 20px', lg: '30px 30px 30px 30px', xl: '40px 0 40px 40px' }, backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: "16px" }}>
                                                <div className="mb-col" style={{ display: 'flex', alignItems: 'center' }}>
                                                    {/* <div className="img_robot" style={{ marginRight: '35px' }}>
                                                        <img src="/img/brand/webtest2.png" style={{ width: '65px' }} alt="" />
                                                    </div> */}
                                                    <div className="">
                                                        <Typography variant="h4" component="h4" sx={{ mb: 1, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left', paddingBottom: '0', paddingLeft: '0' }}>{t("mySpace-virtualCoach:VIRTUAL COACH")}</Typography>
                                                        <Typography variant="subtitle3" component="p" sx={{ lineHeight: '20px', textAlign: 'left', mb: 3, fontWeight: 'normal' }}>{t("mySpace-virtualCoach:VIRTUAL COACH IMPROVE SKILLS TEXT")}</Typography>
                                                        <StyledButton eVariant="primary" eSize="medium" onClick={(e) => { navigate('/virtualcoach') }}>{t("mySpace-virtualCoach:START")}</StyledButton>
                                                    </div>
                                                </div>
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} sx={{ mt: 4 }}>
                                            {solutions?.length > 0 &&
                                                // <div className="carousel_item">
                                                <Grid container spacing={4}>

                                                    {/* <Swiper
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
                                                slidesPerView={3}
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
                                                {
                                                    solutions.map((solution) => 
                                                    <SwiperSlide onClick={() => {
                                                        setResourceId(solution._id)
                                                        setResource(solution)
                                                        setResourceType('opportunities')
                                                        }}>
                                                        <div className="carousel_item">
                                                            <img src={`${solution.imageUrl}`} alt="" />
                                                            <div className="item_content">
                                                                <div className="item_cont">
                                                                    <Typography variant="h3" component="h3" sx={{ p: 0, textAlign: 'left', mb: 1 }}>{t("mySpace-myResources:HOW TO SOLVE")}</Typography>
                                                                    <Typography variant="body2" className="carousel_para" component="p" sx={{ p: 0, mb: 2, }}>{solution.text}</Typography>
                                                                </div>
                                                                <Link style={{ textAlign: 'left', display: 'block', color: new_theme.palette.primary.MedPurple, fontWeight: 'bold', fontSize: '17px' }}><ArrowForwardIosIcon sx={{ fontSize: '17px', color: new_theme.palette.newSupplementary.NSupText }} /> {t("mySpace-myResources:TYPE-"+solution.type.toUpperCase())}</Link>
                                                            </div>
                                                        </div>
                                                    </SwiperSlide>)
                                                }
                                                <ArrowBackIosNewIcon ref={navigationPrevRef} className="navigation_button next" />
                                                <ArrowForwardIosIcon ref={navigationNextRef} className="navigation_button prev" />
                                            </Swiper> */}
                                                    {
                                                        solutions.map((solution) =>
                                                            <Grid item xs={12} md={6} lg={4}>
                                                                <div className="carousel_item" onClick={() => {
                                                                    setResourceId(solution._id)
                                                                    setResource(solution)
                                                                    setResourceType('opportunities')
                                                                }}>
                                                                    <img src={`${baseURL}${solution.imageUrl}`} alt="" />
                                                                    <div className="item_content">
                                                                        <div className="item_cont">
                                                                            <Typography variant="h3" component="h3" sx={{ p: 0, textAlign: 'left', mb: 1 }}>{t("mySpace-myResources:HOW TO SOLVE")}</Typography>
                                                                            <Typography variant="body2" className="carousel_para three-line-only" component="p" sx={{ p: 0, mb: 2, }}>{solution.text}</Typography>
                                                                        </div>
                                                                        <Link style={{ textAlign: 'left', display: 'block', color: new_theme.palette.primary.MedPurple, fontWeight: 'bold', fontSize: '17px' }}><ArrowForwardIosIcon sx={{ fontSize: '17px', color: new_theme.palette.newSupplementary.NSupText }} /> {t("mySpace-myResources:TYPE-"+solution.type.toUpperCase())}</Link>
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                        )
                                                    }
                                                </Grid>
                                                // </div>
                                            }
                                        </Grid>
                                    </TabPanel>
                                    <TabPanel className="myResources_tabPanel" value={value} index={companyMaterial?.length > 0 ? 2 : 1} style={{ backgroundColor: new_theme.palette.primary.PWhite, width: '100%' }}>
                                        {
                                            noFavouriteData()
                                        }

                                        {favs?.tips?.length > 0 &&
                                            <Grid item xs={12}>
                                                <Typography variant="h2" component="h2" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, mb: 2 }}>{t("mySpace-myResources:LEARNING TIPS")}</Typography>
                                                <div className="carousel_item">
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
                                                        slidesPerView={3}
                                                        spaceBetween={16}
                                                        autoplay={{
                                                            delay: 2500000,
                                                            disableOnInteraction: false,
                                                        }}
                                                        pagination={{
                                                            clickable: true,
                                                        }}
                                                        navigation={{
                                                            prevEl: learningTipsPrevRef.current,
                                                            nextEl: learningTipsNextRef.current,
                                                        }}
                                                        onBeforeInit={(swiper) => {
                                                            swiper.params.navigation.prevEl = learningTipsPrevRef.current;
                                                            swiper.params.navigation.nextEl = learningTipsNextRef.current;
                                                        }}
                                                        modules={[Autoplay, Pagination, Navigation]}
                                                        className="mySwiper"
                                                    >
                                                        {
                                                            favs?.tips?.map((tip) => <SwiperSlide >
                                                                <Box className="learning_tips" sx={{ borderRadius: '10px', padding: '14px 10px 14px 12px' }}>
                                                                    <div className="item_content" style={{ backgroundColor: 'transparent', padding: '0' }}>
                                                                        <div className="item_cont">
                                                                            <Typography variant="body2" component="h6" sx={{ textAlign: 'left', color: new_theme.palette.secondary.Turquoise, mb: 2 }} onClick={() => {
                                                                                const req = {
                                                                                    '_id': tip?._id,

                                                                                    'favourite': false,
                                                                                }
                                                                                storeFeedback('tip', req)
                                                                            }}><BookmarkIcon sx={{ color: new_theme.palette.secondary.Turquoise, fontSize: '22px' }} /> {t("mySpace-myResources:REMOVE FROM MY RESOURCES")}</Typography>
                                                                            <Typography variant="body2" component="p" sx={{ textAlign: 'left' }}>{tip.text}</Typography>
                                                                        </div>
                                                                    </div>
                                                                </Box>
                                                            </SwiperSlide>)
                                                        }
                                                        <ArrowBackIosNewIcon ref={learningTipsPrevRef} className="navigation_button next" sx={{ top: '46%', backgroundColor: `${new_theme.palette.primary.PWhite} !important`, border: `1px solid ${new_theme.palette.primary.PBorderColor}` }} />
                                                        <ArrowForwardIosIcon ref={learningTipsNextRef} className="navigation_button prev" sx={{ top: '46%', backgroundColor: `${new_theme.palette.primary.PWhite} !important`, border: `1px solid ${new_theme.palette.primary.PBorderColor}` }} />
                                                    </Swiper>
                                                </div>
                                            </Grid>
                                        }

                                        {favs?.areas?.length > 0 &&
                                            <Grid item xs={12} sx={{ mb: 6, mt: favs?.tips?.length > 0 ? 4 : 0 }}>
                                                <Typography variant="h2" component="h2" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, mb: 2 }}>{t("mySpace-myResources:AREAS OF DEVELOPMENT")}</Typography>
                                                <div className="carousel_item">
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
                                                        slidesPerView={3}
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
                                                        {
                                                            favs?.areas?.map((opp) => <SwiperSlide onClick={() => {
                                                                setResourceId(opp._id)
                                                                setResource(opp)
                                                                setResourceType('areas')
                                                            }}>
                                                                <div className="carousel_item">
                                                                    <img src={`${baseURL}${opp.imageUrl}`} alt="" />
                                                                    <div className="item_content" style={{ minHeight: '200px' }}>
                                                                        <div className="item_cont">
                                                                            <Typography variant="h3" component="h3" sx={{ p: 0, textAlign: 'left', mb: 1, color: new_theme.palette.newSupplementary.NSupText }}>{t("mySpace-myResources:TYPE-"+opp.type.toUpperCase())}</Typography>
                                                                            <Typography variant="body2" className="carousel_para" component="p" sx={{ p: 0, mb: 2, }}>{opp.text}</Typography>
                                                                        </div>
                                                                        {/* <Link onClick={FnlearningTips} style={{ textAlign: 'left', display: 'block', color: new_theme.palette.primary.MedPurple, fontWeight: 'bold', fontSize: '17px' }}><ArrowForwardIosIcon sx={{ fontSize: '17px', color: new_theme.palette.newSupplementary.NSupText }} /> {t("mySpace-myResources:TYPE-"+solution.type.toUpperCase())}</Link> */}
                                                                    </div>
                                                                </div>
                                                            </SwiperSlide>)
                                                        }
                                                        <ArrowBackIosNewIcon ref={navigationPrevRef} className="navigation_button next" />
                                                        <ArrowForwardIosIcon ref={navigationNextRef} className="navigation_button prev" />
                                                    </Swiper>
                                                </div>
                                            </Grid>
                                        }

                                        {favs?.opportunities?.length > 0 &&
                                            <Grid item xs={12} sx={{ mb: 6, mt: favs?.areas?.length > 0 ? 4 : 0 }}>
                                                <Typography variant="h2" component="h2" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, mb: 2 }}>{t("mySpace-myResources:OPPORTUNITIES")}</Typography>
                                                {/* <div className="carousel_item"> */}
                                                {/* <Swiper
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
                                            slidesPerView={3}
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
                                            {
                                                favs?.opportunities?.map((solution) => <SwiperSlide onClick={() => {
                                                    setResourceId(solution._id)
                                                    setResource(solution)
                                                    setResourceType('opportunities')
                                                }}>
                                                    <div className="carousel_item">
                                                        <img src={`${solution.imageUrl}`} alt="" />
                                                        <div className="item_content" sc={{ minHeight: '200px' }}>
                                                            <div className="item_cont">
                                                                <Typography variant="h3" component="h3" sx={{ p: 0, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left', mb: 1 }}>{t("mySpace-myResources:HOW TO SOLVE")}</Typography>
                                                                <Typography variant="body2" className="carousel_para" component="p" sx={{ p: 0, mb: 2, }}>{solution.text}</Typography>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SwiperSlide>)
                                            }
                                            <ArrowBackIosNewIcon ref={navigationPrevRef} className="navigation_button next" />
                                            <ArrowForwardIosIcon ref={navigationNextRef} className="navigation_button prev" />
                                        </Swiper> */}
                                                <Grid container spacing={4}>
                                                    {
                                                        favs?.opportunities?.map((solution) =>
                                                            <Grid item xs={12} md={6} lg={4}>
                                                                <div className="carousel_item" onClick={() => {
                                                                    setResourceId(solution._id)
                                                                    setResource(solution)
                                                                    setResourceType('opportunities')
                                                                }}>
                                                                    <img src={`${baseURL}${solution.imageUrl}`} alt="" />
                                                                    <div className="item_content" sc={{ minHeight: '200px' }}>
                                                                        <div className="item_cont">
                                                                            <Typography variant="h3" component="h3" sx={{ p: 0, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'left', mb: 1 }}>{t("mySpace-myResources:HOW TO SOLVE")}</Typography>
                                                                            <Typography variant="body2" className="carousel_para three-line-only" component="p" sx={{ p: 0, mb: 2, }}>{solution.text}</Typography>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                        )
                                                    }
                                                </Grid>
                                                {/* </div> */}
                                            </Grid>
                                        }

                                        {
                                            favs?.collections?.length > 0 && <Grid item xs={12}>
                                                {favs?.collections?.length != 0 && <Typography variant="h2" component="h2" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, mb: 2 }}>{F_t("mySpace-myResources:COMPANY MATERIALS")}</Typography>}
                                                {
                                                    favs?.collections?.map((material) =>
                                                        <Grid item xs={12} md={6} lg={4} onClick={() => {
                                                            setResourceId(material._id)
                                                            setResource(material)
                                                            setResourceType('material')
                                                        }}>
                                                            <div className="carousel_item">
                                                                <img src={`${baseURL}${material.opportunity.imageUrl}`} alt="" />
                                                                <div className="item_content">
                                                                    <div className="item_cont">
                                                                        <Box sx={{ mb: 1, backgroundColor: new_theme.palette.primary.PLinkBlue, padding: '5px 5px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                                                            <Typography variant="subtitle1" component="p" sx={{ fontWeight: '500', p: 0, textAlign: 'left', mb: 0, display: 'inline-block', color: new_theme.palette.primary.PWhite }}>{F_t("mySpace-myResources:COMPANY MATERIALS")}</Typography>
                                                                        </Box>
                                                                        <Typography variant="subtitle1" component="p" sx={{ p: 0, textAlign: 'left', mb: 1 }}>{material.opportunity.type}</Typography>
                                                                        <Typography variant="body2" className="carousel_para three-line-only" component="p" sx={{ p: 0, m: 0 }}>{material.opportunity.text}</Typography>
                                                                        <Box sx={{ display: 'flex', gap: '5px 20px', flexWrap: 'wrap', my: 1 }}>
                                                                            {material?.opportunity?.area?.trait?.shortName && <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                                <span className="badge-dia badge-dia1" ></span><Typography variant="subtitle1" component='span'>{material?.opportunity?.area?.trait?.shortName}</Typography>
                                                                            </Box>}
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                                <span className="badge-dia badge-dia2" ></span><Typography variant="subtitle1" component='span'>{material.opportunity.type}</Typography>
                                                                            </Box>
                                                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                                <span className="badge-dia badge-dia3" ></span><Typography variant="subtitle1" component='span'>{F_t("mySpace-myResources:COMPANY MATERIAL")}</Typography>
                                                                            </Box>
                                                                        </Box>
                                                                    </div>
                                                                    {/* <Link style={{ textAlign: 'left', display: 'block', color: new_theme.palette.primary.MedPurple, fontWeight: 'bold', fontSize: '17px' }}><ArrowForwardIosIcon sx={{ fontSize: '17px', color: new_theme.palette.newSupplementary.NSupText }} /> {t("mySpace-myResources:TYPE-"+solution.type.toUpperCase())}</Link> */}
                                                                </div>
                                                            </div>
                                                        </Grid>)
                                                }
                                            </Grid>
                                        }

                                    </TabPanel>
                                </Box>
                            </Grid>
                        </>
                        :
                        <>
                            <ResourceDetails id={resourceId} resource={resource} resourceType={resourceType} setResourceId={setResourceId} setResourceType={setResourceType} setSolutions={setSolutions} setFavs={setFavs} setCompanyMaterial={setCompanyMaterial} />
                        </>
                    }
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default MyResources;