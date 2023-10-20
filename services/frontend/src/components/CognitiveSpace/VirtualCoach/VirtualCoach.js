import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Container, Divider } from "@mui/material";
import { ReactComponent as CommunicationStrategy } from '../../../img/cognitive_space/communication-strategy.svg';
import { ReactComponent as HandPicked } from '../../../img/cognitive_space/handpicked.svg';
import { ReactComponent as SelfConfidence } from '../../../img/cognitive_space/self-confidence.svg';
import { ReactComponent as Cooperation } from '../../../img/cognitive_space/co-operation.svg';
import { ReactComponent as Selfactivation } from '../../../img/cognitive_space/self-activation.svg';
import { ReactComponent as Regularity } from '../../../img/cognitive_space/regularity-icon.svg';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import { useMainContext } from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";

import { Grid } from "@mui/material";
import Typography from '@mui/material/Typography';
import StyledButton from "new_styled_components/Button/Button.styled";
import { new_theme } from "NewMuiTheme";
import { ThemeProvider, IconButton } from "@mui/material";
import "./VirtualCoach.scss";
import Question from "./Question";
import { useEffect } from "react";
import trainingService from '../../../services/trainingCenter.service'
import { AccountCircle, ArrowBack, ArrowBackIosNew, ArrowForwardIos, ArrowLeft, ArrowRight } from "@mui/icons-material";
import LinearProgress from '@mui/material/LinearProgress';
import { useNavigate } from "react-router-dom";
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";

