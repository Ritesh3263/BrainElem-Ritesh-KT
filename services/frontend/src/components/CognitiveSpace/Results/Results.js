import React, { useState, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Container from '@mui/material/Container';
// Components
import { ESelect } from "new_styled_components";
import MenuItem from '@mui/material/MenuItem';
import TestSelection from "components/common/BrainCoreTestSelectionModal"

import VirtualCoach from "../VirtualCoach/VirtualCoach";
import MyResources from "../MyResources/MyResources";
import HistoryLearn from "../../../img/cognitive_space/history_lern.svg";
import { ReactComponent as AddLabel } from "../../../img/add_label.svg";
import Divider from "@mui/material/Divider";
import { ETabBar, ETab } from "new_styled_components";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StyledButton from "new_styled_components/Button/Button.styled";
import History from "../History/History";
import EVerticalProperty from "styled_components/VerticalProperty";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Grid } from "@mui/material";
import { ECard } from "styled_components";
import { styled } from "@mui/material/styles";
import Performance from "../MyProgress/Performance";

import { BarChart, Bar, XAxis, YAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import TurnedInNotIcon from '@mui/icons-material/TurnedInNot';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import { new_theme } from "NewMuiTheme";
import { ThemeProvider } from "@mui/material";
import "./Results.scss";

//Icons
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Services
import AuthService from "services/auth.service";
import AlgoritmsService from "services/algorithms.service";
import ContentService from "services/content.service";
import UserService from "services/user.service";
import CognitiveSpace from "../../../services/cognative-space.service"

// Context 
import { useMainContext } from "components/_ContextProviders/MainDataContextProvider/MainDataProvider";

import ListItemAvatar from '@mui/material/ListItemAvatar';
import { Button } from "react-bootstrap";
import StyledEIconButton from "new_styled_components/IconButton.js/IconButton.styled";

const Report = lazy(() => import("./Result/Report"));


//////////////////////////New Tab panel///////////////////////////////////
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Grid container>
            {children}
          </Grid>
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
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
/////////////////////////New Tab panel/////////////////////////////////    

function DialogBox(props) {
    const { t } = useTranslation(['mySpace-myResults']);
    const { onClose, open, type } = props;
    const [faq, setFaq] = useState([])
    const handleClose = () => {
        onClose();
    };
    useEffect(() => {
        if (type === 'FAQ') {
            UserService.getFaq('student').then((res) => {
                setFaq(res.data)
            })
        }
    }, [type])
    const [expanded, setExpanded] = React.useState('panel0');

    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
    const Accordion = styled((props) => (
        <MuiAccordion disableGutters elevation={0} square {...props} />
    ))(({ theme }) => ({
        borderRadius: '10px',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
    }));
    const AccordionSummary = styled((props) => (
        <MuiAccordionSummary
            expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', transform: 'rotate(90deg)' }} />}
            {...props}
        />
    ))(({ theme }) => ({
        '& .MuiAccordionSummary-content.Mui-expanded h4': {
            color: new_theme.palette.primary.MedPurple
        },
        '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
            transform: 'rotate(180deg) !important',
        },
        '& .MuiAccordionSummary-content': {
            marginLeft: theme.spacing(1),
        },
    }));

    const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
        padding: theme.spacing(2),
    }));

    // const handleListItemClick = (value) => {
    //     onClose(value);
    // };

    const [value, setValue] = React.useState(2);

    const handleChange1 = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <ThemeProvider theme={new_theme}>
            {type === "FAQ" ?

                <Dialog onClose={handleClose} open={open} PaperProps={{
                    sx: {
                        minWidth: { xs: '90%', sm: '500px', md: '700px', lg: '850px', xl: '900px' },
                        minHeight: { xs: '80%', sm: '80%', md: '90%', lg: '90%', xl: '650px' },
                        maxHeight: { xs: '80%', sm: '80%', md: '90%', lg: '90%', xl: '650px' },
                        padding: '0',
                        borderRadius: '12px',
                        height: '100%',
                        padding: '26px',
                        overflow: 'hidden'
                    }
                }}>
                    <div style={{ marginBottom: '20px' }}>
                        <Typography variant="h3" component="h3" sx={{ paddingBottom: '2px', textAlign: 'left', color: new_theme.palette.primary.MedPurple }}>{t("mySpace-myResults:FAQ")}</Typography>
                        <Divider className="heading_divider" sx={{ width: '30px' }} />
                    </div>

                    <div className="accordion_container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'column', overflow: 'auto' }}>
                        <div className="accordion_panel" style={{ overflow: 'auto', paddingRight: '12px' }}>
                            {faq.length > 0 && faq.map((item, id) => {
                                return <Accordion expanded={expanded === `panel${id}`} onChange={handleChange(`panel${id}`)} sx={{ marginBottom: '12px', backgroundColor: new_theme.palette.newSupplementary.SupCloudy, overflow: 'auto' }}>
                                    <AccordionSummary id={`panel${id}d-header`}>
                                        <Typography variant="body2" component="h4" sx={{ fontWeight: 'bold' }}>{item.question}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography variant="body2" component="p" sx={{ fontWeight: '500', pl: '15px', pr: '25px', textAlign: 'justify' }}>
                                            {item.answer}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            })}
                        </div>
                        <StyledButton sx={{ mt: 2, position: 'sticky', bottom: '0' }} onClick={handleClose}>{t("mySpace-myResults:CLOSE")}</StyledButton>
                    </div>
                </Dialog>

                :
                type === "LearningTipsYes" ?

                    <Dialog onClose={handleClose} open={open} PaperProps={{
                        sx: {
                            minWidth: { xs: '90%', sm: '400px', md: '450px' },
                            padding: '16px',
                            borderRadius: '12px'
                        }
                    }}>
                        {/* <div className='header'>
                            <Typography variant="h3" component="h3" sx={{ textAlign: 'left', fontSize: '24px', fontWeight: 'bold', color: new_theme.palette.primary.MedPurple }}>{t("mySpace-myResults:LEARNING TIP")}</Typography>
                            <Divider variant="insert" className='heading_divider' sx={{
                                height:
                                    '2px', width: '26px'
                            }} />
                        </div> */}
                        <div className='feed_back' style={{ textAlign: 'center' }}>
                            <Typography variant="h3" component="h3" sx={{ mb: 1, color: new_theme.palette.newSupplementary.NSupText, fontWeight: '500', textAlign: 'center', paddingBottom: '0' }}>{t("mySpace-myResults:GREAT")+"!"}</Typography>
                            <Typography variant="h3" component="p" sx={{ color: new_theme.palette.newSupplementary.NSupText, fontWeight: '500', textAlign: 'center' }}>{t("mySpace-myResults:THANK YOU FOR THE FEEDBACK")}</Typography>
                        </div>
                    </Dialog>
                    :

                    <Dialog onClose={handleClose} open={open} PaperProps={{
                        sx: {
                            minWidth: { xs: '90%', sm: '400px', md: '450px' },
                            padding: '16px',
                            borderRadius: '12px'
                        }
                    }}>
                        {/* <div className='header'>
                            <Typography variant="h3" component="h3" sx={{ textAlign: 'left', fontSize: '24px', fontWeight: 'bold', color: new_theme.palette.primary.MedPurple }}>{t("mySpace-myResults:LEARNING TIP")}</Typography>
                            <Divider variant="insert" className='heading_divider' sx={{
                                height:
                                    '2px', width: '26px'
                            }} />
                        </div> */}
                        <div className='feed_back' style={{ textAlign: 'center' }}>
                            <Typography variant="h3" component="h3" sx={{ mb: 1, color: new_theme.palette.newSupplementary.NSupText, textAlign: 'center', fontWeight: '500', paddingBottom: '0' }}>{t("mySpace-myResults:SORRY TO HEAR THAT")}</Typography>
                            <Typography variant="h3" component="p" sx={{ mb: 1, color: new_theme.palette.newSupplementary.NSupText, fontWeight: '500', textAlign: 'center' }}>{t("mySpace-myResults:OUR TEAM IS WORKING TEXT")}</Typography>
                            <Typography variant="h3" component="p" sx={{ mb: 1, color: new_theme.palette.newSupplementary.NSupText, fontWeight: '500', textAlign: 'center' }}>{t("mySpace-myResults:THANK YOU FOR THE FEEDBACK")}</Typography>
                        </div>
                    </Dialog>
            }
        </ThemeProvider>
    );
}


