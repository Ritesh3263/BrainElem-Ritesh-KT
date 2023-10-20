import React, { useState, useEffect, lazy, Fragment, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMainContext } from "../../_ContextProviders/MainDataContextProvider/MainDataProvider";
import PropTypes from 'prop-types';
import STATUSES from 'enums/statusEnum';

// Services
import TeamService from "services/team.service"

// Charts
import { BarChart, Bar, XAxis, YAxis, Cell, CartesianGrid, ResponsiveContainer } from 'recharts';

// Other components
import Statistics from "./Statistics";

import TeamsDialog from "components/common/DrawerForTeams"



// ICONS
import { ReactComponent as IconNoTeams } from "../../../img/cognitive_space/no_teams.svg";
import { ReactComponent as IconWeakPoints } from "../../../img/cognitive_space/weight_weakpoints.svg";


// MUI ICONS

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Popover from "@mui/material/Popover";

// MUI ELEMENTS
import { Button, Grid, Input } from "@mui/material";

import GaugeChart from 'react-advanced-gauge-chart';
import Container from '@mui/material/Container';


import Divider from "@mui/material/Divider";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import Typography from '@mui/material/Typography';

import CircleIcon from '@mui/icons-material/Circle';
import Box from '@mui/material/Box';



// Css
import { ThemeProvider } from "@mui/material";
import { new_theme } from "NewMuiTheme";
import "./TeamsResults.scss";



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
                <Box sx={{ pl: { sm: 3, xs: 0 } }}>
                    <Typography>{children}</Typography>
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