const VirtualCoach = ({ setCurrentTab }) => {
    const navigate = useNavigate();
    async function switchTabHandler(i) {
        ;
    }
    const [step, setStep] = useState(1);
    const [user, setUser] = useState();
    const [area, setArea] = useState();
    const [type, setType] = useState("auto");
    const [opportunities, setOpportunities] = useState([]);
    const [currentOpp, setCurrentOpp] = useState();
    const [yesCounter, setYesCounter] = useState(0);
    const [cIndex, setCIndex] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    
    const {
        asyncLocalStorage, F_handleSetShowLoader, F_showToastMessage
    } = useMainContext();
    const { t } = useTranslation(['mySpace-virtualCoach', 'traits', 'common']);

    const getUser = async () => {
        let user = await asyncLocalStorage.getItem('user');
        return user;
    }

    const getData = async (user) => {

        trainingService.getQuestions(user, type, area).then((result) => {
            F_handleSetShowLoader(true)
            let modified = result.data.opportunities.map((item) => {
                return { ...item, "value": "" }
            })
            
            let res = [...opportunities, ...modified]
            setOpportunities(modified);
            setTotalCount(result.data.totalNumber)
            setCurrentOpp(result.data.opportunities[0])
            F_handleSetShowLoader(false)

        });

    }
    const start = () => {
        if (opportunities?.length == 0) {
            console.log("No Opportunities")
            // F_showToastMessage("No Opportunities", "failure");

        } else {
            setType('auto');
            setArea('');
            setStep(2)
        }


    }
    useEffect(() => {
        getUser().then((result) => {
            setUser(result)
            getData(result)
        });

    }, [step])
    const handleArrowDown = () => {
        let cindex = cIndex;
        cindex = cindex - 1;
        setCIndex(cindex)
    }
    const handleArrowUp = () => {
        let cindex = cIndex;
        cindex = cindex + 1;
        setCIndex(cindex)
    }

    const onClose = () => {
        setCIndex(0)
        setTotalCount(0)
        setOpportunities([])
        setYesCounter(0)
        setStep(1);
    }
    useEffect(() => {
        if (cIndex == opportunities.length) {
            getData(user)
        }
        console.log("index", cIndex, totalCount);
        if (totalCount != 0 && totalCount == cIndex) {
            setStep(3)
        }
    }, [cIndex])
    useEffect(() => {
        if (yesCounter == 3) {
            setStep(3)
        }
    }, [yesCounter])

    const checkSolutionHandler = () => {
        navigate('/myresources')
    }
    return (
        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv main_results">
                <Grid container>
                    <Grid item xs={12}>
                        <div className="admin_heading">
                            <Typography variant="h1" component="h1">{t("mySpace-virtualCoach:VIRTUAL COACH")}</Typography>
                            <Divider variant="insert" className='heading_divider' />
                        </div>
                    </Grid>

                    {
                        step == 1 &&
                        <>
                            <Grid item md={5} sx={{ mt: 2, pr: { xl: '48px !important', lg: '48px !important', md: '35px !important', sm: '25 !important' }, pt: '0 !important', borderRight: `1px solid ${new_theme.palette.primary.PBorder}` }}>
                                <Box sx={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '8px', padding: '40px 25px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div className="top_head" style={{ margin: '0 auto 40px auto' }}>
                                        <Typography variant="h3" component="h3" sx={{ p: 0, marginTop: '0', color: new_theme.palette.primary.MedPurple, mb: 1, textAlign: 'left' }}>{t("mySpace-virtualCoach:WELCOME TO MY COACH")}</Typography>
                                        <Divider className="heading_divider" />
                                    </div>
                                    <Typography className="p-mb-left" variant="body2" component="p" sx={{ mb: 4, lineHeight: '30px', fontWeight: '500', textAlign: 'center' }}>{t("mySpace-virtualCoach:VIRTUAL COACH DESCRIPTION")}</Typography>
                                </Box>
                            </Grid>
                            <Grid item md={7} sx={{ mt: 2, pl: { xl: '48px !important', lg: '48px !important', md: '35px !important', sm: '25 !important' }, pt: '0 !important' }}>
                                <div className="content">
                                    <Grid container spacing={4}>
                                        <Grid item xs={12}>
                                            <Typography className="p-mb-left" variant="subtitle3" component="p" sx={{ paddingLeft: '0', paddingTop: '0', textAlign: 'center', color: new_theme.palette.newSupplementary.NSupText, fontWeight: '500', mb: 2 }}>{t("mySpace-virtualCoach:VIRTUAL COACH USAGE DESCRIPTION")}</Typography>
                                        </Grid>
                                        <Grid item xs={6} sx={{ pt: '0 !important' }} onClick={start}>
                                            <div className={`manual_box auto ${opportunities?.length == 0 ? 'handpicked' : ''}`}>
                                                <div className="img">
                                                    <HandPicked style={{ marginBottom: '10px', width: '35px' }} />
                                                </div>
                                                <Typography variant="subtitle3" component="p">{t("mySpace-virtualCoach:AUTOMATIC")}</Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} sx={{ pt: '0 !important' }} onClick={() => {
                                            console.log('inclick')
                                            setStep(2);
                                            setType("manual");
                                            setArea(3);

                                        }}>
                                            <div className="manual_box">
                                                <div className="img">
                                                    <CommunicationStrategy style={{ marginBottom: '10px', width: '35px' }} />
                                                </div>
                                                <Typography variant="subtitle3" component="p">{t("traits:communication-strategy-short-name")}</Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} sx={{ pt: '0 !important' }} onClick={() => {
                                            setStep(2);
                                            setType("manual");
                                            setArea(2);
                                        }}>
                                            <div className="manual_box">
                                                <div className="img">
                                                    <SelfConfidence style={{ marginBottom: '10px', width: '35px' }} />
                                                </div>
                                                <Typography variant="subtitle3" component="p">{t("traits:self-confidence-short-name")}</Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} sx={{ pt: '0 !important' }} onClick={() => {
                                            setStep(2);
                                            setType("manual");
                                            setArea(4);
                                        }}>
                                            <div className="manual_box">
                                                <div className="img">
                                                    <Cooperation style={{ marginBottom: '10px', width: '35px' }} />
                                                </div>
                                                <Typography variant="subtitle3" component="p">{t("traits:cooperation-short-name")}</Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} sx={{ pt: '0 !important' }} onClick={() => {
                                            setStep(2);
                                            setType("manual");
                                            setArea(1);
                                        }}>
                                            <div className="manual_box">
                                                <div className="img">
                                                    <Selfactivation style={{ marginBottom: '10px' }} />
                                                </div>
                                                <Typography variant="subtitle3" component="p">{t("traits:self-activation-short-name")}</Typography>
                                            </div>
                                        </Grid>
                                        <Grid item xs={6} sx={{ pt: '0 !important' }} onClick={() => {
                                            setStep(2);
                                            setType("manual");
                                            setArea(5);
                                        }}>
                                            <div className="manual_box">
                                                <div className="img">
                                                    <Regularity style={{ marginBottom: '10px', height: '28px' }} />
                                                </div>
                                                <Typography variant="subtitle3" component="p">{t("traits:regularity-short-name")}</Typography>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                        </>
                    }


                    {
                        (step == 2 && opportunities[cIndex] != undefined) &&
                        <Grid item lg={12} spacing={2}>
                            <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
                                <Grid item xs={12} md={6}>
                                    <Box sx={{ padding: '20px', boxShadow: `0px 4px 4px ${new_theme.palette.shades.black25}`, border: `2px solid ${new_theme.palette.newSupplementary.SupCloudy}` }}>
                                        <div className="top_head">
                                            <Typography variant="h3" component="h3" sx={{ textAlign: 'left', color: new_theme.palette.primary.MedPurple }}>{t("mySpace-virtualCoach:VIRTUAL COACH")}</Typography>
                                            <Divider className="heading_divider" sx={{ height: '5px' }} />
                                        </div>
                                        <Question opprtunities={opportunities} setOpportunities={setOpportunities} opportunity={opportunities[cIndex]} totalCount={totalCount} yesCounter={yesCounter} setYesCounter={setYesCounter} cIndex={cIndex} setCIndex={setCIndex} />
                                        <LinearProgress variant="determinate" value={yesCounter * 33.33} sx={{ backgroundColor: new_theme.palette.secondary.DarkPurple, height: '5px', borderRadius: '10px' }} />
                                        <div className="arrowBtns" style={{ textAlign: 'center', marginTop: '20px' }}>
                                            <StyledEIconButton color="primary" size="large" disabled={cIndex == 0} className="progress_bar_arrow arrowRight" onClick={handleArrowDown} >
                                                <ChevronLeftIcon />
                                            </StyledEIconButton>
                                            <StyledEIconButton color="primary" size="large" disabled={cIndex == opportunities.length - 1} className="progress_bar_arrow arrowLeft" onClick={handleArrowUp} >
                                                <ChevronRightIcon />
                                            </StyledEIconButton>
                                        </div>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                    {
                        step == 3 &&
                        <Grid item xs={12}>
                            <Grid container sx={{ justifyContent: 'center' }}>
                                <Grid item xs={12} md={7} lg={5}>
                                    <Box sx={{ borderRadius: '8px', padding: '20px', minHeight: '650px', display: 'flex', justifyContent: 'center', alignItems:'center', boxShadow: `0px 4px 4px ${new_theme.palette.shades.black25}`, border: `2px solid ${new_theme.palette.newSupplementary.SupCloudy}` }}>
                                        {/* <div className="top_head" style={{ marginBottom: '50px' }}>
                                            <Typography variant="h3" component="h3" sx={{ textAlign: 'left', color: new_theme.palette.primary.MedPurple }}>{t("mySpace-virtualCoach:VIRTUAL COACH")}</Typography>
                                            <Divider className="heading_divider" sx={{ height: '5px' }} />
                                        </div> */}
                                        <div className="thankyou" style={{ textAlign: 'center', marginBottom: '30px' }}>
                                            <Typography variant="h3" component="h3" sx={{ mb: 3, fontWeight: '500', color: new_theme.palette.newSupplementary.NSupText }}>{t("mySpace-virtualCoach:THANK YOU TEXT")}</Typography>
                                            {/* <img src="/img/brand/webtest2.png" style={{ height: '200px' }} /> */}
                                            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '25px', alignItems: 'center' }}>
                                                <StyledButton eVariant="primary" eSize="medium" sx={{ mb: 2, minWidth: '210px' }} onClick={checkSolutionHandler}>{t("mySpace-virtualCoach:CHECK SOLUTIONS")}</StyledButton>
                                                <StyledButton eVariant="secondary" eSize="medium" sx={{ minWidth: '210px' }} onClick={onClose}>{t("mySpace-virtualCoach:CLOSE")}</StyledButton>
                                            </div>
                                        </div>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

export default VirtualCoach;