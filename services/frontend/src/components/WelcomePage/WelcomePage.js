import React, { useEffect, useState } from "react";
// import withWidth, { isWidthUp } from "@material-ui/core/withWidth";
import withWidth from "@mui/material/Hidden/withWidth";
import { isWidthUp } from "@mui/material/Hidden/withWidth";
import { Typography } from '@mui/material';
import { useNavigate } from "react-router-dom";
// import Grid from "@material-ui/core/Grid";
// import Grid from "@mui/material";
import Grid from '@mui/material/Grid';
// import Box from "@material-ui/core/Box";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
// import { Hidden } from "@material-ui/core";
import { Container } from '@mui/material';
import HeaderStyle from "new_styled_components/welcomePage/welcome.styled";
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";
import './welcomePage.scss';
import { new_theme } from 'NewMuiTheme';
import { ThemeProvider } from '@mui/material';
import StyledButton from 'new_styled_components/Button/Button.styled';

// Services
import commonService from 'services/common.service'

const WelcomePage = ({ width, handleCenterType, User }) => {
    const { t, i18n } = useTranslation(['common', 'login-welcome-registration']);
    const { F_getHelper, F_t, F_showToastMessage } = useMainContext();

    const { isEdu, setIsEdu } = F_getHelper()

    const navigate = useNavigate();
    function getNumberOfCols() {
        if (isWidthUp("md", width)) return 3;
        return 1;
    }


    function handleSelectLoginPage(value) {
        if (value == '/credits/all') navigate(value);
        else handleCenterType(value)
    }

    useEffect(() => {// Set proper language
        if (User.language) i18n.changeLanguage(User.language)
    }, []);


    let itemData = [
        {
            img: "/img/welcome_screen/school_center.png",
            title: 'School Center',
            secondTitle: 'Login to school system',
            target: 'school',
            listItem: 'ListItem_1',
            show: User?.isInSchoolCenter
        },
        {
            img: "/img/welcome_screen/training-center.png",
            title: t("common:SALES MANAGEMENT"),
            secondTitle: 'Admin panel',
            target: '/credits/all',
            listItem: 'ListItem_5',
            gap: '50px',
            show: (commonService.isMarketingModule(User) && commonService.isMarketingManager(User)),
        },
        {
            img: '/img/welcome_screen/cognitive-center.png',
            title: t("common:SENTINEL"),
            secondTitle: 'Login to Sentinel',
            target: 'cognitive',
            listItem: 'ListItem_3',
            show: (User?.isInCognitiveCenter && !commonService.isEdu(User)) || commonService.isDevelopment() || commonService.isMarketingModule(User),
            onClick: () => {
                setIsEdu(false)
            }
        },
        {
            img: '/img/welcome_screen/cognitive-center.png',
            title: t("common:EDU_SENTINEL"),
            secondTitle: 'Login to BrainCore EDU system',
            target: 'cognitive',
            listItem: 'ListItem_4',
            show: (User?.isInCognitiveCenter && commonService.isEdu(User)) || commonService.isDevelopment() || commonService.isMarketingModule(User),
            onClick: () => {
                setIsEdu(true)
            }
        },
        {
            img: "/img/welcome_screen/training-center.png",
            title: t("common:MY SPACE"),
            secondTitle: 'Login to MySpace',
            target: 'training',
            listItem: 'ListItem_2',
            show: User?.isInTrainingCenter && (!commonService.isMarketingModule(User))
        }
    ]





    return (
        <ThemeProvider theme={new_theme}>
            <div className="welcome_top_header">
                <div className='top_border'>
                    <div className="t_border" style={HeaderStyle.containerFluid}></div>
                </div>
                <div className='header_section' style={HeaderStyle.headerSection}>
                    <div className='logo'>
                        <img src='/img/brand/BrainCore_Solutions.png' style={HeaderStyle.logoImg} />
                    </div>
                    {/* <Typography variant="h2" component="h2" className='CenterName' style={HeaderStyle.CenterName}>
                                        {t("common:WELCOME TO ACADEMY")}
                                    </Typography>
                                    <div className='right_icon' style={{opacity: '0'}}>
                                        <img src='/img/brand/webtest2.png' style={HeaderStyle.rightIconImg} />
                                    </div> */}
                </div>
                {/* <div className="CenterName_mobile">
                                    <Typography variant="h2" component="h2">{t("common:WELCOME TO ACADEMY")}</Typography>
                                </div> */}
            </div>
            <Container className="welcome_main" component="main" maxWidth='xl' disableGutters={true}>
                <Container maxWidth="xl" className="mainContainerDiv Welcome_Content" sx={{ zIndex: '1', height: '100%'}}>
                    <Grid container spacing={2} sx={{ height: '100%' }}>
                        <Grid item xs={12}>
                            {/* <Box className="mainContainerDiv max_height" footer-text={t('common:POWERED BY BRAINELEM') + " ® " + new Date().getFullYear()}> */}
                                <Box className="content_container tab-align-center">
                                    <Box className="tab-js-center" sx={{ display: "grid" }}>
                                        <Typography variant="h1" component="h1" sx={{ textOverflow: 'ellipsis', overflow: 'hidden', color: new_theme.palette.primary.MedPurple, mb: 1 }}>
                                            {t("login-welcome-registration:WELCOME TO BRAINCORE")}
                                        </Typography>
                                        <Typography sx={{ textOverflow: 'ellipsis', overflow: 'hidden' }} variant="body2" component="p">{t("login-welcome-registration:PLEASE SELECT THE MODULE TO ACCESS")}</Typography>
                                    </Box>
                                    <Box className='cardsContainer'>
                                        {itemData.map((item, i) => (
                                            (item.show && <>
                                                <Box className="welcome_item" sx={{ gap: `${item.gap} !important` }} onClick={() => {
                                                    if (!item.disabled) {
                                                        handleSelectLoginPage(item.target)
                                                        if (item.onClick) item.onClick()
                                                    }
                                                }}>
                                                    <Typography variant="h2" component="h2" className="welcome_item_text"
                                                    >{t(item.title)}
                                                    </Typography>
                                                    <StyledButton className="click_her" eVariant="secondary" eSize="medium" aria-label={`Log in ${item.title}`}
                                                        disabled={item.disabled}> {t("login-welcome-registration:CLICK HERE")}
                                                    </StyledButton>
                                                </Box>
                                            </>)
                                        ))}
                                    </Box>
                                </Box>
                            {/* </Box> */}
                        </Grid>
                        {/* <Grid item xs={12}>
                            <div style={HeaderStyle.loginContainer}>
                                <div className='container-fluid'>
                                    <div className='cardsContainer'>
                                        {itemData.map((item, i) => (
                                            (item.show && <>
                                                <Grid key={i + 11} md={3} xs={12}>
                                                    <div style={HeaderStyle.WelcomeItem} className={"welcome_" + item.title} onClick={() => {
                                                        if (!item.disabled) {
                                                            handleSelectLoginPage(item.target)
                                                        }
                                                    }}>
                                                        <img
                                                            src={`${item.img}?h=250&fit=crop&auto=format`}
                                                            srcSet={`${item.img}?h=250&fit=crop&auto=format&dpr=2 2x`}
                                                            alt={item.title}
                                                            loading="lazy" className='img-fluid' style={HeaderStyle.WelcomeItemImage}
                                                        />
                                                        <Typography variant="h2" component="h2" sx={{ my: "18px" }} style={{ textAlign: 'center', color: new_theme.palette.primary.PWhite }}>{t(item.title)}</Typography>
                                                        <StyledButton className='click_here' aria-label={`Log in ${item.title}`}
                                                            onClick={() => handleSelectLoginPage(item.target)}
                                                            disabled={item.disabled}> {t("login-welcome-registration:CLICK HERE")}
                                                        </StyledButton>
                                                    </div>
                                                </Grid>
                                            </>)

                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Grid> */}
                        {/* <Grid item xs={12} sx={{padding: '0 !important'}}>
                            <div className="bottomBorder">
                                <Typography variant="body1" component="p" sx={{ position: "absolute", bottom: "9px", left: "50%", transform: "translateX(-50%)", textAlign: "center", marginBottom: "0", fontWeight: "400", fontSize: "14px" }}>
                                    {t("common:POWERED BY BRAINELEM")} &reg; {new Date(now()).getFullYear()}
                                </Typography>
                            </div>
                        </Grid> */}
                    </Grid>
                </Container>
            </Container>
            <Box sx={{ borderTop: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '48px' }}>
                <Typography variant="body4" component="span">{t('common:POWERED_BY')}  <span style={{ color: new_theme.palette.primary.MedPurple }}>{t('common:FOOTER_BRAINELEM')}</span> ® {new Date().getFullYear()}</Typography>
            </Box>
        </ThemeProvider>


    );
}
export default withWidth()(WelcomePage);