export default function TeamsResults() {
    const { t } = useTranslation(['common', 'traits', 'sentinel-MyTeams-Results', 'sentinel-MyTeams-Statistics', , 'common']);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const userId = searchParams.get('userId');
    const teamId = searchParams.get('teamId');


    const [selectedTeamsId, setSelectedTeamsId] = useState([]);
    const [mergeGraph, setMergeGraph] = useState(null);
    const [data, setData] = useState();
    const [traitDetails, setTraitDetails] = useState();
    const [statistics, setStatistics] = useState();
    const { F_showToastMessage, F_handleSetShowLoader, F_t } = useMainContext();

    // TEAM SELECTION DRAWER ##########################
    const [open, setOpen] = useState(false);
    const [teams, setTeams] = useState();
    const [selectedUsers, setSelectedUsers] = useState([])
    const [buttonLabel, setButtonLabel] = useState(F_t("sentinel-MyTeams-Results:TEAMS"));
    // ################################################




    useEffect(()=>{
        let userIds = selectedUsers.map(u=>u._id)
        if(userIds?.length > 0){
            F_handleSetShowLoader(true)
            TeamService.teamModule({
                usersIds: userIds,
                "traitsKeys": [
                    "current-performance-indicator",
                    "self-activation",
                    "self-confidence",
                    "communication-strategy",
                    "cooperation",
                    "regularity",
                    "strong-and-weak-points-for-self-activation",
                    "strong-and-weak-points-for-self-confidence",
                    "strong-and-weak-points-for-communication-strategy",
                    "strong-and-weak-points-for-cooperation",
                    "strong-and-weak-points-for-regularity",
                    "communication",
                    "collaboration",
                    "creativity",
                    "critical-thinking",
                    "motivation",
                    "personal-engagement",
                    "strong-and-weak-points-for-motivation",
                    "strong-and-weak-points-for-personal-engagement",
                    "respect",
                    "empathy",
                    "emotional-intelligence-in-relation-with-others",
                    "emotional-intelligence-in-relation-with-oneself",
                    "leadership",
                    "risk-taking",
                    "stress-management",
                    "emotional-intelligence-global",
                    "extraversion",
                    "need-for-independence",
                    "mediation-and-influence",
                    "empathy",
                    "self-control",
                    "self-esteem",
                    "stress-management",
                    "sense-of-mastery",
                    "risk-taking",
                    "time-and-cost",

                ]
            }, 'employee').then(res => {
                if (res.status === 200) {
                    setData(res.data.traits);
                    // check if user has traits
                    const filteredUsers = res.data.users.filter(user => user.traits['current-performance-indicator'] && user.traits['current-performance-indicator'].normalizedValue);
                    setStatistics(filteredUsers);
                }
                F_handleSetShowLoader(false)

            }).catch(error => {
                // F_showToastMessage(t("sentinel-MyTeams-Results:THERE ARE NO RESULTS"), 'info');///design dailog here
                F_handleSetShowLoader(false)

            })
        }else{
            setData(undefined);
            setStatistics(undefined)
        }
    }, [selectedUsers])

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

    function generateObjectArray(arr) {
        return arr.map(item => {
            const label = item.abbreviation;
            const data = [item.min < 1 ? 1 : item.min - 0.05, item.max > 10 ? 10 : item.max + 0.05]; // create data array with min and max
            return { label, data };
        });
    }

    // Calculate the position of the line for normalized value
    // returns decimal number in range <0,1>
    const getPositionOfNormalizedValue = (trait) => {
        let trait_data = data[trait]
        let maxv = trait_data.max
        let minv = trait_data.min

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


    useEffect(() => {
        TeamService.readAllTeam().then(res => {
            if (res.status === 200) {
                let teams = res?.data?.data
                setTeams(teams)
                
                if (userId && teamId) {// Find user which is requested in url params
                    let team = teams.find(t=>t._id==teamId)
                    let user = team?.trainee?.find(u=>u._id==userId)
                    if (user) setSelectedUsers([user])
                } else if (teamId) {// Find team which is requested in url params
                    let team = teams.find(t=>t._id==teamId)
                    if (team) setSelectedUsers(team.trainee)
                }
            }
        })

    }, []);

    const [valuenew, setValuenew] = useState(0);

    const handleChange = (event, newValue) => {
        setValuenew(newValue);
        if (newValue < 5 && newValue > 0) {
            handleBarHandler(newValue === 1 ? "communication" : newValue === 2 ? 'emotional-intelligence-in-relation-with-others' : 'leadership')
        } else {
            setTraitDetails();
        }
    };


    const [openTab, setOpenTab] = useState(0);

    const handleTabChange = (index) => {
        if (index == 4) {
            setOpenTab(0);
        }
        else {
            setOpenTab(index);
        }
    };



    const getTraitComponent = (name) => {
        if (!data[name]) return <></>

        return <Box id={data[name].key} sx={{ m: {md:2, xs:"16px 0"}, p: {md:"24px", xs:"15px"}, borderRadius: '10px', marginTop: `${mergeGraph == null ? '24px' : '0'}` }}>
            <Typography variant="h2" component="h3" sx={{ mb: 3, color: new_theme.palette.primary.MedPurple, textAlign: 'left' }} >
                {data[name].shortName}
            </Typography>
            <div className="guageChartIndex guageChartParent" style={{ width: '350px', position: 'relative' }}>
                <span>1</span>
                <span>2</span>
                <span>3</span>
                <span>4</span>
                <span>5</span>
                <span>6</span>
                <span>7</span>
                <span>8</span>
                <span>9</span>
                <span>10</span>

                <GaugeChart className="guageChart" id={`gauge-chart1-${data[name].key}`}
                    percent={(data[name].normalizedValue) * 0.1}
                    previousValue={0}
                    nrOfLevels={10}
                    cornerRadius={0}
                    arcPadding={0}
                    arcWidth={0.3}
                    colors={[new_theme.palette.secondary.Turquoise, new_theme.palette.secondary.Turquoise, new_theme.palette.secondary.Turquoise, new_theme.palette.secondary.Turquoise, new_theme.palette.secondary.Turquoise, new_theme.palette.secondary.Turquoise, new_theme.palette.secondary.Turquoise, new_theme.palette.secondary.Turquoise, new_theme.palette.secondary.Turquoise, new_theme.palette.secondary.Turquoise].map((clor, index) => {
                        if (index >= Math.round(data[name].min) - 1 && index < Math.round(data[name].max)) {
                            return new_theme.palette.secondary.Turquoise;///this color needs to updated

                        }
                        else {
                            return new_theme.palette.secondary.DarkPurple;
                        }
                    })}
                    hideText={true}
                />
            </div>
            <Typography sx={{ lineHeight: "24px", fontSize: "16px", color: new_theme.palette.neutrals.almostBlack }} >
                {data[name].mainDefinition}
            </Typography>
            <br />
            <Box className="results_bubble" sx={{ backgroundColor: new_theme.palette.primary.PWhite, position: 'relative' }}>
                <Box className="bubble_bg">
                    {data[name]["actions"].map((item, index) => <Box key={index} sx={{ my: 1, gap: "5px 20px", display: 'flex' }}>
                        <CircleIcon sx={{ mt: .5, fontSize: 'large', color: new_theme.palette.secondary.Turquoise, borderRadius: '50%' }}></CircleIcon>
                        <Typography variant="list1">{item}</Typography>
                    </Box>)}
                </Box>
            </Box>
            {
                data[name]['descriptions'].length &&
                <>
                    <Box sx={{ border: `2px solid ${new_theme.palette.secondary.Turquoise}`, padding: '16px', mt: 2, borderRadius: '8px' }}>
                        {
                            data[name]['descriptions'].map((item) => (
                                <Typography variant="body2" component="p" sx={{ fontWeight: '500'}}>{item}</Typography>
                            ))
                        }
                    </Box>
                </>
            }
        </Box>

    }


    const getNadComponent = (name) => {
        {
            if (!data[name]) return <></>
            return <Box id={data[name].key} sx={{ m: {md:2, xs:"16px 0"}, p: {md:"24px", xs:"16px"}, borderRadius: '10px', marginTop: `${mergeGraph == null ? '24px' : '0'}` }}>
                <Typography variant="h2" component="h3" sx={{ mb: 3, color: new_theme.palette.primary.MedPurple, textAlign: 'left' }} >
                    {data[name].shortName}
                </Typography>
                <Typography sx={{ lineHeight: "24px", fontSize: "16px", color: new_theme.palette.neutrals.almostBlack }} >
                    {data[name].mainDefinition}
                </Typography>
                <br />
                <Box className="results_bubble" sx={{ backgroundColor: new_theme.palette.primary.PWhite, position: 'relative' }}>
                    <Box className="bubble_bg">
                        {data[name]["actions"].map((item, index) => <Box key={index} sx={{ my: 1, gap: "5px 20px", display: 'flex' }}>
                            <CircleIcon sx={{ mt: .5, fontSize: 'large', color: new_theme.palette.secondary.Turquoise, borderRadius: '50%' }}></CircleIcon>
                            <Typography variant="list1">{item}</Typography>
                        </Box>)}
                    </Box>
                </Box>
                {
                    data[name]['descriptions'].length &&
                    <>
                        <Box sx={{ border: `2px solid ${new_theme.palette.secondary.Turquoise}`, padding: '16px', mt: 2, borderRadius: '8px' }}>
                            {
                                data[name]['descriptions'].map((item, index) => (<>
                                    <Typography variant="body2" component="p" sx={{ fontWeight: '500' }}>{item}</Typography>
                                    {index != data[name]['descriptions'].length - 1 && <br />}
                                </>
                                ))
                            }
                        </Box>
                    </>
                }

                {data["strong-and-weak-points-for-" + name].mainDefinition &&
                    <Box sx={{ mt: 4 }}>
                        <div style={{ textAlign: 'center' }}>
                            <IconWeakPoints style={{ height: '40px', marginBottom: '14px' }} />
                            <Typography variant="h3" component="h3" sx={{ color: new_theme.palette.newSupplementary.NSupText, mb: 2 }}>{t("sentinel-MyTeams-Results:STRONG AND WEAK POINTS")}</Typography>
                        </div>

                        <Grid container spacing={2} alignItems='center'>
                            <Grid item xs={12}>
                                <div style={{ marginBottom: '16px' }}>
                                    <Typography variant="body1" component="p" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, fontWeight: '500', fontSize: '1rem' }}>{data["strong-and-weak-points-for-" + name].mainDefinition}</Typography>
                                </div>
                                <div>
                                    {data["strong-and-weak-points-for-" + name].descriptions.map(desc => {
                                        return <Typography variant="body1" component="p" sx={{ textAlign: 'left', color: new_theme.palette.newSupplementary.NSupText, fontWeight: '500', fontSize: '1rem' }}>{desc}</Typography>
                                    })}
                                </div>
                            </Grid>
                        </Grid>
                        <Box sx={{ border: `2px solid ${new_theme.palette.secondary.Turquoise}`, padding: '16px', mt: 2, borderRadius: '8px' }}>
                            <Typography variant="body2" component="p" sx={{ fontWeight: '500'}}>{t("sentinel-MyTeams-Results:HOW TO DEVELOP") + ": " + t(`traits:${name}-short-name`)} &nbsp;
                                <span style={{ fontWeight: '600' }}>{data["strong-and-weak-points-for-" + name]["actions"][0]}</span></Typography>
                        </Box>
                    </Box>
                }
            </Box>

        }
    };

    const isNoData = () => {
        return <>
            <Box sx={{ backgroundColor: new_theme.palette.newSupplementary.SupCloudy, width: '100%', padding: '60px 40px !important', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                <IconNoTeams style={{ height: '50px' }} />
                <Typography variant="body2" component='p' align="center" mt={2} sx={{ fontWeight: '500' }}>{F_t("sentinel-MyTeams-Results:PLEASE SELECT A TEAM TEXT")}</Typography>
            </Box>
        </>
    }


    const handleBarHandler = (trait, index) => {
        // let headerOffset = 45;
        const elements = document.getElementsByTagName('h3');
        for (const element of elements) {
            if (element.textContent === trait.name) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
            }
        }
        if (!data) return F_showToastMessage(F_t("sentinel-MyTeams-Results:PLEASE SELECT A TEAM TEXT"))
        const traits = ['self-activation', 'self-confidence', 'communication-strategy', 'cooperation', 'regularity', 'motivation', 'personal-engagement'].map(trait => data[trait])
        if (trait.fill) {
            const selectedTrait = traits[trait.key.fill.match(/\d+/)[0]];
            setTraitDetails(selectedTrait)
        } else {
            const selectedTrait = data[trait.key];
            setTraitDetails(selectedTrait)
        }

    }



    return (

        <ThemeProvider theme={new_theme}>
            <Container maxWidth="xl" className="mainContainerDiv main_results height_80vh">
                <Grid item xs={12}>

                    <div className="admin_content">
                        <div className="admin_heading heading_results">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                <Grid>
                                    <Typography variant="h1" component="h1">{t("sentinel-MyTeams-Results:RESULTS")}</Typography>
                                    <Divider variant="insert" className='heading_divider' />
                                </Grid>
                            </div>
                            <div className="heading_buttons btn_result min-w-300" style={{ display: 'flex' }}>
                                <Button className="btn-result"
                                    onClick={()=>setOpen(true)}>
                                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {buttonLabel}
                                    </span>
                                    <ArrowDropDownIcon />
                                </Button>
                                <TeamsDialog
                                    teams={teams}
                                    open={open}
                                    setOpen={setOpen}
                                    onConfirm={(users, _, label)=>{
                                        setOpen(false)
                                        setSelectedUsers(users)
                                        setButtonLabel(label)
                                    }}

                                    onClose={()=>{
                                        setOpen(false)
                                    }}
                                />

                            </div>
                        </div>
                    </div>

                </Grid>
                <Grid item xs={12}>
                    <div className="myResults_tabing">
                        <Box className="mb-colum"
                            sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%' }}
                        >
                            <Tabs

                                // style={{ minWidth: "230px", maxWidth: "230px" }}
                                orientation="vertical"
                                value={valuenew}
                                onChange={handleChange}
                                aria-label="Vertical tabs"
                                sx={{ borderRight: 1, borderColor: 'divider' }}
                                className="myresults_verticaltabs"
                            >

                                <Tab className="tab_label" onClick={() => handleTabChange(0)}
                                    label={<Fragment><Typography variant="body2" component="span" sx={{ fontWeight: '800', my: 2 }}>{t("sentinel-MyTeams-Results:INDICATORS")} </Typography>
                                        {openTab === 0 && <ul className="tab_listItem">
                                            {[{ name: t(`traits:self-activation-short-name`), key: 'self-activation' },
                                            { name: t(`traits:self-confidence-short-name`), key: 'self-confidence' },
                                            { name: t(`traits:communication-strategy-short-name`), key: 'communication-strategy' },
                                            { name: t(`traits:cooperation-short-name`), key: 'cooperation' },
                                            { name: t(`traits:regularity-short-name`), key: 'regularity' },
                                            { name: t(`traits:motivation-short-name`), key: 'motivation' },
                                            { name: t(`traits:personal-engagement-short-name`), key: 'personal-engagement' }].map(item => {
                                                return <li className={traitDetails?.key == item.key && 'active'} onClick={() => handleBarHandler(item)}><Typography variant="body2" component="span" sx={{ fontWeight: '500' }} className="">{item.name}</Typography></li>
                                            })}
                                        </ul>}
                                    </Fragment>} {...a11yProps(0)} />

                                <Tab className="tab_label" onClick={() => handleTabChange(1)} label={<Fragment>
                                    <Typography variant="body2" component="span" sx={{ fontWeight: '800', my: 2 }}>{t("sentinel-MyTeams-Results:4C")}</Typography>
                                    {openTab === 1 && <ul className="tab_listItem">
                                        {[{ name: t(`traits:communication-short-name`), key: 'communication' },
                                        { name: t(`traits:collaboration-short-name`), key: 'collaboration' },
                                        { name: t(`traits:creativity-short-name`), key: 'creativity' },
                                        { name: t(`traits:critical-thinking-short-name`), key: 'critical-thinking' }].map(item => {
                                            return <li className={traitDetails?.key == item.key && 'active'} onClick={() => handleBarHandler(item)}><Typography variant="body2" component="span" sx={{ fontWeight: '500' }} >{item.name}</Typography></li>
                                        })}
                                    </ul>}</Fragment>} {...a11yProps(1)} />

                                <Tab className="tab_label" onClick={() => handleTabChange(2)} label={<Fragment><Typography variant="body2" component="span" sx={{ fontWeight: '800', my: 2 }}>{t("sentinel-MyTeams-Results:SOCIAL SKILLS")}</Typography>
                                    {openTab === 2 && <ul className="tab_listItem">
                                        {[{ name: t(`traits:emotional-intelligence-in-relation-with-others-short-name`), key: 'emotional-intelligence-in-relation-with-others' },
                                        { name: t(`traits:emotional-intelligence-in-relation-with-oneself-short-name`), key: 'emotional-intelligence-in-relation-with-oneself' },
                                        { name: t(`traits:respect-short-name`), key: 'respect' },
                                        { name: t(`traits:empathy-short-name`), key: 'empathy' }].map(item => {
                                            return <li className={traitDetails?.key == item.key && 'active'} onClick={() => handleBarHandler(item)}><Typography variant="body2" component="span" sx={{ fontWeight: '500' }} >{item.name}</Typography></li>
                                        })}
                                    </ul>}
                                </Fragment>} {...a11yProps(2)} />

                                <Tab className="tab_label" onClick={() => handleTabChange(3)} label={<Fragment><Typography variant="body2" component="span" sx={{ fontWeight: '800', my: 2 }}>{t("sentinel-MyTeams-Results:MANAGEMENT SKILLS")}</Typography>
                                    {openTab === 3 && <ul className="tab_listItem">
                                        {[{ name: t(`traits:leadership-short-name`), key: 'leadership' },
                                        { name: t(`traits:risk-taking-short-name`), key: 'risk-taking' },
                                        { name: t(`traits:stress-management-short-name`), key: 'stress-management' },
                                        { name: t(`traits:emotional-intelligence-global-short-name`), key: 'emotional-intelligence-global' }].map(item => {
                                            return <li className={traitDetails?.key === item.key && 'active'} onClick={() => handleBarHandler(item)}><Typography variant="body2" component="span" sx={{ fontWeight: '500' }} >{item.name}</Typography></li>
                                        })}
                                    </ul>}
                                </Fragment>} {...a11yProps(3)} />
                                <Tab className="tab_statistics" onClick={() => handleTabChange(4)} label={<Typography variant="body2" component="span" sx={{ fontWeight: '800', my: 2 }}>{t("sentinel-MyTeams-Statistics:STATISTICS")}</Typography>}
                                    {...a11yProps(4)} />
                            </Tabs>
                            <Grid item xs={12} sx={{ width: '100%', overflow: 'hidden', height: '100%' }}>
                                <TabPanel value={valuenew} index={0} className="tab_panel">
                                    {
                                        !data ? isNoData() :
                                            <>
                                                {(data && valuenew === 0) &&
                                                    <>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12}>
                                                                <Typography variant="result_title" component="h4" sx={{ pl: 1 }}>{t("sentinel-MyTeams-Results:INDICATORS")}</Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <div className="bar_graph" style={{ borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '420px', }}>
                                                                    {data &&
                                                                        <ResponsiveContainer width='60%' height="80%">
                                                                            <BarChart width={450} height={350} margin={{ top: 10, left: -30 }} legendType={'none'} data={generateObjectArray([...['self-activation', 'self-confidence', 'communication-strategy', 'cooperation', 'regularity'].map((trait) => data[trait])])}>
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
                                                                                            <stop offset={0} stopColor='white' />
                                                                                            <stop offset={getPositionOfNormalizedValue(trait) - 0.02} stopColor={getColor(data[trait].level).color} />
                                                                                            <stop offset={getPositionOfNormalizedValue(trait)} stopColor={new_theme.palette.primary.PinkPurple} height="10px" />
                                                                                            <stop offset={getPositionOfNormalizedValue(trait) + 0.02} stopColor={getColor(data[trait].level).color} />
                                                                                            <stop offset={1} stopColor='white' />
                                                                                        </linearGradient>;
                                                                                    })}
                                                                                </defs>
                                                                                <YAxis ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]} interval={0} domain={[1, 10]} />
                                                                                <Bar dataKey="data" onClick={e => handleBarHandler(e)} barSize={50}>
                                                                                    {['self-activation', 'self-confidence', 'communication-strategy', 'cooperation', 'regularity'].map((trait, index) => <Cell key={`cell-${index}`} fill={`url(#custom-gradient-${index})`} stroke={new_theme.palette.newSupplementary.NSupText} strokeWidth={0.5} width={50} />)}
                                                                                </Bar>
                                                                            </BarChart>
                                                                        </ResponsiveContainer>
                                                                    }
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                {getNadComponent('self-activation')}
                                                                {getNadComponent('self-confidence')}
                                                                {getNadComponent('communication-strategy')}
                                                                {getNadComponent('cooperation')}
                                                                {getNadComponent('regularity')}

                                                                {getTraitComponent('motivation')}
                                                                {getTraitComponent('personal-engagement')}
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                }
                                            </>
                                    }
                                </TabPanel>
                                <TabPanel value={valuenew} index={1} className="tab_panel">
                                    {
                                        !data ? isNoData() :
                                            <>
                                                {(data && valuenew === 1) &&
                                                    <>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12}>
                                                                <Typography variant="result_title" component="h4" sx={{ pl: 1 }}>{t("sentinel-MyTeams-Results:4C")}</Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                {getTraitComponent('communication')}
                                                                {getTraitComponent('collaboration')}
                                                                {getTraitComponent('creativity')}
                                                                {getTraitComponent('critical-thinking')}
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                }
                                            </>
                                    }
                                </TabPanel>
                                <TabPanel value={valuenew} index={2} className="tab_panel">
                                    {
                                        !data ? isNoData() :
                                            <>
                                                {(data && valuenew === 2) &&
                                                    <>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12}>
                                                                <Typography variant="result_title" component="h4" sx={{ pl: 1 }}>{t("sentinel-MyTeams-Results:SOCIAL SKILLS")}</Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                {getTraitComponent('emotional-intelligence-in-relation-with-others')}
                                                                {getTraitComponent('emotional-intelligence-in-relation-with-oneself')}
                                                                {getTraitComponent('respect')}
                                                                {getTraitComponent('empathy')}
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                }
                                            </>
                                    }
                                </TabPanel>
                                <TabPanel value={valuenew} index={3} className="tab_panel">
                                    {
                                        !data ? isNoData() :
                                            <>
                                                {(data && valuenew === 3) &&
                                                    <>
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12}>
                                                                <Typography variant="result_title" component="h4" sx={{ pl: 1 }}>{t("sentinel-MyTeams-Results:MANAGEMENT SKILLS")}</Typography>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                {getTraitComponent('leadership')}
                                                                {getTraitComponent('risk-taking')}
                                                                {getTraitComponent('stress-management')}
                                                                {getTraitComponent('emotional-intelligence-global')}
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                }
                                            </>
                                    }
                                </TabPanel>
                                <TabPanel value={valuenew} index={4} className="tab_panel">
                                    {
                                        !data ? isNoData() :
                                            <>
                                                <Statistics rows={statistics} selectedTeamsId={selectedTeamsId} setSelectedTeamsId={setSelectedTeamsId} />
                                            </>
                                    }
                                </TabPanel>
                            </Grid>
                        </Box>
                    </div>
                </Grid>
            </Container>
        </ThemeProvider >
    )
}