export default function Results({ results, setResults, loadResults, isHistory, setHistory,tabIndex}) {
    const { t } = useTranslation(['mySpace-myResults', 'common']);
    const navigate = useNavigate();
    // Selected result for BrainCore Test
    const [activeResults, setActiveResults] = useState(undefined)
    // Selceted value
    const [userTraits, setUserTraits] = useState()
    const [activeTraitName, setActiveTraitName] = useState('current-performance-indicator')
    // Tips
    const [userTip, setUserTip] = useState()
    // Type of reader: student/teacher/parent/employee/leader/team-leader
    const [readerType, setReaderType] = useState()

    const { F_showToastMessage, F_handleSetShowLoader, F_getLocalTime, F_getErrorMessage, activeNavigationTab } = useMainContext();
    //Modal with report
    const [openReport, setOpenReport] = useState(false)

    const [FAQStatus, setFAQStatus] = useState([])

    const [currentTab, setCurrentTab] = useState(tabIndex);


    const reloadResultTimer = React.useRef()

    function getColor(level) {
        switch (level) {
            case 1:
                return { color: new_theme.palette.secondary.Turquoise };
            case 2:
                return { color: new_theme.palette.secondary.Turquoise };
            case 3:
                return { color: new_theme.palette.secondary.Turquoise };
            case 4:
                return { color: new_theme.palette.secondary.Turquoise };
            default:
                return { color: new_theme.palette.secondary.Turquoise };
        }
    }
    function getLevel(level) {
        switch (level) {
            case 1:
                return "Very Low";
            case 2:
                return "Low";
            case 3:
                return "Medium";
            case 4:
                return "High";
            default:
                return "Very High";
        }
    }
    // When component is loaded
    useEffect(() => {
        // By default set latest result(first in the array)
        if (currentTab == 0 || currentTab == 2) {
            if (results?.length) {
                setActiveResults(results[0])

                // Load active tip #####################
                UserService.getTip(results[0].user?._id, readerType).then(res => {
                    setUserTip(res.data);
                }).catch(err => {
                    console.log(err);
                    F_showToastMessage(F_getErrorMessage(err), 'error');
                });
                //######################################
            }
        }

    }, [currentTab, results]);


    useEffect(() => {
        F_handleSetShowLoader(true)
        if (activeResults && areResultsProcessed(activeResults)) {
            // Load traits #####################
            UserService.getTraits(results[0].user?._id, activeResults._id, readerType).then(res => {
                setUserTraits(res.data);
            }).catch(err => {
                console.log(err);
                F_showToastMessage(F_getErrorMessage(err), 'error');
            });
            //######################################


        } else {
            setUserTraits()
        }


        setTimeout(() => {
            F_handleSetShowLoader(false)
        }, 1000)
    }, [activeResults]);


    // for Tab Bars
    async function switchTabHandler(i) {
        setCurrentTab(i);
    }

    // useEffect(() => {
    //     switch (currentTab) {
    //         case 0:
    //             break;
    //         case 1:
    //             navigate("/myspace/virtual-coach");
    //             break;
    //         case 2:
    //             navigate("/new-modules-core/authorizations");
    //             break;
    //         default:
    //             break;
    //     }
    // }, [currentTab]);


    // Check if resuls were fully processed  
    const areResultsProcessed = (results) => {
        let areProcessed = (results && results.traits)
        // Retry loading results
        clearTimeout(reloadResultTimer.current)
        if (!areProcessed) reloadResultTimer.current = setTimeout(loadResults, 5000)
        return areProcessed
    }

    function generateObjectArray(arr) {
        return arr.map(item => {
            //const label = item['long-name'].split(`${item['short-name']} `)[1]; // split longName by space and take first part as label
            const label = item['abbreviation'];
            const data = [item.minValue < 1 ? 1 : item.minValue, item.maxValue > 10 ? 10 : item.maxValue]; // create data array with minValue and maxValue
            return { label, data };
        });
    }

    // Return array with values for itereation
    function range(size, startAt = 0) {
        return [...Array(size).keys()].map(i => i + startAt);
    }

    // const [value, setValue] = React.useState('No');
    // const [active, setActive] = React.useState();
    // const handleChange = (event) => {
    //     setValue(event.target.value);
    //     setActive(event.target.value);
    // };

    const [openLearningTipsYes, setOpenLearningTipsYes] = React.useState(false);
    const [openLearningTipsNo, setOpenLearningTipsNo] = React.useState(false);
    const [openFaq, setOpenFaq] = React.useState(false);

    // const [selectedValue, setSelectedValue] = React.useState(emails[1]);

    const handleClickOpen = (value) => {
        if (value === "LearningTipsNo") {
            setOpenLearningTipsNo(true);
            setTimeout(() => {
                setOpenLearningTipsNo(false);
            }, 3000);

        }
        else if (value === "LearningTipsYes") {
            setOpenLearningTipsYes(true);
            setTimeout(() => {
                setOpenLearningTipsYes(false);
            }, 3000);
        }
        else {
            setOpenFaq(true);
        }
    };

    const handleClose = (value) => {
        if (value === "LearningTipsNo") {
            setOpenLearningTipsNo(false);
        }
        else if (value === "LearningTipsYes") {
            setOpenLearningTipsYes(false);
        }
        else {
            setOpenFaq(false);
        }
    };


    const [openChoice, setOpenChoice] = useState(false);
    const handleTakeTest = () => {
        let type = 'pedagogy';
        const user = ContentService.getItemFromLocalStorage('user');
        console.log("Hi------", user?.age);

        if (user?.age == null || (user?.age >= 18 && user?.age <= 24)) {
            setOpenChoice(!openChoice);
            return;
        } else if (user?.age != null && user?.age > 24) {
            type = "adult";
        }

        navigate(`/content/display/${ContentService.getBraincoreTestId(type)}`)
    }
    const storeFeedback = (type, data) => {
        F_handleSetShowLoader(true);
        CognitiveSpace.storeFeedBack(type, data).then((resp) => {
            F_showToastMessage(t("mySpace-myResults:FEEDBACK ADDED"), "success");
            if (results?.length) {
                setActiveResults(results[0])

                // Load active tip #####################
                UserService.getTip(results[0].user?._id, readerType).then(res => {
                    setUserTip(res.data);
                }).catch(err => {
                    console.log(err);
                    F_showToastMessage(F_getErrorMessage(err), 'error');
                });
                //######################################
            }
        });

        F_handleSetShowLoader(false)
    }



    // Calculate the position of the line for normalized value
    // returns decimal number in range <0,1>
    const getPositionOfNormalizedValue = (trait) => {
        let trait_data = userTraits[trait]
        let maxv = trait_data.maxValue
        let minv = trait_data.minValue

        // Limit min and max values
        if (maxv > 10) maxv = 10
        if (minv < 1) minv = 1

        let value = trait_data.normalizedValue - minv
        let range = maxv - minv

        // Calculate position in range 0,1
        let position = 1 - (value / range);

        // If the value equal to 0% or 100%
        // increase/decrease 2% so the line is visible
        if (position == 1) position = 0.98
        if (position == 0) position = 0.02

        return position
    }

    // Calculate color for border
    const getColorForBorder = (trait, position = 'top') => {
        let value = userTraits[trait].normalizedValue
        // By default the color on the border is white
        // So the percenteage of the color is 0%
        let percentage = 0

        if (position == 'bottom' && value < (1 + 1.5)) {        //eg. 1.5 | 2
            value = value - 1                            //eg. 0.5 | 1
            percentage = (1 - (value / 1.5))               //eg. 66% | 33%
        } else if (position == 'top' && value > (10 - 1.5)) {    //eg. 9.5 | 9
            value = 10 - value                             //eg. 0.5 | 1
            percentage = (1 - (value / 1.5))               //eg. 66% | 33%
        }


        let color = getColor(userTraits[trait].level).color
        let colorRGB = hexToRgb(color)
        let finalColor = colorMixer([colorRGB.r, colorRGB.g, colorRGB.b], [255, 255, 255], percentage)

        return finalColor
    }


    //colorChannelA and colorChannelB are ints ranging from 0 to 255
    function colorChannelMixer(colorChannelA, colorChannelB, amountToMix) {
        var channelA = colorChannelA * amountToMix;
        var channelB = colorChannelB * (1 - amountToMix);
        return parseInt(channelA + channelB);
    }
    
    function colorMixer(rgbA, rgbB, amountToMix) {
        var r = colorChannelMixer(rgbA[0], rgbB[0], amountToMix);
        var g = colorChannelMixer(rgbA[1], rgbB[1], amountToMix);
        var b = colorChannelMixer(rgbA[2], rgbB[2], amountToMix);
        return "rgb(" + r + "," + g + "," + b + ")";
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }


    const [value, setValue] = React.useState(tabIndex);

    const handleChange1 = (event, newValue) => {
        setValue(newValue);
    };


    return (

        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv main_results">
                <Grid container >
                    {/* STILL PROCESSING RESULTS  */}
                    {!areResultsProcessed(activeResults) && <>
                        <Grid item xs={12} sx={{ p: { xs: 2, md: 0 }, alignContent: "flex-start", justifyContent: { xs: "center", md: "start" } }} >
                            <ECard style={{ background: new_theme.palette.glass.opaque, display: "block" }} >
                                <Typography sx={new_theme.typography.sh3} style={{ padding: '16px', fontSize: "12px", textTransform: 'uppercase', color: new_theme.palette.primary.lightViolet, fontWeight: "bold" }} >
                                    {t("mySpace-myResults:PROCESSING RESULTS TRY AGAIN")}
                                </Typography>
                                {results.length > 1 && activeResults &&
                                    <Grid item xs={12} sx={{ p: 2 }}>
                                        <ESelect sx={{ width: "150px", display: 'inline', margin: "auto" }}
                                            type="round"
                                            value={activeResults?._id}
                                            onChange={(e) => setActiveResults(results.find((r) => r._id === e.target.value))}
                                        >
                                            {results?.map(function (result, i) {
                                                return <MenuItem value={result._id} key={result._id}>{F_getLocalTime(result.createdAt, true)}</MenuItem>
                                            })}
                                        </ESelect>
                                    </Grid>
                                }
                            </ECard>
                        </Grid>
                    </>
                    }

                    {isHistory ?
                        <>
                            <History setHistory={setHistory} isHistory={isHistory} results={results?.filter(r=>areResultsProcessed(r))} setResults={setResults} />
                        </>
                        :
                        <>
                            {areResultsProcessed(activeResults) && userTraits &&
                                <>
                                    {openReport && <Report activeResults={activeResults} userTraits={userTraits} open={openReport} setOpen={setOpenReport}></Report>}
                                    <Grid item xs={12}>
                                        <div className="admin_heading" style={{marginBottom:'24px'}}>
                                            <Typography variant="h1" component="h1">{t("mySpace-myResults:MY RESULTS")}</Typography>
                                            <Divider variant="insert" className='heading_divider' />
                                        </div>
                                        {/* <div className="content_tabing">
                                            <ETabBar
                                                style={{ minWidth: "280px" }}
                                                value={value}
                                                textColor="primary"
                                                variant="fullWidth"
                                                onChange={handleChange1}
                                                aria-label="tabs example"
                                                className="tab_style"
                                            >
                                                <ETab label={t("mySpace-myResults:MY RESULTS")} eSize='small' {...a11yProps(0)} />
                                                <ETab label={t("mySpace-myResults:VIRTUAL COACH")} eSize='small' {...a11yProps(1)} />
                                                <ETab label={t("mySpace-myResults:MY RESOURCES")} eSize='small' {...a11yProps(2)} />
                                                <ETab label={t("mySpace-myResults:MY PROGRESS")} eSize='small' {...a11yProps(3)} />
                                            </ETabBar>
                                        </div> */}
                                    </Grid>
                                    {/* {
                                        currentTab == 0 && */}
                                        <TabPanel hidden={value!=0} className="etab_bar" value={value} index={0}>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} md={8} lg={8} sx={{ pt: 1, alignContent: "flex-start", height: 'fit-content' }} >
                                                    <ECard className="card-bg" style={{ display: "block" }}>
                                                        {/* <Grid item xs={12}> */}
                                                        {/* SELECT FOR RESULTS */}
                                                        <Grid container>
                                                            <Grid className="card1_sec1" item xs={12} sx={{ p: "24px", display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                                                {activeResults && <>
                                                                    <div className="result-select" style={{ display: 'flex', alignItems: 'center' }}>
                                                                        <Typography variant="body2" sx={{ pr: 2, whiteSpace: 'nowrap' }}>
                                                                            {t("mySpace-myResults:RESULTS FROM")}
                                                                        </Typography>
                                                                        <ESelect sx={{ width: "150px" }}
                                                                            type="round"
                                                                            className="date_dropdown"
                                                                            value={activeResults?._id}
                                                                            onChange={(e) => setActiveResults(results.find((r) => r._id === e.target.value))}
                                                                        >
                                                                            {results?.map(function (result, i) {
                                                                                return <MenuItem value={result._id} key={result._id}>{F_getLocalTime(result.createdAt, true)}</MenuItem>
                                                                            })}
                                                                        </ESelect>
                                                                    </div>
                                                                    {/* <Box className="color_info" sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px 14px', }}>
                                                                        <Box sx={{ color: new_theme.palette.primary.PRed, fontSize: '12px', display: 'flex', alignItems: 'center' }}><CircleIcon sx={{ fontSize: 'small' }}></CircleIcon>&nbsp;{t("mySpace-myResults:VERY LOW")}</Box>
                                                                        <Box sx={{ color: new_theme.palette.secondary.Turquoise, fontSize: '12px', display: 'flex', alignItems: 'center' }}><CircleIcon sx={{ fontSize: 'small' }}></CircleIcon>&nbsp;{t("mySpace-myResults:LOW")}</Box>
                                                                        <Box sx={{ color: new_theme.palette.newSupplementary.NSupText, fontSize: '12px', display: 'flex', alignItems: 'center' }}><CircleIcon sx={{ fontSize: 'small' }}></CircleIcon>&nbsp;{t("mySpace-myResults:AVERAGE")}</Box>
                                                                        <Box sx={{ color: new_theme.palette.primary.PPurple, fontSize: '12px', display: 'flex', alignItems: 'center' }}><CircleIcon sx={{ fontSize: 'small' }}></CircleIcon>&nbsp;{t("mySpace-myResults:HIGH")}</Box>
                                                                        <Box sx={{ color: new_theme.palette.primary.MedPurple, fontSize: '12px', display: 'flex', alignItems: 'center' }}><CircleIcon sx={{ fontSize: 'small' }}></CircleIcon>&nbsp;{t("mySpace-myResults:VERY HIGH")}</Box>
                                                                    </Box> */}
                                                                </>

                                                                }
                                                            </Grid>
                                                        </Grid>
                                                        {/* CHART */}
                                                        {activeResults && activeTraitName &&
                                                            <Grid container>
                                                                <Grid sx={{ p: 3, pt: 0, display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: 'center', minHeight: '300px', position: 'relative' }} item xs={12} lg={7}>
                                                                    {/* <FlowerChart activeTraitName={activeTraitName} activeResults={activeResults}></FlowerChart> */}
                                                                    <div className="qnad_values" style={{ marginBottom: '16px', display: 'flex', justifyContent: 'center' }}>
                                                                        <Box className="qnad-badge" sx={{ height: '96px', width: '96px', border: `2px solid ${new_theme.palette.secondary.Turquoise}`, backgroundColor: new_theme.palette.newSupplementary.SupCloudy, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                                                                            <Typography variant="h3" component="h3" sx={{ color: new_theme.palette.newSupplementary.NSupText }}>{`${userTraits['current-performance-indicator'].normalizedValue}%`}</Typography>
                                                                            <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500' }}>{userTraits['current-performance-indicator']['abbreviation']}</Typography>
                                                                        </Box>
                                                                    </div>

                                                                    {userTraits && <BarChart className="bar-chart-mb" width={450} height={350} margin={{ top: 10 }} legendType={'none'} data={generateObjectArray([...['self-activation', 'self-confidence', 'communication-strategy', 'cooperation', 'regularity'].map(trait => userTraits[trait])])} >
                                                                        <CartesianGrid strokeDasharray="3 3" fill={new_theme.palette.newSupplementary.SupCloudy} />
                                                                        <XAxis dataKey="label" />
                                                                        <defs>
                                                                            {['self-activation', 'self-confidence', 'communication-strategy', 'cooperation', 'regularity'].map((trait, index) => {
                                                                                return <linearGradient
                                                                                    key={`gradient-${index}`}
                                                                                    id={`custom-gradient-${index}`}
                                                                                    background="yellow"
                                                                                    x1="0%"
                                                                                    y1={'0%'}
                                                                                    x2="0%"
                                                                                    y2={'100%'}

                                                                                >
                                                                                    <stop offset={0} stopColor={getColorForBorder(trait, 'top')} />
                                                                                    <stop offset={getPositionOfNormalizedValue(trait) - 0.02} stopColor={getColor(userTraits[trait].level).color} />
                                                                                    <stop offset={getPositionOfNormalizedValue(trait)} stopColor={new_theme.palette.primary.PinkPurple} />
                                                                                    <stop offset={getPositionOfNormalizedValue(trait) + 0.02} stopColor={getColor(userTraits[trait].level).color} />
                                                                                    <stop offset={1} stopColor={getColorForBorder(trait, 'bottom')} />
                                                                                </linearGradient>
                                                                            })}
                                                                        </defs>
                                                                        <YAxis ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} interval={0} domain={[1, 10]} />
                                                                        {/* <Tooltip cursor={false} /> */}
                                                                        {/* <Bar dataKey="data" fill="url(#custom-gradient)" /> */}
                                                                        <Bar dataKey="data" barSize={50}  >
                                                                            {['self-activation', 'self-confidence', 'communication-strategy', 'cooperation', 'regularity'].map((trait, index) => <Cell key={`cell-${index}`} fill={`url(#custom-gradient-${index})`} stroke={new_theme.palette.newSupplementary.NSupText} strokeWidth={0.5} width={50} />)}
                                                                        </Bar>
                                                                    </BarChart>}
                                                                </Grid>
                                                                <Grid item xs={12} lg={5} sx={{ p: "24px", pr: '14px', pt: 0 }}>
                                                                    
                                                                    {/* QNAD VALUES */}
                                                                    {['self-activation'].map((traitName) =>
                                                                        <Box className="skillsBg" key={traitName} sx={{ mb: "12px", pl: "8px", lineHeight: "27px", pr: "24px", background: activeTraitName == traitName ? new_theme.palette.primary.creme : '', cursor: "pointer", borderRadius: "8px", }}
                                                                            onClick={() => { setActiveTraitName(traitName) }}>
                                                                            {/* <CircleIcon style={getColor(userTraits[traitName]['level'])} sx={{ fontSize: 'small' }}></CircleIcon> */}
                                                                            <div >
                                                                                <EVerticalProperty className="font-18-bold" name={<Typography variant="body2" component="span">{userTraits[traitName]['short-name']}</Typography>} description={userTraits[traitName]['short-description']}
                                                                                // value={Math.round(userTraits[traitName].normalizedValue) + "%"}
                                                                                >
                                                                                </EVerticalProperty>
                                                                                {/* <Box sx={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}><CircleIcon sx={{ fontSize: 'small' }} style={getColor(userTraits[traitName]['level'])}></CircleIcon>&nbsp;{getLevel(userTraits[traitName]['level'])}</Box> */}
                                                                            </div>
                                                                            <ChevronRightIcon className="dim-icon"/>
                                                                        </Box>
                                                                    )}
                                                                    {['self-confidence'].map((traitName) =>
                                                                        <Box className="skillsBg" key={traitName} sx={{ mb: "12px", pl: "8px", lineHeight: "27px", pr: "24px", background: activeTraitName == traitName ? new_theme.palette.primary.creme : '', cursor: "pointer", borderRadius: "8px" }}
                                                                            onClick={() => { setActiveTraitName(traitName) }}>
                                                                            {/* <CircleIcon style={getColor(userTraits[traitName]['level'])} sx={{ fontSize: 'small' }}></CircleIcon> */}
                                                                            <div>
                                                                                <EVerticalProperty className="font-18-bold" name={<Typography variant="body2" component="span">{userTraits[traitName]['short-name']}</Typography>} description={userTraits[traitName]['short-description']}
                                                                                // value={Math.round(userTraits[traitName].normalizedValue) + "%"}
                                                                                >
                                                                                </EVerticalProperty>
                                                                                {/* <Box sx={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}><CircleIcon sx={{ fontSize: 'small' }} style={getColor(userTraits[traitName]['level'])}></CircleIcon>&nbsp;{getLevel(userTraits[traitName]['level'])}</Box> */}
                                                                            </div>
                                                                            <ChevronRightIcon className="dim-icon" />
                                                                        </Box>
                                                                    )}
                                                                    {['communication-strategy'].map((traitName) =>
                                                                        <Box className="skillsBg" key={traitName} sx={{ mb: "12px", pl: "8px", lineHeight: "27px", pr: "24px", background: activeTraitName == traitName ? new_theme.palette.primary.creme : '', cursor: "pointer", borderRadius: "8px" }}
                                                                            onClick={() => { setActiveTraitName(traitName) }}>
                                                                            {/* <CircleIcon style={getColor(userTraits[traitName]['level'])} sx={{ fontSize: 'small' }}></CircleIcon> */}
                                                                            <div>
                                                                                <EVerticalProperty className="font-18-bold" name={<Typography variant="body2" component="span">{userTraits[traitName]['short-name']}</Typography>} description={userTraits[traitName]['short-description']}
                                                                                // value={Math.round(userTraits[traitName].normalizedValue) + "%"}
                                                                                >
                                                                                </EVerticalProperty>
                                                                                {/* <Box sx={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}><CircleIcon sx={{ fontSize: 'small' }} style={getColor(userTraits[traitName]['level'])}></CircleIcon>&nbsp;{getLevel(userTraits[traitName]['level'])}</Box> */}
                                                                            </div>
                                                                            <ChevronRightIcon className="dim-icon" />
                                                                        </Box>
                                                                    )}
                                                                    {['cooperation'].map((traitName) =>
                                                                        <Box className="skillsBg" key={traitName} sx={{ mb: "12px", pl: "8px", lineHeight: "27px", pr: "24px", background: activeTraitName == traitName ? new_theme.palette.primary.creme : '', cursor: "pointer", borderRadius: "8px" }}
                                                                            onClick={() => { setActiveTraitName(traitName) }}>
                                                                            {/* <CircleIcon style={getColor(userTraits[traitName]['level'])} sx={{ fontSize: 'small' }}></CircleIcon> */}
                                                                            <div>
                                                                                <EVerticalProperty className="font-18-bold" name={<Typography variant="body2" component="span">{userTraits[traitName]['short-name']}</Typography>} description={userTraits[traitName]['short-description']}
                                                                                // value={Math.round(userTraits[traitName].normalizedValue) + "%"}
                                                                                >
                                                                                </EVerticalProperty>
                                                                                {/* <Box sx={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}><CircleIcon sx={{ fontSize: 'small' }} style={getColor(userTraits[traitName]['level'])}></CircleIcon>&nbsp;{getLevel(userTraits[traitName]['level'])}</Box> */}
                                                                            </div>
                                                                            <ChevronRightIcon className="dim-icon" />
                                                                        </Box>
                                                                    )}
                                                                    {['regularity'].map((traitName) =>
                                                                        <Box className="skillsBg" key={traitName} sx={{ mb: "12px", pl: "8px", lineHeight: "27px", pr: "24px", background: activeTraitName == traitName ? new_theme.palette.primary.creme : '', cursor: "pointer", borderRadius: "8px" }}
                                                                            onClick={() => { setActiveTraitName(traitName) }}>
                                                                            {/* <CircleIcon style={getColor(userTraits[traitName]['level'])} sx={{ fontSize: 'small' }}></CircleIcon> */}
                                                                            <div>
                                                                                <EVerticalProperty className="font-18-bold" name={<Typography variant="body2" component="span">{userTraits[traitName]['short-name']}</Typography>} description={userTraits[traitName]['short-description']}
                                                                                // value={null} 

                                                                                >
                                                                                </EVerticalProperty>
                                                                                {/* <Box sx={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}><CircleIcon sx={{ fontSize: 'small' }} style={getColor(userTraits[traitName]['level'])}></CircleIcon>&nbsp;{getLevel(userTraits[traitName]['level'])}</Box> */}
                                                                            </div>
                                                                            <ChevronRightIcon className="dim-icon" />
                                                                        </Box>
                                                                    )}
                                                                    {['current-performance-indicator'].map((traitName) =>
                                                                        <Box className="skillsBg" key={traitName} sx={{ mb: "12px", pl: "8px", lineHeight: "27px", pr: "24px", background: activeTraitName == traitName ? new_theme.palette.primary.creme : '', cursor: "pointer", borderRadius: "8px" }}
                                                                            onClick={() => { setActiveTraitName(traitName) }}>
                                                                            {/* <CircleIcon style={getColor(userTraits[traitName]['level'])} sx={{ fontSize: 'small' }}></CircleIcon> */}
                                                                            <div>
                                                                                <EVerticalProperty className="font-18-bold" name={<Typography variant="body2" component="span">{userTraits[traitName]['short-name']}</Typography>} description={userTraits[traitName]['short-description']}
                                                                                // value={Math.round(userTraits[traitName].normalizedValue) + "%"}
                                                                                >
                                                                                </EVerticalProperty>
                                                                                {/* <Box sx={{ fontSize: '12px', display: 'flex', alignItems: 'center' }}><CircleIcon sx={{ fontSize: 'small' }} style={getColor(userTraits[traitName]['level'])}></CircleIcon>&nbsp;{getLevel(userTraits[traitName]['level'])}</Box> */}
                                                                            </div>
                                                                            <ChevronRightIcon className="dim-icon" />
                                                                        </Box>
                                                                    )}





                                                                    <Box display="flex" justifyContent="flex-end" sx={{ pt: "12px" }}>
                                                                        {/* DownloadResultsButton is used for downloadin PDF from BrainCore server */}
                                                                        {/* <DownloadResultsButton activeResults={activeResults} results={results} setResults={setResults}></DownloadResultsButton> */}
                                                                        <StyledButton sx={{width: '100%'}} onClick={() => setOpenReport(true)}  endIcon={activeResults.hasAccessToFullReport ?  undefined : <LockIcon />}>{t("mySpace-myResults:OPEN FULL RESULTS")} </StyledButton>
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                        }



                                                        {/* </Grid> */}
                                                        <Grid item xs={12} sx={{ p: "24px", pt: "0px", mt: 2 }}>
                                                            <Typography variant="result_title" sx={{ pb: "8px", color: new_theme.palette.primary.MedPurple }} >
                                                                {userTraits[activeTraitName]['short-name'] + ' (' + userTraits[activeTraitName]['abbreviation']+")"}
                                                            </Typography>
                                                            {/* <Typography variant="subtitle3" component="p" sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 2, fontWeight: '500' }}>{t("mySpace-myResults:YOUR LEVEL")}: &nbsp;<CircleIcon sx={{ fontSize: 'small' }} style={getColor(userTraits[activeTraitName]['level'])}></CircleIcon>&nbsp; <span>{getLevel(userTraits[activeTraitName]['level'])}</span></Typography> */}
                                                            <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500' }}>{userTraits[activeTraitName]['main-definition']}</Typography>

                                                            {/* {activeTraitName != 'current-performance-indicator' && <> */}
                                                            <Box className="bubble" sx={{ mt: 3, backgroundColor: new_theme.palette.newSupplementary.SupCloudy, position: 'relative' }}>
                                                                <Box className="bubble3">
                                                                    {userTraits[activeTraitName]['part-1'] != "" && userTraits[activeTraitName]['part-1'] != undefined && <>
                                                                        <Box sx={{ my: 3, gap: "5px 20px", display: 'flex' }}>
                                                                            <div style={{ height: '16px', width: '16px', borderRadius: '50%', backgroundColor: new_theme.palette.secondary.Turquoise, flex: 'none', marginTop: '4px' }}></div>
                                                                            <Typography variant="list1" component="p">{userTraits[activeTraitName]['part-1']}</Typography>
                                                                        </Box>
                                                                    </>}

                                                                    {userTraits[activeTraitName]['part-2'] != "" && userTraits[activeTraitName]['part-2'] != undefined && <>
                                                                        <Box sx={{ my: 3, gap: "5px 20px", display: 'flex' }}>
                                                                            <div style={{ height: '16px', width: '16px', borderRadius: '50%', backgroundColor: new_theme.palette.secondary.Turquoise, flex: 'none', marginTop: '4px' }}></div>
                                                                            <Typography variant="list1" component="p">{userTraits[activeTraitName]['part-2']}</Typography>
                                                                        </Box>
                                                                    </>}

                                                                    {userTraits[activeTraitName]['part-3'] != "" && userTraits[activeTraitName]['part-3'] != undefined && <>
                                                                        <Box sx={{ my: 3, gap: "5px 20px", display: 'flex' }}>
                                                                            <div style={{ height: '16px', width: '16px', borderRadius: '50%', backgroundColor: new_theme.palette.secondary.Turquoise, flex: 'none', marginTop: '4px' }}></div>
                                                                            <Typography variant="list1" component="p">{userTraits[activeTraitName]['part-3']}</Typography>
                                                                        </Box>
                                                                    </>}

                                                                </Box>
                                                            </Box>
                                                            {
                                                                userTraits[activeTraitName]['action-1'] != undefined && userTraits[activeTraitName]['action-1'] != "" && <>
                                                                    <Box sx={{ mt: 2, border:`2px solid ${new_theme.palette.secondary.Turquoise}`, backgroundColor: new_theme.palette.primary.PWhite, borderRadius: '10px', padding: '16px' }}>
                                                                        <Typography variant="body2" component="p" sx={{fontWeight: '500'}}>{t("mySpace-myResults:WORTH TO KNOW")} &nbsp; <span style={{ fontWeight: 'bold' }}>{userTraits[activeTraitName]['action-1']}</span></Typography>
                                                                    </Box>
                                                                </>
                                                            }

                                                            {/* <Grid item xs={12} sx={{ display: "flex", pb: "12px", pt: "12px" }} >
                                                            <ListItemAvatar>
                                                                <One />
                                                            </ListItemAvatar>

                                                            <Typography sx={{ fontFamily: "Roboto", lineHeight: "24px", fontSize: "16px", color: new_theme.palette.neutrals.almostBlack }} >
                                                                {userTraits[activeTraitName]['part-1']}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sx={{ display: "flex", pb: "12px", pt: "12px" }} >
                                                            <ListItemAvatar>
                                                                <Two />
                                                            </ListItemAvatar>

                                                            <Typography sx={{ fontFamily: "Roboto", lineHeight: "24px", fontSize: "16px", color: new_theme.palette.neutrals.almostBlack }} >
                                                                {userTraits[activeTraitName]['part-2']}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sx={{ display: "flex" }} >
                                                            <ListItemAvatar style={{ color: new_theme.palette.shades.white30 }} >
                                                                <Three />
                                                            </ListItemAvatar>
                                                            <Typography sx={{ fontFamily: "Roboto", lineHeight: "24px", fontSize: "16px", color: new_theme.palette.neutrals.almostBlack }} >
                                                                {userTraits[activeTraitName]['part-3']}
                                                            </Typography>
                                                        </Grid> */}
                                                            {/* </>} */}
                                                        </Grid>
                                                    </ECard>
                                                    {/* <ECard sx={{ mt: 2, boxShadow: 'none', background: new_theme.palette.newSupplementary.SupCloudy, mt: 2 }}>
                                                        <Grid item={12} sx={{ p: '24px', pt: '12px', pb: '12px' }}>
                                                            <div className="retake_action" style={{ display: 'flex', alignItems: 'center' }}>
                                                                <div className="img_box">
                                                                    <img src={EducationLaptop} />
                                                                </div>
                                                                <div className="content">
                                                                    <Typography variant="result_title" sx={{ pb: "8px", color: new_theme.palette.newSupplementary.NSupText }} >
                                                                        {t("mySpace-myResults:ACTION TO TAKE")}
                                                                    </Typography>
                                                                    
                                                                    <Typography sx={{ lineHeight: "24px", fontSize: "16px", color: new_theme.palette.neutrals.almostBlack }} >
                                                                        {t("mySpace-myResults:IN SOME CASES YOU ARE QUITE INDEPENDENT. YOU CAN WORK ON DEVELOPING YOUR EFFECTIVE STYLE OF LEARNING WITH SOMEONE WHO WILL SUPPORT YOU.")}
                                                                    </Typography>
                                                                    <br />

                                                                    
                                                                    <StyledButton eVariant="primary" eSize="medium" sx={{ mt: 2 }} onClick={handleTakeTest}>{t("mySpace-myResults:RETAKE THE TEST")}</StyledButton>
                                                                </div>
                                                            </div>
                                                        </Grid>
                                                    </ECard> */}
                                                </Grid>
                                                <Grid item xs={12} md={4} lg={4} sx={{ pt: 1, alignContent: "flex-start" }}>
                                                    {userTip && <Grid item xs={12} sx={{ pb: '16px' }}>

                                                        <ECard className="card-bg" sx={{ background: new_theme.palette.newSupplementary.SupCloudy, border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, display: "block", p: "24px" }}>
                                                            <div className="heading">
                                                                <Typography variant="result_title" component="h4" sx={{ mb: 1, color: new_theme.palette.primary.MedPurple, textAlign: 'left' }}>
                                                                    {t("mySpace-myResults:LEARNING TIP")}
                                                                </Typography>

                                                            </div>
                                                            <div className="sub_heading" style={{ display: 'flex', alignItems: 'center' }}>
                                                                <Typography onClick={() => {
                                                                    const req = {
                                                                        '_id': userTip?._id,
                                                                        'favourite': !(userTip?.favourite == undefined ? false : userTip?.favourite),
                                                                    }
                                                                    storeFeedback('tip', req)
                                                                }} variant="body1" component="h5" sx={{ fontWeight: 'bold', textAlign: 'left', cursor: 'pointer' }} >
                                                                    {userTip?.favourite ?
                                                                        <>
                                                                            <StyledEIconButton color="primary" size="medium" >
                                                                                <TurnedInIcon />
                                                                            </StyledEIconButton>
                                                                            {/* <img src="/img/brand/added_label.svg" /> */}&nbsp; 
                                                                            {t("mySpace-myResults:REMOVE FROM MY RESOURCES")}
                                                                        </>
                                                                        :
                                                                        <>
                                                                            <StyledEIconButton color="primary" size="medium">
                                                                                <TurnedInNotIcon />
                                                                            </StyledEIconButton>
                                                                            {/* <img src="/img/brand/add_label.svg" /> */}&nbsp; 
                                                                            {t("mySpace-myResults:ADD TO MY RESOURCES")}
                                                                        </>
                                                                    }
                                                                </Typography>
                                                            </div>
                                                            <Box className="list_item" style={{ backgroundColor: new_theme.palette.primary.PWhite, padding: '16px', marginTop: '20px', borderRadius: '10px' }}>
                                                                <Typography variant="subtitle3" sx={{ fontWeight: '500', my: '10px', mt: 0 }} >{userTip.introduction}</Typography>
                                                                <ul className="list-style-checkbox">
                                                                    <li>
                                                                        <Typography variant="subtitle3" sx={{ fontWeight: "500" }} for="checkbox1">{userTip.text}</Typography>
                                                                    </li>
                                                                </ul>
                                                                <Typography variant="subtitle3" sx={{ fontWeight: "500" }} >
                                                                    {userTip.reasoning}
                                                                </Typography>
                                                            </Box>
                                                            {
                                                                userTip.useful === 0 &&
                                                                <>
                                                                    <Box sx={{ my: 3, gap: "5px 20px", display: 'flex', justifyContent: 'center' }}>
                                                                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                                            {/* <img className="helful_img" src={`img/congnitive-space/lern_1.svg`}></img> */}
                                                                            <Typography variant="subtitle3" component="h6" sx={{ fontWeight: '500', textAlign: 'left', py: "18px", color: new_theme.palette.newSupplementary.NSupText }} >{t("mySpace-myResults:IS TIP HELPFUL?")}</Typography>
                                                                            <Box className="btn-mb-clm" sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', gap: '15px;' }}>

                                                                                <StyledButton sx={{ width: '50%' }} eSize='medium' eVariant="secondary" onClick={() => {
                                                                                    const req = {
                                                                                        '_id': userTip?._id,
                                                                                        'useful': false,
                                                                                    }
                                                                                    storeFeedback('tip', req)
                                                                                    handleClickOpen("LearningTipsNo")
                                                                                }} type="LearningTipsNo">{t("mySpace-myResults:NOT REALLY")}</StyledButton>
                                                                                <StyledButton sx={{ width: '50%' }} eVariant='secondary' eSize='medium' onClick={() => {
                                                                                    const req = {
                                                                                        '_id': userTip?._id,
                                                                                        'useful': true,
                                                                                    }
                                                                                    storeFeedback('tip', req)
                                                                                    handleClickOpen("LearningTipsYes")
                                                                                }} type="LearningTipsYes">{t("mySpace-myResults:YES")+"!"}</StyledButton>

                                                                                <DialogBox open={openLearningTipsYes} onClose={() => handleClose("LearningTipsYes")} type="LearningTipsYes" />
                                                                                <DialogBox open={openLearningTipsNo} onClose={() => handleClose("LearningTipsNo")} type="LearningTipsNo" />
                                                                            </Box>
                                                                        </Box>
                                                                    </Box >
                                                                </>
                                                            }

                                                            {/* 
                                                    <Box sx={{ my: 3, gap: "5px 20px", display: 'flex' }}><Typography variant="list1">{t("mySpace-myResults:IN SOME CASES YOU ARE QUITE INDEPENDENT. YOU CAN WORK ON DEVELOPING YOUR EFFECTIVE STYLE OF LEARNING WITH SOMEONE WHO WILL SUPPORT YOU.")}</Typography></Box>
                                                    <Box sx={{ my: 3, gap: "5px 20px", display: 'flex' }}><Typography variant="list1">{t("mySpace-myResults:IN SOME CASES YOU ARE QUITE INDEPENDENT. YOU CAN WORK ON DEVELOPING YOUR EFFECTIVE STYLE OF LEARNING WITH SOMEONE WHO WILL SUPPORT YOU.")}</Typography></Box>

                                                    <Box sx={{ my: 3, gap: "5px 20px", display: 'flex' }}><CircleIcon sx={{ mt: .5, fontSize: 'medium', color: new_theme.palette.primary.MedPurple }}></CircleIcon><Typography variant="list1">{t("mySpace-myResults:IN SOME CASES YOU ARE QUITE INDEPENDENT. YOU CAN WORK ON DEVELOPING YOUR EFFECTIVE STYLE OF LEARNING WITH SOMEONE WHO WILL SUPPORT YOU.")}</Typography></Box>
                                                    <Box sx={{ my: 3, gap: "5px 20px", display: 'flex' }}><CircleIcon sx={{ mt: .5, fontSize: 'medium', color: new_theme.palette.primary.MedPurple }}></CircleIcon><Typography variant="list1">{t("mySpace-myResults:IN SOME CASES YOU ARE QUITE INDEPENDENT. YOU CAN WORK ON DEVELOPING YOUR EFFECTIVE STYLE OF LEARNING WITH SOMEONE WHO WILL SUPPORT YOU.")}</Typography></Box>
                                                    <Box sx={{ my: 3, gap: "5px 20px", display: 'flex' }}><CircleIcon sx={{ mt: .5, fontSize: 'medium', color: new_theme.palette.primary.MedPurple }}></CircleIcon><Typography variant="list1">{t("mySpace-myResults:IN SOME CASES YOU ARE QUITE INDEPENDENT. YOU CAN WORK ON DEVELOPING YOUR EFFECTIVE STYLE OF LEARNING WITH SOMEONE WHO WILL SUPPORT YOU.")}</Typography></Box>
                                                    <Box sx={{ my: 3, gap: "5px 20px", display: 'flex' }}><CircleIcon sx={{ mt: .5, fontSize: 'medium', color: new_theme.palette.primary.MedPurple }}></CircleIcon><Typography variant="list1">{t("mySpace-myResults:IN SOME CASES YOU ARE QUITE INDEPENDENT. YOU CAN WORK ON DEVELOPING YOUR EFFECTIVE STYLE OF LEARNING WITH SOMEONE WHO WILL SUPPORT YOU.")}</Typography></Box>
                                                    <Box sx={{ my: 3, gap: "5px 20px", display: 'flex' }}><CircleIcon sx={{ mt: .5, fontSize: 'medium', color: new_theme.palette.primary.MedPurple }}></CircleIcon><Typography variant="list1">{t("mySpace-myResults:IN SOME CASES YOU ARE QUITE INDEPENDENT. YOU CAN WORK ON DEVELOPING YOUR EFFECTIVE STYLE OF LEARNING WITH SOMEONE WHO WILL SUPPORT YOU.")}</Typography></Box>
                                                    <Box sx={{ my: 3, gap: "5px 20px", display: 'flex' }}><CircleIcon sx={{ mt: .5, fontSize: 'medium', color: new_theme.palette.primary.MedPurple }}></CircleIcon><Typography variant="list1">{t("mySpace-myResults:IN SOME CASES YOU ARE QUITE INDEPENDENT. YOU CAN WORK ON DEVELOPING YOUR EFFECTIVE STYLE OF LEARNING WITH SOMEONE WHO WILL SUPPORT YOU.")}</Typography></Box>

                                                    <Box sx={{ my: 3, gap: "5px 20px", display: 'flex' }}><Typography variant="list1">{t("mySpace-myResults:IN SOME CASES YOU ARE QUITE INDEPENDENT. YOU CAN WORK ON DEVELOPING YOUR EFFECTIVE STYLE OF LEARNING WITH SOMEONE WHO WILL SUPPORT YOU.")}</Typography></Box>
                                                    <Box sx={{ my: 3, gap: "5px 20px", display: 'flex' }}><Typography variant="list1">{t("mySpace-myResults:IN SOME CASES YOU ARE QUITE INDEPENDENT. YOU CAN WORK ON DEVELOPING YOUR EFFECTIVE STYLE OF LEARNING WITH SOMEONE WHO WILL SUPPORT YOU.")}</Typography></Box> */}

                                                            {/* <Paper sx={{p:"16px", background: theme.palette.primary.creme, boxShadow: 'none', border: `1px solid ${theme.palette.primary.violet}` , borderRadius:"8px"}}>
                                    <Typography sx={{ lineHeight:"27px", fontFamily:"Nunito", fontSize: "18px", color: theme.palette.primary.darkViolet }} >
                                        {userTip.introduction+":"}
                                    </Typography>
                                    
                                    <ul><li>
                                        <Typography sx={{lineHeight:"24px", fontFamily:"Roboto", pt:"16px", mb:"16px", fontSize: "16px", color: theme.palette.neutrals.almostBlack }} >
                                            {userTip.text}
                                        </Typography>
                                    </li></ul>
                                    <Typography sx={{lineHeight:"24px", fontFamily:"Roboto", fontStyle: 'italic',  fontSize: "16px", color: theme.palette.neutrals.almostBlack }} >
                                        {userTip.reasoning}
                                    </Typography>
                                </Paper> */}
                                                            {/* <Box textAlign='center' sx={{mt:"16px"}}>
                                    <EButton disabled={true} eVariant="primary" eSize='small' style={{margin:"auto"}} >
                                            {t("mySpace-myResults:ADD TO MY TASK LIST")}
                                    </EButton>
                                </Box> */}
                                                        </ECard>
                                                    </Grid>}
                                                    {/* <Grid item xs={12} sx={{pb: '16px'}}>
                            <ECard sx={{background: theme.palette.glass.opaque, display:"block", p:"16px"}}>
                                <Typography sx={theme.typography.sh3} style={{lineHeight:"36px", fontSize: "24px", color:theme.palette.primary.darkViolet, fontWeight:"bold" }} >
                                    {t("mySpace-myResults:ISSUES")} 
                                </Typography>
                                <Typography sx={{lineHeight:"24px", pt:"8px", pb:"16px", fontFamily:"Roboto",  fontStyle: 'italic',  fontSize: "16px", color: theme.palette.neutrals.almostBlack }} >
                                    {t("mySpace-myResults:DO YOU THINK THAT YOU MAY HAVE, OR DO YOU RECOGNIZE YOURSELF AS HAVING ONE OF THESE POTENTIAL DIFFICULTIES?")} 
                                </Typography>
                                {importatntIssues.map((issue)=>
                                    <Paper key={issue._id} id={issue._id} sx={{ mb:"8px", p:"16px", background: theme.palette.primary.creme, boxShadow: 'none', border: `1px solid ${theme.palette.primary.violet}` , borderRadius:"8px"}}>
                                        <EChip size="small" showlabels={+true} sx={{  border:"none"}}
                                            label={t("mySpace-myResults:GENERAL ISSUE")}
                                            icon={<SvgIcon viewBox="0 0 32 32" component={Bookmark}/>}>
                                        </EChip>

                                        <Grid container item xs={12} sx={{ justifyContent: 'space-between'}}>
                                            <Grid item xs={12} lg={6}>
                                                <Typography sx={{fontFamily:"Roboto", pt:"16px", lineHeight:"24px",  fontSize: "16px", color: theme.palette.neutrals.almostBlack }} >
                                                    {t(`issues:${issue._id}-${readerType}-name`)} 
                                                </Typography>
                                            </Grid>
                                            <Grid container item xs={12} lg={6}  sx={{ justifyContent:{xs:"center", md:"end"}, alignItems: {xs:"center", md:"end"}}}>
                                                <ToggleButtonGroup sx={{ mt:{xs:2, md:0} }}
                                                    onChange={()=>{
                                                        F_handleSetShowLoader(true)
                                                        IssuesService.addFeedback(activeResults._id, issue._id, {feedbackType: 'looksFamiliar',feedbackValue: !(issue.feedback?.looksFamiliar)})
                                                        .then(res=>{

                                                            // 1. Make a shallow copy of the items
                                                            let updatedResults = [...results];
                                                            let index = updatedResults.findIndex(r=>r._id == activeResults._id)
                                                            // 2. Make a shallow copy of the item you want to mutate
                                                            let updatedResult = { ...updatedResults[index] };
                                                            // 3. Replace the property you're intested in
                                                            let issueIndex = updatedResult.issues.findIndex(i=>i._id == issue._id)
                                                            let updatedIssue = updatedResult.issues.find(i=>i._id == issue._id)
                                                            if (!updatedIssue.feedback) updatedIssue.feedback = {}
                                                            updatedIssue.feedback.looksFamiliar = !updatedIssue.feedback?.looksFamiliar;
                                                            
                                                            updatedResult.issues[issueIndex] = updatedIssue 
                                                            // 4. Put it back into our array
                                                            updatedResults[index] = updatedResult;
                                                            // 5. Set the state to our new copy
                                                            setResults(updatedResults);
                                                            //setActiveResults(updatedResult)
                                                            F_handleSetShowLoader(false)
                                                            
                                                        }).catch(err=>{
                                                            console.log(err);
                                                            F_showToastMessage(F_getErrorMessage(err), 'error');
                                                            F_handleSetShowLoader(false)
                                                        });
                                                    }}
                                                    exclusive
                                                    value={issue.feedback?.looksFamiliar ? "yes" : "no"} 

                                                    aria-label="Platform"
                                                    >
                                                    <EToggleButton sx={{ width:  '77px'}} value="no" style={{borderRadius: "16px 0px 0px 16px"}}> {<StyledCheckIcon/>}{t("mySpace-myResults:NO")}</EToggleButton>
                                                    <EToggleButton sx={{ width: '85px'}} value="yes" style={{borderRadius: "0px 16px 16px 0px"}}>{<StyledCheckIcon/> }{t("mySpace-myResults:YES")}</EToggleButton>
                                                </ToggleButtonGroup>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                )}
                            </ECard>  
                        </Grid> */}
                                                    {/* <Grid  item xs={12}  >
                            <RecommendedCourses ></RecommendedCourses>
                        </Grid> */}
                                                    <Grid container item xs={12}>
                                                        <Box sx={{ textAlign: 'center', backgroundColor: new_theme.palette.newSupplementary.SupCloudy, border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, padding: '24px', width: '100%', borderRadius: '10px' }}>
                                                            <Typography variant="result_title" component="h6" sx={{ textAlign: 'left', color: new_theme.palette.primary.MedPurple, mb: 1 }}>{t("mySpace-myResults:HISTORY")}</Typography>
                                                            <Typography variant="subtitle3" component="p" sx={{ textAlign: 'left', fontWeight: '500', mb: 1 }}>{t("mySpace-myResults:HISTORY DESCRIPTION")}</Typography>
                                                            <img className="img-mb-80" src={HistoryLearn} />
                                                            <StyledButton disabled={results?.filter(r=>areResultsProcessed(r)).length < 2} eVariant="secondary" eSzie="medium" sx={{ mt: 2, width: '100%' }}
                                                                onClick={() => setHistory(true)}>
                                                                {t("mySpace-myResults:CHECK HISTORY")}
                                                            </StyledButton>
                                                        </Box>
                                                    </Grid>
                                                    <Grid container item xs={12} sx={{ mt: 2 }}>
                                                        <Box sx={{ textAlign: 'center', backgroundColor: new_theme.palette.newSupplementary.SupCloudy, border: `1px solid ${new_theme.palette.newSecondary.NSIconBorder}`, padding: '24px', width: '100%', borderRadius: '10px' }}>
                                                            <Typography variant="result_title" component="h6" sx={{ textAlign: 'left', color: new_theme.palette.primary.MedPurple, mb: 1 }}>{t("Braincore test")}</Typography>
                                                            <Typography variant="subtitle3" component="p" sx={{ fontWeight: '500' }}>{t("mySpace-myResults:WHEN YOU FEEL LIKE TEXT")}</Typography>
                                                            <StyledButton eVariant="secondary" eSize="medium" sx={{ mt: 2, width: '100%' }} onClick={handleTakeTest}>{t("mySpace-myResults:RETAKE THE TEST")+"!"}</StyledButton>
                                                        </Box>
                                                    </Grid>
                                                    <Grid container item xs={12} sx={{ pt: 1, alignContent: "flex-start" }}>
                                                        <ECard className="card-bg card-faq" sx={{ background: new_theme.palette.primary.MedPurple, display: "block", p: "24px", width: "100%" }}>

                                                            <Box className="faq_sec" sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                                                <img className="faq_img" src={`img/congnitive-space/faq-icon.png`}></img>
                                                                <StyledButton sx={{width: '100%', mt: 1}} eVariant="secondary" eSize='large' onClick={() => handleClickOpen("faq")} type="Faq">{t("mySpace-myResults:LEARN MORE")}</StyledButton>
                                                                <DialogBox open={openFaq} onClose={() => handleClose("FAQ")} type="FAQ" />
                                                            </Box>




                                                        </ECard>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </TabPanel>
                                    {/* } */}

                                    {/* {currentTab == 1 &&  */}
                                    <TabPanel hidden={value!=1}  className="etab_bar" value={value} index={1}>
                                        <VirtualCoach setCurrentTab={setCurrentTab} />
                                    </TabPanel>
                                    {/* } */}

                                    {/* {currentTab == 2 &&  */}
                                    <TabPanel hidden={value!=2} className="etab_bar" value={value} index={2}>
                                        <MyResources setCurrentTab={setCurrentTab} setTabValue={handleChange1}/>
                                    </TabPanel>
                                    {/* } */}

                                    {/* {currentTab == 3 &&  */}
                                    <TabPanel hidden={value!=3} className="etab_bar" value={value} index={3}>
                                        <Performance />
                                    </TabPanel>
                                    {/* } */}

                                </>
                            }
                        </>

                    }
                    {/* RESULTS ALREADY PROCESSED */}

                </Grid>
            </Container>
            <TestSelection openChoice={openChoice} setOpenChoice={setOpenChoice}></TestSelection>
        </ThemeProvider>
    )
}